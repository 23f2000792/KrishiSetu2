import { collection, query, where, getDocs, Firestore } from 'firebase/firestore';
import type { Post } from '@/lib/types';

/**
 * Fetches posts from the community feed that contain a specific topic keyword.
 * @param firestore The Firestore database instance from the Admin SDK.
 * @param topic The keyword or topic to search for in post content.
 * @param region An optional region to filter posts by.
 * @returns A promise that resolves to an array of matching posts.
 */
export async function getPostsByTopic(firestore: Firestore, topic: string, region?: string): Promise<Post[]> {
  if (!topic) {
    return [];
  }
  
  // NOTE: A production app would use a full-text search solution like Algolia or Typesense
  // for this kind of query, as Firestore does not support substring searches natively.
  // For this demo, we will fetch all posts and filter them in memory.
  // This is NOT scalable and should not be used in a real, large-scale application.
  
  const postsRef = collection(firestore, 'posts');
  let q = query(postsRef);

  // If a region is provided, add a where clause. This part is efficient.
  if (region) {
    q = query(postsRef, where('region', '==', region));
  }
  
  const postsSnapshot = await getDocs(q);
  const allPosts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));

  // In-memory filtering (the non-scalable part)
  const lowercasedTopic = topic.toLowerCase();
  const filteredPosts = allPosts.filter(post => 
    post.content.toLowerCase().includes(lowercasedTopic)
  );

  return filteredPosts;
}
