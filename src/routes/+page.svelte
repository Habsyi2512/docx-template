<script lang="ts">
	import { format } from 'date-fns';
	import { id } from 'date-fns/locale';
	import { bulanKeRomawi } from '$lib/utils/dateHelper';
	import type { SKAIDataType } from '$lib/types/dtype';
	import { extractValues } from '$lib/utils/extractValues';
	import { extractIkanData } from '$lib/utils/extractIkanData';
	import { downloadDocx } from '$lib/utils/downloadDocx';
	import { generateDocx } from '$lib/utils/generateDocx';
	import { toZonedTime } from 'date-fns-tz';

	let fileContent = $state<{ fileName: string; fileContent: Blob } | null>(null);
	let isLoading = $state(false);

	// bulan dalam angka
	const timeZone = 'Asia/Jakarta';
	const now = toZonedTime(new Date(), timeZone);
	const bulan = now.getMonth() + 1;
	const tahun = now.getFullYear();
	const bulanToRomawi = bulanKeRomawi(bulan);

	let kodeSurat = $state('001');
	let formatNomorSurat = $derived(`500.5.4/DPPP/SKAI/${kodeSurat}/${bulanToRomawi}/${tahun}`);
	let formatText = $state('');
	let date = $state(now.toISOString().split('T')[0]);

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		isLoading = true;
		try {
			const tanggalTTD = format(now, 'dd MMMM yyyy', { locale: id });
			const kodeSurat = formatNomorSurat;
			const dataPengirim = extractValues(formatText);
			const dataIkan = extractIkanData(formatText);

			const fullData: SKAIDataType = {
				...dataPengirim,
				...dataIkan,
				tanggalTTD,
				kodeSurat,
				totalHarga: ''
			};

			const formData = new FormData();
			formData.append('data', JSON.stringify(fullData));

			const response = await fetch('/api/skai', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();
			const dataToGenerate = result.data as SKAIDataType;
			const resultData = await generateDocx(dataToGenerate);
			fileContent = resultData;
		} catch (error) {
			console.error('Error generating document:', error);
			fileContent = null;
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-screen space-y-10 gap-x-10 px-5 py-20 lg:flex lg:px-10">
	<!-- FORM -->
	<form onsubmit={handleSubmit} class="flex h-fit w-full max-w-2xl flex-col space-y-4 rounded-2xl border border-white/30 bg-white/30 p-6 shadow-xl backdrop-blur-md transition-all duration-300">
		<h2 class="w-fit rounded-lg border border-white/20 bg-white/40 p-2 text-xl font-semibold text-blue-500 shadow">Generate SKAI</h2>

		<!-- Input Kode Surat -->
		<div class="flex flex-col">
			<label for="kodeSurat" class="mb-1 text-sm font-medium text-blue-500"> Kode Surat: </label>
			<p style:font-family="monospace" class="mb-3 w-fit rounded-lg bg-blue-500/60 p-2 text-white">{formatNomorSurat}</p>
			<input
				type="text"
				id="kodeSurat"
				placeholder="Masukkan Kode Surat, Contoh: 001"
				bind:value={kodeSurat}
				class="rounded-md border border-white/20 bg-white/40 p-2 text-sm text-blue-600 placeholder-blue-600/60 shadow-sm backdrop-blur-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
			/>
		</div>

		<!-- Input Tanggal -->
		<div class="flex flex-col">
			<label for="tanggal" class="mb-1 text-sm font-medium text-blue-500">Tanggal Surat dibuat/TTD</label>
			<input
				type="date"
				id="tanggal"
				bind:value={date}
				class="rounded-md border border-white/20 bg-white/40 p-2 text-sm text-blue-600 placeholder-blue-600/60 shadow-sm backdrop-blur-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
			/>
		</div>

		<!-- Textarea Format -->
		<div class="flex flex-col">
			<label for="formatText" class="mb-1 text-sm font-medium text-blue-500">Masukkan Format Chat</label>
			<textarea
				id="formatText"
				bind:value={formatText}
				required
				placeholder="Contoh:\nNama Pengirim: ...\n1. Ikan ..."
				class="mb-3 min-h-[120px] rounded-md border border-white/20 bg-white/40 p-3 text-sm text-blue-600 placeholder-blue-600/60 shadow-sm backdrop-blur-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none lg:mb-0"
			></textarea>
		</div>

		<!-- Tombol Submit -->
		<button
			type="submit"
			class="w-full rounded-md bg-blue-600/80 px-4 py-2 text-white shadow-md transition hover:bg-blue-700/90 focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 focus:outline-none"
		>
			{isLoading ? 'Generating...' : 'Generate SKAI'}
		</button>
	</form>

	<!-- PREVIEW -->
	<div class="w-full space-y-4 lg:max-w-[60vw]">
		<h1 class="mx-auto mb-5 w-full rounded-lg border border-white/30 bg-white/20 p-5 text-xl font-bold text-blue-600 shadow-xl backdrop-blur-md lg:text-3xl">Preview</h1>
		{#if isLoading}
			<div class="layout-result mx-auto mb-5 w-full overflow-auto rounded-lg border border-white/30 bg-white/20 shadow-lg backdrop-blur-md">
				<p class="p-4 text-center font-medium text-white">Sedang generate dokumen...</p>
			</div>
		{:else if fileContent}
			<div class="mx-auto mb-5 w-full overflow-auto rounded-lg border border-white/30 bg-white/20 shadow-lg backdrop-blur-md">
				<button
					onclick={() => downloadDocx({ fileName: fileContent!.fileName, fileContent: fileContent!.fileContent })}
					class="block w-full cursor-pointer rounded-lg bg-blue-500/60 p-4 text-center text-white hover:bg-blue-600/80"
				>
					Download {fileContent.fileName}
				</button>
			</div>
		{/if}
	</div>
</div>
