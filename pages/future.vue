<template>
	<div
		className="flex flex-col items-center justify-center bg-neutral-800 p-6"
	>
		<h1 className="text-4xl font-bold mb-4 text-primary">Coming Soon</h1>
		<p className="text-lg max-w-2xl text-center mb-6">
			This is just the beginning. If I were to continue building this app,
			I would implement:
		</p>
		<ul className="list-disc list-inside text-lg max-w-lg text-center mb-6">
			<li>O Auth Login</li>
			<li>Account creation</li>
			<li>Lost or forgotten password</li>
			<li>Geolocation-based searches with interactive maps</li>
			<li>More detailed filtering (age, sex, location)</li>
			<li>Social media sharing</li>
		</ul>
		<p className="text-lg max-w-2xl text-center mb-6">
			I have the skills to make all of this happen and more. Let’s talk!
		</p>
		<div class="flex gap-4">
			<UButton
				class="w-auto flex items-center gap-2"
				to="https://yestotim.tech"
				target="_blank"
			>
				<UIcon name="i-material-symbols:cards-star" class="size-5" />
				<div>View Portfolio</div>
			</UButton>
			<UButton
				variant="soft"
				class="w-auto flex items-center gap-2"
				to="https://linkedin.com/in/tbeckett1211"
				target="_blank"
			>
				<UIcon name="i-bi:linkedin" class="size-5" />
				<div>View LinkedIn</div>
			</UButton>
		</div>
	</div>
</template>
