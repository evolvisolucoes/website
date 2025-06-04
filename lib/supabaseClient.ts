import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export const supabaseBrowser = createPagesBrowserClient();