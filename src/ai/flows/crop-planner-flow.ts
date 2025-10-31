'use server';
/**
 * @fileOverview A specialist AI agent that helps farmers plan their next crop season.
 *
 * - planCrop - A function that provides an AI-driven crop recommendation.
 * - CropPlannerInput - The input type for the planCrop function.
 * - CropPlannerOutput - The return type for the planCrop function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getFarmerKnowledgeGraph } from '@/services/knowledge-service';
import { getMarketData } from '@/services/market-service';
import { getInitializedFirebaseAdmin } from '@/firebase/admin';

const CropPlannerInputSchema = z.object({
  userId: z.string().describe('The unique ID of the farmer.'),
  region: z.string().describe('The geographical region of the farm.'),
  language: z.string().describe('The language for the response (e.g., "English", "Hindi").'),
});
export type CropPlannerInput = z.infer<typeof CropPlannerInputSchema>;

const CropPlannerOutputSchema = z.object({
    recommendedCrop: z.string().describe("The single best crop recommended for the next season."),
    expectedRoi: z.string().describe("The estimated Return on Investment (ROI) for the recommended crop, as a percentage. Example: '~24% higher than Wheat'"),
    justification: z.string().describe("A concise, markdown-formatted explanation for the recommendation, covering soil, weather, and market factors."),
});
export type CropPlannerOutput = z.infer<typeof CropPlannerOutputSchema>;

export async function planCrop(input: CropPlannerInput): Promise<CropPlannerOutput> {
  return cropPlannerFlow(input);
}

// System prompt designed to analyze a complete data package.
const cropPlannerSystemPrompt = ai.definePrompt({
    name: 'cropPlannerSystemPrompt',
    input: {
        schema: z.object({
            language: z.string(),
            region: z.string(),
            soilReportJson: z.string(),
            marketDataJson: z.string(),
            weatherForecastJson: z.string(),
        }),
    },
    output: { schema: CropPlannerOutputSchema },
    prompt: `You are an expert agricultural economist and agronomist advising a farmer in India. Your task is to analyze the provided data package and recommend the single most profitable and suitable crop for the upcoming planting season.

**Data Package:**
- Farmer's Region: {{{region}}}
- Latest Soil Report: {{{soilReportJson}}}
- Long-Range Weather Forecast: {{{weatherForecastJson}}}
- Historical Market Data for Potential Crops: {{{marketDataJson}}}

**Your Process:**
1.  **Synthesize & Recommend:**
    *   Analyze all the provided data: soil suitability (from the report), water requirements vs. rainfall forecast, and market prices/demand.
    *   Select the **single best crop** from the provided market data options.
    *   Calculate a simple, compelling ROI comparison against a common baseline crop (like Wheat or Rice). For example, state it like "~24% higher ROI than Wheat." If you cannot calculate a precise ROI, provide a qualitative reason for profitability.
    *   Provide a concise justification for your choice, explaining *why* it's the best option based on the data you were given (soil, weather, market).

**IMPORTANT:** Your entire response must be in the specified language: {{{language}}}

Generate the crop plan now.
`,
});


const cropPlannerFlow = ai.defineFlow(
  {
    name: 'cropPlannerFlow',
    inputSchema: CropPlannerInputSchema,
    outputSchema: CropPlannerOutputSchema,
  },
  async (input) => {
    // STEP 1: Gather all data before calling the AI.
    const { firestore } = getInitializedFirebaseAdmin();

    // Fetch farmer's history (soil reports, etc.)
    const farmerHistory = await getFarmerKnowledgeGraph(firestore, input.userId);
    const latestSoilReport = farmerHistory.soilReports?.[0] || null;

    // Define potential crops based on region (mock for now, could be a service)
    const potentialCrops = ['Wheat', 'Mustard', 'Soybean', 'Maize'];
    
    // Fetch market data for all potential crops
    const marketDataPromises = potentialCrops.map(crop => getMarketData(crop, input.region));
    const marketDataResults = await Promise.all(marketDataPromises);
    const marketDataContext = potentialCrops.map((crop, i) => ({ crop, data: marketDataResults[i] }));
    
    // Mock weather forecast
    const weatherForecast = { rainfall: 'Normal', temperature: 'Warmer' };

    // STEP 2: Call the AI with the complete data package.
    const { output } = await cropPlannerSystemPrompt({
        language: input.language,
        region: input.region,
        soilReportJson: JSON.stringify(latestSoilReport, null, 2),
        marketDataJson: JSON.stringify(marketDataContext, null, 2),
        weatherForecastJson: JSON.stringify(weatherForecast, null, 2),
    });
    
    return output!;
  }
);
