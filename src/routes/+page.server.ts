import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({locals: {supabase}}) => {
  const { data, error } = await supabase.from('bahan_baku').select('*').order('created_at', { ascending: false })

  if (error){
    console.error('Error fetching bahan baku:', error);
  }

  return {
    bahan_baku: data ?? []
  }
}