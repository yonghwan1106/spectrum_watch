'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Stats {
  totalLocations: number;
  totalAnomalies: number;
  avgHealthScore: number;
  criticalLocations: number;
}

export default function ReportsPage() {
  const [stats, setStats] = useState<Stats>({
    totalLocations: 0,
    totalAnomalies: 0,
    avgHealthScore: 0,
    criticalLocations: 0,
  });

  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [frequencyData, setFrequencyData] = useState<any[]>([]);
  const [regionData, setRegionData] = useState<any[]>([]);
  const [anomalyTypesData, setAnomalyTypesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    try {
      const [locationsRes, anomaliesRes, timelineRes, frequencyRes, regionRes, typesRes] =
        await Promise.all([
          fetch('/api/locations?include_health=true'),
          fetch('/api/anomalies?limit=1000'),
          fetch('/api/statistics?type=timeline'),
          fetch('/api/statistics?type=frequency_band'),
          fetch('/api/statistics?type=region'),
          fetch('/api/statistics?type=anomaly_types'),
        ]);

      // Locations stats
      if (locationsRes.ok) {
        const data = await locationsRes.json();
        if (data.success && Array.isArray(data.data)) {
          const locations = data.data;
          const avgScore =
            locations.length > 0
              ? Math.round(
                  locations.reduce((sum: number, loc: any) => sum + loc.health_score, 0) /
                    locations.length
                )
              : 0;
          const critical = locations.filter((loc: any) => loc.health_score < 70).length;

          setStats((prev) => ({
            ...prev,
            totalLocations: locations.length,
            avgHealthScore: avgScore,
            criticalLocations: critical,
          }));
        }
      }

      // Anomalies stats
      if (anomaliesRes.ok) {
        const data = await anomaliesRes.json();
        if (data.success && Array.isArray(data.data)) {
          setStats((prev) => ({
            ...prev,
            totalAnomalies: data.data.length,
          }));
        }
      }

      // Charts data
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

      if (typesRes.ok) {
        const data = await typesRes.json();
        if (data.success) setAnomalyTypesData(data.data);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  }

  function downloadReport(format: 'json' | 'csv') {
    const reportData = {
      generated_at: new Date().toISOString(),
      summary: stats,
      timeline: timelineData,
      frequency_bands: frequencyData,
      regions: regionData,
      anomaly_types: anomalyTypesData,
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spectrum-watch-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } else {
      // CSV format
      let csv = 'Spectrum Watch Report\n';
      csv += `Generated: ${new Date().toLocaleString('ko-KR')}\n\n`;
      csv += 'Summary Statistics\n';
      csv += 'Metric,Value\n';
      csv += `Total Locations,${stats.totalLocations}\n`;
      csv += `Total Anomalies (24h),${stats.totalAnomalies}\n`;
      csv += `Average Health Score,${stats.avgHealthScore}\n`;
      csv += `Critical Locations,${stats.criticalLocations}\n\n`;

      csv += 'Region Statistics\n';
      csv += 'Region,Anomaly Count,Health Score\n';
      regionData.forEach((row) => {
        csv += `${row.region},${row.anomaly_count},${row.health_score}\n`;
      });

      csv += '\nAnomaly Types\n';
      csv += 'Type,Count,Avg Confidence\n';
      anomalyTypesData.forEach((row) => {
        csv += `${row.type},${row.count},${(row.avg_confidence * 100).toFixed(1)}%\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spectrum-watch-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  }

  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <p className="text-blue-100 text-sm">KCA 국민참여형 사업예산 제안 공모</p>
          <h1 className="text-3xl font-bold mt-1">통계 및 리포트</h1>
          <p className="text-blue-100 mt-1">전파 환경 종합 분석 보고서</p>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 underline">
            ← 관리자 대시보드로 돌아가기
          </Link>
          <div className="flex gap-3">
            <button
              onClick={() => downloadReport('json')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              📥 JSON 다운로드
            </button>
            <button
              onClick={() => downloadReport('csv')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              📊 CSV 다운로드
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-4">요약 통계</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 text-sm font-semibold">총 관측소</h3>
              <p className="text-4xl font-bold text-blue-600 mt-2">{stats.totalLocations}</p>
              <p className="text-xs text-gray-500 mt-2">전국 주요 도시</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 text-sm font-semibold">이상 신호 (24시간)</h3>
              <p className="text-4xl font-bold text-red-600 mt-2">{stats.totalAnomalies}</p>
              <p className="text-xs text-gray-500 mt-2">최근 24시간 탐지</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 text-sm font-semibold">평균 건강 점수</h3>
              <p className="text-4xl font-bold text-green-600 mt-2">{stats.avgHealthScore}</p>
              <p className="text-xs text-gray-500 mt-2">전국 평균</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 text-sm font-semibold">위험 관측소</h3>
              <p className="text-4xl font-bold text-orange-600 mt-2">{stats.criticalLocations}</p>
              <p className="text-xs text-gray-500 mt-2">건강 점수 70 미만</p>
            </div>
          </div>
        </section>

        {/* Timeline Chart */}
        <section className="mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">이상 신호 발생 추이 (24시간)</h2>
            <ResponsiveContainer width="100%" height={350}>
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
                  strokeWidth={3}
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
        </section>

        {/* Frequency and Types */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Frequency Band Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">주파수 대역별 분석</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={frequencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="band" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="anomaly_count" fill="#ef4444" name="이상 신호" />
                <Bar dataKey="total_count" fill="#3b82f6" name="전체 신호" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Anomaly Types Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">이상 신호 유형별 분포</h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={anomalyTypesData}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.type} (${entry.count})`}
                >
                  {anomalyTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Region Table */}
        <section className="mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">지역별 상세 분석</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300">
                    <th className="px-4 py-3 text-left font-semibold">지역</th>
                    <th className="px-4 py-3 text-right font-semibold">이상 신호</th>
                    <th className="px-4 py-3 text-right font-semibold">전체 신호</th>
                    <th className="px-4 py-3 text-right font-semibold">건강 점수</th>
                    <th className="px-4 py-3 text-right font-semibold">이상률</th>
                  </tr>
                </thead>
                <tbody>
                  {regionData.map((region, index) => {
                    const anomalyRate =
                      region.total_count > 0
                        ? ((region.anomaly_count / region.total_count) * 100).toFixed(1)
                        : '0.0';
                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold">{region.region}</td>
                        <td className="px-4 py-3 text-right text-red-600 font-semibold">
                          {region.anomaly_count}
                        </td>
                        <td className="px-4 py-3 text-right">{region.total_count}</td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`font-semibold ${
                              region.health_score >= 90
                                ? 'text-green-600'
                                : region.health_score >= 70
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}
                          >
                            {region.health_score}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">{anomalyRate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Anomaly Types Table */}
        <section className="mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">이상 신호 유형별 통계</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300">
                    <th className="px-4 py-3 text-left font-semibold">유형</th>
                    <th className="px-4 py-3 text-right font-semibold">탐지 건수</th>
                    <th className="px-4 py-3 text-right font-semibold">평균 신뢰도</th>
                    <th className="px-4 py-3 text-right font-semibold">비율</th>
                  </tr>
                </thead>
                <tbody>
                  {anomalyTypesData.map((type, index) => {
                    const totalCount = anomalyTypesData.reduce(
                      (sum, item) => sum + item.count,
                      0
                    );
                    const percentage = ((type.count / totalCount) * 100).toFixed(1);
                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold">{type.type}</td>
                        <td className="px-4 py-3 text-right">{type.count}</td>
                        <td className="px-4 py-3 text-right">
                          {(type.avg_confidence * 100).toFixed(1)}%
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">{percentage}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Report Info */}
        <section className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
          <h2 className="text-xl font-bold mb-4 text-blue-600">📄 보고서 정보</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong>생성 일시:</strong> {new Date().toLocaleString('ko-KR')}
            </p>
            <p>
              <strong>분석 기간:</strong> 최근 24시간
            </p>
            <p>
              <strong>데이터 출처:</strong> KCA 전국 전파 관측소 네트워크
            </p>
            <p>
              <strong>분석 방법:</strong> AI 기반 실시간 이상 신호 탐지 시스템 (Claude Sonnet 4.5)
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 mt-12 py-6 text-center text-gray-600 text-sm">
        <p className="font-semibold text-blue-600">KCA 국민참여형 사업예산 제안 공모</p>
        <p className="mt-1">© 2025 한국방송통신전파진흥원 (KCA) - 스펙트럼 워치</p>
      </footer>
    </div>
  );
}
