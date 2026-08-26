import { t as attachSupabaseAuth } from "./auth-attacher-CoQhurBi.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-CDSBGD5c.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BZ-Wjzqq.mjs";
import { a as stringType, i as objectType, n as booleanType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-CVrJWMr6.js
var AuditInput = objectType({
	email: stringType().trim().email().max(255),
	success: booleanType(),
	reason: stringType().trim().max(200).optional()
});
/**
* Server-side role check — the real security boundary for /admin/*.
* Throws when the caller has no session; returns role: null for citizens.
*/
var getMyAdminRole = createServerFn({ method: "GET" }).middleware([attachSupabaseAuth, requireSupabaseAuth]).handler(createSsrRpc("5a7cb184561351bbe1e5b513a6895cc119f06e99bfda323abab72c81aada93a5"));
/** Audit log for every official login attempt (success or failure). */
var logAdminLoginAttempt = createServerFn({ method: "POST" }).validator((input) => AuditInput.parse(input)).handler(createSsrRpc("3f4bd01b64b657288a78cd78b705f98ab39850d5f733448f40eb45c3c0499fd3"));
//#endregion
export { logAdminLoginAttempt as n, getMyAdminRole as t };
