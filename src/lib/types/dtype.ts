export type IkanType = {
	no: number;
	nama: string;
	koli: string;
	volume: string;
	harga: string;
};

export type SKAIDataType = {
	nama: string;
	alamat: string;
	noHp: string;
	namaPenerima: string;
	total: string;
	pelabuhanTujuan: string;
	namaKapal: string;
	tanggalPengiriman: string;
	ikan: IkanType[];
	totalVolume: string;
	tanggal: string;
	kodeSurat: string;
};
