import { n as visit, r as SKIP } from "./@streamdown/cjk+[...].mjs";
//#region node_modules/rehype-harden/dist/index.js
var BlockPolicy = {
	indicator: "indicator",
	textOnly: "text-only",
	remove: "remove"
};
function harden({ defaultOrigin = "", allowedLinkPrefixes = [], allowedImagePrefixes = [], allowDataImages = false, allowedProtocols = [], blockedImageClass = "inline-block bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded text-sm", blockedLinkClass = "text-gray-500", linkBlockPolicy = BlockPolicy.indicator, imageBlockPolicy = BlockPolicy.indicator }) {
	const hasSpecificLinkPrefixes = allowedLinkPrefixes.length && !allowedLinkPrefixes.every((p) => p === "*");
	const hasSpecificImagePrefixes = allowedImagePrefixes.length && !allowedImagePrefixes.every((p) => p === "*");
	if (!defaultOrigin && (hasSpecificLinkPrefixes || hasSpecificImagePrefixes)) throw new Error("defaultOrigin is required when allowedLinkPrefixes or allowedImagePrefixes are provided");
	return (tree) => {
		const visitor = createVisitor(defaultOrigin, allowedLinkPrefixes, allowedImagePrefixes, allowDataImages, allowedProtocols, blockedImageClass, blockedLinkClass, linkBlockPolicy, imageBlockPolicy);
		stripNullChildren(tree);
		visit(tree, visitor);
	};
}
function parseUrl(url, defaultOrigin) {
	if (typeof url !== "string") return null;
	try {
		return new URL(url);
	} catch {
		if (defaultOrigin) try {
			return new URL(url, defaultOrigin);
		} catch {
			return null;
		}
		if (url.startsWith("/") || url.startsWith("./") || url.startsWith("../")) try {
			return new URL(url, "http://example.com");
		} catch {
			return null;
		}
		return null;
	}
}
function isPathRelativeUrl(url) {
	if (typeof url !== "string") return false;
	return url.startsWith("/") || url.startsWith("./") || url.startsWith("../");
}
var safeProtocols = /* @__PURE__ */ new Set([
	"https:",
	"http:",
	"irc:",
	"ircs:",
	"mailto:",
	"xmpp:",
	"blob:"
]);
var blockedProtocols = /* @__PURE__ */ new Set([
	"javascript:",
	"data:",
	"file:",
	"vbscript:"
]);
function transformUrl(url, allowedPrefixes, defaultOrigin, allowDataImages = false, isImage = false, allowedProtocols = []) {
	if (!url) return null;
	if (typeof url === "string" && url.startsWith("#") && !isImage) try {
		if (new URL(url, "http://example.com").hash === url) return url;
	} catch {}
	if (typeof url === "string" && url.startsWith("data:")) {
		if (isImage && allowDataImages && url.startsWith("data:image/")) return url;
		return null;
	}
	if (typeof url === "string" && url.startsWith("blob:")) {
		try {
			if (new URL(url).protocol === "blob:" && url.length > 5) {
				const afterProtocol = url.substring(5);
				if (afterProtocol && afterProtocol.length > 0 && afterProtocol !== "invalid") return url;
			}
		} catch {
			return null;
		}
		return null;
	}
	const parsedUrl = parseUrl(url, defaultOrigin);
	if (!parsedUrl) return null;
	if (blockedProtocols.has(parsedUrl.protocol)) return null;
	if (!(safeProtocols.has(parsedUrl.protocol) || allowedProtocols.includes(parsedUrl.protocol) || allowedProtocols.includes("*"))) return null;
	if (parsedUrl.protocol === "mailto:" || !parsedUrl.protocol.match(/^https?:$/)) return parsedUrl.href;
	const inputWasRelative = isPathRelativeUrl(url);
	if (parsedUrl && allowedPrefixes.some((prefix) => {
		const parsedPrefix = parseUrl(prefix, defaultOrigin);
		if (!parsedPrefix) return false;
		if (parsedPrefix.origin !== parsedUrl.origin) return false;
		return parsedUrl.href.startsWith(parsedPrefix.href);
	})) {
		if (inputWasRelative) return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
		return parsedUrl.href;
	}
	if (allowedPrefixes.includes("*")) {
		if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") return null;
		if (inputWasRelative) return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
		return parsedUrl.href;
	}
	return null;
}
function stripNullChildren(node) {
	if ("children" in node && Array.isArray(node.children)) {
		node.children = node.children.filter((child) => child != null);
		for (const child of node.children) stripNullChildren(child);
	}
}
var SEEN = Symbol("node-seen");
function resolveLinkBlockPolicy(node, policy, blockedLinkClass) {
	if (policy === BlockPolicy.remove) return { type: "remove" };
	if (policy === BlockPolicy.textOnly) return {
		type: "replace",
		element: {
			type: "element",
			tagName: "span",
			properties: {},
			children: [...node.children]
		}
	};
	return {
		type: "replace",
		element: {
			type: "element",
			tagName: "span",
			properties: {
				title: "Blocked URL: " + String(node.properties.href),
				class: blockedLinkClass
			},
			children: [...node.children, {
				type: "text",
				value: " [blocked]"
			}]
		}
	};
}
function resolveImageBlockPolicy(node, policy, blockedImageClass) {
	if (policy === BlockPolicy.remove) return { type: "remove" };
	if (policy === BlockPolicy.textOnly) {
		const altText = String(node.properties.alt || "");
		if (!altText) return { type: "remove" };
		return {
			type: "replace",
			element: {
				type: "element",
				tagName: "span",
				properties: {},
				children: [{
					type: "text",
					value: altText
				}]
			}
		};
	}
	return {
		type: "replace",
		element: {
			type: "element",
			tagName: "span",
			properties: { class: blockedImageClass },
			children: [{
				type: "text",
				value: "[Image blocked: " + String(node.properties.alt || "No description") + "]"
			}]
		}
	};
}
var createVisitor = (defaultOrigin, allowedLinkPrefixes, allowedImagePrefixes, allowDataImages, allowedProtocols, blockedImageClass, blockedLinkClass, linkBlockPolicy, imageBlockPolicy) => {
	const visitor = (node, index, parent) => {
		if (node.type !== "element" || node[SEEN]) return true;
		if (node.tagName === "a") {
			const transformedUrl = transformUrl(node.properties.href, allowedLinkPrefixes, defaultOrigin, false, false, allowedProtocols);
			if (transformedUrl === null) {
				node[SEEN] = true;
				visit(node, visitor);
				if (parent && typeof index === "number") {
					const result = resolveLinkBlockPolicy(node, linkBlockPolicy, blockedLinkClass);
					if (result.type === "remove") {
						parent.children.splice(index, 1);
						return [SKIP, index];
					}
					parent.children[index] = result.element;
				}
				return SKIP;
			} else {
				node.properties.href = transformedUrl;
				node.properties.target = "_blank";
				node.properties.rel = "noopener noreferrer";
				return true;
			}
		}
		if (node.tagName === "img") {
			const transformedUrl = transformUrl(node.properties.src, allowedImagePrefixes, defaultOrigin, allowDataImages, true, allowedProtocols);
			if (transformedUrl === null) {
				node[SEEN] = true;
				visit(node, visitor);
				if (parent && typeof index === "number") {
					const result = resolveImageBlockPolicy(node, imageBlockPolicy, blockedImageClass);
					if (result.type === "remove") {
						parent.children.splice(index, 1);
						return [SKIP, index];
					}
					parent.children[index] = result.element;
				}
				return SKIP;
			} else {
				node.properties.src = transformedUrl;
				return true;
			}
		}
		return true;
	};
	return visitor;
};
//#endregion
export { harden as t };
