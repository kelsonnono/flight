import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";

export type AccountContextValue = { user: User | null; signOut: () => Promise<void> };

export const AccountContext = createContext<AccountContextValue>({
  user: null,
  signOut: async () => {},
});

export function useAccount() {
  return useContext(AccountContext);
}
