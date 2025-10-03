'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { LocationWithHealth } from '@/lib/types';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

interface RegionHealth {
  region: string;
  score: number;
  count: number;
}

export default function Home() {
  const [locations, setLocations] = useState<LocationWithHealth[]>([]);
  const [regionStats, setRegionStats] = useState<RegionHealth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch('/api/locations?include_health=true');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        const locs = data.data as LocationWithHealth[];
        setLocations(locs);

        // Calculate region-level statistics
        const regionStatsMap: { [key: string]: { totalScore: number; count: number } } = {};

        locs.forEach((loc) => {
          if (loc && loc.region && typeof loc.health_score === 'number') {
            if (!regionStatsMap[loc.region]) {
              regionStatsMap[loc.region] = { totalScore: 0, count: 0 };
            }
            regionStatsMap[loc.region].totalScore += loc.health_score;
            regionStatsMap[loc.region].count += 1;
          }
        });

        const stats: RegionHealth[] = Object.entries(regionStatsMap).map(([region, stats]) => ({
          region,
          score: Math.round(stats.totalScore / stats.count),
          count: stats.count,
        }));

        stats.sort((a, b) => b.score - a.score);
        setRegionStats(stats);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  function getScoreColor(score: number): string {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  }

  function getScoreBgColor(score: number): string {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    if (score >= 50) return 'bg-orange-100';
    return 'bg-red-100';
  }

  function getScoreLabel(score: number): string {
    if (score >= 90) return '좋음';
    if (score >= 70) return '보통';
    if (score >= 50) return '주의';
    return '나쁨';
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const avgScore =
    locations.length > 0
      ? Math.round(locations.reduce((sum, loc) => sum + loc.health_score, 0) / locations.length)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-blue-600">스펙트럼 워치</h1>
              <p className="text-gray-600 text-xs md:text-sm mt-1">우리 동네 전파 환경을 확인하세요</p>
            </div>
            <div className="flex gap-2 md:gap-3">
              <Link
                href="/about"
                className="px-3 md:px-4 py-2 text-sm md:text-base bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition transform hover:scale-105"
              >
                소개
              </Link>
              <Link
                href="/learn"
                className="px-3 md:px-4 py-2 text-sm md:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 transition transform hover:scale-105"
              >
                전파 배우기
              </Link>
              <Link
                href="/admin"
                className="px-3 md:px-4 py-2 text-sm md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
              >
                관리자
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12 fade-in">
          <p className="text-sm text-blue-600 font-medium mb-2">
            KCA 국민참여형 사업예산 제안 공모 출품작 <span className="text-gray-500">(프로토타입)</span>
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            전국 주파수 건강 점수
          </h2>
          <div className="inline-block bg-white rounded-2xl shadow-xl p-8 mb-4 transform transition hover:scale-105">
            <div className={`text-7xl md:text-8xl font-black ${getScoreColor(avgScore)} mb-2`}>
              {avgScore}점
            </div>
            <div className="text-2xl text-gray-600 font-semibold">{getScoreLabel(avgScore)}</div>
          </div>
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
            한국방송통신전파진흥원(KCA)이 실시간으로 모니터링하는 전국 주요 도시의 주파수 환경 상태입니다.
          </p>
        </section>

        {/* Map Section */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-4">지역별 건강 점수 지도</h3>
            <div className="h-[500px]">
              <Map locations={locations} />
            </div>
            <div className="mt-4 flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>좋음 (90-100)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span>보통 (70-89)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <span>주의 (50-69)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span>나쁨 (0-49)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Region Stats */}
        <section className="mb-12 fade-in">
          <h3 className="text-2xl font-bold mb-6">지역별 상세 현황</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {regionStats.map((stat, index) => (
              <div
                key={stat.region}
                className={`${getScoreBgColor(stat.score)} rounded-lg p-6 shadow-lg card-hover`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h4 className="text-xl font-bold text-gray-800">{stat.region}</h4>
                <div className={`text-4xl font-bold mt-2 ${getScoreColor(stat.score)}`}>
                  {stat.score}점
                </div>
                <div className="text-sm text-gray-600 mt-2 font-semibold">{getScoreLabel(stat.score)}</div>
                <div className="text-xs text-gray-500 mt-1">관측소 {stat.count}개</div>
              </div>
            ))}
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-blue-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-4">주파수 건강 점수란?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-lg mb-2">📡 전파 환경 모니터링</h4>
              <p className="text-gray-700">
                한국방송통신전파진흥원(KCA)은 전국의 주요 도시에 관측소를 운영하며,
                24시간 실시간으로 전파 환경을 모니터링하고 있습니다.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">🤖 AI 기반 이상 탐지</h4>
              <p className="text-gray-700">
                인공지능 기술을 활용하여 불법 전파, 재밍 신호 등 이상 신호를 자동으로 탐지하고
                분석합니다.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">📊 건강 점수 산출</h4>
              <p className="text-gray-700">
                최근 24시간 동안 탐지된 이상 신호의 빈도를 기반으로 0-100점 사이의
                건강 점수를 산출합니다.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">🛡️ 깨끗한 전파 환경</h4>
              <p className="text-gray-700">
                KCA는 국민의 안전한 통신 환경을 위해 불법 전파를 단속하고
                전파 질서를 유지합니다.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p className="font-semibold text-blue-600">KCA 국민참여형 사업예산 제안 공모</p>
          <p className="mt-1">© 2025 한국방송통신전파진흥원 (KCA) - 스펙트럼 워치</p>
          <p className="mt-1 text-xs">이 데이터는 시연용 Mock 데이터입니다.</p>
        </footer>
      </main>
    </div>
  );
}
