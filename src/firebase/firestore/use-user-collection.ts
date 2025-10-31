'use client';
import { useMemo } from 'react';
import {
  collection,
  query,
  where,
  type CollectionReference,
  type Query,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { useCollection, type UseCollectionResult } from './use-collection';
import { useAuth } from '@/contexts/auth-context';
import { useFirebase } from '../provider';
import type { WithId } from './use-collection';

/**
 * A hook to fetch a collection filtered by the currently authenticated user's ID.
 *
 * This simplifies the common pattern of fetching data owned by a user.
 * It ensures that the query is only executed when a user is authenticated.
 *
 * @template T - The type of the documents in the collection.
 * @param {string} collectionName - The name of the Firestore collection to query.
 * @param {QueryConstraint[]} queryConstraints - Optional additional Firestore query constraints (e.g., orderBy, limit).
 * @returns {UseCollectionResult<T>} An object containing the data, loading state, and any errors.
 */
export function useUserCollection<T>(
  collectionName: string,
  ...queryConstraints: QueryConstraint[]
): UseCollectionResult<T> {
  const { user } = useAuth();
  const { firestore } = useFirebase();

  const userQuery = useMemo(() => {
    // If there's no user or firestore instance, return null to prevent the query from running.
    if (!user || !firestore) {
      return null;
    }

    // Construct the query with a 'where' clause to filter by the user's ID,
    // and apply any additional constraints provided.
    return query(
      collection(firestore, collectionName),
      where('userId', '==', user.id),
      ...queryConstraints
    );
  }, [user, firestore, collectionName, queryConstraints]);

  // Pass the memoized query to the underlying useCollection hook.
  // The type assertion is safe because useCollection handles null queries.
  return useCollection<T>(userQuery as Query<DocumentData> | null);
}
