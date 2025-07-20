import type { SKAIDataType } from '$lib/types/dtype';

export async function generateDocx(fullData: SKAIDataType) {
		const response = await fetch('/template_skai.docx');
		const arrayBuffer = await response.arrayBuffer();
		const PizZip = (await import('pizzip')).default;
		const Docxtemplater = (await import('docxtemplater')).default;

		const zip = new PizZip(arrayBuffer);
		const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

		doc.render({ ...fullData });

		const out = doc.getZip().generate({
			type: 'blob',
			mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
		});

		return {
			fileName: `SKAI_${fullData.namaPengirim}_${fullData.kodeSurat}.docx`,
			fileContent: out
		};
	}