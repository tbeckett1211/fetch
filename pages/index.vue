<script setup>
const { dBreeds, eBreeds, lBreeds, rBreeds } = dbCL("Breeds");
const { dDogIDs, eDogIDs, lDogIDs, rDogIDs } = dbCL("DogIDs");
const { dDogs, eDogs, lDogs, rDogs } = dbPost("Dogs");
const { dFavoriteId, eFavoriteId, lFavoriteId, rFavoriteId } =
	dbPost("FavoriteId");
const { dFavorite, eFavorite, lFavorite, rFavorite } = dbPost("Favorite");

const user = useState("user");
const favorites = useState("favorites", () => []);
const selectedBreeds = ref([]);
const prevUrl = ref(undefined);
const nextUrl = ref(undefined);
const totalRecords = ref(undefined);
const sort = ref("asc");
const showFavorite = ref(false);

const toast = useToast();

async function getDoggos(url = null) {
	if (user.value) {
		dDogs.value = null;
		if (!dBreeds.value) {
			await rBreeds(
				"https://frontend-take-home-service.fetch.com/dogs/breeds"
			);
		}
		const getIdsURL = url
			? "https://frontend-take-home-service.fetch.com" + url
			: selectedBreeds.value.length
			? `https://frontend-take-home-service.fetch.com/dogs/search?size=12&sort=breed:${
					sort.value
			  }${selectedBreeds.value
					.map((breed) => `&breeds[]=${encodeURIComponent(breed)}`)
					.join("")}`
			: `https://frontend-take-home-service.fetch.com/dogs/search?size=12&sort=breed:${sort.value}`;
		const { next, prev, total } = await rDogIDs(getIdsURL);
		prevUrl.value = prev;
		nextUrl.value = next;
		totalRecords.value = total;
		await rDogs(
			"https://frontend-take-home-service.fetch.com/dogs",
			dDogIDs.value.resultIds
		);
	}
}

async function generateMatch() {
	if (favorites?.value?.length < 1) {
		toast.add({
			title: "No favorite dogs selected",
			description:
				"You need to select at least one favorite dog to generate a match.",
			icon: "i-heroicons-exclamation-triangle-20-solid",
		});
	} else {
		const { match } = await rFavoriteId(
			"https://frontend-take-home-service.fetch.com/dogs/match",
			favorites.value
		);
		await rFavorite("https://frontend-take-home-service.fetch.com/dogs", [
			match,
		]);
		if (dFavorite.value) {
			showFavorite.value = true;
		}
	}
}

const handleSort = () => {
	if (sort.value === "asc") {
		sort.value = "desc";
	} else {
		sort.value = "asc";
	}
	getDoggos();
};

const handleNext = () => {
	if (nextUrl.value) getDoggos(nextUrl.value);
};

const handlePrev = () => {
	if (prevUrl.value) getDoggos(prevUrl.value);
};

onMounted(() => {
	getDoggos();
});
</script>

