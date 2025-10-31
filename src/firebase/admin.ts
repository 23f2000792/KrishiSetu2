import { initializeApp, getApps, getApp, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { firebaseConfig } from './config';

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
    // In a server environment, you can use service accounts or other auth strategies.
    // For simplicity in this context, we'll rely on the client-side config,
    // though this is not typical for admin SDK usage.
    // In a real production server, you would use:
    // initializeApp({ credential: admin.credential.applicationDefault() });
    const app = initializeApp({
      projectId: firebaseConfig.projectId,
    });
    const firestore = getFirestore(app);
    services = { app, firestore };
    return services;
  }

  const app = getApp();
  const firestore = getFirestore(app);
  services = { app, firestore };
  return services;
}
