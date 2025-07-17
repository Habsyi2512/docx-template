<script lang="ts">
	import { format } from 'date-fns';
	import { id } from 'date-fns/locale';
	import { bulanKeRomawi } from '$lib/utils/dateHelper';
	import { renderAsync } from 'docx-preview';
	import type { IkanType, SKAIDataType } from '$lib/types/dtype';

	let container: HTMLElement;

	// bulan dalam angka
	const bulan = new Date().getMonth() + 1;
	const bulanToRomawi = bulanKeRomawi(bulan);
	const tahun = new Date().getFullYear();
	let kodeSurat = $state('xxx');
	let formatNomorSurat = $derived(`500.5.4/DPPP/SKAI/${kodeSurat}/${bulanToRomawi}/${tahun}`);
	let formatText = $state('');
	let date = $state(new Date().toISOString().split('T')[0]);

	function extractIkanData(formatText: string) {
		const ikan: IkanType[] = [];

		// Regex: cari baris seperti "1. Ikan bilis/Teri Kg : 1.238,6 kg"
		const regex = /\d+\.\s*(.+?)\s*Kg\s*:\s*([\d.,]+)\s*kg/gi;
		const matches = [...formatText.matchAll(regex)];

		matches.forEach((match, index) => {
			ikan.push({
				no: index + 1,
				nama: match[1].trim(),
				koli: '', // default kosong
				volume: match[2].trim(),
				harga: '' // bisa diisi jika kamu parsing harga juga
			});
		});

		// Total Volume
		const totalVolumeMatch = formatText.match(/Total:\s*([\d.,]+)\s*kg/i);
		const totalVolume = totalVolumeMatch ? totalVolumeMatch[1].trim() : '';

		return { ikan, totalVolume };
	}

	async function handleSubmit() {
		const tanggal = format(date, 'dd MMMM yyyy', { locale: id });
		const kodeSurat = formatNomorSurat;
		const dataPengirim = extractValues();
		const dataIkan = extractIkanData(formatText);
		const fullData: SKAIDataType = {
			...dataPengirim,
			...dataIkan,
			tanggal,
			kodeSurat
		};
		await generateDocx(fullData);
	}

	async function generateDocx(fullData: SKAIDataType) {
		const response = await fetch('/template_skai.docx');
		const arrayBuffer = await response.arrayBuffer();
		const PizZip = (await import('pizzip')).default;
		const Docxtemplater = (await import('docxtemplater')).default;
		const { saveAs } = await import('file-saver');

		const zip = new PizZip(arrayBuffer);
		const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

		doc.render({ ...fullData });

		const out = doc.getZip().generate({
			type: 'blob',
			mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
		});

		await renderAsync(out, container);
		saveAs(out, `SKAI_${fullData.nama}_${fullData.kodeSurat}.docx`);
	}

	function extractValues() {
		const namaMatch = formatText.toLocaleLowerCase().match(/nama pengirim:\s*(.+)/i);
		const alamatMatch = formatText.toLocaleLowerCase().match(/alamat:\s*(.+)/i);
		const noHpMatch = formatText.toLocaleLowerCase().match(/no hp:\s*(.+)/i);
		const totalMatch = formatText.toLocaleLowerCase().match(/total:\s*(.+)/i);
		const namaKapalMatch = formatText.toLocaleLowerCase().match(/nama kapal yg di gunakan:\s*(.+)/i);
		const namaPenerimaMatch = formatText.toLocaleLowerCase().match(/nama penerima:\s*(.+)/i);
		const pelabuhanTujuanMatch = formatText.toLocaleLowerCase().match(/pelabuhan tujuan:\s*(.+)/i);
		const tanggalPengirimanMatch = formatText.toLocaleLowerCase().match(/tgl pengiriman:\s*(.+)/i);

		const nama = namaMatch ? namaMatch[1].trim().toUpperCase() : '';
		const alamat = alamatMatch ? alamatMatch[1].trim().toUpperCase() : '';
		const noHp = noHpMatch ? noHpMatch[1].trim() : '';
		const total = totalMatch ? totalMatch[1].trim() : '';
		const namaKapal = namaKapalMatch ? namaKapalMatch[1].trim().toUpperCase() : '';
		const namaPenerima = namaPenerimaMatch ? namaPenerimaMatch[1].trim().toUpperCase() : '';
		const pelabuhanTujuan = pelabuhanTujuanMatch ? pelabuhanTujuanMatch[1].trim().toUpperCase() : '';
		const tanggalPengiriman = tanggalPengirimanMatch ? tanggalPengirimanMatch[1].trim().toUpperCase() : '';

		return {
			nama,
			alamat,
			noHp,
			namaPenerima,
			total,
			pelabuhanTujuan,
			tanggalPengiriman,
			namaKapal
		};
	}
</script>

<div class="min-h-screen space-y-10 gap-x-10 bg-gray-50 px-5 py-20 lg:flex lg:px-10">
	<form onsubmit={handleSubmit} class="flex h-fit w-full max-w-2xl flex-col space-y-4 rounded-xl bg-white p-6 shadow-lg">
		<!-- CARD -->
		<h2 class="text-xl font-semibold text-gray-800">Generate Surat SKAI</h2>

		<!-- Input Kode Surat -->
		<div class="flex flex-col">
			<label for="kodeSurat" class="mb-1 text-sm font-medium text-gray-700">Kode Surat <span style:font-family="monospace" class="text-blue-400">{formatNomorSurat}</span></label>
			<input
				type="text"
				id="kodeSurat"
				placeholder="Contoh: 001"
				bind:value={kodeSurat}
				class="rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
			/>
		</div>

		<!-- Input Tanggal -->
		<div class="flex flex-col">
			<label for="tanggal" class="mb-1 text-sm font-medium text-gray-700">Tanggal Surat dibuat/TTD</label>
			<input type="date" id="tanggal" bind:value={date} class="rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
		</div>

		<!-- Textarea Format -->
		<div class="flex flex-col">
			<label for="formatText" class="mb-1 text-sm font-medium text-gray-700">Masukkan Format Chat</label>
			<textarea
				id="formatText"
				bind:value={formatText}
				required
				placeholder="Contoh:\nNama Pengirim: ...\n1. Ikan ..."
				class="mb-3 min-h-[120px] rounded-md border border-gray-300 p-3 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none lg:mb-0"
			></textarea>
		</div>

		<!-- Tombol Submit -->
		<button type="submit" class="w-full rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 focus:outline-none">
			Download DOCX
		</button>
	</form>

	<div class="w-full space-y-4 lg:max-w-[60vw]">
		<h1 class="mx-auto mb-5 w-full rounded-lg border border-gray-100 bg-white p-5 text-xl font-bold text-gray-500 shadow-lg lg:text-3xl">Preview</h1>
		<div bind:this={container} class="mx-auto mb-5 w-full overflow-auto rounded-lg border border-gray-100 bg-white shadow-lg"></div>
	</div>
</div>
