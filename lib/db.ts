import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'spectrum.db');
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Initialize database schema
export function initDB() {
  // Create spectrum_data table for raw signal data
  db.exec(`
    CREATE TABLE IF NOT EXISTS spectrum_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      frequency REAL NOT NULL,
      power REAL NOT NULL,
      location_id TEXT NOT NULL,
      bandwidth REAL,
      modulation_type TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create analysis_results table for AI analysis
  db.exec(`
    CREATE TABLE IF NOT EXISTS analysis_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spectrum_data_id INTEGER NOT NULL,
      is_anomaly BOOLEAN NOT NULL,
      anomaly_type TEXT,
      confidence_score REAL NOT NULL,
      reasoning TEXT,
      analyzed_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (spectrum_data_id) REFERENCES spectrum_data(id)
    )
  `);

  // Create locations table for monitoring stations
  db.exec(`
    CREATE TABLE IF NOT EXISTS locations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      region TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_spectrum_timestamp ON spectrum_data(timestamp);
    CREATE INDEX IF NOT EXISTS idx_spectrum_location ON spectrum_data(location_id);
    CREATE INDEX IF NOT EXISTS idx_analysis_anomaly ON analysis_results(is_anomaly);
    CREATE INDEX IF NOT EXISTS idx_analysis_spectrum ON analysis_results(spectrum_data_id);
  `);

  console.log('Database initialized successfully');
}

// Initialize seed locations (major cities in South Korea)
export function seedLocations() {
  const locations = [
    { id: 'seoul-01', name: '서울 강남 관측소', latitude: 37.4979, longitude: 127.0276, region: '서울' },
    { id: 'seoul-02', name: '서울 종로 관측소', latitude: 37.5709, longitude: 126.9910, region: '서울' },
    { id: 'busan-01', name: '부산 해운대 관측소', latitude: 35.1586, longitude: 129.1604, region: '부산' },
    { id: 'incheon-01', name: '인천 송도 관측소', latitude: 37.3890, longitude: 126.6432, region: '인천' },
    { id: 'daegu-01', name: '대구 수성 관측소', latitude: 35.8577, longitude: 128.6311, region: '대구' },
    { id: 'daejeon-01', name: '대전 유성 관측소', latitude: 36.3620, longitude: 127.3561, region: '대전' },
    { id: 'gwangju-01', name: '광주 북구 관측소', latitude: 35.1547, longitude: 126.9156, region: '광주' },
    { id: 'ulsan-01', name: '울산 남구 관측소', latitude: 35.5384, longitude: 129.3114, region: '울산' },
  ];

  const insertLocation = db.prepare(`
    INSERT OR IGNORE INTO locations (id, name, latitude, longitude, region)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const loc of locations) {
    insertLocation.run(loc.id, loc.name, loc.latitude, loc.longitude, loc.region);
  }

  console.log('Seed locations inserted successfully');
}

export { db };
