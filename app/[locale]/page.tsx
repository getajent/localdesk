import { createClient } from '@/lib/supabase-ssr';
import { PageClient } from '@/components/PageClient';

export default async function Home() {
  const supabase = await createClient();
  // Fetch user from Supabase using server-side client (reads cookies)
  const { data: { user } } = await supabase.auth.getUser();

  return <PageClient initialUser={user} />;
}
