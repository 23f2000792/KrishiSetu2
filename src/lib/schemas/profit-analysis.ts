import { z } from 'zod';

export const costInputSchema = {
  seedCost: z.number().describe('Cost of seeds.'),
  fertilizerCost: z.number().describe('Cost of fertilizers.'),
  pesticideCost: z.number().describe('Cost of pesticides/herbicides.'),
  laborCost: z.number().describe('Cost of labor.'),
  irrigationCost: z.number().describe('Cost of irrigation (water/electricity).'),
  transportCost: z.number().describe('Cost of transporting goods to market.'),
  otherCost: z.number().describe('Any other miscellaneous costs.'),
};

export const costInputObject = z.object(costInputSchema);
export type CostInput = z.infer<typeof costInputObject>;
