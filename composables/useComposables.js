const createHttpComposable = (method) => {
	const getNaming = (method, resourceName = "") => {
		switch (method.toUpperCase()) {
			case "POST":
				return {
					action: `create${resourceName}`,
					prefix: `create${resourceName}`,
				};
			case "PATCH":
				return {
					action: `update${resourceName}`,
					prefix: `update${resourceName}`,
				};
			case "DELETE":
				return {
					action: `remove${resourceName}`,
					prefix: `remove${resourceName}`,
				};
			case "GET":
				return {
					action: `refresh${resourceName}`,
					prefix: resourceName ? resourceName.toLowerCase() : "",
				};
			default:
				return {
					action: `execute${resourceName}`,
					prefix: resourceName ? resourceName.toLowerCase() : "",
				};
		}
	};

	return (url, resourceName = "") => {
		const loading = ref(false);
		const error = ref(null);
		const data = ref(null);
		const { action, prefix } = getNaming(method, resourceName);
		const execute = async (body, specialUrl = url) => {
			loading.value = true;
			error.value = null;
			data.value = null;

			const validationString =
				body?.validation && typeof body.validation === "function"
					? body.validation.toString()
					: undefined;

			const bodyCopy = body ? JSON.parse(JSON.stringify(body)) : body;

			if (validationString) {
				bodyCopy.validation = validationString;
			}

			const options = {
				method,
				credentials: "include",
				...(method !== "GET" && bodyCopy && method !== "DELETE"
					? { body: JSON.stringify(bodyCopy) }
					: {}),
			};

			try {
				const result = await $fetch(specialUrl, options);
				data.value = result;
				return { data: result, error: null };
			} catch (err) {
				error.value = err;
				return { data: null, error: err };
			} finally {
				loading.value = false;
			}
		};
		if (method === "GET") {
			execute();
		}
		const propertyNames = {
			data: prefix ? `${prefix}Data` : "data",
			error: prefix ? `${prefix}Error` : "error",
			loading: prefix ? `${prefix}Loading` : "loading",
		};
		return {
			[action]: execute,
			[propertyNames.data]: data,
			[propertyNames.error]: error,
			[propertyNames.loading]: loading,
		};
	};
};

export const useGet = createHttpComposable("GET");
export const usePost = createHttpComposable("POST");
export const usePatch = createHttpComposable("PATCH");
export const useDelete = createHttpComposable("DELETE");

export async function onFormError(event) {
	if (event?.errors?.[0]?.id) {
		const element = document.getElementById(event.errors[0].id);
		element?.focus();
		element?.scrollIntoView({ behavior: "smooth", block: "center" });
	}
}

export async function dbS(url, resourceName = "") {
	const { data, error } = await useFetch(url, {
		server: true,
		credentials: "include",
		key: String(Date.now()),
		headers: {
			...useRequestHeaders(["cookie", "authorization"]), // Forward relevant headers
		},
	});
	return {
		[`d${resourceName}`]: data,
		[`e${resourceName}`]: error,
	};
}

export function dbCL(resourceName = "") {
	const d = ref(null);
	const e = ref(null);
	const l = ref(false);
	const r = async (url) => {
		d.value = null;
		e.value = null;
		l.value = true;
		try {
			const response = await $fetch(url, { credentials: "include" });
			d.value = response;
			return response;
		} catch (err) {
			e.value = err;
		} finally {
			l.value = false;
		}
	};
	return {
		[`d${resourceName}`]: d,
		[`e${resourceName}`]: e,
		[`l${resourceName}`]: l,
		[`r${resourceName}`]: r,
	};
}

export function dbC(url, resourceName = "") {
	const d = ref(null);
	const e = ref(null);
	const l = ref(true);
	const { data, error, status } = useFetch(url, {
		server: false,
		immediate: true,
		credentials: "include",
	});
	watch(status, (newStatus) => {
		if (newStatus === "success" || newStatus === "error") {
			l.value = false;
		}
	});
	watch(data, (newData) => {
		d.value = newData;
	});
	watch(error, (newError) => {
		e.value = newError;
	});
	return {
		[`d${resourceName}`]: d,
		[`e${resourceName}`]: e,
		[`l${resourceName}`]: l,
	};
}

function dbMutate(method, resourceName = "") {
	const d = ref(null);
	const e = ref(null);
	const l = ref(false);

	const r = async (url, body = {}, options = {}) => {
		d.value = null;
		e.value = null;
		l.value = true;
		try {
			const response = await $fetch(url, {
				method,
				body,
				credentials: "include",
				...options,
			});
			d.value = response;
			return response;
		} catch (err) {
			e.value = err;
		} finally {
			l.value = false;
		}
	};
	return {
		[`d${resourceName}`]: d,
		[`e${resourceName}`]: e,
		[`l${resourceName}`]: l,
		[`r${resourceName}`]: r,
	};
}

export function dbPost(resourceName = "") {
	return dbMutate("post", resourceName);
}

export function dbPatch(resourceName = "") {
	return dbMutate("patch", resourceName);
}

export function dbPut(resourceName = "") {
	return dbMutate("put", resourceName);
}

export function dbDelete(resourceName = "") {
	return dbMutate("delete", resourceName);
}
