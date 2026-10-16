import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Never cache: the point is to reach the database every run
export const dynamic = 'force-dynamic';

/**
 * GET /api/cron/keepalive
 * Called daily by Vercel Cron (see vercel.json). Supabase pauses free-tier projects
 * after ~7 days without database activity, so this runs one cheap query.
 * Uses the publishable key: RLS may hide every row, but the query still reaches
 * Postgres, which is all that counts as activity.
 */
export async function GET(request: NextRequest) {
  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is set
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
  const { error } = await supabase.from('clients').select('id').limit(1);

  if (error) {
    console.error('Supabase keepalive failed:', error);
    return NextResponse.json({ error: 'Keepalive query failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
