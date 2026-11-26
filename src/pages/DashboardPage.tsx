import { useRouteLoaderData } from 'react-router';
import { Bell, Plane, ArrowUpRight } from 'lucide-react';
import hero from '@/assets/flight-fuji.asset.json';
import { usePageMeta } from '@/hooks/use-page-meta';
import type { requireUser } from '@/router';

export function DashboardPage() {
  usePageMeta({ title: 'Your dashboard | Flight Price Notifier', description: 'Your Flight Price Notifier dashboard. Route subscriptions are coming in the next milestone.', ogDescription: 'Your next adventure is on the horizon.' });
  const { user } = useRouteLoaderData<typeof requireUser>('authenticated')!;
  return <main className="dashboard site-container"><span className="eyebrow">YOUR PERSONAL DEPARTURE LOUNGE</span><h1>Hi {user.email}</h1><p className="text-muted-foreground">很高興見到你。下一趟旅程，從這裡開始。</p><section className="dashboard-coming"><img src={hero.url} alt="Mount Fuji above the Japanese landscape at dusk"/><div className="dashboard-coming-content"><div className="auth-icon"><Bell/></div><span className="eyebrow">ON THE HORIZON</span><h2>Your next adventure<br/>is on its way.</h2><p>你的航線追蹤儀表板即將上線 — 下一個里程碑會加上訂閱航線的功能。</p><p className="text-muted-foreground">Your dashboard is coming soon. Route-subscription will be added in the next milestone.</p><span className="coming-label"><Plane size={16}/> Coming soon <ArrowUpRight size={15}/></span></div></section></main>;
}
