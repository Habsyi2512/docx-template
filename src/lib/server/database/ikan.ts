// $lib/server/database/ikan.ts
import type { SupabaseClient } from "@supabase/supabase-js";

export interface IkanFromDatabase {
	id: number;
	nama_ikan: string;
	harga: number | null;
}

export const fetchIkanFromDatabase = async (supabase: SupabaseClient): Promise<IkanFromDatabase[]> => {
	const response = await supabase
		.from('ikan')
		.select('id, nama_ikan, harga');
	
	if (response.error) {
		console.error('Error fetching ikan data:', response.error);
		throw new Error(response.error.message);
	}
	
	return response.data || [];
};