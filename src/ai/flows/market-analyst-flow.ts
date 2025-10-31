
'use server';
/**
 * @fileOverview A specialist AI agent that analyzes and predicts crop market prices.
 *
 * - analyzeMarket - A function that provides AI-driven market analysis for a crop.
 * - MarketAnalysisInput - The input type for the analyzeMarket function.
 * - MarketAnalysisOutput - The return type for the analyzeMarket function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getMarketData} from '@/services/market-service';
import type { PricePoint } from '@/lib/types';

const MarketAnalysisInputSchema = z.object({
  crop: z.string().describe('The crop to analyze (e.g., "Wheat").'),
  region: z.string().describe('The region for the market (e.g., "Punjab").'),
  language: z.string().describe('The language for the response (e.g., "English", "Hindi").'),
});
export type MarketAnalysisInput = z.infer<typeof MarketAnalysisInputSchema>;

const MarketAnalysisOutputSchema = z.object({
    latestPrice: z.number().describe("The most recent price for the crop in the specified region."),
    summary: z.string().describe("A 2-3 sentence expert summary of the current market situation and near-term outlook."),
    forecast: z.string().describe("A 7-day price forecast (e.g., 'Prices are expected to rise by 2-4%')."),
    risks: z.string().describe("Potential risks that could affect the price (e.g., 'High arrivals may suppress prices')."),
    opportunities: z.string().describe("Potential opportunities for the farmer (e.g., 'Demand from neighboring states is strong, consider selling next week.')."),
});
export type MarketAnalysisOutput = z.infer<typeof MarketAnalysisOutputSchema>;

export async function analyzeMarket(input: MarketAnalysisInput): Promise<MarketAnalysisOutput> {
  return marketAnalysisFlow(input);
}

const getMarketDataTool = ai.defineTool(
    {
        name: 'getMarketData',
        description: 'Get historical market price data for a specific crop in a given region.',
        inputSchema: z.object({
            crop: z.string().describe('The crop to get the price for.'),
            region: z.string().describe('The region (city or state) to get the market price from.'),
        }),
        outputSchema: z.object({
            latestPrice: z.number().optional(),
            historicalPrices: z.array(z.object({ date: z.string(), price: z.number() })).describe("A list of prices for the last 30 days."),
        }),
    },
    async (input) => {
        const data = await getMarketData(input.crop, input.region);
        if (!data) {
            return { historicalPrices: [] };
        }
        return { latestPrice: data.latestPrice, historicalPrices: data.prices };
    }
);

const prompt = ai.definePrompt({
  name: 'marketAnalystPrompt',
  model: 'gemini-1.5-flash',
  input: { schema: z.object({
    crop: z.string(),
    region: z.string(),
    language: z.string(),
    marketData: z.object({
        latestPrice: z.number().optional(),
        historicalPrices: z.array(z.object({ date: z.string(), price: z.number() })),
    }),
  }) },
  output: { schema: MarketAnalysisOutputSchema },
  prompt: `You are an expert agricultural market analyst for the Indian market. Your task is to analyze historical price data for a crop and provide a concise, actionable report for a farmer.

  Your response MUST be in the specified language.

  **Market Data for Analysis:**
  - Crop: {{{crop}}}
  - Region: {{{region}}}
  - Latest Price: ₹{{marketData.latestPrice}} per quintal
  - Historical Prices (last 30 days):
    {{#each marketData.historicalPrices}}
    - {{date}}: ₹{{price}} per quintal
    {{/each}}

  **Your Task:**
  1.  **Set Latest Price:** Directly use the provided \`latestPrice\` for the output.
  2.  **Write a Summary:** Provide a 2-3 sentence expert summary of the current market situation based on the price trend. Mention if the market is stable, volatile, rising, or falling.
  3.  **Create a 7-Day Forecast:** Based on the historical trend, provide a simple 7-day price forecast (e.g., "Prices are expected to rise slightly by 2-4%," "Market likely to remain stable with minor fluctuations," "Potential for a 3-5% drop due to recent high arrivals").
  4.  **Identify Risks:** What are the immediate risks that could negatively impact the price? (e.g., "New government import policies," "High arrivals from other states," "Lower demand due to weather").
  5.  **Identify Opportunities:** What are the potential opportunities for the farmer? (e.g., "Upcoming festival may boost demand," "Consider storing for a week as prices are trending up," "Good export demand reported").

  Language for response: {{{language}}}
  `,
});

const marketAnalysisFlow = ai.defineFlow(
  {
    name: 'marketAnalysisFlow',
    inputSchema: MarketAnalysisInputSchema,
    outputSchema: MarketAnalysisOutputSchema,
  },
  async (input) => {
    const marketData = await getMarketDataTool(input);

    const { output } = await prompt({
        ...input,
        marketData,
    });
    return output!;
  }
);
