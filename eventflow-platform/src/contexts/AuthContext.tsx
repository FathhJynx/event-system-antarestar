import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/lib/api";
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isOrganizer: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  adminSignIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          const userData = response.data;
          setUser(userData);
          setIsAdmin(userData.role === 'admin');
          setIsOrganizer(userData.role === 'admin' || userData.role === 'organizer');
        } catch (error) {
          console.error("Auth init error:", error);
          localStorage.removeItem('auth_token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, token } = response.data;

      localStorage.setItem('auth_token', token);
      setUser(userData);
      setIsAdmin(userData.role === 'admin');
      setIsOrganizer(userData.role === 'admin' || userData.role === 'organizer');

      return { error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      let errorMessage = message;
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || message;
      }
      return { error: errorMessage };
    }
  };

  const adminSignIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/admin/login', { email, password });
      const { user: userData, token } = response.data;

      localStorage.setItem('auth_token', token);
      setUser(userData);
      setIsAdmin(userData.role === 'admin');
      setIsOrganizer(userData.role === 'admin' || userData.role === 'organizer');

      return { error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Admin login failed";
      let errorMessage = message;
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || message;
      }
      return { error: errorMessage };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        name: fullName,
        phone
      });
      const { user: userData, token } = response.data;

      localStorage.setItem('auth_token', token);
      setUser(userData);
      setIsAdmin(userData.role === 'admin');
      setIsOrganizer(userData.role === 'admin' || userData.role === 'organizer');

      return { error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Registration failed";
      let errorMessage = message;
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || message;
      }
      return { error: errorMessage };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAdmin(false);
    setIsOrganizer(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin,
        isOrganizer,
        signIn,
        adminSignIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
