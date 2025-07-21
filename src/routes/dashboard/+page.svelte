<!-- /routes/dashboard/+page.svelte -->

<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import { invalidate } from '$app/navigation';
	import TambahIkanForm from '$lib/components/form/TambahIkanForm.svelte';
	import { toast } from 'svelte-sonner';

	const { data } = $props();
	const { ikan } = $derived(data);

	let modeTambahIkan = $state(false);
	let searchQuery = $state('');
	let filteredIkan = $derived(ikan.filter((item) => item.nama_ikan.toLowerCase().includes(searchQuery.toLowerCase())));

	let editingIndex: number | null = $state(null);
	let editedNama = $state('');
	let editedHarga = $state('');
	let savingId = $state<number | null>(null);
	let deletingId = $state<number | null>(null);

	function startEditing(index: number, item: (typeof ikan)[number]) {
		editingIndex = index;
		editedNama = item.nama_ikan;
		editedHarga = String(item.harga);
	}

	function cancelEdit() {
		editingIndex = null;
	}

	async function saveEdit(id: number) {
		savingId = id;

		try {
			const hargaNumber = Number(editedHarga.replace(/[^0-9.]/g, ''));
			if (isNaN(hargaNumber)) {
				toast.error('Harga tidak valid.');
				return;
			}

			const response = await fetch(`/api/ikan/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					nama_ikan: editedNama,
					harga: hargaNumber
				})
			});

			if (!response.ok) {
				const data = await response.json();
				toast.error(data?.message ?? 'Gagal menyimpan data.');
				return;
			}

			toast.success('Data berhasil disimpan!');
			editingIndex = null;
			await invalidate('supabase:ikan');
		} catch (err) {
			console.error('Kesalahan tak terduga:', err);
			toast.error('Terjadi kesalahan saat menyimpan.');
		} finally {
			savingId = null;
		}
	}

	async function deleteRow(id: number) {
		const confirmDelete = confirm('Yakin ingin menghapus data ini?');
		if (!confirmDelete) return;

		deletingId = id;

		try {
			const response = await fetch(`/api/ikan/${id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const errorData = await response.json();
				toast.error(errorData?.message ?? 'Gagal menghapus data.');
				return;
			}

			toast.success('Data berhasil dihapus!');
			await invalidate('supabase:ikan');
		} catch (err) {
			console.error('Kesalahan tak terduga:', err);
			toast.error('Terjadi kesalahan saat menghapus.');
		} finally {
			deletingId = null;
		}
	}
	function setTambahIkanMode(mode: boolean) {
		modeTambahIkan = mode;
	}
</script>

<Container>
	<div class="mx-auto my-6 max-w-4xl overflow-x-auto">
		<div>
			<button onclick={() => setTambahIkanMode(true)} type="button" class="mb-3 cursor-pointer rounded-lg bg-white px-3 py-1 text-sm font-semibold shadow transition hover:bg-blue-300">
				Tambah Ikan
			</button>
			{#if modeTambahIkan}
				<button onclick={() => setTambahIkanMode(false)} class="mb-3 cursor-pointer rounded-lg bg-gray-400 px-3 py-1 text-sm font-semibold shadow transition hover:bg-gray-300"> Batal </button>
			{/if}
		</div>

		{#if modeTambahIkan}
			<TambahIkanForm />
		{/if}

		<input type="text" placeholder="Cari nama ikan..." bind:value={searchQuery} class="mb-4 w-full max-w-sm rounded border border-gray-300 px-3 py-2 text-sm shadow" />

		<table class="w-full overflow-hidden rounded-xl bg-white text-sm shadow-md">
			<thead class="bg-gray-100 text-xs font-semibold tracking-wide text-gray-700 uppercase">
				<tr>
					<th class="px-4 py-3 text-left">No</th>
					<th class="px-4 py-3 text-left">Nama Ikan</th>
					<th class="px-4 py-3 text-left">Harga</th>
					<th class="px-4 py-3 text-left">Aksi</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200 text-gray-700">
				{#each filteredIkan as item, i (item.id)}
					<tr class="transition hover:bg-gray-50">
						<td class="px-4 py-2">{i + 1}</td>

						<!-- Nama -->
						<td class="px-4 py-2">
							{#if editingIndex === i}
								<input bind:value={editedNama} class="w-full rounded border border-gray-300 px-2 py-1 text-sm" />
							{:else}
								{item.nama_ikan}
							{/if}
						</td>

						<!-- Harga -->
						<td class="px-4 py-2">
							{#if editingIndex === i}
								<input bind:value={editedHarga} class="w-full rounded border border-gray-300 px-2 py-1 text-sm" />
							{:else}
								Rp {Number(item.harga).toLocaleString('id-ID')}
							{/if}
						</td>

						<!-- Aksi -->
						<td class="space-x-2 px-4 py-2">
							{#if editingIndex === i}
								<button
									disabled={savingId === item.id}
									onclick={() => saveEdit(item.id)}
									class="cursor-pointer rounded bg-green-500 px-3 py-1 text-xs text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{savingId === item.id ? 'Menyimpan...' : 'Simpan'}
								</button>
								<button onclick={cancelEdit} class="cursor-pointer rounded bg-gray-400 px-3 py-1 text-xs text-white hover:bg-gray-500"> Batal </button>
							{:else}
								<button onclick={() => startEditing(i, item)} class="cursor-pointer rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"> Edit </button>
								<button
									onclick={() => deleteRow(item.id)}
									disabled={deletingId === item.id}
									class="cursor-pointer rounded bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{deletingId === item.id ? 'Menghapus...' : 'Hapus'}
								</button>
							{/if}
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="4" class="px-4 py-6 text-center text-gray-500">Tidak ada data ikan ditemukan.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</Container>
