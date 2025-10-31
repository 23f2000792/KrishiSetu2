'use server';
/**
 * @fileOverview An AI agent that analyzes the deviation between predicted and actual crop yield.
 *
 * - analyzeYieldDeviation - A function that provides an analysis of yield performance.
 * - YieldAnalysisInput - The input type for the analysis.
 * - YieldAnalysisOutput - The output type for the analysis.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getFarmerKnowledgeGraph } from '@/services/knowledge-service';
import { getInitializedFirebaseAdmin } from '@/firebase/admin';

const YieldAnalysisInputSchema = z.object({
  crop: z.string().describe('The crop being analyzed.'),
  predictedYield: z.number().describe('The AI-predicted yield in quintals per acre.'),
  actualYield: z.number().describe('The farmer-reported actual yield in quintals per acre.'),
  userId: z.string().describe('The unique ID of the farmer for fetching historical data.'),
  language: z.string().describe('The language for the response (e.g., "English", "Hindi").'),
});
export type YieldAnalysisInput = z.infer<typeof YieldAnalysisInputSchema>;

const YieldAnalysisOutputSchema = z.object({
  deviation: z.number().describe('The percentage deviation of actual yield from predicted yield. Negative means underperformance.'),
  analysis: z.string().describe('A detailed, markdown-formatted analysis explaining the likely reasons for the yield deviation.'),
});
export type YieldAnalysisOutput = z.infer<typeof YieldAnalysisOutputSchema>;


export async function analyzeYieldDeviation(input: YieldAnalysisInput): Promise<YieldAnalysisOutput> {
  return yieldAnalysisFlow(input);
}


const getFarmerHistoryTool = ai.defineTool(
  {
    name: 'getFarmerHistory',
    description: "Get the farmer's historical data, including past soil reports and crop scans, to diagnose yield deviations.",
    inputSchema: z.object({
      userId: z.string().describe("The user's unique ID."),
    }),
    outputSchema: z.object({
      soilReports: z.array(z.any()).optional(),
      scans: z.array(z.any()).optional(),
    }),
  },
  async ({ userId }) => {
    const { firestore } = getInitializedFirebaseAdmin();
    return await getFarmerKnowledgeGraph(firestore, userId);
  }
);


const prompt = ai.definePrompt({
  name: 'yieldDeviationAnalysisPrompt',
  input: { schema: YieldAnalysisInputSchema },
  output: { schema: YieldAnalysisOutputSchema },
  tools: [getFarmerHistoryTool],
  prompt: `You are an expert agricultural analyst. Your task is to analyze the difference between a predicted crop yield and the actual result, providing clear reasons for the deviation.

  **Process:**
  1.  **Calculate Deviation:** First, calculate the percentage deviation: \`((Actual Yield - Predicted Yield) / Predicted Yield) * 100\`.
  2.  **Fetch Farmer History:** You MUST use the \`getFarmerHistory\` tool to get the farmer's recent soil reports and crop scan history. This context is essential.
  3.  **Analyze the Data:**
      *   **If Actual < Predicted (Underperformance):** Look for negative factors. Did the scan history show a high incidence of disease (e.g., 'Leaf Rust')? Did the latest soil report indicate a nutrient deficiency (e.g., 'Low Nitrogen') that wasn't addressed? Was there a disease outbreak alert? Correlate these historical data points to the poor yield.
      *   **If Actual > Predicted (Overperformance):** Look for positive factors. Did the soil report show excellent fertility? Was there a very low incidence of disease in the scan history? Highlight these as reasons for the success.
      *   **If Actual ≈ Predicted:** Note that the prediction was accurate and the farmer's management was effective, and briefly mention any minor factors observed.
  4.  **Formulate Analysis:** Write a concise, 2-3 paragraph analysis in Markdown. Start with the most impactful factor. Be specific. Example: "The 9.3% shortfall in yield was likely caused by two main factors. Firstly, your recent soil report indicated a 'Low' nitrogen level, which is critical during the grain-filling stage. Secondly, your crop scan history shows multiple instances of Leaf Rust, which can reduce photosynthetic ability and impact final grain weight."

  **IMPORTANT:** Your entire response (analysis) must be in the specified language.

  **Data for Analysis:**
  - Crop: {{{crop}}}
  - AI Predicted Yield: {{{predictedYield}}} quintals/acre
  - Farmer's Actual Yield: {{{actualYield}}} quintals/acre
  - User ID for History: {{{userId}}}
  - Language for response: {{{language}}}

  Generate the analysis now.
  `,
});

const yieldAnalysisFlow = ai.defineFlow(
  {
    name: 'yieldAnalysisFlow',
    inputSchema: YieldAnalysisInputSchema,
    outputSchema: YieldAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
