import { createFileRoute, redirect } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { AuthForm } from '@/components/AuthForm';

export const Route = createFileRoute('/auth')({
  ssr: false,
  beforeLoad: async () => { const { data } = await supabase.auth.getUser(); if (data.user) throw redirect({ to: '/app' }); },
  head: () => ({ meta: [{ title: 'Sign in | Flight Price Notifier' }, { name: 'description', content: 'Sign in to Flight Price Notifier and prepare for your next trip.' }, { property: 'og:title', content: 'Sign in | Flight Price Notifier' }, { property: 'og:description', content: 'Your next trip starts here.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: () => <AuthForm/>,
});