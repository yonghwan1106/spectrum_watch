import Anthropic from '@anthropic-ai/sdk';
import type { SpectrumData, AnalysisResult } from './types';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface AIAnalysisResponse {
  is_anomaly: boolean;
  anomaly_type?: string;
  confidence_score: number;
  reasoning: string;
}

/**
 * Create a prompt for Claude to analyze spectrum data
 */
function createAnalysisPrompt(data: SpectrumData): string {
  return `당신은 전파 신호 분석 전문가입니다. 다음 주파수 데이터를 분석하여 이상 신호 여부를 판단해주세요.

**관측 데이터:**
- 위치: ${data.location_id}
- 주파수: ${data.frequency} MHz
- 신호 세기: ${data.power} dBm
- 대역폭: ${data.bandwidth || 'N/A'} MHz
- 변조 방식: ${data.modulation_type || 'Unknown'}
- 측정 시간: ${data.timestamp}

**분석 기준:**
1. 정상 신호 기준:
   - LTE: 1800 MHz 대역, -70 dBm, 10 MHz 대역폭
   - Wi-Fi: 2400 MHz 대역, -50 dBm, 20 MHz 대역폭
   - FM 라디오: 88-108 MHz, -40 dBm
   - TV: 500-600 MHz, -60 dBm
   - 5G: 3500 MHz 대역, -65 dBm, 100 MHz 대역폭

2. 이상 신호 유형:
   - Jamming: 정상 대비 +30dBm 이상 강한 신호
   - Spike: 갑작스러운 +40dBm 이상 신호 증가
   - Illegal Broadcast: 허가되지 않은 주파수 대역 사용
   - Unknown: 알 수 없는 이상 패턴

다음 JSON 형식으로만 응답해주세요:
{
  "is_anomaly": true 또는 false,
  "anomaly_type": "Jamming" | "Spike" | "Illegal Broadcast" | "Unknown" | null,
  "confidence_score": 0.0 ~ 1.0 사이의 신뢰도,
  "reasoning": "판단 근거를 1-2문장으로 간결하게 설명"
}`;
}

/**
 * Analyze spectrum data using Claude API
 */
export async function analyzeSpectrumData(data: SpectrumData): Promise<AIAnalysisResponse> {
  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: createAnalysisPrompt(data),
        },
      ],
    });

    // Extract JSON from response
    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude API');
    }

    // Parse JSON response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Claude response');
    }

    const analysis: AIAnalysisResponse = JSON.parse(jsonMatch[0]);

    // Validate response
    if (
      typeof analysis.is_anomaly !== 'boolean' ||
      typeof analysis.confidence_score !== 'number' ||
      typeof analysis.reasoning !== 'string'
    ) {
      throw new Error('Invalid response format from Claude API');
    }

    return analysis;
  } catch (error) {
    console.error('Error analyzing spectrum data:', error);

    // Return a fallback analysis
    return {
      is_anomaly: false,
      confidence_score: 0.5,
      reasoning: 'Analysis failed due to an error. Manual review recommended.',
    };
  }
}

/**
 * Batch analyze multiple spectrum data entries
 */
export async function batchAnalyzeSpectrumData(
  dataArray: SpectrumData[]
): Promise<Map<number, AIAnalysisResponse>> {
  const results = new Map<number, AIAnalysisResponse>();

  for (const data of dataArray) {
    if (data.id) {
      const analysis = await analyzeSpectrumData(data);
      results.set(data.id, analysis);
    }
  }

  return results;
}
