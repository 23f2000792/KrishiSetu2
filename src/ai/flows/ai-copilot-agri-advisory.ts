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

const AiCopilotAgriAdvisoryInputSchema = z.object({
  query: z.string().describe('The question from the farmer about their crops or farm.'),
  language: z.string().describe('The language for the response (e.g., "English", "Hindi", "Punjabi").'),
});
export type AiCopilotAgriAdvisoryInput = z.infer<
  typeof AiCopilotAgriAdvisoryInputSchema
>;

const AiCopilotAgriAdvisoryOutputSchema = z.object({
  advice: z.string().describe('The AI-powered advice for the farmer.'),
});
export type AiCopilotAgriAdvisoryOutput = z.infer<
  typeof AiCopilotAgriAdvisoryOutputSchema
>;

export async function aiCopilotAgriAdvisory(
  input: AiCopilotAgriAdvisoryInput
): Promise<AiCopilotAgriAdvisoryOutput> {
  return aiCopilotAgriAdvisoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCopilotAgriAdvisoryPrompt',
  input: {schema: AiCopilotAgriAdvisoryInputSchema},
  output: {schema: AiCopilotAgriAdvisoryOutputSchema},
  prompt: `You are an AI-powered agri-advisory service. A farmer will ask you a question, and you will provide them with advice in the specified language.

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
