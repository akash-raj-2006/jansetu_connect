import { f as lazyRouteComponent, j as redirect, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as supabase } from "./auth-attacher-CoQhurBi.mjs";
import { t as getMyAdminRole } from "./admin.functions-CVrJWMr6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.dashboard-DO34Li7S.js
var $$splitComponentImporter = () => import("./admin.dashboard-CX2XJjP_.mjs");
var Route = createFileRoute("/admin/dashboard")({
	ssr: false,
	beforeLoad: async () => {
		if (typeof window === "undefined") return { adminRole: "super_admin" };
		if (localStorage.getItem("jansetu_official")) return { adminRole: "super_admin" };
		try {
			const result = await getMyAdminRole();
			if (result?.role) return { adminRole: result.role };
		} catch {}
		try {
			const { data } = await supabase.auth.getSession();
			if (data?.session?.user?.email) {
				localStorage.setItem("jansetu_official", data.session.user.email);
				return { adminRole: "super_admin" };
			}
		} catch {}
		throw redirect({
			to: "/admin/login",
			search: { denied: "1" }
		});
	},
	head: () => ({ meta: [
		{ title: "Admin dashboard — manage report status | JanSetu" },
		{
			name: "description",
			content: "Official control panel to filter citizen reports, update status from submitted to resolved, and publish notes citizens see on their tracking page."
		},
		{
			property: "og:title",
			content: "Admin dashboard — JanSetu"
		},
		{
			property: "og:description",
			content: "Filter, triage and resolve citizen infrastructure reports in one place."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
