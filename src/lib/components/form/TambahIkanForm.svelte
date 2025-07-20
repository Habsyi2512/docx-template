<script lang="ts">
	import { invalidate } from '$app/navigation';

	let namaIkan = $state('');
	let hargaIkan = $state('');

	async function handleSubmit(event: Event) {
		event.preventDefault();

		const response = await fetch('/api/ikan/create', {
			method: 'POST',
			body: JSON.stringify({
				nama_ikan: namaIkan,
				harga: Number(hargaIkan.replace(/[^0-9.]/g, ''))
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			namaIkan = '';
			hargaIkan = '';
			alert('Ikan berhasil ditambahkan');
			invalidate('supabase:ikan');
			return;
		}
	}
</script>

<form onsubmit={handleSubmit} class="mb-5 rounded-lg bg-white p-4" action="">
	<div class="flex space-x-3">
		<div class="flex-1">
			<label class="text-sm font-semibold text-gray-600" for="namaIkan">Nama Ikan</label>
			<input id="namaIkan" type="text" bind:value={namaIkan} placeholder="Nama Ikan" class="mb-2 w-full rounded border border-gray-300 px-3 py-2 text-sm" required />
		</div>
		<div class="flex-1">
			<label class="text-sm font-semibold text-gray-600" for="harga">Harga Ikan</label>
			<input id="harga" type="text" bind:value={hargaIkan} placeholder="Harga Ikan" class="mb-2 w-full rounded border border-gray-300 px-3 py-2 text-sm" required />
		</div>
	</div>
	<button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">Tambah Ikan</button>

	<p class="mt-2 text-xs text-gray-500">* Harga harus berupa angka</p>
</form>
