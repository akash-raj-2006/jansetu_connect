import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { O as isRedirect, _ as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BZ-Wjzqq.mjs";
import { a as stringType, i as objectType, r as numberType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jansetu.functions-DixiE17k.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var SubmitInput = objectType({
	wardId: stringType().min(1),
	lat: numberType(),
	lng: numberType(),
	text: stringType().max(4e3).optional(),
	audioBase64: stringType().optional(),
	audioFormat: stringType().optional(),
	languageHint: stringType().default("auto"),
	channel: stringType().default("web"),
	reporterName: stringType().max(80).optional(),
	address: stringType().max(300).default(""),
	imagePaths: arrayType(stringType().max(300)).max(3).default([])
});
var BriefInput = objectType({
	wardId: stringType().min(1),
	category: stringType().min(1)
});
var submitReport = createServerFn({ method: "POST" }).inputValidator((input) => SubmitInput.parse(input)).handler(createSsrRpc("6c8238152658904ed03ec1ad12301e4d3a04805e50126e369a1b00882464bda2"));
var generateBrief = createServerFn({ method: "POST" }).inputValidator((input) => BriefInput.parse(input)).handler(createSsrRpc("f6e82f3d98e68944d8a00fb4ea2a56123910f3a6dc699bca06d49605b16aeeef"));
//#endregion
export { submitReport as n, useServerFn as r, generateBrief as t };
