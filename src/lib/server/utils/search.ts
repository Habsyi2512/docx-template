// $lib/server/utils/search.ts
import type { IkanType } from "$lib/types/dtype";
import type { IkanFromDatabase } from "$lib/server/database/ikan";
import { formatCurrency, parseVolumeString } from "$lib/utils/currency";

const FUSE_CONFIG = {
	keys: ['nama_ikan'],
	threshold: 0.2,
};

export interface EnrichIkanResult {
	enrichedIkan: (IkanType & { harga?: string })[];
	totalHargaIkan: number;
	totalVolumeIkan: number;
}

export const enrichIkanData = async (
	dataIkan: IkanType[], 
	listIkanDb: IkanFromDatabase[]
): Promise<EnrichIkanResult> => {
	// Dynamic import for better performance
	const Fuse = (await import('fuse.js')).default;
	const fuse = new Fuse(listIkanDb, FUSE_CONFIG);
	
	let totalHargaIkan = 0;
	let totalVolumeIkan = 0;
	
	const enrichedIkan = dataIkan.map((ikan: IkanType) => {
		const searchResult = fuse.search(ikan.nama.toUpperCase());
		const matchedIkan = searchResult.length > 0 ? searchResult[0].item : null;
		
		const volume = parseVolumeString(ikan.volume);
		let harga: string | undefined;
		
		if (matchedIkan) {
			const hargaSatuan = matchedIkan.harga ?? 0;
			const hargaTotal = volume * hargaSatuan;
			harga = formatCurrency(hargaTotal);
			
			totalHargaIkan += hargaTotal;
			totalVolumeIkan += volume;
		}
		
		return {
			...ikan,
			nama: matchedIkan?.nama_ikan || ikan.nama,
			harga: harga,
		};
	});
	
	return {
		enrichedIkan,
		totalHargaIkan,
		totalVolumeIkan,
	};
};