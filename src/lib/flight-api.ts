/**
 * Client for the Flight Price Notifier AWS API (API Gateway HTTP API → Lambda → DynamoDB).
 * The browser holds no AWS credentials — it only calls these public endpoints.
 * Supabase stays auth-only; subscriptions live in DynamoDB, keyed by the user's email.
 */

const DEFAULT_API_URL = "https://9dk8wyepcg.execute-api.us-east-1.amazonaws.com";

export const FLIGHT_API_URL = (
  (import.meta.env["VITE_FLIGHT_API_URL"] as string | undefined) || DEFAULT_API_URL
).replace(/\/+$/, "");

export type PlanName = "tokyo" | "seoul";

export type Plan = {
  name: PlanName;
  route: string;
  title: string;
  subtitle: string;
  /** Rough recent cheapest fare, shown only as a hint for picking a sane budget. */
  hintTwd: number;
};

export const PLANS: Plan[] = [
  {
    name: "tokyo",
    route: "TPE-TYO",
    title: "台北 ✈ 東京",
    subtitle: "Taipei → Tokyo",
    hintTwd: 9325,
  },
  {
    name: "seoul",
    route: "TPE-SEL",
    title: "台北 ✈ 首爾",
    subtitle: "Taipei → Seoul",
    hintTwd: 5989,
  },
];

export type Subscription = {
  route: string;
  plan_name: PlanName;
  target_price: number;
  currency: "TWD";
  created_at?: string;
  updated_at?: string;
};

export const MAX_TARGET_TWD = 1_000_000;

/** Parse a user-typed TWD amount ("10,000", "NT$ 9500") into a whole number, or null if invalid. */
export function parseTargetPrice(input: string): number | null {
  const cleaned = input.replace(/nt\$|twd|[,\s]/gi, "");
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return null;
  const value = Math.round(Number(cleaned));
  if (!Number.isFinite(value) || value <= 0 || value > MAX_TARGET_TWD) return null;
  return value;
}

export function formatTwd(value: number): string {
  return `NT$${value.toLocaleString("en-US")}`;
}

async function readJson(res: Response) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error((body as { error?: string }).error || `Request failed (${res.status})`);
  return body;
}

export async function fetchSubscriptions(email: string): Promise<Subscription[]> {
  const res = await fetch(`${FLIGHT_API_URL}/subscriptions?email=${encodeURIComponent(email)}`);
  const body = (await readJson(res)) as { subscriptions?: Subscription[] };
  return body.subscriptions ?? [];
}

export async function saveSubscription(input: {
  email: string;
  plan_name: PlanName;
  target_price: number;
}): Promise<Subscription> {
  const res = await fetch(`${FLIGHT_API_URL}/subscribe`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  return (await readJson(res)) as Subscription;
}
