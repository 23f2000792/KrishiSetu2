import { marketPrices } from '@/lib/data';
import type { PricePoint } from '@/lib/types';

type MarketData = {
    latestPrice: number;
    prices: PricePoint[];
} | null;

/**
 * Simulates fetching the latest market price and historical data for a given crop and region.
 * In a real-world application, this would call an external API.
 * @param crop The name of the crop.
 * @param region The region to check the price for.
 * @returns An object with the latest price and 30-day history, or null if not found.
 */
export async function getMarketData(crop: string, region: string): Promise<MarketData> {
  const normalizedCrop = crop.toLowerCase();
  const normalizedRegion = region.toLowerCase();

  const marketData = marketPrices.find(
    (item) =>
      item.crop.toLowerCase().includes(normalizedCrop) &&
      (item.region.toLowerCase() === normalizedRegion || region === '')
  );

  if (marketData && marketData.prices.length > 0) {
    return {
        latestPrice: marketData.prices[marketData.prices.length - 1].price,
        prices: marketData.prices,
    }
  }

  // Fallback: If region-specific price is not found, check for any price for that crop
  const anyRegionMarketData = marketPrices.find(item => item.crop.toLowerCase().includes(normalizedCrop));
  if (anyRegionMarketData && anyRegionMarketData.prices.length > 0) {
    return {
        latestPrice: anyRegionMarketData.prices[anyRegionMarketData.prices.length - 1].price,
        prices: anyRegionMarketData.prices,
    }
  }

  return null;
}
