import { API_BASE_URL } from '@/constants/api';
import * as SecureStore from 'expo-secure-store';
import { createContext, useEffect, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';

export const TOKEN_KEY = 'student_service_token';

export type User = {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
  username?: string;
  phone?: string;
  website?: string;
  course?: string;
};

type AuthContextValue = {
  token: string | null;
  user: User | null;
  authLoading: boolean;
  login: (accessToken: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const normalizeUser = (
  userData: Record<string, any> | null | undefined,
  fallbackEmail?: string,
): User => ({
  id: userData?.id ?? userData?.userId ?? userData?._id,
  name:
    userData?.name ??
    userData?.fullName ??
    userData?.username ??
    fallbackEmail?.split('@')[0] ??
    'Student',
  email: userData?.email ?? fallbackEmail ?? '',
  role: userData?.role ?? 'Student',
  username: userData?.username,
  phone: userData?.phone,
  website: userData?.website,
  course: userData?.course ?? 'BS Information Technology',
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const login = async (accessToken: string, userData: User) => {
    try {
      if (Platform.OS !== 'web' && (await SecureStore.isAvailableAsync())) {
        await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
      }
    } catch (error) {
      console.warn('Failed to store auth token', error);
    }

    setToken(accessToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      if (Platform.OS !== 'web' && (await SecureStore.isAvailableAsync())) {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } catch (error) {
      console.warn('Failed to clear auth token', error);
    }

    setToken(null);
    setUser(null);
  };

  const restoreSession = async () => {
    setAuthLoading(true);

    try {
      if (Platform.OS === 'web') {
        setToken(null);
        setUser(null);
        return;
      }

      if (!(await SecureStore.isAvailableAsync())) {
        setToken(null);
        setUser(null);
        return;
      }

      const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!savedToken) {
        setToken(null);
        setUser(null);
        return;
      }

      if (!API_BASE_URL || API_BASE_URL === 'REPLACE_WITH_EXAM_API') {
        setToken(savedToken);
        setUser(null);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404 && API_BASE_URL.includes('jsonplaceholder.typicode.com')) {
          setToken(savedToken);
          setUser({ role: 'Student' });
          return;
        }

        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setToken(null);
        setUser(null);
        return;
      }

      const profile = await response.json();
      const payload = profile.user ?? profile.profile ?? profile.data ?? profile;

      setToken(savedToken);
      setUser(normalizeUser(payload, profile.email));
    } catch (error) {
      console.warn('Failed to restore session', error);
      setToken(null);
      setUser(null);

      try {
        if (Platform.OS !== 'web' && (await SecureStore.isAvailableAsync())) {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
        }
      } catch {
        // ignore cleanup errors
      }
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    void restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, authLoading, login, logout, restoreSession }}>
      {children}
    </AuthContext.Provider>
  );
}