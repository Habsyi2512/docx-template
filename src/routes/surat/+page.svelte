<script lang="ts">
	import TabelJenisIkan from '$lib/TabelJenisIkan.svelte';
	import TabelPengirimIkan from '$lib/TabelPengirimIkan.svelte';
</script>

<div class="w-full">
	<div class="mx-auto flex w-fit">
		<img class="h-[2.16cm] w-[2.39cm] object-contain" src="/img/logo-anambas.webp" alt="logo.png" />
		<div class="font-arial leading-[1.15]">
			<h1 class="text-center">PEMERINTAH KABUPATEN KEPULAUAN ANAMBAS</h1>
			<h1 class="text-center text-2xl font-bold">DINAS PERIKANAN PERTANIAN DAN PANGAN</h1>
			<h1 class="text-cener text-[11pt]/[1.15]">Jl. Imam Bonjol, Tarempa, Siantan, Kepulauan Anambas, Kepulauan Riau 29791,</h1>
			<h1 class="text-center text-[11pt]">Pos-el dppp@anambaskab.go.id</h1>
		</div>
	</div>
	<hr class="my-3 border-t-3" />
	<div class="font-cambria">
		<div class="mb-5 leading-4">
			<h1 class="text-center text-[11pt] font-bold underline">SURAT KETERANGAN ASAL IKAN</h1>
			<h1 class="text-center text-[11pt]">Nomor : 500.5.4/DPPP/SKAI/091/VII/2025</h1>
		</div>

		<div class="mb-5">
			<p class="text-justify leading-4.5">
				Berdasarkan Surat Kepala Dinas Kelautan dan Perikanan Provinsi Kepulauan Riau Nomor : B-523.7/1132/DKP/2023, Perihal Surat Keterangan Asal Tangkapan Ikan , Kepala Dinas Perikanan Kabupaten
				Kepulauan Anambas dengan ini memberikan Surat Keterangan Asal Ikan (SKAI) terhadap pemuatan / pengiriman ikan produk hasil perikanan keluar daerah kepada:
			</p>
			<ul class="list-decimal pl-6 leading-5">
				<li><span class="inline-block w-25">Nama</span>: <span class="pl-1">MUHAMMAD HABSYI MUBARAK</span></li>
				<li><span class="inline-block w-25">Alamat</span>: <span class="pl-1">TAREMPA</span> KAB.KEP.ANAMBAS</li>
				<li><span class="inline-block w-25">No.Hp/Telp</span>: <span class="pl-1">08127057548</span></li>
			</ul>
		</div>

		<div>
			<span class="pl-3">A.</span>

			<TabelJenisIkan />
			<TabelPengirimIkan />

			<p class="mt-2">Demikian Surat Keterangan Asal Ikan (SKAI) ini diberikan untuk dipergunakan sebagaimana mestinya.</p>

			<div class="relative mt-8 w-full">
				<div class="absolute top-0 right-0 w-full max-w-[300px]">
					<di class="leading-5">
						<p>Tarempa, 15 Juli 2025</p>
						<p>Analis Pasar Hasil Perikanan Ahli Muda</p>
					</di>
					<div class="relative h-[100px] w-full">
						<div class="absolute -left-5 flex h-full w-full">
							<img src="/img/cap.png" alt="" />
							<img src="/img/ttd.png" alt="" class="-ml-10" />
						</div>
					</div>

					<!-- TTD NAMA -->
					<div>
						<p>YUSNITA, S.Pi</p>
						<p>NIP. 19780307 200801 2 006</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@page {
		size: A4;
		margin: 0.3cm 1.5cm 0.3cm 1.5cm;
	}
</style>
