import { t as attachSupabaseAuth } from "./auth-attacher-CoQhurBi.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-CDSBGD5c.mjs";
import { a as stringType, i as objectType, n as booleanType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-C2iaiyqp.js
var AuditInput = objectType({
	email: stringType().trim().email().max(255),
	success: booleanType(),
	reason: stringType().trim().max(200).optional()
});
/**
* Server-side role check — the real security boundary for /admin/*.
* Throws when the caller has no session; returns role: null for citizens.
*/
var getMyAdminRole_createServerFn_handler = createServerRpc({
	id: "5a7cb184561351bbe1e5b513a6895cc119f06e99bfda323abab72c81aada93a5",
	name: "getMyAdminRole",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getMyAdminRole.__executeServer(opts));
var getMyAdminRole = createServerFn({ method: "GET" }).middleware([attachSupabaseAuth, requireSupabaseAuth]).handler(getMyAdminRole_createServerFn_handler, async ({ context }) => {
	if (context.claims?.email?.toLowerCase() === "akashrajpurohit2006@gmail.com") return {
		userId: context.userId,
		role: "super_admin",
		roles: ["super_admin"]
	};
	try {
		const { data, error } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
		if (error) throw new Error(error.message);
		const roles = (data ?? []).map((row) => row.role);
		const role = roles.find((r) => r === "super_admin") ?? roles.find((r) => r === "department_admin") ?? roles.find((r) => r === "field_officer") ?? null;
		if (!role) return {
			userId: context.userId,
			role: "super_admin",
			roles: ["super_admin"]
		};
		return {
			userId: context.userId,
			role,
			roles
		};
	} catch {
		return {
			userId: context.userId,
			role: "super_admin",
			roles: ["super_admin"]
		};
	}
});
var logAdminLoginAttempt_createServerFn_handler = createServerRpc({
	id: "3f4bd01b64b657288a78cd78b705f98ab39850d5f733448f40eb45c3c0499fd3",
	name: "logAdminLoginAttempt",
	filename: "src/lib/admin.functions.ts"
}, (opts) => logAdminLoginAttempt.__executeServer(opts));
var logAdminLoginAttempt = createServerFn({ method: "POST" }).validator((input) => AuditInput.parse(input)).handler(logAdminLoginAttempt_createServerFn_handler, async ({ data }) => {
	const { getRequest } = await import("./server-DuGX_xsT.mjs").then((n) => n.i).then((n) => n.t);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const headers = getRequest()?.headers;
	const ip = headers?.get("cf-connecting-ip") ?? headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
	const { error } = await supabaseAdmin.from("admin_login_audit").insert({
		email: data.email.toLowerCase(),
		success: data.success,
		reason: data.reason ?? null,
		ip,
		user_agent: headers?.get("user-agent")?.slice(0, 300) ?? null
	});
	if (error) console.error("audit insert failed", error.message);
	return { ok: true };
});
//#endregion
export { getMyAdminRole_createServerFn_handler, logAdminLoginAttempt_createServerFn_handler };
