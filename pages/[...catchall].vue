<template>
	<div class="flex flex-col items-center justify-center mt-20">
		<UIcon
			name="i-material-symbols-sound-detection-dog-barking-outline"
			class="size-25 text-primary mb-4"
		/>
		<h1 class="text-4xl font-bold">404 - Page Not Found</h1>
		<p class="mt-2 text-lg">We couldn't find what you were looking for.</p>
		<NuxtLink to="/" class="mt-4 text-primary underline"
			>Back to Home</NuxtLink
		>
	</div>
</template>

<script setup>
definePageMeta({
	layout: "default",
});
</script>
