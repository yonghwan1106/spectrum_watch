'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { LocationWithHealth } from '@/lib/types';

// Dynamically import Map component (no SSR for Leaflet)
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

interface Anomaly {
  analysis_id: number;
  anomaly_type: string;
  confidence_score: number;
  reasoning: string;
  timestamp: string;
  frequency: number;
  power: number;
  location_name: string;
  region: string;
}

export default function AdminDashboard() {
  const [locations, setLocations] = useState<LocationWithHealth[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Chart data states
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [frequencyData, setFrequencyData] = useState<any[]>([]);
  const [regionData, setRegionData] = useState<any[]>([]);

  // For detecting new anomalies
  const previousAnomalyCount = useRef<number>(0);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedAnomalyType, setSelectedAnomalyType] = useState<string>('all');

  useEffect(() => {
    fetchData();
    fetchChartData();
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchData();
      fetchChartData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    try {
      const [locationsRes, anomaliesRes] = await Promise.all([
        fetch('/api/locations?include_health=true'),
        fetch('/api/anomalies?limit=20'),
      ]);

      if (!locationsRes.ok || !anomaliesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const locationsData = await locationsRes.json();
      const anomaliesData = await anomaliesRes.json();

      if (locationsData.success && Array.isArray(locationsData.data)) {
        setLocations(locationsData.data);
      }

      if (anomaliesData.success && Array.isArray(anomaliesData.data)) {
        const newAnomalies = anomaliesData.data;
        setAnomalies(newAnomalies);

        // Check for new anomalies and show toast
        if (previousAnomalyCount.current > 0 && newAnomalies.length > previousAnomalyCount.current) {
          const newCount = newAnomalies.length - previousAnomalyCount.current;
          const latestAnomaly = newAnomalies[0];

          toast.error(
            `🚨 새로운 이상 신호 ${newCount}건 탐지!\n${latestAnomaly.location_name} - ${latestAnomaly.anomaly_type}`,
            {
              duration: 5000,
              position: 'top-right',
              icon: '⚠️',
            }
          );
        }

        previousAnomalyCount.current = newAnomalies.length;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchChartData() {
    try {
      const [timelineRes, frequencyRes, regionRes] = await Promise.all([
        fetch('/api/statistics?type=timeline'),
        fetch('/api/statistics?type=frequency_band'),
        fetch('/api/statistics?type=region'),
      ]);

      if (timelineRes.ok) {
        const data = await timelineRes.json();
        if (data.success) setTimelineData(data.data);
      }

      if (frequencyRes.ok) {
        const data = await frequencyRes.json();
        if (data.success) setFrequencyData(data.data);
      }

      if (regionRes.ok) {
        const data = await regionRes.json();
        if (data.success) setRegionData(data.data);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  }

  const handleLocationClick = (locationId: string) => {
    setSelectedLocation(locationId);
  };

  // Apply all filters
  const filteredAnomalies = anomalies.filter((anomaly) => {
    // Location filter
    if (selectedLocation && (anomaly as any).location_id !== selectedLocation) {
      return false;
    }

    // Region filter
    if (selectedRegion !== 'all' && anomaly.region !== selectedRegion) {
      return false;
    }

    // Anomaly type filter
    if (selectedAnomalyType !== 'all' && anomaly.anomaly_type !== selectedAnomalyType) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        anomaly.location_name.toLowerCase().includes(query) ||
        anomaly.anomaly_type?.toLowerCase().includes(query) ||
        anomaly.reasoning?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Get unique regions and anomaly types for filters
  const uniqueRegions = Array.from(new Set(anomalies.map((a) => a.region))).sort();
  const uniqueAnomalyTypes = Array.from(
    new Set(anomalies.map((a) => a.anomaly_type).filter(Boolean))
  ).sort();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-center lg:text-left">
              <p className="text-blue-100 text-xs md:text-sm">KCA 국민참여형 사업예산 제안 공모</p>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mt-1">스펙트럼 워치 관리자 대시보드</h1>
              <p className="text-blue-100 text-xs md:text-sm mt-1">실시간 주파수 이상 신호 모니터링</p>
            </div>
            <div className="flex gap-2 md:gap-3">
              <Link
                href="/"
                className="px-3 md:px-4 py-2 text-sm md:text-base bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition transform hover:scale-105"
              >
                홈으로
              </Link>
              <Link
                href="/reports"
                className="px-3 md:px-4 py-2 text-sm md:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 transition transform hover:scale-105"
              >
                📊 통계
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 fade-in">
          <div className="bg-white p-6 rounded-lg shadow-lg card-hover border-l-4 border-blue-500">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">총 관측소</h3>
            <p className="text-4xl font-bold text-blue-600">{locations.length}</p>
            <p className="text-xs text-gray-500 mt-2">전국 실시간 모니터링</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg card-hover border-l-4 border-red-500">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">이상 신호 (24시간)</h3>
            <p className="text-4xl font-bold text-red-600">{anomalies.length}</p>
            <p className="text-xs text-gray-500 mt-2">최근 24시간 탐지</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg card-hover border-l-4 border-green-500">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">평균 건강 점수</h3>
            <p className="text-4xl font-bold text-green-600">
              {locations.length > 0
                ? Math.round(
                    locations.reduce((sum, loc) => sum + loc.health_score, 0) / locations.length
                  )
                : 0}
            </p>
            <p className="text-xs text-gray-500 mt-2">전국 평균</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg card-hover border-l-4 border-orange-500">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">위험 관측소</h3>
            <p className="text-4xl font-bold text-orange-600">
              {locations.filter((loc) => loc.health_score < 70).length}
            </p>
            <p className="text-xs text-gray-500 mt-2">점수 70 미만</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 fade-in">
          {/* Timeline Chart */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg card-hover">
            <h2 className="text-lg md:text-xl font-bold mb-4">이상 신호 발생 추이 (24시간)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getHours()}시`;
                  }}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => new Date(value as string).toLocaleString('ko-KR')}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="anomaly_count"
                  stroke="#ef4444"
                  name="이상 신호"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="total_count"
                  stroke="#3b82f6"
                  name="전체 신호"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Frequency Band Chart */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg card-hover">
            <h2 className="text-lg md:text-xl font-bold mb-4">주파수 대역별 이상 신호</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={frequencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="band" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="anomaly_count" fill="#ef4444" name="이상 신호" />
                <Bar dataKey="total_count" fill="#3b82f6" name="전체 신호" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Region Chart */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg mb-6 card-hover fade-in">
          <h2 className="text-lg md:text-xl font-bold mb-4">지역별 비교</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="region" type="category" width={80} />
              <Tooltip />
              <Legend />
              <Bar dataKey="anomaly_count" fill="#ef4444" name="이상 신호" />
              <Bar dataKey="health_score" fill="#22c55e" name="건강 점수" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Map and Anomalies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 fade-in">
          {/* Map */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg card-hover">
            <h2 className="text-lg md:text-xl font-bold mb-4">관측소 현황 지도</h2>
            <div className="h-[500px]">
              <Map locations={locations} onLocationClick={handleLocationClick} />
            </div>
            {selectedLocation && (
              <button
                onClick={() => setSelectedLocation(null)}
                className="mt-4 text-blue-600 hover:text-blue-800 underline"
              >
                전체 보기
              </button>
            )}
          </div>

          {/* Anomalies List */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg card-hover">
            <h2 className="text-lg md:text-xl font-bold mb-4">
              최근 이상 신호 알림 {selectedLocation && '(필터링됨)'}
            </h2>

            {/* Filters */}
            <div className="mb-4 space-y-2">
              {/* Search */}
              <input
                type="text"
                placeholder="🔍 검색 (위치, 유형, 설명...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

              {/* Filters Row */}
              <div className="grid grid-cols-2 gap-2">
                {/* Region Filter */}
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">전체 지역</option>
                  {uniqueRegions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>

                {/* Anomaly Type Filter */}
                <select
                  value={selectedAnomalyType}
                  onChange={(e) => setSelectedAnomalyType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">전체 유형</option>
                  {uniqueAnomalyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Filters Info */}
              {(searchQuery || selectedRegion !== 'all' || selectedAnomalyType !== 'all') && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {filteredAnomalies.length}건 검색됨 (총 {anomalies.length}건)
                  </span>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedRegion('all');
                      setSelectedAnomalyType('all');
                    }}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    필터 초기화
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {filteredAnomalies.length === 0 ? (
                <p className="text-gray-500 text-center py-8">이상 신호가 없습니다.</p>
              ) : (
                filteredAnomalies.map((anomaly) => (
                  <Link
                    key={anomaly.analysis_id}
                    href={`/anomaly/${anomaly.analysis_id}`}
                    className="block border-l-4 border-red-500 bg-red-50 p-3 rounded hover:bg-red-100 transition cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-red-800">
                          {anomaly.anomaly_type || 'Unknown'}
                        </h3>
                        <p className="text-sm text-gray-700">{anomaly.location_name}</p>
                      </div>
                      <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
                        신뢰도 {Math.round(anomaly.confidence_score * 100)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{anomaly.reasoning}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-600">
                      <div>주파수: {anomaly.frequency.toFixed(2)} MHz</div>
                      <div>신호세기: {anomaly.power.toFixed(2)} dBm</div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(anomaly.timestamp).toLocaleString('ko-KR')}
                    </p>
                    <p className="text-xs text-blue-600 mt-2 font-semibold">→ 상세 보기</p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
