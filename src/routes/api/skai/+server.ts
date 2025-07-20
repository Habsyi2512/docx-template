// routes/api/skai/+server.ts

import type { IkanType, SKAIDataType } from "$lib/types/dtype";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";


export const POST: RequestHandler = async ({request, locals}) => {
  const { supabase} = locals;
  const data = await request.formData();
  const raw = data.get('data');

  if (!raw || typeof raw !== 'string') {
    return json({ error: "Data tidak valid." }, { status: 400 });
  }
  
  const parsedData = JSON.parse(raw as string) as SKAIDataType;
  const dataIkan = parsedData.ikan;

  const ikanDariSupabase = await supabase.from('ikan').select('id, nama_ikan, harga');

  if (ikanDariSupabase.error) {
    console.error('Error fetching ikan data:', ikanDariSupabase.error);
    return json({ error: ikanDariSupabase.error.message }, { status: 500 });
  }

  const listIkanDb = ikanDariSupabase.data || [];

  const Fuse = (await import('fuse.js')).default;
  const fuse = new Fuse(listIkanDb, {
    keys: ['nama_ikan'],
    threshold: 0.2,
  })

  let totalHargaIkan = 0;
  let totalVolumeIkan = 0;

  const enrichedIkan = dataIkan.map((ikan: IkanType) => {
    const result = fuse.search(ikan.nama.toUpperCase());
    const cocok = result.length > 0 ? result[0].item : null;
    const volume = parseFloat(ikan.volume.replace(/\./g, '').replace(',', '.'));

    let harga;
    if (cocok) {
      const hargaSatuan = cocok.harga ?? 0;
      const hargaTotal = volume * hargaSatuan;
      harga = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
          }).format(hargaTotal);
      totalHargaIkan += hargaTotal;
      totalVolumeIkan += volume;
    }

    return {
      ...ikan,
      nama: cocok?.nama_ikan || ikan.nama,
      harga: harga,
    }

  })

  parsedData.ikan = enrichedIkan;

  const totalHargaIkanFormatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits:0,
  }).format(totalHargaIkan);

  parsedData.totalHarga = totalHargaIkanFormatted;
  parsedData.totalVolume = totalVolumeIkan.toFixed(2).replace('.', ',');

  return json({
    data: parsedData
  }, {
    status: 200
  });
}