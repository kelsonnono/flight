import { createBrowserRouter, redirect, type RouteObject } from "react-router";

import { supabase } from "@/integrations/supabase/client";
import { RootLayout } from "@/components/RootLayout";
import { RouteErrorPage, NotFoundPage } from "@/components/RoutePages";
import { IndexPage } from "@/pages/IndexPage";
import { AuthPage } from "@/pages/AuthPage";
import { SignupPage } from "@/pages/SignupPage";
import { DashboardPage } from "@/pages/DashboardPage";

/** Sign-in / sign-up pages: a visitor who is already signed in goes straight to /app. */
export async function redirectSignedInUser() {
  const { data } = await supabase.auth.getUser();
  if (data.user) throw redirect("/app");
  return null;
}

/** Private pages: validate the browser-owned session before rendering, else send to /auth. */
export async function requireUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw redirect("/auth");
  return { user: data.user };
}

export const routes: RouteObject[] = [
  {
    id: "root",
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <IndexPage /> },
      { path: "auth", loader: redirectSignedInUser, element: <AuthPage /> },
      { path: "signup", loader: redirectSignedInUser, element: <SignupPage /> },
      {
        id: "authenticated",
        loader: requireUser,
        children: [{ path: "app", element: <DashboardPage /> }],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
