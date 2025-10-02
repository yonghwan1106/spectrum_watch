import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { analyzeSpectrumData } from '@/lib/ai-analyzer';
import type { SpectrumData, ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { spectrum_data_id } = body;

    if (!spectrum_data_id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'spectrum_data_id is required' },
        { status: 400 }
      );
    }

    // Get spectrum data from database
    const spectrumData = db
      .prepare('SELECT * FROM spectrum_data WHERE id = ?')
      .get(spectrum_data_id) as SpectrumData | undefined;

    if (!spectrumData) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Spectrum data not found' },
        { status: 404 }
      );
    }

    // Analyze using Claude API
    const analysis = await analyzeSpectrumData(spectrumData);

    // Store analysis result
    const insertResult = db
      .prepare(
        `INSERT INTO analysis_results
        (spectrum_data_id, is_anomaly, anomaly_type, confidence_score, reasoning)
        VALUES (?, ?, ?, ?, ?)`
      )
      .run(
        spectrum_data_id,
        analysis.is_anomaly ? 1 : 0,
        analysis.anomaly_type || null,
        analysis.confidence_score,
        analysis.reasoning
      );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        analysis_id: insertResult.lastInsertRowid,
        ...analysis,
      },
    });
  } catch (error) {
    console.error('Error in analyze API:', error);
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
