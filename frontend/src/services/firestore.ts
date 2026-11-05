import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  limit as fsLimit,
  query as fsQuery,
  type DocumentData,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

export interface UserProfileData {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  role?: string;
  updatedAt?: string;
}

export interface StoredSessionItem {
  id: string;
  user_id: string;
  title: string;
  query: string;
  created_at: string;
  claims_count: number;
  is_mock: boolean;
  // Backward compatibility convenience accessors
  userId: string;
  createdAt: string;
  claimsCount: number;
}

export const fetchUserProfile = async (uid: string): Promise<UserProfileData | null> => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) return null;
    const data = snap.data() as DocumentData;
    return {
      uid,
      email: data.email ?? null,
      displayName: data.displayName ?? null,
      role: data.role ?? 'researcher',
      updatedAt: data.updatedAt ?? undefined,
    };
  } catch (error) {
    console.error(`Error fetching Firestore profile for ${uid}:`, error);
    return null;
  }
};

export const saveUserProfile = async (
  uid: string,
  profileData: Partial<UserProfileData>
): Promise<void> => {
  if (!isFirebaseConfigured() || !db) return;
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(
      userDocRef,
      {
        ...profileData,
        uid,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error(`Error updating Firestore profile for ${uid}:`, error);
    throw error;
  }
};

export const fetchUserSessions = async (
  uid: string,
  maxCount: number = 20
): Promise<StoredSessionItem[]> => {
  if (!isFirebaseConfigured() || !db) return [];
  try {
    const sessionsCol = collection(db, 'users', uid, 'sessions');
    const q = fsQuery(sessionsCol, fsLimit(maxCount));
    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data = d.data() as DocumentData;
      const createdAt = data.created_at || data.createdAt || new Date().toISOString();
      const claimsCount = data.claims_count ?? data.claimsCount ?? 0;
      const userId = data.user_id || data.userId || uid;
      const isMock = Boolean(data.is_mock);

      return {
        id: d.id,
        user_id: userId,
        userId: userId,
        title: data.title || 'Untitled Session',
        query: data.query || '',
        created_at: createdAt,
        createdAt: createdAt,
        claims_count: claimsCount,
        claimsCount: claimsCount,
        is_mock: isMock,
      };
    });
  } catch (error) {
    console.error(`Error fetching Firestore sessions for ${uid}:`, error);
    return [];
  }
};

export const saveUserSession = async (
  uid: string,
  session: {
    id?: string;
    title: string;
    query: string;
    claims_count?: number;
    claimsCount?: number;
    is_mock?: boolean;
  }
): Promise<string> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firestore is not configured. Configure Firebase environment variables to save sessions.');
  }

  const sessionId = session.id || `sess_${Date.now()}`;
  const sessionDocRef = doc(db, 'users', uid, 'sessions', sessionId);
  const claimsCount = session.claims_count ?? session.claimsCount ?? 0;

  await setDoc(sessionDocRef, {
    title: session.title,
    query: session.query,
    user_id: uid,
    created_at: new Date().toISOString(),
    claims_count: claimsCount,
    is_mock: session.is_mock ?? false,
  });

  return sessionId;
};

