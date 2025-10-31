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

const QuickPromptsOutputSchema = z.object({
  prompts: z.array(z.string()).describe('A list of suggested prompts for the AI Copilot.'),
});
export type QuickPromptsOutput = z.infer<typeof QuickPromptsOutputSchema>;

export async function suggestQuickPrompts(): Promise<QuickPromptsOutput> {
  return suggestQuickPromptsFlow({});
}

const prompt = ai.definePrompt({
  name: 'suggestQuickPromptsPrompt',
  output: {schema: QuickPromptsOutputSchema},
  prompt: `You are an AI assistant designed to help farmers by suggesting quick prompts to get started with the AI Copilot.

  Provide a list of 5 diverse and helpful prompts that a farmer could use to interact with the AI Copilot. The prompts should be relevant to agriculture and farming practices.

  Your output should be a JSON object with a "prompts" key containing an array of strings.
  Do not add any intro text, just give the JSON.`,
});

const suggestQuickPromptsFlow = ai.defineFlow(
  {
    name: 'suggestQuickPromptsFlow',
    outputSchema: QuickPromptsOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
