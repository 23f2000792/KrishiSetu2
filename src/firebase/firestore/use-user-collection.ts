'use client';
import { useMemoFirebase } from '@/firebase/provider';
import {
  collection,
  query as firestoreQuery,
  where,
  type Query,
  type DocumentData,
  type QueryConstraint,
  type OrderByDirection,
  orderBy,
  limit,
} from 'firebase/firestore';
import { useCollection, type UseCollectionResult } from './use-collection';
import { useAuth } from '@/contexts/auth-context';
import { useFirebase } from '../provider';

/**
 * A hook to fetch a collection filtered by the currently authenticated user's ID.
 *
 * This simplifies the common pattern of fetching data owned by a user.
 * It ensures that the query is only executed when a user is authenticated.
 *
 * @template T - The type of the documents in the collection.
 * @param {string} collectionName - The name of the Firestore collection to query.
 * @param {object} [options] - Optional query options.
 * @param {[string, OrderByDirection]} [options.orderBy] - Field to order by and direction.
 * @param {number} [options.limit] - Number of documents to limit.
 * @returns {UseCollectionResult<T>} An object containing the data, loading state, and any errors.
 */
export function useUserCollection<T>(
  collectionName: string,
  options?: {
    orderBy?: [string, OrderByDirection];
    limit?: number;
  }
): UseCollectionResult<T> {
  const { user } = useAuth();
  const { firestore } = useFirebase();
  
  // Destructure for stable dependencies in useMemoFirebase
  const orderField = options?.orderBy?.[0];
  const orderDirection = options?.orderBy?.[1];
  const limitCount = options?.limit;

  const userQuery = useMemoFirebase(() => {
    if (!user || !firestore) {
      return null;
    }

    const constraints: QueryConstraint[] = [where('userId', '==', user.id)];
    if (orderField && orderDirection) {
      constraints.push(orderBy(orderField, orderDirection));
    }
    if (limitCount) {
      constraints.push(limit(limitCount));
    }
    
    return firestoreQuery(
      collection(firestore, collectionName),
      ...constraints
    );
  }, [user, firestore, collectionName, orderField, orderDirection, limitCount]);

  // The type assertion is safe because useCollection handles null queries.
  return useCollection<T>(userQuery as Query<DocumentData> | null);
}
