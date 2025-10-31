'use server';

/**
 * @fileOverview An AI-powered agri-advisory service for farmers.
 *
 * - aiCopilotAgriAdvisory - A function that provides AI-driven advice for farmers.
 * - AiCopilotAgriAdvisoryInput - The input type for the aiCopilotAgriAdvisory function.
 * - AiCopilotAgriAdvisoryOutput - The return type for the aiCopilotAgriAdvisory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getMarketData} from '@/services/market-service';
import {getFarmerKnowledgeGraph} from '@/services/knowledge-service';
import { getInitializedFirebaseAdmin } from '@/firebase/admin';

const AiCopilotAgriAdvisoryInputSchema = z.object({
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
export type AiCopilotAgriAdvisoryInput = z.infer<
  typeof AiCopilotAgriAdvisoryInputSchema
>;

const AiCopilotAgriAdvisoryOutputSchema = z.object({
  advice: z
    .string()
    .describe('The AI-powered advice for the farmer, formatted in Markdown.'),
});
export type AiCopilotAgriAdvisoryOutput = z.infer<
  typeof AiCopilotAgriAdvisoryOutputSchema
>;

export async function aiCopilotAgriAdvisory(
  input: AiCopilotAgriAdvisoryInput
): Promise<AiCopilotAgriAdvisoryOutput> {
  return aiCopilotAgriAdvisoryFlow(input);
}

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
    // Note: Genkit flows run in a server environment where the Admin SDK is available.
    // This is an exception to the "client-side only" rule for UI components.
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

const prompt = ai.definePrompt({
  name: 'aiCopilotAgriAdvisoryPrompt',
  input: {schema: AiCopilotAgriAdvisoryInputSchema},
  output: {schema: AiCopilotAgriAdvisoryOutputSchema},
  tools: [getMandiPriceTool, getFarmerHistoryTool],
  prompt: `You are an expert agronomist and AI-powered agri-advisory service. Your goal is to provide comprehensive, actionable, and personalized advice to farmers.

**VERY IMPORTANT**: Before answering, you MUST use the \`getFarmerHistory\` tool with the provided \`userId\` to fetch the farmer's past soil reports and crop scan data. This historical context is CRITICAL for providing accurate, long-term, and personalized advice.

When a farmer asks a question:
1.  **Use History for Context:** Analyze the historical data from \`getFarmerHistory\`.
    *   Look at past soil reports. If the farmer asks about fertilizer, reference their soil's nutrient levels (e.g., "Your last soil report showed low Nitrogen...").
    *   Look at past crop scans. If they ask about a disease, check if it has occurred before (e.g., "I see you had issues with Leaf Rust last season as well...").
    *   Use this memory to avoid giving generic advice. Your value is in personalization.
2.  **Analyze the Current Query:** Carefully understand the farmer's immediate need.
3.  **Disease Diagnosis:** If the query describes symptoms, act as an expert diagnostician. Use the historical data to see if it's a recurring problem.
4.  **Market Prices:** If the query is about crop prices, use the \`getMandiPriceTool\` to provide the latest market rates.
5.  **General Advice:** For all other questions, provide the most accurate, relevant, and practical advice, always informed by the farmer's history.

**Response Formatting:**
*   You MUST respond in the language specified by the user.
*   Format your response using Markdown for better readability.

Language for response: {{{language}}}
Farmer Question: {{{query}}}
User ID: {{{userId}}}`,
});

const aiCopilotAgriAdvisoryFlow = ai.defineFlow(
  {
    name: 'aiCopilotAgriAdvisoryFlow',
    inputSchema: AiCopilotAgriAdvisoryInputSchema,
    outputSchema: AiCopilotAgriAdvisoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
