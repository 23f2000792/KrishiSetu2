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
});
export type CropDiseaseNutrientPredictionInput = z.infer<
  typeof CropDiseaseNutrientPredictionInputSchema
>;

const CropDiseaseNutrientPredictionOutputSchema = z.object({
  prediction: z.string().describe('The predicted disease or nutrient deficiency.'),
  confidence: z.number().describe('The confidence level of the prediction (0-1).'),
  recommendedSteps: z.string().describe('Recommended steps to address the issue.'),
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
  prompt: `You are an expert in plant pathology and nutrient deficiencies.

  Analyze the provided image of a crop and provide a prediction of potential diseases or nutrient deficiencies.
  Also, provide a confidence level for your prediction (0-1) and recommended steps to address the issue.

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
