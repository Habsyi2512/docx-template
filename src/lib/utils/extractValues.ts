export function extractValues(formatText: string) {
const namaPengirimMatch = formatText.match(/nama\s+pengirim\s*:\s*(.+)/i);
const alamatPengirimMatch = formatText.match(/alamat\s*:\s*(.+)/i);
const alamatPenerimaMatch = formatText.match(/alamat\s+penerima\s*:?\s*(.+)/i);
const noHpMatch = formatText.match(/no\s+hp\s*:\s*(.+)/i);
const namaKapalMatch = formatText.match(/nama\s+kapal\s+yg\s+di\s+gunakan\s*:\s*(.+)/i);
const namaPenerimaMatch = formatText.match(/nama\s+penerima\s*:\s*(.+)/i);
const pelabuhanTujuanMatch = formatText.match(/pelabuhan\s+tujuan\s*:\s*(.+)/i);
const tanggalPengirimanMatch = formatText.match(/tgl\s+pengiriman\s*:\s*(.+)/i);

	return {
		namaPengirim: namaPengirimMatch ? namaPengirimMatch[1].trim().toUpperCase() : '',
		alamatPengirim: alamatPengirimMatch ? alamatPengirimMatch[1].trim().toUpperCase() : '',
		alamatPenerima: alamatPenerimaMatch ? alamatPenerimaMatch[1].trim().toUpperCase() : '',
		noHpPengirim: noHpMatch ? noHpMatch[1].trim() : '',
		namaPenerima: namaPenerimaMatch ? namaPenerimaMatch[1].trim().toUpperCase() : '',
		pelabuhanTujuan: pelabuhanTujuanMatch ? pelabuhanTujuanMatch[1].trim().toUpperCase() : '',
		tanggalPengiriman: tanggalPengirimanMatch ? tanggalPengirimanMatch[1].trim().toUpperCase() : '',
		namaKapal: namaKapalMatch ? namaKapalMatch[1].trim().toUpperCase() : ''
	};
}
