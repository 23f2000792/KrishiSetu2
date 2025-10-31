import { marketPrices } from '@/lib/data';
import type { MarketPrice, PricePoint } from '@/lib/types';

type MarketData = {
    latestPrice: number;
    prices: PricePoint[];
    forecast: number;
} | null;

/**
 * Simulates fetching the latest market price and historical data for a given crop and region.
 * In a real-world application, this would call an external API.
 * @param crop The name of the crop.
 * @param region The region to check the price for.
 * @returns An object with the latest price and 30-day history, or null if not found.
 */
export async function getMarketData(crop: string, region: string): Promise<MarketData> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

  const normalizedCrop = crop.toLowerCase();
  const normalizedRegion = region.toLowerCase();

  let marketData = marketPrices.find(
    (item) =>
      item.crop.toLowerCase() === normalizedCrop &&
      item.region.toLowerCase() === normalizedRegion
  );

  if (!marketData) {
    marketData = marketPrices.find(item => item.crop.toLowerCase() === normalizedCrop);
  }

  if (marketData && marketData.prices.length > 0) {
    return {
        latestPrice: marketData.prices[marketData.prices.length - 1].price,
        prices: marketData.prices,
        forecast: marketData.forecast,
    }
  }

  return null;
}

export async function getMarketDataForCrops(crops: string[], region: string): Promise<MarketPrice[]> {
    const results: MarketPrice[] = [];
    for (const crop of crops) {
        const data = await getMarketData(crop, region);
        if (data) {
            results.push({
                id: `market-${crop}`,
                crop,
                region,
                prices: data.prices,
                forecast: data.forecast,
            });
        }
    }
    return results;
}
