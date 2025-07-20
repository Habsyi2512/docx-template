export type IkanType = {
	no: number;
	nama: string;
	koli: string;
	volume: string;
	harga: string | undefined;
};

export type SKAIDataType = {
	namaPengirim: string;
	alamatPengirim: string;
	noHpPengirim: string;
	namaPenerima: string;
	alamatPenerima: string;
	pelabuhanTujuan: string;
	namaKapal: string;
	tanggalPengiriman: string;
	ikan: IkanType[];
	totalVolume: string;
	tanggalTTD: string;
	kodeSurat: string;
	totalHarga: string;
};
