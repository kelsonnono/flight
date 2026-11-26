import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, ScrollRestoration, useNavigate, useRevalidator } from "react-router";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { AccountContext } from "@/hooks/use-account";

export function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();
  const [user, setUser] = useState<User | null>(null);

  // The single root auth subscriber: keeps header state in sync and re-runs route guards.
  useEffect(() => {
    let active = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (active) setUser(session?.user ?? null);
      if (!["SIGNED_IN", "SIGNED_OUT", "USER_UPDATED"].includes(event)) return;
      void revalidate();
      if (event !== "SIGNED_OUT") void queryClient.invalidateQueries();
    });
    void supabase.auth.getUser().then(({ data }) => {
      if (active) setUser(data.user);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [queryClient, revalidate]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    const { error } = await supabase.auth.signOut();
    if (error) return;
    setUser(null);
    await navigate("/auth", { replace: true });
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AccountContext.Provider value={{ user, signOut }}>
        <SiteHeader />
        <Outlet />
        <footer className="site-footer site-container">
          <span>© 2026 Flight Price Notifier</span>
          <span>
            Made for your next adventure. <span className="footer-star">✦</span>
          </span>
        </footer>
      </AccountContext.Provider>
      <ScrollRestoration />
    </QueryClientProvider>
  );
}
