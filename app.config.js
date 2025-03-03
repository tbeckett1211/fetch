export default defineAppConfig({
	ui: {
		colors: {
			primary: "orange",
			neutral: "neutral",
		},
		input: {
			defaultVariants: {
				size: "xl",
			},
			slots: {
				root: "w-full",
			},
		},
		button: {
			defaultVariants: {
				size: "xl",
			},
			slots: {
				base: "w-full justify-center",
			},
		},
	},
});
