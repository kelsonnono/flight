import { createFileRoute, redirect } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { AuthForm } from '@/components/AuthForm';

export const Route = createFileRoute('/signup')({
  ssr: false,
  beforeLoad: async () => { const { data } = await supabase.auth.getUser(); if (data.user) throw redirect({ to: '/app' }); },
  head: () => ({ meta: [{ title: 'Create account | Flight Price Notifier' }, { name: 'description', content: 'Create your Flight Price Notifier account with email and password.' }, { property: 'og:title', content: 'Create account | Flight Price Notifier' }, { property: 'og:description', content: 'Get ready for your next budget-friendly trip.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: () => <AuthForm signup/>,
});