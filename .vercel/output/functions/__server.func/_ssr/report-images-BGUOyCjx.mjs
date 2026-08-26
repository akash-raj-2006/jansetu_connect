//#region node_modules/.nitro/vite/services/ssr/assets/report-images-BGUOyCjx.js
/**
* Browser-side helpers for citizen photo evidence.
*
* Images are compressed in the browser, uploaded straight to cloud storage,
* and only their storage *paths* are saved with the report — never binary data.
*/
var IMAGE_BUCKET = "report-images";
var MAX_WIDTH = 1600;
var ALLOWED = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp"
];
function validateImageFile(file) {
	if (!ALLOWED.includes(file.type.toLowerCase())) return `${file.name}: only JPG, PNG or WebP images are allowed.`;
	if (file.size > 5242880) return `${file.name}: file is ${(file.size / 1024 / 1024).toFixed(1)}MB — the limit is 5MB.`;
	return null;
}
/** Downscale to MAX_WIDTH and re-encode as JPEG to save the citizen's bandwidth. */
async function compressImage(file) {
	try {
		const bitmap = await createImageBitmap(file);
		const scale = Math.min(1, MAX_WIDTH / bitmap.width);
		const width = Math.round(bitmap.width * scale);
		const height = Math.round(bitmap.height * scale);
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");
		if (!ctx) return file;
		ctx.drawImage(bitmap, 0, 0, width, height);
		bitmap.close?.();
		const blob = await new Promise((resolve) => canvas.toBlob((value) => resolve(value), "image/jpeg", .82));
		return blob && blob.size < file.size ? blob : file;
	} catch {
		return file;
	}
}
/** Upload one image with real progress reporting (XHR gives us upload events). */
function uploadImage(blob, onProgress, signal) {
	const url = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_PROJECT_ID": "rzjvklvsbrrgfnhxmdgq",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_4RCnS_taXL5Xdwb7gnqaoA_1nYyAoIu",
		"VITE_SUPABASE_URL": "https://rzjvklvsbrrgfnhxmdgq.supabase.co"
	}["VITE_SUPABASE_URL"];
	const key = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_PROJECT_ID": "rzjvklvsbrrgfnhxmdgq",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_4RCnS_taXL5Xdwb7gnqaoA_1nYyAoIu",
		"VITE_SUPABASE_URL": "https://rzjvklvsbrrgfnhxmdgq.supabase.co"
	}["VITE_SUPABASE_PUBLISHABLE_KEY"];
	const path = `${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}/${crypto.randomUUID()}.jpg`;
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("POST", `${url}/storage/v1/object/${IMAGE_BUCKET}/${path}`);
		xhr.setRequestHeader("apikey", key);
		xhr.setRequestHeader("x-upsert", "true");
		xhr.setRequestHeader("content-type", blob.type || "image/jpeg");
		xhr.upload.onprogress = (event) => {
			if (event.lengthComputable) onProgress(Math.round(event.loaded / event.total * 100));
		};
		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				onProgress(100);
				resolve(path);
			} else reject(/* @__PURE__ */ new Error(`Upload failed (${xhr.status})`));
		};
		xhr.onerror = () => reject(/* @__PURE__ */ new Error("Upload failed — check your connection."));
		signal?.addEventListener("abort", () => xhr.abort());
		xhr.send(blob);
	});
}
//#endregion
export { validateImageFile as i, compressImage as n, uploadImage as r, IMAGE_BUCKET as t };
