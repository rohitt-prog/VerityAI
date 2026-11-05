import React, { useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase';
import { AuthContext, type AuthContextType } from './authContextInstance';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const configured = isFirebaseConfigured();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(() => configured && Boolean(auth));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!configured || !auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        setLoading(false);
      },
      (err) => {
        console.error('Firebase Auth state error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [configured]);

  const signIn = async (email: string, password: string): Promise<void> => {
    setError(null);
    if (!auth) {
      throw new Error('Firebase Authentication is not configured. Add your Firebase credentials to .env');
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed. Check your credentials.';
      setError(message);
      throw err;
    }
  };

  const signUp = async (email: string, password: string): Promise<void> => {
    setError(null);
    if (!auth) {
      throw new Error('Firebase Authentication is not configured. Add your Firebase credentials to .env');
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Try a different password.';
      setError(message);
      throw err;
    }
  };

  const signOut = async (): Promise<void> => {
    setError(null);
    if (!auth) return;
    try {
      await fbSignOut(auth);
      setCurrentUser(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign out failed.';
      setError(message);
      throw err;
    }
  };

  const getIdToken = async (): Promise<string | null> => {
    if (!currentUser) return null;
    try {
      return await currentUser.getIdToken();
    } catch (err) {
      console.error('Failed to retrieve Firebase ID token:', err);
      return null;
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextType = {
    currentUser,
    loading,
    error,
    isConfigured: configured,
    signIn,
    signUp,
    signOut,
    getIdToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
