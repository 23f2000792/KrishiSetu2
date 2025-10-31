'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting quick prompts to farmers using the AI Copilot.
 *
 * The flow takes no input and returns a list of suggested prompt strings.
 * It exports:
 *   - suggestQuickPrompts: The main function to call to get the suggested prompts.
 *   - QuickPromptsOutput: The type definition for the output of the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuickPromptsInputSchema = z.object({
  language: z.string().describe('The language for the response (e.g., "English", "Hindi", "Punjabi").'),
});

export type QuickPromptsInput = z.infer<typeof QuickPromptsInputSchema>;


const QuickPromptsOutputSchema = z.object({
  prompts: z.array(z.string()).describe('A list of suggested prompts for the AI Copilot.'),
});
export type QuickPromptsOutput = z.infer<typeof QuickPromptsOutputSchema>;

export async function suggestQuickPrompts(input: QuickPromptsInput): Promise<QuickPromptsOutput> {
  return suggestQuickPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestQuickPromptsPrompt',
  input: {schema: QuickPromptsInputSchema},
  output: {schema: QuickPromptsOutputSchema},
  prompt: `You are an AI assistant designed to help farmers by suggesting quick prompts to get started with the AI Copilot.

  Provide a list of 5 diverse and helpful prompts that a farmer could use to interact with the AI Copilot. The prompts should be relevant to agriculture and farming practices.
  The prompts MUST be in the specified language.

  Language for prompts: {{{language}}}

  Your output should be a JSON object with a "prompts" key containing an array of strings.
  Do not add any intro text, just give the JSON.`,
});

const suggestQuickPromptsFlow = ai.defineFlow(
  {
    name: 'suggestQuickPromptsFlow',
    inputSchema: QuickPromptsInputSchema,
    outputSchema: QuickPromptsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
