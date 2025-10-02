// In-memory data store for Vercel serverless environment
// This replaces SQLite which doesn't work in serverless environments

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  region: string;
}

interface SpectrumData {
  id: number;
  timestamp: string;
  frequency: number;
  power: number;
  location_id: string;
  bandwidth: number;
  modulation_type: string;
}

interface AnalysisResult {
  id: number;
  spectrum_data_id: number;
  is_anomaly: number;
  anomaly_type: string | null;
  confidence_score: number;
  reasoning: string;
  analyzed_at: string;
}

// In-memory data storage
let locations: Location[] = [];
let spectrumData: SpectrumData[] = [];
let analysisResults: AnalysisResult[] = [];
let dataInitialized = false;

// Initialize data
export function initDB() {
  if (dataInitialized) return;

  // Seed locations
  locations = [
    { id: 'seoul-01', name: '서울 강남 관측소', latitude: 37.4979, longitude: 127.0276, region: '서울' },
    { id: 'busan-01', name: '부산 해운대 관측소', latitude: 35.1584, longitude: 129.1603, region: '부산' },
    { id: 'incheon-01', name: '인천 송도 관측소', latitude: 37.3894, longitude: 126.6431, region: '인천' },
    { id: 'daegu-01', name: '대구 수성구 관측소', latitude: 35.8583, longitude: 128.6311, region: '대구' },
    { id: 'daejeon-01', name: '대전 유성구 관측소', latitude: 36.3621, longitude: 127.3571, region: '대전' },
    { id: 'gwangju-01', name: '광주 북구 관측소', latitude: 35.1740, longitude: 126.9118, region: '광주' },
    { id: 'ulsan-01', name: '울산 남구 관측소', latitude: 35.5384, longitude: 129.3114, region: '울산' },
  ];

  // Generate mock spectrum data
  const signalTypes = [
    { name: 'LTE', freqRange: [1700, 1900], power: [-80, -40] },
    { name: 'WiFi', freqRange: [2400, 2500], power: [-70, -30] },
    { name: 'FM Radio', freqRange: [88, 108], power: [-60, -20] },
    { name: '5G', freqRange: [3400, 3600], power: [-75, -35] },
  ];

  let spectrumId = 1;
  let analysisId = 1;

  for (let i = 0; i < 100; i++) {
    const location = locations[Math.floor(Math.random() * locations.length)];
    const signalType = signalTypes[Math.floor(Math.random() * signalTypes.length)];
    const frequency = signalType.freqRange[0] + Math.random() * (signalType.freqRange[1] - signalType.freqRange[0]);
    const power = signalType.power[0] + Math.random() * (signalType.power[1] - signalType.power[0]);
    const timestamp = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString();

    const spectrum: SpectrumData = {
      id: spectrumId,
      timestamp,
      frequency,
      power,
      location_id: location.id,
      bandwidth: 5 + Math.random() * 15,
      modulation_type: signalType.name,
    };

    spectrumData.push(spectrum);

    // 15% chance of anomaly
    const isAnomaly = Math.random() < 0.15;
    const anomalyTypes = ['Jamming', 'Spike', 'Unknown Signal', 'Illegal Broadcasting'];

    const analysis: AnalysisResult = {
      id: analysisId,
      spectrum_data_id: spectrumId,
      is_anomaly: isAnomaly ? 1 : 0,
      anomaly_type: isAnomaly ? anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)] : null,
      confidence_score: isAnomaly ? 0.7 + Math.random() * 0.3 : 0.9 + Math.random() * 0.1,
      reasoning: isAnomaly ? `Detected ${anomalyTypes[0]} signal with unusual characteristics` : 'Normal signal pattern detected',
      analyzed_at: new Date().toISOString(),
    };

    analysisResults.push(analysis);

    spectrumId++;
    analysisId++;
  }

  dataInitialized = true;
  console.log('Mock data initialized successfully');
}

