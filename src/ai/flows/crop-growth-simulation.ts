
'use server';
/**
 * @fileOverview An AI agent that simulates the 30-day growth journey of a crop.
 *
 * - simulateCropGrowth - A function that generates a predictive growth timeline.
 * - CropGrowthSimulationInput - The input type for the simulation.
 * - CropGrowthSimulationOutput - The output type for the simulation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const CropGrowthSimulationInputSchema = z.object({
  crop: z.string().describe('The type of crop being grown (e.g., "Wheat").'),
  region: z.string().describe('The geographical region of the farm (e.g., "Punjab").'),
  soilReport: z.any().optional().describe('The most recent soil analysis report for context. Can be null or empty.'),
  previousYield: z.number().optional().describe("The farmer's yield from the previous season for the same crop (in quintals/acre)."),
  language: z.string().describe('The language for the response (e.g., "English", "Hindi").'),
});
export type CropGrowthSimulationInput = z.infer<typeof CropGrowthSimulationInputSchema>;

const WeeklyUpdateSchema = z.object({
    week: z.number().describe("The week number (1-4)."),
    growthStage: z.string().describe("A brief description of the crop's expected growth stage for that week (e.g., 'Germination & Seedling Emergence')."),
    predictedRisks: z.string().describe("A 1-2 sentence summary of potential risks for that week (e.g., 'Risk of fungal infection due to high humidity. Watch for aphids.')."),
    recommendedActions: z.string().describe("A 1-2 sentence summary of recommended actions for the farmer (e.g., 'Ensure consistent moisture. Apply first light dose of nitrogen if seedlings appear yellow.')."),
});

const CropGrowthSimulationOutputSchema = z.object({
  timeline: z.array(WeeklyUpdateSchema).describe("A 4-week array representing the 30-day growth forecast."),
  finalYieldPrediction: z.string().describe("A concluding sentence predicting the potential yield and comparing it to a baseline. Example: 'Expected: 18.2 quintals/acre vs. Regional Average: 16.9 quintals/acre.'"),
});
export type CropGrowthSimulationOutput = z.infer<typeof CropGrowthSimulationOutputSchema>;

export async function simulateCropGrowth(input: CropGrowthSimulationInput): Promise<CropGrowthSimulationOutput> {
  return cropGrowthSimulationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropGrowthSimulationPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: { schema: z.object({
    crop: z.string(),
    region: z.string(),
    language: z.string(),
    soilReportJson: z.string(),
    previousYield: z.number().optional(),
  }) },
  output: { schema: CropGrowthSimulationOutputSchema },
  prompt: `You are an expert agronomist and crop modeling AI. Your task is to generate a plausible 30-day (4-week) growth simulation for a farmer's crop.

  Use your knowledge of agriculture, weather patterns for the given region, and the provided soil data to create a predictive timeline. If no soil data is available, provide a general forecast based on standard conditions for the region.

  **Your Task:**
  1.  **Analyze Inputs:** Consider the crop type, region, and any provided soil report or previous yield data.
  2.  **Simulate Week-by-Week:** For each of the 4 weeks, provide:
      *   **Growth Stage:** The expected physiological stage of the crop.
      *   **Predicted Risks:** Common risks for that stage and region (e.g., pests, diseases, weather stress). Be specific.
      *   **Recommended Actions:** Key actions the farmer should take (e.g., irrigation, fertilization, pest scouting).
  3.  **Predict Final Yield:** Conclude with a realistic yield prediction if the farmer follows the plan. **Crucially, compare this prediction to the farmer's previous yield or a regional average.** Format it clearly, for example: "Expected: 18.2 quintals/acre vs. Regional Average: 16.9 quintals/acre."
  4.  **Language:** The entire response MUST be in the specified language.

  **Farmer's Data:**
  - Crop: {{{crop}}}
  - Region: {{{region}}}
  - Language for response: {{{language}}}
  - Latest Soil Report: {{{soilReportJson}}}
  - Previous Season's Yield: {{{previousYield}}} quintals/acre

  Generate the 4-week timeline now.
  `,
});

const cropGrowthSimulationFlow = ai.defineFlow(
  {
    name: 'cropGrowthSimulationFlow',
    inputSchema: CropGrowthSimulationInputSchema,
    outputSchema: CropGrowthSimulationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt({
        ...input,
        soilReportJson: JSON.stringify(input.soilReport || {}, null, 2),
    });
    
    if (!output) {
      throw new Error("The AI model failed to return a valid simulation output.");
    }

    return output;
  }
);
