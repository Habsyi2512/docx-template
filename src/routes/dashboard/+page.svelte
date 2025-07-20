<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import { invalidate } from '$app/navigation';
	import TambahIkanForm from '$lib/components/form/TambahIkanForm.svelte';

	const { data } = $props();
	const { ikan, supabase } = $derived(data);

	let modeTambahIkan = $state(false);

	let editingIndex: number | null = $state(null);
	let editedNama = $state('');
	let editedHarga = $state('');

	function startEditing(index: number, item: (typeof ikan)[number]) {
		editingIndex = index;
		editedNama = item.nama_ikan;
		editedHarga = String(item.harga);
	}

	function cancelEdit() {
		editingIndex = null;
	}

	async function saveEdit(id: number) {
		const hargaNumber = Number(editedHarga.replace(/[^0-9.]/g, ''));
		const { error } = await supabase.from('ikan').update({ nama_ikan: editedNama, harga: hargaNumber }).eq('id', id);

		if (error) {
			alert('Gagal menyimpan');
			console.error(error);
		} else {
			editingIndex = null;
			await invalidate('supabase:ikan'); // refresh data dari Supabase
		}
	}

	async function deleteRow(id: number) {
		const confirmDelete = confirm('Yakin ingin menghapus data ini?');
		if (!confirmDelete) return;

		const { error } = await supabase.from('ikan').delete().eq('id', id);
		if (error) {
			alert('Gagal menghapus');
			console.error(error);
		} else {
			await invalidate('supabase:ikan'); // refresh data dari Supabase
		}
	}

	function setTambahIkanMode(mode: boolean) {
		modeTambahIkan = mode;
	}
</script>

<Container>
	<div class="mx-auto my-6 max-w-4xl overflow-x-auto">
		<div>
			<button onclick={() => setTambahIkanMode(true)} type="button" class="mb-3 cursor-pointer rounded-lg bg-white px-3 py-1 text-sm font-semibold shadow transition hover:bg-blue-300"
				>Tambah Ikan</button
			>
			{#if modeTambahIkan}
				<button onclick={() => setTambahIkanMode(false)} class="mb-3 cursor-pointer rounded-lg bg-gray-400 px-3 py-1 text-sm font-semibold shadow transition hover:bg-gray-300">Batal</button>
			{/if}
		</div>

		{#if modeTambahIkan}
			<TambahIkanForm />
		{/if}
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
				{#each ikan as item, i}
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
								<button onclick={() => saveEdit(item.id)} class="cursor-pointer rounded bg-green-500 px-3 py-1 text-xs text-white hover:bg-green-600"> Simpan </button>
								<button onclick={cancelEdit} class="cursor-pointer rounded bg-gray-400 px-3 py-1 text-xs text-white hover:bg-gray-500"> Batal </button>
							{:else}
								<button onclick={() => startEditing(i, item)} class="cursor-pointer rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"> Edit </button>
								<button onclick={() => deleteRow(item.id)} class="cursor-pointer rounded bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600"> Hapus </button>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</Container>
