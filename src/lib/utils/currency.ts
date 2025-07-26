// $lib/utils/currency.ts

const CURRENCY_FORMAT_CONFIG = {
	style: 'currency' as const,
	currency: 'IDR',
	minimumFractionDigits: 0,
};

export const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat('id-ID', CURRENCY_FORMAT_CONFIG).format(amount);
};

export const parseVolumeString = (volumeStr: string): number => {
	return parseFloat(volumeStr.replace(/\./g, '').replace(',', '.'));
};

export const formatVolume = (volume: number): string => {
	if (volume < 1000) {
		return volume % 1 === 0
			? volume.toString()
			: volume.toFixed(2).replace('.', ',');
	} else {
		return volume.toLocaleString('id-ID', {
			minimumFractionDigits: volume % 1 === 0 ? 0 : 2,
			maximumFractionDigits: 2
		});
	}
};

