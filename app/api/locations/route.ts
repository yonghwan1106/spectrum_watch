import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { ApiResponse, LocationWithHealth } from '@/lib/types';

// GET: Retrieve all locations with health scores
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeHealth = searchParams.get('include_health') === 'true';

    if (!includeHealth) {
      // Simple location list
      const locations = db.prepare('SELECT * FROM locations ORDER BY region, name').all();

      return NextResponse.json<ApiResponse>({
        success: true,
        data: locations,
      });
    }

    // Get locations with health scores
    const query = `
      SELECT
        l.*,
        COUNT(CASE WHEN a.is_anomaly = 1 THEN 1 END) as anomaly_count,
        COUNT(s.id) as total_checks,
        MAX(s.timestamp) as last_check
      FROM locations l
      LEFT JOIN spectrum_data s ON l.id = s.location_id
        AND s.timestamp > datetime('now', '-24 hours')
      LEFT JOIN analysis_results a ON s.id = a.spectrum_data_id
      GROUP BY l.id
      ORDER BY l.region, l.name
    `;

    const locationsWithStats = db.prepare(query).all() as any[];

    // Calculate health scores (0-100, where 100 is best)
    const locationsWithHealth: LocationWithHealth[] = locationsWithStats.map((loc) => {
      const totalChecks = loc.total_checks || 0;
      const anomalyCount = loc.anomaly_count || 0;

      // Health score: 100 - (anomaly_rate * 100)
      const anomalyRate = totalChecks > 0 ? anomalyCount / totalChecks : 0;
      const healthScore = Math.round(100 - anomalyRate * 100);

      return {
        id: loc.id,
        name: loc.name,
        latitude: loc.latitude,
        longitude: loc.longitude,
        region: loc.region,
        health_score: healthScore,
        anomaly_count: anomalyCount,
        last_check: loc.last_check,
      };
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: locationsWithHealth,
    });
  } catch (error) {
    console.error('Error in locations GET API:', error);
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
