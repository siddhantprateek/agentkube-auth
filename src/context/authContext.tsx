// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const DASHBOARD_URL = import.meta.env.VITE_SUPABASE_URL;
const AUTH_URL = import.meta.env.VITE_AUTH_URL;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        // Redirect to dashboard if on auth pages
        const currentPath = window.location.pathname;
        if (currentPath === '/login' || currentPath === '/signup' || currentPath === '/') {
          window.location.href = DASHBOARD_URL;
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: DASHBOARD_URL,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error instanceof Error ? error.message : 'An error occurred');
      throw error;
    }
  };

  const signInWithGithub = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: DASHBOARD_URL,
          scopes: 'read:user user:email'
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Github:', error instanceof Error ? error.message : 'An error occurred');
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = `${AUTH_URL}/login`;
    } catch (error) {
      console.error('Error signing out:', error instanceof Error ? error.message : 'An error occurred');
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signInWithGithub,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};