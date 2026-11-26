import { AuthForm } from '@/components/AuthForm';
import { usePageMeta } from '@/hooks/use-page-meta';

export function AuthPage() {
  usePageMeta({ title: 'Sign in | Flight Price Notifier', description: 'Sign in to Flight Price Notifier and prepare for your next trip.', ogDescription: 'Your next trip starts here.' });
  return <AuthForm/>;
}
