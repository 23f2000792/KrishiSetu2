'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/crop-disease-nutrient-prediction.ts';
import '@/ai/flows/suggest-quick-prompts.ts';
import '@/ai/flows/ai-copilot-agri-advisory.ts';
import '@/ai/flows/soil-card-analyzer.ts';
import '@/ai/flows/market-analyst-flow.ts';
import '@/ai/flows/crop-growth-simulation.ts';
import '@/ai/flows/disease-outbreak-prediction.ts';
