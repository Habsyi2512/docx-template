<script lang="ts">
	import mammoth from 'mammoth';
	import { onMount } from 'svelte';

	let container: HTMLElement;

	const path = '/template_skai.docx';

	const options = {};

	onMount(async () => {
		const response = await fetch(path);
		const arrayBuffer = await response.arrayBuffer();

		const result = await mammoth.convertToHtml({ arrayBuffer });

		container.innerHTML = result.value;
	});
</script>

<div bind:this={container}></div>
