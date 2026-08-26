import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/track-Cn9b4TQ9.js
var $$splitComponentImporter = () => import("./track-BpENros0.mjs");
var Route = createFileRoute("/track")({
	validateSearch: (search) => ({ code: typeof search["code"] === "string" ? search["code"] : void 0 }),
	head: () => ({ meta: [
		{ title: "Track your complaint status — JanSetu" },
		{
			name: "description",
			content: "Enter your JanSetu tracking code to see whether your civic complaint is acknowledged, in progress or resolved."
		},
		{
			property: "og:title",
			content: "Track your complaint status — JanSetu"
		},
		{
			property: "og:description",
			content: "Transparent status updates on every citizen infrastructure complaint."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
