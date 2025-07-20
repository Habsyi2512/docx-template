import type { IkanType } from "$lib/types/dtype";

export function extractIkanData(formatText: string) {
		const ikan: IkanType[] = [];

		// Regex: cari baris seperti "1. Ikan bilis/Teri Kg : 1.238,6 kg"
		const regex = /\d+\.\s*(.+?)\s*(?:Kg)?\s*:\s*([\d.,]+)\s*kg/gi;
		const matches = [...formatText.matchAll(regex)];

		matches.forEach((match, index) => {
			ikan.push({
				no: index + 1,
				nama: match[1].toUpperCase().trim(),
				koli: '', // default kosong
				volume: match[2].trim(),
				harga: '' // bisa diisi jika kamu parsing harga juga
			});
		});

		// Total Volume masih totalVolume: "1.238,6" ubah menjadi 1238.6 agar nanti bisa diolah
		const totalVolumeMatch = formatText.toLocaleLowerCase().match(/Total:\s*([\d.,]+)\s*kg/i);
		const totalVolume = totalVolumeMatch ? totalVolumeMatch[1].trim() : '';

		return { ikan, totalVolume };
	}