'use server';
/**
 * @fileOverview An AI agent that predicts regional pest and disease outbreaks.
 *
 * - diseaseOutbreakPredictionFlow - A function that provides an outbreak forecast.
 * - DiseaseOutbreakPredictionInput - The input type for the prediction.
 * - DiseaseOutbreakPredictionOutput - The output type for the prediction.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { geminiPro } from 'genkit/models';

const DiseaseOutbreakPredictionInputSchema = z.object({
  crop: z.string().describe('The primary crop to check for risks (e.g., "Wheat").'),
  region: z.string().describe('The geographical region (e.g., "Punjab").'),
  language: z.string().describe('The language for the response (e.g., "English", "Hindi").'),
});
export type DiseaseOutbreakPredictionInput = z.infer<typeof DiseaseOutbreakPredictionInputSchema>;

const DiseaseOutbreakPredictionOutputSchema = z.object({
  alert: z.string().describe("A concise, one-sentence alert for the highest priority risk. Example: 'High risk of Leaf Blight outbreak in North Punjab due to humid conditions.' or 'No major outbreaks predicted.'"),
});
export type DiseaseOutbreakPredictionOutput = z.infer<typeof DiseaseOutbreakPredictionOutputSchema>;


export async function diseaseOutbreakPredictionFlow(input: DiseaseOutbreakPredictionInput): Promise<DiseaseOutbreakPredictionOutput> {
    return outbreakPredictionFlow(input);
}


// MOCK TOOL: In a real app, this would query a database of anonymized, aggregated scan data.
const getRegionalScanDataTool = ai.defineTool(
    {
        name: 'getRegionalScanData',
        description: 'Gets aggregated, recent (last 7 days) crop scan results for a specific region to identify disease trends.',
        inputSchema: z.object({
            region: z.string(),
            crop: z.string(),
        }),
        outputSchema: z.array(z.object({
            disease: z.string(),
            count: z.number(),
        })),
    },
    async ({ region, crop }) => {
        // This is mock data. A real implementation would query a database.
        if (crop.toLowerCase() === 'wheat' && region.toLowerCase() === 'punjab') {
            return [
                { disease: 'Leaf Rust', count: 28 },
                { disease: 'Powdery Mildew', count: 15 },
                { disease: 'Healthy Crop', count: 150 },
            ];
        }
        return [ { disease: 'Healthy Crop', count: 100 }];
    }
);


// MOCK TOOL: In a real app, this would call a weather API.
const getWeatherForecastTool = ai.defineTool(
    {
        name: 'getWeatherForecast',
        description: 'Gets the 7-day weather forecast for a region.',
        inputSchema: z.object({
            region: z.string(),
        }),
        outputSchema: z.object({
            summary: z.string(),
            humidity: z.string().describe("e.g., 'High', 'Medium', 'Low'"),
            temperature: z.string().describe("e.g., 'Rising', 'Falling', 'Stable'"),
        }),
    },
    async ({ region }) => {
         // This is mock data. A real implementation would call a weather API.
        if (region.toLowerCase() === 'punjab') {
            return {
                summary: "Cloudy with scattered showers expected late in the week.",
                humidity: "High",
                temperature: "Stable",
            }
        }
        return {
            summary: "Clear and sunny.",
            humidity: "Low",
            temperature: "Stable",
        }
    }
);


const prompt = ai.definePrompt({
  name: 'diseaseOutbreakPredictorPrompt',
  model: geminiPro,
  input: { schema: DiseaseOutbreakPredictionInputSchema },
  output: { schema: DiseaseOutbreakPredictionOutputSchema },
  tools: [getRegionalScanDataTool, getWeatherForecastTool],
  prompt: `You are an expert plant disease epidemiologist for Indian agriculture. Your task is to predict the most significant disease outbreak risk for a given crop and region for the next 7 days.

  **Process:**
  1.  **Use Tools:** You MUST use both \`getRegionalScanDataTool\` and \`getWeatherForecastTool\` for the specified region and crop.
  2.  **Analyze Data:** Correlate the recent disease trends from the scan data with the upcoming weather forecast. For example, high humidity and rain increase the risk of fungal diseases like rust or blight.
  3.  **Identify Highest Risk:** Determine the single most probable and impactful disease outbreak. If scans show a rising trend of a specific disease and the weather is conducive, that is a high-risk event.
  4.  **Formulate Alert:** Create a single, concise alert sentence. It must be clear, actionable, and state the risk level (e.g., High, Moderate). If no significant risks are found, state that clearly.

  **IMPORTANT:** Your entire response must be in the specified language.

  - Crop: {{{crop}}}
  - Region: {{{region}}}
  - Language for response: {{{language}}}

  Generate the alert now.
  `,
});

const outbreakPredictionFlow = ai.defineFlow(
  {
    name: 'outbreakPredictionFlow',
    inputSchema: DiseaseOutbreakPredictionInputSchema,
    outputSchema: DiseaseOutbreakPredictionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
