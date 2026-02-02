import { supabase } from '@/lib/supabase';
import { PageClient } from '@/components/PageClient';

export default async function Home() {
  // Fetch user session from Supabase
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user || null;

  return <PageClient initialUser={user} />;
}
