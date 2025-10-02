import { db, initDB, seedLocations } from '../lib/db';
import type { SpectrumData } from '../lib/types';

// Initialize database
initDB();
seedLocations();

// Get all locations
const locations = db.prepare('SELECT id FROM locations').all() as { id: string }[];

// Signal types and their characteristics
const SIGNAL_TYPES = {
  LTE: { baseFreq: 1800, power: -70, bandwidth: 10 },
  WIFI: { baseFreq: 2400, power: -50, bandwidth: 20 },
  FM_RADIO: { baseFreq: 95, power: -40, bandwidth: 0.2 },
  TV: { baseFreq: 500, power: -60, bandwidth: 6 },
  '5G': { baseFreq: 3500, power: -65, bandwidth: 100 },
};

// Anomaly types
const ANOMALY_TYPES = {
  JAMMING: { powerIncrease: 30, description: 'Jamming signal detected' },
  SPIKE: { powerIncrease: 40, description: 'Sudden power spike' },
  ILLEGAL_BROADCAST: { powerIncrease: 20, description: 'Unauthorized broadcast' },
};

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateNormalSignal(locationId: string): SpectrumData {
  const signalType = randomChoice(Object.keys(SIGNAL_TYPES)) as keyof typeof SIGNAL_TYPES;
  const signal = SIGNAL_TYPES[signalType];

  return {
    timestamp: new Date().toISOString(),
    frequency: signal.baseFreq + randomFloat(-5, 5),
    power: signal.power + randomFloat(-10, 10),
    location_id: locationId,
    bandwidth: signal.bandwidth,
    modulation_type: signalType,
  };
}

function generateAnomalySignal(locationId: string): SpectrumData {
  const anomalyType = randomChoice(Object.keys(ANOMALY_TYPES)) as keyof typeof ANOMALY_TYPES;
  const anomaly = ANOMALY_TYPES[anomalyType];
  const baseSignal = generateNormalSignal(locationId);

  return {
    ...baseSignal,
    power: baseSignal.power + anomaly.powerIncrease,
    modulation_type: `${baseSignal.modulation_type}_ANOMALY`,
  };
}

function insertSpectrumData(data: SpectrumData): number {
  const stmt = db.prepare(`
    INSERT INTO spectrum_data (timestamp, frequency, power, location_id, bandwidth, modulation_type)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    data.timestamp,
    data.frequency,
    data.power,
    data.location_id,
    data.bandwidth,
    data.modulation_type
  );

  return result.lastInsertRowid as number;
}

// Generate mock data
function generateMockData(count: number = 50) {
  console.log(`Generating ${count} mock data entries...`);

  for (let i = 0; i < count; i++) {
    const locationId = randomChoice(locations).id;
    const isAnomaly = Math.random() < 0.15; // 15% chance of anomaly

    const data = isAnomaly
      ? generateAnomalySignal(locationId)
      : generateNormalSignal(locationId);

    const dataId = insertSpectrumData(data);

    if (i % 10 === 0) {
      console.log(`Generated ${i + 1}/${count} entries...`);
    }
  }

  console.log('Mock data generation completed!');

  // Print statistics
  const totalCount = db.prepare('SELECT COUNT(*) as count FROM spectrum_data').get() as { count: number };
  console.log(`Total spectrum data entries: ${totalCount.count}`);
}

// Run the generator
const dataCount = process.argv[2] ? parseInt(process.argv[2]) : 50;
generateMockData(dataCount);

// Close database connection
db.close();
