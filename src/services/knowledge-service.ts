import { collection, query, where, orderBy, limit, getDocs, Firestore } from 'firebase/firestore';
import type { ScanResult, SoilReport } from '@/lib/types';

/**
 * Fetches the most recent soil reports and crop scans for a given user.
 * @param firestore The Firestore database instance.
 * @param userId The ID of the user whose data to fetch.
 * @returns An object containing lists of recent soil reports and scans.
 */
export async function getFarmerKnowledgeGraph(firestore: Firestore, userId: string) {
  const now = new Date();
  const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));

  // Fetch recent soil reports
  const soilReportsQuery = query(
    collection(firestore, 'soil_reports'),
    where('userId', '==', userId),
    where('uploadedAt', '>=', oneYearAgo),
    orderBy('uploadedAt', 'desc'),
    limit(2)
  );
  const soilReportsSnapshot = await getDocs(soilReportsQuery);
  const soilReports = soilReportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SoilReport));

  // Fetch recent crop scans
  const scansQuery = query(
    collection(firestore, 'scans'),
    where('userId', '==', userId),
    where('createdAt', '>=', oneYearAgo),
    orderBy('createdAt', 'desc'),
    limit(10)
  );
  const scansSnapshot = await getDocs(scansQuery);
  const scans = scansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScanResult));

  return {
    soilReports,
    scans,
  };
}
