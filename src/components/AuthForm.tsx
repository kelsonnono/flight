import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

export function AuthForm({ signup = false }: { signup?: boolean }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(''); setNotice('');
    try {
      const result = signup
        ? await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: window.location.origin } })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (result.error) { setError(result.error.message); return; }
      if (!result.data.session) { setNotice('Check your email to confirm your account. 請至信箱確認帳號。'); return; }
      await navigate({ to: '/app', replace: true });
    } catch { setError('Unable to connect. Please try again.'); }
    finally { setPending(false); }
  }
  return <main className="auth-main site-container"><div className="auth-intro"><span className="eyebrow">YOUR NEXT TRIP STARTS HERE</span><h1>{signup ? 'Let the good fares\ncome to you.' : 'Welcome back.\nAdventure awaits.'}</h1><p>設定航線與目標價，機票降價就通知你</p><p className="text-muted-foreground">Less searching. More going places.</p></div>
    <section className="auth-panel"><div className="auth-icon"><LockKeyhole size={22}/></div><h2>{signup ? 'Create your account' : 'Sign in / 登入'}</h2><p className="auth-description">{signup ? '註冊帳號，準備好迎接下一趟旅程。' : '登入帳號，下一趟旅程在等你。'}</p>
      <form onSubmit={submit}><label htmlFor="email">Email / 電子郵件</label><Input id="email" type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={pending}/>
      <label htmlFor="password">Password / 密碼</label><div className="password-field"><Input id="password" type={visible ? 'text' : 'password'} autoComplete={signup ? 'new-password' : 'current-password'} minLength={6} placeholder={signup ? 'At least 6 characters' : 'Enter your password'} required value={password} onChange={e => setPassword(e.target.value)} disabled={pending}/><Button type="button" variant="ghost" size="icon" aria-label={visible ? 'Hide password' : 'Show password'} onClick={() => setVisible(!visible)}>{visible ? <EyeOff/> : <Eye/>}</Button></div>
      {error && <p role="alert" className="form-error">{error}</p>}{notice && <p role="status" className="form-notice">{notice}</p>}
      <Button size="lg" className="auth-submit" disabled={pending}>{pending ? <LoaderCircle className="animate-spin"/> : null}{signup ? 'Create account / 註冊' : 'Sign in / 登入'}{!pending && <ArrowRight/>}</Button></form>
      <p className="auth-switch">{signup ? 'Already have an account?' : 'New here?'} <Link to={signup ? '/auth' : '/signup'}>{signup ? 'Sign in' : 'Create an account'} <ArrowUpRightSmall/></Link></p>
    </section></main>;
}
function ArrowUpRightSmall() { return <ArrowRight size={13}/>; }