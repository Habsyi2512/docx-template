// routes/api/skai/+server.ts
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

// import helpers function from lib
import { validateRequestData } from "$lib/server/utils/validation";
import { fetchIkanFromDatabase } from "$lib/server/database/ikan";
import { enrichIkanData } from "$lib/server/utils/search";
import { formatCurrency, formatVolume } from "$lib/utils/currency";

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { supabase } = locals;
    const formData = await request. formData();

    // validasi dan parse request data
    const parsedData = validateRequestData(formData);
    const dataIkan = parsedData.ikan;

    // fetch ikan data from database
    const listIkanDb = await fetchIkanFromDatabase(supabase);

    // Enrich ikan data with prices and calculations
    const { enrichedIkan, totalHargaIkan, totalVolumeIkan } = await enrichIkanData(
      dataIkan, 
      listIkanDb
    );

    // update parsedData with enriched ikan data
    parsedData.ikan = enrichedIkan;
    parsedData.totalHarga = formatCurrency(totalHargaIkan);
    parsedData.totalVolume = formatVolume(totalVolumeIkan);

    return json({
      data: parsedData
    }, {
      status: 200
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    const statusCode = errorMessage === "Data tidak valid." || errorMessage === "Format data tidak valid." ? 400 : 500;

    return json({
      error: errorMessage
    }, {
      status: statusCode
    })
  }
}

