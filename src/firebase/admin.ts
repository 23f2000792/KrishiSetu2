import { initializeApp, getApps, getApp, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

interface FirebaseAdminServices {
  app: App;
  firestore: Firestore;
}

let services: FirebaseAdminServices | null = null;

/**
 * Initializes the Firebase Admin SDK if not already initialized and returns
 * the Firestore service. This function ensures that initialization only
 * happens once.
 *
 * @returns An object containing the initialized Firestore instance.
 */
export function getInitializedFirebaseAdmin(): FirebaseAdminServices {
  if (services) {
    return services;
  }

  if (getApps().length === 0) {
    // In a server environment like Cloud Run or Cloud Functions (which Genkit uses),
    // initializeApp() can be called without arguments to use Application Default Credentials.
    const app = initializeApp();
    const firestore = getFirestore(app);
    services = { app, firestore };
    return services;
  }

  const app = getApp();
  const firestore = getFirestore(app);
  services = { app, firestore };
  return services;
}
