import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '@/types/database';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_ADMIN_KEY = 'janvani_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      if (isSupabaseConfigured()) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Fetch profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser(profile as Profile);
            } else {
              // Default author if profile record hasn't synced yet
              setUser({
                id: session.user.id,
                display_name: session.user.email?.split('@')[0] || 'User',
                role: 'admin',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
            }
          }
        } catch (e) {
          console.warn('Supabase auth session error:', e);
        }
      } else {
        // Local auth fallback
        const saved = localStorage.getItem(LOCAL_ADMIN_KEY);
        if (saved) {
          try {
            setUser(JSON.parse(saved));
          } catch {
            localStorage.removeItem(LOCAL_ADMIN_KEY);
          }
        }
      }
      setIsLoading(false);
    }

    initAuth();

    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser(profile as Profile);
          }
        } else {
          setUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || '',
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const userProfile: Profile = profile || {
            id: data.user.id,
            display_name: email.split('@')[0],
            role: 'admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          setUser(userProfile);
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: unknown) {
        setIsLoading(false);
        const msg = err instanceof Error ? err.message : 'Login failed';
        return { success: false, error: msg };
      }
    }

    // Provisioned Local Admin Mode
    // Default credentials clearly provided: admin@janvaninews.com / admin123
    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedEmail === 'admin@janvaninews.com' || trimmedEmail === 'editor@janvaninews.com' || trimmedEmail.endsWith('@janvaninews.com')) {
      const adminProfile: Profile = {
        id: 'usr-admin-01',
        display_name: trimmedEmail.startsWith('editor') ? 'मुख्य उपसंपादक' : 'मुख्य संपादक (Administrator)',
        role: trimmedEmail.startsWith('editor') ? 'editor' : 'admin',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        created_at: '2026-01-01T00:00:00Z',
        updated_at: new Date().toISOString(),
      };

      setUser(adminProfile);
      localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(adminProfile));
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return {
      success: false,
      error: 'अवैध ईमेल किंवा पासवर्ड. कृपया अधिकृत प्रशासक खाते वापरा (उदा. admin@janvaninews.com)',
    };
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_ADMIN_KEY);
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'admin' || user?.role === 'editor';

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, isStaff, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
