'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing soil test report data.
 *
 * It takes structured soil parameters as input, uses an AI model to interpret the results,
 * and returns a comprehensive analysis including fertility status, crop recommendations,
 * and a fertilizer plan.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Defines the input schema for the soil analysis flow.
const SoilAnalysisInputSchema = z.object({
  pH: z.number().describe('The pH level of the soil (e.g., 6.8).'),
  N: z.string().describe('Nitrogen level, typically "Low", "Medium", or "High".'),
  P: z.string().describe('Phosphorus level, typically "Low", "Medium", or "High".'),
  K: z.string().describe('Potassium level, typically "Low", "Medium", or "High".'),
  OC: z.number().describe('Organic Carbon percentage (e.g., 0.55).'),
  EC: z.number().describe('Electrical Conductivity (e.g., 0.25).'),
  region: z.string().describe('The geographical region where the soil is from (e.g., "Punjab").'),
  language: z.string().describe('The language for the response (e.g., "English", "Hindi").'),
});
export type SoilAnalysisInput = z.infer<typeof SoilAnalysisInputSchema>;

// Defines the output schema for the AI's analysis.
const SoilAnalysisOutputSchema = z.object({
  fertilityIndex: z.number().describe('A score from 0 to 100 representing the overall soil fertility.'),
  fertilityStatus: z.string().describe('A qualitative summary of the soil fertility (e.g., "Good", "Moderate", "Poor").'),
  soilType: z.string().describe('The likely soil type based on the provided data (e.g., "Sandy Loam", "Clay").'),
  recommendedCrops: z.array(z.string()).describe('A list of crops suitable for this soil condition and region.'),
  fertilizerPlan: z.string().describe('A detailed fertilizer plan including type, dosage, and frequency. Formatted as Markdown.'),
  organicAdvice: z.string().describe('Actionable suggestions for improving soil health using organic methods. Formatted as Markdown.'),
  warnings: z.array(z.string()).describe('Any critical warnings or potential issues (e.g., "High salinity detected").'),
  explanation: z.string().describe('A clear, simple explanation of why these recommendations were made, based on the input data.'),
});
export type SoilAnalysisOutput = z.infer<typeof SoilAnalysisOutputSchema>;

/**
 * An async function that takes soil data as input and returns a comprehensive AI-powered analysis.
 * @param {SoilAnalysisInput} input - The structured soil data.
 * @returns {Promise<SoilAnalysisOutput>} The AI-generated soil analysis.
 */
export async function analyzeSoilCard(input: SoilAnalysisInput): Promise<SoilAnalysisOutput> {
  return soilCardAnalysisFlow(input);
}

// Defines the Genkit prompt for the AI model.
const soilAnalysisPrompt = ai.definePrompt({
  name: 'soilAnalysisPrompt',
  input: { schema: SoilAnalysisInputSchema },
  output: { schema: SoilAnalysisOutputSchema },
  prompt: `You are an expert soil scientist and agronomist for Indian agriculture. Your task is to analyze the provided soil test report data and generate a comprehensive, easy-to-understand report for a farmer.

  Your response MUST be in the specified language.

  **Soil Data for Analysis:**
  - pH Level: {{{pH}}}
  - Nitrogen (N): {{{N}}}
  - Phosphorus (P): {{{P}}}
  - Potassium (K): {{{K}}}
  - Organic Carbon (OC): {{{OC}}}%
  - Electrical Conductivity (EC): {{{EC}}} dS/m
  - Region: {{{region}}}

  **Your Task:**

  1.  **Calculate Fertility Index:** Based on the N, P, K, and OC values, calculate an overall fertility score from 0 to 100. A balanced, optimal soil would be close to 100.
  2.  **Determine Fertility Status:** Categorize the index into "Poor", "Moderate", or "Good".
  3.  **Identify Soil Type:** Infer the likely soil type based on the data and region.
  4.  **Recommend Crops:** Suggest 3-4 crops that are well-suited to these soil conditions and the specified region.
  5.  **Create a Fertilizer Plan:** Provide a clear, actionable fertilizer plan. Mention specific fertilizer types (e.g., Urea, DAP, MOP), recommended dosage (in kg/acre), and application timing/frequency. Format this as a Markdown list.
  6.  **Provide Organic Advice:** Suggest practical, organic methods to improve soil health, especially focusing on improving OC if it is low. Format this as a Markdown list.
  7.  **Identify Warnings:** Note any critical issues, such as very high/low pH, high EC (salinity), or severe nutrient deficiencies.
  8.  **Generate Explanation:** In simple terms, explain *why* you are making these recommendations. For example, "Your soil's pH is slightly acidic, which is why we recommend crops like potatoes. The low Nitrogen level is addressed by the Urea application in the fertilizer plan."

  Language for response: {{{language}}}
  `,
});

// Defines the Genkit flow that orchestrates the AI analysis.
const soilCardAnalysisFlow = ai.defineFlow(
  {
    name: 'soilCardAnalysisFlow',
    inputSchema: SoilAnalysisInputSchema,
    outputSchema: SoilAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await soilAnalysisPrompt(input);
    return output!;
  }
);
