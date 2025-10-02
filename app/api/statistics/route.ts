import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { ApiResponse } from '@/lib/types';

// GET: 통계 데이터 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'timeline';

    if (type === 'timeline') {
      // 시계열 데이터: 최근 24시간 동안 시간대별 이상 신호 발생 건수
      const timelineData = db
        .prepare(
          `SELECT
            strftime('%Y-%m-%d %H:00:00', s.timestamp) as hour,
            COUNT(CASE WHEN a.is_anomaly = 1 THEN 1 END) as anomaly_count,
            COUNT(*) as total_count
          FROM spectrum_data s
          LEFT JOIN analysis_results a ON s.id = a.spectrum_data_id
          WHERE s.timestamp >= datetime('now', '-24 hours')
          GROUP BY hour
          ORDER BY hour ASC`
        )
        .all();

      return NextResponse.json<ApiResponse>({
        success: true,
        data: timelineData,
      });
    }

    if (type === 'frequency_band') {
      // 주파수 대역별 통계
      const frequencyData = db
        .prepare(
          `SELECT
            CASE
              WHEN s.frequency < 100 THEN 'FM Radio (88-108 MHz)'
              WHEN s.frequency >= 500 AND s.frequency < 700 THEN 'TV (500-600 MHz)'
              WHEN s.frequency >= 1700 AND s.frequency < 1900 THEN 'LTE (1800 MHz)'
              WHEN s.frequency >= 2300 AND s.frequency < 2500 THEN 'Wi-Fi (2.4 GHz)'
              WHEN s.frequency >= 3400 AND s.frequency < 3600 THEN '5G (3.5 GHz)'
              ELSE 'Other'
            END as band,
            COUNT(CASE WHEN a.is_anomaly = 1 THEN 1 END) as anomaly_count,
            COUNT(*) as total_count,
            AVG(s.power) as avg_power
          FROM spectrum_data s
          LEFT JOIN analysis_results a ON s.id = a.spectrum_data_id
          WHERE s.timestamp >= datetime('now', '-24 hours')
          GROUP BY band
          ORDER BY total_count DESC`
        )
        .all();

      return NextResponse.json<ApiResponse>({
        success: true,
        data: frequencyData,
      });
    }

    if (type === 'region') {
      // 지역별 통계
      const regionData = db
        .prepare(
          `SELECT
            l.region,
            COUNT(CASE WHEN a.is_anomaly = 1 THEN 1 END) as anomaly_count,
            COUNT(*) as total_count,
            ROUND(AVG(CASE WHEN a.is_anomaly = 1 THEN 0 ELSE 100 END), 1) as health_score
          FROM spectrum_data s
          INNER JOIN locations l ON s.location_id = l.id
          LEFT JOIN analysis_results a ON s.id = a.spectrum_data_id
          WHERE s.timestamp >= datetime('now', '-24 hours')
          GROUP BY l.region
          ORDER BY anomaly_count DESC`
        )
        .all();

      return NextResponse.json<ApiResponse>({
        success: true,
        data: regionData,
      });
    }

    if (type === 'anomaly_types') {
      // 이상 신호 유형별 통계
      const anomalyTypesData = db
        .prepare(
          `SELECT
            COALESCE(a.anomaly_type, 'Unknown') as type,
            COUNT(*) as count,
            AVG(a.confidence_score) as avg_confidence
          FROM analysis_results a
          WHERE a.is_anomaly = 1
          AND a.analyzed_at >= datetime('now', '-24 hours')
          GROUP BY a.anomaly_type
          ORDER BY count DESC`
        )
        .all();

      return NextResponse.json<ApiResponse>({
        success: true,
        data: anomalyTypesData,
      });
    }

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Invalid type parameter',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in statistics GET API:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
