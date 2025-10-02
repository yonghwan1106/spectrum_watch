import { db, initDB } from '../lib/db';
import { analyzeSpectrumData } from '../lib/ai-analyzer';
import type { SpectrumData } from '../lib/types';

// Initialize database
initDB();

async function analyzeAllData() {
  console.log('Starting AI analysis for all spectrum data...\n');

  // Get all spectrum data that hasn't been analyzed
  const unanalyzedData = db
    .prepare(
      `SELECT s.* FROM spectrum_data s
       LEFT JOIN analysis_results a ON s.id = a.spectrum_data_id
       WHERE a.id IS NULL
       ORDER BY s.id`
    )
    .all() as SpectrumData[];

  console.log(`Found ${unanalyzedData.length} unanalyzed data entries.\n`);

  if (unanalyzedData.length === 0) {
    console.log('No data to analyze. Exiting.');
    db.close();
    return;
  }

  const insertStmt = db.prepare(
    `INSERT INTO analysis_results
     (spectrum_data_id, is_anomaly, anomaly_type, confidence_score, reasoning)
     VALUES (?, ?, ?, ?, ?)`
  );

  let analyzed = 0;
  let anomaliesFound = 0;

  for (const data of unanalyzedData) {
    try {
      console.log(`[${analyzed + 1}/${unanalyzedData.length}] Analyzing data ID ${data.id}...`);

      const analysis = await analyzeSpectrumData(data);

      insertStmt.run(
        data.id,
        analysis.is_anomaly ? 1 : 0,
        analysis.anomaly_type || null,
        analysis.confidence_score,
        analysis.reasoning
      );

      if (analysis.is_anomaly) {
        anomaliesFound++;
        console.log(
          `  ⚠️  ANOMALY DETECTED: ${analysis.anomaly_type} (confidence: ${(analysis.confidence_score * 100).toFixed(1)}%)`
        );
        console.log(`  Reasoning: ${analysis.reasoning}`);
      } else {
        console.log(`  ✅ Normal signal`);
      }

      analyzed++;

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`  ❌ Error analyzing data ID ${data.id}:`, error);
    }

    console.log('');
  }

  console.log('\n=== Analysis Complete ===');
  console.log(`Total analyzed: ${analyzed}`);
  console.log(`Anomalies found: ${anomaliesFound}`);
  console.log(`Anomaly rate: ${((anomaliesFound / analyzed) * 100).toFixed(1)}%`);

  db.close();
}

// Run the analyzer
analyzeAllData().catch((error) => {
  console.error('Fatal error:', error);
  db.close();
  process.exit(1);
});
