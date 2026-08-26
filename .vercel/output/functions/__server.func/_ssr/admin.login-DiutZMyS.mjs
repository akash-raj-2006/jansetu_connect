import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.login-DiutZMyS.js
var $$splitComponentImporter = () => import("./admin.login-C_FWxIdQ.mjs");
var Route = createFileRoute("/admin/login")({
	ssr: false,
	validateSearch: (search) => ({ denied: typeof search["denied"] === "string" ? search["denied"] : void 0 }),
	head: () => ({ meta: [
		{ title: "Official sign-in — JanSetu admin" },
		{
			name: "description",
			content: "Restricted sign-in for verified government officials managing citizen infrastructure reports on JanSetu."
		},
		{
			property: "og:title",
			content: "Official sign-in — JanSetu admin"
		},
		{
			property: "og:description",
			content: "Access restricted to verified government officials."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "robots",
			content: "noindex"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
