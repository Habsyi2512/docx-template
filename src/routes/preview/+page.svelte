<script lang="ts">
	import { onMount } from 'svelte';
	import { renderAsync } from 'docx-preview';

	let container: HTMLElement;
  

	onMount(async () => {
    const file = await fetch('/template_skai.docx');
    const arrayBuffer = await file.arrayBuffer();

		if (container) {
			await renderAsync(arrayBuffer, container);
			console.log('berhasil');
		}
	});
</script>

<div>
	<p>oke</p>
	<div bind:this={container} class="mx-auto max-h-[80vh] w-full overflow-auto border bg-white p-4"></div>
</div>
