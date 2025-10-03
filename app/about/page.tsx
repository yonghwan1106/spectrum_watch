'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <Link href="/">
                <h1 className="text-2xl md:text-3xl font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
                  스펙트럼 워치
                </h1>
              </Link>
              <p className="text-gray-600 text-xs md:text-sm mt-1">AI 기반 실시간 주파수 모니터링 플랫폼</p>
            </div>
            <div className="flex gap-2 md:gap-3">
              <Link
                href="/"
                className="px-3 md:px-4 py-2 text-sm md:text-base bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                홈
              </Link>
              <Link
                href="/learn"
                className="px-3 md:px-4 py-2 text-sm md:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                전파 배우기
              </Link>
              <Link
                href="/admin"
                className="px-3 md:px-4 py-2 text-sm md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                관리자
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <p className="text-sm text-blue-600 font-medium mb-3">
            KCA 국민참여형 사업예산 제안 공모
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            스펙트럼 워치<br />
            <span className="text-blue-600">Spectrum Watch</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            AI 기반 실시간 주파수 이상 신호 탐지 및 시각화 플랫폼
          </p>
        </section>

        {/* Problem Section */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-3xl">🔍</span>
              제안 배경
            </h3>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                사물인터넷(IoT), 드론, 5G 등 무선 통신 기술의 발전으로 국가 전파 환경은 전례 없이 복잡하고 혼잡해지고 있습니다.
              </p>
              <p>
                한국방송통신전파진흥원(KCA)은 방대한 양의 주파수 데이터를 관리하며 깨끗하고 효율적인 전파 환경을 유지할 책임을 지고 있으나,
                현재의 모니터링 방식은 <strong className="text-red-600">주로 민원 신고에 의존하는 사후 대응적 성격</strong>이 강합니다.
              </p>
              <p>
                막대한 스펙트럼 데이터 속에서 미허가 방송, 재밍 신호, 장비 오작동과 같은 이상 신호를 수동으로 식별하는 것은
                <strong>'건초더미에서 바늘 찾기'</strong>와 같아 선제적 탐지에 명백한 한계가 있습니다.
              </p>
              <div className="bg-blue-50 rounded-lg p-6 mt-6">
                <p className="font-semibold text-blue-800">
                  📌 핵심 문제: 데이터의 부재가 아닌, 원시 데이터를 실행 가능한 '통찰력'으로 신속하게 전환할 도구의 부재
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 md:p-10 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-3xl">💡</span>
              해결 방안
            </h3>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                <strong className="text-yellow-300">사후 민원 처리에서 선제적 주파수 거버넌스로의 전환</strong>
              </p>
              <p className="leading-relaxed">
                본 사업은 KCA의 '주파수 종합정보 관리' 업무를 혁신하고, 국가 주파수 자원의 수동적 관리자에서 능동적 통치자로 전환하기 위해 필수적입니다.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                  <h4 className="font-bold text-lg mb-3">🤖 AI 기반 자동화</h4>
                  <p className="text-sm leading-relaxed">
                    24시간 스펙트럼을 감시하고 의심스러운 신호를 즉시 식별하여 조사를 의뢰
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                  <h4 className="font-bold text-lg mb-3">📊 대국민 시각화</h4>
                  <p className="text-sm leading-relaxed">
                    분석 결과를 이해하기 쉬운 대시보드로 제공하여 기관 투명성 제고
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                  <h4 className="font-bold text-lg mb-3">🛡️ 통신 품질 향상</h4>
                  <p className="text-sm leading-relaxed">
                    불법·혼신 전파로 인한 국민의 통신 서비스 품질 저하를 예방
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                  <h4 className="font-bold text-lg mb-3">🚀 6G 시대 대비</h4>
                  <p className="text-sm leading-relaxed">
                    미래 주파수 관리를 위한 핵심 기반 기술 확보로 적시성 높음
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Plan Section */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <span className="text-3xl">🗓️</span>
              구축 계획 (1년 파일럿 프로그램)
            </h3>

            {/* Phase 1 */}
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">AI 모델 개발 및 데이터 기반 구축</h4>
                  <p className="text-gray-600 text-sm">1~6개월</p>
                </div>
              </div>
              <div className="ml-16 space-y-4">
                <div className="border-l-4 border-blue-300 pl-6 py-2">
                  <h5 className="font-semibold text-gray-800 mb-2">데이터 수집 및 레이블링</h5>
                  <p className="text-gray-700 text-sm">
                    KCA의 기존 관측소에서 정상 신호(LTE, TV, Wi-Fi 등)와 알려진 이상 신호(재밍, 불법무선국 등) 샘플을 포함한
                    대규모 스펙트럼 데이터를 수집하고 정제
                  </p>
                </div>
                <div className="border-l-4 border-blue-300 pl-6 py-2">
                  <h5 className="font-semibold text-gray-800 mb-2">AI 모델 개발</h5>
                  <p className="text-gray-700 text-sm">
                    수집된 데이터를 스펙트로그램(Spectrogram) 이미지로 변환하고, 합성곱 신경망(CNN)과 같은 머신러닝 모델에 학습.
                    신호 유형 자동 분류 및 이상 신호 탐지 능력 확보
                  </p>
                </div>
              </div>
            </div>

            {/* Phase 2 */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">플랫폼 프로토타입 및 시각화 대시보드 구축</h4>
                  <p className="text-gray-600 text-sm">7~12개월</p>
                </div>
              </div>
              <div className="ml-16 space-y-4">
                <div className="border-l-4 border-green-300 pl-6 py-2">
                  <h5 className="font-semibold text-gray-800 mb-2">내부 모니터링 플랫폼 구축</h5>
                  <p className="text-gray-700 text-sm">
                    KCA 일부 관측소로부터 실시간 데이터를 수신하여 AI 엔진이 분석하고, 이상 징후 탐지 시 담당자에게 경보를 보내는
                    내부용 프로토타입 플랫폼 구축
                  </p>
                </div>
                <div className="border-l-4 border-green-300 pl-6 py-2">
                  <h5 className="font-semibold text-gray-800 mb-2">대국민 시각화 대시보드 개발</h5>
                  <p className="text-gray-700 text-sm">
                    주요 도시의 주파수 대역별 '건강 점수'와 같이 익명화되고 이해하기 쉬운 형태로 스펙트럼 사용 현황을 시각화하는
                    웹 기반 대시보드 개발 (국민 소통 창구)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Budget Section */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-3xl">💰</span>
              소요 예산
            </h3>
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <p className="text-3xl font-bold text-blue-600 text-center">총 2억 7,100만원</p>
            </div>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6 py-3">
                <h4 className="font-bold text-lg text-gray-800 mb-2">AI 모델 개발 - 1억 5,600만원</h4>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• 데이터 과학자/ML 엔지니어 인건비 (2명, 10개월): 1억 4,000만원</li>
                  <li>• 모델 학습용 GPU 클라우드 서버 이용료 (12개월): 1,600만원</li>
                </ul>
              </div>
              <div className="border-l-4 border-green-500 pl-6 py-3">
                <h4 className="font-bold text-lg text-gray-800 mb-2">플랫폼 및 대시보드 개발 - 9,500만원</h4>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• 백엔드/프론트엔드 개발자 인건비 (2명, 6개월): 8,500만원</li>
                  <li>• UI/UX 디자인 용역비: 1,000만원</li>
                </ul>
              </div>
              <div className="border-l-4 border-purple-500 pl-6 py-3">
                <h4 className="font-bold text-lg text-gray-800 mb-2">인프라 구축 및 운영 - 2,000만원</h4>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• 데이터 수집 및 저장을 위한 서버 구축/임대 비용: 1,200만원</li>
                  <li>• 플랫폼 운영 및 유지보수 비용: 800만원</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Expected Effects Section */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <span className="text-3xl">📈</span>
              기대 효과
            </h3>

            {/* Quantitative */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-blue-600 mb-4">정량적 효과</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">80%</div>
                  <p className="text-sm text-gray-700">불법·혼신 신호원 탐지 및 분석 시간 단축</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                  <p className="text-sm text-gray-700">자동화된 모니터링 역량 확보</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">↓</div>
                  <p className="text-sm text-gray-700">수동 신호 분석 인력 및 시간 절감</p>
                </div>
              </div>
            </div>

            {/* Qualitative */}
            <div>
              <h4 className="text-xl font-bold text-green-600 mb-4">정성적 효과</h4>
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-6">
                  <h5 className="font-bold text-gray-800 mb-2">🏛️ 정부/기관</h5>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    사후 대응에서 선제적 예방 중심의 주파수 관리 패러다임 전환.
                    데이터 기반의 과학적 규제 기관으로서 KCA의 위상 정립.
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <h5 className="font-bold text-gray-800 mb-2">👥 국민/사회</h5>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    혼신 감소를 통한 국민의 통신 서비스 품질 향상 및 국가 주파수 안보 강화.
                    대국민 대시보드를 통한 정책 투명성 제고 및 국민의 알 권리 충족.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-10 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              깨끗한 전파 환경, 함께 만들어가요
            </h3>
            <p className="text-lg mb-6 opacity-90">
              스펙트럼 워치는 KCA의 주파수 관리 역량을 혁신하고<br />
              국민에게 더 나은 통신 환경을 제공하기 위한 첫걸음입니다.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/"
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                대시보드 보기
              </Link>
              <Link
                href="/learn"
                className="px-6 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition"
              >
                전파 배우기
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p className="font-semibold text-blue-600">KCA 국민참여형 사업예산 제안 공모</p>
          <p className="mt-1">© 2025 한국방송통신전파진흥원 (KCA) - 스펙트럼 워치</p>
        </footer>
      </main>
    </div>
  );
}
