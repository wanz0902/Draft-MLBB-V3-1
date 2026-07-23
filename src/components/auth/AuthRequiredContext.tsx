import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface AuthDialogState {
  open: boolean;
  action: string;
  returnTo: string;
}

interface AuthRequiredContextType {
  dialogState: AuthDialogState;
  openAuthDialog: (action: string, returnTo: string) => void;
  closeAuthDialog: () => void;
}

const AuthRequiredContext = createContext<AuthRequiredContextType>({
  dialogState: { open: false, action: "", returnTo: "/app" },
  openAuthDialog: () => {},
  closeAuthDialog: () => {},
});

export function useAuthRequired() {
  return useContext(AuthRequiredContext);
}

export function AuthRequiredProvider({ children }: { children: ReactNode }) {
  const [dialogState, setDialogState] = useState<AuthDialogState>({
    open: false,
    action: "",
    returnTo: "/app",
  });

  const openAuthDialog = useCallback((action: string, returnTo: string) => {
    setDialogState({ open: true, action, returnTo });
  }, []);

  const closeAuthDialog = useCallback(() => {
    setDialogState((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <AuthRequiredContext.Provider value={{ dialogState, openAuthDialog, closeAuthDialog }}>
      {children}
    </AuthRequiredContext.Provider>
  );
}
