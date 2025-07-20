<!-- src/routes/+layout.svelte -->

<script>
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Container from '$lib/components/Container.svelte';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});

	async function handleLogout() {
		await supabase.auth.signOut();
		invalidate('supabase:auth');

		// Redirect to home after logout
		window.location.href = '/';
	}
</script>

<!-- Glassmorphism Header -->
<header class="fixed top-4 left-1/2 z-50 w-[90%] max-w-5xl -translate-x-1/2 transform rounded-2xl border border-white/30 bg-white/20 shadow-lg backdrop-blur-md">
	<nav class="flex h-16 items-center justify-between px-6">
		<div class="text-sm lg:text-lg font-semibold tracking-wide text-white">
			<a href="/">Docx-Template</a>
		</div>
		<div class="flex space-x-2 text-base font-medium text-white">
			<a href="/" class="rounded-md bg-white/40 p-2 text-sm transition hover:bg-white/20">Home</a>
			<a href="/dashboard" class="rounded-md bg-white/40 p-2 text-sm transition hover:bg-white/20">Dashboard</a>
			{#if session}
				<button
					onclick={() => {
						confirm('Are you sure you want to logout?') && handleLogout();
					}}
					class="cursor-pointer rounded-md bg-white/40 px-3 py-1 text-sm transition hover:bg-white/20"
				>
					Logout
				</button>
			{/if}
		</div>
	</nav>
</header>

<main class="min-h-screen w-full bg-gradient-to-b from-blue-500 from-65% to-white pt-20">
	<Container>
		{@render children()}
	</Container>
</main>
