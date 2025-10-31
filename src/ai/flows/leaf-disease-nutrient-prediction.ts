'use server';
/**
 * @fileOverview This file defines a Genkit flow for predicting leaf diseases and nutrient deficiencies from an image.
 *
 * The flow takes an image of a leaf as input and returns a prediction of potential diseases or nutrient deficiencies.
 *
 * @exported diagnoseLeaf - An async function that takes LeafDiseaseNutrientPredictionInput as input and returns LeafDiseaseNutrientPredictionOutput.
 * @exported LeafDiseaseNutrientPredictionInput - The input type for the diagnoseLeaf function.
 * @exported LeafDiseaseNutrientPredictionOutput - The output type for the diagnoseLeaf function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LeafDiseaseNutrientPredictionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a leaf, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type LeafDiseaseNutrientPredictionInput = z.infer<
  typeof LeafDiseaseNutrientPredictionInputSchema
>;

const LeafDiseaseNutrientPredictionOutputSchema = z.object({
  prediction: z.string().describe('The predicted disease or nutrient deficiency.'),
  confidence: z.number().describe('The confidence level of the prediction (0-1).'),
  recommendedSteps: z.string().describe('Recommended steps to address the issue.'),
});

export type LeafDiseaseNutrientPredictionOutput = z.infer<
  typeof LeafDiseaseNutrientPredictionOutputSchema
>;

export async function diagnoseLeaf(
  input: LeafDiseaseNutrientPredictionInput
): Promise<LeafDiseaseNutrientPredictionOutput> {
  return leafDiseaseNutrientPredictionFlow(input);
}

const leafDiseaseNutrientPredictionPrompt = ai.definePrompt({
  name: 'leafDiseaseNutrientPredictionPrompt',
  input: {schema: LeafDiseaseNutrientPredictionInputSchema},
  output: {schema: LeafDiseaseNutrientPredictionOutputSchema},
  prompt: `You are an expert in plant pathology and nutrient deficiencies.

  Analyze the provided image of a leaf and provide a prediction of potential diseases or nutrient deficiencies.
  Also, provide a confidence level for your prediction (0-1) and recommended steps to address the issue.

  Image: {{media url=photoDataUri}}
  `,
});

const leafDiseaseNutrientPredictionFlow = ai.defineFlow(
  {
    name: 'leafDiseaseNutrientPredictionFlow',
    inputSchema: LeafDiseaseNutrientPredictionInputSchema,
    outputSchema: LeafDiseaseNutrientPredictionOutputSchema,
  },
  async input => {
    const {output} = await leafDiseaseNutrientPredictionPrompt(input);
    return output!;
  }
);
