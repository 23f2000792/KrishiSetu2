import { marketPrices } from '@/lib/data';

/**
 * Simulates fetching the latest market price for a given crop and region.
 * In a real-world application, this would call an external API.
 * @param crop The name of the crop.
 * @param region The region to check the price for.
 * @returns The latest price, or null if not found.
 */
export async function getMarketPrice(crop: string, region: string): Promise<number | null> {
  const normalizedCrop = crop.toLowerCase();
  const normalizedRegion = region.toLowerCase();

  const marketData = marketPrices.find(
    (item) =>
      item.crop.toLowerCase() === normalizedCrop &&
      item.region.toLowerCase() === normalizedRegion
  );

  if (marketData && marketData.prices.length > 0) {
    // Return the most recent price
    return marketData.prices[marketData.prices.length - 1].price;
  }

  // Fallback: If region-specific price is not found, check for any price for that crop
  const anyRegionMarketData = marketPrices.find(item => item.crop.toLowerCase() === normalizedCrop);
  if (anyRegionMarketData && anyRegionMarketData.prices.length > 0) {
    return anyRegionMarketData.prices[anyRegionMarketData.prices.length - 1].price;
  }

  return null;
}
