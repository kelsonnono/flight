import { describe, expect, it, vi } from 'vitest';
import { AuthSessionMissingError } from '@supabase/supabase-js';
vi.mock('@/integrations/supabase/client', () => ({ supabase: { auth: { getUser: vi.fn() } } }));
import { supabase } from '@/integrations/supabase/client';
import { requireUser } from '@/router';

describe('Private dashboard access', () => {
  it('redirects a signed-out visitor to /auth before showing /app', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({ data: { user: null }, error: new AuthSessionMissingError() });
    const thrown = await requireUser().catch((e: unknown) => e);
    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(302);
    expect((thrown as Response).headers.get('Location')).toBe('/auth');
  });
  it('rejects an account when authentication cannot revalidate it', async () => {
    vi.mocked(supabase.auth.getUser).mockRejectedValue(new Error('Authentication unavailable'));
    await expect(requireUser()).rejects.toThrow('Authentication unavailable');
  });
});
