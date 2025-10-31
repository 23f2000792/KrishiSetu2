import { z } from 'zod';

export const costInputSchema = {
  seedCost: z.coerce.number().min(0, "Cost must be a positive number.").describe('Cost of seeds.'),
  fertilizerCost: z.coerce.number().min(0, "Cost must be a positive number.").describe('Cost of fertilizers.'),
  pesticideCost: z.coerce.number().min(0, "Cost must be a positive number.").describe('Cost of pesticides/herbicides.'),
  laborCost: z.coerce.number().min(0, "Cost must be a positive number.").describe('Cost of labor.'),
  irrigationCost: z.coerce.number().min(0, "Cost must be a positive number.").describe('Cost of irrigation (water/electricity).'),
  transportCost: z.coerce.number().min(0, "Cost must be a positive number.").describe('Cost of transporting goods to market.'),
  otherCost: z.coerce.number().min(0, "Cost must be a positive number.").describe('Any other miscellaneous costs.'),
};

export const costInputObject = z.object(costInputSchema);
export type CostInput = z.infer<typeof costInputObject>;
