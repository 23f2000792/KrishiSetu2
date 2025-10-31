'use server';
/**
 * @fileOverview An AI agent that synthesizes community discussions into a knowledge graph.
 *
 * - generateCommunityInsights - A function that generates a digest of community wisdom.
 * - CommunityInsightsInput - The input type for the insight generation.
 * - CommunityInsightsOutput - The output type for the insight generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getPostsByTopic } from '@/services/community-service';
import { getInitializedFirebaseAdmin } from '@/firebase/admin';

const CommunityInsightsInputSchema = z.object({
  topic: z.string().describe('The topic to search for in community posts (e.g., "Paddy Leaf Blast", "Wheat irrigation").'),
  region: z.string().optional().describe('An optional region to filter the posts by (e.g., "Haryana").'),
  language: z.string().describe('The language for the response (e.g., "English", "Hindi").'),
});
export type CommunityInsightsInput = z.infer<typeof CommunityInsightsInputSchema>;

const ExtractedSolutionSchema = z.object({
    solution: z.string().describe("A concise summary of a specific solution or advice. (e.g., 'Apply a spray of propiconazole 25% EC at 200ml/acre')."),
    farmerCount: z.number().describe("The number of farmers who mentioned or upvoted this specific solution."),
});

const CommunityInsightsOutputSchema = z.object({
  totalFarmers: z.number().describe('The total number of unique farmers who discussed this topic.'),
  summary: z.string().describe("A one-sentence summary of the community's general sentiment or consensus on the topic."),
  topSolutions: z.array(ExtractedSolutionSchema).describe('A ranked list of the top 2-3 most common or validated solutions discussed by the community.'),
});
export type CommunityInsightsOutput = z.infer<typeof CommunityInsightsOutputSchema>;

export async function generateCommunityInsights(input: CommunityInsightsInput): Promise<CommunityInsightsOutput> {
  return communityInsightsFlow(input);
}

const getCommunityPostsTool = ai.defineTool(
    {
        name: 'getCommunityPosts',
        description: 'Fetches community posts and comments related to a specific agricultural topic.',
        inputSchema: z.object({
            topic: z.string(),
            region: z.string().optional(),
        }),
        outputSchema: z.array(z.any()),
    },
    async ({ topic, region }) => {
        const { firestore } = getInitializedFirebaseAdmin();
        const posts = await getPostsByTopic(firestore, topic, region);
        // Return a simplified version for the model
        return posts.map(p => ({
            content: p.content,
            upvotes: p.upvotes,
            comments: p.comments.map(c => c.comment).join('; '),
        }));
    }
);


const prompt = ai.definePrompt({
  name: 'communityInsightsPrompt',
  input: { schema: CommunityInsightsInputSchema },
  output: { schema: CommunityInsightsOutputSchema },
  tools: [getCommunityPostsTool],
  prompt: `You are an expert agricultural analyst. Your task is to synthesize a collection of community forum posts about a specific topic into a structured "Community Insights Digest".

  **Process:**
  1.  **Fetch Data:** You MUST use the \`getCommunityPosts\` tool to fetch all relevant posts for the given topic and optional region.
  2.  **Analyze Discussions:** Read through the post content, comments, and consider the upvotes.
  3.  **Count Participants:** Determine the total number of unique farmers involved in these discussions.
  4.  **Identify Key Solutions:** Identify the top 2-3 distinct solutions, remedies, or pieces of advice that are mentioned most frequently or have the most agreement (e.g., through upvotes or positive comments).
  5.  **Quantify Consensus:** For each top solution, count how many farmers appear to advocate for or agree with it.
  6.  **Summarize Sentiment:** Write a single sentence that captures the overall sentiment or consensus (e.g., "Most farmers agree that early application of fungicide is crucial.").
  7.  **Format Output:** Structure your findings strictly according to the \`CommunityInsightsOutput\` schema. The entire response must be in the specified language.

  **Data for Analysis:**
  - Topic: {{{topic}}}
  - Region: {{{region}}}
  - Language for response: {{{language}}}

  Generate the Community Insights Digest now.
  `,
});

const communityInsightsFlow = ai.defineFlow(
  {
    name: 'communityInsightsFlow',
    inputSchema: CommunityInsightsInputSchema,
    outputSchema: CommunityInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
