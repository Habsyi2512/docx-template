<!-- /routes/auth/+page.svelte -->
<script lang="ts">
	import { EyeOff, Eye } from '$lib/components/icons';
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	let showPassword = $state(false);
	let isSubmitting = $state(false);

	const handleShowPassword = () => {
		showPassword = !showPassword;
	};

	const { form }: PageProps = $props();
</script>

<main class="flex h-screen w-full items-center justify-center px-5 lg:px-0">
	<form
		method="POST"
		action="?/login"
		use:enhance={() => {
			isSubmitting = true;

			return async ({ result }) => {
				isSubmitting = false;
				if (result.type === 'success') {
					toast.success('Login berhasil!');

					goto('/dashboard', {
						replaceState: true,
						invalidateAll: true
					});
				}
			};
		}}
		class="h-fit w-full max-w-md rounded-lg border border-gray-200/50 bg-white p-5 shadow-lg"
	>
		<h1 class="mb-5 text-2xl font-bold text-blue-400">Login</h1>
		<!-- Email -->
		<div class="mb-5">
			<label class="text-gray-500" for="email">Email</label>
			<input name="email" id="email" type="email" placeholder="Masukkan email" required class="w-full rounded-lg border border-gray-400/50 p-2 shadow" />
		</div>

		<!-- Password -->
		<div class="mb-5">
			<label class="text-gray-500" for="password">Password</label>
			<div class="flex w-full items-center overflow-hidden rounded-lg border border-gray-400/50 shadow">
				<input name="password" id="password" type={showPassword ? 'text' : 'password'} placeholder="Masukkan Password" required class="h-full w-full border-none p-2 focus:ring-0" />
				<button type="button" onclick={handleShowPassword} class="cursor-pointer">
					{#if showPassword}
						<Eye class="mr-2 size-5 text-gray-500" />
					{:else}
						<EyeOff class="mr-2 size-5 text-gray-500" />
					{/if}
				</button>
			</div>
		</div>

		{#if form}
			<div class="mb-5 w-full rounded-lg bg-red-200 p-2">
				<p class="text-sm text-red-500">{form.error}</p>
			</div>
		{/if}

		<button
			disabled={isSubmitting}
			class="w-full cursor-pointer rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600 active:bg-blue-500 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
			type="submit"
		>
			{isSubmitting ? 'Logging in...' : 'Login'}
		</button>
	</form>
</main>
