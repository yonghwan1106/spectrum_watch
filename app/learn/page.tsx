'use client';

import Link from 'next/link';

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <p className="text-blue-100 text-sm">KCA 국민참여형 사업예산 제안 공모</p>
          <h1 className="text-3xl font-bold mt-1">전파 환경 교육 센터</h1>
          <p className="text-blue-100 mt-1">전파와 주파수에 대해 알아보세요</p>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
            ← 메인 페이지로 돌아가기
          </Link>
        </div>

        {/* Hero Section */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                전파 환경, 왜 중요할까요?
              </h2>
              <p className="text-gray-700 text-lg mb-4">
                우리는 매일 스마트폰, Wi-Fi, 라디오, TV를 사용합니다. 이 모든 기기들은 <strong>전파</strong>를 통해 통신합니다.
                깨끗한 전파 환경은 안정적인 통신을 위해 필수적입니다.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-800">
                  💡 <strong>한국방송통신전파진흥원(KCA)</strong>은 국민의 안전한 통신 환경을 위해
                  24시간 전파 환경을 모니터링하고 불법 전파를 단속합니다.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">📡</div>
                  <p className="text-blue-600 font-bold text-lg">무선 통신</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Basic Concepts */}
        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-4">📚 기초 개념</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* 전파란? */}
            <div className="bg-white p-6 rounded-lg shadow card-hover">
              <h3 className="text-xl font-bold text-blue-600 mb-3">📡 전파란?</h3>
              <p className="text-gray-700 mb-3">
                전파는 공간을 통해 전달되는 전자기파입니다. 눈에 보이지 않지만 우리 주변에서
                끊임없이 정보를 전달하고 있습니다.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                <li>라디오 방송: 88-108 MHz (FM)</li>
                <li>TV 방송: 470-698 MHz (UHF)</li>
                <li>LTE/5G: 700-3500 MHz</li>
                <li>Wi-Fi: 2.4 GHz, 5 GHz</li>
              </ul>
            </div>

            {/* 주파수란? */}
            <div className="bg-white p-6 rounded-lg shadow card-hover">
              <h3 className="text-xl font-bold text-blue-600 mb-3">🎵 주파수란?</h3>
              <p className="text-gray-700 mb-3">
                주파수는 1초 동안 전파가 진동하는 횟수입니다. 단위는 헤르츠(Hz)를 사용합니다.
              </p>
              <div className="bg-gray-100 p-3 rounded text-sm">
                <p className="font-mono text-gray-800">1 Hz = 1회/초</p>
                <p className="font-mono text-gray-800">1 kHz = 1,000회/초</p>
                <p className="font-mono text-gray-800">1 MHz = 1,000,000회/초</p>
                <p className="font-mono text-gray-800">1 GHz = 1,000,000,000회/초</p>
              </div>
            </div>

            {/* 스펙트럼 */}
            <div className="bg-white p-6 rounded-lg shadow card-hover">
              <h3 className="text-xl font-bold text-blue-600 mb-3">🌈 전파 스펙트럼</h3>
              <p className="text-gray-700 mb-3">
                전파 스펙트럼은 주파수 대역의 집합입니다. 한정된 자원이므로 국가가 관리합니다.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                <li>방송용 주파수</li>
                <li>통신용 주파수</li>
                <li>공공안전용 주파수 (경찰, 소방)</li>
                <li>군사용 주파수</li>
                <li>위성통신용 주파수</li>
              </ul>
            </div>

            {/* 전파 간섭 */}
            <div className="bg-white p-6 rounded-lg shadow card-hover">
              <h3 className="text-xl font-bold text-blue-600 mb-3">⚠️ 전파 간섭</h3>
              <p className="text-gray-700 mb-3">
                전파 간섭은 원하지 않는 신호가 통신을 방해하는 현상입니다.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                <li>불법 전파 발생 장치</li>
                <li>고장난 전자 기기</li>
                <li>의도적인 재밍(jamming) 공격</li>
                <li>다른 국가의 월경 전파</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Anomaly Types */}
        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-4">🚨 이상 신호 유형</h2>
          <div className="space-y-4">
            {/* Jamming */}
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
              <h3 className="text-xl font-bold text-red-600 mb-2">🔴 재밍 (Jamming)</h3>
              <p className="text-gray-700 mb-2">
                의도적으로 특정 주파수를 방해하는 공격입니다. 통신을 마비시킬 수 있어 매우 위험합니다.
              </p>
              <div className="bg-red-50 p-3 rounded text-sm">
                <p className="text-gray-700"><strong>특징:</strong> 매우 강한 신호 세기, 넓은 대역폭</p>
                <p className="text-gray-700"><strong>영향:</strong> GPS 교란, 통신 두절, 항공/선박 안전 위협</p>
                <p className="text-gray-700"><strong>대응:</strong> 즉시 전파감시소에 신고, 발생원 추적</p>
              </div>
            </div>

            {/* Spike */}
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
              <h3 className="text-xl font-bold text-orange-600 mb-2">🟠 스파이크 (Spike)</h3>
              <p className="text-gray-700 mb-2">
                짧은 시간 동안 비정상적으로 강한 신호가 발생하는 현상입니다.
              </p>
              <div className="bg-orange-50 p-3 rounded text-sm">
                <p className="text-gray-700"><strong>특징:</strong> 순간적으로 높은 전력, 불규칙한 발생</p>
                <p className="text-gray-700"><strong>원인:</strong> 고장난 전자기기, 산업용 장비, 낙뢰</p>
                <p className="text-gray-700"><strong>영향:</strong> 일시적 통신 장애, 수신 품질 저하</p>
              </div>
            </div>

            {/* Unknown Signal */}
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
              <h3 className="text-xl font-bold text-yellow-600 mb-2">🟡 미확인 신호 (Unknown Signal)</h3>
              <p className="text-gray-700 mb-2">
                정체를 알 수 없는 새로운 유형의 신호입니다.
              </p>
              <div className="bg-yellow-50 p-3 rounded text-sm">
                <p className="text-gray-700"><strong>특징:</strong> 기존 패턴과 다른 신호 특성</p>
                <p className="text-gray-700"><strong>원인:</strong> 신규 장비, 불법 장치, 실험 신호</p>
                <p className="text-gray-700"><strong>대응:</strong> 정밀 분석, 발생원 파악, 합법성 확인</p>
              </div>
            </div>

            {/* Illegal Broadcasting */}
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
              <h3 className="text-xl font-bold text-purple-600 mb-2">🟣 불법 방송 (Illegal Broadcasting)</h3>
              <p className="text-gray-700 mb-2">
                허가받지 않은 주파수에서 방송하는 불법 행위입니다.
              </p>
              <div className="bg-purple-50 p-3 rounded text-sm">
                <p className="text-gray-700"><strong>특징:</strong> 정규 방송 주파수 침범</p>
                <p className="text-gray-700"><strong>영향:</strong> 정규 방송 혼신, 청취자 혼란</p>
                <p className="text-gray-700"><strong>처벌:</strong> 전파법 위반, 3년 이하 징역 또는 3천만원 이하 벌금</p>
              </div>
            </div>
          </div>
        </section>

        {/* How KCA Works */}
        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-4">🛡️ KCA의 전파 관리 시스템</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-blue-600 mb-2">1️⃣ 24시간 실시간 모니터링</h3>
                    <p className="text-gray-700">
                      전국 주요 도시에 전파 관측소를 설치하여 24시간 실시간으로 전파 환경을 모니터링합니다.
                      자동화된 시스템이 이상 신호를 즉시 탐지합니다.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-blue-600 mb-2">2️⃣ AI 기반 자동 분석</h3>
                    <p className="text-gray-700">
                      인공지능 기술을 활용하여 수집된 데이터를 실시간으로 분석합니다.
                      정상 신호와 이상 신호를 자동으로 분류하고, 위협 수준을 평가합니다.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-blue-600 mb-2">3️⃣ 신속한 대응</h3>
                    <p className="text-gray-700">
                      이상 신호 탐지 시 전문가가 즉시 출동하여 발생원을 추적합니다.
                      불법 전파 사용자는 법적 조치를 받게 됩니다.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-blue-600 mb-2">4️⃣ 국민 정보 제공</h3>
                    <p className="text-gray-700">
                      스펙트럼 워치를 통해 실시간 전파 환경 정보를 국민에게 투명하게 공개합니다.
                      우리 동네의 전파 건강 점수를 확인할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-12 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-9xl mb-4">🛡️</div>
                    <p className="text-blue-600 font-bold text-xl">보안 시스템</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Health Score Explanation */}
        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-4">📊 건강 점수 산출 방식</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 mb-4">
                  건강 점수는 최근 24시간 동안의 전파 환경 품질을 0-100점으로 나타냅니다.
                </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl font-bold">
                  90+
                </div>
                <div>
                  <h3 className="font-bold text-green-600">좋음 (90-100점)</h3>
                  <p className="text-gray-600 text-sm">이상 신호가 거의 없는 매우 깨끗한 전파 환경입니다.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-yellow-500 flex items-center justify-center text-white text-2xl font-bold">
                  70+
                </div>
                <div>
                  <h3 className="font-bold text-yellow-600">보통 (70-89점)</h3>
                  <p className="text-gray-600 text-sm">일부 이상 신호가 탐지되었으나 통신에 큰 영향은 없습니다.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                  50+
                </div>
                <div>
                  <h3 className="font-bold text-orange-600">주의 (50-69점)</h3>
                  <p className="text-gray-600 text-sm">이상 신호가 빈번하게 탐지되어 통신 품질이 저하될 수 있습니다.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white text-2xl font-bold">
                  &lt;50
                </div>
                <div>
                  <h3 className="font-bold text-red-600">나쁨 (0-49점)</h3>
                  <p className="text-gray-600 text-sm">심각한 전파 간섭이 발생하여 즉각적인 조치가 필요합니다.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>계산 공식:</strong> 건강 점수 = 100 - (이상 신호 비율 × 100)<br/>
                예: 최근 24시간 동안 총 1000개 신호 중 50개가 이상 신호인 경우<br/>
                건강 점수 = 100 - (50/1000 × 100) = 95점
              </p>
            </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-12 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-9xl mb-4">📊</div>
                    <p className="text-green-600 font-bold text-xl">데이터 분석</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">❓ 자주 묻는 질문</h2>
            <img
              src="https://illustrations.popsy.co/blue/question-mark.svg"
              alt="FAQ"
              className="w-24 h-24 hidden md:block"
            />
          </div>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-gray-800 mb-2">Q. 전파 간섭이 건강에 해로운가요?</h3>
              <p className="text-gray-700">
                A. 전파 간섭 자체는 인체에 직접적인 해를 끼치지 않습니다. 하지만 통신 장애를 일으켜
                긴급 상황에서 구조 요청이나 중요한 통신을 방해할 수 있어 간접적으로 위험할 수 있습니다.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-gray-800 mb-2">Q. 우리 동네 점수가 낮으면 어떻게 하나요?</h3>
              <p className="text-gray-700">
                A. KCA는 이미 해당 지역을 모니터링하고 있으며, 불법 전파 발생원을 추적 중입니다.
                의심되는 전파 간섭을 발견하면 KCA 전파민원센터(☎ 1588-1857)로 신고해주세요.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-gray-800 mb-2">Q. Wi-Fi 공유기도 불법 전파가 될 수 있나요?</h3>
              <p className="text-gray-700">
                A. 정식 인증을 받은 Wi-Fi 공유기는 합법적으로 사용할 수 있습니다. 하지만 출력을 임의로
                증폭하거나 허가받지 않은 주파수를 사용하면 불법입니다. KC 인증 마크를 확인하세요.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-gray-800 mb-2">Q. 전파 방해 장치 사용은 불법인가요?</h3>
              <p className="text-gray-700">
                A. 네, 전파 방해 장치(재머)의 제조, 판매, 사용은 모두 불법입니다.
                적발 시 3년 이하 징역 또는 3천만원 이하 벌금에 처해질 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* Report */}
        <section className="bg-red-50 rounded-xl p-8 border-2 border-red-200">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-red-600 mb-4">🚨 불법 전파 신고하기</h2>
              <p className="text-gray-700 mb-4">
                불법 전파나 전파 간섭을 발견하셨나요? KCA에 신고해주세요.
              </p>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-bold mb-2">📞 전화 신고</h3>
                  <p className="text-2xl font-bold text-blue-600">1588-1857</p>
                  <p className="text-sm text-gray-600 mt-1">KCA 전파민원센터 (평일 09:00-18:00)</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-bold mb-2">🌐 온라인 신고</h3>
                  <p className="text-blue-600 underline">www.kca.kr</p>
                  <p className="text-sm text-gray-600 mt-1">전파민원 &gt; 불법전파 신고</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-2xl p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-9xl mb-4">📞</div>
                  <p className="text-red-600 font-bold text-xl">긴급 신고</p>
                </div>
              </div>
            </div>
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
