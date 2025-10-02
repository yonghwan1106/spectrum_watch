'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnomalyDetail {
  analysis_id: number;
  spectrum_data_id: number;
  is_anomaly: boolean;
  anomaly_type: string;
  confidence_score: number;
  reasoning: string;
  analyzed_at: string;
  frequency: number;
  power: number;
  bandwidth: number;
  timestamp: string;
  location_id: string;
  location_name: string;
  region: string;
  latitude: number;
  longitude: number;
}

interface HistoricalData {
  timestamp: string;
  frequency: number;
  power: number;
  is_anomaly: boolean;
}

export default function AnomalyDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [anomaly, setAnomaly] = useState<AnomalyDetail | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchAnomalyDetail();
      fetchHistoricalData();
    }
  }, [id]);

  async function fetchAnomalyDetail() {
    try {
      const response = await fetch(`/api/anomalies/${id}`);

      if (!response.ok) {
        throw new Error('이상 신호를 찾을 수 없습니다.');
      }

      const data = await response.json();

      if (data.success) {
        setAnomaly(data.data);
      } else {
        throw new Error(data.error || '데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchHistoricalData() {
    try {
      const response = await fetch(`/api/anomalies/${id}/history`);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setHistoricalData(data.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch historical data:', err);
    }
  }

  function getSeverityColor(confidence: number): string {
    if (confidence >= 0.9) return 'text-red-600';
    if (confidence >= 0.7) return 'text-orange-600';
    if (confidence >= 0.5) return 'text-yellow-600';
    return 'text-gray-600';
  }

  function getSeverityBg(confidence: number): string {
    if (confidence >= 0.9) return 'bg-red-50 border-red-500';
    if (confidence >= 0.7) return 'bg-orange-50 border-orange-500';
    if (confidence >= 0.5) return 'bg-yellow-50 border-yellow-500';
    return 'bg-gray-50 border-gray-500';
  }

  function getSeverityLabel(confidence: number): string {
    if (confidence >= 0.9) return '매우 높음';
    if (confidence >= 0.7) return '높음';
    if (confidence >= 0.5) return '보통';
    return '낮음';
  }

  function getFrequencyBand(frequency: number): string {
    if (frequency < 100) return 'FM Radio (88-108 MHz)';
    if (frequency >= 500 && frequency < 700) return 'TV Broadcasting (500-600 MHz)';
    if (frequency >= 1700 && frequency < 1900) return 'LTE Band (1800 MHz)';
    if (frequency >= 2300 && frequency < 2500) return 'Wi-Fi (2.4 GHz)';
    if (frequency >= 3400 && frequency < 3600) return '5G (3.5 GHz)';
    return 'Other';
  }

  function getAnomalyTypeDescription(type: string): { title: string; description: string; risks: string[] } {
    const types: { [key: string]: { title: string; description: string; risks: string[] } } = {
      'Jamming': {
        title: '재밍 (Jamming)',
        description: '의도적으로 특정 주파수를 방해하는 공격입니다. 강한 신호로 정상 통신을 마비시킵니다.',
        risks: ['GPS 교란', '통신 두절', '항공/선박 안전 위협', '긴급구조 방해']
      },
      'Spike': {
        title: '스파이크 (Spike)',
        description: '짧은 시간 동안 비정상적으로 강한 신호가 발생하는 현상입니다.',
        risks: ['일시적 통신 장애', '수신 품질 저하', '간헐적 연결 끊김']
      },
      'Unknown Signal': {
        title: '미확인 신호 (Unknown Signal)',
        description: '정체를 알 수 없는 새로운 유형의 신호입니다. 추가 분석이 필요합니다.',
        risks: ['불법 장치 가능성', '보안 위협', '정규 서비스 간섭']
      },
      'Illegal Broadcasting': {
        title: '불법 방송 (Illegal Broadcasting)',
        description: '허가받지 않은 주파수에서 방송하는 불법 행위입니다.',
        risks: ['정규 방송 혼신', '청취자 혼란', '전파 질서 교란']
      },
    };

    return types[type] || {
      title: type,
      description: '알 수 없는 이상 신호 유형입니다.',
      risks: ['추가 분석 필요']
    };
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !anomaly) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">오류</h1>
            <p className="text-gray-700 mb-6">{error || '이상 신호를 찾을 수 없습니다.'}</p>
            <Link href="/admin" className="text-blue-600 hover:text-blue-800 underline">
              관리자 대시보드로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const typeInfo = getAnomalyTypeDescription(anomaly.anomaly_type);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <p className="text-blue-100 text-sm">KCA 국민참여형 사업예산 제안 공모</p>
          <h1 className="text-3xl font-bold mt-1">이상 신호 상세 분석</h1>
          <p className="text-blue-100 mt-1">Analysis ID: #{anomaly.analysis_id}</p>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-6xl">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 underline">
            ← 관리자 대시보드로 돌아가기
          </Link>
        </div>

        {/* Alert Header */}
        <div className={`rounded-lg border-l-4 p-6 mb-6 ${getSeverityBg(anomaly.confidence_score)}`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className={`text-2xl font-bold ${getSeverityColor(anomaly.confidence_score)}`}>
                {typeInfo.title}
              </h2>
              <p className="text-gray-700 mt-2">{typeInfo.description}</p>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${getSeverityColor(anomaly.confidence_score)}`}>
                {Math.round(anomaly.confidence_score * 100)}%
              </div>
              <div className="text-sm text-gray-600 mt-1">
                신뢰도: {getSeverityLabel(anomaly.confidence_score)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Location Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-4 text-blue-600">📍 위치 정보</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">관측소</p>
                <p className="font-semibold text-gray-800">{anomaly.location_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">지역</p>
                <p className="font-semibold text-gray-800">{anomaly.region}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">좌표</p>
                <p className="font-mono text-sm text-gray-800">
                  {anomaly.latitude.toFixed(6)}, {anomaly.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </div>

          {/* Signal Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-4 text-blue-600">📡 신호 정보</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">주파수</p>
                <p className="font-semibold text-gray-800">{anomaly.frequency.toFixed(2)} MHz</p>
                <p className="text-xs text-gray-500">{getFrequencyBand(anomaly.frequency)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">신호 세기</p>
                <p className="font-semibold text-gray-800">{anomaly.power.toFixed(2)} dBm</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">대역폭</p>
                <p className="font-semibold text-gray-800">{anomaly.bandwidth.toFixed(2)} MHz</p>
              </div>
            </div>
          </div>

          {/* Time Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-4 text-blue-600">⏰ 시간 정보</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">탐지 시각</p>
                <p className="font-semibold text-gray-800">
                  {new Date(anomaly.timestamp).toLocaleString('ko-KR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">분석 시각</p>
                <p className="font-semibold text-gray-800">
                  {new Date(anomaly.analyzed_at).toLocaleString('ko-KR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">경과 시간</p>
                <p className="font-semibold text-gray-800">
                  {Math.round((Date.now() - new Date(anomaly.timestamp).getTime()) / 60000)}분 전
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="font-bold text-lg mb-4 text-blue-600">🤖 AI 분석 결과</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800 leading-relaxed">{anomaly.reasoning}</p>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="font-bold text-lg mb-4 text-blue-600">⚠️ 위험 요소</h3>
          <ul className="space-y-2">
            {typeInfo.risks.map((risk, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-500 mt-1">▪</span>
                <span className="text-gray-700">{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Historical Chart */}
        {historicalData.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="font-bold text-lg mb-4 text-blue-600">📊 최근 신호 추이</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(
                      date.getMinutes()
                    ).padStart(2, '0')}`;
                  }}
                />
                <YAxis yAxisId="left" label={{ value: 'Power (dBm)', angle: -90, position: 'insideLeft' }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{ value: 'Frequency (MHz)', angle: 90, position: 'insideRight' }}
                />
                <Tooltip
                  labelFormatter={(value) => new Date(value as string).toLocaleString('ko-KR')}
                  formatter={(value: any, name: string) => {
                    if (name === 'power') return [value.toFixed(2) + ' dBm', '신호 세기'];
                    if (name === 'frequency') return [value.toFixed(2) + ' MHz', '주파수'];
                    return [value, name];
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="power"
                  stroke="#ef4444"
                  name="신호 세기"
                  strokeWidth={2}
                  dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={payload.is_anomaly ? 6 : 3}
                        fill={payload.is_anomaly ? '#dc2626' : '#ef4444'}
                        stroke={payload.is_anomaly ? '#991b1b' : 'none'}
                        strokeWidth={2}
                      />
                    );
                  }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="frequency"
                  stroke="#3b82f6"
                  name="주파수"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600">
              <span className="inline-block w-4 h-4 bg-red-600 rounded-full mr-2"></span>
              큰 점: 이상 신호 탐지
            </div>
          </div>
        )}

        {/* Recommended Actions */}
        <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-6">
          <h3 className="font-bold text-lg mb-4 text-blue-600">✅ 권장 조치 사항</h3>
          <div className="space-y-3">
            {anomaly.confidence_score >= 0.9 && (
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚨</span>
                <div>
                  <p className="font-semibold text-gray-800">긴급 출동 필요</p>
                  <p className="text-sm text-gray-600">
                    매우 높은 신뢰도의 이상 신호입니다. 즉시 현장 출동하여 발생원을 확인하세요.
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <p className="font-semibold text-gray-800">발생원 추적</p>
                <p className="text-sm text-gray-600">
                  이동식 전파 탐지 장비를 활용하여 신호 발생원의 정확한 위치를 파악하세요.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📋</span>
              <div>
                <p className="font-semibold text-gray-800">보고서 작성</p>
                <p className="text-sm text-gray-600">
                  상세 분석 결과를 바탕으로 전파 간섭 보고서를 작성하세요.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚖️</span>
              <div>
                <p className="font-semibold text-gray-800">법적 조치</p>
                <p className="text-sm text-gray-600">
                  불법 전파 사용이 확인되면 전파법에 따라 적절한 법적 조치를 취하세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
