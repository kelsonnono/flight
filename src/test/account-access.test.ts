import { describe, expect, it, vi } from 'vitest';
import { AuthSessionMissingError } from '@supabase/supabase-js';
vi.mock('@/integrations/supabase/client', () => ({ supabase: { auth: { getUser: vi.fn() } } }));
import { supabase } from '@/integrations/supabase/client';
import { Route } from '@/routes/_authenticated/route';

describe('Private dashboard access', () => {
  it('redirects a signed-out visitor to /auth before showing /app', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: null }, error: new AuthSessionMissingError() });
    const guard = Route.options.beforeLoad;
    if (typeof guard !== 'function') throw new Error('Missing private-page guard');
    await expect(guard({} as NonNullable<Parameters<typeof guard>[0]>)).rejects.toMatchObject({ options: { to: '/auth' } });
  });
  it('rejects an account when authentication cannot revalidate it', async () => {
    vi.mocked(supabase.auth.getUser).mockRejectedValue(new Error('Authentication unavailable'));
    const guard = Route.options.beforeLoad;
    if (typeof guard !== 'function') throw new Error('Missing private-page guard');
    await expect(guard({} as NonNullable<Parameters<typeof guard>[0]>)).rejects.toThrow('Authentication unavailable');
  });
});