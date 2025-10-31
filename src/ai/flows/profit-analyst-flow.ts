'use server';
/**
 * @fileOverview An AI agent that calculates farm profitability based on costs and revenue.
 *
 * - analyzeProfitability - A function that provides a cost/profit analysis.
 * - ProfitAnalysisInput - The input type for the analysis.
 * - ProfitAnalysisOutput - The output type for the analysis.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getMarketData } from '@/services/market-service';
import { costInputSchema } from '@/lib/schemas/profit-analysis';

const ProfitAnalysisInputSchema = z.object({
  crop: z.string().describe('The crop being analyzed.'),
  region: z.string().describe('The region where the crop was sold.'),
  actualYield: z.coerce.number().describe('The total yield produced in quintals.'),
  ...costInputSchema,
});
export type ProfitAnalysisInput = z.infer<typeof ProfitAnalysisInputSchema>;

const ProfitAnalysisOutputSchema = z.object({
  totalCost: z.number().describe('The sum of all costs.'),
  totalRevenue: z.number().describe('The total revenue from selling the crop.'),
  netProfit: z.number().describe('The net profit (Revenue - Cost).'),
  roi: z.number().describe('The Return on Investment percentage ((Net Profit / Total Cost) * 100).'),
  costBreakdown: z.array(z.object({ name: z.string(), value: z.number() })).describe("An array of objects for a pie chart, showing the breakdown of costs."),
});
export type ProfitAnalysisOutput = z.infer<typeof ProfitAnalysisOutputSchema>;

export async function analyzeProfitability(input: ProfitAnalysisInput): Promise<ProfitAnalysisOutput> {
  return profitAnalysisFlow(input);
}

const getMarketDataTool = ai.defineTool(
    {
        name: 'getMarketData',
        description: 'Get the latest market price for a specific crop in a given region to calculate revenue.',
        inputSchema: z.object({
            crop: z.string(),
            region: z.string(),
        }),
        outputSchema: z.object({
            latestPrice: z.number().optional(),
        }),
    },
    async (input) => {
        const data = await getMarketData(input.crop, input.region);
        return { latestPrice: data?.latestPrice };
    }
);

const prompt = ai.definePrompt({
  name: 'profitabilityAnalysisPrompt',
  input: { schema: z.object({
      ...ProfitAnalysisInputSchema.shape,
      marketPrice: z.number().optional(),
  })},
  output: { schema: ProfitAnalysisOutputSchema },
  tools: [getMarketDataTool],
  prompt: `You are an expert farm accountant. Your task is to calculate the profitability of a farmer's crop based on their costs and yield.

  **Process:**
  1.  **Use Market Price:** You have been provided the latest market price for the crop. If not, use the \`getMarketData\` tool to fetch it.
  2.  **Calculate Total Revenue:** \`Total Revenue = Actual Yield * Market Price\`.
  3.  **Calculate Total Cost:** Sum up all the cost inputs: seed, fertilizer, pesticide, labor, irrigation, transport, and other.
  4.  **Calculate Net Profit:** \`Net Profit = Total Revenue - Total Cost\`.
  5.  **Calculate ROI:** \`Return on Investment (%) = (Net Profit / Total Cost) * 100\`.
  6.  **Create Cost Breakdown:** Create an array of objects for the cost breakdown, suitable for a pie chart.

  **Data for Analysis:**
  - Crop: {{{crop}}}
  - Region: {{{region}}}
  - Actual Yield: {{{actualYield}}} quintals
  - Market Price: ₹{{{marketPrice}}}/quintal

  **Costs (₹):**
  - Seed: {{{seedCost}}}
  - Fertilizer: {{{fertilizerCost}}}
  - Pesticide: {{{pesticideCost}}}
  - Labor: {{{laborCost}}}
  - Irrigation: {{{irrigationCost}}}
  - Transport: {{{transportCost}}}
  - Other: {{{otherCost}}}

  Generate the financial analysis now.
  `,
});

const profitAnalysisFlow = ai.defineFlow(
  {
    name: 'profitAnalysisFlow',
    inputSchema: ProfitAnalysisInputSchema,
    outputSchema: ProfitAnalysisOutputSchema,
  },
  async (input) => {
    const marketData = await getMarketDataTool({ crop: input.crop, region: input.region });

    const { output } = await prompt({
        ...input,
        marketPrice: marketData.latestPrice,
    });
    return output!;
  }
);
