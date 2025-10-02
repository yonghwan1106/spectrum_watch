import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { ApiResponse } from '@/lib/types';

// GET: Retrieve anomaly events with full details
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locationId = searchParams.get('location_id');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = `
      SELECT
        a.id as analysis_id,
        a.is_anomaly,
        a.anomaly_type,
        a.confidence_score,
        a.reasoning,
        a.analyzed_at,
        s.*,
        l.name as location_name,
        l.latitude,
        l.longitude,
        l.region
      FROM analysis_results a
      INNER JOIN spectrum_data s ON a.spectrum_data_id = s.id
      INNER JOIN locations l ON s.location_id = l.id
      WHERE a.is_anomaly = 1
    `;

    const params: any[] = [];

    if (locationId) {
      query += ' AND s.location_id = ?';
      params.push(locationId);
    }

    query += ' ORDER BY s.timestamp DESC LIMIT ?';
    params.push(limit);

    const anomalies = db.prepare(query).all(...params);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: anomalies,
    });
  } catch (error) {
    console.error('Error in anomalies GET API:', error);
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
