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

const AiCopilotAgriAdvisoryInputSchema = z.object({
  query: z
    .string()
    .describe('The question from the farmer about their crops or farm.'),
  language: z
    .string()
    .describe(
      'The language for the response (e.g., "English", "Hindi", "Punjabi").'
    ),
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
  tools: [getMandiPriceTool],
  prompt: `You are an expert agronomist and AI-powered agri-advisory service. Your goal is to provide comprehensive, actionable, and easy-to-understand advice to farmers.

When a farmer asks a question:
1.  **Analyze the Query:** Carefully understand the farmer's needs. Are they asking about crop diseases, market prices, farming techniques, or something else?
2.  **Disease Diagnosis:** If the query describes symptoms (e.g., "yellow spots on leaves," "stunted growth"), act as an expert diagnostician.
    *   Identify the most likely disease or nutrient deficiency.
    *   Provide a detailed treatment plan, including:
        *   **Cause:** Explain the likely reason for the issue.
        *   **Symptoms:** Briefly re-iterate the key symptoms to confirm your diagnosis.
        *   **Treatment:** Offer a clear, step-by-step treatment plan (organic and chemical options if applicable).
        *   **Prevention:** Suggest long-term preventative measures.
3.  **Market Prices:** If the query is about crop prices (e.g., "what is the price of wheat in Punjab?"), use the \`getMandiPriceTool\` to provide the latest market rates. Do not invent prices.
4.  **General Advice:** For all other questions, provide the most accurate, relevant, and practical advice.

**Response Formatting:**
*   You MUST respond in the language specified by the user.
*   Format your response using Markdown for better readability. Use headings (e.g., \`### Treatment Plan\`), lists, and bold text to structure your answer clearly.

Language for response: {{{language}}}
Farmer Question: {{{query}}}`,
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
