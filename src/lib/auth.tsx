import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { apiUrl } from "./api";

export interface AppUser {
  id: number;
  google_id: string | null;
  email: string;
  name: string | null;
  avatar_url: string | null;
  mlbb_uid?: string | null;
  mlbb_sid?: string | null;
  mlbb_nickname?: string | null;
  profile_completed: boolean;
  bio?: string | null;
  favorite_role?: string | null;
  showcase_hero?: string | null;
  profile_banner?: string | null;
  membership_plan?: string | null;
  membership_status?: string | null;
  membership_started_at?: string | null;
  membership_expires_at?: string | null;
  created_at?: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  setUser: (user: AppUser | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  refreshUser: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch(apiUrl("/auth/me"), { credentials: "include" });
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(apiUrl("/auth/logout"), { method: "POST", credentials: "include" });
    } catch {
      // ignore
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