<template>
	<div class="flex justify-center mt-10" v-if="!user">
		<div
			class="bg-white dark:bg-neutral-800 shadow-lg rounded-lg p-8 max-w-lg text-center"
		>
			<h1 class="text-4xl font-bold text-primary mb-4">
				Find Your Perfect Dog
			</h1>
			<p class="mb-6">
				Search through a database of shelter dogs, filter by breed, and
				match with your favorite pups for adoption.
			</p>
			<ul class="text-left text-neutral-500 dark:text-neutral-400 mb-6">
				<li class="flex items-center">
					<span class="text-green-500 mr-2"
						><UIcon
							name="i-material-symbols-check-rounded"
							class="size-10"
					/></span>
					Browse and filter available dogs
				</li>
				<li class="flex items-center">
					<span class="text-green-500 mr-2"
						><UIcon
							name="i-material-symbols-check-rounded"
							class="size-10"
					/></span>
					Save your favorite dogs
				</li>
				<li class="flex items-center">
					<span class="text-green-500 mr-2"
						><UIcon
							name="i-material-symbols-check-rounded"
							class="size-10"
					/></span>
					Get matched with your perfect companion
				</li>
			</ul>
			<UButton size="xl" class="w-auto" to="/login"
				>Login to Get Started</UButton
			>
		</div>
	</div>
	<div v-else>
		<div class="flex justify-center">
			<div class="w-sm lg:w-lg">
				<div class="text-muted text-xs mb-1 ml-1">
					Show these breeds
				</div>
				<USelectMenu
					class="w-sm max-w-sm lg:w-full lg:max-w-full"
					size="xl"
					placeholder="All Breeds"
					v-model="selectedBreeds"
					:items="dBreeds"
					multiple
				/>
				<div class="grid grid-cols-2 gap-4">
					<UButton
						class="w-full mt-2 flex items-center gap-2"
						@click="getDoggos()"
						:disabled="lBreeds || lDogIDs || lDogs"
					>
						<UIcon
							name="i-material-symbols-search-rounded"
							class="size-4"
						/>
						<div>Search</div>
					</UButton>
					<UButton
						:loading="lFavorite || lFavoriteId"
						variant="outline"
						class="w-full mt-2 flex items-center gap-2"
						@click="generateMatch"
						:disabled="lBreeds || lDogIDs || lDogs"
					>
						<UIcon
							name="i-material-symbols-favorite"
							class="size-4"
						/>
						<div>Generate Match</div>
					</UButton>
				</div>
			</div>
		</div>

		<p v-if="eBreeds || eDogIDs || eDogs" class="text-red-500">
			Something went wrong...
		</p>

		<div v-if="lBreeds || lDogIDs || lDogs">
			<div class="h-14"></div>
			<div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
				<div v-for="i in 12" :key="i">
					<DogCardSkeleton />
				</div>
			</div>
		</div>

		<div v-if="dDogs">
			<div class="grid grid-cols-5 mt-6">
				<div v-if="prevUrl">
					<UButton
						size="sm"
						variant="soft"
						class="w-auto flex items-center gap-1"
						@click="handlePrev"
					>
						<UIcon
							name="i-material-symbols-keyboard-double-arrow-left-rounded"
							class="size-5"
						/>
						<div class="hidden lg:block">View Prev Page</div>
					</UButton>
				</div>
				<div v-else></div>

				<div class="flex justify-center col-span-3">
					<UButton
						variant="soft"
						@click="handleSort"
						size="sm"
						class="w-auto"
					>
						<div class="flex items-center gap-1">
							<UIcon
								:name="
									sort === 'asc'
										? 'i-mdi-sort-alphabetical-ascending-variant'
										: 'i-mdi-sort-alphabetical-descending-variant'
								"
								class="size-5"
							/>
							{{
								sort === "asc"
									? "Sort By Breeds Z-A"
									: "Sort By Breeds A-Z"
							}}
						</div>
					</UButton>
				</div>

				<div class="flex justify-end" v-if="nextUrl">
					<UButton
						size="sm"
						variant="soft"
						class="w-auto flex items-center gap-1"
						v-if="nextUrl"
						@click="handleNext"
					>
						<div class="hidden lg:block">View Next Page</div>
						<UIcon
							name="i-material-symbols-keyboard-double-arrow-right-rounded"
							class="size-5"
						/>
					</UButton>
				</div>
				<div v-else></div>
			</div>
			<div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
				<DogCard v-for="doggo in dDogs" :key="doggo.id" :dog="doggo" />
			</div>
			<div class="flex justify-between mt-6">
				<div v-if="prevUrl">
					<UButton
						size="sm"
						variant="soft"
						class="w-auto flex items-center gap-1"
						@click="handlePrev"
					>
						<UIcon
							name="i-material-symbols-keyboard-double-arrow-left-rounded"
							class="size-5"
						/>
						<div>View Prev Page</div></UButton
					>
				</div>
				<div v-else></div>
				<UButton
					size="sm"
					variant="soft"
					class="w-auto flex items-center gap-1"
					v-if="nextUrl"
					@click="handleNext"
				>
					<div>View Next Page</div>
					<UIcon
						name="i-material-symbols-keyboard-double-arrow-right-rounded"
						class="size-5"
					/>
				</UButton>
			</div>
		</div>
	</div>
	<UModal v-model:open="showFavorite">
		<template #header>
			<div class="text-2xl text-center text-primary font-bold">
				Your perfect match
			</div>
			<div class="text-sm text-center">
				♡ Here's your perfect match based on your favorited dogs ♡
			</div>
		</template>
		<template #body>
			<div class="flex justify-center">
				<img
					:src="dFavorite[0].img"
					:alt="dFavorite[0].name"
					class="w-full max-h-[400px] object-cover"
				/>
			</div>
			<div class="text-4xl text-primary font-bold text-center mt-4">
				{{ dFavorite[0].name }}
			</div>
			<div>
				<span class="font-bold">Age:</span> {{ dFavorite[0].age }} yrs
				old
			</div>
			<div>
				<span class="font-bold">Breed:</span> {{ dFavorite[0].breed }}
			</div>
			<div>
				<span class="font-bold">Located in:</span>
				{{ dFavorite[0].zip_code }} zip code
			</div>
		</template>
		<template #footer>
			<UButton
				@click="showFavorite = false"
				variant="soft"
				class="w-full"
			>
				Close
			</UButton>
		</template>
	</UModal>
</template>
