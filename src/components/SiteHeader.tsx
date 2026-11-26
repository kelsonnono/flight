import { Link } from '@tanstack/react-router';
import { ArrowUpRight, Plane, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccount } from '@/routes/__root';

export function SiteHeader() {
  const { user, signOut } = useAccount();
  return <header className="site-header"><div className="site-container header-inner">
    <Link to="/" className="brand" aria-label="Flight Price Notifier home"><span className="brand-mark"><Plane size={21}/></span><span>Flight Price <strong>Notifier</strong></span></Link>
    <div className="header-actions">{user ? <><Button asChild variant="ghost"><Link to="/app">Dashboard</Link></Button><Button variant="outline" onClick={signOut}><LogOut/>Sign Out</Button></> : <Button asChild variant="outline"><Link to="/auth">Sign in / 登入 <ArrowUpRight/></Link></Button>}</div>
  </div></header>;
}