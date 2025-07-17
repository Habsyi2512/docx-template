export function bulanKeRomawi(bulan: number): string {
	const romawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
	return romawi[bulan - 1] || '';
}
