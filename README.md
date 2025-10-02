# 스펙트럼 워치 (Spectrum Watch)

AI 기반 실시간 주파수 이상 신호 탐지 및 시각화 플랫폼

> **KCA 국민참여형 사업예산 제안 공모** 출품작

## 🎯 프로젝트 개요

스펙트럼 워치는 한국방송통신전파진흥원(KCA) 국민참여형 사업예산 제안 공모를 위해 개발된 프로토타입 플랫폼입니다. Anthropic Claude Sonnet API를 활용하여 주파수 데이터를 실시간으로 분석하고, 이상 신호를 자동으로 탐지합니다.

### 주요 기능

- 🤖 **AI 기반 이상 신호 탐지**: Claude Sonnet API를 활용한 실시간 분석
- 🗺️ **지도 기반 시각화**: 전국 관측소의 주파수 건강 점수 시각화
- 📊 **관리자 대시보드**: 이상 신호 실시간 모니터링 및 알림
- 🌐 **대국민 공개 대시보드**: 지역별 주파수 환경 정보 제공

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **지도**: Leaflet, React-Leaflet
- **차트**: Recharts
- **AI**: Anthropic Claude Sonnet API
- **Database**: SQLite (better-sqlite3)
- **배포**: Vercel (예정)

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일에 Anthropic API 키를 설정하세요:

```env
ANTHROPIC_API_KEY=your_api_key_here
DATABASE_PATH=./data/spectrum.db
```

### 3. Mock 데이터 생성

```bash
npm run generate-mock 100
```

이 명령은 100개의 Mock 주파수 데이터를 생성하고 데이터베이스에 저장합니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 열어 확인하세요.

## 📂 프로젝트 구조

```
spectrum_watch/
├── app/
│   ├── page.tsx              # 대국민 공개 대시보드
│   ├── admin/
│   │   └── page.tsx          # 관리자 대시보드
│   ├── api/
│   │   ├── analyze/          # AI 분석 API
│   │   ├── spectrum/         # 스펙트럼 데이터 API
│   │   ├── locations/        # 관측소 정보 API
│   │   └── anomalies/        # 이상 신호 조회 API
│   ├── layout.tsx
│   └── globals.css
├── components/
│   └── Map.tsx               # 지도 컴포넌트 (Leaflet)
├── lib/
│   ├── db.ts                 # 데이터베이스 설정 및 스키마
│   ├── types.ts              # TypeScript 타입 정의
│   └── ai-analyzer.ts        # Claude API 연동
├── scripts/
│   ├── generate-mock-data.ts # Mock 데이터 생성 스크립트
│   └── run-mock-generator.js # Mock 생성 실행 스크립트
├── data/
│   └── spectrum.db           # SQLite 데이터베이스 (생성됨)
└── docs/
    ├── proposal_prd.md       # 제안서 및 PRD
    └── userjourney.md        # 사용자 여정
```

## 🚀 주요 페이지

### 대국민 공개 대시보드 (`/`)
- 전국 평균 주파수 건강 점수
- 지역별 건강 점수 지도
- 지역별 상세 현황
- 주파수 건강 점수 설명

### 관리자 대시보드 (`/admin`)
- 실시간 통계 카드 (관측소, 이상 신호, 건강 점수, 위험 관측소)
- 관측소 현황 지도 (클릭 가능)
- 최근 이상 신호 알림 목록
- 자동 새로고침 (30초마다)

## 📡 API 엔드포인트

### GET `/api/locations`
관측소 정보 조회 (건강 점수 포함 옵션)

```
GET /api/locations?include_health=true
```

### GET `/api/spectrum`
스펙트럼 데이터 조회

```
GET /api/spectrum?location_id=seoul-01&limit=100&include_analysis=true
```

### POST `/api/spectrum`
스펙트럼 데이터 추가

```json
{
  "timestamp": "2025-10-02T10:00:00Z",
  "frequency": 1805.5,
  "power": -65.2,
  "location_id": "seoul-01",
  "bandwidth": 10,
  "modulation_type": "LTE"
}
```

### POST `/api/analyze`
AI 분석 실행

```json
{
  "spectrum_data_id": 123
}
```

### GET `/api/anomalies`
이상 신호 조회

```
GET /api/anomalies?location_id=seoul-01&limit=50
```

## 🗄️ 데이터베이스 스키마

### spectrum_data
주파수 원시 데이터
- id, timestamp, frequency, power, location_id, bandwidth, modulation_type

### analysis_results
AI 분석 결과
- id, spectrum_data_id, is_anomaly, anomaly_type, confidence_score, reasoning

### locations
관측소 정보
- id, name, latitude, longitude, region

## 🤖 AI 분석 로직

Claude Sonnet API를 사용하여 주파수 데이터를 분석합니다:

1. **정상 신호 기준**: LTE, Wi-Fi, FM Radio, TV, 5G 등의 표준 신호 특성
2. **이상 신호 유형**:
   - Jamming: 정상 대비 +30dBm 이상 강한 신호
   - Spike: 갑작스러운 +40dBm 이상 신호 증가
   - Illegal Broadcast: 허가되지 않은 주파수 대역 사용
   - Unknown: 알 수 없는 이상 패턴

3. **출력 형식**:
   - is_anomaly: 이상 신호 여부 (boolean)
   - anomaly_type: 이상 신호 유형 (string)
   - confidence_score: 신뢰도 (0.0-1.0)
   - reasoning: 판단 근거 (string)

## 📝 향후 계획

- [ ] v1.1: 실제 KCA 관측소 실시간 데이터 연동
- [ ] v2.0: 전파 신호 분석 전용 커스텀 ML 모델 (CNN) 개발
- [ ] v2.1: 이상 신호 패턴 통계 분석 및 예측 기능
- [ ] 실시간 WebSocket 기반 알림 시스템
- [ ] 관리자용 모바일 앱
- [ ] 상세 보고서 생성 및 PDF 내보내기

## 📄 프로젝트 정보

**KCA 국민참여형 사업예산 제안 공모** 출품작
이 프로젝트는 공모전 시연용 프로토타입입니다.

## 👥 기여

문의사항이나 제안은 이슈로 등록해주세요.
