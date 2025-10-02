import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { ApiResponse } from '@/lib/types';

// GET: 특정 이상 신호의 히스토리 데이터 (같은 위치, 같은 주파수 대역)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 먼저 해당 이상 신호의 정보를 가져옴
    const anomaly = db
      .prepare(
        `SELECT s.location_id, s.frequency
        FROM analysis_results a
        INNER JOIN spectrum_data s ON a.spectrum_data_id = s.id
        WHERE a.id = ?`
      )
      .get(id) as { location_id: string; frequency: number } | undefined;

    if (!anomaly) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Anomaly not found',
        },
        { status: 404 }
      );
    }

    // 같은 위치, 비슷한 주파수 대역(±10 MHz)의 최근 데이터 조회
    const frequencyMin = anomaly.frequency - 10;
    const frequencyMax = anomaly.frequency + 10;

    const historicalData = db
      .prepare(
        `SELECT
          s.timestamp,
          s.frequency,
          s.power,
          COALESCE(a.is_anomaly, 0) as is_anomaly
        FROM spectrum_data s
        LEFT JOIN analysis_results a ON s.id = a.spectrum_data_id
        WHERE s.location_id = ?
        AND s.frequency BETWEEN ? AND ?
        AND s.timestamp >= datetime('now', '-7 days')
        ORDER BY s.timestamp DESC
        LIMIT 50`
      )
      .all(anomaly.location_id, frequencyMin, frequencyMax);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: historicalData.reverse(), // 시간순 정렬
    });
  } catch (error) {
    console.error('Error in anomaly history GET API:', error);
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
