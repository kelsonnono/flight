import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BellRing, Check, Plane } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PLANS,
  fetchSubscriptions,
  formatTwd,
  parseTargetPrice,
  saveSubscription,
  type Plan,
  type Subscription,
} from "@/lib/flight-api";

export function PlanSubscriptions({ email }: { email: string }) {
  const normalizedEmail = email.trim().toLowerCase();
  const query = useQuery({
    queryKey: ["subscriptions", normalizedEmail],
    queryFn: () => fetchSubscriptions(normalizedEmail),
  });

  return (
    <section className="plans" aria-labelledby="plans-heading">
      <div className="plans-head">
        <span className="eyebrow">ROUTE ALERTS</span>
        <h2 id="plans-heading">選一條航線，設定你的目標價</h2>
        <p className="text-muted-foreground">
          最低票價（新台幣）降到你的目標價以下時，我們會寄 email 通知你。
        </p>
      </div>
      {query.isError && (
        <p className="plan-message is-error" role="alert">
          暫時讀不到你的訂閱狀態：{(query.error as Error).message}
        </p>
      )}
      <div className="plans-grid">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.name}
            plan={plan}
            email={normalizedEmail}
            loading={query.isLoading}
            subscription={query.data?.find((s) => s.route === plan.route)}
          />
        ))}
      </div>
    </section>
  );
}

function PlanCard({
  plan,
  email,
  loading,
  subscription,
}: {
  plan: Plan;
  email: string;
  loading: boolean;
  subscription: Subscription | undefined;
}) {
  const queryClient = useQueryClient();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (subscription) setValue(String(subscription.target_price));
  }, [subscription]);

  const mutation = useMutation({
    mutationFn: (target: number) =>
      saveSubscription({ email, plan_name: plan.name, target_price: target }),
    onSuccess: (saved) => {
      // Flip the card to "subscribed" right away, then re-sync from the API.
      queryClient.setQueryData<Subscription[]>(["subscriptions", email], (prev = []) => [
        ...prev.filter((s) => s.route !== saved.route),
        saved,
      ]);
      void queryClient.invalidateQueries({ queryKey: ["subscriptions", email] });
      setSaved(true);
    },
  });

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaved(false);
    const target = parseTargetPrice(value);
    if (target === null) {
      setError("請輸入 1 到 1,000,000 之間的新台幣金額。");
      return;
    }
    setError(null);
    mutation.mutate(target);
  }

  const subscribed = Boolean(subscription);
  const inputId = `target-${plan.name}`;
  const message =
    error ?? (mutation.isError ? `儲存失敗：${(mutation.error as Error).message}` : null);

  return (
    <article className={`plan-card${subscribed ? " is-subscribed" : ""}`}>
      <div className="plan-card-top">
        <div className="auth-icon">
          <Plane />
        </div>
        {subscribed && (
          <span className="plan-badge">
            <Check size={13} /> 已訂閱
          </span>
        )}
      </div>
      <span className="eyebrow">{plan.route.replace("-", " → ")}</span>
      <h3>{plan.title}</h3>
      <p className="text-muted-foreground">{plan.subtitle}</p>
      <p className="plan-hint">近期最低票價約 {formatTwd(plan.hintTwd)}（僅供參考）</p>
      {subscribed && subscription && (
        <p className="plan-current">
          <BellRing size={14} /> 目前目標價 {formatTwd(subscription.target_price)}
        </p>
      )}
      <form onSubmit={onSubmit} noValidate>
        <label htmlFor={inputId}>目標價（新台幣）</label>
        <div className="plan-form-row">
          <Input
            id={inputId}
            inputMode="numeric"
            placeholder={String(Math.round(plan.hintTwd / 1000) * 1000 + 1000)}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setSaved(false);
            }}
            disabled={loading || mutation.isPending}
            aria-invalid={Boolean(error)}
          />
          <Button type="submit" disabled={loading || mutation.isPending}>
            {mutation.isPending ? "儲存中…" : subscribed ? "更新目標價" : "開始追蹤"}
          </Button>
        </div>
      </form>
      {message && (
        <p className="plan-message is-error" role="alert">
          {message}
        </p>
      )}
      {saved && !message && (
        <p className="plan-message" role="status">
          已儲存！票價達標時會寄信到 {email}。
        </p>
      )}
    </article>
  );
}
