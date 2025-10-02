import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { ApiResponse } from '@/lib/types';

// GET: 특정 이상 신호 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const anomaly = db
      .prepare(
        `SELECT
          a.id as analysis_id,
          a.spectrum_data_id,
          a.is_anomaly,
          a.anomaly_type,
          a.confidence_score,
          a.reasoning,
          a.analyzed_at,
          s.frequency,
          s.power,
          s.bandwidth,
          s.timestamp,
          l.id as location_id,
          l.name as location_name,
          l.region,
          l.latitude,
          l.longitude
        FROM analysis_results a
        INNER JOIN spectrum_data s ON a.spectrum_data_id = s.id
        INNER JOIN locations l ON s.location_id = l.id
        WHERE a.id = ?`
      )
      .get(id);

    if (!anomaly) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Anomaly not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: anomaly,
    });
  } catch (error) {
    console.error('Error in anomaly detail GET API:', error);
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
