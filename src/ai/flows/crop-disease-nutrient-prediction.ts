'use server';
/**
 * @fileOverview This file defines a Genkit flow for predicting crop diseases and nutrient deficiencies from an image.
 *
 * The flow takes an image of a crop as input and returns a prediction of potential diseases or nutrient deficiencies.
 *
 * @exported diagnoseCrop - An async function that takes CropDiseaseNutrientPredictionInput as input and returns CropDiseaseNutrientPredictionOutput.
 * @exported CropDiseaseNutrientPredictionInput - The input type for the diagnoseCrop function.
 * @exported CropDiseaseNutrientPredictionOutput - The output type for the diagnoseCrop function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropDiseaseNutrientPredictionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
    language: z.string().describe('The language for the response (e.g., "English", "Hindi", "Punjabi").'),
});
export type CropDiseaseNutrientPredictionInput = z.infer<
  typeof CropDiseaseNutrientPredictionInputSchema
>;

const CropDiseaseNutrientPredictionOutputSchema = z.object({
  prediction: z.string().describe('A short, clear title of the predicted disease, nutrient deficiency, or "Healthy". Max 3 words.'),
  confidence: z.number().describe('The confidence level of the prediction (0-1).'),
  recommendedSteps: z.string().describe('A concise, actionable paragraph of recommended steps to address the issue. Start with the most important action.'),
});

export type CropDiseaseNutrientPredictionOutput = z.infer<
  typeof CropDiseaseNutrientPredictionOutputSchema
>;

export async function diagnoseCrop(
  input: CropDiseaseNutrientPredictionInput
): Promise<CropDiseaseNutrientPredictionOutput> {
  return cropDiseaseNutrientPredictionFlow(input);
}

const cropDiseaseNutrientPredictionPrompt = ai.definePrompt({
  name: 'cropDiseaseNutrientPredictionPrompt',
  input: {schema: CropDiseaseNutrientPredictionInputSchema},
  output: {schema: CropDiseaseNutrientPredictionOutputSchema},
  prompt: `You are an expert in plant pathology and nutrient deficiencies for Indian agriculture.

  Analyze the provided image of a crop and provide a prediction of potential diseases or nutrient deficiencies.
  Your entire response (prediction title and recommended steps) MUST be in the specified language.
  Your prediction should be a short, clear title (max 3 words), like "Wheat Leaf Rust" or "Nitrogen Deficiency". If the plant is healthy, predict "Healthy Crop".
  Provide a confidence level for your prediction (from 0.0 to 1.0).
  Also, provide a concise, actionable paragraph of recommended steps to address the issue. Start with the most important action. The recommendations should be practical for a small to medium-scale farmer in India.

  Language for response: {{{language}}}
  Image: {{media url=photoDataUri}}
  `,
});

const cropDiseaseNutrientPredictionFlow = ai.defineFlow(
  {
    name: 'cropDiseaseNutrientPredictionFlow',
    inputSchema: CropDiseaseNutrientPredictionInputSchema,
    outputSchema: CropDiseaseNutrientPredictionOutputSchema,
  },
  async input => {
    const {output} = await cropDiseaseNutrientPredictionPrompt(input);
    return output!;
  }
);
