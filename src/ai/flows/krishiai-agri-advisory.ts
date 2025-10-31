
'use server';

/**
 * @fileOverview An AI-powered agri-advisory service for farmers, acting as an orchestrator for a multi-agent system.
 *
 * - krishiAiAgriAdvisory - A function that provides AI-driven advice for farmers.
 * - KrishiAiAgriAdvisoryInput - The input type for the krishiAiAgriAdvisory function.
 * - KrishiAiAgriAdvisoryOutput - The return type for the krishiAiAgriAdvisory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getMarketData} from '@/services/market-service';
import {getFarmerKnowledgeGraph} from '@/services/knowledge-service';
import { getInitializedFirebaseAdmin } from '@/firebase/admin';
import { analyzeSoilCard } from './soil-card-analyzer';
import { analyzeProfitability } from './profit-analyst-flow';

const KrishiAiAgriAdvisoryInputSchema = z.object({
  query: z
    .string()
    .describe('The question from the farmer about their crops or farm.'),
  language: z
    .string()
    .describe(
      'The language for the response (e.g., "English", "Hindi", "Punjabi").'
    ),
  userId: z.string().describe("The user's unique ID for personalization."),
});
export type KrishiAiAgriAdvisoryInput = z.infer<
  typeof KrishiAiAgriAdvisoryInputSchema
>;

const KrishiAiAgriAdvisoryOutputSchema = z.object({
  advice: z
    .string()
    .describe('The AI-powered advice for the farmer, formatted in Markdown.'),
});
export type KrishiAiAgriAdvisoryOutput = z.infer<
  typeof KrishiAiAgriAdvisoryOutputSchema
>;

export async function krishiAiAgriAdvisory(
  input: KrishiAiAgriAdvisoryInput
): Promise<KrishiAiAgriAdvisoryOutput> {
  return krishiAiAgriAdvisoryFlow(input);
}


// #################################
// ## MULTI-AGENT SYSTEM TOOLS    ##
// #################################

const getFarmerHistoryTool = ai.defineTool(
  {
    name: 'getFarmerHistory',
    description: "Get the farmer's historical data, including past soil reports and crop scans, to provide personalized advice.",
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


const getMandiPriceTool = ai.defineTool(
  {
    name: 'getMandiPrice',
    description:
      'Get the latest market price for a specific crop in a given region from the Mandi.',
    inputSchema: z.object({
      crop: z.string().describe('The crop to get the price for.'),
      region: z
        .string()
        .describe(
          'The region (city or state) to get the market price from.'
        ),
    }),
    outputSchema: z.string(),
  },
  async input => {
    const data = await getMarketData(input.crop, input.region);
    if (!data || !data.latestPrice) {
      return `No price data found for ${input.crop} in ${input.region}.`;
    }
    return `The latest price for ${input.crop} in ${
      input.region
    } is ₹${data.latestPrice.toLocaleString()} per quintal.`;
  }
);


const cropScientistAgent = ai.defineTool({
    name: 'cropScientistAgent',
    description: 'Consults the Crop Scientist Agent to analyze soil health and its impact on crop suitability and performance.',
    inputSchema: z.object({
        pH: z.number(), N: z.string(), P: z.string(), K: z.string(), OC: z.number(), EC: z.number(), region: z.string(), language: z.string()
    }),
    outputSchema: z.any(),
}, async (input) => await analyzeSoilCard(input));

const financeAgent = ai.defineTool({
    name: 'financeAgent',
    description: 'Consults the Finance Agent to calculate potential profitability, costs, and ROI for a crop.',
    inputSchema: z.object({ crop: z.string(), region: z.string(), actualYield: z.number(), seedCost: z.number(), fertilizerCost: z.number(), pesticideCost: z.number(), laborCost: z.number(), irrigationCost: z.number(), transportCost: z.number(), otherCost: z.number() }),
    outputSchema: z.any(),
}, async (input) => await analyzeProfitability(input));



const prompt = ai.definePrompt({
  name: 'krishiAiAgriAdvisoryPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: KrishiAiAgriAdvisoryInputSchema},
  output: {schema: KrishiAiAgriAdvisoryOutputSchema},
  tools: [getMandiPriceTool, getFarmerHistoryTool, cropScientistAgent, financeAgent],
  prompt: `You are the lead "Advisory Agent" in a multi-agent collaboration system called "AgriVerse". Your primary role is to synthesize insights from a team of specialist AI agents to provide the most comprehensive and actionable advice to farmers.

**Your Specialist Team:**
*   **\`getFarmerHistoryTool\`**: Provides the farmer's past records (soil reports, crop scans). **You MUST call this first to get context.**
*   **\`cropScientistAgent\`**: Analyzes soil data to determine crop suitability and provides fertilizer plans.
*   **\`financeAgent\`**: Calculates potential profitability (ROI) for a given crop and cost structure.
*   **\`getMandiPriceTool\`**: Provides real-time market prices for crops.

**Your Process:**
1.  **Analyze the User's Query:** Understand the farmer's core need. Is it about soil health, disease risk, profitability, or a combination?
2.  **Gather Context:** ALWAYS start by calling \`getFarmerHistoryTool\` to retrieve the farmer's unique historical data. This is mandatory for personalization.
3.  **Delegate to Specialists:** Based on the query and historical context, decide which specialist agents to consult.
    *   If the query is about "what to grow" or "fertilizer", use the latest soil report from history and call the \`cropScientistAgent\`.
    *   If the query is about "risk" or "disease", call the \`climateAnalystAgent\`.
    *   If the query is about "profit" or "costs", you might need to ask the user for estimated costs and then call the \`financeAgent\`.
    *   If the query mentions prices, call \`getMandiPriceTool\`.
4.  **Synthesize and Advise:** Once you have the reports from your specialist agents, do not just present them individually. Your main job is to **synthesize** the information into a single, cohesive, and easy-to-understand recommendation. Cross-reference the insights. For example: "The Climate Analyst predicts a high risk of rust, which your past scans show you are susceptible to. The Finance Agent indicates that while wheat is profitable, the cost of fungicide to mitigate this risk will reduce your ROI by 5%. Therefore, consider a more rust-resistant varietal..."
5.  **Format the Response:** Present your final, synthesized advice in clear, readable Markdown. Always respond in the user-specified language.

**Farmer's Data:**
- Language for response: {{{language}}}
- Farmer Question: {{{query}}}
- User ID: {{{userId}}}

Begin your analysis by consulting your agent team.
`,
});

const krishiAiAgriAdvisoryFlow = ai.defineFlow(
  {
    name: 'krishiAiAgriAdvisoryFlow',
    inputSchema: KrishiAiAgriAdvisoryInputSchema,
    outputSchema: KrishiAiAgriAdvisoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


