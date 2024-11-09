// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				AUTH_SERVICE: any
				DATABASE: any
				FLOWERS_KV: any
			}
		}
	}
}

export {};
