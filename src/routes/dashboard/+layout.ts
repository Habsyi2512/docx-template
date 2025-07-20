// src/routes/dashboard/+layout.ts
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({parent, depends}) => {
  const {session, supabase} = await parent();
  if (!session) throw redirect(303, '/auth');

  depends('supabase:ikan');

  const {data: ikan, error } = await supabase.from('ikan').select('id, nama_ikan, harga').order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching ikan:', error);
    throw redirect(500, '/error');
  }

  return {
    session,
    ikan
  };
}
