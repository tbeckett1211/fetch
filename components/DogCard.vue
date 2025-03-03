<script setup>
const favorites = useState("favorites");
const isFavorite = computed(() => (id) => favorites?.value?.includes(id));

defineProps({
	dog: Object,
});

function toggleFavorite(id) {
	if (!favorites.value) {
		favorites.value = [];
	}
	if (favorites.value.includes(id)) {
		favorites.value = [...favorites.value.filter((f) => f !== id)];
	} else {
		favorites.value = [...favorites.value, id];
	}
}
</script>

<template>
	<div
		class="bg-neutral-100 dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden"
	>
		<div class="relative h-60 overflow-hidden">
			<img
				:src="dog.img"
				:alt="dog.name"
				class="w-full h-full object-cover"
			/>
			<UTooltip
				:delay-duration="0"
				:text="
					isFavorite(dog.id)
						? 'Remove from favorites'
						: 'Add to favorites'
				"
			>
				<div
					@click="toggleFavorite(dog.id)"
					class="absolute bg-neutral-100 dark:bg-neutral-800 top-2 right-2 w-10 h-10 text-primary rounded-full flex items-center justify-center"
				>
					<UIcon
						v-if="isFavorite(dog.id)"
						name="i-material-symbols-favorite"
						class="size-7"
					/>
					<UIcon
						v-else
						name="i-material-symbols-favorite-outline"
						class="size-7"
					/>
				</div>
			</UTooltip>
		</div>

		<div class="px-2 pt-1 pb-2">
			<div class="flex justify-between items-end">
				<div class="text-xl font-bold text-primary">
					{{ dog.name }}
				</div>
				<div class="text-gray-600 dark:text-gray-400 text-sm">
					{{ dog.age }} yrs old
				</div>
			</div>
			<div class="flex items-center justify-between">
				<div
					class="bg-neutral-200 dark:bg-neutral-700 rounded-lg px-2 py-1 inline-block text-gray-700 dark:text-gray-300 text-sm"
				>
					{{ dog.breed }}
				</div>
				<div class="flex items-center gap-1">
					<UIcon
						name="i-material-symbols-location-on-outline"
						class="size-5 text-primary"
					/>
					<div>
						{{ dog.zip_code }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
