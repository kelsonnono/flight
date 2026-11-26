import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, ArrowUpRight, Bell, Radar, CircleCheck, Plane, MoveDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import hero from '@/assets/flight-fuji.asset.json';
import { useAccount } from '@/routes/__root';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: 'Flight Price Notifier — 機票降價通知' }, { name: 'description', content: '設定航線與目標價，機票降價就通知你。Set a route and a target price — we email you when the fare drops.' }, { property: 'og:title', content: 'Flight Price Notifier — 機票降價通知' }, { property: 'og:description', content: 'Set a route and a target price — we email you when the fare drops.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }, { property: 'og:image', content: hero.url }, { name: 'twitter:image', content: hero.url }] }),
  component: Index,
});
const features = [
  { number: '01', icon: Radar, title: '盯緊熱門航線', subtitle: 'Always-on route watching', body: '持續監控台北出發的熱門航線（東京、首爾），自動抓最低票價。', note: 'Taipei → Tokyo · Seoul' },
  { number: '02', icon: Bell, title: '達標自動通知', subtitle: 'Target-price email alerts', body: '低於你設定的目標價，就寄 email 提醒你，附上立即訂購連結。', note: 'The right fare. Straight to your inbox.' },
  { number: '03', icon: CircleCheck, title: '隨時取消', subtitle: 'Cancel anytime', body: '月訂閱制，不想用隨時停，沒有綁約。', note: 'Your next trip. Your own terms.' },
];
function Index() {
  const { user } = useAccount();
  return <main><section className="travel-hero"><img className="hero-photo" src={hero.url} alt="Mount Fuji and Japan's city landscape under a violet evening sky"/><div className="hero-shade"/><div className="site-container hero-content"><span className="hero-kicker"><span className="status-dot"/> GOOD FARES. GREAT POSSIBILITIES.</span><h1>Flight Price<br/><span>Notifier</span><ArrowUpRight className="title-arrow"/></h1><div className="hero-description"><h2>設定航線與目標價，<br className="mobile-break"/>機票降價就通知你</h2><p>Set a route and a target price —<br/>we email you when the fare drops.</p></div><Button asChild variant="default" size="lg" className="hero-cta"><Link to={user ? '/app' : '/signup'}>{user ? 'Go to dashboard' : 'Start your next adventure'} <ArrowRight/></Link></Button><div className="hero-footnote"><CircleCheck size={14}/> Less searching. More exploring.</div></div><div className="hero-bottom site-container"><span className="hero-scroll"><MoveDown size={15}/> A better way to take off</span><span className="destination-label"><span className="destination-pin"/> JAPAN <span className="destination-divider">/</span> 日本 · 富士山</span></div></section>
  <section className="features-section site-container"><div className="section-heading"><div><span className="eyebrow">A LITTLE LESS SEARCHING</span><h2>好價格，不必苦苦等候。</h2></div><p>You pick the budget.<br/>We keep an eye on the skies.</p></div><div className="feature-grid">{features.map(feature => <article className="feature-card" key={feature.number}><div className="feature-card-top"><span className="feature-icon"><feature.icon size={25}/></span><span className="feature-number">{feature.number}</span></div><h3>{feature.title}</h3><h4>{feature.subtitle}</h4><p>{feature.body}</p><div className="feature-note">{feature.note}<ArrowUpRight size={14}/></div></article>)}</div><div className="closing-line"><Plane size={18}/><p>你的預算，決定下一站。<span>Your budget. Your next destination.</span></p></div></section></main>;
}
