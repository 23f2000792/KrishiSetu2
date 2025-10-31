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
} from 'firebase/firestore';
import { useCollection, type UseCollectionResult } from './use-collection';
import { useAuth } from '@/contexts/auth-context';
import { useFirebase } from '../provider';

type QueryFn = typeof firestoreQuery;
type OrderByFn = (fieldPath: string, directionStr?: OrderByDirection) => QueryConstraint;
type LimitFn = (limit: number) => QueryConstraint;


/**
 * A hook to fetch a collection filtered by the currently authenticated user's ID.
 *
 * This simplifies the common pattern of fetching data owned by a user.
 * It ensures that the query is only executed when a user is authenticated.
 *
 * @template T - The type of the documents in the collection.
 * @param {string} collectionName - The name of the Firestore collection to query.
 * @param {QueryFn} queryFn - The `query` function from 'firebase/firestore'.
 * @param {OrderByFn} orderByFn - The `orderBy` function from 'firebase/firestore'.
 * @param {LimitFn} limitFn - The `limit` function from 'firebase/firestore'.
 * @param {QueryConstraint[]} queryConstraints - Optional additional Firestore query constraints (e.g., orderBy, limit).
 * @returns {UseCollectionResult<T>} An object containing the data, loading state, and any errors.
 */
export function useUserCollection<T>(
  collectionName: string,
  queryFn: QueryFn,
  orderByFn?: OrderByFn,
  orderByArgs?: [string, OrderByDirection],
  limitFn?: LimitFn,
  limitArgs?: number
): UseCollectionResult<T> {
  const { user } = useAuth();
  const { firestore } = useFirebase();

  const userQuery = useMemoFirebase(() => {
    if (!user || !firestore) {
      return null;
    }

    const constraints: QueryConstraint[] = [where('userId', '==', user.id)];
    if (orderByFn && orderByArgs) {
        constraints.push(orderByFn(...orderByArgs));
    }
    if (limitFn && limitArgs) {
        constraints.push(limitFn(limitArgs));
    }
    
    return queryFn(
      collection(firestore, collectionName),
      ...constraints
    );
  // NOTE: The dependency array must be stable. The functions are stable, and the args should be too.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, firestore, collectionName, orderByArgs, limitArgs]);

  // The type assertion is safe because useCollection handles null queries.
  return useCollection<T>(userQuery as Query<DocumentData> | null);
}
