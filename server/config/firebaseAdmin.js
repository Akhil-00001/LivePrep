import { initializeApp, getApps } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

// Initialised lazily: ES module imports run before dotenv.config() in index.js,
// so FIREBASE_PROJECT_ID is not available at import time.
// verifyIdToken only needs the project ID (it checks the signature against
// Google's public keys), so no service-account credentials are required.
export const getFirebaseAuth = () => {
  if (!process.env.FIREBASE_PROJECT_ID) {
    throw new Error("FIREBASE_PROJECT_ID is not set")
  }
  const app = getApps()[0] || initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID })
  return getAuth(app)
}
