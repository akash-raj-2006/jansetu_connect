//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-BiC1GClv.js
var manifest = {
	"08a75f919f9b1e09dc91fdd7984321329f99ba2c3337af84a57e2a84ad0da7d7": {
		functionName: "searchPlaces_createServerFn_handler",
		importer: () => import("./_ssr/geocode.functions-DihyWyC2.mjs")
	},
	"33d28cf81a684e99f43f74ae939b7eccf8810610ac9db7142c41cf93d9c6f3d4": {
		functionName: "reverseGeocode_createServerFn_handler",
		importer: () => import("./_ssr/geocode.functions-DihyWyC2.mjs")
	},
	"3f4bd01b64b657288a78cd78b705f98ab39850d5f733448f40eb45c3c0499fd3": {
		functionName: "logAdminLoginAttempt_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-C2iaiyqp.mjs")
	},
	"5a7cb184561351bbe1e5b513a6895cc119f06e99bfda323abab72c81aada93a5": {
		functionName: "getMyAdminRole_createServerFn_handler",
		importer: () => import("./_ssr/admin.functions-C2iaiyqp.mjs")
	},
	"6c8238152658904ed03ec1ad12301e4d3a04805e50126e369a1b00882464bda2": {
		functionName: "submitReport_createServerFn_handler",
		importer: () => import("./_ssr/jansetu.functions-BRnWJxvr.mjs")
	},
	"f6e82f3d98e68944d8a00fb4ea2a56123910f3a6dc699bca06d49605b16aeeef": {
		functionName: "generateBrief_createServerFn_handler",
		importer: () => import("./_ssr/jansetu.functions-BRnWJxvr.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
