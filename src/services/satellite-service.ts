import { PlaceHolderImages } from '@/lib/placeholder-images';

type DataType = 'ndvi' | 'rainfall';
type TimePeriod = 'current' | 'previous';

/**
 * Simulates fetching a satellite map image for a given data type and time period.
 * In a real-world application, this would call an external API like Google Earth Engine
 * or Sentinel Hub and generate or retrieve map tiles.
 * @param params - The parameters for the satellite image.
 * @returns A promise that resolves to an object containing the image URL.
 */
export async function getSatelliteImage(params: {
    region: string;
    dataType: DataType;
    timePeriod: TimePeriod;
}): Promise<{ imageUrl: string }> {
    await new Promise(resolve => setTimeout(resolve, 750)); // Simulate network delay

    // This is a mock implementation. It returns a pre-selected placeholder image.
    // A real implementation would generate a unique image based on all params.
    let imageId;
    if (params.dataType === 'ndvi') {
        imageId = params.timePeriod === 'current' ? 'feature_scanner' : 'leaf_rust';
    } else { // rainfall
        imageId = params.timePeriod === 'current' ? 'feature_market' : 'vegetables';
    }

    const image = PlaceHolderImages.find(p => p.id === imageId);
    
    if (image) {
        return { imageUrl: image.imageUrl };
    }

    // Fallback image
    return { imageUrl: 'https://placehold.co/600x600/e2e8f0/e2e8f0' };
}

/**
 * Mocks fetching aggregated satellite data for a region.
 * @param region The geographical region.
 * @param dataType The type of data to fetch.
 * @returns A promise that resolves to a mock data string.
 */
export async function getMockSatelliteAnalytics(
    region: string,
    dataType: DataType,
    timePeriod: TimePeriod
): Promise<string> {
     await new Promise(resolve => setTimeout(resolve, 200));

    if (dataType === 'ndvi') {
        if (timePeriod === 'current') {
            return "Current NDVI shows an average value of 0.78, indicating healthy vegetation. However, there is a small patch in the northwest corner with a lower NDVI of 0.5, suggesting potential stress.";
        } else {
            return "Previous season's NDVI at this time was slightly lower, averaging 0.72. The stressed patch in the northwest was not present.";
        }
    } else { // rainfall
        if (timePeriod === 'current') {
            return "Total rainfall in the last 30 days is 45mm, which is 15% below the historical average for this period. Soil moisture appears to be low across the eastern half of the farm.";
        } else {
            return "Previous season's rainfall in the same period was 65mm, well above average.";
        }
    }
}
