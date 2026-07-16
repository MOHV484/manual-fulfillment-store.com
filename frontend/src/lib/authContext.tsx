'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { User, Session } from '@supabase/supabase-js';
import { api } from './apiClient';

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'client' | 'moderator' | 'super_admin';
  status: 'active' | 'suspended';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUp: (params: { name: string; phone: string; email: string; password: string }) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const data = await api.get<{ user: Profile }>('/api/auth/me');
      setProfile(data.user);
    } catch (error) {
      console.error("خطأ أثناء جلب البروفايل من السيرفر:", error);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session) {
          await loadProfile();
        }
      } catch (error) {
        console.error("خطأ في تهيئة الحساب:", error);
      } finally {
        if (isMounted) {
          setLoading(false); // لا ينتهي التحميل إلا بعد جلب كل البيانات
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      
      setLoading(true); // نعيد حالة التحميل أثناء التحديث
      setSession(session);
      setUser(session?.user ?? null);

      if (session) {
        await loadProfile();
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async ({
    name,
    phone,
    email,
    password,
  }: {
    name: string;
    phone: string;
    email: string;
    password: string;
  }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } },
    });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });
    if (error) throw error;
  };

  const signInWithFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfile(null);
  };

  const isAdmin = profile?.role === 'moderator' || profile?.role === 'super_admin';
  const isSuperAdmin = profile?.role === 'super_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isAdmin,
        isSuperAdmin,
        signInWithPassword,
        signUp,
        signInWithGoogle,
        signInWithFacebook,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth يجب أن يتم استدعاؤه داخل نطاق AuthProvider المخصص.');
  }
  return context;
};
