// src/routes/api/ikan/[id]/+server.ts
import {  json } from '@sveltejs/kit';
import type { RequestHandler } from "./$types";

export const DELETE: RequestHandler = async({ params, locals }) => {
  const { id } = params;

  if (!id || isNaN(Number(id))) {
    return json({ message: 'ID ikan tidak valid.' }, { status: 400 });
  }

  const { supabase } = locals;

  if (!supabase) {
	return json({ message: 'Supabase client tidak tersedia.' }, { status: 500 });
}


  const { error: deleteError } = await supabase
    .from('ikan')
    .delete()
    .eq('id', Number(id));

  if (deleteError) {
    return json({ message: deleteError.message }, { status: 500 });
  }

  return json({ success: true }, { status: 200 });
}

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const { id } = params;

	if (!id || isNaN(Number(id))) {
		return json({ message: 'ID ikan tidak valid.' }, { status: 400 });
	}

	const { supabase } = locals;
	if (!supabase) {
		return json({ message: 'Supabase client tidak tersedia.' }, { status: 500 });
	}

	let payload: { nama_ikan?: string; harga?: number };

	try {
		payload = await request.json();
	} catch (error) {
		return json({ message: 'Payload tidak valid.', error: error }, { status: 400 });
	}

	// Validasi isi payload
	if (!payload.nama_ikan || typeof payload.harga !== 'number') {
		return json({ message: 'Data nama ikan atau harga tidak valid.' }, { status: 400 });
	}

	const { error: updateError } = await supabase
		.from('ikan')
		.update({
			nama_ikan: payload.nama_ikan,
			harga: payload.harga
		})
		.eq('id', Number(id));

	if (updateError) {
		return json({ message: updateError.message }, { status: 500 });
	}

	return json({ success: true }, { status: 200 });
};
