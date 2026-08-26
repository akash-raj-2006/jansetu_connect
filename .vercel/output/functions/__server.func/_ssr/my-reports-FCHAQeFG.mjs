//#region node_modules/.nitro/vite/services/ssr/assets/my-reports-FCHAQeFG.js
var KEY = "jansetu.my-reports";
/** Tracking codes this browser has filed, newest first (guest reporting support). */
function getSavedCodes() {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		if (!Array.isArray(parsed)) return [];
		return parsed.filter((v) => typeof v === "string").slice(0, 30);
	} catch {
		return [];
	}
}
function saveCode(code) {
	if (typeof window === "undefined") return;
	const clean = code.trim().toUpperCase();
	if (!clean) return;
	const next = [clean, ...getSavedCodes().filter((c) => c !== clean)].slice(0, 30);
	try {
		window.localStorage.setItem(KEY, JSON.stringify(next));
	} catch {}
}
//#endregion
export { saveCode as n, getSavedCodes as t };
