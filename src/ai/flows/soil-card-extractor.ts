'use server';
/**
 * @fileOverview This file defines a Genkit flow for extracting structured data from an image of a soil health card.
 *
 * It takes an image as input and returns a JSON object with the key soil parameters.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Defines the input schema for the extractor flow.
const ExtractorInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "An image of a soil health card, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractorInput = z.infer<typeof ExtractorInputSchema>;

// Defines the output schema for the extracted data.
const ExtractorOutputSchema = z.object({
  pH: z.number().describe('The pH level of the soil (e.g., 6.8).'),
  N: z.string().describe('Nitrogen level, typically "Low", "Medium", or "High".'),
  P: z.string().describe('Phosphorus level, typically "Low", "Medium", or "High".'),
  K: z.string().describe('Potassium level, typically "Low", "Medium", or "High".'),
  OC: z.number().describe('Organic Carbon percentage (e.g., 0.55).'),
  EC: z.number().describe('Electrical Conductivity (e.g., 0.25).'),
});
export type ExtractorOutput = z.infer<typeof ExtractorOutputSchema>;

/**
 * An async function that takes a soil card image and returns structured data.
 * @param {ExtractorInput} input - The image data URI.
 * @returns {Promise<ExtractorOutput>} The extracted soil data.
 */
export async function extractSoilCardData(input: ExtractorInput): Promise<ExtractorOutput> {
  return soilCardExtractorFlow(input);
}

// Defines the Genkit prompt for the AI model.
const extractorPrompt = ai.definePrompt({
  name: 'soilCardExtractorPrompt',
  input: { schema: ExtractorInputSchema },
  output: { schema: ExtractorOutputSchema },
  prompt: `You are an expert data extraction AI. Your task is to analyze the provided image of a soil health card and extract the key soil parameters.

  You must find the values for the following parameters in the image:
  - pH (acidity/alkalinity)
  - Nitrogen (N) - This is often a qualitative value like "Low", "Medium", or "High".
  - Phosphorus (P) - Also often qualitative.
  - Potassium (K) - Also often qualitative.
  - Organic Carbon (OC) - A percentage value.
  - Electrical Conductivity (EC) - A numerical value.

  Return the extracted data as a JSON object matching the defined schema.

  Image of Soil Card: {{media url=photoDataUri}}
  `,
});

// Defines the Genkit flow that orchestrates the data extraction.
const soilCardExtractorFlow = ai.defineFlow(
  {
    name: 'soilCardExtractorFlow',
    inputSchema: ExtractorInputSchema,
    outputSchema: ExtractorOutputSchema,
  },
  async (input) => {
    const { output } = await extractorPrompt(input);
    return output!;
  }
);
