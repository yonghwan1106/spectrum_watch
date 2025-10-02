// Core data types
export interface SpectrumData {
  id?: number;
  timestamp: string;
  frequency: number;
  power: number;
  location_id: string;
  bandwidth?: number;
  modulation_type?: string;
  created_at?: string;
}

export interface AnalysisResult {
  id?: number;
  spectrum_data_id: number;
  is_anomaly: boolean;
  anomaly_type?: string;
  confidence_score: number;
  reasoning?: string;
  analyzed_at?: string;
}

export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  region: string;
  created_at?: string;
}

// UI/Display types
export interface LocationWithHealth extends Location {
  health_score: number;
  anomaly_count: number;
  last_check?: string;
}

export interface AnomalyEvent {
  id: number;
  timestamp: string;
  location: Location;
  spectrum_data: SpectrumData;
  analysis: AnalysisResult;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface HealthScoreData {
  region: string;
  score: number;
  anomaly_count: number;
  total_checks: number;
}
