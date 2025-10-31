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


// Mock tool for long-range weather forecast.
const getWeatherForecastTool = ai.defineTool(
    {
        name: 'getWeatherForecast',
        description: 'Gets the long-range (3-month) weather forecast for a region.',
        inputSchema: z.object({ region: z.string() }),
        outputSchema: z.object({
            rainfall: z.enum(['Above-Normal', 'Normal', 'Below-Normal']),
            temperature: z.enum(['Warmer', 'Normal', 'Cooler']),
        }),
    },
    async ({ region }) => {
        // Mock data. In a real app, this would call a reliable weather API.
        if (region.toLowerCase() === 'punjab') {
            return { rainfall: 'Normal', temperature: 'Warmer' };
        }
        return { rainfall: 'Normal', temperature: 'Normal' };
    }
);

// Gets historical market data for a list of potential crops.
const getMarketDataTool = ai.defineTool(
    {
        name: 'getMarketDataForMultipleCrops',
        description: 'Get historical market price data for a list of potential crops to analyze profitability.',
        inputSchema: z.object({
            crops: z.array(z.string()).describe('A list of crops to get prices for.'),
            region: z.string(),
        }),
        outputSchema: z.array(z.object({
            crop: z.string(),
            averagePrice: z.number(),
        })),
    },
    async ({ crops, region }) => {
        const results = [];
        for (const crop of crops) {
            const data = await getMarketData(crop, region);
            if (data && data.prices.length > 0) {
                const averagePrice = data.prices.reduce((acc, p) => acc + p.price, 0) / data.prices.length;
                results.push({ crop, averagePrice });
            }
        }
        return results;
    }
);

const getFarmerHistoryTool = ai.defineTool(
  {
    name: 'getFarmerHistory',
    description: "Get the farmer's historical data, including past soil reports and crop scans.",
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
    const data = await getFarmerKnowledgeGraph(firestore, userId);
    return data;
  }
);


const prompt = ai.definePrompt({
  name: 'cropPlannerPrompt',
  input: { schema: CropPlannerInputSchema },
  output: { schema: CropPlannerOutputSchema },
  tools: [getFarmerHistoryTool, getWeatherForecastTool, getMarketDataTool],
  prompt: `You are an expert agricultural economist and agronomist advising a farmer in India. Your task is to recommend the single most profitable and suitable crop for the upcoming planting season.

  **Process:**
  1.  **Farmer History:** You MUST start by using the \`getFarmerHistory\` tool to fetch the farmer's most recent soil report. This is critical for understanding their soil's health (pH, NPK levels).
  2.  **Weather Forecast:** You MUST use the \`getWeatherForecastTool\` to get the long-range weather outlook for the farmer's region.
  3.  **Market Analysis:** Based on the region and soil type, identify 3-4 suitable crops. Then, you MUST use the \`getMarketDataForMultipleCrops\` tool to get their recent average market prices to analyze potential profitability.
  4.  **Synthesize & Recommend:**
      *   Weigh all the factors: soil suitability, water requirements vs. rainfall forecast, and market prices/demand.
      *   Select the **single best crop**. If you cannot determine a clear winner (e.g., market data is unavailable), make a logical recommendation based on soil and weather data alone.
      *   Calculate a simple, compelling ROI comparison. For example, if Mustard is better than Wheat, state it like "~24% higher ROI than Wheat." If you cannot calculate ROI, provide a qualitative reason for your choice.
      *   Provide a concise justification for your choice, explaining *why* it's the best option based on the data you gathered (soil, weather, market).

  **IMPORTANT:** Your entire response must be in the specified language.

  - User ID: {{{userId}}}
  - Region: {{{region}}}
  - Language for response: {{{language}}}

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
    const { output } = await prompt(input);
    return output!;
  }
);
