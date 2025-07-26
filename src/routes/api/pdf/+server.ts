// src/routes/api/pdf/+server.ts
import { API_KEY } from '$env/static/private';
import { error } from '@sveltejs/kit';


export const POST = async ({ request }) => {
	try {
		const formData = await request.formData();

		const file = formData.get('file') as File;
		if (!file || file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
			throw error(400, 'File tidak valid. Harus berformat .docx');
		}

		const proxyFormData = new FormData();
		proxyFormData.append('file', file, file.name);

		const fastapiRes = await fetch('http://localhost:8000/pdf', {
			method: 'POST',
			headers: {
				"x-api-key": `${API_KEY}` // opsional, hanya jika kamu menerapkan auth di FastAPI
			},
			body: proxyFormData
		});

		if (!fastapiRes.ok) {
			throw error(fastapiRes.status, 'Gagal menghubungi API konversi PDF');
		}

		const pdfBlob = await fastapiRes.blob();

		return new Response(pdfBlob, {
			status: 200,
			headers: {
				'Content-Type': 'application/pdf',
				'X-Filename': file.name.replace('.docx', '.pdf')
			}
		});
	} catch (err) {
		console.error('❌ Error di /api/pdf:', err);
		throw error(500, 'Terjadi kesalahan saat memproses PDF');
	}
};
