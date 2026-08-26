import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supabase-public.server-BMC50eTv.js
/** Server-side publishable client for public reads/writes inside server functions. */
function createPublicServerClient() {
	const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
	const url = process.env["SUPABASE_URL"];
	return createClient(url, key, {
		auth: { persistSession: false },
		global: { fetch: (input, init) => {
			const headers = new Headers(init?.headers);
			if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
			headers.set("apikey", key);
			return fetch(input, {
				...init,
				headers
			});
		} }
	});
}
//#endregion
export { createPublicServerClient };
