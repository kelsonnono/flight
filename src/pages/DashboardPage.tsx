import { useRouteLoaderData } from "react-router";
import { PlanSubscriptions } from "@/components/PlanSubscriptions";
import { usePageMeta } from "@/hooks/use-page-meta";
import type { requireUser } from "@/router";

export function DashboardPage() {
  usePageMeta({
    title: "Your dashboard | Flight Price Notifier",
    description:
      "Pick a route and a target price — Flight Price Notifier emails you when the fare drops.",
    ogDescription: "Your next adventure is on the horizon.",
  });
  const { user } = useRouteLoaderData<typeof requireUser>("authenticated")!;
  return (
    <main className="dashboard site-container">
      <span className="eyebrow">YOUR PERSONAL DEPARTURE LOUNGE</span>
      <h1>Hi {user.email}</h1>
      <p className="text-muted-foreground">很高興見到你。下一趟旅程，從這裡開始。</p>
      {user.email ? (
        <PlanSubscriptions email={user.email} />
      ) : (
        <p className="plan-message is-error">這個帳號沒有 email，無法訂閱航線通知。</p>
      )}
    </main>
  );
}
