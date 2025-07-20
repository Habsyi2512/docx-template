import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({request, locals}) => {
  const { supabase } = locals;
  const data = await request.json();

  if (!data.nama_ikan || !data.harga) {
    return json({ error: "Nama ikan dan harga harus diisi." }, { status: 400 });
  }

  const { data: ikan, error } = await supabase
    .from('ikan')
    .insert([{ nama_ikan: data.nama_ikan, harga: data.harga }])
    .select();

  if (error) {
    console.error('Error adding ikan:', error);
    return json({ error: error.message }, { status: 500 });
  }

  return json(ikan[0], { status: 201 });
}