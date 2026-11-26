import { AuthForm } from '@/components/AuthForm';
import { usePageMeta } from '@/hooks/use-page-meta';

export function SignupPage() {
  usePageMeta({ title: 'Create account | Flight Price Notifier', description: 'Create your Flight Price Notifier account with email and password.', ogDescription: 'Get ready for your next budget-friendly trip.' });
  return <AuthForm signup/>;
}
