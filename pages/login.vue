<script setup>
const router = useRouter();
const route = useRoute();

const user = useState("user", () => null);
const authExpiration = useState("authExpiration", () => null);

const formState = reactive({
	name: undefined,
	email: undefined,
});

const validate = (state) => {
	const errors = [];
	if (!state.email)
		errors.push({
			name: "email",
			message: "Please include a valid email address",
		});
	if (!state.name)
		errors.push({ name: "name", message: "Please include your name" });
	return errors;
};

const { create, createData, createError, createLoading } = usePost(
	"https://frontend-take-home-service.fetch.com/auth/login"
);

const login = async () => {
	await create(formState);
	if (createData && createData?.value === "OK") {
		user.value = true;
		authExpiration.value = new Date(new Date().getTime() + 3600000);
		router.push("/");
	}
};
</script>

<template>
	<UCard class="max-w-sm mx-auto mt-10">
		<div class="text-2xl text-center mb-4">Login</div>
		<UAlert
			v-if="createError"
			description="There was an error logging in.  Please try again later."
			color="error"
			variant="soft"
			class="mb-4 text-center py-2.5"
		/>
		<UForm
			:validate="validate"
			:state="formState"
			@submit="login"
			@error="onFormError"
		>
			<UFormField name="name">
				<UInput
					autocomplete="name"
					icon="i-material-symbols-person-2-outline-rounded"
					v-model="formState.name"
					placeholder="enter your name"
				/>
			</UFormField>
			<UFormField name="email">
				<UInput
					class="my-4"
					autocomplete="email"
					icon="i-material-symbols-person-2-outline-rounded"
					v-model="formState.email"
					placeholder="enter your email address"
				/>
			</UFormField>

			<UButton :loading="createLoading" type="submit" color="primary"
				>Login</UButton
			>
		</UForm>

		<USeparator class="my-4" label="OR" />

		<UButton variant="soft" to="/future">
			<UIcon name="i-simple-icons-google" class="mr-2" /> Login with
			Google
		</UButton>

		<USeparator class="my-6" />

		<div class="text-center text-sm">
			Want to join?
			<NuxtLink to="/future" class="text-primary hover:underline"
				>Create an account here</NuxtLink
			>
		</div>
		<div class="text-center mt-2 text-sm">
			<NuxtLink to="/future" class="text-neutral-500 hover:underline"
				>Forgot password?</NuxtLink
			>
		</div>
	</UCard>
</template>
