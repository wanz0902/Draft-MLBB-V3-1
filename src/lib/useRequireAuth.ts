import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./auth";
import { useAuthRequired } from "../components/auth/AuthRequiredContext";

interface RequireAuthOptions {
  action: string;
  returnTo?: string;
  onAuthenticated?: () => void;
}

export function useRequireAuth() {
  const { user } = useAuth();
  const { openAuthDialog } = useAuthRequired();
  const location = useLocation();

  const requireAuth = useCallback(
    ({ action, returnTo, onAuthenticated }: RequireAuthOptions) => {
      if (user) {
        onAuthenticated?.();
        return true;
      }
      openAuthDialog(action, returnTo || location.pathname + location.search);
      return false;
    },
    [user, openAuthDialog, location]
  );

  return { requireAuth, isGuest: !user, user };
}
