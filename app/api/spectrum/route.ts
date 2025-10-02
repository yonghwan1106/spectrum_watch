import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { SpectrumData, ApiResponse } from '@/lib/types';

// GET: Retrieve spectrum data with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locationId = searchParams.get('location_id');
    const limit = parseInt(searchParams.get('limit') || '100');
    const includeAnalysis = searchParams.get('include_analysis') === 'true';

    let query = `
      SELECT s.*, l.name as location_name, l.latitude, l.longitude, l.region
      FROM spectrum_data s
      LEFT JOIN locations l ON s.location_id = l.id
    `;

    const params: any[] = [];

    if (locationId) {
      query += ' WHERE s.location_id = ?';
      params.push(locationId);
    }

    query += ' ORDER BY s.timestamp DESC LIMIT ?';
    params.push(limit);

    const spectrumData = db.prepare(query).all(...params);

    // Optionally include analysis results
    if (includeAnalysis && spectrumData.length > 0) {
      const analysisQuery = `
        SELECT * FROM analysis_results
        WHERE spectrum_data_id IN (${spectrumData.map((d: any) => d.id).join(',')})
      `;
      const analyses = db.prepare(analysisQuery).all();

      // Map analyses to spectrum data
      const analysisMap = new Map(analyses.map((a: any) => [a.spectrum_data_id, a]));
      (spectrumData as any[]).forEach((d: any) => {
        d.analysis = analysisMap.get(d.id) || null;
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: spectrumData,
    });
  } catch (error) {
    console.error('Error in spectrum GET API:', error);
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

// POST: Add new spectrum data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { timestamp, frequency, power, location_id, bandwidth, modulation_type } = body;

    // Validate required fields
    if (!timestamp || !frequency || !power || !location_id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert spectrum data
    const result = db
      .prepare(
        `INSERT INTO spectrum_data
        (timestamp, frequency, power, location_id, bandwidth, modulation_type)
        VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(timestamp, frequency, power, location_id, bandwidth || null, modulation_type || null);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        id: result.lastInsertRowid,
        timestamp,
        frequency,
        power,
        location_id,
        bandwidth,
        modulation_type,
      },
    });
  } catch (error) {
    console.error('Error in spectrum POST API:', error);
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
