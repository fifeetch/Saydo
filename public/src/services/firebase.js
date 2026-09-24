/** Hosting is the only active Firebase service for foundation release 0.1. */
export const FIREBASE_PROJECT_ID = 'saydo-helper';

/**
 * Firebase Hosting exposes its public Web App config after a Web App is registered.
 * Optional: the shell must work before registration, without making remote writes.
 * No SDK, Authentication, Firestore or Storage initialized in this release.
 */
export async function readHostingConfiguration(fetcher = fetch) {
  const response = await fetcher('/__/firebase/init.json');
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('La configuration Firebase est indisponible.');
  if (!response.headers.get('content-type')?.includes('application/json')) return null;
  const config = await response.json();
  if (config.projectId !== FIREBASE_PROJECT_ID) throw new Error('Le projet Firebase ne correspond pas à SayDo.');
  return config;
}