// Mock database API
export const db = {
  prepare: (sql: string) => {
    return {
      all: (...params: any[]) => {
        initDB();

        // Parse SQL to return appropriate data
        if (sql.includes('FROM locations')) {
          return locations;
        }

        if (sql.includes('FROM analysis_results') && sql.includes('is_anomaly = 1')) {
          const limit = sql.match(/LIMIT (\d+)/)?.[1] || '20';
          return analysisResults
            .filter(a => a.is_anomaly === 1)
            .map(a => {
              const spectrum = spectrumData.find(s => s.id === a.spectrum_data_id);
              const location = locations.find(l => l.id === spectrum?.location_id);
              return {
                analysis_id: a.id,
                anomaly_type: a.anomaly_type,
                confidence_score: a.confidence_score,
                reasoning: a.reasoning,
                timestamp: spectrum?.timestamp,
                frequency: spectrum?.frequency,
                power: spectrum?.power,
                location_name: location?.name,
                region: location?.region,
              };
            })
            .slice(0, parseInt(limit));
        }

        if (sql.includes('strftime') && sql.includes('hour')) {
          // Timeline data
          const hours: any = {};
          spectrumData.forEach(s => {
            const hour = new Date(s.timestamp).toISOString().slice(0, 13) + ':00:00';
            if (!hours[hour]) hours[hour] = { hour, anomaly_count: 0, total_count: 0 };
            hours[hour].total_count++;
            const analysis = analysisResults.find(a => a.spectrum_data_id === s.id);
            if (analysis?.is_anomaly) hours[hour].anomaly_count++;
          });
          return Object.values(hours).sort((a: any, b: any) => a.hour.localeCompare(b.hour));
        }

        if (sql.includes('frequency_band')) {
          // Frequency band data
          const bands: any = {};
          spectrumData.forEach(s => {
            let band = 'Other';
            if (s.frequency < 100) band = 'FM Radio (88-108 MHz)';
            else if (s.frequency >= 500 && s.frequency < 700) band = 'TV (500-600 MHz)';
            else if (s.frequency >= 1700 && s.frequency < 1900) band = 'LTE (1800 MHz)';
            else if (s.frequency >= 2300 && s.frequency < 2500) band = 'Wi-Fi (2.4 GHz)';
            else if (s.frequency >= 3400 && s.frequency < 3600) band = '5G (3.5 GHz)';

            if (!bands[band]) bands[band] = { band, anomaly_count: 0, total_count: 0, avg_power: 0 };
            bands[band].total_count++;
            const analysis = analysisResults.find(a => a.spectrum_data_id === s.id);
            if (analysis?.is_anomaly) bands[band].anomaly_count++;
          });
          return Object.values(bands);
        }

        if (sql.includes('l.region') && sql.includes('GROUP BY')) {
          // Region data
          const regions: any = {};
          locations.forEach(loc => {
            const locData = spectrumData.filter(s => s.location_id === loc.id);
            const anomalyCount = locData.filter(s => {
              const analysis = analysisResults.find(a => a.spectrum_data_id === s.id);
              return analysis?.is_anomaly === 1;
            }).length;

            regions[loc.region] = {
              region: loc.region,
              anomaly_count: anomalyCount,
              total_count: locData.length,
              health_score: Math.round(100 - (anomalyCount / (locData.length || 1)) * 100),
            };
          });
          return Object.values(regions);
        }

        if (sql.includes('anomaly_types')) {
          // Anomaly types data
          const types: any = {};
          analysisResults.filter(a => a.is_anomaly === 1).forEach(a => {
            const type = a.anomaly_type || 'Unknown';
            if (!types[type]) types[type] = { type, count: 0, avg_confidence: 0, sum: 0 };
            types[type].count++;
            types[type].sum += a.confidence_score;
          });
          return Object.values(types).map((t: any) => ({
            type: t.type,
            count: t.count,
            avg_confidence: t.sum / t.count,
          }));
        }

        return [];
      },
      get: (...params: any[]) => {
        initDB();

        if (sql.includes('FROM analysis_results') && sql.includes('WHERE a.id = ?')) {
          const id = params[0];
          const analysis = analysisResults.find(a => a.id === parseInt(id));
          if (!analysis) return null;

          const spectrum = spectrumData.find(s => s.id === analysis.spectrum_data_id);
          const location = locations.find(l => l.id === spectrum?.location_id);

          return {
            analysis_id: analysis.id,
            spectrum_data_id: analysis.spectrum_data_id,
            is_anomaly: analysis.is_anomaly,
            anomaly_type: analysis.anomaly_type,
            confidence_score: analysis.confidence_score,
            reasoning: analysis.reasoning,
            analyzed_at: analysis.analyzed_at,
            frequency: spectrum?.frequency,
            power: spectrum?.power,
            bandwidth: spectrum?.bandwidth,
            timestamp: spectrum?.timestamp,
            location_id: location?.id,
            location_name: location?.name,
            region: location?.region,
            latitude: location?.latitude,
            longitude: location?.longitude,
          };
        }

        if (sql.includes('FROM spectrum_data') && sql.includes('location_id')) {
          return spectrumData[0];
        }

        return null;
      },
      run: (...params: any[]) => {
        // Mock insert/update
        return { lastInsertRowid: Math.floor(Math.random() * 10000) };
      },
    };
  },
  exec: (sql: string) => {
    // Mock schema creation
    console.log('Schema initialized (mock)');
  },
};

// Auto-initialize on import
initDB();
