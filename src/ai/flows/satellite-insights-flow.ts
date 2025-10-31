'use server';
/**
 * @fileOverview An AI agent that analyzes satellite data (NDVI, rainfall) for a farm.
 *
 * - analyzeSatelliteData - A function that provides an analysis of the data.
 * - SatelliteAnalysisInput - The input type for the analysis.
 * - SatelliteAnalysisOutput - The output type for the analysis.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getMockSatelliteAnalytics } from '@/services/satellite-service';

const SatelliteAnalysisInputSchema = z.object({
  region: z.string().describe("The farmer's geographical region (e.g., 'Punjab')."),
  dataType: z.enum(['ndvi', 'rainfall']).describe("The type of satellite data to analyze."),
  timePeriod: z.enum(['current', 'previous']).describe("The time period for the data ('current' or 'previous' season)."),
  language: z.string().describe('The language for the response (e.g., "English", "Hindi").'),
});
export type SatelliteAnalysisInput = z.infer<typeof SatelliteAnalysisInputSchema>;

const SatelliteAnalysisOutputSchema = z.object({
  summary: z.string().describe("A 2-sentence summary of the key finding from the data."),
  observations: z.string().describe("A markdown list of 2-3 key observations from the satellite imagery."),
  recommendations: z.string().describe("A markdown list of 2-3 actionable recommendations for the farmer based on the observations."),
});
export type SatelliteAnalysisOutput = z.infer<typeof SatelliteAnalysisOutputSchema>;


export async function analyzeSatelliteData(input: SatelliteAnalysisInput): Promise<SatelliteAnalysisOutput> {
  return satelliteAnalysisFlow(input);
}


// This tool mocks fetching data from a satellite analytics service.
const getSatelliteDataTool = ai.defineTool(
  {
    name: 'getSatelliteData',
    description: 'Retrieves satellite data analytics for a specific farm region, data type, and time period.',
    inputSchema: z.object({
      region: z.string(),
      dataType: z.enum(['ndvi', 'rainfall']),
      timePeriod: z.enum(['current', 'previous']),
    }),
    outputSchema: z.string().describe('A text summary of the satellite data analysis.'),
  },
  async (params) => {
    return getMockSatelliteAnalytics(params.region, params.dataType, params.timePeriod);
  }
);


const prompt = ai.definePrompt({
  name: 'satelliteInsightPrompt',
  input: { schema: SatelliteAnalysisInputSchema },
  output: { schema: SatelliteAnalysisOutputSchema },
  tools: [getSatelliteDataTool],
  prompt: `You are an expert remote sensing agronomist. Your task is to analyze satellite data for a farmer and provide clear, actionable insights.

  **Process:**
  1.  **Use Tool:** You MUST use the \`getSatelliteDataTool\` to fetch the raw data analysis for the specified region, data type, and time period.
  2.  **Synthesize Analysis:** Based on the data returned by the tool, generate a concise analysis for the farmer.
      *   **Summary:** Write a 2-sentence summary of the most important finding.
      *   **Observations:** Create a markdown list of 2-3 specific, key observations. If comparing to a previous period, highlight the differences.
      *   **Recommendations:** Create a markdown list of 2-3 actionable recommendations. For NDVI, suggest targeted fertilization or scouting. For rainfall, suggest specific irrigation adjustments.

  **IMPORTANT:** Your entire response must be in the specified language.

  - Region: {{{region}}}
  - Data Type: {{{dataType}}}
  - Time Period: {{{timePeriod}}}
  - Language for response: {{{language}}}

  Generate the analysis now.
  `,
});

const satelliteAnalysisFlow = ai.defineFlow(
  {
    name: 'satelliteAnalysisFlow',
    inputSchema: SatelliteAnalysisInputSchema,
    outputSchema: SatelliteAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
