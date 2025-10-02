import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '스펙트럼 워치 | Spectrum Watch',
  description: 'KCA 국민참여형 사업예산 제안 공모 - AI 기반 실시간 주파수 이상 신호 탐지 및 시각화 플랫폼',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
