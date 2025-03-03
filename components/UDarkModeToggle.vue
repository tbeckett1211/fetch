<script setup>
const colorMode = useColorMode();
const isDark = computed({
	get() {
		return colorMode.value === "dark";
	},
	set() {
		colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
	},
});
</script>

<template>
	<ClientOnly>
		<UButton
			:icon="
				isDark
					? 'i-heroicons-moon-20-solid'
					: 'i-heroicons-sun-20-solid'
			"
			aria-label="Theme"
			size="sm"
			class="p-1"
			@click="isDark = !isDark"
		/>
	</ClientOnly>
</template>
