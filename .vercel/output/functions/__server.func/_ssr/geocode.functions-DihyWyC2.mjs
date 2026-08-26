import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as stringType, i as objectType, r as numberType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/geocode.functions-DihyWyC2.js
var ReverseInput = objectType({
	lat: numberType(),
	lng: numberType()
});
var SearchInput = objectType({ query: stringType().min(2).max(160) });
var UA = "JanSetu civic reporting prototype (https://lovable.dev)";
/** Turn coordinates into a human-readable Indian street address. */
var reverseGeocode_createServerFn_handler = createServerRpc({
	id: "33d28cf81a684e99f43f74ae939b7eccf8810610ac9db7142c41cf93d9c6f3d4",
	name: "reverseGeocode",
	filename: "src/lib/geocode.functions.ts"
}, (opts) => reverseGeocode.__executeServer(opts));
var reverseGeocode = createServerFn({ method: "POST" }).inputValidator((input) => ReverseInput.parse(input)).handler(reverseGeocode_createServerFn_handler, async ({ data }) => {
	try {
		const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&addressdetails=1&lat=${data.lat}&lon=${data.lng}`;
		const response = await fetch(url, { headers: {
			"User-Agent": UA,
			Accept: "application/json"
		} });
		if (!response.ok) return {
			ok: false,
			error: `Lookup failed (${response.status})`
		};
		return {
			ok: true,
			address: (await response.json()).display_name ?? ""
		};
	} catch (error) {
		console.error("reverse geocode failed", error);
		return {
			ok: false,
			error: "Address lookup is unavailable right now."
		};
	}
});
var searchPlaces_createServerFn_handler = createServerRpc({
	id: "08a75f919f9b1e09dc91fdd7984321329f99ba2c3337af84a57e2a84ad0da7d7",
	name: "searchPlaces",
	filename: "src/lib/geocode.functions.ts"
}, (opts) => searchPlaces.__executeServer(opts));
var searchPlaces = createServerFn({ method: "POST" }).inputValidator((input) => SearchInput.parse(input)).handler(searchPlaces_createServerFn_handler, async ({ data }) => {
	try {
		const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=in&limit=6&q=${encodeURIComponent(data.query)}`;
		const response = await fetch(url, { headers: {
			"User-Agent": UA,
			Accept: "application/json"
		} });
		if (!response.ok) return {
			ok: false,
			error: `Search failed (${response.status})`
		};
		return {
			ok: true,
			results: (await response.json()).map((item) => ({
				address: item.display_name,
				lat: Number(item.lat),
				lng: Number(item.lon)
			}))
		};
	} catch (error) {
		console.error("place search failed", error);
		return {
			ok: false,
			error: "Address search is unavailable right now."
		};
	}
});
//#endregion
export { reverseGeocode_createServerFn_handler, searchPlaces_createServerFn_handler };
