<template>
	<UApp>
		<div
			class="flex max-w-6xl mx-auto justify-between items-center border-b border-gray-200 dark:border-gray-800 px-4"
		>
			<NuxtLink
				to="/"
				class="text-primary text-2xl font-bold flex items-center gap-2"
			>
				<UIcon
					name="i-material-symbols-sound-detection-dog-barking-outline"
					class="w-8 h-8"
				/>
				<div>Fetch</div>
			</NuxtLink>
			<div class="flex items-center gap-2">
				<UNavigationMenu
					highlight
					content-orientation="vertical"
					color="primary"
					variant="pill"
					:items="links"
					class="w-auto"
				/>
				<UDarkModeToggle />
			</div>
		</div>
		<div class="px-4 py-4 max-w-6xl mx-auto">
			<NuxtPage />
		</div>
	</UApp>
</template>

<script setup>
const user = useState("user", () => null);
const authExpiration = useState("authExpiration", () => null);

const { create } = usePost(
	"https://frontend-take-home-service.fetch.com/auth/logout"
);

const checkAuth = async () => {
	const res = await fetch(
		"https://frontend-take-home-service.fetch.com/dogs/search?size=1",
		{
			credentials: "include",
		}
	);
	if (res.ok) {
		user.value = true;
		authExpiration.value = new Date(new Date().getTime() + 3600000);
	} else {
		user.value = null;
		authExpiration.value = null;
	}
};

const logout = async () => {
	user.value = null;
	authExpiration.value = null;
	navigateTo("/login");
	const result = await create();
};

let logoutTimer = null;

watchEffect(() => {
	if (authExpiration.value) {
		const timeRemaining = new Date(authExpiration.value) - new Date();
		if (timeRemaining > 0) {
			clearTimeout(logoutTimer);
			logoutTimer = setTimeout(logout, timeRemaining);
		} else {
			logout();
		}
	} else {
		clearTimeout(logoutTimer);
	}
});

onMounted(async () => {
	await checkAuth();
});

const links = computed(() =>
	user.value
		? [
				{
					icon: "i-ph-sign-in",
					onSelect: logout,
					label: "Logout",
				},
		  ]
		: [
				{
					label: "Login",
					icon: "i-ph-sign-in",
					to: "/login",
				},
		  ]
);
</script>
