"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useSession, signIn, signOut } from "next-auth/react";

interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession();

  const user: User | null =
    session?.user && session.user.username
      ? {
          id: Number(session.user.id),
          username: session.user.username,
          role: session.user.role,
        }
      : null;

  const token: string | null = session?.backendToken ?? null;

  // Sync the backend token to localStorage so lib/api.ts can find it
  useEffect(() => {
    if (token) {
      localStorage.setItem("ark_token", token);
      if (user) {
        localStorage.setItem("ark_user", JSON.stringify(user));
      }
    } else if (status === "unauthenticated") {
      localStorage.removeItem("ark_token");
      localStorage.removeItem("ark_user");
    }
  }, [token, user, status]);

  const login = useCallback(async (username: string, password: string) => {
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (!result || result.error) {
      throw new Error(result?.error || "Login failed. Please try again.");
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("ark_token");
    localStorage.removeItem("ark_user");
    signOut({ redirect: false });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading: status === "loading",
        login,
        logout,
        isAuthenticated: status === "authenticated",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
