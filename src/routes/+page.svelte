<script lang="ts">
	let nama = '';
	let alamat = '';

	async function handleSubmit() {
		await generateDocx(nama, alamat);
	}

	async function generateDocx(nama: string, alamat: string) {
		const response = await fetch('/template.docx');
		const arrayBuffer = await response.arrayBuffer();
		const PizZip = (await import('pizzip')).default;
		const Docxtemplater = (await import('docxtemplater')).default;
		const { saveAs } = await import('file-saver');

		const zip = new PizZip(arrayBuffer);
		const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
		doc.render({ nama, alamat });

		const out = doc.getZip().generate({
			type: 'blob',
			mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
		});
		saveAs(out, 'hasil.docx');
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
	<input class="input" bind:value={nama} placeholder="Nama" required />
	<input class="input" bind:value={alamat} placeholder="Alamat" required />
	<button class="btn" type="submit">Download DOCX</button>
</form>
