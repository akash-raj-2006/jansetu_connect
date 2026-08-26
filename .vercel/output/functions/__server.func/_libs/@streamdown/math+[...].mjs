import { n as __exportAll } from "../../_runtime.mjs";
import { a as convert, g as markdownLineEnding, i as visitParents, n as visit, r as SKIP, v as markdownSpace } from "./cjk+[...].mjs";
import { a as parse$1, d as html, f as svg, h as normalize, p as find, s as parse$2 } from "../@shikijs/core+[...].mjs";
import minpath from "node:path";
import minproc from "node:process";
import { fileURLToPath as urlToPath } from "node:url";
//#region node_modules/hast-util-parse-selector/lib/index.js
/**
* @typedef {import('hast').Element} Element
* @typedef {import('hast').Properties} Properties
*/
/**
* @template {string} SimpleSelector
*   Selector type.
* @template {string} DefaultTagName
*   Default tag name.
* @typedef {(
*   SimpleSelector extends ''
*     ? DefaultTagName
*     : SimpleSelector extends `${infer TagName}.${infer Rest}`
*     ? ExtractTagName<TagName, DefaultTagName>
*     : SimpleSelector extends `${infer TagName}#${infer Rest}`
*     ? ExtractTagName<TagName, DefaultTagName>
*     : SimpleSelector extends string
*     ? SimpleSelector
*     : DefaultTagName
* )} ExtractTagName
*   Extract tag name from a simple selector.
*/
var search = /[#.]/g;
/**
* Create a hast element from a simple CSS selector.
*
* @template {string} Selector
*   Type of selector.
* @template {string} [DefaultTagName='div']
*   Type of default tag name (default: `'div'`).
* @param {Selector | null | undefined} [selector]
*   Simple CSS selector (optional).
*
*   Can contain a tag name (`foo`), classes (`.bar`), and an ID (`#baz`).
*   Multiple classes are allowed.
*   Uses the last ID if multiple IDs are found.
* @param {DefaultTagName | null | undefined} [defaultTagName='div']
*   Tag name to use if `selector` does not specify one (default: `'div'`).
* @returns {Element & {tagName: ExtractTagName<Selector, DefaultTagName>}}
*   Built element.
*/
function parseSelector(selector, defaultTagName) {
	const value = selector || "";
	/** @type {Properties} */
	const props = {};
	let start = 0;
	/** @type {string | undefined} */
	let previous;
	/** @type {string | undefined} */
	let tagName;
	while (start < value.length) {
		search.lastIndex = start;
		const match = search.exec(value);
		const subvalue = value.slice(start, match ? match.index : value.length);
		if (subvalue) {
			if (!previous) tagName = subvalue;
			else if (previous === "#") props.id = subvalue;
			else if (Array.isArray(props.className)) props.className.push(subvalue);
			else props.className = [subvalue];
			start += subvalue.length;
		}
		if (match) {
			previous = match[0];
			start++;
		}
	}
	return {
		type: "element",
		tagName: tagName || defaultTagName || "div",
		properties: props,
		children: []
	};
}
//#endregion
//#region node_modules/hastscript/lib/create-h.js
/**
* @import {Element, Nodes, RootContent, Root} from 'hast'
* @import {Info, Schema} from 'property-information'
*/
/**
* @typedef {Array<Nodes | PrimitiveChild>} ArrayChildNested
*   List of children (deep).
*/
/**
* @typedef {Array<ArrayChildNested | Nodes | PrimitiveChild>} ArrayChild
*   List of children.
*/
/**
* @typedef {Array<number | string>} ArrayValue
*   List of property values for space- or comma separated values (such as `className`).
*/
/**
* @typedef {ArrayChild | Nodes | PrimitiveChild} Child
*   Acceptable child value.
*/
/**
* @typedef {number | string | null | undefined} PrimitiveChild
*   Primitive children, either ignored (nullish), or turned into text nodes.
*/
/**
* @typedef {boolean | number | string | null | undefined} PrimitiveValue
*   Primitive property value.
*/
/**
* @typedef {Record<string, PropertyValue | Style>} Properties
*   Acceptable value for element properties.
*/
/**
* @typedef {ArrayValue | PrimitiveValue} PropertyValue
*   Primitive value or list value.
*/
/**
* @typedef {Element | Root} Result
*   Result from a `h` (or `s`) call.
*/
/**
* @typedef {number | string} StyleValue
*   Value for a CSS style field.
*/
/**
* @typedef {Record<string, StyleValue>} Style
*   Supported value of a `style` prop.
*/
/**
* @param {Schema} schema
*   Schema to use.
* @param {string} defaultTagName
*   Default tag name.
* @param {ReadonlyArray<string> | undefined} [caseSensitive]
*   Case-sensitive tag names (default: `undefined`).
* @returns
*   `h`.
*/
function createH(schema, defaultTagName, caseSensitive) {
	const adjust = caseSensitive ? createAdjustMap(caseSensitive) : void 0;
	/**
	* Hyperscript compatible DSL for creating virtual hast trees.
	*
	* @overload
	* @param {null | undefined} [selector]
	* @param {...Child} children
	* @returns {Root}
	*
	* @overload
	* @param {string} selector
	* @param {Properties} properties
	* @param {...Child} children
	* @returns {Element}
	*
	* @overload
	* @param {string} selector
	* @param {...Child} children
	* @returns {Element}
	*
	* @param {string | null | undefined} [selector]
	*   Selector.
	* @param {Child | Properties | null | undefined} [properties]
	*   Properties (or first child) (default: `undefined`).
	* @param {...Child} children
	*   Children.
	* @returns {Result}
	*   Result.
	*/
	function h(selector, properties, ...children) {
		/** @type {Result} */
		let node;
		if (selector === null || selector === void 0) {
			node = {
				type: "root",
				children: []
			};
			const child = properties;
			children.unshift(child);
		} else {
			node = parseSelector(selector, defaultTagName);
			const lower = node.tagName.toLowerCase();
			const adjusted = adjust ? adjust.get(lower) : void 0;
			node.tagName = adjusted || lower;
			if (isChild(properties)) children.unshift(properties);
			else for (const [key, value] of Object.entries(properties)) addProperty(schema, node.properties, key, value);
		}
		for (const child of children) addChild(node.children, child);
		if (node.type === "element" && node.tagName === "template") {
			node.content = {
				type: "root",
				children: node.children
			};
			node.children = [];
		}
		return node;
	}
	return h;
}
/**
* Check if something is properties or a child.
*
* @param {Child | Properties} value
*   Value to check.
* @returns {value is Child}
*   Whether `value` is definitely a child.
*/
function isChild(value) {
	if (value === null || typeof value !== "object" || Array.isArray(value)) return true;
	if (typeof value.type !== "string") return false;
	const record = value;
	const keys = Object.keys(value);
	for (const key of keys) {
		const value = record[key];
		if (value && typeof value === "object") {
			if (!Array.isArray(value)) return true;
			const list = value;
			for (const item of list) if (typeof item !== "number" && typeof item !== "string") return true;
		}
	}
	if ("children" in value && Array.isArray(value.children)) return true;
	return false;
}
/**
* @param {Schema} schema
*   Schema.
* @param {Properties} properties
*   Properties object.
* @param {string} key
*   Property name.
* @param {PropertyValue | Style} value
*   Property value.
* @returns {undefined}
*   Nothing.
*/
function addProperty(schema, properties, key, value) {
	const info = find(schema, key);
	/** @type {PropertyValue} */
	let result;
	if (value === null || value === void 0) return;
	if (typeof value === "number") {
		if (Number.isNaN(value)) return;
		result = value;
	} else if (typeof value === "boolean") result = value;
	else if (typeof value === "string") if (info.spaceSeparated) result = parse$1(value);
	else if (info.commaSeparated) result = parse$2(value);
	else if (info.commaOrSpaceSeparated) result = parse$1(parse$2(value).join(" "));
	else result = parsePrimitive(info, info.property, value);
	else if (Array.isArray(value)) result = [...value];
	else result = info.property === "style" ? style(value) : String(value);
	if (Array.isArray(result)) {
		/** @type {Array<number | string>} */
		const finalResult = [];
		for (const item of result) finalResult.push(parsePrimitive(info, info.property, item));
		result = finalResult;
	}
	if (info.property === "className" && Array.isArray(properties.className)) result = properties.className.concat(result);
	properties[info.property] = result;
}
/**
* @param {Array<RootContent>} nodes
*   Children.
* @param {Child} value
*   Child.
* @returns {undefined}
*   Nothing.
*/
function addChild(nodes, value) {
	if (value === null || value === void 0) {} else if (typeof value === "number" || typeof value === "string") nodes.push({
		type: "text",
		value: String(value)
	});
	else if (Array.isArray(value)) for (const child of value) addChild(nodes, child);
	else if (typeof value === "object" && "type" in value) if (value.type === "root") addChild(nodes, value.children);
	else nodes.push(value);
	else throw new Error("Expected node, nodes, or string, got `" + value + "`");
}
/**
* Parse a single primitives.
*
* @param {Info} info
*   Property information.
* @param {string} name
*   Property name.
* @param {PrimitiveValue} value
*   Property value.
* @returns {PrimitiveValue}
*   Property value.
*/
function parsePrimitive(info, name, value) {
	if (typeof value === "string") {
		if (info.number && value && !Number.isNaN(Number(value))) return Number(value);
		if ((info.boolean || info.overloadedBoolean) && (value === "" || normalize(value) === normalize(name))) return true;
	}
	return value;
}
/**
* Serialize a `style` object as a string.
*
* @param {Style} styles
*   Style object.
* @returns {string}
*   CSS string.
*/
function style(styles) {
	/** @type {Array<string>} */
	const result = [];
	for (const [key, value] of Object.entries(styles)) result.push([key, value].join(": "));
	return result.join("; ");
}
/**
* Create a map to adjust casing.
*
* @param {ReadonlyArray<string>} values
*   List of properly cased keys.
* @returns {Map<string, string>}
*   Map of lowercase keys to uppercase keys.
*/
function createAdjustMap(values) {
	/** @type {Map<string, string>} */
	const result = /* @__PURE__ */ new Map();
	for (const value of values) result.set(value.toLowerCase(), value);
	return result;
}
//#endregion
//#region node_modules/hastscript/lib/svg-case-sensitive-tag-names.js
/**
* List of case-sensitive SVG tag names.
*
* @type {ReadonlyArray<string>}
*/
var svgCaseSensitiveTagNames = [
	"altGlyph",
	"altGlyphDef",
	"altGlyphItem",
	"animateColor",
	"animateMotion",
	"animateTransform",
	"clipPath",
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence",
	"foreignObject",
	"glyphRef",
	"linearGradient",
	"radialGradient",
	"solidColor",
	"textArea",
	"textPath"
];
//#endregion
//#region node_modules/hastscript/lib/index.js
/**
* @typedef {import('./jsx-classic.js').Element} h.JSX.Element
* @typedef {import('./jsx-classic.js').ElementChildrenAttribute} h.JSX.ElementChildrenAttribute
* @typedef {import('./jsx-classic.js').IntrinsicAttributes} h.JSX.IntrinsicAttributes
* @typedef {import('./jsx-classic.js').IntrinsicElements} h.JSX.IntrinsicElements
*/
/**
* @typedef {import('./jsx-classic.js').Element} s.JSX.Element
* @typedef {import('./jsx-classic.js').ElementChildrenAttribute} s.JSX.ElementChildrenAttribute
* @typedef {import('./jsx-classic.js').IntrinsicAttributes} s.JSX.IntrinsicAttributes
* @typedef {import('./jsx-classic.js').IntrinsicElements} s.JSX.IntrinsicElements
*/
/** @type {ReturnType<createH>} */
var h$1 = createH(html, "div");
/** @type {ReturnType<createH>} */
var s = createH(svg, "g", svgCaseSensitiveTagNames);
//#endregion
//#region node_modules/vfile-location/lib/index.js
/**
* @import {VFile, Value} from 'vfile'
* @import {Location} from 'vfile-location'
*/
/**
* Create an index of the given document to translate between line/column and
* offset based positional info.
*
* Also implemented in Rust in [`wooorm/markdown-rs`][markdown-rs].
*
* [markdown-rs]: https://github.com/wooorm/markdown-rs/blob/main/src/util/location.rs
*
* @param {VFile | Value} file
*   File to index.
* @returns {Location}
*   Accessors for index.
*/
function location(file) {
	const value = String(file);
	/**
	* List, where each index is a line number (0-based), and each value is the
	* byte index *after* where the line ends.
	*
	* @type {Array<number>}
	*/
	const indices = [];
	return {
		toOffset,
		toPoint
	};
	/** @type {Location['toPoint']} */
	function toPoint(offset) {
		if (typeof offset === "number" && offset > -1 && offset <= value.length) {
			let index = 0;
			while (true) {
				let end = indices[index];
				if (end === void 0) {
					const eol = next(value, indices[index - 1]);
					end = eol === -1 ? value.length + 1 : eol + 1;
					indices[index] = end;
				}
				if (end > offset) return {
					line: index + 1,
					column: offset - (index > 0 ? indices[index - 1] : 0) + 1,
					offset
				};
				index++;
			}
		}
	}
	/** @type {Location['toOffset']} */
	function toOffset(point) {
		if (point && typeof point.line === "number" && typeof point.column === "number" && !Number.isNaN(point.line) && !Number.isNaN(point.column)) {
			while (indices.length < point.line) {
				const from = indices[indices.length - 1];
				const eol = next(value, from);
				const end = eol === -1 ? value.length + 1 : eol + 1;
				if (from === end) break;
				indices.push(end);
			}
			const offset = (point.line > 1 ? indices[point.line - 2] : 0) + point.column - 1;
			if (offset < indices[point.line - 1]) return offset;
		}
	}
}
/**
* @param {string} value
* @param {number} from
*/
function next(value, from) {
	const cr = value.indexOf("\r", from);
	const lf = value.indexOf("\n", from);
	if (lf === -1) return cr;
	if (cr === -1 || cr + 1 === lf) return lf;
	return cr < lf ? cr : lf;
}
//#endregion
//#region node_modules/web-namespaces/index.js
/**
* Map of web namespaces.
*
* @type {Record<string, string>}
*/
var webNamespaces = {
	html: "http://www.w3.org/1999/xhtml",
	mathml: "http://www.w3.org/1998/Math/MathML",
	svg: "http://www.w3.org/2000/svg",
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};
//#endregion
//#region node_modules/hast-util-from-parse5/lib/index.js
/**
* @import {ElementData, Element, Nodes, RootContent, Root} from 'hast'
* @import {DefaultTreeAdapterMap, Token} from 'parse5'
* @import {Schema} from 'property-information'
* @import {Point, Position} from 'unist'
* @import {VFile} from 'vfile'
* @import {Options} from 'hast-util-from-parse5'
*/
/**
* @typedef State
*   Info passed around about the current state.
* @property {VFile | undefined} file
*   Corresponding file.
* @property {boolean} location
*   Whether location info was found.
* @property {Schema} schema
*   Current schema.
* @property {boolean | undefined} verbose
*   Add extra positional info.
*/
var own = {}.hasOwnProperty;
/** @type {unknown} */
var proto = Object.prototype;
/**
* Transform a `parse5` AST to hast.
*
* @param {DefaultTreeAdapterMap['node']} tree
*   `parse5` tree to transform.
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {Nodes}
*   hast tree.
*/
function fromParse5(tree, options) {
	const settings = options || {};
	return one({
		file: settings.file || void 0,
		location: false,
		schema: settings.space === "svg" ? svg : html,
		verbose: settings.verbose || false
	}, tree);
}
/**
* Transform a node.
*
* @param {State} state
*   Info passed around about the current state.
* @param {DefaultTreeAdapterMap['node']} node
*   p5 node.
* @returns {Nodes}
*   hast node.
*/
function one(state, node) {
	/** @type {Nodes} */
	let result;
	switch (node.nodeName) {
		case "#comment": {
			const reference = node;
			result = {
				type: "comment",
				value: reference.data
			};
			patch(state, reference, result);
			return result;
		}
		case "#document":
		case "#document-fragment": {
			const reference = node;
			const quirksMode = "mode" in reference ? reference.mode === "quirks" || reference.mode === "limited-quirks" : false;
			result = {
				type: "root",
				children: all(state, node.childNodes),
				data: { quirksMode }
			};
			if (state.file && state.location) {
				const document = String(state.file);
				const loc = location(document);
				const start = loc.toPoint(0);
				const end = loc.toPoint(document.length);
				result.position = {
					start,
					end
				};
			}
			return result;
		}
		case "#documentType": {
			const reference = node;
			result = { type: "doctype" };
			patch(state, reference, result);
			return result;
		}
		case "#text": {
			const reference = node;
			result = {
				type: "text",
				value: reference.value
			};
			patch(state, reference, result);
			return result;
		}
		default:
			result = element$1(state, node);
			return result;
	}
}
/**
* Transform children.
*
* @param {State} state
*   Info passed around about the current state.
* @param {Array<DefaultTreeAdapterMap['node']>} nodes
*   Nodes.
* @returns {Array<RootContent>}
*   hast nodes.
*/
function all(state, nodes) {
	let index = -1;
	/** @type {Array<RootContent>} */
	const results = [];
	while (++index < nodes.length) {
		const result = one(state, nodes[index]);
		results.push(result);
	}
	return results;
}
/**
* Transform an element.
*
* @param {State} state
*   Info passed around about the current state.
* @param {DefaultTreeAdapterMap['element']} node
*   `parse5` node to transform.
* @returns {Element}
*   hast node.
*/
function element$1(state, node) {
	const schema = state.schema;
	state.schema = node.namespaceURI === webNamespaces.svg ? svg : html;
	let index = -1;
	/** @type {Record<string, string>} */
	const properties = {};
	while (++index < node.attrs.length) {
		const attribute = node.attrs[index];
		const name = (attribute.prefix ? attribute.prefix + ":" : "") + attribute.name;
		if (!own.call(proto, name)) properties[name] = attribute.value;
	}
	const result = (state.schema.space === "svg" ? s : h$1)(node.tagName, properties, all(state, node.childNodes));
	patch(state, node, result);
	if (result.tagName === "template") {
		const reference = node;
		const pos = reference.sourceCodeLocation;
		const startTag = pos && pos.startTag && position$1(pos.startTag);
		const endTag = pos && pos.endTag && position$1(pos.endTag);
		const content = one(state, reference.content);
		if (startTag && endTag && state.file) content.position = {
			start: startTag.end,
			end: endTag.start
		};
		result.content = content;
	}
	state.schema = schema;
	return result;
}
/**
* Patch positional info from `from` onto `to`.
*
* @param {State} state
*   Info passed around about the current state.
* @param {DefaultTreeAdapterMap['node']} from
*   p5 node.
* @param {Nodes} to
*   hast node.
* @returns {undefined}
*   Nothing.
*/
function patch(state, from, to) {
	if ("sourceCodeLocation" in from && from.sourceCodeLocation && state.file) {
		const position = createLocation(state, to, from.sourceCodeLocation);
		if (position) {
			state.location = true;
			to.position = position;
		}
	}
}
/**
* Create clean positional information.
*
* @param {State} state
*   Info passed around about the current state.
* @param {Nodes} node
*   hast node.
* @param {Token.ElementLocation} location
*   p5 location info.
* @returns {Position | undefined}
*   Position, or nothing.
*/
function createLocation(state, node, location) {
	const result = position$1(location);
	if (node.type === "element") {
		const tail = node.children[node.children.length - 1];
		if (result && !location.endTag && tail && tail.position && tail.position.end) result.end = Object.assign({}, tail.position.end);
		if (state.verbose) {
			/** @type {Record<string, Position | undefined>} */
			const properties = {};
			/** @type {string} */
			let key;
			if (location.attrs) {
				for (key in location.attrs) if (own.call(location.attrs, key)) properties[find(state.schema, key).property] = position$1(location.attrs[key]);
			}
			location.startTag;
			const opening = position$1(location.startTag);
			const closing = location.endTag ? position$1(location.endTag) : void 0;
			/** @type {ElementData['position']} */
			const data = { opening };
			if (closing) data.closing = closing;
			data.properties = properties;
			node.data = { position: data };
		}
	}
	return result;
}
/**
* Turn a p5 location into a position.
*
* @param {Token.Location} loc
*   Location.
* @returns {Position | undefined}
*   Position or nothing.
*/
function position$1(loc) {
	const start = point$1({
		line: loc.startLine,
		column: loc.startCol,
		offset: loc.startOffset
	});
	const end = point$1({
		line: loc.endLine,
		column: loc.endCol,
		offset: loc.endOffset
	});
	return start || end ? {
		start,
		end
	} : void 0;
}
/**
* Filter out invalid points.
*
* @param {Point} point
*   Point with potentially `undefined` values.
* @returns {Point | undefined}
*   Point or nothing.
*/
function point$1(point) {
	return point.line && point.column ? point : void 0;
}
//#endregion
//#region node_modules/parse5/dist/common/unicode.js
var UNDEFINED_CODE_POINTS = /* @__PURE__ */ new Set([
	65534,
	65535,
	131070,
	131071,
	196606,
	196607,
	262142,
	262143,
	327678,
	327679,
	393214,
	393215,
	458750,
	458751,
	524286,
	524287,
	589822,
	589823,
	655358,
	655359,
	720894,
	720895,
	786430,
	786431,
	851966,
	851967,
	917502,
	917503,
	983038,
	983039,
	1048574,
	1048575,
	1114110,
	1114111
]);
var CODE_POINTS;
(function(CODE_POINTS) {
	CODE_POINTS[CODE_POINTS["EOF"] = -1] = "EOF";
	CODE_POINTS[CODE_POINTS["NULL"] = 0] = "NULL";
	CODE_POINTS[CODE_POINTS["TABULATION"] = 9] = "TABULATION";
	CODE_POINTS[CODE_POINTS["CARRIAGE_RETURN"] = 13] = "CARRIAGE_RETURN";
	CODE_POINTS[CODE_POINTS["LINE_FEED"] = 10] = "LINE_FEED";
	CODE_POINTS[CODE_POINTS["FORM_FEED"] = 12] = "FORM_FEED";
	CODE_POINTS[CODE_POINTS["SPACE"] = 32] = "SPACE";
	CODE_POINTS[CODE_POINTS["EXCLAMATION_MARK"] = 33] = "EXCLAMATION_MARK";
	CODE_POINTS[CODE_POINTS["QUOTATION_MARK"] = 34] = "QUOTATION_MARK";
	CODE_POINTS[CODE_POINTS["AMPERSAND"] = 38] = "AMPERSAND";
	CODE_POINTS[CODE_POINTS["APOSTROPHE"] = 39] = "APOSTROPHE";
	CODE_POINTS[CODE_POINTS["HYPHEN_MINUS"] = 45] = "HYPHEN_MINUS";
	CODE_POINTS[CODE_POINTS["SOLIDUS"] = 47] = "SOLIDUS";
	CODE_POINTS[CODE_POINTS["DIGIT_0"] = 48] = "DIGIT_0";
	CODE_POINTS[CODE_POINTS["DIGIT_9"] = 57] = "DIGIT_9";
	CODE_POINTS[CODE_POINTS["SEMICOLON"] = 59] = "SEMICOLON";
	CODE_POINTS[CODE_POINTS["LESS_THAN_SIGN"] = 60] = "LESS_THAN_SIGN";
	CODE_POINTS[CODE_POINTS["EQUALS_SIGN"] = 61] = "EQUALS_SIGN";
	CODE_POINTS[CODE_POINTS["GREATER_THAN_SIGN"] = 62] = "GREATER_THAN_SIGN";
	CODE_POINTS[CODE_POINTS["QUESTION_MARK"] = 63] = "QUESTION_MARK";
	CODE_POINTS[CODE_POINTS["LATIN_CAPITAL_A"] = 65] = "LATIN_CAPITAL_A";
	CODE_POINTS[CODE_POINTS["LATIN_CAPITAL_Z"] = 90] = "LATIN_CAPITAL_Z";
	CODE_POINTS[CODE_POINTS["RIGHT_SQUARE_BRACKET"] = 93] = "RIGHT_SQUARE_BRACKET";
	CODE_POINTS[CODE_POINTS["GRAVE_ACCENT"] = 96] = "GRAVE_ACCENT";
	CODE_POINTS[CODE_POINTS["LATIN_SMALL_A"] = 97] = "LATIN_SMALL_A";
	CODE_POINTS[CODE_POINTS["LATIN_SMALL_Z"] = 122] = "LATIN_SMALL_Z";
})(CODE_POINTS || (CODE_POINTS = {}));
var SEQUENCES = {
	DASH_DASH: "--",
	CDATA_START: "[CDATA[",
	DOCTYPE: "doctype",
	SCRIPT: "script",
	PUBLIC: "public",
	SYSTEM: "system"
};
function isSurrogate(cp) {
	return cp >= 55296 && cp <= 57343;
}
function isSurrogatePair(cp) {
	return cp >= 56320 && cp <= 57343;
}
function getSurrogatePairCodePoint(cp1, cp2) {
	return (cp1 - 55296) * 1024 + 9216 + cp2;
}
function isControlCodePoint(cp) {
	return cp !== 32 && cp !== 10 && cp !== 13 && cp !== 9 && cp !== 12 && cp >= 1 && cp <= 31 || cp >= 127 && cp <= 159;
}
function isUndefinedCodePoint(cp) {
	return cp >= 64976 && cp <= 65007 || UNDEFINED_CODE_POINTS.has(cp);
}
//#endregion
//#region node_modules/parse5/dist/common/error-codes.js
var ERR;
(function(ERR) {
	ERR["controlCharacterInInputStream"] = "control-character-in-input-stream";
	ERR["noncharacterInInputStream"] = "noncharacter-in-input-stream";
	ERR["surrogateInInputStream"] = "surrogate-in-input-stream";
	ERR["nonVoidHtmlElementStartTagWithTrailingSolidus"] = "non-void-html-element-start-tag-with-trailing-solidus";
	ERR["endTagWithAttributes"] = "end-tag-with-attributes";
	ERR["endTagWithTrailingSolidus"] = "end-tag-with-trailing-solidus";
	ERR["unexpectedSolidusInTag"] = "unexpected-solidus-in-tag";
	ERR["unexpectedNullCharacter"] = "unexpected-null-character";
	ERR["unexpectedQuestionMarkInsteadOfTagName"] = "unexpected-question-mark-instead-of-tag-name";
	ERR["invalidFirstCharacterOfTagName"] = "invalid-first-character-of-tag-name";
	ERR["unexpectedEqualsSignBeforeAttributeName"] = "unexpected-equals-sign-before-attribute-name";
	ERR["missingEndTagName"] = "missing-end-tag-name";
	ERR["unexpectedCharacterInAttributeName"] = "unexpected-character-in-attribute-name";
	ERR["unknownNamedCharacterReference"] = "unknown-named-character-reference";
	ERR["missingSemicolonAfterCharacterReference"] = "missing-semicolon-after-character-reference";
	ERR["unexpectedCharacterAfterDoctypeSystemIdentifier"] = "unexpected-character-after-doctype-system-identifier";
	ERR["unexpectedCharacterInUnquotedAttributeValue"] = "unexpected-character-in-unquoted-attribute-value";
	ERR["eofBeforeTagName"] = "eof-before-tag-name";
	ERR["eofInTag"] = "eof-in-tag";
	ERR["missingAttributeValue"] = "missing-attribute-value";
	ERR["missingWhitespaceBetweenAttributes"] = "missing-whitespace-between-attributes";
	ERR["missingWhitespaceAfterDoctypePublicKeyword"] = "missing-whitespace-after-doctype-public-keyword";
	ERR["missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers"] = "missing-whitespace-between-doctype-public-and-system-identifiers";
	ERR["missingWhitespaceAfterDoctypeSystemKeyword"] = "missing-whitespace-after-doctype-system-keyword";
	ERR["missingQuoteBeforeDoctypePublicIdentifier"] = "missing-quote-before-doctype-public-identifier";
	ERR["missingQuoteBeforeDoctypeSystemIdentifier"] = "missing-quote-before-doctype-system-identifier";
	ERR["missingDoctypePublicIdentifier"] = "missing-doctype-public-identifier";
	ERR["missingDoctypeSystemIdentifier"] = "missing-doctype-system-identifier";
	ERR["abruptDoctypePublicIdentifier"] = "abrupt-doctype-public-identifier";
	ERR["abruptDoctypeSystemIdentifier"] = "abrupt-doctype-system-identifier";
	ERR["cdataInHtmlContent"] = "cdata-in-html-content";
	ERR["incorrectlyOpenedComment"] = "incorrectly-opened-comment";
	ERR["eofInScriptHtmlCommentLikeText"] = "eof-in-script-html-comment-like-text";
	ERR["eofInDoctype"] = "eof-in-doctype";
	ERR["nestedComment"] = "nested-comment";
	ERR["abruptClosingOfEmptyComment"] = "abrupt-closing-of-empty-comment";
	ERR["eofInComment"] = "eof-in-comment";
	ERR["incorrectlyClosedComment"] = "incorrectly-closed-comment";
	ERR["eofInCdata"] = "eof-in-cdata";
	ERR["absenceOfDigitsInNumericCharacterReference"] = "absence-of-digits-in-numeric-character-reference";
	ERR["nullCharacterReference"] = "null-character-reference";
	ERR["surrogateCharacterReference"] = "surrogate-character-reference";
	ERR["characterReferenceOutsideUnicodeRange"] = "character-reference-outside-unicode-range";
	ERR["controlCharacterReference"] = "control-character-reference";
	ERR["noncharacterCharacterReference"] = "noncharacter-character-reference";
	ERR["missingWhitespaceBeforeDoctypeName"] = "missing-whitespace-before-doctype-name";
	ERR["missingDoctypeName"] = "missing-doctype-name";
	ERR["invalidCharacterSequenceAfterDoctypeName"] = "invalid-character-sequence-after-doctype-name";
	ERR["duplicateAttribute"] = "duplicate-attribute";
	ERR["nonConformingDoctype"] = "non-conforming-doctype";
	ERR["missingDoctype"] = "missing-doctype";
	ERR["misplacedDoctype"] = "misplaced-doctype";
	ERR["endTagWithoutMatchingOpenElement"] = "end-tag-without-matching-open-element";
	ERR["closingOfElementWithOpenChildElements"] = "closing-of-element-with-open-child-elements";
	ERR["disallowedContentInNoscriptInHead"] = "disallowed-content-in-noscript-in-head";
	ERR["openElementsLeftAfterEof"] = "open-elements-left-after-eof";
	ERR["abandonedHeadElementChild"] = "abandoned-head-element-child";
	ERR["misplacedStartTagForHeadElement"] = "misplaced-start-tag-for-head-element";
	ERR["nestedNoscriptInHead"] = "nested-noscript-in-head";
	ERR["eofInElementThatCanContainOnlyText"] = "eof-in-element-that-can-contain-only-text";
})(ERR || (ERR = {}));
//#endregion
//#region node_modules/parse5/dist/tokenizer/preprocessor.js
var DEFAULT_BUFFER_WATERLINE = 65536;
var Preprocessor = class {
	constructor(handler) {
		this.handler = handler;
		this.html = "";
		this.pos = -1;
		this.lastGapPos = -2;
		this.gapStack = [];
		this.skipNextNewLine = false;
		this.lastChunkWritten = false;
		this.endOfChunkHit = false;
		this.bufferWaterline = DEFAULT_BUFFER_WATERLINE;
		this.isEol = false;
		this.lineStartPos = 0;
		this.droppedBufferSize = 0;
		this.line = 1;
		this.lastErrOffset = -1;
	}
	/** The column on the current line. If we just saw a gap (eg. a surrogate pair), return the index before. */
	get col() {
		return this.pos - this.lineStartPos + Number(this.lastGapPos !== this.pos);
	}
	get offset() {
		return this.droppedBufferSize + this.pos;
	}
	getError(code, cpOffset) {
		const { line, col, offset } = this;
		const startCol = col + cpOffset;
		const startOffset = offset + cpOffset;
		return {
			code,
			startLine: line,
			endLine: line,
			startCol,
			endCol: startCol,
			startOffset,
			endOffset: startOffset
		};
	}
	_err(code) {
		if (this.handler.onParseError && this.lastErrOffset !== this.offset) {
			this.lastErrOffset = this.offset;
			this.handler.onParseError(this.getError(code, 0));
		}
	}
	_addGap() {
		this.gapStack.push(this.lastGapPos);
		this.lastGapPos = this.pos;
	}
	_processSurrogate(cp) {
		if (this.pos !== this.html.length - 1) {
			const nextCp = this.html.charCodeAt(this.pos + 1);
			if (isSurrogatePair(nextCp)) {
				this.pos++;
				this._addGap();
				return getSurrogatePairCodePoint(cp, nextCp);
			}
		} else if (!this.lastChunkWritten) {
			this.endOfChunkHit = true;
			return CODE_POINTS.EOF;
		}
		this._err(ERR.surrogateInInputStream);
		return cp;
	}
	willDropParsedChunk() {
		return this.pos > this.bufferWaterline;
	}
	dropParsedChunk() {
		if (this.willDropParsedChunk()) {
			this.html = this.html.substring(this.pos);
			this.lineStartPos -= this.pos;
			this.droppedBufferSize += this.pos;
			this.pos = 0;
			this.lastGapPos = -2;
			this.gapStack.length = 0;
		}
	}
	write(chunk, isLastChunk) {
		if (this.html.length > 0) this.html += chunk;
		else this.html = chunk;
		this.endOfChunkHit = false;
		this.lastChunkWritten = isLastChunk;
	}
	insertHtmlAtCurrentPos(chunk) {
		this.html = this.html.substring(0, this.pos + 1) + chunk + this.html.substring(this.pos + 1);
		this.endOfChunkHit = false;
	}
	startsWith(pattern, caseSensitive) {
		if (this.pos + pattern.length > this.html.length) {
			this.endOfChunkHit = !this.lastChunkWritten;
			return false;
		}
		if (caseSensitive) return this.html.startsWith(pattern, this.pos);
		for (let i = 0; i < pattern.length; i++) if ((this.html.charCodeAt(this.pos + i) | 32) !== pattern.charCodeAt(i)) return false;
		return true;
	}
	peek(offset) {
		const pos = this.pos + offset;
		if (pos >= this.html.length) {
			this.endOfChunkHit = !this.lastChunkWritten;
			return CODE_POINTS.EOF;
		}
		const code = this.html.charCodeAt(pos);
		return code === CODE_POINTS.CARRIAGE_RETURN ? CODE_POINTS.LINE_FEED : code;
	}
	advance() {
		this.pos++;
		if (this.isEol) {
			this.isEol = false;
			this.line++;
			this.lineStartPos = this.pos;
		}
		if (this.pos >= this.html.length) {
			this.endOfChunkHit = !this.lastChunkWritten;
			return CODE_POINTS.EOF;
		}
		let cp = this.html.charCodeAt(this.pos);
		if (cp === CODE_POINTS.CARRIAGE_RETURN) {
			this.isEol = true;
			this.skipNextNewLine = true;
			return CODE_POINTS.LINE_FEED;
		}
		if (cp === CODE_POINTS.LINE_FEED) {
			this.isEol = true;
			if (this.skipNextNewLine) {
				this.line--;
				this.skipNextNewLine = false;
				this._addGap();
				return this.advance();
			}
		}
		this.skipNextNewLine = false;
		if (isSurrogate(cp)) cp = this._processSurrogate(cp);
		if (!(this.handler.onParseError === null || cp > 31 && cp < 127 || cp === CODE_POINTS.LINE_FEED || cp === CODE_POINTS.CARRIAGE_RETURN || cp > 159 && cp < 64976)) this._checkForProblematicCharacters(cp);
		return cp;
	}
	_checkForProblematicCharacters(cp) {
		if (isControlCodePoint(cp)) this._err(ERR.controlCharacterInInputStream);
		else if (isUndefinedCodePoint(cp)) this._err(ERR.noncharacterInInputStream);
	}
	retreat(count) {
		this.pos -= count;
		while (this.pos < this.lastGapPos) {
			this.lastGapPos = this.gapStack.pop();
			this.pos--;
		}
		this.isEol = false;
	}
};
//#endregion
//#region node_modules/parse5/dist/common/token.js
var TokenType;
(function(TokenType) {
	TokenType[TokenType["CHARACTER"] = 0] = "CHARACTER";
	TokenType[TokenType["NULL_CHARACTER"] = 1] = "NULL_CHARACTER";
	TokenType[TokenType["WHITESPACE_CHARACTER"] = 2] = "WHITESPACE_CHARACTER";
	TokenType[TokenType["START_TAG"] = 3] = "START_TAG";
	TokenType[TokenType["END_TAG"] = 4] = "END_TAG";
	TokenType[TokenType["COMMENT"] = 5] = "COMMENT";
	TokenType[TokenType["DOCTYPE"] = 6] = "DOCTYPE";
	TokenType[TokenType["EOF"] = 7] = "EOF";
	TokenType[TokenType["HIBERNATION"] = 8] = "HIBERNATION";
})(TokenType || (TokenType = {}));
function getTokenAttr(token, attrName) {
	for (let i = token.attrs.length - 1; i >= 0; i--) if (token.attrs[i].name === attrName) return token.attrs[i].value;
	return null;
}
//#endregion
//#region node_modules/entities/dist/esm/generated/decode-data-html.js
var htmlDecodeTree = /* #__PURE__ */ new Uint16Array(/* #__PURE__ */ "ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻\"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻\xA0ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌".split("").map((c) => c.charCodeAt(0)));
var decodeMap = /* @__PURE__ */ new Map([
	[0, 65533],
	[128, 8364],
	[130, 8218],
	[131, 402],
	[132, 8222],
	[133, 8230],
	[134, 8224],
	[135, 8225],
	[136, 710],
	[137, 8240],
	[138, 352],
	[139, 8249],
	[140, 338],
	[142, 381],
	[145, 8216],
	[146, 8217],
	[147, 8220],
	[148, 8221],
	[149, 8226],
	[150, 8211],
	[151, 8212],
	[152, 732],
	[153, 8482],
	[154, 353],
	[155, 8250],
	[156, 339],
	[158, 382],
	[159, 376]
]);
String.fromCodePoint;
/**
* Replace the given code point with a replacement character if it is a
* surrogate or is outside the valid range. Otherwise return the code
* point unchanged.
*/
function replaceCodePoint(codePoint) {
	var _a;
	if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) return 65533;
	return (_a = decodeMap.get(codePoint)) !== null && _a !== void 0 ? _a : codePoint;
}
//#endregion
//#region node_modules/entities/dist/esm/decode.js
var CharCodes;
(function(CharCodes) {
	CharCodes[CharCodes["NUM"] = 35] = "NUM";
	CharCodes[CharCodes["SEMI"] = 59] = "SEMI";
	CharCodes[CharCodes["EQUALS"] = 61] = "EQUALS";
	CharCodes[CharCodes["ZERO"] = 48] = "ZERO";
	CharCodes[CharCodes["NINE"] = 57] = "NINE";
	CharCodes[CharCodes["LOWER_A"] = 97] = "LOWER_A";
	CharCodes[CharCodes["LOWER_F"] = 102] = "LOWER_F";
	CharCodes[CharCodes["LOWER_X"] = 120] = "LOWER_X";
	CharCodes[CharCodes["LOWER_Z"] = 122] = "LOWER_Z";
	CharCodes[CharCodes["UPPER_A"] = 65] = "UPPER_A";
	CharCodes[CharCodes["UPPER_F"] = 70] = "UPPER_F";
	CharCodes[CharCodes["UPPER_Z"] = 90] = "UPPER_Z";
})(CharCodes || (CharCodes = {}));
/** Bit that needs to be set to convert an upper case ASCII character to lower case */
var TO_LOWER_BIT = 32;
var BinTrieFlags;
(function(BinTrieFlags) {
	BinTrieFlags[BinTrieFlags["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
	BinTrieFlags[BinTrieFlags["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
	BinTrieFlags[BinTrieFlags["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(BinTrieFlags || (BinTrieFlags = {}));
function isNumber(code) {
	return code >= CharCodes.ZERO && code <= CharCodes.NINE;
}
function isHexadecimalCharacter(code) {
	return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_F || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_F;
}
function isAsciiAlphaNumeric$1(code) {
	return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_Z || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_Z || isNumber(code);
}
/**
* Checks if the given character is a valid end character for an entity in an attribute.
*
* Attribute values that aren't terminated properly aren't parsed, and shouldn't lead to a parser error.
* See the example in https://html.spec.whatwg.org/multipage/parsing.html#named-character-reference-state
*/
function isEntityInAttributeInvalidEnd(code) {
	return code === CharCodes.EQUALS || isAsciiAlphaNumeric$1(code);
}
var EntityDecoderState;
(function(EntityDecoderState) {
	EntityDecoderState[EntityDecoderState["EntityStart"] = 0] = "EntityStart";
	EntityDecoderState[EntityDecoderState["NumericStart"] = 1] = "NumericStart";
	EntityDecoderState[EntityDecoderState["NumericDecimal"] = 2] = "NumericDecimal";
	EntityDecoderState[EntityDecoderState["NumericHex"] = 3] = "NumericHex";
	EntityDecoderState[EntityDecoderState["NamedEntity"] = 4] = "NamedEntity";
})(EntityDecoderState || (EntityDecoderState = {}));
var DecodingMode;
(function(DecodingMode) {
	/** Entities in text nodes that can end with any character. */
	DecodingMode[DecodingMode["Legacy"] = 0] = "Legacy";
	/** Only allow entities terminated with a semicolon. */
	DecodingMode[DecodingMode["Strict"] = 1] = "Strict";
	/** Entities in attributes have limitations on ending characters. */
	DecodingMode[DecodingMode["Attribute"] = 2] = "Attribute";
})(DecodingMode || (DecodingMode = {}));
/**
* Token decoder with support of writing partial entities.
*/
var EntityDecoder = class {
	constructor(decodeTree, emitCodePoint, errors) {
		this.decodeTree = decodeTree;
		this.emitCodePoint = emitCodePoint;
		this.errors = errors;
		/** The current state of the decoder. */
		this.state = EntityDecoderState.EntityStart;
		/** Characters that were consumed while parsing an entity. */
		this.consumed = 1;
		/**
		* The result of the entity.
		*
		* Either the result index of a numeric entity, or the codepoint of a
		* numeric entity.
		*/
		this.result = 0;
		/** The current index in the decode tree. */
		this.treeIndex = 0;
		/** The number of characters that were consumed in excess. */
		this.excess = 1;
		/** The mode in which the decoder is operating. */
		this.decodeMode = DecodingMode.Strict;
	}
	/** Resets the instance to make it reusable. */
	startEntity(decodeMode) {
		this.decodeMode = decodeMode;
		this.state = EntityDecoderState.EntityStart;
		this.result = 0;
		this.treeIndex = 0;
		this.excess = 1;
		this.consumed = 1;
	}
	/**
	* Write an entity to the decoder. This can be called multiple times with partial entities.
	* If the entity is incomplete, the decoder will return -1.
	*
	* Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
	* entity is incomplete, and resume when the next string is written.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	write(input, offset) {
		switch (this.state) {
			case EntityDecoderState.EntityStart:
				if (input.charCodeAt(offset) === CharCodes.NUM) {
					this.state = EntityDecoderState.NumericStart;
					this.consumed += 1;
					return this.stateNumericStart(input, offset + 1);
				}
				this.state = EntityDecoderState.NamedEntity;
				return this.stateNamedEntity(input, offset);
			case EntityDecoderState.NumericStart: return this.stateNumericStart(input, offset);
			case EntityDecoderState.NumericDecimal: return this.stateNumericDecimal(input, offset);
			case EntityDecoderState.NumericHex: return this.stateNumericHex(input, offset);
			case EntityDecoderState.NamedEntity: return this.stateNamedEntity(input, offset);
		}
	}
	/**
	* Switches between the numeric decimal and hexadecimal states.
	*
	* Equivalent to the `Numeric character reference state` in the HTML spec.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNumericStart(input, offset) {
		if (offset >= input.length) return -1;
		if ((input.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
			this.state = EntityDecoderState.NumericHex;
			this.consumed += 1;
			return this.stateNumericHex(input, offset + 1);
		}
		this.state = EntityDecoderState.NumericDecimal;
		return this.stateNumericDecimal(input, offset);
	}
	addToNumericResult(input, start, end, base) {
		if (start !== end) {
			const digitCount = end - start;
			this.result = this.result * Math.pow(base, digitCount) + Number.parseInt(input.substr(start, digitCount), base);
			this.consumed += digitCount;
		}
	}
	/**
	* Parses a hexadecimal numeric entity.
	*
	* Equivalent to the `Hexademical character reference state` in the HTML spec.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNumericHex(input, offset) {
		const startIndex = offset;
		while (offset < input.length) {
			const char = input.charCodeAt(offset);
			if (isNumber(char) || isHexadecimalCharacter(char)) offset += 1;
			else {
				this.addToNumericResult(input, startIndex, offset, 16);
				return this.emitNumericEntity(char, 3);
			}
		}
		this.addToNumericResult(input, startIndex, offset, 16);
		return -1;
	}
	/**
	* Parses a decimal numeric entity.
	*
	* Equivalent to the `Decimal character reference state` in the HTML spec.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNumericDecimal(input, offset) {
		const startIndex = offset;
		while (offset < input.length) {
			const char = input.charCodeAt(offset);
			if (isNumber(char)) offset += 1;
			else {
				this.addToNumericResult(input, startIndex, offset, 10);
				return this.emitNumericEntity(char, 2);
			}
		}
		this.addToNumericResult(input, startIndex, offset, 10);
		return -1;
	}
	/**
	* Validate and emit a numeric entity.
	*
	* Implements the logic from the `Hexademical character reference start
	* state` and `Numeric character reference end state` in the HTML spec.
	*
	* @param lastCp The last code point of the entity. Used to see if the
	*               entity was terminated with a semicolon.
	* @param expectedLength The minimum number of characters that should be
	*                       consumed. Used to validate that at least one digit
	*                       was consumed.
	* @returns The number of characters that were consumed.
	*/
	emitNumericEntity(lastCp, expectedLength) {
		var _a;
		if (this.consumed <= expectedLength) {
			(_a = this.errors) === null || _a === void 0 || _a.absenceOfDigitsInNumericCharacterReference(this.consumed);
			return 0;
		}
		if (lastCp === CharCodes.SEMI) this.consumed += 1;
		else if (this.decodeMode === DecodingMode.Strict) return 0;
		this.emitCodePoint(replaceCodePoint(this.result), this.consumed);
		if (this.errors) {
			if (lastCp !== CharCodes.SEMI) this.errors.missingSemicolonAfterCharacterReference();
			this.errors.validateNumericCharacterReference(this.result);
		}
		return this.consumed;
	}
	/**
	* Parses a named entity.
	*
	* Equivalent to the `Named character reference state` in the HTML spec.
	*
	* @param input The string containing the entity (or a continuation of the entity).
	* @param offset The current offset.
	* @returns The number of characters that were consumed, or -1 if the entity is incomplete.
	*/
	stateNamedEntity(input, offset) {
		const { decodeTree } = this;
		let current = decodeTree[this.treeIndex];
		let valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
		for (; offset < input.length; offset++, this.excess++) {
			const char = input.charCodeAt(offset);
			this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
			if (this.treeIndex < 0) return this.result === 0 || this.decodeMode === DecodingMode.Attribute && (valueLength === 0 || isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
			current = decodeTree[this.treeIndex];
			valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
			if (valueLength !== 0) {
				if (char === CharCodes.SEMI) return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
				if (this.decodeMode !== DecodingMode.Strict) {
					this.result = this.treeIndex;
					this.consumed += this.excess;
					this.excess = 0;
				}
			}
		}
		return -1;
	}
	/**
	* Emit a named entity that was not terminated with a semicolon.
	*
	* @returns The number of characters consumed.
	*/
	emitNotTerminatedNamedEntity() {
		var _a;
		const { result, decodeTree } = this;
		const valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
		this.emitNamedEntityData(result, valueLength, this.consumed);
		(_a = this.errors) === null || _a === void 0 || _a.missingSemicolonAfterCharacterReference();
		return this.consumed;
	}
	/**
	* Emit a named entity.
	*
	* @param result The index of the entity in the decode tree.
	* @param valueLength The number of bytes in the entity.
	* @param consumed The number of characters consumed.
	*
	* @returns The number of characters consumed.
	*/
	emitNamedEntityData(result, valueLength, consumed) {
		const { decodeTree } = this;
		this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~BinTrieFlags.VALUE_LENGTH : decodeTree[result + 1], consumed);
		if (valueLength === 3) this.emitCodePoint(decodeTree[result + 2], consumed);
		return consumed;
	}
	/**
	* Signal to the parser that the end of the input was reached.
	*
	* Remaining data will be emitted and relevant errors will be produced.
	*
	* @returns The number of characters consumed.
	*/
	end() {
		var _a;
		switch (this.state) {
			case EntityDecoderState.NamedEntity: return this.result !== 0 && (this.decodeMode !== DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
			case EntityDecoderState.NumericDecimal: return this.emitNumericEntity(0, 2);
			case EntityDecoderState.NumericHex: return this.emitNumericEntity(0, 3);
			case EntityDecoderState.NumericStart:
				(_a = this.errors) === null || _a === void 0 || _a.absenceOfDigitsInNumericCharacterReference(this.consumed);
				return 0;
			case EntityDecoderState.EntityStart: return 0;
		}
	}
};
/**
* Determines the branch of the current node that is taken given the current
* character. This function is used to traverse the trie.
*
* @param decodeTree The trie.
* @param current The current node.
* @param nodeIdx The index right after the current node and its value.
* @param char The current character.
* @returns The index of the next node, or -1 if no branch is taken.
*/
function determineBranch(decodeTree, current, nodeIndex, char) {
	const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
	const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
	if (branchCount === 0) return jumpOffset !== 0 && char === jumpOffset ? nodeIndex : -1;
	if (jumpOffset) {
		const value = char - jumpOffset;
		return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIndex + value] - 1;
	}
	let lo = nodeIndex;
	let hi = lo + branchCount - 1;
	while (lo <= hi) {
		const mid = lo + hi >>> 1;
		const midValue = decodeTree[mid];
		if (midValue < char) lo = mid + 1;
		else if (midValue > char) hi = mid - 1;
		else return decodeTree[mid + branchCount];
	}
	return -1;
}
//#endregion
//#region node_modules/parse5/dist/common/html.js
/** All valid namespaces in HTML. */
var NS;
(function(NS) {
	NS["HTML"] = "http://www.w3.org/1999/xhtml";
	NS["MATHML"] = "http://www.w3.org/1998/Math/MathML";
	NS["SVG"] = "http://www.w3.org/2000/svg";
	NS["XLINK"] = "http://www.w3.org/1999/xlink";
	NS["XML"] = "http://www.w3.org/XML/1998/namespace";
	NS["XMLNS"] = "http://www.w3.org/2000/xmlns/";
})(NS || (NS = {}));
var ATTRS;
(function(ATTRS) {
	ATTRS["TYPE"] = "type";
	ATTRS["ACTION"] = "action";
	ATTRS["ENCODING"] = "encoding";
	ATTRS["PROMPT"] = "prompt";
	ATTRS["NAME"] = "name";
	ATTRS["COLOR"] = "color";
	ATTRS["FACE"] = "face";
	ATTRS["SIZE"] = "size";
})(ATTRS || (ATTRS = {}));
/**
* The mode of the document.
*
* @see {@link https://dom.spec.whatwg.org/#concept-document-limited-quirks}
*/
var DOCUMENT_MODE;
(function(DOCUMENT_MODE) {
	DOCUMENT_MODE["NO_QUIRKS"] = "no-quirks";
	DOCUMENT_MODE["QUIRKS"] = "quirks";
	DOCUMENT_MODE["LIMITED_QUIRKS"] = "limited-quirks";
})(DOCUMENT_MODE || (DOCUMENT_MODE = {}));
var TAG_NAMES;
(function(TAG_NAMES) {
	TAG_NAMES["A"] = "a";
	TAG_NAMES["ADDRESS"] = "address";
	TAG_NAMES["ANNOTATION_XML"] = "annotation-xml";
	TAG_NAMES["APPLET"] = "applet";
	TAG_NAMES["AREA"] = "area";
	TAG_NAMES["ARTICLE"] = "article";
	TAG_NAMES["ASIDE"] = "aside";
	TAG_NAMES["B"] = "b";
	TAG_NAMES["BASE"] = "base";
	TAG_NAMES["BASEFONT"] = "basefont";
	TAG_NAMES["BGSOUND"] = "bgsound";
	TAG_NAMES["BIG"] = "big";
	TAG_NAMES["BLOCKQUOTE"] = "blockquote";
	TAG_NAMES["BODY"] = "body";
	TAG_NAMES["BR"] = "br";
	TAG_NAMES["BUTTON"] = "button";
	TAG_NAMES["CAPTION"] = "caption";
	TAG_NAMES["CENTER"] = "center";
	TAG_NAMES["CODE"] = "code";
	TAG_NAMES["COL"] = "col";
	TAG_NAMES["COLGROUP"] = "colgroup";
	TAG_NAMES["DD"] = "dd";
	TAG_NAMES["DESC"] = "desc";
	TAG_NAMES["DETAILS"] = "details";
	TAG_NAMES["DIALOG"] = "dialog";
	TAG_NAMES["DIR"] = "dir";
	TAG_NAMES["DIV"] = "div";
	TAG_NAMES["DL"] = "dl";
	TAG_NAMES["DT"] = "dt";
	TAG_NAMES["EM"] = "em";
	TAG_NAMES["EMBED"] = "embed";
	TAG_NAMES["FIELDSET"] = "fieldset";
	TAG_NAMES["FIGCAPTION"] = "figcaption";
	TAG_NAMES["FIGURE"] = "figure";
	TAG_NAMES["FONT"] = "font";
	TAG_NAMES["FOOTER"] = "footer";
	TAG_NAMES["FOREIGN_OBJECT"] = "foreignObject";
	TAG_NAMES["FORM"] = "form";
	TAG_NAMES["FRAME"] = "frame";
	TAG_NAMES["FRAMESET"] = "frameset";
	TAG_NAMES["H1"] = "h1";
	TAG_NAMES["H2"] = "h2";
	TAG_NAMES["H3"] = "h3";
	TAG_NAMES["H4"] = "h4";
	TAG_NAMES["H5"] = "h5";
	TAG_NAMES["H6"] = "h6";
	TAG_NAMES["HEAD"] = "head";
	TAG_NAMES["HEADER"] = "header";
	TAG_NAMES["HGROUP"] = "hgroup";
	TAG_NAMES["HR"] = "hr";
	TAG_NAMES["HTML"] = "html";
	TAG_NAMES["I"] = "i";
	TAG_NAMES["IMG"] = "img";
	TAG_NAMES["IMAGE"] = "image";
	TAG_NAMES["INPUT"] = "input";
	TAG_NAMES["IFRAME"] = "iframe";
	TAG_NAMES["KEYGEN"] = "keygen";
	TAG_NAMES["LABEL"] = "label";
	TAG_NAMES["LI"] = "li";
	TAG_NAMES["LINK"] = "link";
	TAG_NAMES["LISTING"] = "listing";
	TAG_NAMES["MAIN"] = "main";
	TAG_NAMES["MALIGNMARK"] = "malignmark";
	TAG_NAMES["MARQUEE"] = "marquee";
	TAG_NAMES["MATH"] = "math";
	TAG_NAMES["MENU"] = "menu";
	TAG_NAMES["META"] = "meta";
	TAG_NAMES["MGLYPH"] = "mglyph";
	TAG_NAMES["MI"] = "mi";
	TAG_NAMES["MO"] = "mo";
	TAG_NAMES["MN"] = "mn";
	TAG_NAMES["MS"] = "ms";
	TAG_NAMES["MTEXT"] = "mtext";
	TAG_NAMES["NAV"] = "nav";
	TAG_NAMES["NOBR"] = "nobr";
	TAG_NAMES["NOFRAMES"] = "noframes";
	TAG_NAMES["NOEMBED"] = "noembed";
	TAG_NAMES["NOSCRIPT"] = "noscript";
	TAG_NAMES["OBJECT"] = "object";
	TAG_NAMES["OL"] = "ol";
	TAG_NAMES["OPTGROUP"] = "optgroup";
	TAG_NAMES["OPTION"] = "option";
	TAG_NAMES["P"] = "p";
	TAG_NAMES["PARAM"] = "param";
	TAG_NAMES["PLAINTEXT"] = "plaintext";
	TAG_NAMES["PRE"] = "pre";
	TAG_NAMES["RB"] = "rb";
	TAG_NAMES["RP"] = "rp";
	TAG_NAMES["RT"] = "rt";
	TAG_NAMES["RTC"] = "rtc";
	TAG_NAMES["RUBY"] = "ruby";
	TAG_NAMES["S"] = "s";
	TAG_NAMES["SCRIPT"] = "script";
	TAG_NAMES["SEARCH"] = "search";
	TAG_NAMES["SECTION"] = "section";
	TAG_NAMES["SELECT"] = "select";
	TAG_NAMES["SOURCE"] = "source";
	TAG_NAMES["SMALL"] = "small";
	TAG_NAMES["SPAN"] = "span";
	TAG_NAMES["STRIKE"] = "strike";
	TAG_NAMES["STRONG"] = "strong";
	TAG_NAMES["STYLE"] = "style";
	TAG_NAMES["SUB"] = "sub";
	TAG_NAMES["SUMMARY"] = "summary";
	TAG_NAMES["SUP"] = "sup";
	TAG_NAMES["TABLE"] = "table";
	TAG_NAMES["TBODY"] = "tbody";
	TAG_NAMES["TEMPLATE"] = "template";
	TAG_NAMES["TEXTAREA"] = "textarea";
	TAG_NAMES["TFOOT"] = "tfoot";
	TAG_NAMES["TD"] = "td";
	TAG_NAMES["TH"] = "th";
	TAG_NAMES["THEAD"] = "thead";
	TAG_NAMES["TITLE"] = "title";
	TAG_NAMES["TR"] = "tr";
	TAG_NAMES["TRACK"] = "track";
	TAG_NAMES["TT"] = "tt";
	TAG_NAMES["U"] = "u";
	TAG_NAMES["UL"] = "ul";
	TAG_NAMES["SVG"] = "svg";
	TAG_NAMES["VAR"] = "var";
	TAG_NAMES["WBR"] = "wbr";
	TAG_NAMES["XMP"] = "xmp";
})(TAG_NAMES || (TAG_NAMES = {}));
/**
* Tag IDs are numeric IDs for known tag names.
*
* We use tag IDs to improve the performance of tag name comparisons.
*/
var TAG_ID;
(function(TAG_ID) {
	TAG_ID[TAG_ID["UNKNOWN"] = 0] = "UNKNOWN";
	TAG_ID[TAG_ID["A"] = 1] = "A";
	TAG_ID[TAG_ID["ADDRESS"] = 2] = "ADDRESS";
	TAG_ID[TAG_ID["ANNOTATION_XML"] = 3] = "ANNOTATION_XML";
	TAG_ID[TAG_ID["APPLET"] = 4] = "APPLET";
	TAG_ID[TAG_ID["AREA"] = 5] = "AREA";
	TAG_ID[TAG_ID["ARTICLE"] = 6] = "ARTICLE";
	TAG_ID[TAG_ID["ASIDE"] = 7] = "ASIDE";
	TAG_ID[TAG_ID["B"] = 8] = "B";
	TAG_ID[TAG_ID["BASE"] = 9] = "BASE";
	TAG_ID[TAG_ID["BASEFONT"] = 10] = "BASEFONT";
	TAG_ID[TAG_ID["BGSOUND"] = 11] = "BGSOUND";
	TAG_ID[TAG_ID["BIG"] = 12] = "BIG";
	TAG_ID[TAG_ID["BLOCKQUOTE"] = 13] = "BLOCKQUOTE";
	TAG_ID[TAG_ID["BODY"] = 14] = "BODY";
	TAG_ID[TAG_ID["BR"] = 15] = "BR";
	TAG_ID[TAG_ID["BUTTON"] = 16] = "BUTTON";
	TAG_ID[TAG_ID["CAPTION"] = 17] = "CAPTION";
	TAG_ID[TAG_ID["CENTER"] = 18] = "CENTER";
	TAG_ID[TAG_ID["CODE"] = 19] = "CODE";
	TAG_ID[TAG_ID["COL"] = 20] = "COL";
	TAG_ID[TAG_ID["COLGROUP"] = 21] = "COLGROUP";
	TAG_ID[TAG_ID["DD"] = 22] = "DD";
	TAG_ID[TAG_ID["DESC"] = 23] = "DESC";
	TAG_ID[TAG_ID["DETAILS"] = 24] = "DETAILS";
	TAG_ID[TAG_ID["DIALOG"] = 25] = "DIALOG";
	TAG_ID[TAG_ID["DIR"] = 26] = "DIR";
	TAG_ID[TAG_ID["DIV"] = 27] = "DIV";
	TAG_ID[TAG_ID["DL"] = 28] = "DL";
	TAG_ID[TAG_ID["DT"] = 29] = "DT";
	TAG_ID[TAG_ID["EM"] = 30] = "EM";
	TAG_ID[TAG_ID["EMBED"] = 31] = "EMBED";
	TAG_ID[TAG_ID["FIELDSET"] = 32] = "FIELDSET";
	TAG_ID[TAG_ID["FIGCAPTION"] = 33] = "FIGCAPTION";
	TAG_ID[TAG_ID["FIGURE"] = 34] = "FIGURE";
	TAG_ID[TAG_ID["FONT"] = 35] = "FONT";
	TAG_ID[TAG_ID["FOOTER"] = 36] = "FOOTER";
	TAG_ID[TAG_ID["FOREIGN_OBJECT"] = 37] = "FOREIGN_OBJECT";
	TAG_ID[TAG_ID["FORM"] = 38] = "FORM";
	TAG_ID[TAG_ID["FRAME"] = 39] = "FRAME";
	TAG_ID[TAG_ID["FRAMESET"] = 40] = "FRAMESET";
	TAG_ID[TAG_ID["H1"] = 41] = "H1";
	TAG_ID[TAG_ID["H2"] = 42] = "H2";
	TAG_ID[TAG_ID["H3"] = 43] = "H3";
	TAG_ID[TAG_ID["H4"] = 44] = "H4";
	TAG_ID[TAG_ID["H5"] = 45] = "H5";
	TAG_ID[TAG_ID["H6"] = 46] = "H6";
	TAG_ID[TAG_ID["HEAD"] = 47] = "HEAD";
	TAG_ID[TAG_ID["HEADER"] = 48] = "HEADER";
	TAG_ID[TAG_ID["HGROUP"] = 49] = "HGROUP";
	TAG_ID[TAG_ID["HR"] = 50] = "HR";
	TAG_ID[TAG_ID["HTML"] = 51] = "HTML";
	TAG_ID[TAG_ID["I"] = 52] = "I";
	TAG_ID[TAG_ID["IMG"] = 53] = "IMG";
	TAG_ID[TAG_ID["IMAGE"] = 54] = "IMAGE";
	TAG_ID[TAG_ID["INPUT"] = 55] = "INPUT";
	TAG_ID[TAG_ID["IFRAME"] = 56] = "IFRAME";
	TAG_ID[TAG_ID["KEYGEN"] = 57] = "KEYGEN";
	TAG_ID[TAG_ID["LABEL"] = 58] = "LABEL";
	TAG_ID[TAG_ID["LI"] = 59] = "LI";
	TAG_ID[TAG_ID["LINK"] = 60] = "LINK";
	TAG_ID[TAG_ID["LISTING"] = 61] = "LISTING";
	TAG_ID[TAG_ID["MAIN"] = 62] = "MAIN";
	TAG_ID[TAG_ID["MALIGNMARK"] = 63] = "MALIGNMARK";
	TAG_ID[TAG_ID["MARQUEE"] = 64] = "MARQUEE";
	TAG_ID[TAG_ID["MATH"] = 65] = "MATH";
	TAG_ID[TAG_ID["MENU"] = 66] = "MENU";
	TAG_ID[TAG_ID["META"] = 67] = "META";
	TAG_ID[TAG_ID["MGLYPH"] = 68] = "MGLYPH";
	TAG_ID[TAG_ID["MI"] = 69] = "MI";
	TAG_ID[TAG_ID["MO"] = 70] = "MO";
	TAG_ID[TAG_ID["MN"] = 71] = "MN";
	TAG_ID[TAG_ID["MS"] = 72] = "MS";
	TAG_ID[TAG_ID["MTEXT"] = 73] = "MTEXT";
	TAG_ID[TAG_ID["NAV"] = 74] = "NAV";
	TAG_ID[TAG_ID["NOBR"] = 75] = "NOBR";
	TAG_ID[TAG_ID["NOFRAMES"] = 76] = "NOFRAMES";
	TAG_ID[TAG_ID["NOEMBED"] = 77] = "NOEMBED";
	TAG_ID[TAG_ID["NOSCRIPT"] = 78] = "NOSCRIPT";
	TAG_ID[TAG_ID["OBJECT"] = 79] = "OBJECT";
	TAG_ID[TAG_ID["OL"] = 80] = "OL";
	TAG_ID[TAG_ID["OPTGROUP"] = 81] = "OPTGROUP";
	TAG_ID[TAG_ID["OPTION"] = 82] = "OPTION";
	TAG_ID[TAG_ID["P"] = 83] = "P";
	TAG_ID[TAG_ID["PARAM"] = 84] = "PARAM";
	TAG_ID[TAG_ID["PLAINTEXT"] = 85] = "PLAINTEXT";
	TAG_ID[TAG_ID["PRE"] = 86] = "PRE";
	TAG_ID[TAG_ID["RB"] = 87] = "RB";
	TAG_ID[TAG_ID["RP"] = 88] = "RP";
	TAG_ID[TAG_ID["RT"] = 89] = "RT";
	TAG_ID[TAG_ID["RTC"] = 90] = "RTC";
	TAG_ID[TAG_ID["RUBY"] = 91] = "RUBY";
	TAG_ID[TAG_ID["S"] = 92] = "S";
	TAG_ID[TAG_ID["SCRIPT"] = 93] = "SCRIPT";
	TAG_ID[TAG_ID["SEARCH"] = 94] = "SEARCH";
	TAG_ID[TAG_ID["SECTION"] = 95] = "SECTION";
	TAG_ID[TAG_ID["SELECT"] = 96] = "SELECT";
	TAG_ID[TAG_ID["SOURCE"] = 97] = "SOURCE";
	TAG_ID[TAG_ID["SMALL"] = 98] = "SMALL";
	TAG_ID[TAG_ID["SPAN"] = 99] = "SPAN";
	TAG_ID[TAG_ID["STRIKE"] = 100] = "STRIKE";
	TAG_ID[TAG_ID["STRONG"] = 101] = "STRONG";
	TAG_ID[TAG_ID["STYLE"] = 102] = "STYLE";
	TAG_ID[TAG_ID["SUB"] = 103] = "SUB";
	TAG_ID[TAG_ID["SUMMARY"] = 104] = "SUMMARY";
	TAG_ID[TAG_ID["SUP"] = 105] = "SUP";
	TAG_ID[TAG_ID["TABLE"] = 106] = "TABLE";
	TAG_ID[TAG_ID["TBODY"] = 107] = "TBODY";
	TAG_ID[TAG_ID["TEMPLATE"] = 108] = "TEMPLATE";
	TAG_ID[TAG_ID["TEXTAREA"] = 109] = "TEXTAREA";
	TAG_ID[TAG_ID["TFOOT"] = 110] = "TFOOT";
	TAG_ID[TAG_ID["TD"] = 111] = "TD";
	TAG_ID[TAG_ID["TH"] = 112] = "TH";
	TAG_ID[TAG_ID["THEAD"] = 113] = "THEAD";
	TAG_ID[TAG_ID["TITLE"] = 114] = "TITLE";
	TAG_ID[TAG_ID["TR"] = 115] = "TR";
	TAG_ID[TAG_ID["TRACK"] = 116] = "TRACK";
	TAG_ID[TAG_ID["TT"] = 117] = "TT";
	TAG_ID[TAG_ID["U"] = 118] = "U";
	TAG_ID[TAG_ID["UL"] = 119] = "UL";
	TAG_ID[TAG_ID["SVG"] = 120] = "SVG";
	TAG_ID[TAG_ID["VAR"] = 121] = "VAR";
	TAG_ID[TAG_ID["WBR"] = 122] = "WBR";
	TAG_ID[TAG_ID["XMP"] = 123] = "XMP";
})(TAG_ID || (TAG_ID = {}));
var TAG_NAME_TO_ID = /* @__PURE__ */ new Map([
	[TAG_NAMES.A, TAG_ID.A],
	[TAG_NAMES.ADDRESS, TAG_ID.ADDRESS],
	[TAG_NAMES.ANNOTATION_XML, TAG_ID.ANNOTATION_XML],
	[TAG_NAMES.APPLET, TAG_ID.APPLET],
	[TAG_NAMES.AREA, TAG_ID.AREA],
	[TAG_NAMES.ARTICLE, TAG_ID.ARTICLE],
	[TAG_NAMES.ASIDE, TAG_ID.ASIDE],
	[TAG_NAMES.B, TAG_ID.B],
	[TAG_NAMES.BASE, TAG_ID.BASE],
	[TAG_NAMES.BASEFONT, TAG_ID.BASEFONT],
	[TAG_NAMES.BGSOUND, TAG_ID.BGSOUND],
	[TAG_NAMES.BIG, TAG_ID.BIG],
	[TAG_NAMES.BLOCKQUOTE, TAG_ID.BLOCKQUOTE],
	[TAG_NAMES.BODY, TAG_ID.BODY],
	[TAG_NAMES.BR, TAG_ID.BR],
	[TAG_NAMES.BUTTON, TAG_ID.BUTTON],
	[TAG_NAMES.CAPTION, TAG_ID.CAPTION],
	[TAG_NAMES.CENTER, TAG_ID.CENTER],
	[TAG_NAMES.CODE, TAG_ID.CODE],
	[TAG_NAMES.COL, TAG_ID.COL],
	[TAG_NAMES.COLGROUP, TAG_ID.COLGROUP],
	[TAG_NAMES.DD, TAG_ID.DD],
	[TAG_NAMES.DESC, TAG_ID.DESC],
	[TAG_NAMES.DETAILS, TAG_ID.DETAILS],
	[TAG_NAMES.DIALOG, TAG_ID.DIALOG],
	[TAG_NAMES.DIR, TAG_ID.DIR],
	[TAG_NAMES.DIV, TAG_ID.DIV],
	[TAG_NAMES.DL, TAG_ID.DL],
	[TAG_NAMES.DT, TAG_ID.DT],
	[TAG_NAMES.EM, TAG_ID.EM],
	[TAG_NAMES.EMBED, TAG_ID.EMBED],
	[TAG_NAMES.FIELDSET, TAG_ID.FIELDSET],
	[TAG_NAMES.FIGCAPTION, TAG_ID.FIGCAPTION],
	[TAG_NAMES.FIGURE, TAG_ID.FIGURE],
	[TAG_NAMES.FONT, TAG_ID.FONT],
	[TAG_NAMES.FOOTER, TAG_ID.FOOTER],
	[TAG_NAMES.FOREIGN_OBJECT, TAG_ID.FOREIGN_OBJECT],
	[TAG_NAMES.FORM, TAG_ID.FORM],
	[TAG_NAMES.FRAME, TAG_ID.FRAME],
	[TAG_NAMES.FRAMESET, TAG_ID.FRAMESET],
	[TAG_NAMES.H1, TAG_ID.H1],
	[TAG_NAMES.H2, TAG_ID.H2],
	[TAG_NAMES.H3, TAG_ID.H3],
	[TAG_NAMES.H4, TAG_ID.H4],
	[TAG_NAMES.H5, TAG_ID.H5],
	[TAG_NAMES.H6, TAG_ID.H6],
	[TAG_NAMES.HEAD, TAG_ID.HEAD],
	[TAG_NAMES.HEADER, TAG_ID.HEADER],
	[TAG_NAMES.HGROUP, TAG_ID.HGROUP],
	[TAG_NAMES.HR, TAG_ID.HR],
	[TAG_NAMES.HTML, TAG_ID.HTML],
	[TAG_NAMES.I, TAG_ID.I],
	[TAG_NAMES.IMG, TAG_ID.IMG],
	[TAG_NAMES.IMAGE, TAG_ID.IMAGE],
	[TAG_NAMES.INPUT, TAG_ID.INPUT],
	[TAG_NAMES.IFRAME, TAG_ID.IFRAME],
	[TAG_NAMES.KEYGEN, TAG_ID.KEYGEN],
	[TAG_NAMES.LABEL, TAG_ID.LABEL],
	[TAG_NAMES.LI, TAG_ID.LI],
	[TAG_NAMES.LINK, TAG_ID.LINK],
	[TAG_NAMES.LISTING, TAG_ID.LISTING],
	[TAG_NAMES.MAIN, TAG_ID.MAIN],
	[TAG_NAMES.MALIGNMARK, TAG_ID.MALIGNMARK],
	[TAG_NAMES.MARQUEE, TAG_ID.MARQUEE],
	[TAG_NAMES.MATH, TAG_ID.MATH],
	[TAG_NAMES.MENU, TAG_ID.MENU],
	[TAG_NAMES.META, TAG_ID.META],
	[TAG_NAMES.MGLYPH, TAG_ID.MGLYPH],
	[TAG_NAMES.MI, TAG_ID.MI],
	[TAG_NAMES.MO, TAG_ID.MO],
	[TAG_NAMES.MN, TAG_ID.MN],
	[TAG_NAMES.MS, TAG_ID.MS],
	[TAG_NAMES.MTEXT, TAG_ID.MTEXT],
	[TAG_NAMES.NAV, TAG_ID.NAV],
	[TAG_NAMES.NOBR, TAG_ID.NOBR],
	[TAG_NAMES.NOFRAMES, TAG_ID.NOFRAMES],
	[TAG_NAMES.NOEMBED, TAG_ID.NOEMBED],
	[TAG_NAMES.NOSCRIPT, TAG_ID.NOSCRIPT],
	[TAG_NAMES.OBJECT, TAG_ID.OBJECT],
	[TAG_NAMES.OL, TAG_ID.OL],
	[TAG_NAMES.OPTGROUP, TAG_ID.OPTGROUP],
	[TAG_NAMES.OPTION, TAG_ID.OPTION],
	[TAG_NAMES.P, TAG_ID.P],
	[TAG_NAMES.PARAM, TAG_ID.PARAM],
	[TAG_NAMES.PLAINTEXT, TAG_ID.PLAINTEXT],
	[TAG_NAMES.PRE, TAG_ID.PRE],
	[TAG_NAMES.RB, TAG_ID.RB],
	[TAG_NAMES.RP, TAG_ID.RP],
	[TAG_NAMES.RT, TAG_ID.RT],
	[TAG_NAMES.RTC, TAG_ID.RTC],
	[TAG_NAMES.RUBY, TAG_ID.RUBY],
	[TAG_NAMES.S, TAG_ID.S],
	[TAG_NAMES.SCRIPT, TAG_ID.SCRIPT],
	[TAG_NAMES.SEARCH, TAG_ID.SEARCH],
	[TAG_NAMES.SECTION, TAG_ID.SECTION],
	[TAG_NAMES.SELECT, TAG_ID.SELECT],
	[TAG_NAMES.SOURCE, TAG_ID.SOURCE],
	[TAG_NAMES.SMALL, TAG_ID.SMALL],
	[TAG_NAMES.SPAN, TAG_ID.SPAN],
	[TAG_NAMES.STRIKE, TAG_ID.STRIKE],
	[TAG_NAMES.STRONG, TAG_ID.STRONG],
	[TAG_NAMES.STYLE, TAG_ID.STYLE],
	[TAG_NAMES.SUB, TAG_ID.SUB],
	[TAG_NAMES.SUMMARY, TAG_ID.SUMMARY],
	[TAG_NAMES.SUP, TAG_ID.SUP],
	[TAG_NAMES.TABLE, TAG_ID.TABLE],
	[TAG_NAMES.TBODY, TAG_ID.TBODY],
	[TAG_NAMES.TEMPLATE, TAG_ID.TEMPLATE],
	[TAG_NAMES.TEXTAREA, TAG_ID.TEXTAREA],
	[TAG_NAMES.TFOOT, TAG_ID.TFOOT],
	[TAG_NAMES.TD, TAG_ID.TD],
	[TAG_NAMES.TH, TAG_ID.TH],
	[TAG_NAMES.THEAD, TAG_ID.THEAD],
	[TAG_NAMES.TITLE, TAG_ID.TITLE],
	[TAG_NAMES.TR, TAG_ID.TR],
	[TAG_NAMES.TRACK, TAG_ID.TRACK],
	[TAG_NAMES.TT, TAG_ID.TT],
	[TAG_NAMES.U, TAG_ID.U],
	[TAG_NAMES.UL, TAG_ID.UL],
	[TAG_NAMES.SVG, TAG_ID.SVG],
	[TAG_NAMES.VAR, TAG_ID.VAR],
	[TAG_NAMES.WBR, TAG_ID.WBR],
	[TAG_NAMES.XMP, TAG_ID.XMP]
]);
function getTagID(tagName) {
	var _a;
	return (_a = TAG_NAME_TO_ID.get(tagName)) !== null && _a !== void 0 ? _a : TAG_ID.UNKNOWN;
}
var $ = TAG_ID;
var SPECIAL_ELEMENTS = {
	[NS.HTML]: /* @__PURE__ */ new Set([
		$.ADDRESS,
		$.APPLET,
		$.AREA,
		$.ARTICLE,
		$.ASIDE,
		$.BASE,
		$.BASEFONT,
		$.BGSOUND,
		$.BLOCKQUOTE,
		$.BODY,
		$.BR,
		$.BUTTON,
		$.CAPTION,
		$.CENTER,
		$.COL,
		$.COLGROUP,
		$.DD,
		$.DETAILS,
		$.DIR,
		$.DIV,
		$.DL,
		$.DT,
		$.EMBED,
		$.FIELDSET,
		$.FIGCAPTION,
		$.FIGURE,
		$.FOOTER,
		$.FORM,
		$.FRAME,
		$.FRAMESET,
		$.H1,
		$.H2,
		$.H3,
		$.H4,
		$.H5,
		$.H6,
		$.HEAD,
		$.HEADER,
		$.HGROUP,
		$.HR,
		$.HTML,
		$.IFRAME,
		$.IMG,
		$.INPUT,
		$.LI,
		$.LINK,
		$.LISTING,
		$.MAIN,
		$.MARQUEE,
		$.MENU,
		$.META,
		$.NAV,
		$.NOEMBED,
		$.NOFRAMES,
		$.NOSCRIPT,
		$.OBJECT,
		$.OL,
		$.P,
		$.PARAM,
		$.PLAINTEXT,
		$.PRE,
		$.SCRIPT,
		$.SECTION,
		$.SELECT,
		$.SOURCE,
		$.STYLE,
		$.SUMMARY,
		$.TABLE,
		$.TBODY,
		$.TD,
		$.TEMPLATE,
		$.TEXTAREA,
		$.TFOOT,
		$.TH,
		$.THEAD,
		$.TITLE,
		$.TR,
		$.TRACK,
		$.UL,
		$.WBR,
		$.XMP
	]),
	[NS.MATHML]: /* @__PURE__ */ new Set([
		$.MI,
		$.MO,
		$.MN,
		$.MS,
		$.MTEXT,
		$.ANNOTATION_XML
	]),
	[NS.SVG]: /* @__PURE__ */ new Set([
		$.TITLE,
		$.FOREIGN_OBJECT,
		$.DESC
	]),
	[NS.XLINK]: /* @__PURE__ */ new Set(),
	[NS.XML]: /* @__PURE__ */ new Set(),
	[NS.XMLNS]: /* @__PURE__ */ new Set()
};
var NUMBERED_HEADERS = /* @__PURE__ */ new Set([
	$.H1,
	$.H2,
	$.H3,
	$.H4,
	$.H5,
	$.H6
]);
TAG_NAMES.STYLE, TAG_NAMES.SCRIPT, TAG_NAMES.XMP, TAG_NAMES.IFRAME, TAG_NAMES.NOEMBED, TAG_NAMES.NOFRAMES, TAG_NAMES.PLAINTEXT;
//#endregion
//#region node_modules/parse5/dist/tokenizer/index.js
var State;
(function(State) {
	State[State["DATA"] = 0] = "DATA";
	State[State["RCDATA"] = 1] = "RCDATA";
	State[State["RAWTEXT"] = 2] = "RAWTEXT";
	State[State["SCRIPT_DATA"] = 3] = "SCRIPT_DATA";
	State[State["PLAINTEXT"] = 4] = "PLAINTEXT";
	State[State["TAG_OPEN"] = 5] = "TAG_OPEN";
	State[State["END_TAG_OPEN"] = 6] = "END_TAG_OPEN";
	State[State["TAG_NAME"] = 7] = "TAG_NAME";
	State[State["RCDATA_LESS_THAN_SIGN"] = 8] = "RCDATA_LESS_THAN_SIGN";
	State[State["RCDATA_END_TAG_OPEN"] = 9] = "RCDATA_END_TAG_OPEN";
	State[State["RCDATA_END_TAG_NAME"] = 10] = "RCDATA_END_TAG_NAME";
	State[State["RAWTEXT_LESS_THAN_SIGN"] = 11] = "RAWTEXT_LESS_THAN_SIGN";
	State[State["RAWTEXT_END_TAG_OPEN"] = 12] = "RAWTEXT_END_TAG_OPEN";
	State[State["RAWTEXT_END_TAG_NAME"] = 13] = "RAWTEXT_END_TAG_NAME";
	State[State["SCRIPT_DATA_LESS_THAN_SIGN"] = 14] = "SCRIPT_DATA_LESS_THAN_SIGN";
	State[State["SCRIPT_DATA_END_TAG_OPEN"] = 15] = "SCRIPT_DATA_END_TAG_OPEN";
	State[State["SCRIPT_DATA_END_TAG_NAME"] = 16] = "SCRIPT_DATA_END_TAG_NAME";
	State[State["SCRIPT_DATA_ESCAPE_START"] = 17] = "SCRIPT_DATA_ESCAPE_START";
	State[State["SCRIPT_DATA_ESCAPE_START_DASH"] = 18] = "SCRIPT_DATA_ESCAPE_START_DASH";
	State[State["SCRIPT_DATA_ESCAPED"] = 19] = "SCRIPT_DATA_ESCAPED";
	State[State["SCRIPT_DATA_ESCAPED_DASH"] = 20] = "SCRIPT_DATA_ESCAPED_DASH";
	State[State["SCRIPT_DATA_ESCAPED_DASH_DASH"] = 21] = "SCRIPT_DATA_ESCAPED_DASH_DASH";
	State[State["SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN"] = 22] = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN";
	State[State["SCRIPT_DATA_ESCAPED_END_TAG_OPEN"] = 23] = "SCRIPT_DATA_ESCAPED_END_TAG_OPEN";
	State[State["SCRIPT_DATA_ESCAPED_END_TAG_NAME"] = 24] = "SCRIPT_DATA_ESCAPED_END_TAG_NAME";
	State[State["SCRIPT_DATA_DOUBLE_ESCAPE_START"] = 25] = "SCRIPT_DATA_DOUBLE_ESCAPE_START";
	State[State["SCRIPT_DATA_DOUBLE_ESCAPED"] = 26] = "SCRIPT_DATA_DOUBLE_ESCAPED";
	State[State["SCRIPT_DATA_DOUBLE_ESCAPED_DASH"] = 27] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH";
	State[State["SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH"] = 28] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH";
	State[State["SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN"] = 29] = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN";
	State[State["SCRIPT_DATA_DOUBLE_ESCAPE_END"] = 30] = "SCRIPT_DATA_DOUBLE_ESCAPE_END";
	State[State["BEFORE_ATTRIBUTE_NAME"] = 31] = "BEFORE_ATTRIBUTE_NAME";
	State[State["ATTRIBUTE_NAME"] = 32] = "ATTRIBUTE_NAME";
	State[State["AFTER_ATTRIBUTE_NAME"] = 33] = "AFTER_ATTRIBUTE_NAME";
	State[State["BEFORE_ATTRIBUTE_VALUE"] = 34] = "BEFORE_ATTRIBUTE_VALUE";
	State[State["ATTRIBUTE_VALUE_DOUBLE_QUOTED"] = 35] = "ATTRIBUTE_VALUE_DOUBLE_QUOTED";
	State[State["ATTRIBUTE_VALUE_SINGLE_QUOTED"] = 36] = "ATTRIBUTE_VALUE_SINGLE_QUOTED";
	State[State["ATTRIBUTE_VALUE_UNQUOTED"] = 37] = "ATTRIBUTE_VALUE_UNQUOTED";
	State[State["AFTER_ATTRIBUTE_VALUE_QUOTED"] = 38] = "AFTER_ATTRIBUTE_VALUE_QUOTED";
	State[State["SELF_CLOSING_START_TAG"] = 39] = "SELF_CLOSING_START_TAG";
	State[State["BOGUS_COMMENT"] = 40] = "BOGUS_COMMENT";
	State[State["MARKUP_DECLARATION_OPEN"] = 41] = "MARKUP_DECLARATION_OPEN";
	State[State["COMMENT_START"] = 42] = "COMMENT_START";
	State[State["COMMENT_START_DASH"] = 43] = "COMMENT_START_DASH";
	State[State["COMMENT"] = 44] = "COMMENT";
	State[State["COMMENT_LESS_THAN_SIGN"] = 45] = "COMMENT_LESS_THAN_SIGN";
	State[State["COMMENT_LESS_THAN_SIGN_BANG"] = 46] = "COMMENT_LESS_THAN_SIGN_BANG";
	State[State["COMMENT_LESS_THAN_SIGN_BANG_DASH"] = 47] = "COMMENT_LESS_THAN_SIGN_BANG_DASH";
	State[State["COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH"] = 48] = "COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH";
	State[State["COMMENT_END_DASH"] = 49] = "COMMENT_END_DASH";
	State[State["COMMENT_END"] = 50] = "COMMENT_END";
	State[State["COMMENT_END_BANG"] = 51] = "COMMENT_END_BANG";
	State[State["DOCTYPE"] = 52] = "DOCTYPE";
	State[State["BEFORE_DOCTYPE_NAME"] = 53] = "BEFORE_DOCTYPE_NAME";
	State[State["DOCTYPE_NAME"] = 54] = "DOCTYPE_NAME";
	State[State["AFTER_DOCTYPE_NAME"] = 55] = "AFTER_DOCTYPE_NAME";
	State[State["AFTER_DOCTYPE_PUBLIC_KEYWORD"] = 56] = "AFTER_DOCTYPE_PUBLIC_KEYWORD";
	State[State["BEFORE_DOCTYPE_PUBLIC_IDENTIFIER"] = 57] = "BEFORE_DOCTYPE_PUBLIC_IDENTIFIER";
	State[State["DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED"] = 58] = "DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED";
	State[State["DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED"] = 59] = "DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED";
	State[State["AFTER_DOCTYPE_PUBLIC_IDENTIFIER"] = 60] = "AFTER_DOCTYPE_PUBLIC_IDENTIFIER";
	State[State["BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS"] = 61] = "BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS";
	State[State["AFTER_DOCTYPE_SYSTEM_KEYWORD"] = 62] = "AFTER_DOCTYPE_SYSTEM_KEYWORD";
	State[State["BEFORE_DOCTYPE_SYSTEM_IDENTIFIER"] = 63] = "BEFORE_DOCTYPE_SYSTEM_IDENTIFIER";
	State[State["DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED"] = 64] = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED";
	State[State["DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED"] = 65] = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED";
	State[State["AFTER_DOCTYPE_SYSTEM_IDENTIFIER"] = 66] = "AFTER_DOCTYPE_SYSTEM_IDENTIFIER";
	State[State["BOGUS_DOCTYPE"] = 67] = "BOGUS_DOCTYPE";
	State[State["CDATA_SECTION"] = 68] = "CDATA_SECTION";
	State[State["CDATA_SECTION_BRACKET"] = 69] = "CDATA_SECTION_BRACKET";
	State[State["CDATA_SECTION_END"] = 70] = "CDATA_SECTION_END";
	State[State["CHARACTER_REFERENCE"] = 71] = "CHARACTER_REFERENCE";
	State[State["AMBIGUOUS_AMPERSAND"] = 72] = "AMBIGUOUS_AMPERSAND";
})(State || (State = {}));
var TokenizerMode = {
	DATA: State.DATA,
	RCDATA: State.RCDATA,
	RAWTEXT: State.RAWTEXT,
	SCRIPT_DATA: State.SCRIPT_DATA,
	PLAINTEXT: State.PLAINTEXT,
	CDATA_SECTION: State.CDATA_SECTION
};
function isAsciiDigit(cp) {
	return cp >= CODE_POINTS.DIGIT_0 && cp <= CODE_POINTS.DIGIT_9;
}
function isAsciiUpper(cp) {
	return cp >= CODE_POINTS.LATIN_CAPITAL_A && cp <= CODE_POINTS.LATIN_CAPITAL_Z;
}
function isAsciiLower(cp) {
	return cp >= CODE_POINTS.LATIN_SMALL_A && cp <= CODE_POINTS.LATIN_SMALL_Z;
}
function isAsciiLetter(cp) {
	return isAsciiLower(cp) || isAsciiUpper(cp);
}
function isAsciiAlphaNumeric(cp) {
	return isAsciiLetter(cp) || isAsciiDigit(cp);
}
function toAsciiLower(cp) {
	return cp + 32;
}
function isWhitespace(cp) {
	return cp === CODE_POINTS.SPACE || cp === CODE_POINTS.LINE_FEED || cp === CODE_POINTS.TABULATION || cp === CODE_POINTS.FORM_FEED;
}
function isScriptDataDoubleEscapeSequenceEnd(cp) {
	return isWhitespace(cp) || cp === CODE_POINTS.SOLIDUS || cp === CODE_POINTS.GREATER_THAN_SIGN;
}
function getErrorForNumericCharacterReference(code) {
	if (code === CODE_POINTS.NULL) return ERR.nullCharacterReference;
	else if (code > 1114111) return ERR.characterReferenceOutsideUnicodeRange;
	else if (isSurrogate(code)) return ERR.surrogateCharacterReference;
	else if (isUndefinedCodePoint(code)) return ERR.noncharacterCharacterReference;
	else if (isControlCodePoint(code) || code === CODE_POINTS.CARRIAGE_RETURN) return ERR.controlCharacterReference;
	return null;
}
var Tokenizer = class {
	constructor(options, handler) {
		this.options = options;
		this.handler = handler;
		this.paused = false;
		/** Ensures that the parsing loop isn't run multiple times at once. */
		this.inLoop = false;
		/**
		* Indicates that the current adjusted node exists, is not an element in the HTML namespace,
		* and that it is not an integration point for either MathML or HTML.
		*
		* @see {@link https://html.spec.whatwg.org/multipage/parsing.html#tree-construction}
		*/
		this.inForeignNode = false;
		this.lastStartTagName = "";
		this.active = false;
		this.state = State.DATA;
		this.returnState = State.DATA;
		this.entityStartPos = 0;
		this.consumedAfterSnapshot = -1;
		this.currentCharacterToken = null;
		this.currentToken = null;
		this.currentAttr = {
			name: "",
			value: ""
		};
		this.preprocessor = new Preprocessor(handler);
		this.currentLocation = this.getCurrentLocation(-1);
		this.entityDecoder = new EntityDecoder(htmlDecodeTree, (cp, consumed) => {
			this.preprocessor.pos = this.entityStartPos + consumed - 1;
			this._flushCodePointConsumedAsCharacterReference(cp);
		}, handler.onParseError ? {
			missingSemicolonAfterCharacterReference: () => {
				this._err(ERR.missingSemicolonAfterCharacterReference, 1);
			},
			absenceOfDigitsInNumericCharacterReference: (consumed) => {
				this._err(ERR.absenceOfDigitsInNumericCharacterReference, this.entityStartPos - this.preprocessor.pos + consumed);
			},
			validateNumericCharacterReference: (code) => {
				const error = getErrorForNumericCharacterReference(code);
				if (error) this._err(error, 1);
			}
		} : void 0);
	}
	_err(code, cpOffset = 0) {
		var _a, _b;
		(_b = (_a = this.handler).onParseError) === null || _b === void 0 || _b.call(_a, this.preprocessor.getError(code, cpOffset));
	}
	getCurrentLocation(offset) {
		if (!this.options.sourceCodeLocationInfo) return null;
		return {
			startLine: this.preprocessor.line,
			startCol: this.preprocessor.col - offset,
			startOffset: this.preprocessor.offset - offset,
			endLine: -1,
			endCol: -1,
			endOffset: -1
		};
	}
	_runParsingLoop() {
		if (this.inLoop) return;
		this.inLoop = true;
		while (this.active && !this.paused) {
			this.consumedAfterSnapshot = 0;
			const cp = this._consume();
			if (!this._ensureHibernation()) this._callState(cp);
		}
		this.inLoop = false;
	}
	pause() {
		this.paused = true;
	}
	resume(writeCallback) {
		if (!this.paused) throw new Error("Parser was already resumed");
		this.paused = false;
		if (this.inLoop) return;
		this._runParsingLoop();
		if (!this.paused) writeCallback === null || writeCallback === void 0 || writeCallback();
	}
	write(chunk, isLastChunk, writeCallback) {
		this.active = true;
		this.preprocessor.write(chunk, isLastChunk);
		this._runParsingLoop();
		if (!this.paused) writeCallback === null || writeCallback === void 0 || writeCallback();
	}
	insertHtmlAtCurrentPos(chunk) {
		this.active = true;
		this.preprocessor.insertHtmlAtCurrentPos(chunk);
		this._runParsingLoop();
	}
	_ensureHibernation() {
		if (this.preprocessor.endOfChunkHit) {
			this.preprocessor.retreat(this.consumedAfterSnapshot);
			this.consumedAfterSnapshot = 0;
			this.active = false;
			return true;
		}
		return false;
	}
	_consume() {
		this.consumedAfterSnapshot++;
		return this.preprocessor.advance();
	}
	_advanceBy(count) {
		this.consumedAfterSnapshot += count;
		for (let i = 0; i < count; i++) this.preprocessor.advance();
	}
	_consumeSequenceIfMatch(pattern, caseSensitive) {
		if (this.preprocessor.startsWith(pattern, caseSensitive)) {
			this._advanceBy(pattern.length - 1);
			return true;
		}
		return false;
	}
	_createStartTagToken() {
		this.currentToken = {
			type: TokenType.START_TAG,
			tagName: "",
			tagID: TAG_ID.UNKNOWN,
			selfClosing: false,
			ackSelfClosing: false,
			attrs: [],
			location: this.getCurrentLocation(1)
		};
	}
	_createEndTagToken() {
		this.currentToken = {
			type: TokenType.END_TAG,
			tagName: "",
			tagID: TAG_ID.UNKNOWN,
			selfClosing: false,
			ackSelfClosing: false,
			attrs: [],
			location: this.getCurrentLocation(2)
		};
	}
	_createCommentToken(offset) {
		this.currentToken = {
			type: TokenType.COMMENT,
			data: "",
			location: this.getCurrentLocation(offset)
		};
	}
	_createDoctypeToken(initialName) {
		this.currentToken = {
			type: TokenType.DOCTYPE,
			name: initialName,
			forceQuirks: false,
			publicId: null,
			systemId: null,
			location: this.currentLocation
		};
	}
	_createCharacterToken(type, chars) {
		this.currentCharacterToken = {
			type,
			chars,
			location: this.currentLocation
		};
	}
	_createAttr(attrNameFirstCh) {
		this.currentAttr = {
			name: attrNameFirstCh,
			value: ""
		};
		this.currentLocation = this.getCurrentLocation(0);
	}
	_leaveAttrName() {
		var _a;
		var _b;
		const token = this.currentToken;
		if (getTokenAttr(token, this.currentAttr.name) === null) {
			token.attrs.push(this.currentAttr);
			if (token.location && this.currentLocation) {
				const attrLocations = (_a = (_b = token.location).attrs) !== null && _a !== void 0 ? _a : _b.attrs = Object.create(null);
				attrLocations[this.currentAttr.name] = this.currentLocation;
				this._leaveAttrValue();
			}
		} else this._err(ERR.duplicateAttribute);
	}
	_leaveAttrValue() {
		if (this.currentLocation) {
			this.currentLocation.endLine = this.preprocessor.line;
			this.currentLocation.endCol = this.preprocessor.col;
			this.currentLocation.endOffset = this.preprocessor.offset;
		}
	}
	prepareToken(ct) {
		this._emitCurrentCharacterToken(ct.location);
		this.currentToken = null;
		if (ct.location) {
			ct.location.endLine = this.preprocessor.line;
			ct.location.endCol = this.preprocessor.col + 1;
			ct.location.endOffset = this.preprocessor.offset + 1;
		}
		this.currentLocation = this.getCurrentLocation(-1);
	}
	emitCurrentTagToken() {
		const ct = this.currentToken;
		this.prepareToken(ct);
		ct.tagID = getTagID(ct.tagName);
		if (ct.type === TokenType.START_TAG) {
			this.lastStartTagName = ct.tagName;
			this.handler.onStartTag(ct);
		} else {
			if (ct.attrs.length > 0) this._err(ERR.endTagWithAttributes);
			if (ct.selfClosing) this._err(ERR.endTagWithTrailingSolidus);
			this.handler.onEndTag(ct);
		}
		this.preprocessor.dropParsedChunk();
	}
	emitCurrentComment(ct) {
		this.prepareToken(ct);
		this.handler.onComment(ct);
		this.preprocessor.dropParsedChunk();
	}
	emitCurrentDoctype(ct) {
		this.prepareToken(ct);
		this.handler.onDoctype(ct);
		this.preprocessor.dropParsedChunk();
	}
	_emitCurrentCharacterToken(nextLocation) {
		if (this.currentCharacterToken) {
			if (nextLocation && this.currentCharacterToken.location) {
				this.currentCharacterToken.location.endLine = nextLocation.startLine;
				this.currentCharacterToken.location.endCol = nextLocation.startCol;
				this.currentCharacterToken.location.endOffset = nextLocation.startOffset;
			}
			switch (this.currentCharacterToken.type) {
				case TokenType.CHARACTER:
					this.handler.onCharacter(this.currentCharacterToken);
					break;
				case TokenType.NULL_CHARACTER:
					this.handler.onNullCharacter(this.currentCharacterToken);
					break;
				case TokenType.WHITESPACE_CHARACTER: this.handler.onWhitespaceCharacter(this.currentCharacterToken);
			}
			this.currentCharacterToken = null;
		}
	}
	_emitEOFToken() {
		const location = this.getCurrentLocation(0);
		if (location) {
			location.endLine = location.startLine;
			location.endCol = location.startCol;
			location.endOffset = location.startOffset;
		}
		this._emitCurrentCharacterToken(location);
		this.handler.onEof({
			type: TokenType.EOF,
			location
		});
		this.active = false;
	}
	_appendCharToCurrentCharacterToken(type, ch) {
		if (this.currentCharacterToken) if (this.currentCharacterToken.type === type) {
			this.currentCharacterToken.chars += ch;
			return;
		} else {
			this.currentLocation = this.getCurrentLocation(0);
			this._emitCurrentCharacterToken(this.currentLocation);
			this.preprocessor.dropParsedChunk();
		}
		this._createCharacterToken(type, ch);
	}
	_emitCodePoint(cp) {
		const type = isWhitespace(cp) ? TokenType.WHITESPACE_CHARACTER : cp === CODE_POINTS.NULL ? TokenType.NULL_CHARACTER : TokenType.CHARACTER;
		this._appendCharToCurrentCharacterToken(type, String.fromCodePoint(cp));
	}
	_emitChars(ch) {
		this._appendCharToCurrentCharacterToken(TokenType.CHARACTER, ch);
	}
	_startCharacterReference() {
		this.returnState = this.state;
		this.state = State.CHARACTER_REFERENCE;
		this.entityStartPos = this.preprocessor.pos;
		this.entityDecoder.startEntity(this._isCharacterReferenceInAttribute() ? DecodingMode.Attribute : DecodingMode.Legacy);
	}
	_isCharacterReferenceInAttribute() {
		return this.returnState === State.ATTRIBUTE_VALUE_DOUBLE_QUOTED || this.returnState === State.ATTRIBUTE_VALUE_SINGLE_QUOTED || this.returnState === State.ATTRIBUTE_VALUE_UNQUOTED;
	}
	_flushCodePointConsumedAsCharacterReference(cp) {
		if (this._isCharacterReferenceInAttribute()) this.currentAttr.value += String.fromCodePoint(cp);
		else this._emitCodePoint(cp);
	}
	_callState(cp) {
		switch (this.state) {
			case State.DATA:
				this._stateData(cp);
				break;
			case State.RCDATA:
				this._stateRcdata(cp);
				break;
			case State.RAWTEXT:
				this._stateRawtext(cp);
				break;
			case State.SCRIPT_DATA:
				this._stateScriptData(cp);
				break;
			case State.PLAINTEXT:
				this._statePlaintext(cp);
				break;
			case State.TAG_OPEN:
				this._stateTagOpen(cp);
				break;
			case State.END_TAG_OPEN:
				this._stateEndTagOpen(cp);
				break;
			case State.TAG_NAME:
				this._stateTagName(cp);
				break;
			case State.RCDATA_LESS_THAN_SIGN:
				this._stateRcdataLessThanSign(cp);
				break;
			case State.RCDATA_END_TAG_OPEN:
				this._stateRcdataEndTagOpen(cp);
				break;
			case State.RCDATA_END_TAG_NAME:
				this._stateRcdataEndTagName(cp);
				break;
			case State.RAWTEXT_LESS_THAN_SIGN:
				this._stateRawtextLessThanSign(cp);
				break;
			case State.RAWTEXT_END_TAG_OPEN:
				this._stateRawtextEndTagOpen(cp);
				break;
			case State.RAWTEXT_END_TAG_NAME:
				this._stateRawtextEndTagName(cp);
				break;
			case State.SCRIPT_DATA_LESS_THAN_SIGN:
				this._stateScriptDataLessThanSign(cp);
				break;
			case State.SCRIPT_DATA_END_TAG_OPEN:
				this._stateScriptDataEndTagOpen(cp);
				break;
			case State.SCRIPT_DATA_END_TAG_NAME:
				this._stateScriptDataEndTagName(cp);
				break;
			case State.SCRIPT_DATA_ESCAPE_START:
				this._stateScriptDataEscapeStart(cp);
				break;
			case State.SCRIPT_DATA_ESCAPE_START_DASH:
				this._stateScriptDataEscapeStartDash(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED:
				this._stateScriptDataEscaped(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED_DASH:
				this._stateScriptDataEscapedDash(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED_DASH_DASH:
				this._stateScriptDataEscapedDashDash(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN:
				this._stateScriptDataEscapedLessThanSign(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED_END_TAG_OPEN:
				this._stateScriptDataEscapedEndTagOpen(cp);
				break;
			case State.SCRIPT_DATA_ESCAPED_END_TAG_NAME:
				this._stateScriptDataEscapedEndTagName(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPE_START:
				this._stateScriptDataDoubleEscapeStart(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPED:
				this._stateScriptDataDoubleEscaped(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH:
				this._stateScriptDataDoubleEscapedDash(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH:
				this._stateScriptDataDoubleEscapedDashDash(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN:
				this._stateScriptDataDoubleEscapedLessThanSign(cp);
				break;
			case State.SCRIPT_DATA_DOUBLE_ESCAPE_END:
				this._stateScriptDataDoubleEscapeEnd(cp);
				break;
			case State.BEFORE_ATTRIBUTE_NAME:
				this._stateBeforeAttributeName(cp);
				break;
			case State.ATTRIBUTE_NAME:
				this._stateAttributeName(cp);
				break;
			case State.AFTER_ATTRIBUTE_NAME:
				this._stateAfterAttributeName(cp);
				break;
			case State.BEFORE_ATTRIBUTE_VALUE:
				this._stateBeforeAttributeValue(cp);
				break;
			case State.ATTRIBUTE_VALUE_DOUBLE_QUOTED:
				this._stateAttributeValueDoubleQuoted(cp);
				break;
			case State.ATTRIBUTE_VALUE_SINGLE_QUOTED:
				this._stateAttributeValueSingleQuoted(cp);
				break;
			case State.ATTRIBUTE_VALUE_UNQUOTED:
				this._stateAttributeValueUnquoted(cp);
				break;
			case State.AFTER_ATTRIBUTE_VALUE_QUOTED:
				this._stateAfterAttributeValueQuoted(cp);
				break;
			case State.SELF_CLOSING_START_TAG:
				this._stateSelfClosingStartTag(cp);
				break;
			case State.BOGUS_COMMENT:
				this._stateBogusComment(cp);
				break;
			case State.MARKUP_DECLARATION_OPEN:
				this._stateMarkupDeclarationOpen(cp);
				break;
			case State.COMMENT_START:
				this._stateCommentStart(cp);
				break;
			case State.COMMENT_START_DASH:
				this._stateCommentStartDash(cp);
				break;
			case State.COMMENT:
				this._stateComment(cp);
				break;
			case State.COMMENT_LESS_THAN_SIGN:
				this._stateCommentLessThanSign(cp);
				break;
			case State.COMMENT_LESS_THAN_SIGN_BANG:
				this._stateCommentLessThanSignBang(cp);
				break;
			case State.COMMENT_LESS_THAN_SIGN_BANG_DASH:
				this._stateCommentLessThanSignBangDash(cp);
				break;
			case State.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH:
				this._stateCommentLessThanSignBangDashDash(cp);
				break;
			case State.COMMENT_END_DASH:
				this._stateCommentEndDash(cp);
				break;
			case State.COMMENT_END:
				this._stateCommentEnd(cp);
				break;
			case State.COMMENT_END_BANG:
				this._stateCommentEndBang(cp);
				break;
			case State.DOCTYPE:
				this._stateDoctype(cp);
				break;
			case State.BEFORE_DOCTYPE_NAME:
				this._stateBeforeDoctypeName(cp);
				break;
			case State.DOCTYPE_NAME:
				this._stateDoctypeName(cp);
				break;
			case State.AFTER_DOCTYPE_NAME:
				this._stateAfterDoctypeName(cp);
				break;
			case State.AFTER_DOCTYPE_PUBLIC_KEYWORD:
				this._stateAfterDoctypePublicKeyword(cp);
				break;
			case State.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER:
				this._stateBeforeDoctypePublicIdentifier(cp);
				break;
			case State.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED:
				this._stateDoctypePublicIdentifierDoubleQuoted(cp);
				break;
			case State.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED:
				this._stateDoctypePublicIdentifierSingleQuoted(cp);
				break;
			case State.AFTER_DOCTYPE_PUBLIC_IDENTIFIER:
				this._stateAfterDoctypePublicIdentifier(cp);
				break;
			case State.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS:
				this._stateBetweenDoctypePublicAndSystemIdentifiers(cp);
				break;
			case State.AFTER_DOCTYPE_SYSTEM_KEYWORD:
				this._stateAfterDoctypeSystemKeyword(cp);
				break;
			case State.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER:
				this._stateBeforeDoctypeSystemIdentifier(cp);
				break;
			case State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED:
				this._stateDoctypeSystemIdentifierDoubleQuoted(cp);
				break;
			case State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED:
				this._stateDoctypeSystemIdentifierSingleQuoted(cp);
				break;
			case State.AFTER_DOCTYPE_SYSTEM_IDENTIFIER:
				this._stateAfterDoctypeSystemIdentifier(cp);
				break;
			case State.BOGUS_DOCTYPE:
				this._stateBogusDoctype(cp);
				break;
			case State.CDATA_SECTION:
				this._stateCdataSection(cp);
				break;
			case State.CDATA_SECTION_BRACKET:
				this._stateCdataSectionBracket(cp);
				break;
			case State.CDATA_SECTION_END:
				this._stateCdataSectionEnd(cp);
				break;
			case State.CHARACTER_REFERENCE:
				this._stateCharacterReference();
				break;
			case State.AMBIGUOUS_AMPERSAND:
				this._stateAmbiguousAmpersand(cp);
				break;
			default: throw new Error("Unknown state");
		}
	}
	_stateData(cp) {
		switch (cp) {
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.TAG_OPEN;
				break;
			case CODE_POINTS.AMPERSAND:
				this._startCharacterReference();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitCodePoint(cp);
				break;
			case CODE_POINTS.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateRcdata(cp) {
		switch (cp) {
			case CODE_POINTS.AMPERSAND:
				this._startCharacterReference();
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.RCDATA_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateRawtext(cp) {
		switch (cp) {
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.RAWTEXT_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateScriptData(cp) {
		switch (cp) {
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_statePlaintext(cp) {
		switch (cp) {
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this._createStartTagToken();
			this.state = State.TAG_NAME;
			this._stateTagName(cp);
		} else switch (cp) {
			case CODE_POINTS.EXCLAMATION_MARK:
				this.state = State.MARKUP_DECLARATION_OPEN;
				break;
			case CODE_POINTS.SOLIDUS:
				this.state = State.END_TAG_OPEN;
				break;
			case CODE_POINTS.QUESTION_MARK:
				this._err(ERR.unexpectedQuestionMarkInsteadOfTagName);
				this._createCommentToken(1);
				this.state = State.BOGUS_COMMENT;
				this._stateBogusComment(cp);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofBeforeTagName);
				this._emitChars("<");
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.invalidFirstCharacterOfTagName);
				this._emitChars("<");
				this.state = State.DATA;
				this._stateData(cp);
		}
	}
	_stateEndTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this._createEndTagToken();
			this.state = State.TAG_NAME;
			this._stateTagName(cp);
		} else switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingEndTagName);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofBeforeTagName);
				this._emitChars("</");
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.invalidFirstCharacterOfTagName);
				this._createCommentToken(2);
				this.state = State.BOGUS_COMMENT;
				this._stateBogusComment(cp);
		}
	}
	_stateTagName(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				break;
			case CODE_POINTS.SOLIDUS:
				this.state = State.SELF_CLOSING_START_TAG;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.tagName += "�";
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default: token.tagName += String.fromCodePoint(isAsciiUpper(cp) ? toAsciiLower(cp) : cp);
		}
	}
	_stateRcdataLessThanSign(cp) {
		if (cp === CODE_POINTS.SOLIDUS) this.state = State.RCDATA_END_TAG_OPEN;
		else {
			this._emitChars("<");
			this.state = State.RCDATA;
			this._stateRcdata(cp);
		}
	}
	_stateRcdataEndTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this.state = State.RCDATA_END_TAG_NAME;
			this._stateRcdataEndTagName(cp);
		} else {
			this._emitChars("</");
			this.state = State.RCDATA;
			this._stateRcdata(cp);
		}
	}
	handleSpecialEndTag(_cp) {
		if (!this.preprocessor.startsWith(this.lastStartTagName, false)) return !this._ensureHibernation();
		this._createEndTagToken();
		const token = this.currentToken;
		token.tagName = this.lastStartTagName;
		switch (this.preprocessor.peek(this.lastStartTagName.length)) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this._advanceBy(this.lastStartTagName.length);
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				return false;
			case CODE_POINTS.SOLIDUS:
				this._advanceBy(this.lastStartTagName.length);
				this.state = State.SELF_CLOSING_START_TAG;
				return false;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._advanceBy(this.lastStartTagName.length);
				this.emitCurrentTagToken();
				this.state = State.DATA;
				return false;
			default: return !this._ensureHibernation();
		}
	}
	_stateRcdataEndTagName(cp) {
		if (this.handleSpecialEndTag(cp)) {
			this._emitChars("</");
			this.state = State.RCDATA;
			this._stateRcdata(cp);
		}
	}
	_stateRawtextLessThanSign(cp) {
		if (cp === CODE_POINTS.SOLIDUS) this.state = State.RAWTEXT_END_TAG_OPEN;
		else {
			this._emitChars("<");
			this.state = State.RAWTEXT;
			this._stateRawtext(cp);
		}
	}
	_stateRawtextEndTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this.state = State.RAWTEXT_END_TAG_NAME;
			this._stateRawtextEndTagName(cp);
		} else {
			this._emitChars("</");
			this.state = State.RAWTEXT;
			this._stateRawtext(cp);
		}
	}
	_stateRawtextEndTagName(cp) {
		if (this.handleSpecialEndTag(cp)) {
			this._emitChars("</");
			this.state = State.RAWTEXT;
			this._stateRawtext(cp);
		}
	}
	_stateScriptDataLessThanSign(cp) {
		switch (cp) {
			case CODE_POINTS.SOLIDUS:
				this.state = State.SCRIPT_DATA_END_TAG_OPEN;
				break;
			case CODE_POINTS.EXCLAMATION_MARK:
				this.state = State.SCRIPT_DATA_ESCAPE_START;
				this._emitChars("<!");
				break;
			default:
				this._emitChars("<");
				this.state = State.SCRIPT_DATA;
				this._stateScriptData(cp);
		}
	}
	_stateScriptDataEndTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this.state = State.SCRIPT_DATA_END_TAG_NAME;
			this._stateScriptDataEndTagName(cp);
		} else {
			this._emitChars("</");
			this.state = State.SCRIPT_DATA;
			this._stateScriptData(cp);
		}
	}
	_stateScriptDataEndTagName(cp) {
		if (this.handleSpecialEndTag(cp)) {
			this._emitChars("</");
			this.state = State.SCRIPT_DATA;
			this._stateScriptData(cp);
		}
	}
	_stateScriptDataEscapeStart(cp) {
		if (cp === CODE_POINTS.HYPHEN_MINUS) {
			this.state = State.SCRIPT_DATA_ESCAPE_START_DASH;
			this._emitChars("-");
		} else {
			this.state = State.SCRIPT_DATA;
			this._stateScriptData(cp);
		}
	}
	_stateScriptDataEscapeStartDash(cp) {
		if (cp === CODE_POINTS.HYPHEN_MINUS) {
			this.state = State.SCRIPT_DATA_ESCAPED_DASH_DASH;
			this._emitChars("-");
		} else {
			this.state = State.SCRIPT_DATA;
			this._stateScriptData(cp);
		}
	}
	_stateScriptDataEscaped(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.SCRIPT_DATA_ESCAPED_DASH;
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateScriptDataEscapedDash(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.SCRIPT_DATA_ESCAPED_DASH_DASH;
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.state = State.SCRIPT_DATA_ESCAPED;
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default:
				this.state = State.SCRIPT_DATA_ESCAPED;
				this._emitCodePoint(cp);
		}
	}
	_stateScriptDataEscapedDashDash(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.SCRIPT_DATA;
				this._emitChars(">");
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.state = State.SCRIPT_DATA_ESCAPED;
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default:
				this.state = State.SCRIPT_DATA_ESCAPED;
				this._emitCodePoint(cp);
		}
	}
	_stateScriptDataEscapedLessThanSign(cp) {
		if (cp === CODE_POINTS.SOLIDUS) this.state = State.SCRIPT_DATA_ESCAPED_END_TAG_OPEN;
		else if (isAsciiLetter(cp)) {
			this._emitChars("<");
			this.state = State.SCRIPT_DATA_DOUBLE_ESCAPE_START;
			this._stateScriptDataDoubleEscapeStart(cp);
		} else {
			this._emitChars("<");
			this.state = State.SCRIPT_DATA_ESCAPED;
			this._stateScriptDataEscaped(cp);
		}
	}
	_stateScriptDataEscapedEndTagOpen(cp) {
		if (isAsciiLetter(cp)) {
			this.state = State.SCRIPT_DATA_ESCAPED_END_TAG_NAME;
			this._stateScriptDataEscapedEndTagName(cp);
		} else {
			this._emitChars("</");
			this.state = State.SCRIPT_DATA_ESCAPED;
			this._stateScriptDataEscaped(cp);
		}
	}
	_stateScriptDataEscapedEndTagName(cp) {
		if (this.handleSpecialEndTag(cp)) {
			this._emitChars("</");
			this.state = State.SCRIPT_DATA_ESCAPED;
			this._stateScriptDataEscaped(cp);
		}
	}
	_stateScriptDataDoubleEscapeStart(cp) {
		if (this.preprocessor.startsWith(SEQUENCES.SCRIPT, false) && isScriptDataDoubleEscapeSequenceEnd(this.preprocessor.peek(SEQUENCES.SCRIPT.length))) {
			this._emitCodePoint(cp);
			for (let i = 0; i < SEQUENCES.SCRIPT.length; i++) this._emitCodePoint(this._consume());
			this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
		} else if (!this._ensureHibernation()) {
			this.state = State.SCRIPT_DATA_ESCAPED;
			this._stateScriptDataEscaped(cp);
		}
	}
	_stateScriptDataDoubleEscaped(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH;
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;
				this._emitChars("<");
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateScriptDataDoubleEscapedDash(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH;
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;
				this._emitChars("<");
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
				this._emitCodePoint(cp);
		}
	}
	_stateScriptDataDoubleEscapedDashDash(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this._emitChars("-");
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;
				this._emitChars("<");
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.SCRIPT_DATA;
				this._emitChars(">");
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
				this._emitChars("�");
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInScriptHtmlCommentLikeText);
				this._emitEOFToken();
				break;
			default:
				this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
				this._emitCodePoint(cp);
		}
	}
	_stateScriptDataDoubleEscapedLessThanSign(cp) {
		if (cp === CODE_POINTS.SOLIDUS) {
			this.state = State.SCRIPT_DATA_DOUBLE_ESCAPE_END;
			this._emitChars("/");
		} else {
			this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
			this._stateScriptDataDoubleEscaped(cp);
		}
	}
	_stateScriptDataDoubleEscapeEnd(cp) {
		if (this.preprocessor.startsWith(SEQUENCES.SCRIPT, false) && isScriptDataDoubleEscapeSequenceEnd(this.preprocessor.peek(SEQUENCES.SCRIPT.length))) {
			this._emitCodePoint(cp);
			for (let i = 0; i < SEQUENCES.SCRIPT.length; i++) this._emitCodePoint(this._consume());
			this.state = State.SCRIPT_DATA_ESCAPED;
		} else if (!this._ensureHibernation()) {
			this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
			this._stateScriptDataDoubleEscaped(cp);
		}
	}
	_stateBeforeAttributeName(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.SOLIDUS:
			case CODE_POINTS.GREATER_THAN_SIGN:
			case CODE_POINTS.EOF:
				this.state = State.AFTER_ATTRIBUTE_NAME;
				this._stateAfterAttributeName(cp);
				break;
			case CODE_POINTS.EQUALS_SIGN:
				this._err(ERR.unexpectedEqualsSignBeforeAttributeName);
				this._createAttr("=");
				this.state = State.ATTRIBUTE_NAME;
				break;
			default:
				this._createAttr("");
				this.state = State.ATTRIBUTE_NAME;
				this._stateAttributeName(cp);
		}
	}
	_stateAttributeName(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
			case CODE_POINTS.SOLIDUS:
			case CODE_POINTS.GREATER_THAN_SIGN:
			case CODE_POINTS.EOF:
				this._leaveAttrName();
				this.state = State.AFTER_ATTRIBUTE_NAME;
				this._stateAfterAttributeName(cp);
				break;
			case CODE_POINTS.EQUALS_SIGN:
				this._leaveAttrName();
				this.state = State.BEFORE_ATTRIBUTE_VALUE;
				break;
			case CODE_POINTS.QUOTATION_MARK:
			case CODE_POINTS.APOSTROPHE:
			case CODE_POINTS.LESS_THAN_SIGN:
				this._err(ERR.unexpectedCharacterInAttributeName);
				this.currentAttr.name += String.fromCodePoint(cp);
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.currentAttr.name += "�";
				break;
			default: this.currentAttr.name += String.fromCodePoint(isAsciiUpper(cp) ? toAsciiLower(cp) : cp);
		}
	}
	_stateAfterAttributeName(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.SOLIDUS:
				this.state = State.SELF_CLOSING_START_TAG;
				break;
			case CODE_POINTS.EQUALS_SIGN:
				this.state = State.BEFORE_ATTRIBUTE_VALUE;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default:
				this._createAttr("");
				this.state = State.ATTRIBUTE_NAME;
				this._stateAttributeName(cp);
		}
	}
	_stateBeforeAttributeValue(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.QUOTATION_MARK:
				this.state = State.ATTRIBUTE_VALUE_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				this.state = State.ATTRIBUTE_VALUE_SINGLE_QUOTED;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingAttributeValue);
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			default:
				this.state = State.ATTRIBUTE_VALUE_UNQUOTED;
				this._stateAttributeValueUnquoted(cp);
		}
	}
	_stateAttributeValueDoubleQuoted(cp) {
		switch (cp) {
			case CODE_POINTS.QUOTATION_MARK:
				this.state = State.AFTER_ATTRIBUTE_VALUE_QUOTED;
				break;
			case CODE_POINTS.AMPERSAND:
				this._startCharacterReference();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.currentAttr.value += "�";
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default: this.currentAttr.value += String.fromCodePoint(cp);
		}
	}
	_stateAttributeValueSingleQuoted(cp) {
		switch (cp) {
			case CODE_POINTS.APOSTROPHE:
				this.state = State.AFTER_ATTRIBUTE_VALUE_QUOTED;
				break;
			case CODE_POINTS.AMPERSAND:
				this._startCharacterReference();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.currentAttr.value += "�";
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default: this.currentAttr.value += String.fromCodePoint(cp);
		}
	}
	_stateAttributeValueUnquoted(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this._leaveAttrValue();
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				break;
			case CODE_POINTS.AMPERSAND:
				this._startCharacterReference();
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._leaveAttrValue();
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this.currentAttr.value += "�";
				break;
			case CODE_POINTS.QUOTATION_MARK:
			case CODE_POINTS.APOSTROPHE:
			case CODE_POINTS.LESS_THAN_SIGN:
			case CODE_POINTS.EQUALS_SIGN:
			case CODE_POINTS.GRAVE_ACCENT:
				this._err(ERR.unexpectedCharacterInUnquotedAttributeValue);
				this.currentAttr.value += String.fromCodePoint(cp);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default: this.currentAttr.value += String.fromCodePoint(cp);
		}
	}
	_stateAfterAttributeValueQuoted(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this._leaveAttrValue();
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				break;
			case CODE_POINTS.SOLIDUS:
				this._leaveAttrValue();
				this.state = State.SELF_CLOSING_START_TAG;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._leaveAttrValue();
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingWhitespaceBetweenAttributes);
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				this._stateBeforeAttributeName(cp);
		}
	}
	_stateSelfClosingStartTag(cp) {
		switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN: {
				const token = this.currentToken;
				token.selfClosing = true;
				this.state = State.DATA;
				this.emitCurrentTagToken();
				break;
			}
			case CODE_POINTS.EOF:
				this._err(ERR.eofInTag);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.unexpectedSolidusInTag);
				this.state = State.BEFORE_ATTRIBUTE_NAME;
				this._stateBeforeAttributeName(cp);
		}
	}
	_stateBogusComment(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentComment(token);
				break;
			case CODE_POINTS.EOF:
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.data += "�";
				break;
			default: token.data += String.fromCodePoint(cp);
		}
	}
	_stateMarkupDeclarationOpen(cp) {
		if (this._consumeSequenceIfMatch(SEQUENCES.DASH_DASH, true)) {
			this._createCommentToken(SEQUENCES.DASH_DASH.length + 1);
			this.state = State.COMMENT_START;
		} else if (this._consumeSequenceIfMatch(SEQUENCES.DOCTYPE, false)) {
			this.currentLocation = this.getCurrentLocation(SEQUENCES.DOCTYPE.length + 1);
			this.state = State.DOCTYPE;
		} else if (this._consumeSequenceIfMatch(SEQUENCES.CDATA_START, true)) if (this.inForeignNode) this.state = State.CDATA_SECTION;
		else {
			this._err(ERR.cdataInHtmlContent);
			this._createCommentToken(SEQUENCES.CDATA_START.length + 1);
			this.currentToken.data = "[CDATA[";
			this.state = State.BOGUS_COMMENT;
		}
		else if (!this._ensureHibernation()) {
			this._err(ERR.incorrectlyOpenedComment);
			this._createCommentToken(2);
			this.state = State.BOGUS_COMMENT;
			this._stateBogusComment(cp);
		}
	}
	_stateCommentStart(cp) {
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.COMMENT_START_DASH;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN: {
				this._err(ERR.abruptClosingOfEmptyComment);
				this.state = State.DATA;
				const token = this.currentToken;
				this.emitCurrentComment(token);
				break;
			}
			default:
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateCommentStartDash(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.COMMENT_END;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.abruptClosingOfEmptyComment);
				this.state = State.DATA;
				this.emitCurrentComment(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInComment);
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			default:
				token.data += "-";
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateComment(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.COMMENT_END_DASH;
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				token.data += "<";
				this.state = State.COMMENT_LESS_THAN_SIGN;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.data += "�";
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInComment);
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			default: token.data += String.fromCodePoint(cp);
		}
	}
	_stateCommentLessThanSign(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.EXCLAMATION_MARK:
				token.data += "!";
				this.state = State.COMMENT_LESS_THAN_SIGN_BANG;
				break;
			case CODE_POINTS.LESS_THAN_SIGN:
				token.data += "<";
				break;
			default:
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateCommentLessThanSignBang(cp) {
		if (cp === CODE_POINTS.HYPHEN_MINUS) this.state = State.COMMENT_LESS_THAN_SIGN_BANG_DASH;
		else {
			this.state = State.COMMENT;
			this._stateComment(cp);
		}
	}
	_stateCommentLessThanSignBangDash(cp) {
		if (cp === CODE_POINTS.HYPHEN_MINUS) this.state = State.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH;
		else {
			this.state = State.COMMENT_END_DASH;
			this._stateCommentEndDash(cp);
		}
	}
	_stateCommentLessThanSignBangDashDash(cp) {
		if (cp !== CODE_POINTS.GREATER_THAN_SIGN && cp !== CODE_POINTS.EOF) this._err(ERR.nestedComment);
		this.state = State.COMMENT_END;
		this._stateCommentEnd(cp);
	}
	_stateCommentEndDash(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				this.state = State.COMMENT_END;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInComment);
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			default:
				token.data += "-";
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateCommentEnd(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentComment(token);
				break;
			case CODE_POINTS.EXCLAMATION_MARK:
				this.state = State.COMMENT_END_BANG;
				break;
			case CODE_POINTS.HYPHEN_MINUS:
				token.data += "-";
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInComment);
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			default:
				token.data += "--";
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateCommentEndBang(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.HYPHEN_MINUS:
				token.data += "--!";
				this.state = State.COMMENT_END_DASH;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.incorrectlyClosedComment);
				this.state = State.DATA;
				this.emitCurrentComment(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInComment);
				this.emitCurrentComment(token);
				this._emitEOFToken();
				break;
			default:
				token.data += "--!";
				this.state = State.COMMENT;
				this._stateComment(cp);
		}
	}
	_stateDoctype(cp) {
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.BEFORE_DOCTYPE_NAME;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.BEFORE_DOCTYPE_NAME;
				this._stateBeforeDoctypeName(cp);
				break;
			case CODE_POINTS.EOF: {
				this._err(ERR.eofInDoctype);
				this._createDoctypeToken(null);
				const token = this.currentToken;
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			}
			default:
				this._err(ERR.missingWhitespaceBeforeDoctypeName);
				this.state = State.BEFORE_DOCTYPE_NAME;
				this._stateBeforeDoctypeName(cp);
		}
	}
	_stateBeforeDoctypeName(cp) {
		if (isAsciiUpper(cp)) {
			this._createDoctypeToken(String.fromCharCode(toAsciiLower(cp)));
			this.state = State.DOCTYPE_NAME;
		} else switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				this._createDoctypeToken("�");
				this.state = State.DOCTYPE_NAME;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN: {
				this._err(ERR.missingDoctypeName);
				this._createDoctypeToken(null);
				const token = this.currentToken;
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			}
			case CODE_POINTS.EOF: {
				this._err(ERR.eofInDoctype);
				this._createDoctypeToken(null);
				const token = this.currentToken;
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			}
			default:
				this._createDoctypeToken(String.fromCodePoint(cp));
				this.state = State.DOCTYPE_NAME;
		}
	}
	_stateDoctypeName(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.AFTER_DOCTYPE_NAME;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.name += "�";
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: token.name += String.fromCodePoint(isAsciiUpper(cp) ? toAsciiLower(cp) : cp);
		}
	}
	_stateAfterDoctypeName(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: if (this._consumeSequenceIfMatch(SEQUENCES.PUBLIC, false)) this.state = State.AFTER_DOCTYPE_PUBLIC_KEYWORD;
			else if (this._consumeSequenceIfMatch(SEQUENCES.SYSTEM, false)) this.state = State.AFTER_DOCTYPE_SYSTEM_KEYWORD;
			else if (!this._ensureHibernation()) {
				this._err(ERR.invalidCharacterSequenceAfterDoctypeName);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
			}
		}
	}
	_stateAfterDoctypePublicKeyword(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER;
				break;
			case CODE_POINTS.QUOTATION_MARK:
				this._err(ERR.missingWhitespaceAfterDoctypePublicKeyword);
				token.publicId = "";
				this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				this._err(ERR.missingWhitespaceAfterDoctypePublicKeyword);
				token.publicId = "";
				this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateBeforeDoctypePublicIdentifier(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.QUOTATION_MARK:
				token.publicId = "";
				this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				token.publicId = "";
				this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateDoctypePublicIdentifierDoubleQuoted(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.QUOTATION_MARK:
				this.state = State.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.publicId += "�";
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.abruptDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: token.publicId += String.fromCodePoint(cp);
		}
	}
	_stateDoctypePublicIdentifierSingleQuoted(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.APOSTROPHE:
				this.state = State.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.publicId += "�";
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.abruptDoctypePublicIdentifier);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: token.publicId += String.fromCodePoint(cp);
		}
	}
	_stateAfterDoctypePublicIdentifier(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.QUOTATION_MARK:
				this._err(ERR.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers);
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				this._err(ERR.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers);
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateBetweenDoctypePublicAndSystemIdentifiers(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.QUOTATION_MARK:
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateAfterDoctypeSystemKeyword(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED:
				this.state = State.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER;
				break;
			case CODE_POINTS.QUOTATION_MARK:
				this._err(ERR.missingWhitespaceAfterDoctypeSystemKeyword);
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				this._err(ERR.missingWhitespaceAfterDoctypeSystemKeyword);
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateBeforeDoctypeSystemIdentifier(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.QUOTATION_MARK:
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
				break;
			case CODE_POINTS.APOSTROPHE:
				token.systemId = "";
				this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.missingDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.DATA;
				this.emitCurrentDoctype(token);
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateDoctypeSystemIdentifierDoubleQuoted(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.QUOTATION_MARK:
				this.state = State.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.systemId += "�";
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.abruptDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: token.systemId += String.fromCodePoint(cp);
		}
	}
	_stateDoctypeSystemIdentifierSingleQuoted(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.APOSTROPHE:
				this.state = State.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				token.systemId += "�";
				break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this._err(ERR.abruptDoctypeSystemIdentifier);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default: token.systemId += String.fromCodePoint(cp);
		}
	}
	_stateAfterDoctypeSystemIdentifier(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.SPACE:
			case CODE_POINTS.LINE_FEED:
			case CODE_POINTS.TABULATION:
			case CODE_POINTS.FORM_FEED: break;
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInDoctype);
				token.forceQuirks = true;
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
				break;
			default:
				this._err(ERR.unexpectedCharacterAfterDoctypeSystemIdentifier);
				this.state = State.BOGUS_DOCTYPE;
				this._stateBogusDoctype(cp);
		}
	}
	_stateBogusDoctype(cp) {
		const token = this.currentToken;
		switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.emitCurrentDoctype(token);
				this.state = State.DATA;
				break;
			case CODE_POINTS.NULL:
				this._err(ERR.unexpectedNullCharacter);
				break;
			case CODE_POINTS.EOF:
				this.emitCurrentDoctype(token);
				this._emitEOFToken();
		}
	}
	_stateCdataSection(cp) {
		switch (cp) {
			case CODE_POINTS.RIGHT_SQUARE_BRACKET:
				this.state = State.CDATA_SECTION_BRACKET;
				break;
			case CODE_POINTS.EOF:
				this._err(ERR.eofInCdata);
				this._emitEOFToken();
				break;
			default: this._emitCodePoint(cp);
		}
	}
	_stateCdataSectionBracket(cp) {
		if (cp === CODE_POINTS.RIGHT_SQUARE_BRACKET) this.state = State.CDATA_SECTION_END;
		else {
			this._emitChars("]");
			this.state = State.CDATA_SECTION;
			this._stateCdataSection(cp);
		}
	}
	_stateCdataSectionEnd(cp) {
		switch (cp) {
			case CODE_POINTS.GREATER_THAN_SIGN:
				this.state = State.DATA;
				break;
			case CODE_POINTS.RIGHT_SQUARE_BRACKET:
				this._emitChars("]");
				break;
			default:
				this._emitChars("]]");
				this.state = State.CDATA_SECTION;
				this._stateCdataSection(cp);
		}
	}
	_stateCharacterReference() {
		let length = this.entityDecoder.write(this.preprocessor.html, this.preprocessor.pos);
		if (length < 0) if (this.preprocessor.lastChunkWritten) length = this.entityDecoder.end();
		else {
			this.active = false;
			this.preprocessor.pos = this.preprocessor.html.length - 1;
			this.consumedAfterSnapshot = 0;
			this.preprocessor.endOfChunkHit = true;
			return;
		}
		if (length === 0) {
			this.preprocessor.pos = this.entityStartPos;
			this._flushCodePointConsumedAsCharacterReference(CODE_POINTS.AMPERSAND);
			this.state = !this._isCharacterReferenceInAttribute() && isAsciiAlphaNumeric(this.preprocessor.peek(1)) ? State.AMBIGUOUS_AMPERSAND : this.returnState;
		} else this.state = this.returnState;
	}
	_stateAmbiguousAmpersand(cp) {
		if (isAsciiAlphaNumeric(cp)) this._flushCodePointConsumedAsCharacterReference(cp);
		else {
			if (cp === CODE_POINTS.SEMICOLON) this._err(ERR.unknownNamedCharacterReference);
			this.state = this.returnState;
			this._callState(cp);
		}
	}
};
//#endregion
//#region node_modules/parse5/dist/parser/open-element-stack.js
var IMPLICIT_END_TAG_REQUIRED = /* @__PURE__ */ new Set([
	TAG_ID.DD,
	TAG_ID.DT,
	TAG_ID.LI,
	TAG_ID.OPTGROUP,
	TAG_ID.OPTION,
	TAG_ID.P,
	TAG_ID.RB,
	TAG_ID.RP,
	TAG_ID.RT,
	TAG_ID.RTC
]);
var IMPLICIT_END_TAG_REQUIRED_THOROUGHLY = /* @__PURE__ */ new Set([
	...IMPLICIT_END_TAG_REQUIRED,
	TAG_ID.CAPTION,
	TAG_ID.COLGROUP,
	TAG_ID.TBODY,
	TAG_ID.TD,
	TAG_ID.TFOOT,
	TAG_ID.TH,
	TAG_ID.THEAD,
	TAG_ID.TR
]);
var SCOPING_ELEMENTS_HTML = /* @__PURE__ */ new Set([
	TAG_ID.APPLET,
	TAG_ID.CAPTION,
	TAG_ID.HTML,
	TAG_ID.MARQUEE,
	TAG_ID.OBJECT,
	TAG_ID.TABLE,
	TAG_ID.TD,
	TAG_ID.TEMPLATE,
	TAG_ID.TH
]);
var SCOPING_ELEMENTS_HTML_LIST = /* @__PURE__ */ new Set([
	...SCOPING_ELEMENTS_HTML,
	TAG_ID.OL,
	TAG_ID.UL
]);
var SCOPING_ELEMENTS_HTML_BUTTON = /* @__PURE__ */ new Set([...SCOPING_ELEMENTS_HTML, TAG_ID.BUTTON]);
var SCOPING_ELEMENTS_MATHML = /* @__PURE__ */ new Set([
	TAG_ID.ANNOTATION_XML,
	TAG_ID.MI,
	TAG_ID.MN,
	TAG_ID.MO,
	TAG_ID.MS,
	TAG_ID.MTEXT
]);
var SCOPING_ELEMENTS_SVG = /* @__PURE__ */ new Set([
	TAG_ID.DESC,
	TAG_ID.FOREIGN_OBJECT,
	TAG_ID.TITLE
]);
var TABLE_ROW_CONTEXT = /* @__PURE__ */ new Set([
	TAG_ID.TR,
	TAG_ID.TEMPLATE,
	TAG_ID.HTML
]);
var TABLE_BODY_CONTEXT = /* @__PURE__ */ new Set([
	TAG_ID.TBODY,
	TAG_ID.TFOOT,
	TAG_ID.THEAD,
	TAG_ID.TEMPLATE,
	TAG_ID.HTML
]);
var TABLE_CONTEXT = /* @__PURE__ */ new Set([
	TAG_ID.TABLE,
	TAG_ID.TEMPLATE,
	TAG_ID.HTML
]);
var TABLE_CELLS = /* @__PURE__ */ new Set([TAG_ID.TD, TAG_ID.TH]);
var OpenElementStack = class {
	get currentTmplContentOrNode() {
		return this._isInTemplate() ? this.treeAdapter.getTemplateContent(this.current) : this.current;
	}
	constructor(document, treeAdapter, handler) {
		this.treeAdapter = treeAdapter;
		this.handler = handler;
		this.items = [];
		this.tagIDs = [];
		this.stackTop = -1;
		this.tmplCount = 0;
		this.currentTagId = TAG_ID.UNKNOWN;
		this.current = document;
	}
	_indexOf(element) {
		return this.items.lastIndexOf(element, this.stackTop);
	}
	_isInTemplate() {
		return this.currentTagId === TAG_ID.TEMPLATE && this.treeAdapter.getNamespaceURI(this.current) === NS.HTML;
	}
	_updateCurrentElement() {
		this.current = this.items[this.stackTop];
		this.currentTagId = this.tagIDs[this.stackTop];
	}
	push(element, tagID) {
		this.stackTop++;
		this.items[this.stackTop] = element;
		this.current = element;
		this.tagIDs[this.stackTop] = tagID;
		this.currentTagId = tagID;
		if (this._isInTemplate()) this.tmplCount++;
		this.handler.onItemPush(element, tagID, true);
	}
	pop() {
		const popped = this.current;
		if (this.tmplCount > 0 && this._isInTemplate()) this.tmplCount--;
		this.stackTop--;
		this._updateCurrentElement();
		this.handler.onItemPop(popped, true);
	}
	replace(oldElement, newElement) {
		const idx = this._indexOf(oldElement);
		this.items[idx] = newElement;
		if (idx === this.stackTop) this.current = newElement;
	}
	insertAfter(referenceElement, newElement, newElementID) {
		const insertionIdx = this._indexOf(referenceElement) + 1;
		this.items.splice(insertionIdx, 0, newElement);
		this.tagIDs.splice(insertionIdx, 0, newElementID);
		this.stackTop++;
		if (insertionIdx === this.stackTop) this._updateCurrentElement();
		if (this.current && this.currentTagId !== void 0) this.handler.onItemPush(this.current, this.currentTagId, insertionIdx === this.stackTop);
	}
	popUntilTagNamePopped(tagName) {
		let targetIdx = this.stackTop + 1;
		do
			targetIdx = this.tagIDs.lastIndexOf(tagName, targetIdx - 1);
		while (targetIdx > 0 && this.treeAdapter.getNamespaceURI(this.items[targetIdx]) !== NS.HTML);
		this.shortenToLength(Math.max(targetIdx, 0));
	}
	shortenToLength(idx) {
		while (this.stackTop >= idx) {
			const popped = this.current;
			if (this.tmplCount > 0 && this._isInTemplate()) this.tmplCount -= 1;
			this.stackTop--;
			this._updateCurrentElement();
			this.handler.onItemPop(popped, this.stackTop < idx);
		}
	}
	popUntilElementPopped(element) {
		const idx = this._indexOf(element);
		this.shortenToLength(Math.max(idx, 0));
	}
	popUntilPopped(tagNames, targetNS) {
		const idx = this._indexOfTagNames(tagNames, targetNS);
		this.shortenToLength(Math.max(idx, 0));
	}
	popUntilNumberedHeaderPopped() {
		this.popUntilPopped(NUMBERED_HEADERS, NS.HTML);
	}
	popUntilTableCellPopped() {
		this.popUntilPopped(TABLE_CELLS, NS.HTML);
	}
	popAllUpToHtmlElement() {
		this.tmplCount = 0;
		this.shortenToLength(1);
	}
	_indexOfTagNames(tagNames, namespace) {
		for (let i = this.stackTop; i >= 0; i--) if (tagNames.has(this.tagIDs[i]) && this.treeAdapter.getNamespaceURI(this.items[i]) === namespace) return i;
		return -1;
	}
	clearBackTo(tagNames, targetNS) {
		const idx = this._indexOfTagNames(tagNames, targetNS);
		this.shortenToLength(idx + 1);
	}
	clearBackToTableContext() {
		this.clearBackTo(TABLE_CONTEXT, NS.HTML);
	}
	clearBackToTableBodyContext() {
		this.clearBackTo(TABLE_BODY_CONTEXT, NS.HTML);
	}
	clearBackToTableRowContext() {
		this.clearBackTo(TABLE_ROW_CONTEXT, NS.HTML);
	}
	remove(element) {
		const idx = this._indexOf(element);
		if (idx >= 0) if (idx === this.stackTop) this.pop();
		else {
			this.items.splice(idx, 1);
			this.tagIDs.splice(idx, 1);
			this.stackTop--;
			this._updateCurrentElement();
			this.handler.onItemPop(element, false);
		}
	}
	tryPeekProperlyNestedBodyElement() {
		return this.stackTop >= 1 && this.tagIDs[1] === TAG_ID.BODY ? this.items[1] : null;
	}
	contains(element) {
		return this._indexOf(element) > -1;
	}
	getCommonAncestor(element) {
		const elementIdx = this._indexOf(element) - 1;
		return elementIdx >= 0 ? this.items[elementIdx] : null;
	}
	isRootHtmlElementCurrent() {
		return this.stackTop === 0 && this.tagIDs[0] === TAG_ID.HTML;
	}
	hasInDynamicScope(tagName, htmlScope) {
		for (let i = this.stackTop; i >= 0; i--) {
			const tn = this.tagIDs[i];
			switch (this.treeAdapter.getNamespaceURI(this.items[i])) {
				case NS.HTML:
					if (tn === tagName) return true;
					if (htmlScope.has(tn)) return false;
					break;
				case NS.SVG:
					if (SCOPING_ELEMENTS_SVG.has(tn)) return false;
					break;
				case NS.MATHML: if (SCOPING_ELEMENTS_MATHML.has(tn)) return false;
			}
		}
		return true;
	}
	hasInScope(tagName) {
		return this.hasInDynamicScope(tagName, SCOPING_ELEMENTS_HTML);
	}
	hasInListItemScope(tagName) {
		return this.hasInDynamicScope(tagName, SCOPING_ELEMENTS_HTML_LIST);
	}
	hasInButtonScope(tagName) {
		return this.hasInDynamicScope(tagName, SCOPING_ELEMENTS_HTML_BUTTON);
	}
	hasNumberedHeaderInScope() {
		for (let i = this.stackTop; i >= 0; i--) {
			const tn = this.tagIDs[i];
			switch (this.treeAdapter.getNamespaceURI(this.items[i])) {
				case NS.HTML:
					if (NUMBERED_HEADERS.has(tn)) return true;
					if (SCOPING_ELEMENTS_HTML.has(tn)) return false;
					break;
				case NS.SVG:
					if (SCOPING_ELEMENTS_SVG.has(tn)) return false;
					break;
				case NS.MATHML: if (SCOPING_ELEMENTS_MATHML.has(tn)) return false;
			}
		}
		return true;
	}
	hasInTableScope(tagName) {
		for (let i = this.stackTop; i >= 0; i--) {
			if (this.treeAdapter.getNamespaceURI(this.items[i]) !== NS.HTML) continue;
			switch (this.tagIDs[i]) {
				case tagName: return true;
				case TAG_ID.TABLE:
				case TAG_ID.HTML: return false;
			}
		}
		return true;
	}
	hasTableBodyContextInTableScope() {
		for (let i = this.stackTop; i >= 0; i--) {
			if (this.treeAdapter.getNamespaceURI(this.items[i]) !== NS.HTML) continue;
			switch (this.tagIDs[i]) {
				case TAG_ID.TBODY:
				case TAG_ID.THEAD:
				case TAG_ID.TFOOT: return true;
				case TAG_ID.TABLE:
				case TAG_ID.HTML: return false;
			}
		}
		return true;
	}
	hasInSelectScope(tagName) {
		for (let i = this.stackTop; i >= 0; i--) {
			if (this.treeAdapter.getNamespaceURI(this.items[i]) !== NS.HTML) continue;
			switch (this.tagIDs[i]) {
				case tagName: return true;
				case TAG_ID.OPTION:
				case TAG_ID.OPTGROUP: break;
				default: return false;
			}
		}
		return true;
	}
	generateImpliedEndTags() {
		while (this.currentTagId !== void 0 && IMPLICIT_END_TAG_REQUIRED.has(this.currentTagId)) this.pop();
	}
	generateImpliedEndTagsThoroughly() {
		while (this.currentTagId !== void 0 && IMPLICIT_END_TAG_REQUIRED_THOROUGHLY.has(this.currentTagId)) this.pop();
	}
	generateImpliedEndTagsWithExclusion(exclusionId) {
		while (this.currentTagId !== void 0 && this.currentTagId !== exclusionId && IMPLICIT_END_TAG_REQUIRED_THOROUGHLY.has(this.currentTagId)) this.pop();
	}
};
//#endregion
//#region node_modules/parse5/dist/parser/formatting-element-list.js
var NOAH_ARK_CAPACITY = 3;
var EntryType;
(function(EntryType) {
	EntryType[EntryType["Marker"] = 0] = "Marker";
	EntryType[EntryType["Element"] = 1] = "Element";
})(EntryType || (EntryType = {}));
var MARKER = { type: EntryType.Marker };
var FormattingElementList = class {
	constructor(treeAdapter) {
		this.treeAdapter = treeAdapter;
		this.entries = [];
		this.bookmark = null;
	}
	_getNoahArkConditionCandidates(newElement, neAttrs) {
		const candidates = [];
		const neAttrsLength = neAttrs.length;
		const neTagName = this.treeAdapter.getTagName(newElement);
		const neNamespaceURI = this.treeAdapter.getNamespaceURI(newElement);
		for (let i = 0; i < this.entries.length; i++) {
			const entry = this.entries[i];
			if (entry.type === EntryType.Marker) break;
			const { element } = entry;
			if (this.treeAdapter.getTagName(element) === neTagName && this.treeAdapter.getNamespaceURI(element) === neNamespaceURI) {
				const elementAttrs = this.treeAdapter.getAttrList(element);
				if (elementAttrs.length === neAttrsLength) candidates.push({
					idx: i,
					attrs: elementAttrs
				});
			}
		}
		return candidates;
	}
	_ensureNoahArkCondition(newElement) {
		if (this.entries.length < NOAH_ARK_CAPACITY) return;
		const neAttrs = this.treeAdapter.getAttrList(newElement);
		const candidates = this._getNoahArkConditionCandidates(newElement, neAttrs);
		if (candidates.length < NOAH_ARK_CAPACITY) return;
		const neAttrsMap = new Map(neAttrs.map((neAttr) => [neAttr.name, neAttr.value]));
		let validCandidates = 0;
		for (let i = 0; i < candidates.length; i++) {
			const candidate = candidates[i];
			if (candidate.attrs.every((cAttr) => neAttrsMap.get(cAttr.name) === cAttr.value)) {
				validCandidates += 1;
				if (validCandidates >= NOAH_ARK_CAPACITY) this.entries.splice(candidate.idx, 1);
			}
		}
	}
	insertMarker() {
		this.entries.unshift(MARKER);
	}
	pushElement(element, token) {
		this._ensureNoahArkCondition(element);
		this.entries.unshift({
			type: EntryType.Element,
			element,
			token
		});
	}
	insertElementAfterBookmark(element, token) {
		const bookmarkIdx = this.entries.indexOf(this.bookmark);
		this.entries.splice(bookmarkIdx, 0, {
			type: EntryType.Element,
			element,
			token
		});
	}
	removeEntry(entry) {
		const entryIndex = this.entries.indexOf(entry);
		if (entryIndex !== -1) this.entries.splice(entryIndex, 1);
	}
	/**
	* Clears the list of formatting elements up to the last marker.
	*
	* @see https://html.spec.whatwg.org/multipage/parsing.html#clear-the-list-of-active-formatting-elements-up-to-the-last-marker
	*/
	clearToLastMarker() {
		const markerIdx = this.entries.indexOf(MARKER);
		if (markerIdx === -1) this.entries.length = 0;
		else this.entries.splice(0, markerIdx + 1);
	}
	getElementEntryInScopeWithTagName(tagName) {
		const entry = this.entries.find((entry) => entry.type === EntryType.Marker || this.treeAdapter.getTagName(entry.element) === tagName);
		return entry && entry.type === EntryType.Element ? entry : null;
	}
	getElementEntry(element) {
		return this.entries.find((entry) => entry.type === EntryType.Element && entry.element === element);
	}
};
//#endregion
//#region node_modules/parse5/dist/tree-adapters/default.js
var defaultTreeAdapter = {
	createDocument() {
		return {
			nodeName: "#document",
			mode: DOCUMENT_MODE.NO_QUIRKS,
			childNodes: []
		};
	},
	createDocumentFragment() {
		return {
			nodeName: "#document-fragment",
			childNodes: []
		};
	},
	createElement(tagName, namespaceURI, attrs) {
		return {
			nodeName: tagName,
			tagName,
			attrs,
			namespaceURI,
			childNodes: [],
			parentNode: null
		};
	},
	createCommentNode(data) {
		return {
			nodeName: "#comment",
			data,
			parentNode: null
		};
	},
	createTextNode(value) {
		return {
			nodeName: "#text",
			value,
			parentNode: null
		};
	},
	appendChild(parentNode, newNode) {
		parentNode.childNodes.push(newNode);
		newNode.parentNode = parentNode;
	},
	insertBefore(parentNode, newNode, referenceNode) {
		const insertionIdx = parentNode.childNodes.indexOf(referenceNode);
		parentNode.childNodes.splice(insertionIdx, 0, newNode);
		newNode.parentNode = parentNode;
	},
	setTemplateContent(templateElement, contentElement) {
		templateElement.content = contentElement;
	},
	getTemplateContent(templateElement) {
		return templateElement.content;
	},
	setDocumentType(document, name, publicId, systemId) {
		const doctypeNode = document.childNodes.find((node) => node.nodeName === "#documentType");
		if (doctypeNode) {
			doctypeNode.name = name;
			doctypeNode.publicId = publicId;
			doctypeNode.systemId = systemId;
		} else {
			const node = {
				nodeName: "#documentType",
				name,
				publicId,
				systemId,
				parentNode: null
			};
			defaultTreeAdapter.appendChild(document, node);
		}
	},
	setDocumentMode(document, mode) {
		document.mode = mode;
	},
	getDocumentMode(document) {
		return document.mode;
	},
	detachNode(node) {
		if (node.parentNode) {
			const idx = node.parentNode.childNodes.indexOf(node);
			node.parentNode.childNodes.splice(idx, 1);
			node.parentNode = null;
		}
	},
	insertText(parentNode, text) {
		if (parentNode.childNodes.length > 0) {
			const prevNode = parentNode.childNodes[parentNode.childNodes.length - 1];
			if (defaultTreeAdapter.isTextNode(prevNode)) {
				prevNode.value += text;
				return;
			}
		}
		defaultTreeAdapter.appendChild(parentNode, defaultTreeAdapter.createTextNode(text));
	},
	insertTextBefore(parentNode, text, referenceNode) {
		const prevNode = parentNode.childNodes[parentNode.childNodes.indexOf(referenceNode) - 1];
		if (prevNode && defaultTreeAdapter.isTextNode(prevNode)) prevNode.value += text;
		else defaultTreeAdapter.insertBefore(parentNode, defaultTreeAdapter.createTextNode(text), referenceNode);
	},
	adoptAttributes(recipient, attrs) {
		const recipientAttrsMap = new Set(recipient.attrs.map((attr) => attr.name));
		for (let j = 0; j < attrs.length; j++) if (!recipientAttrsMap.has(attrs[j].name)) recipient.attrs.push(attrs[j]);
	},
	getFirstChild(node) {
		return node.childNodes[0];
	},
	getChildNodes(node) {
		return node.childNodes;
	},
	getParentNode(node) {
		return node.parentNode;
	},
	getAttrList(element) {
		return element.attrs;
	},
	getTagName(element) {
		return element.tagName;
	},
	getNamespaceURI(element) {
		return element.namespaceURI;
	},
	getTextNodeContent(textNode) {
		return textNode.value;
	},
	getCommentNodeContent(commentNode) {
		return commentNode.data;
	},
	getDocumentTypeNodeName(doctypeNode) {
		return doctypeNode.name;
	},
	getDocumentTypeNodePublicId(doctypeNode) {
		return doctypeNode.publicId;
	},
	getDocumentTypeNodeSystemId(doctypeNode) {
		return doctypeNode.systemId;
	},
	isTextNode(node) {
		return node.nodeName === "#text";
	},
	isCommentNode(node) {
		return node.nodeName === "#comment";
	},
	isDocumentTypeNode(node) {
		return node.nodeName === "#documentType";
	},
	isElementNode(node) {
		return Object.prototype.hasOwnProperty.call(node, "tagName");
	},
	setNodeSourceCodeLocation(node, location) {
		node.sourceCodeLocation = location;
	},
	getNodeSourceCodeLocation(node) {
		return node.sourceCodeLocation;
	},
	updateNodeSourceCodeLocation(node, endLocation) {
		node.sourceCodeLocation = {
			...node.sourceCodeLocation,
			...endLocation
		};
	}
};
//#endregion
//#region node_modules/parse5/dist/common/doctype.js
var VALID_DOCTYPE_NAME = "html";
var VALID_SYSTEM_ID = "about:legacy-compat";
var QUIRKS_MODE_SYSTEM_ID = "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd";
var QUIRKS_MODE_PUBLIC_ID_PREFIXES = [
	"+//silmaril//dtd html pro v0r11 19970101//",
	"-//as//dtd html 3.0 aswedit + extensions//",
	"-//advasoft ltd//dtd html 3.0 aswedit + extensions//",
	"-//ietf//dtd html 2.0 level 1//",
	"-//ietf//dtd html 2.0 level 2//",
	"-//ietf//dtd html 2.0 strict level 1//",
	"-//ietf//dtd html 2.0 strict level 2//",
	"-//ietf//dtd html 2.0 strict//",
	"-//ietf//dtd html 2.0//",
	"-//ietf//dtd html 2.1e//",
	"-//ietf//dtd html 3.0//",
	"-//ietf//dtd html 3.2 final//",
	"-//ietf//dtd html 3.2//",
	"-//ietf//dtd html 3//",
	"-//ietf//dtd html level 0//",
	"-//ietf//dtd html level 1//",
	"-//ietf//dtd html level 2//",
	"-//ietf//dtd html level 3//",
	"-//ietf//dtd html strict level 0//",
	"-//ietf//dtd html strict level 1//",
	"-//ietf//dtd html strict level 2//",
	"-//ietf//dtd html strict level 3//",
	"-//ietf//dtd html strict//",
	"-//ietf//dtd html//",
	"-//metrius//dtd metrius presentational//",
	"-//microsoft//dtd internet explorer 2.0 html strict//",
	"-//microsoft//dtd internet explorer 2.0 html//",
	"-//microsoft//dtd internet explorer 2.0 tables//",
	"-//microsoft//dtd internet explorer 3.0 html strict//",
	"-//microsoft//dtd internet explorer 3.0 html//",
	"-//microsoft//dtd internet explorer 3.0 tables//",
	"-//netscape comm. corp.//dtd html//",
	"-//netscape comm. corp.//dtd strict html//",
	"-//o'reilly and associates//dtd html 2.0//",
	"-//o'reilly and associates//dtd html extended 1.0//",
	"-//o'reilly and associates//dtd html extended relaxed 1.0//",
	"-//sq//dtd html 2.0 hotmetal + extensions//",
	"-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//",
	"-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//",
	"-//spyglass//dtd html 2.0 extended//",
	"-//sun microsystems corp.//dtd hotjava html//",
	"-//sun microsystems corp.//dtd hotjava strict html//",
	"-//w3c//dtd html 3 1995-03-24//",
	"-//w3c//dtd html 3.2 draft//",
	"-//w3c//dtd html 3.2 final//",
	"-//w3c//dtd html 3.2//",
	"-//w3c//dtd html 3.2s draft//",
	"-//w3c//dtd html 4.0 frameset//",
	"-//w3c//dtd html 4.0 transitional//",
	"-//w3c//dtd html experimental 19960712//",
	"-//w3c//dtd html experimental 970421//",
	"-//w3c//dtd w3 html//",
	"-//w3o//dtd w3 html 3.0//",
	"-//webtechs//dtd mozilla html 2.0//",
	"-//webtechs//dtd mozilla html//"
];
var QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES = [
	...QUIRKS_MODE_PUBLIC_ID_PREFIXES,
	"-//w3c//dtd html 4.01 frameset//",
	"-//w3c//dtd html 4.01 transitional//"
];
var QUIRKS_MODE_PUBLIC_IDS = /* @__PURE__ */ new Set([
	"-//w3o//dtd w3 html strict 3.0//en//",
	"-/w3c/dtd html 4.0 transitional/en",
	"html"
]);
var LIMITED_QUIRKS_PUBLIC_ID_PREFIXES = ["-//w3c//dtd xhtml 1.0 frameset//", "-//w3c//dtd xhtml 1.0 transitional//"];
var LIMITED_QUIRKS_WITH_SYSTEM_ID_PUBLIC_ID_PREFIXES = [
	...LIMITED_QUIRKS_PUBLIC_ID_PREFIXES,
	"-//w3c//dtd html 4.01 frameset//",
	"-//w3c//dtd html 4.01 transitional//"
];
function hasPrefix(publicId, prefixes) {
	return prefixes.some((prefix) => publicId.startsWith(prefix));
}
function isConforming(token) {
	return token.name === VALID_DOCTYPE_NAME && token.publicId === null && (token.systemId === null || token.systemId === VALID_SYSTEM_ID);
}
function getDocumentMode(token) {
	if (token.name !== VALID_DOCTYPE_NAME) return DOCUMENT_MODE.QUIRKS;
	const { systemId } = token;
	if (systemId && systemId.toLowerCase() === QUIRKS_MODE_SYSTEM_ID) return DOCUMENT_MODE.QUIRKS;
	let { publicId } = token;
	if (publicId !== null) {
		publicId = publicId.toLowerCase();
		if (QUIRKS_MODE_PUBLIC_IDS.has(publicId)) return DOCUMENT_MODE.QUIRKS;
		let prefixes = systemId === null ? QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES : QUIRKS_MODE_PUBLIC_ID_PREFIXES;
		if (hasPrefix(publicId, prefixes)) return DOCUMENT_MODE.QUIRKS;
		prefixes = systemId === null ? LIMITED_QUIRKS_PUBLIC_ID_PREFIXES : LIMITED_QUIRKS_WITH_SYSTEM_ID_PUBLIC_ID_PREFIXES;
		if (hasPrefix(publicId, prefixes)) return DOCUMENT_MODE.LIMITED_QUIRKS;
	}
	return DOCUMENT_MODE.NO_QUIRKS;
}
//#endregion
//#region node_modules/parse5/dist/common/foreign-content.js
var MIME_TYPES = {
	TEXT_HTML: "text/html",
	APPLICATION_XML: "application/xhtml+xml"
};
var DEFINITION_URL_ATTR = "definitionurl";
var ADJUSTED_DEFINITION_URL_ATTR = "definitionURL";
var SVG_ATTRS_ADJUSTMENT_MAP = new Map([
	"attributeName",
	"attributeType",
	"baseFrequency",
	"baseProfile",
	"calcMode",
	"clipPathUnits",
	"diffuseConstant",
	"edgeMode",
	"filterUnits",
	"glyphRef",
	"gradientTransform",
	"gradientUnits",
	"kernelMatrix",
	"kernelUnitLength",
	"keyPoints",
	"keySplines",
	"keyTimes",
	"lengthAdjust",
	"limitingConeAngle",
	"markerHeight",
	"markerUnits",
	"markerWidth",
	"maskContentUnits",
	"maskUnits",
	"numOctaves",
	"pathLength",
	"patternContentUnits",
	"patternTransform",
	"patternUnits",
	"pointsAtX",
	"pointsAtY",
	"pointsAtZ",
	"preserveAlpha",
	"preserveAspectRatio",
	"primitiveUnits",
	"refX",
	"refY",
	"repeatCount",
	"repeatDur",
	"requiredExtensions",
	"requiredFeatures",
	"specularConstant",
	"specularExponent",
	"spreadMethod",
	"startOffset",
	"stdDeviation",
	"stitchTiles",
	"surfaceScale",
	"systemLanguage",
	"tableValues",
	"targetX",
	"targetY",
	"textLength",
	"viewBox",
	"viewTarget",
	"xChannelSelector",
	"yChannelSelector",
	"zoomAndPan"
].map((attr) => [attr.toLowerCase(), attr]));
var XML_ATTRS_ADJUSTMENT_MAP = /* @__PURE__ */ new Map([
	["xlink:actuate", {
		prefix: "xlink",
		name: "actuate",
		namespace: NS.XLINK
	}],
	["xlink:arcrole", {
		prefix: "xlink",
		name: "arcrole",
		namespace: NS.XLINK
	}],
	["xlink:href", {
		prefix: "xlink",
		name: "href",
		namespace: NS.XLINK
	}],
	["xlink:role", {
		prefix: "xlink",
		name: "role",
		namespace: NS.XLINK
	}],
	["xlink:show", {
		prefix: "xlink",
		name: "show",
		namespace: NS.XLINK
	}],
	["xlink:title", {
		prefix: "xlink",
		name: "title",
		namespace: NS.XLINK
	}],
	["xlink:type", {
		prefix: "xlink",
		name: "type",
		namespace: NS.XLINK
	}],
	["xml:lang", {
		prefix: "xml",
		name: "lang",
		namespace: NS.XML
	}],
	["xml:space", {
		prefix: "xml",
		name: "space",
		namespace: NS.XML
	}],
	["xmlns", {
		prefix: "",
		name: "xmlns",
		namespace: NS.XMLNS
	}],
	["xmlns:xlink", {
		prefix: "xmlns",
		name: "xlink",
		namespace: NS.XMLNS
	}]
]);
var SVG_TAG_NAMES_ADJUSTMENT_MAP = new Map([
	"altGlyph",
	"altGlyphDef",
	"altGlyphItem",
	"animateColor",
	"animateMotion",
	"animateTransform",
	"clipPath",
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence",
	"foreignObject",
	"glyphRef",
	"linearGradient",
	"radialGradient",
	"textPath"
].map((tn) => [tn.toLowerCase(), tn]));
var EXITS_FOREIGN_CONTENT = /* @__PURE__ */ new Set([
	TAG_ID.B,
	TAG_ID.BIG,
	TAG_ID.BLOCKQUOTE,
	TAG_ID.BODY,
	TAG_ID.BR,
	TAG_ID.CENTER,
	TAG_ID.CODE,
	TAG_ID.DD,
	TAG_ID.DIV,
	TAG_ID.DL,
	TAG_ID.DT,
	TAG_ID.EM,
	TAG_ID.EMBED,
	TAG_ID.H1,
	TAG_ID.H2,
	TAG_ID.H3,
	TAG_ID.H4,
	TAG_ID.H5,
	TAG_ID.H6,
	TAG_ID.HEAD,
	TAG_ID.HR,
	TAG_ID.I,
	TAG_ID.IMG,
	TAG_ID.LI,
	TAG_ID.LISTING,
	TAG_ID.MENU,
	TAG_ID.META,
	TAG_ID.NOBR,
	TAG_ID.OL,
	TAG_ID.P,
	TAG_ID.PRE,
	TAG_ID.RUBY,
	TAG_ID.S,
	TAG_ID.SMALL,
	TAG_ID.SPAN,
	TAG_ID.STRONG,
	TAG_ID.STRIKE,
	TAG_ID.SUB,
	TAG_ID.SUP,
	TAG_ID.TABLE,
	TAG_ID.TT,
	TAG_ID.U,
	TAG_ID.UL,
	TAG_ID.VAR
]);
function causesExit(startTagToken) {
	const tn = startTagToken.tagID;
	return tn === TAG_ID.FONT && startTagToken.attrs.some(({ name }) => name === ATTRS.COLOR || name === ATTRS.SIZE || name === ATTRS.FACE) || EXITS_FOREIGN_CONTENT.has(tn);
}
function adjustTokenMathMLAttrs(token) {
	for (let i = 0; i < token.attrs.length; i++) if (token.attrs[i].name === DEFINITION_URL_ATTR) {
		token.attrs[i].name = ADJUSTED_DEFINITION_URL_ATTR;
		break;
	}
}
function adjustTokenSVGAttrs(token) {
	for (let i = 0; i < token.attrs.length; i++) {
		const adjustedAttrName = SVG_ATTRS_ADJUSTMENT_MAP.get(token.attrs[i].name);
		if (adjustedAttrName != null) token.attrs[i].name = adjustedAttrName;
	}
}
function adjustTokenXMLAttrs(token) {
	for (let i = 0; i < token.attrs.length; i++) {
		const adjustedAttrEntry = XML_ATTRS_ADJUSTMENT_MAP.get(token.attrs[i].name);
		if (adjustedAttrEntry) {
			token.attrs[i].prefix = adjustedAttrEntry.prefix;
			token.attrs[i].name = adjustedAttrEntry.name;
			token.attrs[i].namespace = adjustedAttrEntry.namespace;
		}
	}
}
function adjustTokenSVGTagName(token) {
	const adjustedTagName = SVG_TAG_NAMES_ADJUSTMENT_MAP.get(token.tagName);
	if (adjustedTagName != null) {
		token.tagName = adjustedTagName;
		token.tagID = getTagID(token.tagName);
	}
}
function isMathMLTextIntegrationPoint(tn, ns) {
	return ns === NS.MATHML && (tn === TAG_ID.MI || tn === TAG_ID.MO || tn === TAG_ID.MN || tn === TAG_ID.MS || tn === TAG_ID.MTEXT);
}
function isHtmlIntegrationPoint(tn, ns, attrs) {
	if (ns === NS.MATHML && tn === TAG_ID.ANNOTATION_XML) {
		for (let i = 0; i < attrs.length; i++) if (attrs[i].name === ATTRS.ENCODING) {
			const value = attrs[i].value.toLowerCase();
			return value === MIME_TYPES.TEXT_HTML || value === MIME_TYPES.APPLICATION_XML;
		}
	}
	return ns === NS.SVG && (tn === TAG_ID.FOREIGN_OBJECT || tn === TAG_ID.DESC || tn === TAG_ID.TITLE);
}
function isIntegrationPoint(tn, ns, attrs, foreignNS) {
	return (!foreignNS || foreignNS === NS.HTML) && isHtmlIntegrationPoint(tn, ns, attrs) || (!foreignNS || foreignNS === NS.MATHML) && isMathMLTextIntegrationPoint(tn, ns);
}
//#endregion
//#region node_modules/parse5/dist/parser/index.js
var HIDDEN_INPUT_TYPE = "hidden";
var AA_OUTER_LOOP_ITER = 8;
var AA_INNER_LOOP_ITER = 3;
var InsertionMode;
(function(InsertionMode) {
	InsertionMode[InsertionMode["INITIAL"] = 0] = "INITIAL";
	InsertionMode[InsertionMode["BEFORE_HTML"] = 1] = "BEFORE_HTML";
	InsertionMode[InsertionMode["BEFORE_HEAD"] = 2] = "BEFORE_HEAD";
	InsertionMode[InsertionMode["IN_HEAD"] = 3] = "IN_HEAD";
	InsertionMode[InsertionMode["IN_HEAD_NO_SCRIPT"] = 4] = "IN_HEAD_NO_SCRIPT";
	InsertionMode[InsertionMode["AFTER_HEAD"] = 5] = "AFTER_HEAD";
	InsertionMode[InsertionMode["IN_BODY"] = 6] = "IN_BODY";
	InsertionMode[InsertionMode["TEXT"] = 7] = "TEXT";
	InsertionMode[InsertionMode["IN_TABLE"] = 8] = "IN_TABLE";
	InsertionMode[InsertionMode["IN_TABLE_TEXT"] = 9] = "IN_TABLE_TEXT";
	InsertionMode[InsertionMode["IN_CAPTION"] = 10] = "IN_CAPTION";
	InsertionMode[InsertionMode["IN_COLUMN_GROUP"] = 11] = "IN_COLUMN_GROUP";
	InsertionMode[InsertionMode["IN_TABLE_BODY"] = 12] = "IN_TABLE_BODY";
	InsertionMode[InsertionMode["IN_ROW"] = 13] = "IN_ROW";
	InsertionMode[InsertionMode["IN_CELL"] = 14] = "IN_CELL";
	InsertionMode[InsertionMode["IN_SELECT"] = 15] = "IN_SELECT";
	InsertionMode[InsertionMode["IN_SELECT_IN_TABLE"] = 16] = "IN_SELECT_IN_TABLE";
	InsertionMode[InsertionMode["IN_TEMPLATE"] = 17] = "IN_TEMPLATE";
	InsertionMode[InsertionMode["AFTER_BODY"] = 18] = "AFTER_BODY";
	InsertionMode[InsertionMode["IN_FRAMESET"] = 19] = "IN_FRAMESET";
	InsertionMode[InsertionMode["AFTER_FRAMESET"] = 20] = "AFTER_FRAMESET";
	InsertionMode[InsertionMode["AFTER_AFTER_BODY"] = 21] = "AFTER_AFTER_BODY";
	InsertionMode[InsertionMode["AFTER_AFTER_FRAMESET"] = 22] = "AFTER_AFTER_FRAMESET";
})(InsertionMode || (InsertionMode = {}));
var BASE_LOC = {
	startLine: -1,
	startCol: -1,
	startOffset: -1,
	endLine: -1,
	endCol: -1,
	endOffset: -1
};
var TABLE_STRUCTURE_TAGS = /* @__PURE__ */ new Set([
	TAG_ID.TABLE,
	TAG_ID.TBODY,
	TAG_ID.TFOOT,
	TAG_ID.THEAD,
	TAG_ID.TR
]);
var defaultParserOptions = {
	scriptingEnabled: true,
	sourceCodeLocationInfo: false,
	treeAdapter: defaultTreeAdapter,
	onParseError: null
};
var Parser$1 = class {
	constructor(options, document, fragmentContext = null, scriptHandler = null) {
		this.fragmentContext = fragmentContext;
		this.scriptHandler = scriptHandler;
		this.currentToken = null;
		this.stopped = false;
		/** @internal */
		this.insertionMode = InsertionMode.INITIAL;
		/** @internal */
		this.originalInsertionMode = InsertionMode.INITIAL;
		/** @internal */
		this.headElement = null;
		/** @internal */
		this.formElement = null;
		/** Indicates that the current node is not an element in the HTML namespace */
		this.currentNotInHTML = false;
		/**
		* The template insertion mode stack is maintained from the left.
		* Ie. the topmost element will always have index 0.
		*
		* @internal
		*/
		this.tmplInsertionModeStack = [];
		/** @internal */
		this.pendingCharacterTokens = [];
		/** @internal */
		this.hasNonWhitespacePendingCharacterToken = false;
		/** @internal */
		this.framesetOk = true;
		/** @internal */
		this.skipNextNewLine = false;
		/** @internal */
		this.fosterParentingEnabled = false;
		this.options = {
			...defaultParserOptions,
			...options
		};
		this.treeAdapter = this.options.treeAdapter;
		this.onParseError = this.options.onParseError;
		if (this.onParseError) this.options.sourceCodeLocationInfo = true;
		this.document = document !== null && document !== void 0 ? document : this.treeAdapter.createDocument();
		this.tokenizer = new Tokenizer(this.options, this);
		this.activeFormattingElements = new FormattingElementList(this.treeAdapter);
		this.fragmentContextID = fragmentContext ? getTagID(this.treeAdapter.getTagName(fragmentContext)) : TAG_ID.UNKNOWN;
		this._setContextModes(fragmentContext !== null && fragmentContext !== void 0 ? fragmentContext : this.document, this.fragmentContextID);
		this.openElements = new OpenElementStack(this.document, this.treeAdapter, this);
	}
	static parse(html, options) {
		const parser = new this(options);
		parser.tokenizer.write(html, true);
		return parser.document;
	}
	static getFragmentParser(fragmentContext, options) {
		const opts = {
			...defaultParserOptions,
			...options
		};
		fragmentContext !== null && fragmentContext !== void 0 || (fragmentContext = opts.treeAdapter.createElement(TAG_NAMES.TEMPLATE, NS.HTML, []));
		const documentMock = opts.treeAdapter.createElement("documentmock", NS.HTML, []);
		const parser = new this(opts, documentMock, fragmentContext);
		if (parser.fragmentContextID === TAG_ID.TEMPLATE) parser.tmplInsertionModeStack.unshift(InsertionMode.IN_TEMPLATE);
		parser._initTokenizerForFragmentParsing();
		parser._insertFakeRootElement();
		parser._resetInsertionMode();
		parser._findFormInFragmentContext();
		return parser;
	}
	getFragment() {
		const rootElement = this.treeAdapter.getFirstChild(this.document);
		const fragment = this.treeAdapter.createDocumentFragment();
		this._adoptNodes(rootElement, fragment);
		return fragment;
	}
	/** @internal */
	_err(token, code, beforeToken) {
		var _a;
		if (!this.onParseError) return;
		const loc = (_a = token.location) !== null && _a !== void 0 ? _a : BASE_LOC;
		const err = {
			code,
			startLine: loc.startLine,
			startCol: loc.startCol,
			startOffset: loc.startOffset,
			endLine: beforeToken ? loc.startLine : loc.endLine,
			endCol: beforeToken ? loc.startCol : loc.endCol,
			endOffset: beforeToken ? loc.startOffset : loc.endOffset
		};
		this.onParseError(err);
	}
	/** @internal */
	onItemPush(node, tid, isTop) {
		var _a, _b;
		(_b = (_a = this.treeAdapter).onItemPush) === null || _b === void 0 || _b.call(_a, node);
		if (isTop && this.openElements.stackTop > 0) this._setContextModes(node, tid);
	}
	/** @internal */
	onItemPop(node, isTop) {
		var _a, _b;
		if (this.options.sourceCodeLocationInfo) this._setEndLocation(node, this.currentToken);
		(_b = (_a = this.treeAdapter).onItemPop) === null || _b === void 0 || _b.call(_a, node, this.openElements.current);
		if (isTop) {
			let current;
			let currentTagId;
			if (this.openElements.stackTop === 0 && this.fragmentContext) {
				current = this.fragmentContext;
				currentTagId = this.fragmentContextID;
			} else ({current, currentTagId} = this.openElements);
			this._setContextModes(current, currentTagId);
		}
	}
	_setContextModes(current, tid) {
		const isHTML = current === this.document || current && this.treeAdapter.getNamespaceURI(current) === NS.HTML;
		this.currentNotInHTML = !isHTML;
		this.tokenizer.inForeignNode = !isHTML && current !== void 0 && tid !== void 0 && !this._isIntegrationPoint(tid, current);
	}
	/** @protected */
	_switchToTextParsing(currentToken, nextTokenizerState) {
		this._insertElement(currentToken, NS.HTML);
		this.tokenizer.state = nextTokenizerState;
		this.originalInsertionMode = this.insertionMode;
		this.insertionMode = InsertionMode.TEXT;
	}
	switchToPlaintextParsing() {
		this.insertionMode = InsertionMode.TEXT;
		this.originalInsertionMode = InsertionMode.IN_BODY;
		this.tokenizer.state = TokenizerMode.PLAINTEXT;
	}
	/** @protected */
	_getAdjustedCurrentElement() {
		return this.openElements.stackTop === 0 && this.fragmentContext ? this.fragmentContext : this.openElements.current;
	}
	/** @protected */
	_findFormInFragmentContext() {
		let node = this.fragmentContext;
		while (node) {
			if (this.treeAdapter.getTagName(node) === TAG_NAMES.FORM) {
				this.formElement = node;
				break;
			}
			node = this.treeAdapter.getParentNode(node);
		}
	}
	_initTokenizerForFragmentParsing() {
		if (!this.fragmentContext || this.treeAdapter.getNamespaceURI(this.fragmentContext) !== NS.HTML) return;
		switch (this.fragmentContextID) {
			case TAG_ID.TITLE:
			case TAG_ID.TEXTAREA:
				this.tokenizer.state = TokenizerMode.RCDATA;
				break;
			case TAG_ID.STYLE:
			case TAG_ID.XMP:
			case TAG_ID.IFRAME:
			case TAG_ID.NOEMBED:
			case TAG_ID.NOFRAMES:
			case TAG_ID.NOSCRIPT:
				this.tokenizer.state = TokenizerMode.RAWTEXT;
				break;
			case TAG_ID.SCRIPT:
				this.tokenizer.state = TokenizerMode.SCRIPT_DATA;
				break;
			case TAG_ID.PLAINTEXT: this.tokenizer.state = TokenizerMode.PLAINTEXT;
		}
	}
	/** @protected */
	_setDocumentType(token) {
		const name = token.name || "";
		const publicId = token.publicId || "";
		const systemId = token.systemId || "";
		this.treeAdapter.setDocumentType(this.document, name, publicId, systemId);
		if (token.location) {
			const docTypeNode = this.treeAdapter.getChildNodes(this.document).find((node) => this.treeAdapter.isDocumentTypeNode(node));
			if (docTypeNode) this.treeAdapter.setNodeSourceCodeLocation(docTypeNode, token.location);
		}
	}
	/** @protected */
	_attachElementToTree(element, location) {
		if (this.options.sourceCodeLocationInfo) {
			const loc = location && {
				...location,
				startTag: location
			};
			this.treeAdapter.setNodeSourceCodeLocation(element, loc);
		}
		if (this._shouldFosterParentOnInsertion()) this._fosterParentElement(element);
		else {
			const parent = this.openElements.currentTmplContentOrNode;
			this.treeAdapter.appendChild(parent !== null && parent !== void 0 ? parent : this.document, element);
		}
	}
	/**
	* For self-closing tags. Add an element to the tree, but skip adding it
	* to the stack.
	*/
	/** @protected */
	_appendElement(token, namespaceURI) {
		const element = this.treeAdapter.createElement(token.tagName, namespaceURI, token.attrs);
		this._attachElementToTree(element, token.location);
	}
	/** @protected */
	_insertElement(token, namespaceURI) {
		const element = this.treeAdapter.createElement(token.tagName, namespaceURI, token.attrs);
		this._attachElementToTree(element, token.location);
		this.openElements.push(element, token.tagID);
	}
	/** @protected */
	_insertFakeElement(tagName, tagID) {
		const element = this.treeAdapter.createElement(tagName, NS.HTML, []);
		this._attachElementToTree(element, null);
		this.openElements.push(element, tagID);
	}
	/** @protected */
	_insertTemplate(token) {
		const tmpl = this.treeAdapter.createElement(token.tagName, NS.HTML, token.attrs);
		const content = this.treeAdapter.createDocumentFragment();
		this.treeAdapter.setTemplateContent(tmpl, content);
		this._attachElementToTree(tmpl, token.location);
		this.openElements.push(tmpl, token.tagID);
		if (this.options.sourceCodeLocationInfo) this.treeAdapter.setNodeSourceCodeLocation(content, null);
	}
	/** @protected */
	_insertFakeRootElement() {
		const element = this.treeAdapter.createElement(TAG_NAMES.HTML, NS.HTML, []);
		if (this.options.sourceCodeLocationInfo) this.treeAdapter.setNodeSourceCodeLocation(element, null);
		this.treeAdapter.appendChild(this.openElements.current, element);
		this.openElements.push(element, TAG_ID.HTML);
	}
	/** @protected */
	_appendCommentNode(token, parent) {
		const commentNode = this.treeAdapter.createCommentNode(token.data);
		this.treeAdapter.appendChild(parent, commentNode);
		if (this.options.sourceCodeLocationInfo) this.treeAdapter.setNodeSourceCodeLocation(commentNode, token.location);
	}
	/** @protected */
	_insertCharacters(token) {
		let parent;
		let beforeElement;
		if (this._shouldFosterParentOnInsertion()) {
			({parent, beforeElement} = this._findFosterParentingLocation());
			if (beforeElement) this.treeAdapter.insertTextBefore(parent, token.chars, beforeElement);
			else this.treeAdapter.insertText(parent, token.chars);
		} else {
			parent = this.openElements.currentTmplContentOrNode;
			this.treeAdapter.insertText(parent, token.chars);
		}
		if (!token.location) return;
		const siblings = this.treeAdapter.getChildNodes(parent);
		const textNode = siblings[(beforeElement ? siblings.lastIndexOf(beforeElement) : siblings.length) - 1];
		if (this.treeAdapter.getNodeSourceCodeLocation(textNode)) {
			const { endLine, endCol, endOffset } = token.location;
			this.treeAdapter.updateNodeSourceCodeLocation(textNode, {
				endLine,
				endCol,
				endOffset
			});
		} else if (this.options.sourceCodeLocationInfo) this.treeAdapter.setNodeSourceCodeLocation(textNode, token.location);
	}
	/** @protected */
	_adoptNodes(donor, recipient) {
		for (let child = this.treeAdapter.getFirstChild(donor); child; child = this.treeAdapter.getFirstChild(donor)) {
			this.treeAdapter.detachNode(child);
			this.treeAdapter.appendChild(recipient, child);
		}
	}
	/** @protected */
	_setEndLocation(element, closingToken) {
		if (this.treeAdapter.getNodeSourceCodeLocation(element) && closingToken.location) {
			const ctLoc = closingToken.location;
			const tn = this.treeAdapter.getTagName(element);
			const endLoc = closingToken.type === TokenType.END_TAG && tn === closingToken.tagName ? {
				endTag: { ...ctLoc },
				endLine: ctLoc.endLine,
				endCol: ctLoc.endCol,
				endOffset: ctLoc.endOffset
			} : {
				endLine: ctLoc.startLine,
				endCol: ctLoc.startCol,
				endOffset: ctLoc.startOffset
			};
			this.treeAdapter.updateNodeSourceCodeLocation(element, endLoc);
		}
	}
	shouldProcessStartTagTokenInForeignContent(token) {
		if (!this.currentNotInHTML) return false;
		let current;
		let currentTagId;
		if (this.openElements.stackTop === 0 && this.fragmentContext) {
			current = this.fragmentContext;
			currentTagId = this.fragmentContextID;
		} else ({current, currentTagId} = this.openElements);
		if (token.tagID === TAG_ID.SVG && this.treeAdapter.getTagName(current) === TAG_NAMES.ANNOTATION_XML && this.treeAdapter.getNamespaceURI(current) === NS.MATHML) return false;
		return this.tokenizer.inForeignNode || (token.tagID === TAG_ID.MGLYPH || token.tagID === TAG_ID.MALIGNMARK) && currentTagId !== void 0 && !this._isIntegrationPoint(currentTagId, current, NS.HTML);
	}
	/** @protected */
	_processToken(token) {
		switch (token.type) {
			case TokenType.CHARACTER:
				this.onCharacter(token);
				break;
			case TokenType.NULL_CHARACTER:
				this.onNullCharacter(token);
				break;
			case TokenType.COMMENT:
				this.onComment(token);
				break;
			case TokenType.DOCTYPE:
				this.onDoctype(token);
				break;
			case TokenType.START_TAG:
				this._processStartTag(token);
				break;
			case TokenType.END_TAG:
				this.onEndTag(token);
				break;
			case TokenType.EOF:
				this.onEof(token);
				break;
			case TokenType.WHITESPACE_CHARACTER: this.onWhitespaceCharacter(token);
		}
	}
	/** @protected */
	_isIntegrationPoint(tid, element, foreignNS) {
		return isIntegrationPoint(tid, this.treeAdapter.getNamespaceURI(element), this.treeAdapter.getAttrList(element), foreignNS);
	}
	/** @protected */
	_reconstructActiveFormattingElements() {
		const listLength = this.activeFormattingElements.entries.length;
		if (listLength) {
			const endIndex = this.activeFormattingElements.entries.findIndex((entry) => entry.type === EntryType.Marker || this.openElements.contains(entry.element));
			const unopenIdx = endIndex === -1 ? listLength - 1 : endIndex - 1;
			for (let i = unopenIdx; i >= 0; i--) {
				const entry = this.activeFormattingElements.entries[i];
				this._insertElement(entry.token, this.treeAdapter.getNamespaceURI(entry.element));
				entry.element = this.openElements.current;
			}
		}
	}
	/** @protected */
	_closeTableCell() {
		this.openElements.generateImpliedEndTags();
		this.openElements.popUntilTableCellPopped();
		this.activeFormattingElements.clearToLastMarker();
		this.insertionMode = InsertionMode.IN_ROW;
	}
	/** @protected */
	_closePElement() {
		this.openElements.generateImpliedEndTagsWithExclusion(TAG_ID.P);
		this.openElements.popUntilTagNamePopped(TAG_ID.P);
	}
	/** @protected */
	_resetInsertionMode() {
		for (let i = this.openElements.stackTop; i >= 0; i--) switch (i === 0 && this.fragmentContext ? this.fragmentContextID : this.openElements.tagIDs[i]) {
			case TAG_ID.TR:
				this.insertionMode = InsertionMode.IN_ROW;
				return;
			case TAG_ID.TBODY:
			case TAG_ID.THEAD:
			case TAG_ID.TFOOT:
				this.insertionMode = InsertionMode.IN_TABLE_BODY;
				return;
			case TAG_ID.CAPTION:
				this.insertionMode = InsertionMode.IN_CAPTION;
				return;
			case TAG_ID.COLGROUP:
				this.insertionMode = InsertionMode.IN_COLUMN_GROUP;
				return;
			case TAG_ID.TABLE:
				this.insertionMode = InsertionMode.IN_TABLE;
				return;
			case TAG_ID.BODY:
				this.insertionMode = InsertionMode.IN_BODY;
				return;
			case TAG_ID.FRAMESET:
				this.insertionMode = InsertionMode.IN_FRAMESET;
				return;
			case TAG_ID.SELECT:
				this._resetInsertionModeForSelect(i);
				return;
			case TAG_ID.TEMPLATE:
				this.insertionMode = this.tmplInsertionModeStack[0];
				return;
			case TAG_ID.HTML:
				this.insertionMode = this.headElement ? InsertionMode.AFTER_HEAD : InsertionMode.BEFORE_HEAD;
				return;
			case TAG_ID.TD:
			case TAG_ID.TH:
				if (i > 0) {
					this.insertionMode = InsertionMode.IN_CELL;
					return;
				}
				break;
			case TAG_ID.HEAD: if (i > 0) {
				this.insertionMode = InsertionMode.IN_HEAD;
				return;
			}
		}
		this.insertionMode = InsertionMode.IN_BODY;
	}
	/** @protected */
	_resetInsertionModeForSelect(selectIdx) {
		if (selectIdx > 0) for (let i = selectIdx - 1; i > 0; i--) {
			const tn = this.openElements.tagIDs[i];
			if (tn === TAG_ID.TEMPLATE) break;
			else if (tn === TAG_ID.TABLE) {
				this.insertionMode = InsertionMode.IN_SELECT_IN_TABLE;
				return;
			}
		}
		this.insertionMode = InsertionMode.IN_SELECT;
	}
	/** @protected */
	_isElementCausesFosterParenting(tn) {
		return TABLE_STRUCTURE_TAGS.has(tn);
	}
	/** @protected */
	_shouldFosterParentOnInsertion() {
		return this.fosterParentingEnabled && this.openElements.currentTagId !== void 0 && this._isElementCausesFosterParenting(this.openElements.currentTagId);
	}
	/** @protected */
	_findFosterParentingLocation() {
		for (let i = this.openElements.stackTop; i >= 0; i--) {
			const openElement = this.openElements.items[i];
			switch (this.openElements.tagIDs[i]) {
				case TAG_ID.TEMPLATE:
					if (this.treeAdapter.getNamespaceURI(openElement) === NS.HTML) return {
						parent: this.treeAdapter.getTemplateContent(openElement),
						beforeElement: null
					};
					break;
				case TAG_ID.TABLE: {
					const parent = this.treeAdapter.getParentNode(openElement);
					if (parent) return {
						parent,
						beforeElement: openElement
					};
					return {
						parent: this.openElements.items[i - 1],
						beforeElement: null
					};
				}
			}
		}
		return {
			parent: this.openElements.items[0],
			beforeElement: null
		};
	}
	/** @protected */
	_fosterParentElement(element) {
		const location = this._findFosterParentingLocation();
		if (location.beforeElement) this.treeAdapter.insertBefore(location.parent, element, location.beforeElement);
		else this.treeAdapter.appendChild(location.parent, element);
	}
	/** @protected */
	_isSpecialElement(element, id) {
		return SPECIAL_ELEMENTS[this.treeAdapter.getNamespaceURI(element)].has(id);
	}
	/** @internal */
	onCharacter(token) {
		this.skipNextNewLine = false;
		if (this.tokenizer.inForeignNode) {
			characterInForeignContent(this, token);
			return;
		}
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				tokenInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HTML:
				tokenBeforeHtml(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
				tokenBeforeHead(this, token);
				break;
			case InsertionMode.IN_HEAD:
				tokenInHead(this, token);
				break;
			case InsertionMode.IN_HEAD_NO_SCRIPT:
				tokenInHeadNoScript(this, token);
				break;
			case InsertionMode.AFTER_HEAD:
				tokenAfterHead(this, token);
				break;
			case InsertionMode.IN_BODY:
			case InsertionMode.IN_CAPTION:
			case InsertionMode.IN_CELL:
			case InsertionMode.IN_TEMPLATE:
				characterInBody(this, token);
				break;
			case InsertionMode.TEXT:
			case InsertionMode.IN_SELECT:
			case InsertionMode.IN_SELECT_IN_TABLE:
				this._insertCharacters(token);
				break;
			case InsertionMode.IN_TABLE:
			case InsertionMode.IN_TABLE_BODY:
			case InsertionMode.IN_ROW:
				characterInTable(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT:
				characterInTableText(this, token);
				break;
			case InsertionMode.IN_COLUMN_GROUP:
				tokenInColumnGroup(this, token);
				break;
			case InsertionMode.AFTER_BODY:
				tokenAfterBody(this, token);
				break;
			case InsertionMode.AFTER_AFTER_BODY: tokenAfterAfterBody(this, token);
		}
	}
	/** @internal */
	onNullCharacter(token) {
		this.skipNextNewLine = false;
		if (this.tokenizer.inForeignNode) {
			nullCharacterInForeignContent(this, token);
			return;
		}
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				tokenInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HTML:
				tokenBeforeHtml(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
				tokenBeforeHead(this, token);
				break;
			case InsertionMode.IN_HEAD:
				tokenInHead(this, token);
				break;
			case InsertionMode.IN_HEAD_NO_SCRIPT:
				tokenInHeadNoScript(this, token);
				break;
			case InsertionMode.AFTER_HEAD:
				tokenAfterHead(this, token);
				break;
			case InsertionMode.TEXT:
				this._insertCharacters(token);
				break;
			case InsertionMode.IN_TABLE:
			case InsertionMode.IN_TABLE_BODY:
			case InsertionMode.IN_ROW:
				characterInTable(this, token);
				break;
			case InsertionMode.IN_COLUMN_GROUP:
				tokenInColumnGroup(this, token);
				break;
			case InsertionMode.AFTER_BODY:
				tokenAfterBody(this, token);
				break;
			case InsertionMode.AFTER_AFTER_BODY: tokenAfterAfterBody(this, token);
		}
	}
	/** @internal */
	onComment(token) {
		this.skipNextNewLine = false;
		if (this.currentNotInHTML) {
			appendComment(this, token);
			return;
		}
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
			case InsertionMode.BEFORE_HTML:
			case InsertionMode.BEFORE_HEAD:
			case InsertionMode.IN_HEAD:
			case InsertionMode.IN_HEAD_NO_SCRIPT:
			case InsertionMode.AFTER_HEAD:
			case InsertionMode.IN_BODY:
			case InsertionMode.IN_TABLE:
			case InsertionMode.IN_CAPTION:
			case InsertionMode.IN_COLUMN_GROUP:
			case InsertionMode.IN_TABLE_BODY:
			case InsertionMode.IN_ROW:
			case InsertionMode.IN_CELL:
			case InsertionMode.IN_SELECT:
			case InsertionMode.IN_SELECT_IN_TABLE:
			case InsertionMode.IN_TEMPLATE:
			case InsertionMode.IN_FRAMESET:
			case InsertionMode.AFTER_FRAMESET:
				appendComment(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT:
				tokenInTableText(this, token);
				break;
			case InsertionMode.AFTER_BODY:
				appendCommentToRootHtmlElement(this, token);
				break;
			case InsertionMode.AFTER_AFTER_BODY:
			case InsertionMode.AFTER_AFTER_FRAMESET: appendCommentToDocument(this, token);
		}
	}
	/** @internal */
	onDoctype(token) {
		this.skipNextNewLine = false;
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				doctypeInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
			case InsertionMode.IN_HEAD:
			case InsertionMode.IN_HEAD_NO_SCRIPT:
			case InsertionMode.AFTER_HEAD:
				this._err(token, ERR.misplacedDoctype);
				break;
			case InsertionMode.IN_TABLE_TEXT: tokenInTableText(this, token);
		}
	}
	/** @internal */
	onStartTag(token) {
		this.skipNextNewLine = false;
		this.currentToken = token;
		this._processStartTag(token);
		if (token.selfClosing && !token.ackSelfClosing) this._err(token, ERR.nonVoidHtmlElementStartTagWithTrailingSolidus);
	}
	/**
	* Processes a given start tag.
	*
	* `onStartTag` checks if a self-closing tag was recognized. When a token
	* is moved inbetween multiple insertion modes, this check for self-closing
	* could lead to false positives. To avoid this, `_processStartTag` is used
	* for nested calls.
	*
	* @param token The token to process.
	* @protected
	*/
	_processStartTag(token) {
		if (this.shouldProcessStartTagTokenInForeignContent(token)) startTagInForeignContent(this, token);
		else this._startTagOutsideForeignContent(token);
	}
	/** @protected */
	_startTagOutsideForeignContent(token) {
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				tokenInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HTML:
				startTagBeforeHtml(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
				startTagBeforeHead(this, token);
				break;
			case InsertionMode.IN_HEAD:
				startTagInHead(this, token);
				break;
			case InsertionMode.IN_HEAD_NO_SCRIPT:
				startTagInHeadNoScript(this, token);
				break;
			case InsertionMode.AFTER_HEAD:
				startTagAfterHead(this, token);
				break;
			case InsertionMode.IN_BODY:
				startTagInBody(this, token);
				break;
			case InsertionMode.IN_TABLE:
				startTagInTable(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT:
				tokenInTableText(this, token);
				break;
			case InsertionMode.IN_CAPTION:
				startTagInCaption(this, token);
				break;
			case InsertionMode.IN_COLUMN_GROUP:
				startTagInColumnGroup(this, token);
				break;
			case InsertionMode.IN_TABLE_BODY:
				startTagInTableBody(this, token);
				break;
			case InsertionMode.IN_ROW:
				startTagInRow(this, token);
				break;
			case InsertionMode.IN_CELL:
				startTagInCell(this, token);
				break;
			case InsertionMode.IN_SELECT:
				startTagInSelect(this, token);
				break;
			case InsertionMode.IN_SELECT_IN_TABLE:
				startTagInSelectInTable(this, token);
				break;
			case InsertionMode.IN_TEMPLATE:
				startTagInTemplate(this, token);
				break;
			case InsertionMode.AFTER_BODY:
				startTagAfterBody(this, token);
				break;
			case InsertionMode.IN_FRAMESET:
				startTagInFrameset(this, token);
				break;
			case InsertionMode.AFTER_FRAMESET:
				startTagAfterFrameset(this, token);
				break;
			case InsertionMode.AFTER_AFTER_BODY:
				startTagAfterAfterBody(this, token);
				break;
			case InsertionMode.AFTER_AFTER_FRAMESET: startTagAfterAfterFrameset(this, token);
		}
	}
	/** @internal */
	onEndTag(token) {
		this.skipNextNewLine = false;
		this.currentToken = token;
		if (this.currentNotInHTML) endTagInForeignContent(this, token);
		else this._endTagOutsideForeignContent(token);
	}
	/** @protected */
	_endTagOutsideForeignContent(token) {
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				tokenInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HTML:
				endTagBeforeHtml(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
				endTagBeforeHead(this, token);
				break;
			case InsertionMode.IN_HEAD:
				endTagInHead(this, token);
				break;
			case InsertionMode.IN_HEAD_NO_SCRIPT:
				endTagInHeadNoScript(this, token);
				break;
			case InsertionMode.AFTER_HEAD:
				endTagAfterHead(this, token);
				break;
			case InsertionMode.IN_BODY:
				endTagInBody(this, token);
				break;
			case InsertionMode.TEXT:
				endTagInText(this, token);
				break;
			case InsertionMode.IN_TABLE:
				endTagInTable(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT:
				tokenInTableText(this, token);
				break;
			case InsertionMode.IN_CAPTION:
				endTagInCaption(this, token);
				break;
			case InsertionMode.IN_COLUMN_GROUP:
				endTagInColumnGroup(this, token);
				break;
			case InsertionMode.IN_TABLE_BODY:
				endTagInTableBody(this, token);
				break;
			case InsertionMode.IN_ROW:
				endTagInRow(this, token);
				break;
			case InsertionMode.IN_CELL:
				endTagInCell(this, token);
				break;
			case InsertionMode.IN_SELECT:
				endTagInSelect(this, token);
				break;
			case InsertionMode.IN_SELECT_IN_TABLE:
				endTagInSelectInTable(this, token);
				break;
			case InsertionMode.IN_TEMPLATE:
				endTagInTemplate(this, token);
				break;
			case InsertionMode.AFTER_BODY:
				endTagAfterBody(this, token);
				break;
			case InsertionMode.IN_FRAMESET:
				endTagInFrameset(this, token);
				break;
			case InsertionMode.AFTER_FRAMESET:
				endTagAfterFrameset(this, token);
				break;
			case InsertionMode.AFTER_AFTER_BODY: tokenAfterAfterBody(this, token);
		}
	}
	/** @internal */
	onEof(token) {
		switch (this.insertionMode) {
			case InsertionMode.INITIAL:
				tokenInInitialMode(this, token);
				break;
			case InsertionMode.BEFORE_HTML:
				tokenBeforeHtml(this, token);
				break;
			case InsertionMode.BEFORE_HEAD:
				tokenBeforeHead(this, token);
				break;
			case InsertionMode.IN_HEAD:
				tokenInHead(this, token);
				break;
			case InsertionMode.IN_HEAD_NO_SCRIPT:
				tokenInHeadNoScript(this, token);
				break;
			case InsertionMode.AFTER_HEAD:
				tokenAfterHead(this, token);
				break;
			case InsertionMode.IN_BODY:
			case InsertionMode.IN_TABLE:
			case InsertionMode.IN_CAPTION:
			case InsertionMode.IN_COLUMN_GROUP:
			case InsertionMode.IN_TABLE_BODY:
			case InsertionMode.IN_ROW:
			case InsertionMode.IN_CELL:
			case InsertionMode.IN_SELECT:
			case InsertionMode.IN_SELECT_IN_TABLE:
				eofInBody(this, token);
				break;
			case InsertionMode.TEXT:
				eofInText(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT:
				tokenInTableText(this, token);
				break;
			case InsertionMode.IN_TEMPLATE:
				eofInTemplate(this, token);
				break;
			case InsertionMode.AFTER_BODY:
			case InsertionMode.IN_FRAMESET:
			case InsertionMode.AFTER_FRAMESET:
			case InsertionMode.AFTER_AFTER_BODY:
			case InsertionMode.AFTER_AFTER_FRAMESET: stopParsing(this, token);
		}
	}
	/** @internal */
	onWhitespaceCharacter(token) {
		if (this.skipNextNewLine) {
			this.skipNextNewLine = false;
			if (token.chars.charCodeAt(0) === CODE_POINTS.LINE_FEED) {
				if (token.chars.length === 1) return;
				token.chars = token.chars.substr(1);
			}
		}
		if (this.tokenizer.inForeignNode) {
			this._insertCharacters(token);
			return;
		}
		switch (this.insertionMode) {
			case InsertionMode.IN_HEAD:
			case InsertionMode.IN_HEAD_NO_SCRIPT:
			case InsertionMode.AFTER_HEAD:
			case InsertionMode.TEXT:
			case InsertionMode.IN_COLUMN_GROUP:
			case InsertionMode.IN_SELECT:
			case InsertionMode.IN_SELECT_IN_TABLE:
			case InsertionMode.IN_FRAMESET:
			case InsertionMode.AFTER_FRAMESET:
				this._insertCharacters(token);
				break;
			case InsertionMode.IN_BODY:
			case InsertionMode.IN_CAPTION:
			case InsertionMode.IN_CELL:
			case InsertionMode.IN_TEMPLATE:
			case InsertionMode.AFTER_BODY:
			case InsertionMode.AFTER_AFTER_BODY:
			case InsertionMode.AFTER_AFTER_FRAMESET:
				whitespaceCharacterInBody(this, token);
				break;
			case InsertionMode.IN_TABLE:
			case InsertionMode.IN_TABLE_BODY:
			case InsertionMode.IN_ROW:
				characterInTable(this, token);
				break;
			case InsertionMode.IN_TABLE_TEXT: whitespaceCharacterInTableText(this, token);
		}
	}
};
function aaObtainFormattingElementEntry(p, token) {
	let formattingElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName(token.tagName);
	if (formattingElementEntry) {
		if (!p.openElements.contains(formattingElementEntry.element)) {
			p.activeFormattingElements.removeEntry(formattingElementEntry);
			formattingElementEntry = null;
		} else if (!p.openElements.hasInScope(token.tagID)) formattingElementEntry = null;
	} else genericEndTagInBody(p, token);
	return formattingElementEntry;
}
function aaObtainFurthestBlock(p, formattingElementEntry) {
	let furthestBlock = null;
	let idx = p.openElements.stackTop;
	for (; idx >= 0; idx--) {
		const element = p.openElements.items[idx];
		if (element === formattingElementEntry.element) break;
		if (p._isSpecialElement(element, p.openElements.tagIDs[idx])) furthestBlock = element;
	}
	if (!furthestBlock) {
		p.openElements.shortenToLength(Math.max(idx, 0));
		p.activeFormattingElements.removeEntry(formattingElementEntry);
	}
	return furthestBlock;
}
function aaInnerLoop(p, furthestBlock, formattingElement) {
	let lastElement = furthestBlock;
	let nextElement = p.openElements.getCommonAncestor(furthestBlock);
	for (let i = 0, element = nextElement; element !== formattingElement; i++, element = nextElement) {
		nextElement = p.openElements.getCommonAncestor(element);
		const elementEntry = p.activeFormattingElements.getElementEntry(element);
		const counterOverflow = elementEntry && i >= AA_INNER_LOOP_ITER;
		if (!elementEntry || counterOverflow) {
			if (counterOverflow) p.activeFormattingElements.removeEntry(elementEntry);
			p.openElements.remove(element);
		} else {
			element = aaRecreateElementFromEntry(p, elementEntry);
			if (lastElement === furthestBlock) p.activeFormattingElements.bookmark = elementEntry;
			p.treeAdapter.detachNode(lastElement);
			p.treeAdapter.appendChild(element, lastElement);
			lastElement = element;
		}
	}
	return lastElement;
}
function aaRecreateElementFromEntry(p, elementEntry) {
	const ns = p.treeAdapter.getNamespaceURI(elementEntry.element);
	const newElement = p.treeAdapter.createElement(elementEntry.token.tagName, ns, elementEntry.token.attrs);
	p.openElements.replace(elementEntry.element, newElement);
	elementEntry.element = newElement;
	return newElement;
}
function aaInsertLastNodeInCommonAncestor(p, commonAncestor, lastElement) {
	const tid = getTagID(p.treeAdapter.getTagName(commonAncestor));
	if (p._isElementCausesFosterParenting(tid)) p._fosterParentElement(lastElement);
	else {
		const ns = p.treeAdapter.getNamespaceURI(commonAncestor);
		if (tid === TAG_ID.TEMPLATE && ns === NS.HTML) commonAncestor = p.treeAdapter.getTemplateContent(commonAncestor);
		p.treeAdapter.appendChild(commonAncestor, lastElement);
	}
}
function aaReplaceFormattingElement(p, furthestBlock, formattingElementEntry) {
	const ns = p.treeAdapter.getNamespaceURI(formattingElementEntry.element);
	const { token } = formattingElementEntry;
	const newElement = p.treeAdapter.createElement(token.tagName, ns, token.attrs);
	p._adoptNodes(furthestBlock, newElement);
	p.treeAdapter.appendChild(furthestBlock, newElement);
	p.activeFormattingElements.insertElementAfterBookmark(newElement, token);
	p.activeFormattingElements.removeEntry(formattingElementEntry);
	p.openElements.remove(formattingElementEntry.element);
	p.openElements.insertAfter(furthestBlock, newElement, token.tagID);
}
function callAdoptionAgency(p, token) {
	for (let i = 0; i < AA_OUTER_LOOP_ITER; i++) {
		const formattingElementEntry = aaObtainFormattingElementEntry(p, token);
		if (!formattingElementEntry) break;
		const furthestBlock = aaObtainFurthestBlock(p, formattingElementEntry);
		if (!furthestBlock) break;
		p.activeFormattingElements.bookmark = formattingElementEntry;
		const lastElement = aaInnerLoop(p, furthestBlock, formattingElementEntry.element);
		const commonAncestor = p.openElements.getCommonAncestor(formattingElementEntry.element);
		p.treeAdapter.detachNode(lastElement);
		if (commonAncestor) aaInsertLastNodeInCommonAncestor(p, commonAncestor, lastElement);
		aaReplaceFormattingElement(p, furthestBlock, formattingElementEntry);
	}
}
function appendComment(p, token) {
	p._appendCommentNode(token, p.openElements.currentTmplContentOrNode);
}
function appendCommentToRootHtmlElement(p, token) {
	p._appendCommentNode(token, p.openElements.items[0]);
}
function appendCommentToDocument(p, token) {
	p._appendCommentNode(token, p.document);
}
function stopParsing(p, token) {
	p.stopped = true;
	if (token.location) {
		const target = p.fragmentContext ? 0 : 2;
		for (let i = p.openElements.stackTop; i >= target; i--) p._setEndLocation(p.openElements.items[i], token);
		if (!p.fragmentContext && p.openElements.stackTop >= 0) {
			const htmlElement = p.openElements.items[0];
			const htmlLocation = p.treeAdapter.getNodeSourceCodeLocation(htmlElement);
			if (htmlLocation && !htmlLocation.endTag) {
				p._setEndLocation(htmlElement, token);
				if (p.openElements.stackTop >= 1) {
					const bodyElement = p.openElements.items[1];
					const bodyLocation = p.treeAdapter.getNodeSourceCodeLocation(bodyElement);
					if (bodyLocation && !bodyLocation.endTag) p._setEndLocation(bodyElement, token);
				}
			}
		}
	}
}
function doctypeInInitialMode(p, token) {
	p._setDocumentType(token);
	const mode = token.forceQuirks ? DOCUMENT_MODE.QUIRKS : getDocumentMode(token);
	if (!isConforming(token)) p._err(token, ERR.nonConformingDoctype);
	p.treeAdapter.setDocumentMode(p.document, mode);
	p.insertionMode = InsertionMode.BEFORE_HTML;
}
function tokenInInitialMode(p, token) {
	p._err(token, ERR.missingDoctype, true);
	p.treeAdapter.setDocumentMode(p.document, DOCUMENT_MODE.QUIRKS);
	p.insertionMode = InsertionMode.BEFORE_HTML;
	p._processToken(token);
}
function startTagBeforeHtml(p, token) {
	if (token.tagID === TAG_ID.HTML) {
		p._insertElement(token, NS.HTML);
		p.insertionMode = InsertionMode.BEFORE_HEAD;
	} else tokenBeforeHtml(p, token);
}
function endTagBeforeHtml(p, token) {
	const tn = token.tagID;
	if (tn === TAG_ID.HTML || tn === TAG_ID.HEAD || tn === TAG_ID.BODY || tn === TAG_ID.BR) tokenBeforeHtml(p, token);
}
function tokenBeforeHtml(p, token) {
	p._insertFakeRootElement();
	p.insertionMode = InsertionMode.BEFORE_HEAD;
	p._processToken(token);
}
function startTagBeforeHead(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.HEAD:
			p._insertElement(token, NS.HTML);
			p.headElement = p.openElements.current;
			p.insertionMode = InsertionMode.IN_HEAD;
			break;
		default: tokenBeforeHead(p, token);
	}
}
function endTagBeforeHead(p, token) {
	const tn = token.tagID;
	if (tn === TAG_ID.HEAD || tn === TAG_ID.BODY || tn === TAG_ID.HTML || tn === TAG_ID.BR) tokenBeforeHead(p, token);
	else p._err(token, ERR.endTagWithoutMatchingOpenElement);
}
function tokenBeforeHead(p, token) {
	p._insertFakeElement(TAG_NAMES.HEAD, TAG_ID.HEAD);
	p.headElement = p.openElements.current;
	p.insertionMode = InsertionMode.IN_HEAD;
	p._processToken(token);
}
function startTagInHead(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.BASE:
		case TAG_ID.BASEFONT:
		case TAG_ID.BGSOUND:
		case TAG_ID.LINK:
		case TAG_ID.META:
			p._appendElement(token, NS.HTML);
			token.ackSelfClosing = true;
			break;
		case TAG_ID.TITLE:
			p._switchToTextParsing(token, TokenizerMode.RCDATA);
			break;
		case TAG_ID.NOSCRIPT:
			if (p.options.scriptingEnabled) p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
			else {
				p._insertElement(token, NS.HTML);
				p.insertionMode = InsertionMode.IN_HEAD_NO_SCRIPT;
			}
			break;
		case TAG_ID.NOFRAMES:
		case TAG_ID.STYLE:
			p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
			break;
		case TAG_ID.SCRIPT:
			p._switchToTextParsing(token, TokenizerMode.SCRIPT_DATA);
			break;
		case TAG_ID.TEMPLATE:
			p._insertTemplate(token);
			p.activeFormattingElements.insertMarker();
			p.framesetOk = false;
			p.insertionMode = InsertionMode.IN_TEMPLATE;
			p.tmplInsertionModeStack.unshift(InsertionMode.IN_TEMPLATE);
			break;
		case TAG_ID.HEAD:
			p._err(token, ERR.misplacedStartTagForHeadElement);
			break;
		default: tokenInHead(p, token);
	}
}
function endTagInHead(p, token) {
	switch (token.tagID) {
		case TAG_ID.HEAD:
			p.openElements.pop();
			p.insertionMode = InsertionMode.AFTER_HEAD;
			break;
		case TAG_ID.BODY:
		case TAG_ID.BR:
		case TAG_ID.HTML:
			tokenInHead(p, token);
			break;
		case TAG_ID.TEMPLATE:
			templateEndTagInHead(p, token);
			break;
		default: p._err(token, ERR.endTagWithoutMatchingOpenElement);
	}
}
function templateEndTagInHead(p, token) {
	if (p.openElements.tmplCount > 0) {
		p.openElements.generateImpliedEndTagsThoroughly();
		if (p.openElements.currentTagId !== TAG_ID.TEMPLATE) p._err(token, ERR.closingOfElementWithOpenChildElements);
		p.openElements.popUntilTagNamePopped(TAG_ID.TEMPLATE);
		p.activeFormattingElements.clearToLastMarker();
		p.tmplInsertionModeStack.shift();
		p._resetInsertionMode();
	} else p._err(token, ERR.endTagWithoutMatchingOpenElement);
}
function tokenInHead(p, token) {
	p.openElements.pop();
	p.insertionMode = InsertionMode.AFTER_HEAD;
	p._processToken(token);
}
function startTagInHeadNoScript(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.BASEFONT:
		case TAG_ID.BGSOUND:
		case TAG_ID.HEAD:
		case TAG_ID.LINK:
		case TAG_ID.META:
		case TAG_ID.NOFRAMES:
		case TAG_ID.STYLE:
			startTagInHead(p, token);
			break;
		case TAG_ID.NOSCRIPT:
			p._err(token, ERR.nestedNoscriptInHead);
			break;
		default: tokenInHeadNoScript(p, token);
	}
}
function endTagInHeadNoScript(p, token) {
	switch (token.tagID) {
		case TAG_ID.NOSCRIPT:
			p.openElements.pop();
			p.insertionMode = InsertionMode.IN_HEAD;
			break;
		case TAG_ID.BR:
			tokenInHeadNoScript(p, token);
			break;
		default: p._err(token, ERR.endTagWithoutMatchingOpenElement);
	}
}
function tokenInHeadNoScript(p, token) {
	const errCode = token.type === TokenType.EOF ? ERR.openElementsLeftAfterEof : ERR.disallowedContentInNoscriptInHead;
	p._err(token, errCode);
	p.openElements.pop();
	p.insertionMode = InsertionMode.IN_HEAD;
	p._processToken(token);
}
function startTagAfterHead(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.BODY:
			p._insertElement(token, NS.HTML);
			p.framesetOk = false;
			p.insertionMode = InsertionMode.IN_BODY;
			break;
		case TAG_ID.FRAMESET:
			p._insertElement(token, NS.HTML);
			p.insertionMode = InsertionMode.IN_FRAMESET;
			break;
		case TAG_ID.BASE:
		case TAG_ID.BASEFONT:
		case TAG_ID.BGSOUND:
		case TAG_ID.LINK:
		case TAG_ID.META:
		case TAG_ID.NOFRAMES:
		case TAG_ID.SCRIPT:
		case TAG_ID.STYLE:
		case TAG_ID.TEMPLATE:
		case TAG_ID.TITLE:
			p._err(token, ERR.abandonedHeadElementChild);
			p.openElements.push(p.headElement, TAG_ID.HEAD);
			startTagInHead(p, token);
			p.openElements.remove(p.headElement);
			break;
		case TAG_ID.HEAD:
			p._err(token, ERR.misplacedStartTagForHeadElement);
			break;
		default: tokenAfterHead(p, token);
	}
}
function endTagAfterHead(p, token) {
	switch (token.tagID) {
		case TAG_ID.BODY:
		case TAG_ID.HTML:
		case TAG_ID.BR:
			tokenAfterHead(p, token);
			break;
		case TAG_ID.TEMPLATE:
			templateEndTagInHead(p, token);
			break;
		default: p._err(token, ERR.endTagWithoutMatchingOpenElement);
	}
}
function tokenAfterHead(p, token) {
	p._insertFakeElement(TAG_NAMES.BODY, TAG_ID.BODY);
	p.insertionMode = InsertionMode.IN_BODY;
	modeInBody(p, token);
}
function modeInBody(p, token) {
	switch (token.type) {
		case TokenType.CHARACTER:
			characterInBody(p, token);
			break;
		case TokenType.WHITESPACE_CHARACTER:
			whitespaceCharacterInBody(p, token);
			break;
		case TokenType.COMMENT:
			appendComment(p, token);
			break;
		case TokenType.START_TAG:
			startTagInBody(p, token);
			break;
		case TokenType.END_TAG:
			endTagInBody(p, token);
			break;
		case TokenType.EOF: eofInBody(p, token);
	}
}
function whitespaceCharacterInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertCharacters(token);
}
function characterInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertCharacters(token);
	p.framesetOk = false;
}
function htmlStartTagInBody(p, token) {
	if (p.openElements.tmplCount === 0) p.treeAdapter.adoptAttributes(p.openElements.items[0], token.attrs);
}
function bodyStartTagInBody(p, token) {
	const bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
	if (bodyElement && p.openElements.tmplCount === 0) {
		p.framesetOk = false;
		p.treeAdapter.adoptAttributes(bodyElement, token.attrs);
	}
}
function framesetStartTagInBody(p, token) {
	const bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
	if (p.framesetOk && bodyElement) {
		p.treeAdapter.detachNode(bodyElement);
		p.openElements.popAllUpToHtmlElement();
		p._insertElement(token, NS.HTML);
		p.insertionMode = InsertionMode.IN_FRAMESET;
	}
}
function addressStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._insertElement(token, NS.HTML);
}
function numberedHeaderStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	if (p.openElements.currentTagId !== void 0 && NUMBERED_HEADERS.has(p.openElements.currentTagId)) p.openElements.pop();
	p._insertElement(token, NS.HTML);
}
function preStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._insertElement(token, NS.HTML);
	p.skipNextNewLine = true;
	p.framesetOk = false;
}
function formStartTagInBody(p, token) {
	const inTemplate = p.openElements.tmplCount > 0;
	if (!p.formElement || inTemplate) {
		if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
		p._insertElement(token, NS.HTML);
		if (!inTemplate) p.formElement = p.openElements.current;
	}
}
function listItemStartTagInBody(p, token) {
	p.framesetOk = false;
	const tn = token.tagID;
	for (let i = p.openElements.stackTop; i >= 0; i--) {
		const elementId = p.openElements.tagIDs[i];
		if (tn === TAG_ID.LI && elementId === TAG_ID.LI || (tn === TAG_ID.DD || tn === TAG_ID.DT) && (elementId === TAG_ID.DD || elementId === TAG_ID.DT)) {
			p.openElements.generateImpliedEndTagsWithExclusion(elementId);
			p.openElements.popUntilTagNamePopped(elementId);
			break;
		}
		if (elementId !== TAG_ID.ADDRESS && elementId !== TAG_ID.DIV && elementId !== TAG_ID.P && p._isSpecialElement(p.openElements.items[i], elementId)) break;
	}
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._insertElement(token, NS.HTML);
}
function plaintextStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._insertElement(token, NS.HTML);
	p.tokenizer.state = TokenizerMode.PLAINTEXT;
}
function buttonStartTagInBody(p, token) {
	if (p.openElements.hasInScope(TAG_ID.BUTTON)) {
		p.openElements.generateImpliedEndTags();
		p.openElements.popUntilTagNamePopped(TAG_ID.BUTTON);
	}
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS.HTML);
	p.framesetOk = false;
}
function aStartTagInBody(p, token) {
	const activeElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName(TAG_NAMES.A);
	if (activeElementEntry) {
		callAdoptionAgency(p, token);
		p.openElements.remove(activeElementEntry.element);
		p.activeFormattingElements.removeEntry(activeElementEntry);
	}
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS.HTML);
	p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function bStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS.HTML);
	p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function nobrStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	if (p.openElements.hasInScope(TAG_ID.NOBR)) {
		callAdoptionAgency(p, token);
		p._reconstructActiveFormattingElements();
	}
	p._insertElement(token, NS.HTML);
	p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function appletStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS.HTML);
	p.activeFormattingElements.insertMarker();
	p.framesetOk = false;
}
function tableStartTagInBody(p, token) {
	if (p.treeAdapter.getDocumentMode(p.document) !== DOCUMENT_MODE.QUIRKS && p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._insertElement(token, NS.HTML);
	p.framesetOk = false;
	p.insertionMode = InsertionMode.IN_TABLE;
}
function areaStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._appendElement(token, NS.HTML);
	p.framesetOk = false;
	token.ackSelfClosing = true;
}
function isHiddenInput(token) {
	const inputType = getTokenAttr(token, ATTRS.TYPE);
	return inputType != null && inputType.toLowerCase() === HIDDEN_INPUT_TYPE;
}
function inputStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._appendElement(token, NS.HTML);
	if (!isHiddenInput(token)) p.framesetOk = false;
	token.ackSelfClosing = true;
}
function paramStartTagInBody(p, token) {
	p._appendElement(token, NS.HTML);
	token.ackSelfClosing = true;
}
function hrStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._appendElement(token, NS.HTML);
	p.framesetOk = false;
	token.ackSelfClosing = true;
}
function imageStartTagInBody(p, token) {
	token.tagName = TAG_NAMES.IMG;
	token.tagID = TAG_ID.IMG;
	areaStartTagInBody(p, token);
}
function textareaStartTagInBody(p, token) {
	p._insertElement(token, NS.HTML);
	p.skipNextNewLine = true;
	p.tokenizer.state = TokenizerMode.RCDATA;
	p.originalInsertionMode = p.insertionMode;
	p.framesetOk = false;
	p.insertionMode = InsertionMode.TEXT;
}
function xmpStartTagInBody(p, token) {
	if (p.openElements.hasInButtonScope(TAG_ID.P)) p._closePElement();
	p._reconstructActiveFormattingElements();
	p.framesetOk = false;
	p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
}
function iframeStartTagInBody(p, token) {
	p.framesetOk = false;
	p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
}
function rawTextStartTagInBody(p, token) {
	p._switchToTextParsing(token, TokenizerMode.RAWTEXT);
}
function selectStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS.HTML);
	p.framesetOk = false;
	p.insertionMode = p.insertionMode === InsertionMode.IN_TABLE || p.insertionMode === InsertionMode.IN_CAPTION || p.insertionMode === InsertionMode.IN_TABLE_BODY || p.insertionMode === InsertionMode.IN_ROW || p.insertionMode === InsertionMode.IN_CELL ? InsertionMode.IN_SELECT_IN_TABLE : InsertionMode.IN_SELECT;
}
function optgroupStartTagInBody(p, token) {
	if (p.openElements.currentTagId === TAG_ID.OPTION) p.openElements.pop();
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS.HTML);
}
function rbStartTagInBody(p, token) {
	if (p.openElements.hasInScope(TAG_ID.RUBY)) p.openElements.generateImpliedEndTags();
	p._insertElement(token, NS.HTML);
}
function rtStartTagInBody(p, token) {
	if (p.openElements.hasInScope(TAG_ID.RUBY)) p.openElements.generateImpliedEndTagsWithExclusion(TAG_ID.RTC);
	p._insertElement(token, NS.HTML);
}
function mathStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	adjustTokenMathMLAttrs(token);
	adjustTokenXMLAttrs(token);
	if (token.selfClosing) p._appendElement(token, NS.MATHML);
	else p._insertElement(token, NS.MATHML);
	token.ackSelfClosing = true;
}
function svgStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	adjustTokenSVGAttrs(token);
	adjustTokenXMLAttrs(token);
	if (token.selfClosing) p._appendElement(token, NS.SVG);
	else p._insertElement(token, NS.SVG);
	token.ackSelfClosing = true;
}
function genericStartTagInBody(p, token) {
	p._reconstructActiveFormattingElements();
	p._insertElement(token, NS.HTML);
}
function startTagInBody(p, token) {
	switch (token.tagID) {
		case TAG_ID.I:
		case TAG_ID.S:
		case TAG_ID.B:
		case TAG_ID.U:
		case TAG_ID.EM:
		case TAG_ID.TT:
		case TAG_ID.BIG:
		case TAG_ID.CODE:
		case TAG_ID.FONT:
		case TAG_ID.SMALL:
		case TAG_ID.STRIKE:
		case TAG_ID.STRONG:
			bStartTagInBody(p, token);
			break;
		case TAG_ID.A:
			aStartTagInBody(p, token);
			break;
		case TAG_ID.H1:
		case TAG_ID.H2:
		case TAG_ID.H3:
		case TAG_ID.H4:
		case TAG_ID.H5:
		case TAG_ID.H6:
			numberedHeaderStartTagInBody(p, token);
			break;
		case TAG_ID.P:
		case TAG_ID.DL:
		case TAG_ID.OL:
		case TAG_ID.UL:
		case TAG_ID.DIV:
		case TAG_ID.DIR:
		case TAG_ID.NAV:
		case TAG_ID.MAIN:
		case TAG_ID.MENU:
		case TAG_ID.ASIDE:
		case TAG_ID.CENTER:
		case TAG_ID.FIGURE:
		case TAG_ID.FOOTER:
		case TAG_ID.HEADER:
		case TAG_ID.HGROUP:
		case TAG_ID.DIALOG:
		case TAG_ID.DETAILS:
		case TAG_ID.ADDRESS:
		case TAG_ID.ARTICLE:
		case TAG_ID.SEARCH:
		case TAG_ID.SECTION:
		case TAG_ID.SUMMARY:
		case TAG_ID.FIELDSET:
		case TAG_ID.BLOCKQUOTE:
		case TAG_ID.FIGCAPTION:
			addressStartTagInBody(p, token);
			break;
		case TAG_ID.LI:
		case TAG_ID.DD:
		case TAG_ID.DT:
			listItemStartTagInBody(p, token);
			break;
		case TAG_ID.BR:
		case TAG_ID.IMG:
		case TAG_ID.WBR:
		case TAG_ID.AREA:
		case TAG_ID.EMBED:
		case TAG_ID.KEYGEN:
			areaStartTagInBody(p, token);
			break;
		case TAG_ID.HR:
			hrStartTagInBody(p, token);
			break;
		case TAG_ID.RB:
		case TAG_ID.RTC:
			rbStartTagInBody(p, token);
			break;
		case TAG_ID.RT:
		case TAG_ID.RP:
			rtStartTagInBody(p, token);
			break;
		case TAG_ID.PRE:
		case TAG_ID.LISTING:
			preStartTagInBody(p, token);
			break;
		case TAG_ID.XMP:
			xmpStartTagInBody(p, token);
			break;
		case TAG_ID.SVG:
			svgStartTagInBody(p, token);
			break;
		case TAG_ID.HTML:
			htmlStartTagInBody(p, token);
			break;
		case TAG_ID.BASE:
		case TAG_ID.LINK:
		case TAG_ID.META:
		case TAG_ID.STYLE:
		case TAG_ID.TITLE:
		case TAG_ID.SCRIPT:
		case TAG_ID.BGSOUND:
		case TAG_ID.BASEFONT:
		case TAG_ID.TEMPLATE:
			startTagInHead(p, token);
			break;
		case TAG_ID.BODY:
			bodyStartTagInBody(p, token);
			break;
		case TAG_ID.FORM:
			formStartTagInBody(p, token);
			break;
		case TAG_ID.NOBR:
			nobrStartTagInBody(p, token);
			break;
		case TAG_ID.MATH:
			mathStartTagInBody(p, token);
			break;
		case TAG_ID.TABLE:
			tableStartTagInBody(p, token);
			break;
		case TAG_ID.INPUT:
			inputStartTagInBody(p, token);
			break;
		case TAG_ID.PARAM:
		case TAG_ID.TRACK:
		case TAG_ID.SOURCE:
			paramStartTagInBody(p, token);
			break;
		case TAG_ID.IMAGE:
			imageStartTagInBody(p, token);
			break;
		case TAG_ID.BUTTON:
			buttonStartTagInBody(p, token);
			break;
		case TAG_ID.APPLET:
		case TAG_ID.OBJECT:
		case TAG_ID.MARQUEE:
			appletStartTagInBody(p, token);
			break;
		case TAG_ID.IFRAME:
			iframeStartTagInBody(p, token);
			break;
		case TAG_ID.SELECT:
			selectStartTagInBody(p, token);
			break;
		case TAG_ID.OPTION:
		case TAG_ID.OPTGROUP:
			optgroupStartTagInBody(p, token);
			break;
		case TAG_ID.NOEMBED:
		case TAG_ID.NOFRAMES:
			rawTextStartTagInBody(p, token);
			break;
		case TAG_ID.FRAMESET:
			framesetStartTagInBody(p, token);
			break;
		case TAG_ID.TEXTAREA:
			textareaStartTagInBody(p, token);
			break;
		case TAG_ID.NOSCRIPT:
			if (p.options.scriptingEnabled) rawTextStartTagInBody(p, token);
			else genericStartTagInBody(p, token);
			break;
		case TAG_ID.PLAINTEXT:
			plaintextStartTagInBody(p, token);
			break;
		case TAG_ID.COL:
		case TAG_ID.TH:
		case TAG_ID.TD:
		case TAG_ID.TR:
		case TAG_ID.HEAD:
		case TAG_ID.FRAME:
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
		case TAG_ID.CAPTION:
		case TAG_ID.COLGROUP: break;
		default: genericStartTagInBody(p, token);
	}
}
function bodyEndTagInBody(p, token) {
	if (p.openElements.hasInScope(TAG_ID.BODY)) {
		p.insertionMode = InsertionMode.AFTER_BODY;
		if (p.options.sourceCodeLocationInfo) {
			const bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
			if (bodyElement) p._setEndLocation(bodyElement, token);
		}
	}
}
function htmlEndTagInBody(p, token) {
	if (p.openElements.hasInScope(TAG_ID.BODY)) {
		p.insertionMode = InsertionMode.AFTER_BODY;
		endTagAfterBody(p, token);
	}
}
function addressEndTagInBody(p, token) {
	const tn = token.tagID;
	if (p.openElements.hasInScope(tn)) {
		p.openElements.generateImpliedEndTags();
		p.openElements.popUntilTagNamePopped(tn);
	}
}
function formEndTagInBody(p) {
	const inTemplate = p.openElements.tmplCount > 0;
	const { formElement } = p;
	if (!inTemplate) p.formElement = null;
	if ((formElement || inTemplate) && p.openElements.hasInScope(TAG_ID.FORM)) {
		p.openElements.generateImpliedEndTags();
		if (inTemplate) p.openElements.popUntilTagNamePopped(TAG_ID.FORM);
		else if (formElement) p.openElements.remove(formElement);
	}
}
function pEndTagInBody(p) {
	if (!p.openElements.hasInButtonScope(TAG_ID.P)) p._insertFakeElement(TAG_NAMES.P, TAG_ID.P);
	p._closePElement();
}
function liEndTagInBody(p) {
	if (p.openElements.hasInListItemScope(TAG_ID.LI)) {
		p.openElements.generateImpliedEndTagsWithExclusion(TAG_ID.LI);
		p.openElements.popUntilTagNamePopped(TAG_ID.LI);
	}
}
function ddEndTagInBody(p, token) {
	const tn = token.tagID;
	if (p.openElements.hasInScope(tn)) {
		p.openElements.generateImpliedEndTagsWithExclusion(tn);
		p.openElements.popUntilTagNamePopped(tn);
	}
}
function numberedHeaderEndTagInBody(p) {
	if (p.openElements.hasNumberedHeaderInScope()) {
		p.openElements.generateImpliedEndTags();
		p.openElements.popUntilNumberedHeaderPopped();
	}
}
function appletEndTagInBody(p, token) {
	const tn = token.tagID;
	if (p.openElements.hasInScope(tn)) {
		p.openElements.generateImpliedEndTags();
		p.openElements.popUntilTagNamePopped(tn);
		p.activeFormattingElements.clearToLastMarker();
	}
}
function brEndTagInBody(p) {
	p._reconstructActiveFormattingElements();
	p._insertFakeElement(TAG_NAMES.BR, TAG_ID.BR);
	p.openElements.pop();
	p.framesetOk = false;
}
function genericEndTagInBody(p, token) {
	const tn = token.tagName;
	const tid = token.tagID;
	for (let i = p.openElements.stackTop; i > 0; i--) {
		const element = p.openElements.items[i];
		const elementId = p.openElements.tagIDs[i];
		if (tid === elementId && (tid !== TAG_ID.UNKNOWN || p.treeAdapter.getTagName(element) === tn)) {
			p.openElements.generateImpliedEndTagsWithExclusion(tid);
			if (p.openElements.stackTop >= i) p.openElements.shortenToLength(i);
			break;
		}
		if (p._isSpecialElement(element, elementId)) break;
	}
}
function endTagInBody(p, token) {
	switch (token.tagID) {
		case TAG_ID.A:
		case TAG_ID.B:
		case TAG_ID.I:
		case TAG_ID.S:
		case TAG_ID.U:
		case TAG_ID.EM:
		case TAG_ID.TT:
		case TAG_ID.BIG:
		case TAG_ID.CODE:
		case TAG_ID.FONT:
		case TAG_ID.NOBR:
		case TAG_ID.SMALL:
		case TAG_ID.STRIKE:
		case TAG_ID.STRONG:
			callAdoptionAgency(p, token);
			break;
		case TAG_ID.P:
			pEndTagInBody(p);
			break;
		case TAG_ID.DL:
		case TAG_ID.UL:
		case TAG_ID.OL:
		case TAG_ID.DIR:
		case TAG_ID.DIV:
		case TAG_ID.NAV:
		case TAG_ID.PRE:
		case TAG_ID.MAIN:
		case TAG_ID.MENU:
		case TAG_ID.ASIDE:
		case TAG_ID.BUTTON:
		case TAG_ID.CENTER:
		case TAG_ID.FIGURE:
		case TAG_ID.FOOTER:
		case TAG_ID.HEADER:
		case TAG_ID.HGROUP:
		case TAG_ID.DIALOG:
		case TAG_ID.ADDRESS:
		case TAG_ID.ARTICLE:
		case TAG_ID.DETAILS:
		case TAG_ID.SEARCH:
		case TAG_ID.SECTION:
		case TAG_ID.SUMMARY:
		case TAG_ID.LISTING:
		case TAG_ID.FIELDSET:
		case TAG_ID.BLOCKQUOTE:
		case TAG_ID.FIGCAPTION:
			addressEndTagInBody(p, token);
			break;
		case TAG_ID.LI:
			liEndTagInBody(p);
			break;
		case TAG_ID.DD:
		case TAG_ID.DT:
			ddEndTagInBody(p, token);
			break;
		case TAG_ID.H1:
		case TAG_ID.H2:
		case TAG_ID.H3:
		case TAG_ID.H4:
		case TAG_ID.H5:
		case TAG_ID.H6:
			numberedHeaderEndTagInBody(p);
			break;
		case TAG_ID.BR:
			brEndTagInBody(p);
			break;
		case TAG_ID.BODY:
			bodyEndTagInBody(p, token);
			break;
		case TAG_ID.HTML:
			htmlEndTagInBody(p, token);
			break;
		case TAG_ID.FORM:
			formEndTagInBody(p);
			break;
		case TAG_ID.APPLET:
		case TAG_ID.OBJECT:
		case TAG_ID.MARQUEE:
			appletEndTagInBody(p, token);
			break;
		case TAG_ID.TEMPLATE:
			templateEndTagInHead(p, token);
			break;
		default: genericEndTagInBody(p, token);
	}
}
function eofInBody(p, token) {
	if (p.tmplInsertionModeStack.length > 0) eofInTemplate(p, token);
	else stopParsing(p, token);
}
function endTagInText(p, token) {
	var _a;
	if (token.tagID === TAG_ID.SCRIPT) (_a = p.scriptHandler) === null || _a === void 0 || _a.call(p, p.openElements.current);
	p.openElements.pop();
	p.insertionMode = p.originalInsertionMode;
}
function eofInText(p, token) {
	p._err(token, ERR.eofInElementThatCanContainOnlyText);
	p.openElements.pop();
	p.insertionMode = p.originalInsertionMode;
	p.onEof(token);
}
function characterInTable(p, token) {
	if (p.openElements.currentTagId !== void 0 && TABLE_STRUCTURE_TAGS.has(p.openElements.currentTagId)) {
		p.pendingCharacterTokens.length = 0;
		p.hasNonWhitespacePendingCharacterToken = false;
		p.originalInsertionMode = p.insertionMode;
		p.insertionMode = InsertionMode.IN_TABLE_TEXT;
		switch (token.type) {
			case TokenType.CHARACTER:
				characterInTableText(p, token);
				break;
			case TokenType.WHITESPACE_CHARACTER: whitespaceCharacterInTableText(p, token);
		}
	} else tokenInTable(p, token);
}
function captionStartTagInTable(p, token) {
	p.openElements.clearBackToTableContext();
	p.activeFormattingElements.insertMarker();
	p._insertElement(token, NS.HTML);
	p.insertionMode = InsertionMode.IN_CAPTION;
}
function colgroupStartTagInTable(p, token) {
	p.openElements.clearBackToTableContext();
	p._insertElement(token, NS.HTML);
	p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
}
function colStartTagInTable(p, token) {
	p.openElements.clearBackToTableContext();
	p._insertFakeElement(TAG_NAMES.COLGROUP, TAG_ID.COLGROUP);
	p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
	startTagInColumnGroup(p, token);
}
function tbodyStartTagInTable(p, token) {
	p.openElements.clearBackToTableContext();
	p._insertElement(token, NS.HTML);
	p.insertionMode = InsertionMode.IN_TABLE_BODY;
}
function tdStartTagInTable(p, token) {
	p.openElements.clearBackToTableContext();
	p._insertFakeElement(TAG_NAMES.TBODY, TAG_ID.TBODY);
	p.insertionMode = InsertionMode.IN_TABLE_BODY;
	startTagInTableBody(p, token);
}
function tableStartTagInTable(p, token) {
	if (p.openElements.hasInTableScope(TAG_ID.TABLE)) {
		p.openElements.popUntilTagNamePopped(TAG_ID.TABLE);
		p._resetInsertionMode();
		p._processStartTag(token);
	}
}
function inputStartTagInTable(p, token) {
	if (isHiddenInput(token)) p._appendElement(token, NS.HTML);
	else tokenInTable(p, token);
	token.ackSelfClosing = true;
}
function formStartTagInTable(p, token) {
	if (!p.formElement && p.openElements.tmplCount === 0) {
		p._insertElement(token, NS.HTML);
		p.formElement = p.openElements.current;
		p.openElements.pop();
	}
}
function startTagInTable(p, token) {
	switch (token.tagID) {
		case TAG_ID.TD:
		case TAG_ID.TH:
		case TAG_ID.TR:
			tdStartTagInTable(p, token);
			break;
		case TAG_ID.STYLE:
		case TAG_ID.SCRIPT:
		case TAG_ID.TEMPLATE:
			startTagInHead(p, token);
			break;
		case TAG_ID.COL:
			colStartTagInTable(p, token);
			break;
		case TAG_ID.FORM:
			formStartTagInTable(p, token);
			break;
		case TAG_ID.TABLE:
			tableStartTagInTable(p, token);
			break;
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
			tbodyStartTagInTable(p, token);
			break;
		case TAG_ID.INPUT:
			inputStartTagInTable(p, token);
			break;
		case TAG_ID.CAPTION:
			captionStartTagInTable(p, token);
			break;
		case TAG_ID.COLGROUP:
			colgroupStartTagInTable(p, token);
			break;
		default: tokenInTable(p, token);
	}
}
function endTagInTable(p, token) {
	switch (token.tagID) {
		case TAG_ID.TABLE:
			if (p.openElements.hasInTableScope(TAG_ID.TABLE)) {
				p.openElements.popUntilTagNamePopped(TAG_ID.TABLE);
				p._resetInsertionMode();
			}
			break;
		case TAG_ID.TEMPLATE:
			templateEndTagInHead(p, token);
			break;
		case TAG_ID.BODY:
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.HTML:
		case TAG_ID.TBODY:
		case TAG_ID.TD:
		case TAG_ID.TFOOT:
		case TAG_ID.TH:
		case TAG_ID.THEAD:
		case TAG_ID.TR: break;
		default: tokenInTable(p, token);
	}
}
function tokenInTable(p, token) {
	const savedFosterParentingState = p.fosterParentingEnabled;
	p.fosterParentingEnabled = true;
	modeInBody(p, token);
	p.fosterParentingEnabled = savedFosterParentingState;
}
function whitespaceCharacterInTableText(p, token) {
	p.pendingCharacterTokens.push(token);
}
function characterInTableText(p, token) {
	p.pendingCharacterTokens.push(token);
	p.hasNonWhitespacePendingCharacterToken = true;
}
function tokenInTableText(p, token) {
	let i = 0;
	if (p.hasNonWhitespacePendingCharacterToken) for (; i < p.pendingCharacterTokens.length; i++) tokenInTable(p, p.pendingCharacterTokens[i]);
	else for (; i < p.pendingCharacterTokens.length; i++) p._insertCharacters(p.pendingCharacterTokens[i]);
	p.insertionMode = p.originalInsertionMode;
	p._processToken(token);
}
var TABLE_VOID_ELEMENTS = /* @__PURE__ */ new Set([
	TAG_ID.CAPTION,
	TAG_ID.COL,
	TAG_ID.COLGROUP,
	TAG_ID.TBODY,
	TAG_ID.TD,
	TAG_ID.TFOOT,
	TAG_ID.TH,
	TAG_ID.THEAD,
	TAG_ID.TR
]);
function startTagInCaption(p, token) {
	const tn = token.tagID;
	if (TABLE_VOID_ELEMENTS.has(tn)) {
		if (p.openElements.hasInTableScope(TAG_ID.CAPTION)) {
			p.openElements.generateImpliedEndTags();
			p.openElements.popUntilTagNamePopped(TAG_ID.CAPTION);
			p.activeFormattingElements.clearToLastMarker();
			p.insertionMode = InsertionMode.IN_TABLE;
			startTagInTable(p, token);
		}
	} else startTagInBody(p, token);
}
function endTagInCaption(p, token) {
	const tn = token.tagID;
	switch (tn) {
		case TAG_ID.CAPTION:
		case TAG_ID.TABLE:
			if (p.openElements.hasInTableScope(TAG_ID.CAPTION)) {
				p.openElements.generateImpliedEndTags();
				p.openElements.popUntilTagNamePopped(TAG_ID.CAPTION);
				p.activeFormattingElements.clearToLastMarker();
				p.insertionMode = InsertionMode.IN_TABLE;
				if (tn === TAG_ID.TABLE) endTagInTable(p, token);
			}
			break;
		case TAG_ID.BODY:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.HTML:
		case TAG_ID.TBODY:
		case TAG_ID.TD:
		case TAG_ID.TFOOT:
		case TAG_ID.TH:
		case TAG_ID.THEAD:
		case TAG_ID.TR: break;
		default: endTagInBody(p, token);
	}
}
function startTagInColumnGroup(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.COL:
			p._appendElement(token, NS.HTML);
			token.ackSelfClosing = true;
			break;
		case TAG_ID.TEMPLATE:
			startTagInHead(p, token);
			break;
		default: tokenInColumnGroup(p, token);
	}
}
function endTagInColumnGroup(p, token) {
	switch (token.tagID) {
		case TAG_ID.COLGROUP:
			if (p.openElements.currentTagId === TAG_ID.COLGROUP) {
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE;
			}
			break;
		case TAG_ID.TEMPLATE:
			templateEndTagInHead(p, token);
			break;
		case TAG_ID.COL: break;
		default: tokenInColumnGroup(p, token);
	}
}
function tokenInColumnGroup(p, token) {
	if (p.openElements.currentTagId === TAG_ID.COLGROUP) {
		p.openElements.pop();
		p.insertionMode = InsertionMode.IN_TABLE;
		p._processToken(token);
	}
}
function startTagInTableBody(p, token) {
	switch (token.tagID) {
		case TAG_ID.TR:
			p.openElements.clearBackToTableBodyContext();
			p._insertElement(token, NS.HTML);
			p.insertionMode = InsertionMode.IN_ROW;
			break;
		case TAG_ID.TH:
		case TAG_ID.TD:
			p.openElements.clearBackToTableBodyContext();
			p._insertFakeElement(TAG_NAMES.TR, TAG_ID.TR);
			p.insertionMode = InsertionMode.IN_ROW;
			startTagInRow(p, token);
			break;
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
			if (p.openElements.hasTableBodyContextInTableScope()) {
				p.openElements.clearBackToTableBodyContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE;
				startTagInTable(p, token);
			}
			break;
		default: startTagInTable(p, token);
	}
}
function endTagInTableBody(p, token) {
	const tn = token.tagID;
	switch (token.tagID) {
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
			if (p.openElements.hasInTableScope(tn)) {
				p.openElements.clearBackToTableBodyContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE;
			}
			break;
		case TAG_ID.TABLE:
			if (p.openElements.hasTableBodyContextInTableScope()) {
				p.openElements.clearBackToTableBodyContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE;
				endTagInTable(p, token);
			}
			break;
		case TAG_ID.BODY:
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.HTML:
		case TAG_ID.TD:
		case TAG_ID.TH:
		case TAG_ID.TR: break;
		default: endTagInTable(p, token);
	}
}
function startTagInRow(p, token) {
	switch (token.tagID) {
		case TAG_ID.TH:
		case TAG_ID.TD:
			p.openElements.clearBackToTableRowContext();
			p._insertElement(token, NS.HTML);
			p.insertionMode = InsertionMode.IN_CELL;
			p.activeFormattingElements.insertMarker();
			break;
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
		case TAG_ID.TR:
			if (p.openElements.hasInTableScope(TAG_ID.TR)) {
				p.openElements.clearBackToTableRowContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE_BODY;
				startTagInTableBody(p, token);
			}
			break;
		default: startTagInTable(p, token);
	}
}
function endTagInRow(p, token) {
	switch (token.tagID) {
		case TAG_ID.TR:
			if (p.openElements.hasInTableScope(TAG_ID.TR)) {
				p.openElements.clearBackToTableRowContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE_BODY;
			}
			break;
		case TAG_ID.TABLE:
			if (p.openElements.hasInTableScope(TAG_ID.TR)) {
				p.openElements.clearBackToTableRowContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE_BODY;
				endTagInTableBody(p, token);
			}
			break;
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
			if (p.openElements.hasInTableScope(token.tagID) || p.openElements.hasInTableScope(TAG_ID.TR)) {
				p.openElements.clearBackToTableRowContext();
				p.openElements.pop();
				p.insertionMode = InsertionMode.IN_TABLE_BODY;
				endTagInTableBody(p, token);
			}
			break;
		case TAG_ID.BODY:
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.HTML:
		case TAG_ID.TD:
		case TAG_ID.TH: break;
		default: endTagInTable(p, token);
	}
}
function startTagInCell(p, token) {
	const tn = token.tagID;
	if (TABLE_VOID_ELEMENTS.has(tn)) {
		if (p.openElements.hasInTableScope(TAG_ID.TD) || p.openElements.hasInTableScope(TAG_ID.TH)) {
			p._closeTableCell();
			startTagInRow(p, token);
		}
	} else startTagInBody(p, token);
}
function endTagInCell(p, token) {
	const tn = token.tagID;
	switch (tn) {
		case TAG_ID.TD:
		case TAG_ID.TH:
			if (p.openElements.hasInTableScope(tn)) {
				p.openElements.generateImpliedEndTags();
				p.openElements.popUntilTagNamePopped(tn);
				p.activeFormattingElements.clearToLastMarker();
				p.insertionMode = InsertionMode.IN_ROW;
			}
			break;
		case TAG_ID.TABLE:
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
		case TAG_ID.TR:
			if (p.openElements.hasInTableScope(tn)) {
				p._closeTableCell();
				endTagInRow(p, token);
			}
			break;
		case TAG_ID.BODY:
		case TAG_ID.CAPTION:
		case TAG_ID.COL:
		case TAG_ID.COLGROUP:
		case TAG_ID.HTML: break;
		default: endTagInBody(p, token);
	}
}
function startTagInSelect(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.OPTION:
			if (p.openElements.currentTagId === TAG_ID.OPTION) p.openElements.pop();
			p._insertElement(token, NS.HTML);
			break;
		case TAG_ID.OPTGROUP:
			if (p.openElements.currentTagId === TAG_ID.OPTION) p.openElements.pop();
			if (p.openElements.currentTagId === TAG_ID.OPTGROUP) p.openElements.pop();
			p._insertElement(token, NS.HTML);
			break;
		case TAG_ID.HR:
			if (p.openElements.currentTagId === TAG_ID.OPTION) p.openElements.pop();
			if (p.openElements.currentTagId === TAG_ID.OPTGROUP) p.openElements.pop();
			p._appendElement(token, NS.HTML);
			token.ackSelfClosing = true;
			break;
		case TAG_ID.INPUT:
		case TAG_ID.KEYGEN:
		case TAG_ID.TEXTAREA:
		case TAG_ID.SELECT:
			if (p.openElements.hasInSelectScope(TAG_ID.SELECT)) {
				p.openElements.popUntilTagNamePopped(TAG_ID.SELECT);
				p._resetInsertionMode();
				if (token.tagID !== TAG_ID.SELECT) p._processStartTag(token);
			}
			break;
		case TAG_ID.SCRIPT:
		case TAG_ID.TEMPLATE: startTagInHead(p, token);
	}
}
function endTagInSelect(p, token) {
	switch (token.tagID) {
		case TAG_ID.OPTGROUP:
			if (p.openElements.stackTop > 0 && p.openElements.currentTagId === TAG_ID.OPTION && p.openElements.tagIDs[p.openElements.stackTop - 1] === TAG_ID.OPTGROUP) p.openElements.pop();
			if (p.openElements.currentTagId === TAG_ID.OPTGROUP) p.openElements.pop();
			break;
		case TAG_ID.OPTION:
			if (p.openElements.currentTagId === TAG_ID.OPTION) p.openElements.pop();
			break;
		case TAG_ID.SELECT:
			if (p.openElements.hasInSelectScope(TAG_ID.SELECT)) {
				p.openElements.popUntilTagNamePopped(TAG_ID.SELECT);
				p._resetInsertionMode();
			}
			break;
		case TAG_ID.TEMPLATE: templateEndTagInHead(p, token);
	}
}
function startTagInSelectInTable(p, token) {
	const tn = token.tagID;
	if (tn === TAG_ID.CAPTION || tn === TAG_ID.TABLE || tn === TAG_ID.TBODY || tn === TAG_ID.TFOOT || tn === TAG_ID.THEAD || tn === TAG_ID.TR || tn === TAG_ID.TD || tn === TAG_ID.TH) {
		p.openElements.popUntilTagNamePopped(TAG_ID.SELECT);
		p._resetInsertionMode();
		p._processStartTag(token);
	} else startTagInSelect(p, token);
}
function endTagInSelectInTable(p, token) {
	const tn = token.tagID;
	if (tn === TAG_ID.CAPTION || tn === TAG_ID.TABLE || tn === TAG_ID.TBODY || tn === TAG_ID.TFOOT || tn === TAG_ID.THEAD || tn === TAG_ID.TR || tn === TAG_ID.TD || tn === TAG_ID.TH) {
		if (p.openElements.hasInTableScope(tn)) {
			p.openElements.popUntilTagNamePopped(TAG_ID.SELECT);
			p._resetInsertionMode();
			p.onEndTag(token);
		}
	} else endTagInSelect(p, token);
}
function startTagInTemplate(p, token) {
	switch (token.tagID) {
		case TAG_ID.BASE:
		case TAG_ID.BASEFONT:
		case TAG_ID.BGSOUND:
		case TAG_ID.LINK:
		case TAG_ID.META:
		case TAG_ID.NOFRAMES:
		case TAG_ID.SCRIPT:
		case TAG_ID.STYLE:
		case TAG_ID.TEMPLATE:
		case TAG_ID.TITLE:
			startTagInHead(p, token);
			break;
		case TAG_ID.CAPTION:
		case TAG_ID.COLGROUP:
		case TAG_ID.TBODY:
		case TAG_ID.TFOOT:
		case TAG_ID.THEAD:
			p.tmplInsertionModeStack[0] = InsertionMode.IN_TABLE;
			p.insertionMode = InsertionMode.IN_TABLE;
			startTagInTable(p, token);
			break;
		case TAG_ID.COL:
			p.tmplInsertionModeStack[0] = InsertionMode.IN_COLUMN_GROUP;
			p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
			startTagInColumnGroup(p, token);
			break;
		case TAG_ID.TR:
			p.tmplInsertionModeStack[0] = InsertionMode.IN_TABLE_BODY;
			p.insertionMode = InsertionMode.IN_TABLE_BODY;
			startTagInTableBody(p, token);
			break;
		case TAG_ID.TD:
		case TAG_ID.TH:
			p.tmplInsertionModeStack[0] = InsertionMode.IN_ROW;
			p.insertionMode = InsertionMode.IN_ROW;
			startTagInRow(p, token);
			break;
		default:
			p.tmplInsertionModeStack[0] = InsertionMode.IN_BODY;
			p.insertionMode = InsertionMode.IN_BODY;
			startTagInBody(p, token);
	}
}
function endTagInTemplate(p, token) {
	if (token.tagID === TAG_ID.TEMPLATE) templateEndTagInHead(p, token);
}
function eofInTemplate(p, token) {
	if (p.openElements.tmplCount > 0) {
		p.openElements.popUntilTagNamePopped(TAG_ID.TEMPLATE);
		p.activeFormattingElements.clearToLastMarker();
		p.tmplInsertionModeStack.shift();
		p._resetInsertionMode();
		p.onEof(token);
	} else stopParsing(p, token);
}
function startTagAfterBody(p, token) {
	if (token.tagID === TAG_ID.HTML) startTagInBody(p, token);
	else tokenAfterBody(p, token);
}
function endTagAfterBody(p, token) {
	var _a;
	if (token.tagID === TAG_ID.HTML) {
		if (!p.fragmentContext) p.insertionMode = InsertionMode.AFTER_AFTER_BODY;
		if (p.options.sourceCodeLocationInfo && p.openElements.tagIDs[0] === TAG_ID.HTML) {
			p._setEndLocation(p.openElements.items[0], token);
			const bodyElement = p.openElements.items[1];
			if (bodyElement && !((_a = p.treeAdapter.getNodeSourceCodeLocation(bodyElement)) === null || _a === void 0 ? void 0 : _a.endTag)) p._setEndLocation(bodyElement, token);
		}
	} else tokenAfterBody(p, token);
}
function tokenAfterBody(p, token) {
	p.insertionMode = InsertionMode.IN_BODY;
	modeInBody(p, token);
}
function startTagInFrameset(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.FRAMESET:
			p._insertElement(token, NS.HTML);
			break;
		case TAG_ID.FRAME:
			p._appendElement(token, NS.HTML);
			token.ackSelfClosing = true;
			break;
		case TAG_ID.NOFRAMES: startTagInHead(p, token);
	}
}
function endTagInFrameset(p, token) {
	if (token.tagID === TAG_ID.FRAMESET && !p.openElements.isRootHtmlElementCurrent()) {
		p.openElements.pop();
		if (!p.fragmentContext && p.openElements.currentTagId !== TAG_ID.FRAMESET) p.insertionMode = InsertionMode.AFTER_FRAMESET;
	}
}
function startTagAfterFrameset(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.NOFRAMES: startTagInHead(p, token);
	}
}
function endTagAfterFrameset(p, token) {
	if (token.tagID === TAG_ID.HTML) p.insertionMode = InsertionMode.AFTER_AFTER_FRAMESET;
}
function startTagAfterAfterBody(p, token) {
	if (token.tagID === TAG_ID.HTML) startTagInBody(p, token);
	else tokenAfterAfterBody(p, token);
}
function tokenAfterAfterBody(p, token) {
	p.insertionMode = InsertionMode.IN_BODY;
	modeInBody(p, token);
}
function startTagAfterAfterFrameset(p, token) {
	switch (token.tagID) {
		case TAG_ID.HTML:
			startTagInBody(p, token);
			break;
		case TAG_ID.NOFRAMES: startTagInHead(p, token);
	}
}
function nullCharacterInForeignContent(p, token) {
	token.chars = "�";
	p._insertCharacters(token);
}
function characterInForeignContent(p, token) {
	p._insertCharacters(token);
	p.framesetOk = false;
}
function popUntilHtmlOrIntegrationPoint(p) {
	while (p.treeAdapter.getNamespaceURI(p.openElements.current) !== NS.HTML && p.openElements.currentTagId !== void 0 && !p._isIntegrationPoint(p.openElements.currentTagId, p.openElements.current)) p.openElements.pop();
}
function startTagInForeignContent(p, token) {
	if (causesExit(token)) {
		popUntilHtmlOrIntegrationPoint(p);
		p._startTagOutsideForeignContent(token);
	} else {
		const current = p._getAdjustedCurrentElement();
		const currentNs = p.treeAdapter.getNamespaceURI(current);
		if (currentNs === NS.MATHML) adjustTokenMathMLAttrs(token);
		else if (currentNs === NS.SVG) {
			adjustTokenSVGTagName(token);
			adjustTokenSVGAttrs(token);
		}
		adjustTokenXMLAttrs(token);
		if (token.selfClosing) p._appendElement(token, currentNs);
		else p._insertElement(token, currentNs);
		token.ackSelfClosing = true;
	}
}
function endTagInForeignContent(p, token) {
	if (token.tagID === TAG_ID.P || token.tagID === TAG_ID.BR) {
		popUntilHtmlOrIntegrationPoint(p);
		p._endTagOutsideForeignContent(token);
		return;
	}
	for (let i = p.openElements.stackTop; i > 0; i--) {
		const element = p.openElements.items[i];
		if (p.treeAdapter.getNamespaceURI(element) === NS.HTML) {
			p._endTagOutsideForeignContent(token);
			break;
		}
		const tagName = p.treeAdapter.getTagName(element);
		if (tagName.toLowerCase() === token.tagName) {
			token.tagName = tagName;
			p.openElements.shortenToLength(i);
			break;
		}
	}
}
TAG_NAMES.AREA, TAG_NAMES.BASE, TAG_NAMES.BASEFONT, TAG_NAMES.BGSOUND, TAG_NAMES.BR, TAG_NAMES.COL, TAG_NAMES.EMBED, TAG_NAMES.FRAME, TAG_NAMES.HR, TAG_NAMES.IMG, TAG_NAMES.INPUT, TAG_NAMES.KEYGEN, TAG_NAMES.LINK, TAG_NAMES.META, TAG_NAMES.PARAM, TAG_NAMES.SOURCE, TAG_NAMES.TRACK, TAG_NAMES.WBR;
//#endregion
//#region node_modules/parse5/dist/index.js
/**
* Parses an HTML string.
*
* @param html Input HTML string.
* @param options Parsing options.
* @returns Document
*
* @example
*
* ```js
* const parse5 = require('parse5');
*
* const document = parse5.parse('<!DOCTYPE html><html><head></head><body>Hi there!</body></html>');
*
* console.log(document.childNodes[1].tagName); //> 'html'
*```
*/
function parse(html, options) {
	return Parser$1.parse(html, options);
}
function parseFragment(fragmentContext, html, options) {
	if (typeof fragmentContext === "string") {
		options = html;
		html = fragmentContext;
		fragmentContext = null;
	}
	const parser = Parser$1.getFragmentParser(fragmentContext, options);
	parser.tokenizer.write(html, true);
	return parser.getFragment();
}
//#endregion
//#region node_modules/unist-util-stringify-position/lib/index.js
/**
* @typedef {import('unist').Node} Node
* @typedef {import('unist').Point} Point
* @typedef {import('unist').Position} Position
*/
/**
* @typedef NodeLike
* @property {string} type
* @property {PositionLike | null | undefined} [position]
*
* @typedef PointLike
* @property {number | null | undefined} [line]
* @property {number | null | undefined} [column]
* @property {number | null | undefined} [offset]
*
* @typedef PositionLike
* @property {PointLike | null | undefined} [start]
* @property {PointLike | null | undefined} [end]
*/
/**
* Serialize the positional info of a point, position (start and end points),
* or node.
*
* @param {Node | NodeLike | Point | PointLike | Position | PositionLike | null | undefined} [value]
*   Node, position, or point.
* @returns {string}
*   Pretty printed positional info of a node (`string`).
*
*   In the format of a range `ls:cs-le:ce` (when given `node` or `position`)
*   or a point `l:c` (when given `point`), where `l` stands for line, `c` for
*   column, `s` for `start`, and `e` for end.
*   An empty string (`''`) is returned if the given value is neither `node`,
*   `position`, nor `point`.
*/
function stringifyPosition(value) {
	if (!value || typeof value !== "object") return "";
	if ("position" in value || "type" in value) return position(value.position);
	if ("start" in value || "end" in value) return position(value);
	if ("line" in value || "column" in value) return point(value);
	return "";
}
/**
* @param {Point | PointLike | null | undefined} point
* @returns {string}
*/
function point(point) {
	return index(point && point.line) + ":" + index(point && point.column);
}
/**
* @param {Position | PositionLike | null | undefined} pos
* @returns {string}
*/
function position(pos) {
	return point(pos && pos.start) + "-" + point(pos && pos.end);
}
/**
* @param {number | null | undefined} value
* @returns {number}
*/
function index(value) {
	return value && typeof value === "number" ? value : 1;
}
//#endregion
//#region node_modules/vfile-message/lib/index.js
/**
* @import {Node, Point, Position} from 'unist'
*/
/**
* @typedef {object & {type: string, position?: Position | undefined}} NodeLike
*
* @typedef Options
*   Configuration.
* @property {Array<Node> | null | undefined} [ancestors]
*   Stack of (inclusive) ancestor nodes surrounding the message (optional).
* @property {Error | null | undefined} [cause]
*   Original error cause of the message (optional).
* @property {Point | Position | null | undefined} [place]
*   Place of message (optional).
* @property {string | null | undefined} [ruleId]
*   Category of message (optional, example: `'my-rule'`).
* @property {string | null | undefined} [source]
*   Namespace of who sent the message (optional, example: `'my-package'`).
*/
/**
* Message.
*/
var VFileMessage = class extends Error {
	/**
	* Create a message for `reason`.
	*
	* > 🪦 **Note**: also has obsolete signatures.
	*
	* @overload
	* @param {string} reason
	* @param {Options | null | undefined} [options]
	* @returns
	*
	* @overload
	* @param {string} reason
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @overload
	* @param {string} reason
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @overload
	* @param {string} reason
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {string | null | undefined} [origin]
	* @returns
	*
	* @param {Error | VFileMessage | string} causeOrReason
	*   Reason for message, should use markdown.
	* @param {Node | NodeLike | Options | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
	*   Configuration (optional).
	* @param {string | null | undefined} [origin]
	*   Place in code where the message originates (example:
	*   `'my-package:my-rule'` or `'my-rule'`).
	* @returns
	*   Instance of `VFileMessage`.
	*/
	constructor(causeOrReason, optionsOrParentOrPlace, origin) {
		super();
		if (typeof optionsOrParentOrPlace === "string") {
			origin = optionsOrParentOrPlace;
			optionsOrParentOrPlace = void 0;
		}
		/** @type {string} */
		let reason = "";
		/** @type {Options} */
		let options = {};
		let legacyCause = false;
		if (optionsOrParentOrPlace) if ("line" in optionsOrParentOrPlace && "column" in optionsOrParentOrPlace) options = { place: optionsOrParentOrPlace };
		else if ("start" in optionsOrParentOrPlace && "end" in optionsOrParentOrPlace) options = { place: optionsOrParentOrPlace };
		else if ("type" in optionsOrParentOrPlace) options = {
			ancestors: [optionsOrParentOrPlace],
			place: optionsOrParentOrPlace.position
		};
		else options = { ...optionsOrParentOrPlace };
		if (typeof causeOrReason === "string") reason = causeOrReason;
		else if (!options.cause && causeOrReason) {
			legacyCause = true;
			reason = causeOrReason.message;
			options.cause = causeOrReason;
		}
		if (!options.ruleId && !options.source && typeof origin === "string") {
			const index = origin.indexOf(":");
			if (index === -1) options.ruleId = origin;
			else {
				options.source = origin.slice(0, index);
				options.ruleId = origin.slice(index + 1);
			}
		}
		if (!options.place && options.ancestors && options.ancestors) {
			const parent = options.ancestors[options.ancestors.length - 1];
			if (parent) options.place = parent.position;
		}
		const start = options.place && "start" in options.place ? options.place.start : options.place;
		/**
		* Stack of ancestor nodes surrounding the message.
		*
		* @type {Array<Node> | undefined}
		*/
		this.ancestors = options.ancestors || void 0;
		/**
		* Original error cause of the message.
		*
		* @type {Error | undefined}
		*/
		this.cause = options.cause || void 0;
		/**
		* Starting column of message.
		*
		* @type {number | undefined}
		*/
		this.column = start ? start.column : void 0;
		/**
		* State of problem.
		*
		* * `true` — error, file not usable
		* * `false` — warning, change may be needed
		* * `undefined` — change likely not needed
		*
		* @type {boolean | null | undefined}
		*/
		this.fatal = void 0;
		/**
		* Path of a file (used throughout the `VFile` ecosystem).
		*
		* @type {string | undefined}
		*/
		this.file = "";
		/**
		* Reason for message.
		*
		* @type {string}
		*/
		this.message = reason;
		/**
		* Starting line of error.
		*
		* @type {number | undefined}
		*/
		this.line = start ? start.line : void 0;
		/**
		* Serialized positional info of message.
		*
		* On normal errors, this would be something like `ParseError`, buit in
		* `VFile` messages we use this space to show where an error happened.
		*/
		this.name = stringifyPosition(options.place) || "1:1";
		/**
		* Place of message.
		*
		* @type {Point | Position | undefined}
		*/
		this.place = options.place || void 0;
		/**
		* Reason for message, should use markdown.
		*
		* @type {string}
		*/
		this.reason = this.message;
		/**
		* Category of message (example: `'my-rule'`).
		*
		* @type {string | undefined}
		*/
		this.ruleId = options.ruleId || void 0;
		/**
		* Namespace of message (example: `'my-package'`).
		*
		* @type {string | undefined}
		*/
		this.source = options.source || void 0;
		/**
		* Stack of message.
		*
		* This is used by normal errors to show where something happened in
		* programming code, irrelevant for `VFile` messages,
		*
		* @type {string}
		*/
		this.stack = legacyCause && options.cause && typeof options.cause.stack === "string" ? options.cause.stack : "";
		/**
		* Specify the source value that’s being reported, which is deemed
		* incorrect.
		*
		* @type {string | undefined}
		*/
		this.actual = void 0;
		/**
		* Suggest acceptable values that can be used instead of `actual`.
		*
		* @type {Array<string> | undefined}
		*/
		this.expected = void 0;
		/**
		* Long form description of the message (you should use markdown).
		*
		* @type {string | undefined}
		*/
		this.note = void 0;
		/**
		* Link to docs for the message.
		*
		* > 👉 **Note**: this must be an absolute URL that can be passed as `x`
		* > to `new URL(x)`.
		*
		* @type {string | undefined}
		*/
		this.url = void 0;
	}
};
VFileMessage.prototype.file = "";
VFileMessage.prototype.name = "";
VFileMessage.prototype.reason = "";
VFileMessage.prototype.message = "";
VFileMessage.prototype.stack = "";
VFileMessage.prototype.column = void 0;
VFileMessage.prototype.line = void 0;
VFileMessage.prototype.ancestors = void 0;
VFileMessage.prototype.cause = void 0;
VFileMessage.prototype.fatal = void 0;
VFileMessage.prototype.place = void 0;
VFileMessage.prototype.ruleId = void 0;
VFileMessage.prototype.source = void 0;
//#endregion
//#region node_modules/vfile/lib/minurl.shared.js
/**
* Checks if a value has the shape of a WHATWG URL object.
*
* Using a symbol or instanceof would not be able to recognize URL objects
* coming from other implementations (e.g. in Electron), so instead we are
* checking some well known properties for a lack of a better test.
*
* We use `href` and `protocol` as they are the only properties that are
* easy to retrieve and calculate due to the lazy nature of the getters.
*
* We check for auth attribute to distinguish legacy url instance with
* WHATWG URL instance.
*
* @param {unknown} fileUrlOrPath
*   File path or URL.
* @returns {fileUrlOrPath is URL}
*   Whether it’s a URL.
*/
function isUrl(fileUrlOrPath) {
	return Boolean(fileUrlOrPath !== null && typeof fileUrlOrPath === "object" && "href" in fileUrlOrPath && fileUrlOrPath.href && "protocol" in fileUrlOrPath && fileUrlOrPath.protocol && fileUrlOrPath.auth === void 0);
}
//#endregion
//#region node_modules/vfile/lib/index.js
/**
* @import {Node, Point, Position} from 'unist'
* @import {Options as MessageOptions} from 'vfile-message'
* @import {Compatible, Data, Map, Options, Value} from 'vfile'
*/
/**
* @typedef {object & {type: string, position?: Position | undefined}} NodeLike
*/
/**
* Order of setting (least specific to most), we need this because otherwise
* `{stem: 'a', path: '~/b.js'}` would throw, as a path is needed before a
* stem can be set.
*/
var order = [
	"history",
	"path",
	"basename",
	"stem",
	"extname",
	"dirname"
];
var VFile = class {
	/**
	* Create a new virtual file.
	*
	* `options` is treated as:
	*
	* *   `string` or `Uint8Array` — `{value: options}`
	* *   `URL` — `{path: options}`
	* *   `VFile` — shallow copies its data over to the new file
	* *   `object` — all fields are shallow copied over to the new file
	*
	* Path related fields are set in the following order (least specific to
	* most specific): `history`, `path`, `basename`, `stem`, `extname`,
	* `dirname`.
	*
	* You cannot set `dirname` or `extname` without setting either `history`,
	* `path`, `basename`, or `stem` too.
	*
	* @param {Compatible | null | undefined} [value]
	*   File value.
	* @returns
	*   New instance.
	*/
	constructor(value) {
		/** @type {Options | VFile} */
		let options;
		if (!value) options = {};
		else if (isUrl(value)) options = { path: value };
		else if (typeof value === "string" || isUint8Array(value)) options = { value };
		else options = value;
		/**
		* Base of `path` (default: `process.cwd()` or `'/'` in browsers).
		*
		* @type {string}
		*/
		this.cwd = "cwd" in options ? "" : minproc.cwd();
		/**
		* Place to store custom info (default: `{}`).
		*
		* It’s OK to store custom data directly on the file but moving it to
		* `data` is recommended.
		*
		* @type {Data}
		*/
		this.data = {};
		/**
		* List of file paths the file moved between.
		*
		* The first is the original path and the last is the current path.
		*
		* @type {Array<string>}
		*/
		this.history = [];
		/**
		* List of messages associated with the file.
		*
		* @type {Array<VFileMessage>}
		*/
		this.messages = [];
		/**
		* Raw value.
		*
		* @type {Value}
		*/
		this.value;
		/**
		* Source map.
		*
		* This type is equivalent to the `RawSourceMap` type from the `source-map`
		* module.
		*
		* @type {Map | null | undefined}
		*/
		this.map;
		/**
		* Custom, non-string, compiled, representation.
		*
		* This is used by unified to store non-string results.
		* One example is when turning markdown into React nodes.
		*
		* @type {unknown}
		*/
		this.result;
		/**
		* Whether a file was saved to disk.
		*
		* This is used by vfile reporters.
		*
		* @type {boolean}
		*/
		this.stored;
		let index = -1;
		while (++index < order.length) {
			const field = order[index];
			if (field in options && options[field] !== void 0 && options[field] !== null) this[field] = field === "history" ? [...options[field]] : options[field];
		}
		/** @type {string} */
		let field;
		for (field in options) if (!order.includes(field)) this[field] = options[field];
	}
	/**
	* Get the basename (including extname) (example: `'index.min.js'`).
	*
	* @returns {string | undefined}
	*   Basename.
	*/
	get basename() {
		return typeof this.path === "string" ? minpath.basename(this.path) : void 0;
	}
	/**
	* Set basename (including extname) (`'index.min.js'`).
	*
	* Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
	* on windows).
	* Cannot be nullified (use `file.path = file.dirname` instead).
	*
	* @param {string} basename
	*   Basename.
	* @returns {undefined}
	*   Nothing.
	*/
	set basename(basename) {
		assertNonEmpty(basename, "basename");
		assertPart(basename, "basename");
		this.path = minpath.join(this.dirname || "", basename);
	}
	/**
	* Get the parent path (example: `'~'`).
	*
	* @returns {string | undefined}
	*   Dirname.
	*/
	get dirname() {
		return typeof this.path === "string" ? minpath.dirname(this.path) : void 0;
	}
	/**
	* Set the parent path (example: `'~'`).
	*
	* Cannot be set if there’s no `path` yet.
	*
	* @param {string | undefined} dirname
	*   Dirname.
	* @returns {undefined}
	*   Nothing.
	*/
	set dirname(dirname) {
		assertPath(this.basename, "dirname");
		this.path = minpath.join(dirname || "", this.basename);
	}
	/**
	* Get the extname (including dot) (example: `'.js'`).
	*
	* @returns {string | undefined}
	*   Extname.
	*/
	get extname() {
		return typeof this.path === "string" ? minpath.extname(this.path) : void 0;
	}
	/**
	* Set the extname (including dot) (example: `'.js'`).
	*
	* Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
	* on windows).
	* Cannot be set if there’s no `path` yet.
	*
	* @param {string | undefined} extname
	*   Extname.
	* @returns {undefined}
	*   Nothing.
	*/
	set extname(extname) {
		assertPart(extname, "extname");
		assertPath(this.dirname, "extname");
		if (extname) {
			if (extname.codePointAt(0) !== 46) throw new Error("`extname` must start with `.`");
			if (extname.includes(".", 1)) throw new Error("`extname` cannot contain multiple dots");
		}
		this.path = minpath.join(this.dirname, this.stem + (extname || ""));
	}
	/**
	* Get the full path (example: `'~/index.min.js'`).
	*
	* @returns {string}
	*   Path.
	*/
	get path() {
		return this.history[this.history.length - 1];
	}
	/**
	* Set the full path (example: `'~/index.min.js'`).
	*
	* Cannot be nullified.
	* You can set a file URL (a `URL` object with a `file:` protocol) which will
	* be turned into a path with `url.fileURLToPath`.
	*
	* @param {URL | string} path
	*   Path.
	* @returns {undefined}
	*   Nothing.
	*/
	set path(path) {
		if (isUrl(path)) path = urlToPath(path);
		assertNonEmpty(path, "path");
		if (this.path !== path) this.history.push(path);
	}
	/**
	* Get the stem (basename w/o extname) (example: `'index.min'`).
	*
	* @returns {string | undefined}
	*   Stem.
	*/
	get stem() {
		return typeof this.path === "string" ? minpath.basename(this.path, this.extname) : void 0;
	}
	/**
	* Set the stem (basename w/o extname) (example: `'index.min'`).
	*
	* Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
	* on windows).
	* Cannot be nullified (use `file.path = file.dirname` instead).
	*
	* @param {string} stem
	*   Stem.
	* @returns {undefined}
	*   Nothing.
	*/
	set stem(stem) {
		assertNonEmpty(stem, "stem");
		assertPart(stem, "stem");
		this.path = minpath.join(this.dirname || "", stem + (this.extname || ""));
	}
	/**
	* Create a fatal message for `reason` associated with the file.
	*
	* The `fatal` field of the message is set to `true` (error; file not usable)
	* and the `file` field is set to the current file path.
	* The message is added to the `messages` field on `file`.
	*
	* > 🪦 **Note**: also has obsolete signatures.
	*
	* @overload
	* @param {string} reason
	* @param {MessageOptions | null | undefined} [options]
	* @returns {never}
	*
	* @overload
	* @param {string} reason
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns {never}
	*
	* @overload
	* @param {string} reason
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns {never}
	*
	* @overload
	* @param {string} reason
	* @param {string | null | undefined} [origin]
	* @returns {never}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns {never}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns {never}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {string | null | undefined} [origin]
	* @returns {never}
	*
	* @param {Error | VFileMessage | string} causeOrReason
	*   Reason for message, should use markdown.
	* @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
	*   Configuration (optional).
	* @param {string | null | undefined} [origin]
	*   Place in code where the message originates (example:
	*   `'my-package:my-rule'` or `'my-rule'`).
	* @returns {never}
	*   Never.
	* @throws {VFileMessage}
	*   Message.
	*/
	fail(causeOrReason, optionsOrParentOrPlace, origin) {
		const message = this.message(causeOrReason, optionsOrParentOrPlace, origin);
		message.fatal = true;
		throw message;
	}
	/**
	* Create an info message for `reason` associated with the file.
	*
	* The `fatal` field of the message is set to `undefined` (info; change
	* likely not needed) and the `file` field is set to the current file path.
	* The message is added to the `messages` field on `file`.
	*
	* > 🪦 **Note**: also has obsolete signatures.
	*
	* @overload
	* @param {string} reason
	* @param {MessageOptions | null | undefined} [options]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {string} reason
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {string} reason
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {string} reason
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @param {Error | VFileMessage | string} causeOrReason
	*   Reason for message, should use markdown.
	* @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
	*   Configuration (optional).
	* @param {string | null | undefined} [origin]
	*   Place in code where the message originates (example:
	*   `'my-package:my-rule'` or `'my-rule'`).
	* @returns {VFileMessage}
	*   Message.
	*/
	info(causeOrReason, optionsOrParentOrPlace, origin) {
		const message = this.message(causeOrReason, optionsOrParentOrPlace, origin);
		message.fatal = void 0;
		return message;
	}
	/**
	* Create a message for `reason` associated with the file.
	*
	* The `fatal` field of the message is set to `false` (warning; change may be
	* needed) and the `file` field is set to the current file path.
	* The message is added to the `messages` field on `file`.
	*
	* > 🪦 **Note**: also has obsolete signatures.
	*
	* @overload
	* @param {string} reason
	* @param {MessageOptions | null | undefined} [options]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {string} reason
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {string} reason
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {string} reason
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Node | NodeLike | null | undefined} parent
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {Point | Position | null | undefined} place
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @overload
	* @param {Error | VFileMessage} cause
	* @param {string | null | undefined} [origin]
	* @returns {VFileMessage}
	*
	* @param {Error | VFileMessage | string} causeOrReason
	*   Reason for message, should use markdown.
	* @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
	*   Configuration (optional).
	* @param {string | null | undefined} [origin]
	*   Place in code where the message originates (example:
	*   `'my-package:my-rule'` or `'my-rule'`).
	* @returns {VFileMessage}
	*   Message.
	*/
	message(causeOrReason, optionsOrParentOrPlace, origin) {
		const message = new VFileMessage(causeOrReason, optionsOrParentOrPlace, origin);
		if (this.path) {
			message.name = this.path + ":" + message.name;
			message.file = this.path;
		}
		message.fatal = false;
		this.messages.push(message);
		return message;
	}
	/**
	* Serialize the file.
	*
	* > **Note**: which encodings are supported depends on the engine.
	* > For info on Node.js, see:
	* > <https://nodejs.org/api/util.html#whatwg-supported-encodings>.
	*
	* @param {string | null | undefined} [encoding='utf8']
	*   Character encoding to understand `value` as when it’s a `Uint8Array`
	*   (default: `'utf-8'`).
	* @returns {string}
	*   Serialized file.
	*/
	toString(encoding) {
		if (this.value === void 0) return "";
		if (typeof this.value === "string") return this.value;
		return new TextDecoder(encoding || void 0).decode(this.value);
	}
};
/**
* Assert that `part` is not a path (as in, does not contain `path.sep`).
*
* @param {string | null | undefined} part
*   File path part.
* @param {string} name
*   Part name.
* @returns {undefined}
*   Nothing.
*/
function assertPart(part, name) {
	if (part && part.includes(minpath.sep)) throw new Error("`" + name + "` cannot be a path: did not expect `" + minpath.sep + "`");
}
/**
* Assert that `part` is not empty.
*
* @param {string | undefined} part
*   Thing.
* @param {string} name
*   Part name.
* @returns {asserts part is string}
*   Nothing.
*/
function assertNonEmpty(part, name) {
	if (!part) throw new Error("`" + name + "` cannot be empty");
}
/**
* Assert `path` exists.
*
* @param {string | undefined} path
*   Path.
* @param {string} name
*   Dependency name.
* @returns {asserts path is string}
*   Nothing.
*/
function assertPath(path, name) {
	if (!path) throw new Error("Setting `" + name + "` requires `path` to be set too");
}
/**
* Assert `value` is an `Uint8Array`.
*
* @param {unknown} value
*   thing.
* @returns {value is Uint8Array}
*   Whether `value` is an `Uint8Array`.
*/
function isUint8Array(value) {
	return Boolean(value && typeof value === "object" && "byteLength" in value && "byteOffset" in value);
}
//#endregion
//#region node_modules/hast-util-from-html/lib/errors.js
/**
* @typedef ErrorInfo
*   Info on a `parse5` error.
* @property {string} reason
*   Reason of error.
* @property {string} description
*   More info on error.
* @property {false} [url]
*   Turn off if this is not documented in the html5 spec (optional).
*/
var errors = {
	/** @type {ErrorInfo} */
	abandonedHeadElementChild: {
		reason: "Unexpected metadata element after head",
		description: "Unexpected element after head. Expected the element before `</head>`",
		url: false
	},
	/** @type {ErrorInfo} */
	abruptClosingOfEmptyComment: {
		reason: "Unexpected abruptly closed empty comment",
		description: "Unexpected `>` or `->`. Expected `-->` to close comments"
	},
	/** @type {ErrorInfo} */
	abruptDoctypePublicIdentifier: {
		reason: "Unexpected abruptly closed public identifier",
		description: "Unexpected `>`. Expected a closing `\"` or `'` after the public identifier"
	},
	/** @type {ErrorInfo} */
	abruptDoctypeSystemIdentifier: {
		reason: "Unexpected abruptly closed system identifier",
		description: "Unexpected `>`. Expected a closing `\"` or `'` after the identifier identifier"
	},
	/** @type {ErrorInfo} */
	absenceOfDigitsInNumericCharacterReference: {
		reason: "Unexpected non-digit at start of numeric character reference",
		description: "Unexpected `%c`. Expected `[0-9]` for decimal references or `[0-9a-fA-F]` for hexadecimal references"
	},
	/** @type {ErrorInfo} */
	cdataInHtmlContent: {
		reason: "Unexpected CDATA section in HTML",
		description: "Unexpected `<![CDATA[` in HTML. Remove it, use a comment, or encode special characters instead"
	},
	/** @type {ErrorInfo} */
	characterReferenceOutsideUnicodeRange: {
		reason: "Unexpected too big numeric character reference",
		description: "Unexpectedly high character reference. Expected character references to be at most hexadecimal 10ffff (or decimal 1114111)"
	},
	/** @type {ErrorInfo} */
	closingOfElementWithOpenChildElements: {
		reason: "Unexpected closing tag with open child elements",
		description: "Unexpectedly closing tag. Expected other tags to be closed first",
		url: false
	},
	/** @type {ErrorInfo} */
	controlCharacterInInputStream: {
		reason: "Unexpected control character",
		description: "Unexpected control character `%x`. Expected a non-control code point, 0x00, or ASCII whitespace"
	},
	/** @type {ErrorInfo} */
	controlCharacterReference: {
		reason: "Unexpected control character reference",
		description: "Unexpectedly control character in reference. Expected a non-control code point, 0x00, or ASCII whitespace"
	},
	/** @type {ErrorInfo} */
	disallowedContentInNoscriptInHead: {
		reason: "Disallowed content inside `<noscript>` in `<head>`",
		description: "Unexpected text character `%c`. Only use text in `<noscript>`s in `<body>`",
		url: false
	},
	/** @type {ErrorInfo} */
	duplicateAttribute: {
		reason: "Unexpected duplicate attribute",
		description: "Unexpectedly double attribute. Expected attributes to occur only once"
	},
	/** @type {ErrorInfo} */
	endTagWithAttributes: {
		reason: "Unexpected attribute on closing tag",
		description: "Unexpected attribute. Expected `>` instead"
	},
	/** @type {ErrorInfo} */
	endTagWithTrailingSolidus: {
		reason: "Unexpected slash at end of closing tag",
		description: "Unexpected `%c-1`. Expected `>` instead"
	},
	/** @type {ErrorInfo} */
	endTagWithoutMatchingOpenElement: {
		reason: "Unexpected unopened end tag",
		description: "Unexpected end tag. Expected no end tag or another end tag",
		url: false
	},
	/** @type {ErrorInfo} */
	eofBeforeTagName: {
		reason: "Unexpected end of file",
		description: "Unexpected end of file. Expected tag name instead"
	},
	/** @type {ErrorInfo} */
	eofInCdata: {
		reason: "Unexpected end of file in CDATA",
		description: "Unexpected end of file. Expected `]]>` to close the CDATA"
	},
	/** @type {ErrorInfo} */
	eofInComment: {
		reason: "Unexpected end of file in comment",
		description: "Unexpected end of file. Expected `-->` to close the comment"
	},
	/** @type {ErrorInfo} */
	eofInDoctype: {
		reason: "Unexpected end of file in doctype",
		description: "Unexpected end of file. Expected a valid doctype (such as `<!doctype html>`)"
	},
	/** @type {ErrorInfo} */
	eofInElementThatCanContainOnlyText: {
		reason: "Unexpected end of file in element that can only contain text",
		description: "Unexpected end of file. Expected text or a closing tag",
		url: false
	},
	/** @type {ErrorInfo} */
	eofInScriptHtmlCommentLikeText: {
		reason: "Unexpected end of file in comment inside script",
		description: "Unexpected end of file. Expected `-->` to close the comment"
	},
	/** @type {ErrorInfo} */
	eofInTag: {
		reason: "Unexpected end of file in tag",
		description: "Unexpected end of file. Expected `>` to close the tag"
	},
	/** @type {ErrorInfo} */
	incorrectlyClosedComment: {
		reason: "Incorrectly closed comment",
		description: "Unexpected `%c-1`. Expected `-->` to close the comment"
	},
	/** @type {ErrorInfo} */
	incorrectlyOpenedComment: {
		reason: "Incorrectly opened comment",
		description: "Unexpected `%c`. Expected `<!--` to open the comment"
	},
	/** @type {ErrorInfo} */
	invalidCharacterSequenceAfterDoctypeName: {
		reason: "Invalid sequence after doctype name",
		description: "Unexpected sequence at `%c`. Expected `public` or `system`"
	},
	/** @type {ErrorInfo} */
	invalidFirstCharacterOfTagName: {
		reason: "Invalid first character in tag name",
		description: "Unexpected `%c`. Expected an ASCII letter instead"
	},
	/** @type {ErrorInfo} */
	misplacedDoctype: {
		reason: "Misplaced doctype",
		description: "Unexpected doctype. Expected doctype before head",
		url: false
	},
	/** @type {ErrorInfo} */
	misplacedStartTagForHeadElement: {
		reason: "Misplaced `<head>` start tag",
		description: "Unexpected start tag `<head>`. Expected `<head>` directly after doctype",
		url: false
	},
	/** @type {ErrorInfo} */
	missingAttributeValue: {
		reason: "Missing attribute value",
		description: "Unexpected `%c-1`. Expected an attribute value or no `%c-1` instead"
	},
	/** @type {ErrorInfo} */
	missingDoctype: {
		reason: "Missing doctype before other content",
		description: "Expected a `<!doctype html>` before anything else",
		url: false
	},
	/** @type {ErrorInfo} */
	missingDoctypeName: {
		reason: "Missing doctype name",
		description: "Unexpected doctype end at `%c`. Expected `html` instead"
	},
	/** @type {ErrorInfo} */
	missingDoctypePublicIdentifier: {
		reason: "Missing public identifier in doctype",
		description: "Unexpected `%c`. Expected identifier for `public` instead"
	},
	/** @type {ErrorInfo} */
	missingDoctypeSystemIdentifier: {
		reason: "Missing system identifier in doctype",
		description: "Unexpected `%c`. Expected identifier for `system` instead (suggested: `\"about:legacy-compat\"`)"
	},
	/** @type {ErrorInfo} */
	missingEndTagName: {
		reason: "Missing name in end tag",
		description: "Unexpected `%c`. Expected an ASCII letter instead"
	},
	/** @type {ErrorInfo} */
	missingQuoteBeforeDoctypePublicIdentifier: {
		reason: "Missing quote before public identifier in doctype",
		description: "Unexpected `%c`. Expected `\"` or `'` instead"
	},
	/** @type {ErrorInfo} */
	missingQuoteBeforeDoctypeSystemIdentifier: {
		reason: "Missing quote before system identifier in doctype",
		description: "Unexpected `%c`. Expected `\"` or `'` instead"
	},
	/** @type {ErrorInfo} */
	missingSemicolonAfterCharacterReference: {
		reason: "Missing semicolon after character reference",
		description: "Unexpected `%c`. Expected `;` instead"
	},
	/** @type {ErrorInfo} */
	missingWhitespaceAfterDoctypePublicKeyword: {
		reason: "Missing whitespace after public identifier in doctype",
		description: "Unexpected `%c`. Expected ASCII whitespace instead"
	},
	/** @type {ErrorInfo} */
	missingWhitespaceAfterDoctypeSystemKeyword: {
		reason: "Missing whitespace after system identifier in doctype",
		description: "Unexpected `%c`. Expected ASCII whitespace instead"
	},
	/** @type {ErrorInfo} */
	missingWhitespaceBeforeDoctypeName: {
		reason: "Missing whitespace before doctype name",
		description: "Unexpected `%c`. Expected ASCII whitespace instead"
	},
	/** @type {ErrorInfo} */
	missingWhitespaceBetweenAttributes: {
		reason: "Missing whitespace between attributes",
		description: "Unexpected `%c`. Expected ASCII whitespace instead"
	},
	/** @type {ErrorInfo} */
	missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers: {
		reason: "Missing whitespace between public and system identifiers in doctype",
		description: "Unexpected `%c`. Expected ASCII whitespace instead"
	},
	/** @type {ErrorInfo} */
	nestedComment: {
		reason: "Unexpected nested comment",
		description: "Unexpected `<!--`. Expected `-->`"
	},
	/** @type {ErrorInfo} */
	nestedNoscriptInHead: {
		reason: "Unexpected nested `<noscript>` in `<head>`",
		description: "Unexpected `<noscript>`. Expected a closing tag or a meta element",
		url: false
	},
	/** @type {ErrorInfo} */
	nonConformingDoctype: {
		reason: "Unexpected non-conforming doctype declaration",
		description: "Expected `<!doctype html>` or `<!doctype html system \"about:legacy-compat\">`",
		url: false
	},
	/** @type {ErrorInfo} */
	nonVoidHtmlElementStartTagWithTrailingSolidus: {
		reason: "Unexpected trailing slash on start tag of non-void element",
		description: "Unexpected `/`. Expected `>` instead"
	},
	/** @type {ErrorInfo} */
	noncharacterCharacterReference: {
		reason: "Unexpected noncharacter code point referenced by character reference",
		description: "Unexpected code point. Do not use noncharacters in HTML"
	},
	/** @type {ErrorInfo} */
	noncharacterInInputStream: {
		reason: "Unexpected noncharacter character",
		description: "Unexpected code point `%x`. Do not use noncharacters in HTML"
	},
	/** @type {ErrorInfo} */
	nullCharacterReference: {
		reason: "Unexpected NULL character referenced by character reference",
		description: "Unexpected code point. Do not use NULL characters in HTML"
	},
	/** @type {ErrorInfo} */
	openElementsLeftAfterEof: {
		reason: "Unexpected end of file",
		description: "Unexpected end of file. Expected closing tag instead",
		url: false
	},
	/** @type {ErrorInfo} */
	surrogateCharacterReference: {
		reason: "Unexpected surrogate character referenced by character reference",
		description: "Unexpected code point. Do not use lone surrogate characters in HTML"
	},
	/** @type {ErrorInfo} */
	surrogateInInputStream: {
		reason: "Unexpected surrogate character",
		description: "Unexpected code point `%x`. Do not use lone surrogate characters in HTML"
	},
	/** @type {ErrorInfo} */
	unexpectedCharacterAfterDoctypeSystemIdentifier: {
		reason: "Invalid character after system identifier in doctype",
		description: "Unexpected character at `%c`. Expected `>`"
	},
	/** @type {ErrorInfo} */
	unexpectedCharacterInAttributeName: {
		reason: "Unexpected character in attribute name",
		description: "Unexpected `%c`. Expected whitespace, `/`, `>`, `=`, or probably an ASCII letter"
	},
	/** @type {ErrorInfo} */
	unexpectedCharacterInUnquotedAttributeValue: {
		reason: "Unexpected character in unquoted attribute value",
		description: "Unexpected `%c`. Quote the attribute value to include it"
	},
	/** @type {ErrorInfo} */
	unexpectedEqualsSignBeforeAttributeName: {
		reason: "Unexpected equals sign before attribute name",
		description: "Unexpected `%c`. Add an attribute name before it"
	},
	/** @type {ErrorInfo} */
	unexpectedNullCharacter: {
		reason: "Unexpected NULL character",
		description: "Unexpected code point `%x`. Do not use NULL characters in HTML"
	},
	/** @type {ErrorInfo} */
	unexpectedQuestionMarkInsteadOfTagName: {
		reason: "Unexpected question mark instead of tag name",
		description: "Unexpected `%c`. Expected an ASCII letter instead"
	},
	/** @type {ErrorInfo} */
	unexpectedSolidusInTag: {
		reason: "Unexpected slash in tag",
		description: "Unexpected `%c-1`. Expected it followed by `>` or in a quoted attribute value"
	},
	/** @type {ErrorInfo} */
	unknownNamedCharacterReference: {
		reason: "Unexpected unknown named character reference",
		description: "Unexpected character reference. Expected known named character references"
	}
};
//#endregion
//#region node_modules/hast-util-from-html/lib/index.js
/**
* @import {Root} from 'hast'
* @import {ParserError} from 'parse5'
* @import {Value} from 'vfile'
* @import {ErrorCode, Options} from './types.js'
*/
var base = "https://html.spec.whatwg.org/multipage/parsing.html#parse-error-";
var dashToCamelRe = /-[a-z]/g;
var formatCRe = /%c(?:([-+])(\d+))?/g;
var formatXRe = /%x/g;
var fatalities = {
	2: true,
	1: false,
	0: null
};
/** @type {Readonly<Options>} */
var emptyOptions$2 = {};
/**
* Turn serialized HTML into a hast tree.
*
* @param {VFile | Value} value
*   Serialized HTML to parse.
* @param {Readonly<Options> | null | undefined} [options]
*   Configuration (optional).
* @returns {Root}
*   Tree.
*/
function fromHtml(value, options) {
	const settings = options || emptyOptions$2;
	const onerror = settings.onerror;
	const file = value instanceof VFile ? value : new VFile(value);
	const parseFunction = settings.fragment ? parseFragment : parse;
	const document = String(file);
	return fromParse5(parseFunction(document, {
		sourceCodeLocationInfo: true,
		onParseError: settings.onerror ? internalOnerror : null,
		scriptingEnabled: false
	}), {
		file,
		space: settings.space,
		verbose: settings.verbose
	});
	/**
	* Handle a parse error.
	*
	* @param {ParserError} error
	*   Parse5 error.
	* @returns {undefined}
	*   Nothing.
	*/
	function internalOnerror(error) {
		const code = error.code;
		const name = camelcase(code);
		const setting = settings[name];
		const config = setting === null || setting === void 0 ? true : setting;
		const level = typeof config === "number" ? config : config ? 1 : 0;
		if (level) {
			const info = errors[name];
			const message = new VFileMessage(format(info.reason), {
				place: {
					start: {
						line: error.startLine,
						column: error.startCol,
						offset: error.startOffset
					},
					end: {
						line: error.endLine,
						column: error.endCol,
						offset: error.endOffset
					}
				},
				ruleId: code,
				source: "hast-util-from-html"
			});
			if (file.path) {
				message.file = file.path;
				message.name = file.path + ":" + message.name;
			}
			message.fatal = fatalities[level];
			message.note = format(info.description);
			message.url = info.url === false ? void 0 : base + code;
			onerror(message);
		}
		/**
		* Format a human readable string about an error.
		*
		* @param {string} value
		*   Value to format.
		* @returns {string}
		*   Formatted.
		*/
		function format(value) {
			return value.replace(formatCRe, formatC).replace(formatXRe, formatX);
			/**
			* Format the character.
			*
			* @param {string} _
			*   Match.
			* @param {string} $1
			*   Sign (`-` or `+`, optional).
			* @param {string} $2
			*   Offset.
			* @returns {string}
			*   Formatted.
			*/
			function formatC(_, $1, $2) {
				const offset = ($2 ? Number.parseInt($2, 10) : 0) * ($1 === "-" ? -1 : 1);
				return visualizeCharacter(document.charAt(error.startOffset + offset));
			}
			/**
			* Format the character code.
			*
			* @returns {string}
			*   Formatted.
			*/
			function formatX() {
				return visualizeCharacterCode(document.charCodeAt(error.startOffset));
			}
		}
	}
}
/**
* @param {string} value
*   Error code in dash case.
* @returns {ErrorCode}
*   Error code in camelcase.
*/
function camelcase(value) {
	return value.replace(dashToCamelRe, dashToCamel);
}
/**
* @param {string} $0
*   Match.
* @returns {string}
*   Camelcased.
*/
function dashToCamel($0) {
	return $0.charAt(1).toUpperCase();
}
/**
* @param {string} char
*   Character.
* @returns {string}
*   Formatted.
*/
function visualizeCharacter(char) {
	return char === "`" ? "` ` `" : char;
}
/**
* @param {number} charCode
*   Character code.
* @returns {string}
*   Formatted.
*/
function visualizeCharacterCode(charCode) {
	return "0x" + charCode.toString(16).toUpperCase();
}
//#endregion
//#region node_modules/unist-util-remove-position/lib/index.js
/**
* @typedef {import('unist').Node} Node
*/
/**
* @typedef Options
*   Configuration.
* @property {boolean | null | undefined} [force=false]
*   Whether to use `delete` to remove `position` fields.
*
*   The default is to set them to `undefined`.
*/
/**
* Remove the `position` field from a tree.
*
* @param {Node} tree
*   Tree to clean.
* @param {Options | null | undefined} [options={force: false}]
*   Configuration (default: `{force: false}`).
* @returns {undefined}
*   Nothing.
*/
function removePosition(tree, options) {
	const force = (options || {}).force || false;
	visit(tree, remove);
	/**
	* @param {Node} node
	*/
	function remove(node) {
		if (force) delete node.position;
		else node.position = void 0;
	}
}
//#endregion
//#region node_modules/hast-util-from-html-isomorphic/lib/index.js
/**
* @typedef {import('hast').Root} Root
*
* @typedef {Pick<import('hast-util-from-html').Options, 'fragment'>} Options
*/
/**
* Turn HTML into a syntax tree, using browser APIs when available, so it has
* a smaller bundle size there.
*
* @param {string} value
*   Serialized HTML to parse.
* @param {Options | null | undefined} [options]
*   Configuration (optional).
* @returns {Root}
*   Tree.
*/
function fromHtmlIsomorphic(value, options) {
	const tree = fromHtml(value, options);
	removePosition(tree, { force: true });
	delete tree.data;
	return tree;
}
//#endregion
//#region node_modules/unist-util-find-after/lib/index.js
/**
* @typedef {import('unist').Node} UnistNode
* @typedef {import('unist').Parent} UnistParent
*/
/**
* @typedef {Exclude<import('unist-util-is').Test, undefined> | undefined} Test
*   Test from `unist-util-is`.
*
*   Note: we have remove and add `undefined`, because otherwise when generating
*   automatic `.d.ts` files, TS tries to flatten paths from a local perspective,
*   which doesn’t work when publishing on npm.
*/
/**
* @typedef {(
*   Fn extends (value: any) => value is infer Thing
*   ? Thing
*   : Fallback
* )} Predicate
*   Get the value of a type guard `Fn`.
* @template Fn
*   Value; typically function that is a type guard (such as `(x): x is Y`).
* @template Fallback
*   Value to yield if `Fn` is not a type guard.
*/
/**
* @typedef {(
*   Check extends null | undefined // No test.
*   ? Value
*   : Value extends {type: Check} // String (type) test.
*   ? Value
*   : Value extends Check // Partial test.
*   ? Value
*   : Check extends Function // Function test.
*   ? Predicate<Check, Value> extends Value
*     ? Predicate<Check, Value>
*     : never
*   : never // Some other test?
* )} MatchesOne
*   Check whether a node matches a primitive check in the type system.
* @template Value
*   Value; typically unist `Node`.
* @template Check
*   Value; typically `unist-util-is`-compatible test, but not arrays.
*/
/**
* @typedef {(
*   Check extends Array<any>
*   ? MatchesOne<Value, Check[keyof Check]>
*   : MatchesOne<Value, Check>
* )} Matches
*   Check whether a node matches a check in the type system.
* @template Value
*   Value; typically unist `Node`.
* @template Check
*   Value; typically `unist-util-is`-compatible test.
*/
/**
* @typedef {(
*   Kind extends {children: Array<infer Child>}
*   ? Child
*   : never
* )} Child
*   Collect nodes that can be parents of `Child`.
* @template {UnistNode} Kind
*   All node types.
*/
/**
* Find the first node in `parent` after another `node` or after an index,
* that passes `test`.
*
* @param parent
*   Parent node.
* @param index
*   Child node or index.
* @param [test=undefined]
*   Test for child to look for (optional).
* @returns
*   A child (matching `test`, if given) or `undefined`.
*/
var findAfter = (
/**
* @param {UnistParent} parent
* @param {UnistNode | number} index
* @param {Test} [test]
* @returns {UnistNode | undefined}
*/
function(parent, index, test) {
	const is = convert(test);
	if (!parent || !parent.type || !parent.children) throw new Error("Expected parent node");
	if (typeof index === "number") {
		if (index < 0 || index === Number.POSITIVE_INFINITY) throw new Error("Expected positive finite number as index");
	} else {
		index = parent.children.indexOf(index);
		if (index < 0) throw new Error("Expected child node or index");
	}
	while (++index < parent.children.length) if (is(parent.children[index], index, parent)) return parent.children[index];
});
//#endregion
//#region node_modules/hast-util-is-element/lib/index.js
/**
* Generate a check from a test.
*
* Useful if you’re going to test many nodes, for example when creating a
* utility where something else passes a compatible test.
*
* The created function is a bit faster because it expects valid input only:
* an `element`, `index`, and `parent`.
*
* @param test
*   A test for a specific element.
* @returns
*   A check.
*/
var convertElement = (
/**
* @param {Test | null | undefined} [test]
* @returns {Check}
*/
function(test) {
	if (test === null || test === void 0) return element;
	if (typeof test === "string") return tagNameFactory(test);
	if (typeof test === "object") return anyFactory(test);
	if (typeof test === "function") return castFactory(test);
	throw new Error("Expected function, string, or array as `test`");
});
/**
* Handle multiple tests.
*
* @param {Array<TestFunction | string>} tests
* @returns {Check}
*/
function anyFactory(tests) {
	/** @type {Array<Check>} */
	const checks = [];
	let index = -1;
	while (++index < tests.length) checks[index] = convertElement(tests[index]);
	return castFactory(any);
	/**
	* @this {unknown}
	* @type {TestFunction}
	*/
	function any(...parameters) {
		let index = -1;
		while (++index < checks.length) if (checks[index].apply(this, parameters)) return true;
		return false;
	}
}
/**
* Turn a string into a test for an element with a certain type.
*
* @param {string} check
* @returns {Check}
*/
function tagNameFactory(check) {
	return castFactory(tagName);
	/**
	* @param {Element} element
	* @returns {boolean}
	*/
	function tagName(element) {
		return element.tagName === check;
	}
}
/**
* Turn a custom test into a test for an element that passes that test.
*
* @param {TestFunction} testFunction
* @returns {Check}
*/
function castFactory(testFunction) {
	return check;
	/**
	* @this {unknown}
	* @type {Check}
	*/
	function check(value, index, parent) {
		return Boolean(looksLikeAnElement(value) && testFunction.call(this, value, typeof index === "number" ? index : void 0, parent || void 0));
	}
}
/**
* Make sure something is an element.
*
* @param {unknown} element
* @returns {element is Element}
*/
function element(element) {
	return Boolean(element && typeof element === "object" && "type" in element && element.type === "element" && "tagName" in element && typeof element.tagName === "string");
}
/**
* @param {unknown} value
* @returns {value is Element}
*/
function looksLikeAnElement(value) {
	return value !== null && typeof value === "object" && "type" in value && "tagName" in value;
}
//#endregion
//#region node_modules/hast-util-to-text/lib/index.js
/**
* @typedef {import('hast').Comment} Comment
* @typedef {import('hast').Element} Element
* @typedef {import('hast').Nodes} Nodes
* @typedef {import('hast').Parents} Parents
* @typedef {import('hast').Text} Text
* @typedef {import('hast-util-is-element').TestFunction} TestFunction
*/
/**
* @typedef {'normal' | 'nowrap' | 'pre' | 'pre-wrap'} Whitespace
*   Valid and useful whitespace values (from CSS).
*
* @typedef {0 | 1 | 2} BreakNumber
*   Specific break:
*
*   *   `0` — space
*   *   `1` — line ending
*   *   `2` — blank line
*
* @typedef {'\n'} BreakForce
*   Forced break.
*
* @typedef {boolean} BreakValue
*   Whether there was a break.
*
* @typedef {BreakNumber | BreakValue | undefined} BreakBefore
*   Any value for a break before.
*
* @typedef {BreakForce | BreakNumber | BreakValue | undefined} BreakAfter
*   Any value for a break after.
*
* @typedef CollectionInfo
*   Info on current collection.
* @property {BreakAfter} breakAfter
*   Whether there was a break after.
* @property {BreakBefore} breakBefore
*   Whether there was a break before.
* @property {Whitespace} whitespace
*   Current whitespace setting.
*
* @typedef Options
*   Configuration.
* @property {Whitespace | null | undefined} [whitespace='normal']
*   Initial CSS whitespace setting to use (default: `'normal'`).
*/
var searchLineFeeds = /\n/g;
var searchTabOrSpaces = /[\t ]+/g;
var br = convertElement("br");
var cell = convertElement(isCell);
var p = convertElement("p");
var row = convertElement("tr");
var notRendered = convertElement([
	"datalist",
	"head",
	"noembed",
	"noframes",
	"noscript",
	"rp",
	"script",
	"style",
	"template",
	"title",
	hidden,
	closedDialog
]);
var blockOrCaption = convertElement([
	"address",
	"article",
	"aside",
	"blockquote",
	"body",
	"caption",
	"center",
	"dd",
	"dialog",
	"dir",
	"dl",
	"dt",
	"div",
	"figure",
	"figcaption",
	"footer",
	"form,",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"header",
	"hgroup",
	"hr",
	"html",
	"legend",
	"li",
	"listing",
	"main",
	"menu",
	"nav",
	"ol",
	"p",
	"plaintext",
	"pre",
	"section",
	"ul",
	"xmp"
]);
/**
* Get the plain-text value of a node.
*
* ###### Algorithm
*
* *   if `tree` is a comment, returns its `value`
* *   if `tree` is a text, applies normal whitespace collapsing to its
*     `value`, as defined by the CSS Text spec
* *   if `tree` is a root or element, applies an algorithm similar to the
*     `innerText` getter as defined by HTML
*
* ###### Notes
*
* > 👉 **Note**: the algorithm acts as if `tree` is being rendered, and as if
* > we’re a CSS-supporting user agent, with scripting enabled.
*
* *   if `tree` is an element that is not displayed (such as a `head`), we’ll
*     still use the `innerText` algorithm instead of switching to `textContent`
* *   if descendants of `tree` are elements that are not displayed, they are
*     ignored
* *   CSS is not considered, except for the default user agent style sheet
* *   a line feed is collapsed instead of ignored in cases where Fullwidth, Wide,
*     or Halfwidth East Asian Width characters are used, the same goes for a case
*     with Chinese, Japanese, or Yi writing systems
* *   replaced elements (such as `audio`) are treated like non-replaced elements
*
* @param {Nodes} tree
*   Tree to turn into text.
* @param {Readonly<Options> | null | undefined} [options]
*   Configuration (optional).
* @returns {string}
*   Serialized `tree`.
*/
function toText(tree, options) {
	const options_ = options || {};
	const children = "children" in tree ? tree.children : [];
	const block = blockOrCaption(tree);
	const whitespace = inferWhitespace(tree, {
		whitespace: options_.whitespace || "normal",
		breakBefore: false,
		breakAfter: false
	});
	/** @type {Array<BreakNumber | string>} */
	const results = [];
	if (tree.type === "text" || tree.type === "comment") results.push(...collectText(tree, {
		whitespace,
		breakBefore: true,
		breakAfter: true
	}));
	let index = -1;
	while (++index < children.length) results.push(...renderedTextCollection(children[index], tree, {
		whitespace,
		breakBefore: index ? void 0 : block,
		breakAfter: index < children.length - 1 ? br(children[index + 1]) : block
	}));
	/** @type {Array<string>} */
	const result = [];
	/** @type {number | undefined} */
	let count;
	index = -1;
	while (++index < results.length) {
		const value = results[index];
		if (typeof value === "number") {
			if (count !== void 0 && value > count) count = value;
		} else if (value) {
			if (count !== void 0 && count > -1) result.push("\n".repeat(count) || " ");
			count = -1;
			result.push(value);
		}
	}
	return result.join("");
}
/**
* <https://html.spec.whatwg.org/multipage/dom.html#rendered-text-collection-steps>
*
* @param {Nodes} node
* @param {Parents} parent
* @param {CollectionInfo} info
* @returns {Array<BreakNumber | string>}
*/
function renderedTextCollection(node, parent, info) {
	if (node.type === "element") return collectElement(node, parent, info);
	if (node.type === "text") return info.whitespace === "normal" ? collectText(node, info) : collectPreText(node);
	return [];
}
/**
* Collect an element.
*
* @param {Element} node
*   Element node.
* @param {Parents} parent
* @param {CollectionInfo} info
*   Info on current collection.
* @returns {Array<BreakNumber | string>}
*/
function collectElement(node, parent, info) {
	const whitespace = inferWhitespace(node, info);
	const children = node.children || [];
	let index = -1;
	/** @type {Array<BreakNumber | string>} */
	let items = [];
	if (notRendered(node)) return items;
	/** @type {BreakNumber | undefined} */
	let prefix;
	/** @type {BreakForce | BreakNumber | undefined} */
	let suffix;
	if (br(node)) suffix = "\n";
	else if (row(node) && findAfter(parent, node, row)) suffix = "\n";
	else if (p(node)) {
		prefix = 2;
		suffix = 2;
	} else if (blockOrCaption(node)) {
		prefix = 1;
		suffix = 1;
	}
	while (++index < children.length) items = items.concat(renderedTextCollection(children[index], node, {
		whitespace,
		breakBefore: index ? void 0 : prefix,
		breakAfter: index < children.length - 1 ? br(children[index + 1]) : suffix
	}));
	if (cell(node) && findAfter(parent, node, cell)) items.push("	");
	if (prefix) items.unshift(prefix);
	if (suffix) items.push(suffix);
	return items;
}
/**
* 4.  If node is a Text node, then for each CSS text box produced by node,
*     in content order, compute the text of the box after application of the
*     CSS `white-space` processing rules and `text-transform` rules, set
*     items to the list of the resulting strings, and return items.
*     The CSS `white-space` processing rules are slightly modified:
*     collapsible spaces at the end of lines are always collapsed, but they
*     are only removed if the line is the last line of the block, or it ends
*     with a br element.
*     Soft hyphens should be preserved.
*
*     Note: See `collectText` and `collectPreText`.
*     Note: we don’t deal with `text-transform`, no element has that by
*     default.
*
* See: <https://drafts.csswg.org/css-text/#white-space-phase-1>
*
* @param {Comment | Text} node
*   Text node.
* @param {CollectionInfo} info
*   Info on current collection.
* @returns {Array<BreakNumber | string>}
*   Result.
*/
function collectText(node, info) {
	const value = String(node.value);
	/** @type {Array<string>} */
	const lines = [];
	/** @type {Array<BreakNumber | string>} */
	const result = [];
	let start = 0;
	while (start <= value.length) {
		searchLineFeeds.lastIndex = start;
		const match = searchLineFeeds.exec(value);
		const end = match && "index" in match ? match.index : value.length;
		lines.push(trimAndCollapseSpacesAndTabs(value.slice(start, end).replace(/[\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, ""), start === 0 ? info.breakBefore : true, end === value.length ? info.breakAfter : true));
		start = end + 1;
	}
	let index = -1;
	/** @type {BreakNumber | undefined} */
	let join;
	while (++index < lines.length) if (lines[index].charCodeAt(lines[index].length - 1) === 8203 || index < lines.length - 1 && lines[index + 1].charCodeAt(0) === 8203) {
		result.push(lines[index]);
		join = void 0;
	} else if (lines[index]) {
		if (typeof join === "number") result.push(join);
		result.push(lines[index]);
		join = 0;
	} else if (index === 0 || index === lines.length - 1) result.push(0);
	return result;
}
/**
* Collect a text node as “pre” whitespace.
*
* @param {Text} node
*   Text node.
* @returns {Array<BreakNumber | string>}
*   Result.
*/
function collectPreText(node) {
	return [String(node.value)];
}
/**
* 3.  Every collapsible tab is converted to a collapsible space (U+0020).
* 4.  Any collapsible space immediately following another collapsible
*     space—even one outside the boundary of the inline containing that
*     space, provided both spaces are within the same inline formatting
*     context—is collapsed to have zero advance width. (It is invisible,
*     but retains its soft wrap opportunity, if any.)
*
* @param {string} value
*   Value to collapse.
* @param {BreakBefore} breakBefore
*   Whether there was a break before.
* @param {BreakAfter} breakAfter
*   Whether there was a break after.
* @returns {string}
*   Result.
*/
function trimAndCollapseSpacesAndTabs(value, breakBefore, breakAfter) {
	/** @type {Array<string>} */
	const result = [];
	let start = 0;
	/** @type {number | undefined} */
	let end;
	while (start < value.length) {
		searchTabOrSpaces.lastIndex = start;
		const match = searchTabOrSpaces.exec(value);
		end = match ? match.index : value.length;
		if (!start && !end && match && !breakBefore) result.push("");
		if (start !== end) result.push(value.slice(start, end));
		start = match ? end + match[0].length : end;
	}
	if (start !== end && !breakAfter) result.push("");
	return result.join(" ");
}
/**
* Figure out the whitespace of a node.
*
* We don’t support void elements here (so `nobr wbr` -> `normal` is ignored).
*
* @param {Nodes} node
*   Node (typically `Element`).
* @param {CollectionInfo} info
*   Info on current collection.
* @returns {Whitespace}
*   Applied whitespace.
*/
function inferWhitespace(node, info) {
	if (node.type === "element") {
		const properties = node.properties || {};
		switch (node.tagName) {
			case "listing":
			case "plaintext":
			case "xmp": return "pre";
			case "nobr": return "nowrap";
			case "pre": return properties.wrap ? "pre-wrap" : "pre";
			case "td":
			case "th": return properties.noWrap ? "nowrap" : info.whitespace;
			case "textarea": return "pre-wrap";
		}
	}
	return info.whitespace;
}
/**
* @type {TestFunction}
* @param {Element} node
* @returns {node is {properties: {hidden: true}}}
*/
function hidden(node) {
	return Boolean((node.properties || {}).hidden);
}
/**
* @type {TestFunction}
* @param {Element} node
* @returns {node is {tagName: 'td' | 'th'}}
*/
function isCell(node) {
	return node.tagName === "td" || node.tagName === "th";
}
/**
* @type {TestFunction}
*/
function closedDialog(node) {
	return node.tagName === "dialog" && !(node.properties || {}).open;
}
//#endregion
//#region node_modules/katex/dist/katex.mjs
var katex_exports = /* @__PURE__ */ __exportAll({
	ParseError: () => ParseError,
	SETTINGS_SCHEMA: () => SETTINGS_SCHEMA,
	__defineFunction: () => defineFunction,
	__defineMacro: () => defineMacro,
	__defineSymbol: () => defineSymbol,
	__domTree: () => __domTree,
	__parse: () => generateParseTree,
	__renderToDomTree: () => renderToDomTree,
	__renderToHTMLTree: () => renderToHTMLTree,
	__setFontMetrics: () => setFontMetrics,
	default: () => katex,
	render: () => render,
	renderToString: () => renderToString,
	version: () => version
});
/**
* This is the ParseError class, which is the main error thrown by KaTeX
* functions when something has gone wrong. This is used to distinguish internal
* errors from errors in the expression that the user provided.
*
* If possible, a caller should provide a Token or ParseNode with information
* about where in the source string the problem occurred.
*/
var ParseError = class ParseError extends Error {
	constructor(message, token) {
		var error = "KaTeX parse error: " + message;
		var start;
		var end;
		var loc = token && token.loc;
		if (loc && loc.start <= loc.end) {
			var input = loc.lexer.input;
			start = loc.start;
			end = loc.end;
			if (start === input.length) error += " at end of input: ";
			else error += " at position " + (start + 1) + ": ";
			var underlined = input.slice(start, end).replace(/[^]/g, "$&̲");
			var left;
			if (start > 15) left = "…" + input.slice(start - 15, start);
			else left = input.slice(0, start);
			var right;
			if (end + 15 < input.length) right = input.slice(end, end + 15) + "…";
			else right = input.slice(end);
			error += left + underlined + right;
		}
		super(error);
		this.name = "ParseError";
		this.position = void 0;
		this.length = void 0;
		this.rawMessage = void 0;
		Object.setPrototypeOf(this, ParseError.prototype);
		this.position = start;
		if (start != null && end != null) this.length = end - start;
		this.rawMessage = message;
	}
};
/**
* This file contains a list of utility functions which are useful in other
* files.
*/
var uppercase = /([A-Z])/g;
var hyphenate = (str) => str.replace(uppercase, "-$1").toLowerCase();
var ESCAPE_LOOKUP = {
	"&": "&amp;",
	">": "&gt;",
	"<": "&lt;",
	"\"": "&quot;",
	"'": "&#x27;"
};
var ESCAPE_REGEX = /[&><"']/g;
/**
* Escapes text to prevent scripting attacks.
*/
var escape = (text) => String(text).replace(ESCAPE_REGEX, (match) => ESCAPE_LOOKUP[match]);
/**
* Sometimes we want to pull out the innermost element of a group. In most
* cases, this will just be the group itself, but when ordgroups and colors have
* a single element, we want to pull that out.
*/
var getBaseElem = (group) => {
	if (group.type === "ordgroup") if (group.body.length === 1) return getBaseElem(group.body[0]);
	else return group;
	else if (group.type === "color") if (group.body.length === 1) return getBaseElem(group.body[0]);
	else return group;
	else if (group.type === "font") return getBaseElem(group.body);
	else return group;
};
var characterNodesTypes = /* @__PURE__ */ new Set([
	"mathord",
	"textord",
	"atom"
]);
/**
* TeXbook algorithms often reference "character boxes", which are simply groups
* with a single character in them. To decide if something is a character box,
* we find its innermost group, and see if it is a single character.
*/
var isCharacterBox = (group) => characterNodesTypes.has(getBaseElem(group).type);
/**
* Return the protocol of a URL, or "_relative" if the URL does not specify a
* protocol (and thus is relative), or `null` if URL has invalid protocol
* (so should be outright rejected).
*/
var protocolFromUrl = (url) => {
	var protocol = /^[\x00-\x20]*([^\\/#?]*?)(:|&#0*58|&#x0*3a|&colon)/i.exec(url);
	if (!protocol) return "_relative";
	if (protocol[2] !== ":") return null;
	if (!/^[a-zA-Z][a-zA-Z0-9+\-.]*$/.test(protocol[1])) return null;
	return protocol[1].toLowerCase();
};
var SETTINGS_SCHEMA = {
	displayMode: {
		type: "boolean",
		description: "Render math in display mode, which puts the math in display style (so \\int and \\sum are large, for example), and centers the math on the page on its own line.",
		cli: "-d, --display-mode"
	},
	output: {
		type: { enum: [
			"htmlAndMathml",
			"html",
			"mathml"
		] },
		description: "Determines the markup language of the output.",
		cli: "-F, --format <type>"
	},
	leqno: {
		type: "boolean",
		description: "Render display math in leqno style (left-justified tags)."
	},
	fleqn: {
		type: "boolean",
		description: "Render display math flush left."
	},
	throwOnError: {
		type: "boolean",
		default: true,
		cli: "-t, --no-throw-on-error",
		cliDescription: "Render errors (in the color given by --error-color) instead of throwing a ParseError exception when encountering an error."
	},
	errorColor: {
		type: "string",
		default: "#cc0000",
		cli: "-c, --error-color <color>",
		cliDescription: "A color string given in the format 'rgb' or 'rrggbb' (no #). This option determines the color of errors rendered by the -t option.",
		cliProcessor: (color) => "#" + color
	},
	macros: {
		type: "object",
		cli: "-m, --macro <def>",
		cliDescription: "Define custom macro of the form '\\foo:expansion' (use multiple -m arguments for multiple macros).",
		cliDefault: [],
		cliProcessor: (def, defs) => {
			defs.push(def);
			return defs;
		}
	},
	minRuleThickness: {
		type: "number",
		description: "Specifies a minimum thickness, in ems, for fraction lines, `\\sqrt` top lines, `{array}` vertical lines, `\\hline`, `\\hdashline`, `\\underline`, `\\overline`, and the borders of `\\fbox`, `\\boxed`, and `\\fcolorbox`.",
		processor: (t) => Math.max(0, t),
		cli: "--min-rule-thickness <size>",
		cliProcessor: parseFloat
	},
	colorIsTextColor: {
		type: "boolean",
		description: "Makes \\color behave like LaTeX's 2-argument \\textcolor, instead of LaTeX's one-argument \\color mode change.",
		cli: "-b, --color-is-text-color"
	},
	strict: {
		type: [
			{ enum: [
				"warn",
				"ignore",
				"error"
			] },
			"boolean",
			"function"
		],
		description: "Turn on strict / LaTeX faithfulness mode, which throws an error if the input uses features that are not supported by LaTeX.",
		cli: "-S, --strict",
		cliDefault: false
	},
	trust: {
		type: ["boolean", "function"],
		description: "Trust the input, enabling all HTML features such as \\url.",
		cli: "-T, --trust"
	},
	maxSize: {
		type: "number",
		default: Infinity,
		description: "If non-zero, all user-specified sizes, e.g. in \\rule{500em}{500em}, will be capped to maxSize ems. Otherwise, elements and spaces can be arbitrarily large",
		processor: (s) => Math.max(0, s),
		cli: "-s, --max-size <n>",
		cliProcessor: parseInt
	},
	maxExpand: {
		type: "number",
		default: 1e3,
		description: "Limit the number of macro expansions to the specified number, to prevent e.g. infinite macro loops. If set to Infinity, the macro expander will try to fully expand as in LaTeX.",
		processor: (n) => Math.max(0, n),
		cli: "-e, --max-expand <n>",
		cliProcessor: (n) => n === "Infinity" ? Infinity : parseInt(n)
	},
	globalGroup: {
		type: "boolean",
		cli: false
	}
};
function getImplicitDefault(type) {
	if (typeof type !== "string") return type.enum[0];
	switch (type) {
		case "boolean": return false;
		case "string": return "";
		case "number": return 0;
		case "object": return {};
		default: throw new Error("Unexpected schema type; settings must declare an explicit default.");
	}
}
function getDefaultValue(schema) {
	if (schema.default !== void 0) return schema.default;
	return getImplicitDefault(Array.isArray(schema.type) ? schema.type[0] : schema.type);
}
function applySetting(target, prop, options, schema) {
	var optionValue = options[prop];
	target[prop] = optionValue !== void 0 ? schema.processor ? schema.processor(optionValue) : optionValue : getDefaultValue(schema);
}
/**
* The main Settings object
*
* The current options stored are:
*  - displayMode: Whether the expression should be typeset as inline math
*                 (false, the default), meaning that the math starts in
*                 \textstyle and is placed in an inline-block); or as display
*                 math (true), meaning that the math starts in \displaystyle
*                 and is placed in a block with vertical margin.
*/
var Settings = class {
	constructor(options) {
		if (options === void 0) options = {};
		this.displayMode = void 0;
		this.output = void 0;
		this.leqno = void 0;
		this.fleqn = void 0;
		this.throwOnError = void 0;
		this.errorColor = void 0;
		this.macros = void 0;
		this.minRuleThickness = void 0;
		this.colorIsTextColor = void 0;
		this.strict = void 0;
		this.trust = void 0;
		this.maxSize = void 0;
		this.maxExpand = void 0;
		this.globalGroup = void 0;
		options = options || {};
		for (var prop of Object.keys(SETTINGS_SCHEMA)) {
			var schema = SETTINGS_SCHEMA[prop];
			if (schema) applySetting(this, prop, options, schema);
		}
	}
	/**
	* Report nonstrict (non-LaTeX-compatible) input.
	* Can safely not be called if `this.strict` is false in JavaScript.
	*/
	reportNonstrict(errorCode, errorMsg, token) {
		var strict = this.strict;
		if (typeof strict === "function") strict = strict(errorCode, errorMsg, token);
		if (!strict || strict === "ignore") return;
		else if (strict === true || strict === "error") throw new ParseError("LaTeX-incompatible input and strict mode is set to 'error': " + (errorMsg + " [" + errorCode + "]"), token);
		else if (strict === "warn") typeof console !== "undefined" && console.warn("LaTeX-incompatible input and strict mode is set to 'warn': " + (errorMsg + " [" + errorCode + "]"));
		else typeof console !== "undefined" && console.warn("LaTeX-incompatible input and strict mode is set to " + ("unrecognized '" + strict + "': " + errorMsg + " [" + errorCode + "]"));
	}
	/**
	* Check whether to apply strict (LaTeX-adhering) behavior for unusual
	* input (like `\\`).  Unlike `nonstrict`, will not throw an error;
	* instead, "error" translates to a return value of `true`, while "ignore"
	* translates to a return value of `false`.  May still print a warning:
	* "warn" prints a warning and returns `false`.
	* This is for the second category of `errorCode`s listed in the README.
	*/
	useStrictBehavior(errorCode, errorMsg, token) {
		var strict = this.strict;
		if (typeof strict === "function") try {
			strict = strict(errorCode, errorMsg, token);
		} catch (error) {
			strict = "error";
		}
		if (!strict || strict === "ignore") return false;
		else if (strict === true || strict === "error") return true;
		else if (strict === "warn") {
			typeof console !== "undefined" && console.warn("LaTeX-incompatible input and strict mode is set to 'warn': " + (errorMsg + " [" + errorCode + "]"));
			return false;
		} else {
			typeof console !== "undefined" && console.warn("LaTeX-incompatible input and strict mode is set to " + ("unrecognized '" + strict + "': " + errorMsg + " [" + errorCode + "]"));
			return false;
		}
	}
	/**
	* Check whether to test potentially dangerous input, and return
	* `true` (trusted) or `false` (untrusted).  The sole argument `context`
	* should be an object with `command` field specifying the relevant LaTeX
	* command (as a string starting with `\`), and any other arguments, etc.
	* If `context` has a `url` field, a `protocol` field will automatically
	* get added by this function (changing the specified object).
	*/
	isTrusted(context) {
		if ("url" in context && context.url && !context.protocol) {
			var protocol = protocolFromUrl(context.url);
			if (protocol == null) return false;
			context.protocol = protocol;
		}
		var trust = typeof this.trust === "function" ? this.trust(context) : this.trust;
		return Boolean(trust);
	}
};
/**
* This file contains information and classes for the various kinds of styles
* used in TeX. It provides a generic `Style` class, which holds information
* about a specific style. It then provides instances of all the different kinds
* of styles possible, and provides functions to move between them and get
* information about them.
*/
/**
* The main style class. Contains a unique id for the style, a size (which is
* the same for cramped and uncramped version of a style), and a cramped flag.
*/
var Style = class {
	constructor(id, size, cramped) {
		this.id = void 0;
		this.size = void 0;
		this.cramped = void 0;
		this.id = id;
		this.size = size;
		this.cramped = cramped;
	}
	/**
	* Get the style of a superscript given a base in the current style.
	*/
	sup() {
		return styles[sup[this.id]];
	}
	/**
	* Get the style of a subscript given a base in the current style.
	*/
	sub() {
		return styles[sub[this.id]];
	}
	/**
	* Get the style of a fraction numerator given the fraction in the current
	* style.
	*/
	fracNum() {
		return styles[fracNum[this.id]];
	}
	/**
	* Get the style of a fraction denominator given the fraction in the current
	* style.
	*/
	fracDen() {
		return styles[fracDen[this.id]];
	}
	/**
	* Get the cramped version of a style (in particular, cramping a cramped style
	* doesn't change the style).
	*/
	cramp() {
		return styles[cramp[this.id]];
	}
	/**
	* Get a text or display version of this style.
	*/
	text() {
		return styles[text$1[this.id]];
	}
	/**
	* Return true if this style is tightly spaced (scriptstyle/scriptscriptstyle)
	*/
	isTight() {
		return this.size >= 2;
	}
};
var D = 0;
var Dc = 1;
var T = 2;
var Tc = 3;
var S = 4;
var Sc = 5;
var SS = 6;
var SSc = 7;
var styles = [
	new Style(D, 0, false),
	new Style(Dc, 0, true),
	new Style(T, 1, false),
	new Style(Tc, 1, true),
	new Style(S, 2, false),
	new Style(Sc, 2, true),
	new Style(SS, 3, false),
	new Style(SSc, 3, true)
];
var sup = [
	S,
	Sc,
	S,
	Sc,
	SS,
	SSc,
	SS,
	SSc
];
var sub = [
	Sc,
	Sc,
	Sc,
	Sc,
	SSc,
	SSc,
	SSc,
	SSc
];
var fracNum = [
	T,
	Tc,
	S,
	Sc,
	SS,
	SSc,
	SS,
	SSc
];
var fracDen = [
	Tc,
	Tc,
	Sc,
	Sc,
	SSc,
	SSc,
	SSc,
	SSc
];
var cramp = [
	Dc,
	Dc,
	Tc,
	Tc,
	Sc,
	Sc,
	SSc,
	SSc
];
var text$1 = [
	D,
	Dc,
	T,
	Tc,
	T,
	Tc,
	T,
	Tc
];
var Style$1 = {
	DISPLAY: styles[D],
	TEXT: styles[T],
	SCRIPT: styles[S],
	SCRIPTSCRIPT: styles[SS]
};
/**
* Unicode block data for the families of scripts we support in \text{}.
* Scripts only need to appear here if they do not have font metrics.
*/
var scriptData = [
	{
		name: "latin",
		blocks: [[256, 591], [768, 879]]
	},
	{
		name: "cyrillic",
		blocks: [[1024, 1279]]
	},
	{
		name: "armenian",
		blocks: [[1328, 1423]]
	},
	{
		name: "brahmic",
		blocks: [[2304, 4255]]
	},
	{
		name: "georgian",
		blocks: [[4256, 4351]]
	},
	{
		name: "cjk",
		blocks: [
			[12288, 12543],
			[19968, 40879],
			[65280, 65376]
		]
	},
	{
		name: "hangul",
		blocks: [[44032, 55215]]
	}
];
/**
* Given a codepoint, return the name of the script or script family
* it is from, or null if it is not part of a known block
*/
function scriptFromCodepoint(codepoint) {
	for (var i = 0; i < scriptData.length; i++) {
		var script = scriptData[i];
		for (var _i = 0; _i < script.blocks.length; _i++) {
			var block = script.blocks[_i];
			if (codepoint >= block[0] && codepoint <= block[1]) return script.name;
		}
	}
	return null;
}
/**
* A flattened version of all the supported blocks in a single array.
* This is an optimization to make supportedCodepoint() fast.
*/
var allBlocks = [];
scriptData.forEach((s) => s.blocks.forEach((b) => allBlocks.push(...b)));
/**
* Given a codepoint, return true if it falls within one of the
* scripts or script families defined above and false otherwise.
*
* Micro benchmarks shows that this is faster than
* /[\u3000-\u30FF\u4E00-\u9FAF\uFF00-\uFF60\uAC00-\uD7AF\u0900-\u109F]/.test()
* in Firefox, Chrome and Node.
*/
function supportedCodepoint(codepoint) {
	for (var i = 0; i < allBlocks.length; i += 2) if (codepoint >= allBlocks[i] && codepoint <= allBlocks[i + 1]) return true;
	return false;
}
/**
* This file provides support to domTree.js and delimiter.js.
* It's a storehouse of path geometry for SVG images.
*/
var doubleBrushStroke = (svgPath) => svgPath + " " + svgPath;
var hLinePad = 80;
var sqrtMain = function sqrtMain(extraVinculum, hLinePad) {
	return "M95," + (622 + extraVinculum + hLinePad) + "\nc-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14\nc0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54\nc44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10\ns173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429\nc69,-144,104.5,-217.7,106.5,-221\nl" + extraVinculum / 2.075 + " -" + extraVinculum + "\nc5.3,-9.3,12,-14,20,-14\nH400000v" + (40 + extraVinculum) + "H845.2724\ns-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7\nc-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z\nM" + (834 + extraVinculum) + " " + hLinePad + "h400000v" + (40 + extraVinculum) + "h-400000z";
};
var sqrtSize1 = function sqrtSize1(extraVinculum, hLinePad) {
	return "M263," + (601 + extraVinculum + hLinePad) + "c0.7,0,18,39.7,52,119\nc34,79.3,68.167,158.7,102.5,238c34.3,79.3,51.8,119.3,52.5,120\nc340,-704.7,510.7,-1060.3,512,-1067\nl" + extraVinculum / 2.084 + " -" + extraVinculum + "\nc4.7,-7.3,11,-11,19,-11\nH40000v" + (40 + extraVinculum) + "H1012.3\ns-271.3,567,-271.3,567c-38.7,80.7,-84,175,-136,283c-52,108,-89.167,185.3,-111.5,232\nc-22.3,46.7,-33.8,70.3,-34.5,71c-4.7,4.7,-12.3,7,-23,7s-12,-1,-12,-1\ns-109,-253,-109,-253c-72.7,-168,-109.3,-252,-110,-252c-10.7,8,-22,16.7,-34,26\nc-22,17.3,-33.3,26,-34,26s-26,-26,-26,-26s76,-59,76,-59s76,-60,76,-60z\nM" + (1001 + extraVinculum) + " " + hLinePad + "h400000v" + (40 + extraVinculum) + "h-400000z";
};
var sqrtSize2 = function sqrtSize2(extraVinculum, hLinePad) {
	return "M983 " + (10 + extraVinculum + hLinePad) + "\nl" + extraVinculum / 3.13 + " -" + extraVinculum + "\nc4,-6.7,10,-10,18,-10 H400000v" + (40 + extraVinculum) + "\nH1013.1s-83.4,268,-264.1,840c-180.7,572,-277,876.3,-289,913c-4.7,4.7,-12.7,7,-24,7\ns-12,0,-12,0c-1.3,-3.3,-3.7,-11.7,-7,-25c-35.3,-125.3,-106.7,-373.3,-214,-744\nc-10,12,-21,25,-33,39s-32,39,-32,39c-6,-5.3,-15,-14,-27,-26s25,-30,25,-30\nc26.7,-32.7,52,-63,76,-91s52,-60,52,-60s208,722,208,722\nc56,-175.3,126.3,-397.3,211,-666c84.7,-268.7,153.8,-488.2,207.5,-658.5\nc53.7,-170.3,84.5,-266.8,92.5,-289.5z\nM" + (1001 + extraVinculum) + " " + hLinePad + "h400000v" + (40 + extraVinculum) + "h-400000z";
};
var sqrtSize3 = function sqrtSize3(extraVinculum, hLinePad) {
	return "M424," + (2398 + extraVinculum + hLinePad) + "\nc-1.3,-0.7,-38.5,-172,-111.5,-514c-73,-342,-109.8,-513.3,-110.5,-514\nc0,-2,-10.7,14.3,-32,49c-4.7,7.3,-9.8,15.7,-15.5,25c-5.7,9.3,-9.8,16,-12.5,20\ns-5,7,-5,7c-4,-3.3,-8.3,-7.7,-13,-13s-13,-13,-13,-13s76,-122,76,-122s77,-121,77,-121\ns209,968,209,968c0,-2,84.7,-361.7,254,-1079c169.3,-717.3,254.7,-1077.7,256,-1081\nl" + extraVinculum / 4.223 + " -" + extraVinculum + "c4,-6.7,10,-10,18,-10 H400000\nv" + (40 + extraVinculum) + "H1014.6\ns-87.3,378.7,-272.6,1166c-185.3,787.3,-279.3,1182.3,-282,1185\nc-2,6,-10,9,-24,9\nc-8,0,-12,-0.7,-12,-2z M" + (1001 + extraVinculum) + " " + hLinePad + "\nh400000v" + (40 + extraVinculum) + "h-400000z";
};
var sqrtSize4 = function sqrtSize4(extraVinculum, hLinePad) {
	return "M473," + (2713 + extraVinculum + hLinePad) + "\nc339.3,-1799.3,509.3,-2700,510,-2702 l" + extraVinculum / 5.298 + " -" + extraVinculum + "\nc3.3,-7.3,9.3,-11,18,-11 H400000v" + (40 + extraVinculum) + "H1017.7\ns-90.5,478,-276.2,1466c-185.7,988,-279.5,1483,-281.5,1485c-2,6,-10,9,-24,9\nc-8,0,-12,-0.7,-12,-2c0,-1.3,-5.3,-32,-16,-92c-50.7,-293.3,-119.7,-693.3,-207,-1200\nc0,-1.3,-5.3,8.7,-16,30c-10.7,21.3,-21.3,42.7,-32,64s-16,33,-16,33s-26,-26,-26,-26\ns76,-153,76,-153s77,-151,77,-151c0.7,0.7,35.7,202,105,604c67.3,400.7,102,602.7,104,\n606zM" + (1001 + extraVinculum) + " " + hLinePad + "h400000v" + (40 + extraVinculum) + "H1017.7z";
};
var phasePath = function phasePath(y) {
	var x = y / 2;
	return "M400000 " + y + " H0 L" + x + " 0 l65 45 L145 " + (y - 80) + " H400000z";
};
var sqrtTall = function sqrtTall(extraVinculum, hLinePad, viewBoxHeight) {
	var vertSegment = viewBoxHeight - 54 - hLinePad - extraVinculum;
	return "M702 " + (extraVinculum + hLinePad) + "H400000" + (40 + extraVinculum) + "\nH742v" + vertSegment + "l-4 4-4 4c-.667.7 -2 1.5-4 2.5s-4.167 1.833-6.5 2.5-5.5 1-9.5 1\nh-12l-28-84c-16.667-52-96.667 -294.333-240-727l-212 -643 -85 170\nc-4-3.333-8.333-7.667-13 -13l-13-13l77-155 77-156c66 199.333 139 419.667\n219 661 l218 661zM702 " + hLinePad + "H400000v" + (40 + extraVinculum) + "H742z";
};
var sqrtPath = function sqrtPath(size, extraVinculum, viewBoxHeight) {
	extraVinculum = 1e3 * extraVinculum;
	var path = "";
	switch (size) {
		case "sqrtMain":
			path = sqrtMain(extraVinculum, hLinePad);
			break;
		case "sqrtSize1":
			path = sqrtSize1(extraVinculum, hLinePad);
			break;
		case "sqrtSize2":
			path = sqrtSize2(extraVinculum, hLinePad);
			break;
		case "sqrtSize3":
			path = sqrtSize3(extraVinculum, hLinePad);
			break;
		case "sqrtSize4":
			path = sqrtSize4(extraVinculum, hLinePad);
			break;
		case "sqrtTall": path = sqrtTall(extraVinculum, hLinePad, viewBoxHeight);
	}
	return path;
};
var innerPath = function innerPath(name, height) {
	switch (name) {
		case "⎜": return doubleBrushStroke("M291 0 H417 V" + height + " H291z");
		case "∣": return doubleBrushStroke("M145 0 H188 V" + height + " H145z");
		case "∥": return doubleBrushStroke("M145 0 H188 V" + height + " H145z") + doubleBrushStroke("M367 0 H410 V" + height + " H367z");
		case "⎟": return doubleBrushStroke("M457 0 H583 V" + height + " H457z");
		case "⎢": return doubleBrushStroke("M319 0 H403 V" + height + " H319z");
		case "⎥": return doubleBrushStroke("M263 0 H347 V" + height + " H263z");
		case "⎪": return doubleBrushStroke("M384 0 H504 V" + height + " H384z");
		case "⏐": return doubleBrushStroke("M312 0 H355 V" + height + " H312z");
		case "‖": return doubleBrushStroke("M257 0 H300 V" + height + " H257z") + doubleBrushStroke("M478 0 H521 V" + height + " H478z");
		default: return "";
	}
};
var path = {
	doubleleftarrow: "M262 157\nl10-10c34-36 62.7-77 86-123 3.3-8 5-13.3 5-16 0-5.3-6.7-8-20-8-7.3\n 0-12.2.5-14.5 1.5-2.3 1-4.8 4.5-7.5 10.5-49.3 97.3-121.7 169.3-217 216-28\n 14-57.3 25-88 33-6.7 2-11 3.8-13 5.5-2 1.7-3 4.2-3 7.5s1 5.8 3 7.5\nc2 1.7 6.3 3.5 13 5.5 68 17.3 128.2 47.8 180.5 91.5 52.3 43.7 93.8 96.2 124.5\n 157.5 9.3 8 15.3 12.3 18 13h6c12-.7 18-4 18-10 0-2-1.7-7-5-15-23.3-46-52-87\n-86-123l-10-10h399738v-40H218c328 0 0 0 0 0l-10-8c-26.7-20-65.7-43-117-69 2.7\n-2 6-3.7 10-5 36.7-16 72.3-37.3 107-64l10-8h399782v-40z\nm8 0v40h399730v-40zm0 194v40h399730v-40z",
	doublerightarrow: "M399738 392l\n-10 10c-34 36-62.7 77-86 123-3.3 8-5 13.3-5 16 0 5.3 6.7 8 20 8 7.3 0 12.2-.5\n 14.5-1.5 2.3-1 4.8-4.5 7.5-10.5 49.3-97.3 121.7-169.3 217-216 28-14 57.3-25 88\n-33 6.7-2 11-3.8 13-5.5 2-1.7 3-4.2 3-7.5s-1-5.8-3-7.5c-2-1.7-6.3-3.5-13-5.5-68\n-17.3-128.2-47.8-180.5-91.5-52.3-43.7-93.8-96.2-124.5-157.5-9.3-8-15.3-12.3-18\n-13h-6c-12 .7-18 4-18 10 0 2 1.7 7 5 15 23.3 46 52 87 86 123l10 10H0v40h399782\nc-328 0 0 0 0 0l10 8c26.7 20 65.7 43 117 69-2.7 2-6 3.7-10 5-36.7 16-72.3 37.3\n-107 64l-10 8H0v40zM0 157v40h399730v-40zm0 194v40h399730v-40z",
	leftarrow: "M400000 241H110l3-3c68.7-52.7 113.7-120\n 135-202 4-14.7 6-23 6-25 0-7.3-7-11-21-11-8 0-13.2.8-15.5 2.5-2.3 1.7-4.2 5.8\n-5.5 12.5-1.3 4.7-2.7 10.3-4 17-12 48.7-34.8 92-68.5 130S65.3 228.3 18 247\nc-10 4-16 7.7-18 11 0 8.7 6 14.3 18 17 47.3 18.7 87.8 47 121.5 85S196 441.3 208\n 490c.7 2 1.3 5 2 9s1.2 6.7 1.5 8c.3 1.3 1 3.3 2 6s2.2 4.5 3.5 5.5c1.3 1 3.3\n 1.8 6 2.5s6 1 10 1c14 0 21-3.7 21-11 0-2-2-10.3-6-25-20-79.3-65-146.7-135-202\n l-3-3h399890zM100 241v40h399900v-40z",
	leftbrace: "M6 548l-6-6v-35l6-11c56-104 135.3-181.3 238-232 57.3-28.7 117\n-45 179-50h399577v120H403c-43.3 7-81 15-113 26-100.7 33-179.7 91-237 174-2.7\n 5-6 9-10 13-.7 1-7.3 1-20 1H6z",
	leftbraceunder: "M0 6l6-6h17c12.688 0 19.313.3 20 1 4 4 7.313 8.3 10 13\n 35.313 51.3 80.813 93.8 136.5 127.5 55.688 33.7 117.188 55.8 184.5 66.5.688\n 0 2 .3 4 1 18.688 2.7 76 4.3 172 5h399450v120H429l-6-1c-124.688-8-235-61.7\n-331-161C60.687 138.7 32.312 99.3 7 54L0 41V6z",
	leftgroup: "M400000 80\nH435C64 80 168.3 229.4 21 260c-5.9 1.2-18 0-18 0-2 0-3-1-3-3v-38C76 61 257 0\n 435 0h399565z",
	leftgroupunder: "M400000 262\nH435C64 262 168.3 112.6 21 82c-5.9-1.2-18 0-18 0-2 0-3 1-3 3v38c76 158 257 219\n 435 219h399565z",
	leftharpoon: "M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3\n-3.3 10.2-9.5 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5\n-18.3 3-21-1.3-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7\n-196 228-6.7 4.7-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40z",
	leftharpoonplus: "M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3-3.3 10.2-9.5\n 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5-18.3 3-21-1.3\n-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7-196 228-6.7 4.7\n-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40zM0 435v40h400000v-40z\nm0 0v40h400000v-40z",
	leftharpoondown: "M7 241c-4 4-6.333 8.667-7 14 0 5.333.667 9 2 11s5.333\n 5.333 12 10c90.667 54 156 130 196 228 3.333 10.667 6.333 16.333 9 17 2 .667 5\n 1 9 1h5c10.667 0 16.667-2 18-6 2-2.667 1-9.667-3-21-32-87.333-82.667-157.667\n-152-211l-3-3h399907v-40zM93 281 H400000 v-40L7 241z",
	leftharpoondownplus: "M7 435c-4 4-6.3 8.7-7 14 0 5.3.7 9 2 11s5.3 5.3 12\n 10c90.7 54 156 130 196 228 3.3 10.7 6.3 16.3 9 17 2 .7 5 1 9 1h5c10.7 0 16.7\n-2 18-6 2-2.7 1-9.7-3-21-32-87.3-82.7-157.7-152-211l-3-3h399907v-40H7zm93 0\nv40h399900v-40zM0 241v40h399900v-40zm0 0v40h399900v-40z",
	lefthook: "M400000 281 H103s-33-11.2-61-33.5S0 197.3 0 164s14.2-61.2 42.5\n-83.5C70.8 58.2 104 47 142 47 c16.7 0 25 6.7 25 20 0 12-8.7 18.7-26 20-40 3.3\n-68.7 15.7-86 37-10 12-15 25.3-15 40 0 22.7 9.8 40.7 29.5 54 19.7 13.3 43.5 21\n 71.5 23h399859zM103 281v-40h399897v40z",
	leftlinesegment: doubleBrushStroke("M40 281 V428 H0 V94 H40 V241 H400000 v40z"),
	leftbracketunder: doubleBrushStroke("M0 0 h120 V290 H399995 v120 H0z"),
	leftbracketover: doubleBrushStroke("M0 440 h120 V150 H399995 v-120 H0z"),
	leftmapsto: doubleBrushStroke("M40 281 V448H0V74H40V241H400000v40z"),
	leftToFrom: "M0 147h400000v40H0zm0 214c68 40 115.7 95.7 143 167h22c15.3 0 23\n-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69-70-101l-7-8h399905v-40H95l7-8\nc28.7-32 52-65.7 70-101 10.7-23.3 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 265.3\n 68 321 0 361zm0-174v-40h399900v40zm100 154v40h399900v-40z",
	longequal: doubleBrushStroke("M0 50 h400000 v40H0z m0 194h40000v40H0z"),
	midbrace: "M200428 334\nc-100.7-8.3-195.3-44-280-108-55.3-42-101.7-93-139-153l-9-14c-2.7 4-5.7 8.7-9 14\n-53.3 86.7-123.7 153-211 199-66.7 36-137.3 56.3-212 62H0V214h199568c178.3-11.7\n 311.7-78.3 403-201 6-8 9.7-12 11-12 .7-.7 6.7-1 18-1s17.3.3 18 1c1.3 0 5 4 11\n 12 44.7 59.3 101.3 106.3 170 141s145.3 54.3 229 60h199572v120z",
	midbraceunder: "M199572 214\nc100.7 8.3 195.3 44 280 108 55.3 42 101.7 93 139 153l9 14c2.7-4 5.7-8.7 9-14\n 53.3-86.7 123.7-153 211-199 66.7-36 137.3-56.3 212-62h199568v120H200432c-178.3\n 11.7-311.7 78.3-403 201-6 8-9.7 12-11 12-.7.7-6.7 1-18 1s-17.3-.3-18-1c-1.3 0\n-5-4-11-12-44.7-59.3-101.3-106.3-170-141s-145.3-54.3-229-60H0V214z",
	oiintSize1: "M512.6 71.6c272.6 0 320.3 106.8 320.3 178.2 0 70.8-47.7 177.6\n-320.3 177.6S193.1 320.6 193.1 249.8c0-71.4 46.9-178.2 319.5-178.2z\nm368.1 178.2c0-86.4-60.9-215.4-368.1-215.4-306.4 0-367.3 129-367.3 215.4 0 85.8\n60.9 214.8 367.3 214.8 307.2 0 368.1-129 368.1-214.8z",
	oiintSize2: "M757.8 100.1c384.7 0 451.1 137.6 451.1 230 0 91.3-66.4 228.8\n-451.1 228.8-386.3 0-452.7-137.5-452.7-228.8 0-92.4 66.4-230 452.7-230z\nm502.4 230c0-111.2-82.4-277.2-502.4-277.2s-504 166-504 277.2\nc0 110 84 276 504 276s502.4-166 502.4-276z",
	oiiintSize1: "M681.4 71.6c408.9 0 480.5 106.8 480.5 178.2 0 70.8-71.6 177.6\n-480.5 177.6S202.1 320.6 202.1 249.8c0-71.4 70.5-178.2 479.3-178.2z\nm525.8 178.2c0-86.4-86.8-215.4-525.7-215.4-437.9 0-524.7 129-524.7 215.4 0\n85.8 86.8 214.8 524.7 214.8 438.9 0 525.7-129 525.7-214.8z",
	oiiintSize2: "M1021.2 53c603.6 0 707.8 165.8 707.8 277.2 0 110-104.2 275.8\n-707.8 275.8-606 0-710.2-165.8-710.2-275.8C311 218.8 415.2 53 1021.2 53z\nm770.4 277.1c0-131.2-126.4-327.6-770.5-327.6S248.4 198.9 248.4 330.1\nc0 130 128.8 326.4 772.7 326.4s770.5-196.4 770.5-326.4z",
	rightarrow: "M0 241v40h399891c-47.3 35.3-84 78-110 128\n-16.7 32-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20\n 11 8 0 13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7\n 39-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85\n-40.5-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5\n-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67\n 151.7 139 205zm0 0v40h399900v-40z",
	rightbrace: "M400000 542l\n-6 6h-17c-12.7 0-19.3-.3-20-1-4-4-7.3-8.3-10-13-35.3-51.3-80.8-93.8-136.5-127.5\ns-117.2-55.8-184.5-66.5c-.7 0-2-.3-4-1-18.7-2.7-76-4.3-172-5H0V214h399571l6 1\nc124.7 8 235 61.7 331 161 31.3 33.3 59.7 72.7 85 118l7 13v35z",
	rightbraceunder: "M399994 0l6 6v35l-6 11c-56 104-135.3 181.3-238 232-57.3\n 28.7-117 45-179 50H-300V214h399897c43.3-7 81-15 113-26 100.7-33 179.7-91 237\n-174 2.7-5 6-9 10-13 .7-1 7.3-1 20-1h17z",
	rightgroup: "M0 80h399565c371 0 266.7 149.4 414 180 5.9 1.2 18 0 18 0 2 0\n 3-1 3-3v-38c-76-158-257-219-435-219H0z",
	rightgroupunder: "M0 262h399565c371 0 266.7-149.4 414-180 5.9-1.2 18 0 18\n 0 2 0 3 1 3 3v38c-76 158-257 219-435 219H0z",
	rightharpoon: "M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3\n-3.7-15.3-11-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2\n-10.7 0-16.7 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58\n 69.2 92 94.5zm0 0v40h399900v-40z",
	rightharpoonplus: "M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3-3.7-15.3-11\n-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2-10.7 0-16.7\n 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58 69.2 92 94.5z\nm0 0v40h399900v-40z m100 194v40h399900v-40zm0 0v40h399900v-40z",
	rightharpoondown: "M399747 511c0 7.3 6.7 11 20 11 8 0 13-.8 15-2.5s4.7-6.8\n 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3 8.5-5.8 9.5\n-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3-64.7 57-92 95\n-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 241v40h399900v-40z",
	rightharpoondownplus: "M399747 705c0 7.3 6.7 11 20 11 8 0 13-.8\n 15-2.5s4.7-6.8 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3\n 8.5-5.8 9.5-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3\n-64.7 57-92 95-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 435v40h399900v-40z\nm0-194v40h400000v-40zm0 0v40h400000v-40z",
	righthook: "M399859 241c-764 0 0 0 0 0 40-3.3 68.7-15.7 86-37 10-12 15-25.3\n 15-40 0-22.7-9.8-40.7-29.5-54-19.7-13.3-43.5-21-71.5-23-17.3-1.3-26-8-26-20 0\n-13.3 8.7-20 26-20 38 0 71 11.2 99 33.5 0 0 7 5.6 21 16.7 14 11.2 21 33.5 21\n 66.8s-14 61.2-42 83.5c-28 22.3-61 33.5-99 33.5L0 241z M0 281v-40h399859v40z",
	rightlinesegment: doubleBrushStroke("M399960 241 V94 h40 V428 h-40 V281 H0 v-40z"),
	rightbracketunder: doubleBrushStroke("M399995 0 h-120 V290 H0 v120 H400000z"),
	rightbracketover: doubleBrushStroke("M399995 440 h-120 V150 H0 v-120 H399995z"),
	rightToFrom: "M400000 167c-70.7-42-118-97.7-142-167h-23c-15.3 0-23 .3-23\n 1 0 1.3 5.3 13.7 16 37 18 35.3 41.3 69 70 101l7 8H0v40h399905l-7 8c-28.7 32\n-52 65.7-70 101-10.7 23.3-16 35.7-16 37 0 .7 7.7 1 23 1h23c24-69.3 71.3-125 142\n-167z M100 147v40h399900v-40zM0 341v40h399900v-40z",
	twoheadleftarrow: "M0 167c68 40\n 115.7 95.7 143 167h22c15.3 0 23-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69\n-70-101l-7-8h125l9 7c50.7 39.3 85 86 103 140h46c0-4.7-6.3-18.7-19-42-18-35.3\n-40-67.3-66-96l-9-9h399716v-40H284l9-9c26-28.7 48-60.7 66-96 12.7-23.333 19\n-37.333 19-42h-46c-18 54-52.3 100.7-103 140l-9 7H95l7-8c28.7-32 52-65.7 70-101\n 10.7-23.333 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 71.3 68 127 0 167z",
	twoheadrightarrow: "M400000 167\nc-68-40-115.7-95.7-143-167h-22c-15.3 0-23 .3-23 1 0 1.3 5.3 13.7 16 37 18 35.3\n 41.3 69 70 101l7 8h-125l-9-7c-50.7-39.3-85-86-103-140h-46c0 4.7 6.3 18.7 19 42\n 18 35.3 40 67.3 66 96l9 9H0v40h399716l-9 9c-26 28.7-48 60.7-66 96-12.7 23.333\n-19 37.333-19 42h46c18-54 52.3-100.7 103-140l9-7h125l-7 8c-28.7 32-52 65.7-70\n 101-10.7 23.333-16 35.7-16 37 0 .7 7.7 1 23 1h22c27.3-71.3 75-127 143-167z",
	tilde1: "M200 55.538c-77 0-168 73.953-177 73.953-3 0-7\n-2.175-9-5.437L2 97c-1-2-2-4-2-6 0-4 2-7 5-9l20-12C116 12 171 0 207 0c86 0\n 114 68 191 68 78 0 168-68 177-68 4 0 7 2 9 5l12 19c1 2.175 2 4.35 2 6.525 0\n 4.35-2 7.613-5 9.788l-19 13.05c-92 63.077-116.937 75.308-183 76.128\n-68.267.847-113-73.952-191-73.952z",
	tilde2: "M344 55.266c-142 0-300.638 81.316-311.5 86.418\n-8.01 3.762-22.5 10.91-23.5 5.562L1 120c-1-2-1-3-1-4 0-5 3-9 8-10l18.4-9C160.9\n 31.9 283 0 358 0c148 0 188 122 331 122s314-97 326-97c4 0 8 2 10 7l7 21.114\nc1 2.14 1 3.21 1 4.28 0 5.347-3 9.626-7 10.696l-22.3 12.622C852.6 158.372 751\n 181.476 676 181.476c-149 0-189-126.21-332-126.21z",
	tilde3: "M786 59C457 59 32 175.242 13 175.242c-6 0-10-3.457\n-11-10.37L.15 138c-1-7 3-12 10-13l19.2-6.4C378.4 40.7 634.3 0 804.3 0c337 0\n 411.8 157 746.8 157 328 0 754-112 773-112 5 0 10 3 11 9l1 14.075c1 8.066-.697\n 16.595-6.697 17.492l-21.052 7.31c-367.9 98.146-609.15 122.696-778.15 122.696\n -338 0-409-156.573-744-156.573z",
	tilde4: "M786 58C457 58 32 177.487 13 177.487c-6 0-10-3.345\n-11-10.035L.15 143c-1-7 3-12 10-13l22-6.7C381.2 35 637.15 0 807.15 0c337 0 409\n 177 744 177 328 0 754-127 773-127 5 0 10 3 11 9l1 14.794c1 7.805-3 13.38-9\n 14.495l-20.7 5.574c-366.85 99.79-607.3 139.372-776.3 139.372-338 0-409\n -175.236-744-175.236z",
	vec: "M377 20c0-5.333 1.833-10 5.5-14S391 0 397 0c4.667 0 8.667 1.667 12 5\n3.333 2.667 6.667 9 10 19 6.667 24.667 20.333 43.667 41 57 7.333 4.667 11\n10.667 11 18 0 6-1 10-3 12s-6.667 5-14 9c-28.667 14.667-53.667 35.667-75 63\n-1.333 1.333-3.167 3.5-5.5 6.5s-4 4.833-5 5.5c-1 .667-2.5 1.333-4.5 2s-4.333 1\n-7 1c-4.667 0-9.167-1.833-13.5-5.5S337 184 337 178c0-12.667 15.667-32.333 47-59\nH213l-171-1c-8.667-6-13-12.333-13-19 0-4.667 4.333-11.333 13-20h359\nc-16-25.333-24-45-24-59z",
	widehat1: "M529 0h5l519 115c5 1 9 5 9 10 0 1-1 2-1 3l-4 22\nc-1 5-5 9-11 9h-2L532 67 19 159h-2c-5 0-9-4-11-9l-5-22c-1-6 2-12 8-13z",
	widehat2: "M1181 0h2l1171 176c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 220h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",
	widehat3: "M1181 0h2l1171 236c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 280h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",
	widehat4: "M1181 0h2l1171 296c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 340h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",
	widecheck1: "M529,159h5l519,-115c5,-1,9,-5,9,-10c0,-1,-1,-2,-1,-3l-4,-22c-1,\n-5,-5,-9,-11,-9h-2l-512,92l-513,-92h-2c-5,0,-9,4,-11,9l-5,22c-1,6,2,12,8,13z",
	widecheck2: "M1181,220h2l1171,-176c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,153l-1167,-153h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z",
	widecheck3: "M1181,280h2l1171,-236c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,213l-1167,-213h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z",
	widecheck4: "M1181,340h2l1171,-296c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,273l-1167,-273h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z",
	baraboveleftarrow: "M400000 620h-399890l3 -3c68.7 -52.7 113.7 -120 135 -202\nc4 -14.7 6 -23 6 -25c0 -7.3 -7 -11 -21 -11c-8 0 -13.2 0.8 -15.5 2.5\nc-2.3 1.7 -4.2 5.8 -5.5 12.5c-1.3 4.7 -2.7 10.3 -4 17c-12 48.7 -34.8 92 -68.5 130\ns-74.2 66.3 -121.5 85c-10 4 -16 7.7 -18 11c0 8.7 6 14.3 18 17c47.3 18.7 87.8 47\n121.5 85s56.5 81.3 68.5 130c0.7 2 1.3 5 2 9s1.2 6.7 1.5 8c0.3 1.3 1 3.3 2 6\ns2.2 4.5 3.5 5.5c1.3 1 3.3 1.8 6 2.5s6 1 10 1c14 0 21 -3.7 21 -11\nc0 -2 -2 -10.3 -6 -25c-20 -79.3 -65 -146.7 -135 -202l-3 -3h399890z\nM100 620v40h399900v-40z M0 241v40h399900v-40zM0 241v40h399900v-40z",
	rightarrowabovebar: "M0 241v40h399891c-47.3 35.3-84 78-110 128-16.7 32\n-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20 11 8 0\n13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7 39\n-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85-40.5\n-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5\n-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67\n151.7 139 205zm96 379h399894v40H0zm0 0h399904v40H0z",
	baraboveshortleftharpoon: "M507,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11\nc1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17\nc2,0.7,5,1,9,1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21\nc-32,-87.3,-82.7,-157.7,-152,-211c0,0,-3,-3,-3,-3l399351,0l0,-40\nc-398570,0,-399437,0,-399437,0z M593 435 v40 H399500 v-40z\nM0 281 v-40 H399908 v40z M0 281 v-40 H399908 v40z",
	rightharpoonaboveshortbar: "M0,241 l0,40c399126,0,399993,0,399993,0\nc4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,\n-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6\nc-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z\nM0 241 v40 H399908 v-40z M0 475 v-40 H399500 v40z M0 475 v-40 H399500 v40z",
	shortbaraboveleftharpoon: "M7,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11\nc1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17c2,0.7,5,1,9,\n1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21c-32,-87.3,-82.7,-157.7,\n-152,-211c0,0,-3,-3,-3,-3l399907,0l0,-40c-399126,0,-399993,0,-399993,0z\nM93 435 v40 H400000 v-40z M500 241 v40 H400000 v-40z M500 241 v40 H400000 v-40z",
	shortrightharpoonabovebar: "M53,241l0,40c398570,0,399437,0,399437,0\nc4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,\n-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6\nc-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z\nM500 241 v40 H399408 v-40z M500 435 v40 H400000 v-40z"
};
var tallDelim = function tallDelim(label, midHeight) {
	switch (label) {
		case "lbrack": return "M403 1759 V84 H666 V0 H319 V1759 v" + midHeight + " v1759 v84 h347 v-84\nH403z M403 1759 V0 H319 V1759 v" + midHeight + " v1759 v84 h84z";
		case "rbrack": return "M347 1759 V0 H0 V84 H263 V1759 v" + midHeight + " v1759 H0 v84 H347z\nM347 1759 V0 H263 V1759 v" + midHeight + " v1759 h84z";
		case "vert": return "M145 15 v585 v" + midHeight + " v585 c2.667,10,9.667,15,21,15\nc10,0,16.667,-5,20,-15 v-585 v" + -midHeight + " v-585 c-2.667,-10,-9.667,-15,-21,-15\nc-10,0,-16.667,5,-20,15z M188 15 H145 v585 v" + midHeight + " v585 h43z";
		case "doublevert": return "M145 15 v585 v" + midHeight + " v585 c2.667,10,9.667,15,21,15\nc10,0,16.667,-5,20,-15 v-585 v" + -midHeight + " v-585 c-2.667,-10,-9.667,-15,-21,-15\nc-10,0,-16.667,5,-20,15z M188 15 H145 v585 v" + midHeight + " v585 h43z\nM367 15 v585 v" + midHeight + " v585 c2.667,10,9.667,15,21,15\nc10,0,16.667,-5,20,-15 v-585 v" + -midHeight + " v-585 c-2.667,-10,-9.667,-15,-21,-15\nc-10,0,-16.667,5,-20,15z M410 15 H367 v585 v" + midHeight + " v585 h43z";
		case "lfloor": return "M319 602 V0 H403 V602 v" + midHeight + " v1715 h263 v84 H319z\nMM319 602 V0 H403 V602 v" + midHeight + " v1715 H319z";
		case "rfloor": return "M319 602 V0 H403 V602 v" + midHeight + " v1799 H0 v-84 H319z\nMM319 602 V0 H403 V602 v" + midHeight + " v1715 H319z";
		case "lceil": return "M403 1759 V84 H666 V0 H319 V1759 v" + midHeight + " v602 h84z\nM403 1759 V0 H319 V1759 v" + midHeight + " v602 h84z";
		case "rceil": return "M347 1759 V0 H0 V84 H263 V1759 v" + midHeight + " v602 h84z\nM347 1759 V0 h-84 V1759 v" + midHeight + " v602 h84z";
		case "lparen": return "M863,9c0,-2,-2,-5,-6,-9c0,0,-17,0,-17,0c-12.7,0,-19.3,0.3,-20,1\nc-5.3,5.3,-10.3,11,-15,17c-242.7,294.7,-395.3,682,-458,1162c-21.3,163.3,-33.3,349,\n-36,557 l0," + (midHeight + 84) + "c0.2,6,0,26,0,60c2,159.3,10,310.7,24,454c53.3,528,210,\n949.7,470,1265c4.7,6,9.7,11.7,15,17c0.7,0.7,7,1,19,1c0,0,18,0,18,0c4,-4,6,-7,6,-9\nc0,-2.7,-3.3,-8.7,-10,-18c-135.3,-192.7,-235.5,-414.3,-300.5,-665c-65,-250.7,-102.5,\n-544.7,-112.5,-882c-2,-104,-3,-167,-3,-189\nl0,-" + (midHeight + 92) + "c0,-162.7,5.7,-314,17,-454c20.7,-272,63.7,-513,129,-723c65.3,\n-210,155.3,-396.3,270,-559c6.7,-9.3,10,-15.3,10,-18z";
		case "rparen": return "M76,0c-16.7,0,-25,3,-25,9c0,2,2,6.3,6,13c21.3,28.7,42.3,60.3,\n63,95c96.7,156.7,172.8,332.5,228.5,527.5c55.7,195,92.8,416.5,111.5,664.5\nc11.3,139.3,17,290.7,17,454c0,28,1.7,43,3.3,45l0," + (midHeight + 9) + "\nc-3,4,-3.3,16.7,-3.3,38c0,162,-5.7,313.7,-17,455c-18.7,248,-55.8,469.3,-111.5,664\nc-55.7,194.7,-131.8,370.3,-228.5,527c-20.7,34.7,-41.7,66.3,-63,95c-2,3.3,-4,7,-6,11\nc0,7.3,5.7,11,17,11c0,0,11,0,11,0c9.3,0,14.3,-0.3,15,-1c5.3,-5.3,10.3,-11,15,-17\nc242.7,-294.7,395.3,-681.7,458,-1161c21.3,-164.7,33.3,-350.7,36,-558\nl0,-" + (midHeight + 144) + "c-2,-159.3,-10,-310.7,-24,-454c-53.3,-528,-210,-949.7,\n-470,-1265c-4.7,-6,-9.7,-11.7,-15,-17c-0.7,-0.7,-6.7,-1,-18,-1z";
		default: throw new Error("Unknown stretchy delimiter.");
	}
};
function isMathDomNode(node) {
	return "toText" in node;
}
/**
* This node represents a document fragment, which contains elements, but when
* placed into the DOM doesn't have any representation itself. It only contains
* children and doesn't have any DOM node properties.
*/
var DocumentFragment = class {
	constructor(children) {
		this.children = void 0;
		this.classes = void 0;
		this.height = void 0;
		this.depth = void 0;
		this.maxFontSize = void 0;
		this.style = void 0;
		this.children = children;
		this.classes = [];
		this.height = 0;
		this.depth = 0;
		this.maxFontSize = 0;
		this.style = {};
	}
	hasClass(className) {
		return this.classes.includes(className);
	}
	/** Convert the fragment into a node. */
	toNode() {
		var frag = document.createDocumentFragment();
		for (var i = 0; i < this.children.length; i++) frag.appendChild(this.children[i].toNode());
		return frag;
	}
	/** Convert the fragment into HTML markup. */
	toMarkup() {
		var markup = "";
		for (var i = 0; i < this.children.length; i++) markup += this.children[i].toMarkup();
		return markup;
	}
	/**
	* Converts the math node into a string, similar to innerText. Applies to
	* MathDomNode's only.
	*/
	toText() {
		return this.children.map((child) => {
			if (isMathDomNode(child)) return child.toText();
			throw new Error("Expected MathDomNode with toText, got " + child.constructor.name);
		}).join("");
	}
};
/**
* This file does conversion between units.  In particular, it provides
* calculateSize to convert other units into ems.
*/
var ptPerUnit = {
	"pt": 1,
	"mm": 7227 / 2540,
	"cm": 7227 / 254,
	"in": 72.27,
	"bp": 803 / 800,
	"pc": 12,
	"dd": 1238 / 1157,
	"cc": 14856 / 1157,
	"nd": 685 / 642,
	"nc": 1370 / 107,
	"sp": 1 / 65536,
	"px": 803 / 800
};
var relativeUnit = {
	"ex": true,
	"em": true,
	"mu": true
};
/**
* Determine whether the specified unit (either a string defining the unit
* or a "size" parse node containing a unit field) is valid.
*/
var validUnit = function validUnit(unit) {
	if (typeof unit !== "string") unit = unit.unit;
	return unit in ptPerUnit || unit in relativeUnit || unit === "ex";
};
var calculateSize = function calculateSize(sizeValue, options) {
	var scale;
	if (sizeValue.unit in ptPerUnit) scale = ptPerUnit[sizeValue.unit] / options.fontMetrics().ptPerEm / options.sizeMultiplier;
	else if (sizeValue.unit === "mu") scale = options.fontMetrics().cssEmPerMu;
	else {
		var unitOptions;
		if (options.style.isTight()) unitOptions = options.havingStyle(options.style.text());
		else unitOptions = options;
		if (sizeValue.unit === "ex") scale = unitOptions.fontMetrics().xHeight;
		else if (sizeValue.unit === "em") scale = unitOptions.fontMetrics().quad;
		else throw new ParseError("Invalid unit: '" + sizeValue.unit + "'");
		if (unitOptions !== options) scale *= unitOptions.sizeMultiplier / options.sizeMultiplier;
	}
	return Math.min(sizeValue.number * scale, options.maxSize);
};
/**
* Round `n` to 4 decimal places, or to the nearest 1/10,000th em. See
* https://github.com/KaTeX/KaTeX/pull/2460.
*/
var makeEm = function makeEm(n) {
	return +n.toFixed(4) + "em";
};
/**
* These objects store the data about the DOM nodes we create, as well as some
* extra data. They can then be transformed into real DOM nodes with the
* `toNode` function or HTML markup using `toMarkup`. They are useful for both
* storing extra properties on the nodes, as well as providing a way to easily
* work with the DOM.
*
* Similar functions for working with MathML nodes exist in mathMLTree.js.
*
* TODO: refactor `span` and `anchor` into common superclass when
* target environments support class inheritance
*/
/**
* Create an HTML className based on a list of classes. In addition to joining
* with spaces, we also remove empty classes.
*/
var createClass = function createClass(classes) {
	return classes.filter((cls) => cls).join(" ");
};
/**
* Serialize a CssStyle object into a semicolon-delimited inline-style string
* (hyphenating camelCase property names). Returns "" when no property is set.
*/
var cssStyleToString = function cssStyleToString(style) {
	var styles = "";
	for (var key of Object.keys(style)) {
		var value = style[key];
		if (value !== void 0) styles += hyphenate(key) + ":" + value + ";";
	}
	return styles;
};
var initNode = function initNode(classes, options, style) {
	this.classes = classes || [];
	this.attributes = {};
	this.height = 0;
	this.depth = 0;
	this.maxFontSize = 0;
	this.style = style || {};
	if (options) {
		if (options.style.isTight()) this.classes.push("mtight");
		var color = options.getColor();
		if (color) this.style.color = color;
	}
};
/**
* Convert into an HTML node
*/
var toNode = function toNode(tagName) {
	var node = document.createElement(tagName);
	node.className = createClass(this.classes);
	Object.assign(node.style, this.style);
	for (var attr of Object.keys(this.attributes)) node.setAttribute(attr, this.attributes[attr]);
	for (var i = 0; i < this.children.length; i++) node.appendChild(this.children[i].toNode());
	return node;
};
/**
* https://w3c.github.io/html-reference/syntax.html#syntax-attributes
*
* > Attribute Names must consist of one or more characters
* other than the space characters, U+0000 NULL,
* '"', "'", ">", "/", "=", the control characters,
* and any characters that are not defined by Unicode.
*/
var invalidAttributeNameRegex = /[\s"'>/=\x00-\x1f]/;
/**
* Convert into an HTML markup string
*/
var toMarkup = function toMarkup(tagName) {
	var markup = "<" + tagName;
	if (this.classes.length) markup += " class=\"" + escape(createClass(this.classes)) + "\"";
	var styles = cssStyleToString(this.style);
	if (styles) markup += " style=\"" + escape(styles) + "\"";
	for (var attr of Object.keys(this.attributes)) {
		if (invalidAttributeNameRegex.test(attr)) throw new ParseError("Invalid attribute name '" + attr + "'");
		markup += " " + attr + "=\"" + escape(this.attributes[attr]) + "\"";
	}
	markup += ">";
	for (var i = 0; i < this.children.length; i++) markup += this.children[i].toMarkup();
	markup += "</" + tagName + ">";
	return markup;
};
/**
* This node represents a span node, with a className, a list of children, and
* an inline style. It also contains information about its height, depth, and
* maxFontSize.
*
* Represents two types with different uses: SvgSpan to wrap an SVG and DomSpan
* otherwise. This typesafety is important when HTML builders access a span's
* children.
*/
var Span = class {
	constructor(classes, children, options, style) {
		this.children = void 0;
		this.attributes = void 0;
		this.classes = void 0;
		this.height = void 0;
		this.depth = void 0;
		this.width = void 0;
		this.maxFontSize = void 0;
		this.style = void 0;
		/**
		* Italic correction carried over from a SymbolNode when the symbol is
		* wrapped in a vlist (e.g. \oiint / \oiiint).  Read by supsub to adjust
		* subscript positioning.  Only set when nonzero; use `?? 0` at read sites.
		*/
		this.italic = void 0;
		initNode.call(this, classes, options, style);
		this.children = children || [];
	}
	/**
	* Sets an arbitrary attribute on the span. Warning: use this wisely. Not
	* all browsers support attributes the same, and having too many custom
	* attributes is probably bad.
	*/
	setAttribute(attribute, value) {
		this.attributes[attribute] = value;
	}
	hasClass(className) {
		return this.classes.includes(className);
	}
	toNode() {
		return toNode.call(this, "span");
	}
	toMarkup() {
		return toMarkup.call(this, "span");
	}
};
/**
* This node represents an anchor (<a>) element with a hyperlink.  See `span`
* for further details.
*/
var Anchor = class {
	constructor(href, classes, children, options) {
		this.children = void 0;
		this.attributes = void 0;
		this.classes = void 0;
		this.height = void 0;
		this.depth = void 0;
		this.maxFontSize = void 0;
		this.style = void 0;
		initNode.call(this, classes, options);
		this.children = children || [];
		this.setAttribute("href", href);
	}
	setAttribute(attribute, value) {
		this.attributes[attribute] = value;
	}
	hasClass(className) {
		return this.classes.includes(className);
	}
	toNode() {
		return toNode.call(this, "a");
	}
	toMarkup() {
		return toMarkup.call(this, "a");
	}
};
/**
* This node represents an image embed (<img>) element.
*/
var Img = class {
	constructor(src, alt, style) {
		this.src = void 0;
		this.alt = void 0;
		this.classes = void 0;
		this.height = void 0;
		this.depth = void 0;
		this.maxFontSize = void 0;
		this.style = void 0;
		this.alt = alt;
		this.src = src;
		this.classes = ["mord"];
		this.height = 0;
		this.depth = 0;
		this.maxFontSize = 0;
		this.style = style;
	}
	hasClass(className) {
		return this.classes.includes(className);
	}
	toNode() {
		var node = document.createElement("img");
		node.src = this.src;
		node.alt = this.alt;
		node.className = "mord";
		Object.assign(node.style, this.style);
		return node;
	}
	toMarkup() {
		var markup = "<img src=\"" + escape(this.src) + "\"" + (" alt=\"" + escape(this.alt) + "\"");
		var styles = cssStyleToString(this.style);
		if (styles) markup += " style=\"" + escape(styles) + "\"";
		markup += "'/>";
		return markup;
	}
};
var iCombinations = {
	"î": "ı̂",
	"ï": "ı̈",
	"í": "ı́",
	"ì": "ı̀"
};
/**
* A symbol node contains information about a single symbol. It either renders
* to a single text node, or a span with a single text node in it, depending on
* whether it has CSS classes, styles, or needs italic correction.
*/
var SymbolNode = class {
	constructor(text, height, depth, italic, skew, width, classes, style) {
		this.text = void 0;
		this.height = void 0;
		this.depth = void 0;
		this.italic = void 0;
		this.skew = void 0;
		this.width = void 0;
		this.maxFontSize = void 0;
		this.classes = void 0;
		this.style = void 0;
		this.text = text;
		this.height = height || 0;
		this.depth = depth || 0;
		this.italic = italic || 0;
		this.skew = skew || 0;
		this.width = width || 0;
		this.classes = classes || [];
		this.style = style || {};
		this.maxFontSize = 0;
		var script = scriptFromCodepoint(this.text.charCodeAt(0));
		if (script) this.classes.push(script + "_fallback");
		if (/[îïíì]/.test(this.text)) this.text = iCombinations[this.text];
	}
	hasClass(className) {
		return this.classes.includes(className);
	}
	/**
	* Creates a text node or span from a symbol node. Note that a span is only
	* created if it is needed.
	*/
	toNode() {
		var node = document.createTextNode(this.text);
		var span = null;
		if (this.italic > 0) {
			span = document.createElement("span");
			span.style.marginRight = makeEm(this.italic);
		}
		if (this.classes.length > 0) {
			span = span || document.createElement("span");
			span.className = createClass(this.classes);
		}
		if (Object.keys(this.style).length > 0) {
			span = span || document.createElement("span");
			Object.assign(span.style, this.style);
		}
		if (span) {
			span.appendChild(node);
			return span;
		} else return node;
	}
	/**
	* Creates markup for a symbol node.
	*/
	toMarkup() {
		var needsSpan = false;
		var markup = "<span";
		if (this.classes.length) {
			needsSpan = true;
			markup += " class=\"";
			markup += escape(createClass(this.classes));
			markup += "\"";
		}
		var styles = "";
		if (this.italic > 0) styles += "margin-right:" + makeEm(this.italic) + ";";
		styles += cssStyleToString(this.style);
		if (styles) {
			needsSpan = true;
			markup += " style=\"" + escape(styles) + "\"";
		}
		var escaped = escape(this.text);
		if (needsSpan) {
			markup += ">";
			markup += escaped;
			markup += "</span>";
			return markup;
		} else return escaped;
	}
};
/**
* SVG nodes are used to render stretchy wide elements.
*/
var SvgNode = class {
	constructor(children, attributes) {
		this.children = void 0;
		this.attributes = void 0;
		this.children = children || [];
		this.attributes = attributes || {};
	}
	toNode() {
		var node = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		for (var attr of Object.keys(this.attributes)) node.setAttribute(attr, this.attributes[attr]);
		for (var i = 0; i < this.children.length; i++) node.appendChild(this.children[i].toNode());
		return node;
	}
	toMarkup() {
		var markup = "<svg xmlns=\"http://www.w3.org/2000/svg\"";
		for (var attr of Object.keys(this.attributes)) markup += " " + attr + "=\"" + escape(this.attributes[attr]) + "\"";
		markup += ">";
		for (var i = 0; i < this.children.length; i++) markup += this.children[i].toMarkup();
		markup += "</svg>";
		return markup;
	}
};
var PathNode = class {
	constructor(pathName, alternate) {
		this.pathName = void 0;
		this.alternate = void 0;
		this.pathName = pathName;
		this.alternate = alternate;
	}
	toNode() {
		var node = document.createElementNS("http://www.w3.org/2000/svg", "path");
		if (this.alternate) node.setAttribute("d", this.alternate);
		else node.setAttribute("d", path[this.pathName]);
		return node;
	}
	toMarkup() {
		if (this.alternate) return "<path d=\"" + escape(this.alternate) + "\"/>";
		else return "<path d=\"" + escape(path[this.pathName]) + "\"/>";
	}
};
var LineNode = class {
	constructor(attributes) {
		this.attributes = void 0;
		this.attributes = attributes || {};
	}
	toNode() {
		var node = document.createElementNS("http://www.w3.org/2000/svg", "line");
		for (var attr of Object.keys(this.attributes)) node.setAttribute(attr, this.attributes[attr]);
		return node;
	}
	toMarkup() {
		var markup = "<line";
		for (var attr of Object.keys(this.attributes)) markup += " " + attr + "=\"" + escape(this.attributes[attr]) + "\"";
		markup += "/>";
		return markup;
	}
};
function assertSymbolDomNode(group) {
	if (group instanceof SymbolNode) return group;
	else throw new Error("Expected symbolNode but got " + String(group) + ".");
}
function assertSpan(group) {
	if (group instanceof Span) return group;
	else throw new Error("Expected span<HtmlDomNode> but got " + String(group) + ".");
}
/**
* Whether an HtmlDomNode has HtmlDomNode children.
* HtmlDomNode is a base type representing a union of
* SymbolNode, SvgSpan, DomSpan, Anchor, and documentFragment.
* In the last three cases, the children are HtmlDomNode[].
*/
var hasHtmlDomChildren = (node) => node instanceof Span || node instanceof Anchor || node instanceof DocumentFragment;
var fontMetricsData = {
	"AMS-Regular": {
		"32": [
			0,
			0,
			0,
			0,
			.25
		],
		"65": [
			0,
			.68889,
			0,
			0,
			.72222
		],
		"66": [
			0,
			.68889,
			0,
			0,
			.66667
		],
		"67": [
			0,
			.68889,
			0,
			0,
			.72222
		],
		"68": [
			0,
			.68889,
			0,
			0,
			.72222
		],
		"69": [
			0,
			.68889,
			0,
			0,
			.66667
		],
		"70": [
			0,
			.68889,
			0,
			0,
			.61111
		],
		"71": [
			0,
			.68889,
			0,
			0,
			.77778
		],
		"72": [
			0,
			.68889,
			0,
			0,
			.77778
		],
		"73": [
			0,
			.68889,
			0,
			0,
			.38889
		],
		"74": [
			.16667,
			.68889,
			0,
			0,
			.5
		],
		"75": [
			0,
			.68889,
			0,
			0,
			.77778
		],
		"76": [
			0,
			.68889,
			0,
			0,
			.66667
		],
		"77": [
			0,
			.68889,
			0,
			0,
			.94445
		],
		"78": [
			0,
			.68889,
			0,
			0,
			.72222
		],
		"79": [
			.16667,
			.68889,
			0,
			0,
			.77778
		],
		"80": [
			0,
			.68889,
			0,
			0,
			.61111
		],
		"81": [
			.16667,
			.68889,
			0,
			0,
			.77778
		],
		"82": [
			0,
			.68889,
			0,
			0,
			.72222
		],
		"83": [
			0,
			.68889,
			0,
			0,
			.55556
		],
		"84": [
			0,
			.68889,
			0,
			0,
			.66667
		],
		"85": [
			0,
			.68889,
			0,
			0,
			.72222
		],
		"86": [
			0,
			.68889,
			0,
			0,
			.72222
		],
		"87": [
			0,
			.68889,
			0,
			0,
			1
		],
		"88": [
			0,
			.68889,
			0,
			0,
			.72222
		],
		"89": [
			0,
			.68889,
			0,
			0,
			.72222
		],
		"90": [
			0,
			.68889,
			0,
			0,
			.66667
		],
		"107": [
			0,
			.68889,
			0,
			0,
			.55556
		],
		"160": [
			0,
			0,
			0,
			0,
			.25
		],
		"165": [
			0,
			.675,
			.025,
			0,
			.75
		],
		"174": [
			.15559,
			.69224,
			0,
			0,
			.94666
		],
		"240": [
			0,
			.68889,
			0,
			0,
			.55556
		],
		"295": [
			0,
			.68889,
			0,
			0,
			.54028
		],
		"710": [
			0,
			.825,
			0,
			0,
			2.33334
		],
		"732": [
			0,
			.9,
			0,
			0,
			2.33334
		],
		"770": [
			0,
			.825,
			0,
			0,
			2.33334
		],
		"771": [
			0,
			.9,
			0,
			0,
			2.33334
		],
		"989": [
			.08167,
			.58167,
			0,
			0,
			.77778
		],
		"1008": [
			0,
			.43056,
			.04028,
			0,
			.66667
		],
		"8245": [
			0,
			.54986,
			0,
			0,
			.275
		],
		"8463": [
			0,
			.68889,
			0,
			0,
			.54028
		],
		"8487": [
			0,
			.68889,
			0,
			0,
			.72222
		],
		"8498": [
			0,
			.68889,
			0,
			0,
			.55556
		],
		"8502": [
			0,
			.68889,
			0,
			0,
			.66667
		],
		"8503": [
			0,
			.68889,
			0,
			0,
			.44445
		],
		"8504": [
			0,
			.68889,
			0,
			0,
			.66667
		],
		"8513": [
			0,
			.68889,
			0,
			0,
			.63889
		],
		"8592": [
			-.03598,
			.46402,
			0,
			0,
			.5
		],
		"8594": [
			-.03598,
			.46402,
			0,
			0,
			.5
		],
		"8602": [
			-.13313,
			.36687,
			0,
			0,
			1
		],
		"8603": [
			-.13313,
			.36687,
			0,
			0,
			1
		],
		"8606": [
			.01354,
			.52239,
			0,
			0,
			1
		],
		"8608": [
			.01354,
			.52239,
			0,
			0,
			1
		],
		"8610": [
			.01354,
			.52239,
			0,
			0,
			1.11111
		],
		"8611": [
			.01354,
			.52239,
			0,
			0,
			1.11111
		],
		"8619": [
			0,
			.54986,
			0,
			0,
			1
		],
		"8620": [
			0,
			.54986,
			0,
			0,
			1
		],
		"8621": [
			-.13313,
			.37788,
			0,
			0,
			1.38889
		],
		"8622": [
			-.13313,
			.36687,
			0,
			0,
			1
		],
		"8624": [
			0,
			.69224,
			0,
			0,
			.5
		],
		"8625": [
			0,
			.69224,
			0,
			0,
			.5
		],
		"8630": [
			0,
			.43056,
			0,
			0,
			1
		],
		"8631": [
			0,
			.43056,
			0,
			0,
			1
		],
		"8634": [
			.08198,
			.58198,
			0,
			0,
			.77778
		],
		"8635": [
			.08198,
			.58198,
			0,
			0,
			.77778
		],
		"8638": [
			.19444,
			.69224,
			0,
			0,
			.41667
		],
		"8639": [
			.19444,
			.69224,
			0,
			0,
			.41667
		],
		"8642": [
			.19444,
			.69224,
			0,
			0,
			.41667
		],
		"8643": [
			.19444,
			.69224,
			0,
			0,
			.41667
		],
		"8644": [
			.1808,
			.675,
			0,
			0,
			1
		],
		"8646": [
			.1808,
			.675,
			0,
			0,
			1
		],
		"8647": [
			.1808,
			.675,
			0,
			0,
			1
		],
		"8648": [
			.19444,
			.69224,
			0,
			0,
			.83334
		],
		"8649": [
			.1808,
			.675,
			0,
			0,
			1
		],
		"8650": [
			.19444,
			.69224,
			0,
			0,
			.83334
		],
		"8651": [
			.01354,
			.52239,
			0,
			0,
			1
		],
		"8652": [
			.01354,
			.52239,
			0,
			0,
			1
		],
		"8653": [
			-.13313,
			.36687,
			0,
			0,
			1
		],
		"8654": [
			-.13313,
			.36687,
			0,
			0,
			1
		],
		"8655": [
			-.13313,
			.36687,
			0,
			0,
			1
		],
		"8666": [
			.13667,
			.63667,
			0,
			0,
			1
		],
		"8667": [
			.13667,
			.63667,
			0,
			0,
			1
		],
		"8669": [
			-.13313,
			.37788,
			0,
			0,
			1
		],
		"8672": [
			-.064,
			.437,
			0,
			0,
			1.334
		],
		"8674": [
			-.064,
			.437,
			0,
			0,
			1.334
		],
		"8705": [
			0,
			.825,
			0,
			0,
			.5
		],
		"8708": [
			0,
			.68889,
			0,
			0,
			.55556
		],
		"8709": [
			.08167,
			.58167,
			0,
			0,
			.77778
		],
		"8717": [
			0,
			.43056,
			0,
			0,
			.42917
		],
		"8722": [
			-.03598,
			.46402,
			0,
			0,
			.5
		],
		"8724": [
			.08198,
			.69224,
			0,
			0,
			.77778
		],
		"8726": [
			.08167,
			.58167,
			0,
			0,
			.77778
		],
		"8733": [
			0,
			.69224,
			0,
			0,
			.77778
		],
		"8736": [
			0,
			.69224,
			0,
			0,
			.72222
		],
		"8737": [
			0,
			.69224,
			0,
			0,
			.72222
		],
		"8738": [
			.03517,
			.52239,
			0,
			0,
			.72222
		],
		"8739": [
			.08167,
			.58167,
			0,
			0,
			.22222
		],
		"8740": [
			.25142,
			.74111,
			0,
			0,
			.27778
		],
		"8741": [
			.08167,
			.58167,
			0,
			0,
			.38889
		],
		"8742": [
			.25142,
			.74111,
			0,
			0,
			.5
		],
		"8756": [
			0,
			.69224,
			0,
			0,
			.66667
		],
		"8757": [
			0,
			.69224,
			0,
			0,
			.66667
		],
		"8764": [
			-.13313,
			.36687,
			0,
			0,
			.77778
		],
		"8765": [
			-.13313,
			.37788,
			0,
			0,
			.77778
		],
		"8769": [
			-.13313,
			.36687,
			0,
			0,
			.77778
		],
		"8770": [
			-.03625,
			.46375,
			0,
			0,
			.77778
		],
		"8774": [
			.30274,
			.79383,
			0,
			0,
			.77778
		],
		"8776": [
			-.01688,
			.48312,
			0,
			0,
			.77778
		],
		"8778": [
			.08167,
			.58167,
			0,
			0,
			.77778
		],
		"8782": [
			.06062,
			.54986,
			0,
			0,
			.77778
		],
		"8783": [
			.06062,
			.54986,
			0,
			0,
			.77778
		],
		"8785": [
			.08198,
			.58198,
			0,
			0,
			.77778
		],
		"8786": [
			.08198,
			.58198,
			0,
			0,
			.77778
		],
		"8787": [
			.08198,
			.58198,
			0,
			0,
			.77778
		],
		"8790": [
			0,
			.69224,
			0,
			0,
			.77778
		],
		"8791": [
			.22958,
			.72958,
			0,
			0,
			.77778
		],
		"8796": [
			.08198,
			.91667,
			0,
			0,
			.77778
		],
		"8806": [
			.25583,
			.75583,
			0,
			0,
			.77778
		],
		"8807": [
			.25583,
			.75583,
			0,
			0,
			.77778
		],
		"8808": [
			.25142,
			.75726,
			0,
			0,
			.77778
		],
		"8809": [
			.25142,
			.75726,
			0,
			0,
			.77778
		],
		"8812": [
			.25583,
			.75583,
			0,
			0,
			.5
		],
		"8814": [
			.20576,
			.70576,
			0,
			0,
			.77778
		],
		"8815": [
			.20576,
			.70576,
			0,
			0,
			.77778
		],
		"8816": [
			.30274,
			.79383,
			0,
			0,
			.77778
		],
		"8817": [
			.30274,
			.79383,
			0,
			0,
			.77778
		],
		"8818": [
			.22958,
			.72958,
			0,
			0,
			.77778
		],
		"8819": [
			.22958,
			.72958,
			0,
			0,
			.77778
		],
		"8822": [
			.1808,
			.675,
			0,
			0,
			.77778
		],
		"8823": [
			.1808,
			.675,
			0,
			0,
			.77778
		],
		"8828": [
			.13667,
			.63667,
			0,
			0,
			.77778
		],
		"8829": [
			.13667,
			.63667,
			0,
			0,
			.77778
		],
		"8830": [
			.22958,
			.72958,
			0,
			0,
			.77778
		],
		"8831": [
			.22958,
			.72958,
			0,
			0,
			.77778
		],
		"8832": [
			.20576,
			.70576,
			0,
			0,
			.77778
		],
		"8833": [
			.20576,
			.70576,
			0,
			0,
			.77778
		],
		"8840": [
			.30274,
			.79383,
			0,
			0,
			.77778
		],
		"8841": [
			.30274,
			.79383,
			0,
			0,
			.77778
		],
		"8842": [
			.13597,
			.63597,
			0,
			0,
			.77778
		],
		"8843": [
			.13597,
			.63597,
			0,
			0,
			.77778
		],
		"8847": [
			.03517,
			.54986,
			0,
			0,
			.77778
		],
		"8848": [
			.03517,
			.54986,
			0,
			0,
			.77778
		],
		"8858": [
			.08198,
			.58198,
			0,
			0,
			.77778
		],
		"8859": [
			.08198,
			.58198,
			0,
			0,
			.77778
		],
		"8861": [
			.08198,
			.58198,
			0,
			0,
			.77778
		],
		"8862": [
			0,
			.675,
			0,
			0,
			.77778
		],
		"8863": [
			0,
			.675,
			0,
			0,
			.77778
		],
		"8864": [
			0,
			.675,
			0,
			0,
			.77778
		],
		"8865": [
			0,
			.675,
			0,
			0,
			.77778
		],
		"8872": [
			0,
			.69224,
			0,
			0,
			.61111
		],
		"8873": [
			0,
			.69224,
			0,
			0,
			.72222
		],
		"8874": [
			0,
			.69224,
			0,
			0,
			.88889
		],
		"8876": [
			0,
			.68889,
			0,
			0,
			.61111
		],
		"8877": [
			0,
			.68889,
			0,
			0,
			.61111
		],
		"8878": [
			0,
			.68889,
			0,
			0,
			.72222
		],
		"8879": [
			0,
			.68889,
			0,
			0,
			.72222
		],
		"8882": [
			.03517,
			.54986,
			0,
			0,
			.77778
		],
		"8883": [
			.03517,
			.54986,
			0,
			0,
			.77778
		],
		"8884": [
			.13667,
			.63667,
			0,
			0,
			.77778
		],
		"8885": [
			.13667,
			.63667,
			0,
			0,
			.77778
		],
		"8888": [
			0,
			.54986,
			0,
			0,
			1.11111
		],
		"8890": [
			.19444,
			.43056,
			0,
			0,
			.55556
		],
		"8891": [
			.19444,
			.69224,
			0,
			0,
			.61111
		],
		"8892": [
			.19444,
			.69224,
			0,
			0,
			.61111
		],
		"8901": [
			0,
			.54986,
			0,
			0,
			.27778
		],
		"8903": [
			.08167,
			.58167,
			0,
			0,
			.77778
		],
		"8905": [
			.08167,
			.58167,
			0,
			0,
			.77778
		],
		"8906": [
			.08167,
			.58167,
			0,
			0,
			.77778
		],
		"8907": [
			0,
			.69224,
			0,
			0,
			.77778
		],
		"8908": [
			0,
			.69224,
			0,
			0,
			.77778
		],
		"8909": [
			-.03598,
			.46402,
			0,
			0,
			.77778
		],
		"8910": [
			0,
			.54986,
			0,
			0,
			.76042
		],
		"8911": [
			0,
			.54986,
			0,
			0,
			.76042
		],
		"8912": [
			.03517,
			.54986,
			0,
			0,
			.77778
		],
		"8913": [
			.03517,
			.54986,
			0,
			0,
			.77778
		],
		"8914": [
			0,
			.54986,
			0,
			0,
			.66667
		],
		"8915": [
			0,
			.54986,
			0,
			0,
			.66667
		],
		"8916": [
			0,
			.69224,
			0,
			0,
			.66667
		],
		"8918": [
			.0391,
			.5391,
			0,
			0,
			.77778
		],
		"8919": [
			.0391,
			.5391,
			0,
			0,
			.77778
		],
		"8920": [
			.03517,
			.54986,
			0,
			0,
			1.33334
		],
		"8921": [
			.03517,
			.54986,
			0,
			0,
			1.33334
		],
		"8922": [
			.38569,
			.88569,
			0,
			0,
			.77778
		],
		"8923": [
			.38569,
			.88569,
			0,
			0,
			.77778
		],
		"8926": [
			.13667,
			.63667,
			0,
			0,
			.77778
		],
		"8927": [
			.13667,
			.63667,
			0,
			0,
			.77778
		],
		"8928": [
			.30274,
			.79383,
			0,
			0,
			.77778
		],
		"8929": [
			.30274,
			.79383,
			0,
			0,
			.77778
		],
		"8934": [
			.23222,
			.74111,
			0,
			0,
			.77778
		],
		"8935": [
			.23222,
			.74111,
			0,
			0,
			.77778
		],
		"8936": [
			.23222,
			.74111,
			0,
			0,
			.77778
		],
		"8937": [
			.23222,
			.74111,
			0,
			0,
			.77778
		],
		"8938": [
			.20576,
			.70576,
			0,
			0,
			.77778
		],
		"8939": [
			.20576,
			.70576,
			0,
			0,
			.77778
		],
		"8940": [
			.30274,
			.79383,
			0,
			0,
			.77778
		],
		"8941": [
			.30274,
			.79383,
			0,
			0,
			.77778
		],
		"8994": [
			.19444,
			.69224,
			0,
			0,
			.77778
		],
		"8995": [
			.19444,
			.69224,
			0,
			0,
			.77778
		],
		"9416": [
			.15559,
			.69224,
			0,
			0,
			.90222
		],
		"9484": [
			0,
			.69224,
			0,
			0,
			.5
		],
		"9488": [
			0,
			.69224,
			0,
			0,
			.5
		],
		"9492": [
			0,
			.37788,
			0,
			0,
			.5
		],
		"9496": [
			0,
			.37788,
			0,
			0,
			.5
		],
		"9585": [
			.19444,
			.68889,
			0,
			0,
			.88889
		],
		"9586": [
			.19444,
			.74111,
			0,
			0,
			.88889
		],
		"9632": [
			0,
			.675,
			0,
			0,
			.77778
		],
		"9633": [
			0,
			.675,
			0,
			0,
			.77778
		],
		"9650": [
			0,
			.54986,
			0,
			0,
			.72222
		],
		"9651": [
			0,
			.54986,
			0,
			0,
			.72222
		],
		"9654": [
			.03517,
			.54986,
			0,
			0,
			.77778
		],
		"9660": [
			0,
			.54986,
			0,
			0,
			.72222
		],
		"9661": [
			0,
			.54986,
			0,
			0,
			.72222
		],
		"9664": [
			.03517,
			.54986,
			0,
			0,
			.77778
		],
		"9674": [
			.11111,
			.69224,
			0,
			0,
			.66667
		],
		"9733": [
			.19444,
			.69224,
			0,
			0,
			.94445
		],
		"10003": [
			0,
			.69224,
			0,
			0,
			.83334
		],
		"10016": [
			0,
			.69224,
			0,
			0,
			.83334
		],
		"10731": [
			.11111,
			.69224,
			0,
			0,
			.66667
		],
		"10846": [
			.19444,
			.75583,
			0,
			0,
			.61111
		],
		"10877": [
			.13667,
			.63667,
			0,
			0,
			.77778
		],
		"10878": [
			.13667,
			.63667,
			0,
			0,
			.77778
		],
		"10885": [
			.25583,
			.75583,
			0,
			0,
			.77778
		],
		"10886": [
			.25583,
			.75583,
			0,
			0,
			.77778
		],
		"10887": [
			.13597,
			.63597,
			0,
			0,
			.77778
		],
		"10888": [
			.13597,
			.63597,
			0,
			0,
			.77778
		],
		"10889": [
			.26167,
			.75726,
			0,
			0,
			.77778
		],
		"10890": [
			.26167,
			.75726,
			0,
			0,
			.77778
		],
		"10891": [
			.48256,
			.98256,
			0,
			0,
			.77778
		],
		"10892": [
			.48256,
			.98256,
			0,
			0,
			.77778
		],
		"10901": [
			.13667,
			.63667,
			0,
			0,
			.77778
		],
		"10902": [
			.13667,
			.63667,
			0,
			0,
			.77778
		],
		"10933": [
			.25142,
			.75726,
			0,
			0,
			.77778
		],
		"10934": [
			.25142,
			.75726,
			0,
			0,
			.77778
		],
		"10935": [
			.26167,
			.75726,
			0,
			0,
			.77778
		],
		"10936": [
			.26167,
			.75726,
			0,
			0,
			.77778
		],
		"10937": [
			.26167,
			.75726,
			0,
			0,
			.77778
		],
		"10938": [
			.26167,
			.75726,
			0,
			0,
			.77778
		],
		"10949": [
			.25583,
			.75583,
			0,
			0,
			.77778
		],
		"10950": [
			.25583,
			.75583,
			0,
			0,
			.77778
		],
		"10955": [
			.28481,
			.79383,
			0,
			0,
			.77778
		],
		"10956": [
			.28481,
			.79383,
			0,
			0,
			.77778
		],
		"57350": [
			.08167,
			.58167,
			0,
			0,
			.22222
		],
		"57351": [
			.08167,
			.58167,
			0,
			0,
			.38889
		],
		"57352": [
			.08167,
			.58167,
			0,
			0,
			.77778
		],
		"57353": [
			0,
			.43056,
			.04028,
			0,
			.66667
		],
		"57356": [
			.25142,
			.75726,
			0,
			0,
			.77778
		],
		"57357": [
			.25142,
			.75726,
			0,
			0,
			.77778
		],
		"57358": [
			.41951,
			.91951,
			0,
			0,
			.77778
		],
		"57359": [
			.30274,
			.79383,
			0,
			0,
			.77778
		],
		"57360": [
			.30274,
			.79383,
			0,
			0,
			.77778
		],
		"57361": [
			.41951,
			.91951,
			0,
			0,
			.77778
		],
		"57366": [
			.25142,
			.75726,
			0,
			0,
			.77778
		],
		"57367": [
			.25142,
			.75726,
			0,
			0,
			.77778
		],
		"57368": [
			.25142,
			.75726,
			0,
			0,
			.77778
		],
		"57369": [
			.25142,
			.75726,
			0,
			0,
			.77778
		],
		"57370": [
			.13597,
			.63597,
			0,
			0,
			.77778
		],
		"57371": [
			.13597,
			.63597,
			0,
			0,
			.77778
		]
	},
	"Caligraphic-Regular": {
		"32": [
			0,
			0,
			0,
			0,
			.25
		],
		"65": [
			0,
			.68333,
			0,
			.19445,
			.79847
		],
		"66": [
			0,
			.68333,
			.03041,
			.13889,
			.65681
		],
		"67": [
			0,
			.68333,
			.05834,
			.13889,
			.52653
		],
		"68": [
			0,
			.68333,
			.02778,
			.08334,
			.77139
		],
		"69": [
			0,
			.68333,
			.08944,
			.11111,
			.52778
		],
		"70": [
			0,
			.68333,
			.09931,
			.11111,
			.71875
		],
		"71": [
			.09722,
			.68333,
			.0593,
			.11111,
			.59487
		],
		"72": [
			0,
			.68333,
			.00965,
			.11111,
			.84452
		],
		"73": [
			0,
			.68333,
			.07382,
			0,
			.54452
		],
		"74": [
			.09722,
			.68333,
			.18472,
			.16667,
			.67778
		],
		"75": [
			0,
			.68333,
			.01445,
			.05556,
			.76195
		],
		"76": [
			0,
			.68333,
			0,
			.13889,
			.68972
		],
		"77": [
			0,
			.68333,
			0,
			.13889,
			1.2009
		],
		"78": [
			0,
			.68333,
			.14736,
			.08334,
			.82049
		],
		"79": [
			0,
			.68333,
			.02778,
			.11111,
			.79611
		],
		"80": [
			0,
			.68333,
			.08222,
			.08334,
			.69556
		],
		"81": [
			.09722,
			.68333,
			0,
			.11111,
			.81667
		],
		"82": [
			0,
			.68333,
			0,
			.08334,
			.8475
		],
		"83": [
			0,
			.68333,
			.075,
			.13889,
			.60556
		],
		"84": [
			0,
			.68333,
			.25417,
			0,
			.54464
		],
		"85": [
			0,
			.68333,
			.09931,
			.08334,
			.62583
		],
		"86": [
			0,
			.68333,
			.08222,
			0,
			.61278
		],
		"87": [
			0,
			.68333,
			.08222,
			.08334,
			.98778
		],
		"88": [
			0,
			.68333,
			.14643,
			.13889,
			.7133
		],
		"89": [
			.09722,
			.68333,
			.08222,
			.08334,
			.66834
		],
		"90": [
			0,
			.68333,
			.07944,
			.13889,
			.72473
		],
		"160": [
			0,
			0,
			0,
			0,
			.25
		]
	},
	"Fraktur-Regular": {
		"32": [
			0,
			0,
			0,
			0,
			.25
		],
		"33": [
			0,
			.69141,
			0,
			0,
			.29574
		],
		"34": [
			0,
			.69141,
			0,
			0,
			.21471
		],
		"38": [
			0,
			.69141,
			0,
			0,
			.73786
		],
		"39": [
			0,
			.69141,
			0,
			0,
			.21201
		],
		"40": [
			.24982,
			.74947,
			0,
			0,
			.38865
		],
		"41": [
			.24982,
			.74947,
			0,
			0,
			.38865
		],
		"42": [
			0,
			.62119,
			0,
			0,
			.27764
		],
		"43": [
			.08319,
			.58283,
			0,
			0,
			.75623
		],
		"44": [
			0,
			.10803,
			0,
			0,
			.27764
		],
		"45": [
			.08319,
			.58283,
			0,
			0,
			.75623
		],
		"46": [
			0,
			.10803,
			0,
			0,
			.27764
		],
		"47": [
			.24982,
			.74947,
			0,
			0,
			.50181
		],
		"48": [
			0,
			.47534,
			0,
			0,
			.50181
		],
		"49": [
			0,
			.47534,
			0,
			0,
			.50181
		],
		"50": [
			0,
			.47534,
			0,
			0,
			.50181
		],
		"51": [
			.18906,
			.47534,
			0,
			0,
			.50181
		],
		"52": [
			.18906,
			.47534,
			0,
			0,
			.50181
		],
		"53": [
			.18906,
			.47534,
			0,
			0,
			.50181
		],
		"54": [
			0,
			.69141,
			0,
			0,
			.50181
		],
		"55": [
			.18906,
			.47534,
			0,
			0,
			.50181
		],
		"56": [
			0,
			.69141,
			0,
			0,
			.50181
		],
		"57": [
			.18906,
			.47534,
			0,
			0,
			.50181
		],
		"58": [
			0,
			.47534,
			0,
			0,
			.21606
		],
		"59": [
			.12604,
			.47534,
			0,
			0,
			.21606
		],
		"61": [
			-.13099,
			.36866,
			0,
			0,
			.75623
		],
		"63": [
			0,
			.69141,
			0,
			0,
			.36245
		],
		"65": [
			0,
			.69141,
			0,
			0,
			.7176
		],
		"66": [
			0,
			.69141,
			0,
			0,
			.88397
		],
		"67": [
			0,
			.69141,
			0,
			0,
			.61254
		],
		"68": [
			0,
			.69141,
			0,
			0,
			.83158
		],
		"69": [
			0,
			.69141,
			0,
			0,
			.66278
		],
		"70": [
			.12604,
			.69141,
			0,
			0,
			.61119
		],
		"71": [
			0,
			.69141,
			0,
			0,
			.78539
		],
		"72": [
			.06302,
			.69141,
			0,
			0,
			.7203
		],
		"73": [
			0,
			.69141,
			0,
			0,
			.55448
		],
		"74": [
			.12604,
			.69141,
			0,
			0,
			.55231
		],
		"75": [
			0,
			.69141,
			0,
			0,
			.66845
		],
		"76": [
			0,
			.69141,
			0,
			0,
			.66602
		],
		"77": [
			0,
			.69141,
			0,
			0,
			1.04953
		],
		"78": [
			0,
			.69141,
			0,
			0,
			.83212
		],
		"79": [
			0,
			.69141,
			0,
			0,
			.82699
		],
		"80": [
			.18906,
			.69141,
			0,
			0,
			.82753
		],
		"81": [
			.03781,
			.69141,
			0,
			0,
			.82699
		],
		"82": [
			0,
			.69141,
			0,
			0,
			.82807
		],
		"83": [
			0,
			.69141,
			0,
			0,
			.82861
		],
		"84": [
			0,
			.69141,
			0,
			0,
			.66899
		],
		"85": [
			0,
			.69141,
			0,
			0,
			.64576
		],
		"86": [
			0,
			.69141,
			0,
			0,
			.83131
		],
		"87": [
			0,
			.69141,
			0,
			0,
			1.04602
		],
		"88": [
			0,
			.69141,
			0,
			0,
			.71922
		],
		"89": [
			.18906,
			.69141,
			0,
			0,
			.83293
		],
		"90": [
			.12604,
			.69141,
			0,
			0,
			.60201
		],
		"91": [
			.24982,
			.74947,
			0,
			0,
			.27764
		],
		"93": [
			.24982,
			.74947,
			0,
			0,
			.27764
		],
		"94": [
			0,
			.69141,
			0,
			0,
			.49965
		],
		"97": [
			0,
			.47534,
			0,
			0,
			.50046
		],
		"98": [
			0,
			.69141,
			0,
			0,
			.51315
		],
		"99": [
			0,
			.47534,
			0,
			0,
			.38946
		],
		"100": [
			0,
			.62119,
			0,
			0,
			.49857
		],
		"101": [
			0,
			.47534,
			0,
			0,
			.40053
		],
		"102": [
			.18906,
			.69141,
			0,
			0,
			.32626
		],
		"103": [
			.18906,
			.47534,
			0,
			0,
			.5037
		],
		"104": [
			.18906,
			.69141,
			0,
			0,
			.52126
		],
		"105": [
			0,
			.69141,
			0,
			0,
			.27899
		],
		"106": [
			0,
			.69141,
			0,
			0,
			.28088
		],
		"107": [
			0,
			.69141,
			0,
			0,
			.38946
		],
		"108": [
			0,
			.69141,
			0,
			0,
			.27953
		],
		"109": [
			0,
			.47534,
			0,
			0,
			.76676
		],
		"110": [
			0,
			.47534,
			0,
			0,
			.52666
		],
		"111": [
			0,
			.47534,
			0,
			0,
			.48885
		],
		"112": [
			.18906,
			.52396,
			0,
			0,
			.50046
		],
		"113": [
			.18906,
			.47534,
			0,
			0,
			.48912
		],
		"114": [
			0,
			.47534,
			0,
			0,
			.38919
		],
		"115": [
			0,
			.47534,
			0,
			0,
			.44266
		],
		"116": [
			0,
			.62119,
			0,
			0,
			.33301
		],
		"117": [
			0,
			.47534,
			0,
			0,
			.5172
		],
		"118": [
			0,
			.52396,
			0,
			0,
			.5118
		],
		"119": [
			0,
			.52396,
			0,
			0,
			.77351
		],
		"120": [
			.18906,
			.47534,
			0,
			0,
			.38865
		],
		"121": [
			.18906,
			.47534,
			0,
			0,
			.49884
		],
		"122": [
			.18906,
			.47534,
			0,
			0,
			.39054
		],
		"160": [
			0,
			0,
			0,
			0,
			.25
		],
		"8216": [
			0,
			.69141,
			0,
			0,
			.21471
		],
		"8217": [
			0,
			.69141,
			0,
			0,
			.21471
		],
		"58112": [
			0,
			.62119,
			0,
			0,
			.49749
		],
		"58113": [
			0,
			.62119,
			0,
			0,
			.4983
		],
		"58114": [
			.18906,
			.69141,
			0,
			0,
			.33328
		],
		"58115": [
			.18906,
			.69141,
			0,
			0,
			.32923
		],
		"58116": [
			.18906,
			.47534,
			0,
			0,
			.50343
		],
		"58117": [
			0,
			.69141,
			0,
			0,
			.33301
		],
		"58118": [
			0,
			.62119,
			0,
			0,
			.33409
		],
		"58119": [
			0,
			.47534,
			0,
			0,
			.50073
		]
	},
	"Main-Bold": {
		"32": [
			0,
			0,
			0,
			0,
			.25
		],
		"33": [
			0,
			.69444,
			0,
			0,
			.35
		],
		"34": [
			0,
			.69444,
			0,
			0,
			.60278
		],
		"35": [
			.19444,
			.69444,
			0,
			0,
			.95833
		],
		"36": [
			.05556,
			.75,
			0,
			0,
			.575
		],
		"37": [
			.05556,
			.75,
			0,
			0,
			.95833
		],
		"38": [
			0,
			.69444,
			0,
			0,
			.89444
		],
		"39": [
			0,
			.69444,
			0,
			0,
			.31944
		],
		"40": [
			.25,
			.75,
			0,
			0,
			.44722
		],
		"41": [
			.25,
			.75,
			0,
			0,
			.44722
		],
		"42": [
			0,
			.75,
			0,
			0,
			.575
		],
		"43": [
			.13333,
			.63333,
			0,
			0,
			.89444
		],
		"44": [
			.19444,
			.15556,
			0,
			0,
			.31944
		],
		"45": [
			0,
			.44444,
			0,
			0,
			.38333
		],
		"46": [
			0,
			.15556,
			0,
			0,
			.31944
		],
		"47": [
			.25,
			.75,
			0,
			0,
			.575
		],
		"48": [
			0,
			.64444,
			0,
			0,
			.575
		],
		"49": [
			0,
			.64444,
			0,
			0,
			.575
		],
		"50": [
			0,
			.64444,
			0,
			0,
			.575
		],
		"51": [
			0,
			.64444,
			0,
			0,
			.575
		],
		"52": [
			0,
			.64444,
			0,
			0,
			.575
		],
		"53": [
			0,
			.64444,
			0,
			0,
			.575
		],
		"54": [
			0,
			.64444,
			0,
			0,
			.575
		],
		"55": [
			0,
			.64444,
			0,
			0,
			.575
		],
		"56": [
			0,
			.64444,
			0,
			0,
			.575
		],
		"57": [
			0,
			.64444,
			0,
			0,
			.575
		],
		"58": [
			0,
			.44444,
			0,
			0,
			.31944
		],
		"59": [
			.19444,
			.44444,
			0,
			0,
			.31944
		],
		"60": [
			.08556,
			.58556,
			0,
			0,
			.89444
		],
		"61": [
			-.10889,
			.39111,
			0,
			0,
			.89444
		],
		"62": [
			.08556,
			.58556,
			0,
			0,
			.89444
		],
		"63": [
			0,
			.69444,
			0,
			0,
			.54305
		],
		"64": [
			0,
			.69444,
			0,
			0,
			.89444
		],
		"65": [
			0,
			.68611,
			0,
			0,
			.86944
		],
		"66": [
			0,
			.68611,
			0,
			0,
			.81805
		],
		"67": [
			0,
			.68611,
			0,
			0,
			.83055
		],
		"68": [
			0,
			.68611,
			0,
			0,
			.88194
		],
		"69": [
			0,
			.68611,
			0,
			0,
			.75555
		],
		"70": [
			0,
			.68611,
			0,
			0,
			.72361
		],
		"71": [
			0,
			.68611,
			0,
			0,
			.90416
		],
		"72": [
			0,
			.68611,
			0,
			0,
			.9
		],
		"73": [
			0,
			.68611,
			0,
			0,
			.43611
		],
		"74": [
			0,
			.68611,
			0,
			0,
			.59444
		],
		"75": [
			0,
			.68611,
			0,
			0,
			.90138
		],
		"76": [
			0,
			.68611,
			0,
			0,
			.69166
		],
		"77": [
			0,
			.68611,
			0,
			0,
			1.09166
		],
		"78": [
			0,
			.68611,
			0,
			0,
			.9
		],
		"79": [
			0,
			.68611,
			0,
			0,
			.86388
		],
		"80": [
			0,
			.68611,
			0,
			0,
			.78611
		],
		"81": [
			.19444,
			.68611,
			0,
			0,
			.86388
		],
		"82": [
			0,
			.68611,
			0,
			0,
			.8625
		],
		"83": [
			0,
			.68611,
			0,
			0,
			.63889
		],
		"84": [
			0,
			.68611,
			0,
			0,
			.8
		],
		"85": [
			0,
			.68611,
			0,
			0,
			.88472
		],
		"86": [
			0,
			.68611,
			.01597,
			0,
			.86944
		],
		"87": [
			0,
			.68611,
			.01597,
			0,
			1.18888
		],
		"88": [
			0,
			.68611,
			0,
			0,
			.86944
		],
		"89": [
			0,
			.68611,
			.02875,
			0,
			.86944
		],
		"90": [
			0,
			.68611,
			0,
			0,
			.70277
		],
		"91": [
			.25,
			.75,
			0,
			0,
			.31944
		],
		"92": [
			.25,
			.75,
			0,
			0,
			.575
		],
		"93": [
			.25,
			.75,
			0,
			0,
			.31944
		],
		"94": [
			0,
			.69444,
			0,
			0,
			.575
		],
		"95": [
			.31,
			.13444,
			.03194,
			0,
			.575
		],
		"97": [
			0,
			.44444,
			0,
			0,
			.55902
		],
		"98": [
			0,
			.69444,
			0,
			0,
			.63889
		],
		"99": [
			0,
			.44444,
			0,
			0,
			.51111
		],
		"100": [
			0,
			.69444,
			0,
			0,
			.63889
		],
		"101": [
			0,
			.44444,
			0,
			0,
			.52708
		],
		"102": [
			0,
			.69444,
			.10903,
			0,
			.35139
		],
		"103": [
			.19444,
			.44444,
			.01597,
			0,
			.575
		],
		"104": [
			0,
			.69444,
			0,
			0,
			.63889
		],
		"105": [
			0,
			.69444,
			0,
			0,
			.31944
		],
		"106": [
			.19444,
			.69444,
			0,
			0,
			.35139
		],
		"107": [
			0,
			.69444,
			0,
			0,
			.60694
		],
		"108": [
			0,
			.69444,
			0,
			0,
			.31944
		],
		"109": [
			0,
			.44444,
			0,
			0,
			.95833
		],
		"110": [
			0,
			.44444,
			0,
			0,
			.63889
		],
		"111": [
			0,
			.44444,
			0,
			0,
			.575
		],
		"112": [
			.19444,
			.44444,
			0,
			0,
			.63889
		],
		"113": [
			.19444,
			.44444,
			0,
			0,
			.60694
		],
		"114": [
			0,
			.44444,
			0,
			0,
			.47361
		],
		"115": [
			0,
			.44444,
			0,
			0,
			.45361
		],
		"116": [
			0,
			.63492,
			0,
			0,
			.44722
		],
		"117": [
			0,
			.44444,
			0,
			0,
			.63889
		],
		"118": [
			0,
			.44444,
			.01597,
			0,
			.60694
		],
		"119": [
			0,
			.44444,
			.01597,
			0,
			.83055
		],
		"120": [
			0,
			.44444,
			0,
			0,
			.60694
		],
		"121": [
			.19444,
			.44444,
			.01597,
			0,
			.60694
		],
		"122": [
			0,
			.44444,
			0,
			0,
			.51111
		],
		"123": [
			.25,
			.75,
			0,
			0,
			.575
		],
		"124": [
			.25,
			.75,
			0,
			0,
			.31944
		],
		"125": [
			.25,
			.75,
			0,
			0,
			.575
		],
		"126": [
			.35,
			.34444,
			0,
			0,
			.575
		],
		"160": [
			0,
			0,
			0,
			0,
			.25
		],
		"163": [
			0,
			.69444,
			0,
			0,
			.86853
		],
		"168": [
			0,
			.69444,
			0,
			0,
			.575
		],
		"172": [
			0,
			.44444,
			0,
			0,
			.76666
		],
		"176": [
			0,
			.69444,
			0,
			0,
			.86944
		],
		"177": [
			.13333,
			.63333,
			0,
			0,
			.89444
		],
		"184": [
			.17014,
			0,
			0,
			0,
			.51111
		],
		"198": [
			0,
			.68611,
			0,
			0,
			1.04166
		],
		"215": [
			.13333,
			.63333,
			0,
			0,
			.89444
		],
		"216": [
			.04861,
			.73472,
			0,
			0,
			.89444
		],
		"223": [
			0,
			.69444,
			0,
			0,
			.59722
		],
		"230": [
			0,
			.44444,
			0,
			0,
			.83055
		],
		"247": [
			.13333,
			.63333,
			0,
			0,
			.89444
		],
		"248": [
			.09722,
			.54167,
			0,
			0,
			.575
		],
		"305": [
			0,
			.44444,
			0,
			0,
			.31944
		],
		"338": [
			0,
			.68611,
			0,
			0,
			1.16944
		],
		"339": [
			0,
			.44444,
			0,
			0,
			.89444
		],
		"567": [
			.19444,
			.44444,
			0,
			0,
			.35139
		],
		"710": [
			0,
			.69444,
			0,
			0,
			.575
		],
		"711": [
			0,
			.63194,
			0,
			0,
			.575
		],
		"713": [
			0,
			.59611,
			0,
			0,
			.575
		],
		"714": [
			0,
			.69444,
			0,
			0,
			.575
		],
		"715": [
			0,
			.69444,
			0,
			0,
			.575
		],
		"728": [
			0,
			.69444,
			0,
			0,
			.575
		],
		"729": [
			0,
			.69444,
			0,
			0,
			.31944
		],
		"730": [
			0,
			.69444,
			0,
			0,
			.86944
		],
		"732": [
			0,
			.69444,
			0,
			0,
			.575
		],
		"733": [
			0,
			.69444,
			0,
			0,
			.575
		],
		"915": [
			0,
			.68611,
			0,
			0,
			.69166
		],
		"916": [
			0,
			.68611,
			0,
			0,
			.95833
		],
		"920": [
			0,
			.68611,
			0,
			0,
			.89444
		],
		"923": [
			0,
			.68611,
			0,
			0,
			.80555
		],
		"926": [
			0,
			.68611,
			0,
			0,
			.76666
		],
		"928": [
			0,
			.68611,
			0,
			0,
			.9
		],
		"931": [
			0,
			.68611,
			0,
			0,
			.83055
		],
		"933": [
			0,
			.68611,
			0,
			0,
			.89444
		],
		"934": [
			0,
			.68611,
			0,
			0,
			.83055
		],
		"936": [
			0,
			.68611,
			0,
			0,
			.89444
		],
		"937": [
			0,
			.68611,
			0,
			0,
			.83055
		],
		"8211": [
			0,
			.44444,
			.03194,
			0,
			.575
		],
		"8212": [
			0,
			.44444,
			.03194,
			0,
			1.14999
		],
		"8216": [
			0,
			.69444,
			0,
			0,
			.31944
		],
		"8217": [
			0,
			.69444,
			0,
			0,
			.31944
		],
		"8220": [
			0,
			.69444,
			0,
			0,
			.60278
		],
		"8221": [
			0,
			.69444,
			0,
			0,
			.60278
		],
		"8224": [
			.19444,
			.69444,
			0,
			0,
			.51111
		],
		"8225": [
			.19444,
			.69444,
			0,
			0,
			.51111
		],
		"8242": [
			0,
			.55556,
			0,
			0,
			.34444
		],
		"8407": [
			0,
			.72444,
			.15486,
			0,
			.575
		],
		"8463": [
			0,
			.69444,
			0,
			0,
			.66759
		],
		"8465": [
			0,
			.69444,
			0,
			0,
			.83055
		],
		"8467": [
			0,
			.69444,
			0,
			0,
			.47361
		],
		"8472": [
			.19444,
			.44444,
			0,
			0,
			.74027
		],
		"8476": [
			0,
			.69444,
			0,
			0,
			.83055
		],
		"8501": [
			0,
			.69444,
			0,
			0,
			.70277
		],
		"8592": [
			-.10889,
			.39111,
			0,
			0,
			1.14999
		],
		"8593": [
			.19444,
			.69444,
			0,
			0,
			.575
		],
		"8594": [
			-.10889,
			.39111,
			0,
			0,
			1.14999
		],
		"8595": [
			.19444,
			.69444,
			0,
			0,
			.575
		],
		"8596": [
			-.10889,
			.39111,
			0,
			0,
			1.14999
		],
		"8597": [
			.25,
			.75,
			0,
			0,
			.575
		],
		"8598": [
			.19444,
			.69444,
			0,
			0,
			1.14999
		],
		"8599": [
			.19444,
			.69444,
			0,
			0,
			1.14999
		],
		"8600": [
			.19444,
			.69444,
			0,
			0,
			1.14999
		],
		"8601": [
			.19444,
			.69444,
			0,
			0,
			1.14999
		],
		"8636": [
			-.10889,
			.39111,
			0,
			0,
			1.14999
		],
		"8637": [
			-.10889,
			.39111,
			0,
			0,
			1.14999
		],
		"8640": [
			-.10889,
			.39111,
			0,
			0,
			1.14999
		],
		"8641": [
			-.10889,
			.39111,
			0,
			0,
			1.14999
		],
		"8656": [
			-.10889,
			.39111,
			0,
			0,
			1.14999
		],
		"8657": [
			.19444,
			.69444,
			0,
			0,
			.70277
		],
		"8658": [
			-.10889,
			.39111,
			0,
			0,
			1.14999
		],
		"8659": [
			.19444,
			.69444,
			0,
			0,
			.70277
		],
		"8660": [
			-.10889,
			.39111,
			0,
			0,
			1.14999
		],
		"8661": [
			.25,
			.75,
			0,
			0,
			.70277
		],
		"8704": [
			0,
			.69444,
			0,
			0,
			.63889
		],
		"8706": [
			0,
			.69444,
			.06389,
			0,
			.62847
		],
		"8707": [
			0,
			.69444,
			0,
			0,
			.63889
		],
		"8709": [
			.05556,
			.75,
			0,
			0,
			.575
		],
		"8711": [
			0,
			.68611,
			0,
			0,
			.95833
		],
		"8712": [
			.08556,
			.58556,
			0,
			0,
			.76666
		],
		"8715": [
			.08556,
			.58556,
			0,
			0,
			.76666
		],
		"8722": [
			.13333,
			.63333,
			0,
			0,
			.89444
		],
		"8723": [
			.13333,
			.63333,
			0,
			0,
			.89444
		],
		"8725": [
			.25,
			.75,
			0,
			0,
			.575
		],
		"8726": [
			.25,
			.75,
			0,
			0,
			.575
		],
		"8727": [
			-.02778,
			.47222,
			0,
			0,
			.575
		],
		"8728": [
			-.02639,
			.47361,
			0,
			0,
			.575
		],
		"8729": [
			-.02639,
			.47361,
			0,
			0,
			.575
		],
		"8730": [
			.18,
			.82,
			0,
			0,
			.95833
		],
		"8733": [
			0,
			.44444,
			0,
			0,
			.89444
		],
		"8734": [
			0,
			.44444,
			0,
			0,
			1.14999
		],
		"8736": [
			0,
			.69224,
			0,
			0,
			.72222
		],
		"8739": [
			.25,
			.75,
			0,
			0,
			.31944
		],
		"8741": [
			.25,
			.75,
			0,
			0,
			.575
		],
		"8743": [
			0,
			.55556,
			0,
			0,
			.76666
		],
		"8744": [
			0,
			.55556,
			0,
			0,
			.76666
		],
		"8745": [
			0,
			.55556,
			0,
			0,
			.76666
		],
		"8746": [
			0,
			.55556,
			0,
			0,
			.76666
		],
		"8747": [
			.19444,
			.69444,
			.12778,
			0,
			.56875
		],
		"8764": [
			-.10889,
			.39111,
			0,
			0,
			.89444
		],
		"8768": [
			.19444,
			.69444,
			0,
			0,
			.31944
		],
		"8771": [
			.00222,
			.50222,
			0,
			0,
			.89444
		],
		"8773": [
			.027,
			.638,
			0,
			0,
			.894
		],
		"8776": [
			.02444,
			.52444,
			0,
			0,
			.89444
		],
		"8781": [
			.00222,
			.50222,
			0,
			0,
			.89444
		],
		"8801": [
			.00222,
			.50222,
			0,
			0,
			.89444
		],
		"8804": [
			.19667,
			.69667,
			0,
			0,
			.89444
		],
		"8805": [
			.19667,
			.69667,
			0,
			0,
			.89444
		],
		"8810": [
			.08556,
			.58556,
			0,
			0,
			1.14999
		],
		"8811": [
			.08556,
			.58556,
			0,
			0,
			1.14999
		],
		"8826": [
			.08556,
			.58556,
			0,
			0,
			.89444
		],
		"8827": [
			.08556,
			.58556,
			0,
			0,
			.89444
		],
		"8834": [
			.08556,
			.58556,
			0,
			0,
			.89444
		],
		"8835": [
			.08556,
			.58556,
			0,
			0,
			.89444
		],
		"8838": [
			.19667,
			.69667,
			0,
			0,
			.89444
		],
		"8839": [
			.19667,
			.69667,
			0,
			0,
			.89444
		],
		"8846": [
			0,
			.55556,
			0,
			0,
			.76666
		],
		"8849": [
			.19667,
			.69667,
			0,
			0,
			.89444
		],
		"8850": [
			.19667,
			.69667,
			0,
			0,
			.89444
		],
		"8851": [
			0,
			.55556,
			0,
			0,
			.76666
		],
		"8852": [
			0,
			.55556,
			0,
			0,
			.76666
		],
		"8853": [
			.13333,
			.63333,
			0,
			0,
			.89444
		],
		"8854": [
			.13333,
			.63333,
			0,
			0,
			.89444
		],
		"8855": [
			.13333,
			.63333,
			0,
			0,
			.89444
		],
		"8856": [
			.13333,
			.63333,
			0,
			0,
			.89444
		],
		"8857": [
			.13333,
			.63333,
			0,
			0,
			.89444
		],
		"8866": [
			0,
			.69444,
			0,
			0,
			.70277
		],
		"8867": [
			0,
			.69444,
			0,
			0,
			.70277
		],
		"8868": [
			0,
			.69444,
			0,
			0,
			.89444
		],
		"8869": [
			0,
			.69444,
			0,
			0,
			.89444
		],
		"8900": [
			-.02639,
			.47361,
			0,
			0,
			.575
		],
		"8901": [
			-.02639,
			.47361,
			0,
			0,
			.31944
		],
		"8902": [
			-.02778,
			.47222,
			0,
			0,
			.575
		],
		"8968": [
			.25,
			.75,
			0,
			0,
			.51111
		],
		"8969": [
			.25,
			.75,
			0,
			0,
			.51111
		],
		"8970": [
			.25,
			.75,
			0,
			0,
			.51111
		],
		"8971": [
			.25,
			.75,
			0,
			0,
			.51111
		],
		"8994": [
			-.13889,
			.36111,
			0,
			0,
			1.14999
		],
		"8995": [
			-.13889,
			.36111,
			0,
			0,
			1.14999
		],
		"9651": [
			.19444,
			.69444,
			0,
			0,
			1.02222
		],
		"9657": [
			-.02778,
			.47222,
			0,
			0,
			.575
		],
		"9661": [
			.19444,
			.69444,
			0,
			0,
			1.02222
		],
		"9667": [
			-.02778,
			.47222,
			0,
			0,
			.575
		],
		"9711": [
			.19444,
			.69444,
			0,
			0,
			1.14999
		],
		"9824": [
			.12963,
			.69444,
			0,
			0,
			.89444
		],
		"9825": [
			.12963,
			.69444,
			0,
			0,
			.89444
		],
		"9826": [
			.12963,
			.69444,
			0,
			0,
			.89444
		],
		"9827": [
			.12963,
			.69444,
			0,
			0,
			.89444
		],
		"9837": [
			0,
			.75,
			0,
			0,
			.44722
		],
		"9838": [
			.19444,
			.69444,
			0,
			0,
			.44722
		],
		"9839": [
			.19444,
			.69444,
			0,
			0,
			.44722
		],
		"10216": [
			.25,
			.75,
			0,
			0,
			.44722
		],
		"10217": [
			.25,
			.75,
			0,
			0,
			.44722
		],
		"10815": [
			0,
			.68611,
			0,
			0,
			.9
		],
		"10927": [
			.19667,
			.69667,
			0,
			0,
			.89444
		],
		"10928": [
			.19667,
			.69667,
			0,
			0,
			.89444
		],
		"57376": [
			.19444,
			.69444,
			0,
			0,
			0
		]
	},
	"Main-BoldItalic": {
		"32": [
			0,
			0,
			0,
			0,
			.25
		],
		"33": [
			0,
			.69444,
			.11417,
			0,
			.38611
		],
		"34": [
			0,
			.69444,
			.07939,
			0,
			.62055
		],
		"35": [
			.19444,
			.69444,
			.06833,
			0,
			.94444
		],
		"37": [
			.05556,
			.75,
			.12861,
			0,
			.94444
		],
		"38": [
			0,
			.69444,
			.08528,
			0,
			.88555
		],
		"39": [
			0,
			.69444,
			.12945,
			0,
			.35555
		],
		"40": [
			.25,
			.75,
			.15806,
			0,
			.47333
		],
		"41": [
			.25,
			.75,
			.03306,
			0,
			.47333
		],
		"42": [
			0,
			.75,
			.14333,
			0,
			.59111
		],
		"43": [
			.10333,
			.60333,
			.03306,
			0,
			.88555
		],
		"44": [
			.19444,
			.14722,
			0,
			0,
			.35555
		],
		"45": [
			0,
			.44444,
			.02611,
			0,
			.41444
		],
		"46": [
			0,
			.14722,
			0,
			0,
			.35555
		],
		"47": [
			.25,
			.75,
			.15806,
			0,
			.59111
		],
		"48": [
			0,
			.64444,
			.13167,
			0,
			.59111
		],
		"49": [
			0,
			.64444,
			.13167,
			0,
			.59111
		],
		"50": [
			0,
			.64444,
			.13167,
			0,
			.59111
		],
		"51": [
			0,
			.64444,
			.13167,
			0,
			.59111
		],
		"52": [
			.19444,
			.64444,
			.13167,
			0,
			.59111
		],
		"53": [
			0,
			.64444,
			.13167,
			0,
			.59111
		],
		"54": [
			0,
			.64444,
			.13167,
			0,
			.59111
		],
		"55": [
			.19444,
			.64444,
			.13167,
			0,
			.59111
		],
		"56": [
			0,
			.64444,
			.13167,
			0,
			.59111
		],
		"57": [
			0,
			.64444,
			.13167,
			0,
			.59111
		],
		"58": [
			0,
			.44444,
			.06695,
			0,
			.35555
		],
		"59": [
			.19444,
			.44444,
			.06695,
			0,
			.35555
		],
		"61": [
			-.10889,
			.39111,
			.06833,
			0,
			.88555
		],
		"63": [
			0,
			.69444,
			.11472,
			0,
			.59111
		],
		"64": [
			0,
			.69444,
			.09208,
			0,
			.88555
		],
		"65": [
			0,
			.68611,
			0,
			0,
			.86555
		],
		"66": [
			0,
			.68611,
			.0992,
			0,
			.81666
		],
		"67": [
			0,
			.68611,
			.14208,
			0,
			.82666
		],
		"68": [
			0,
			.68611,
			.09062,
			0,
			.87555
		],
		"69": [
			0,
			.68611,
			.11431,
			0,
			.75666
		],
		"70": [
			0,
			.68611,
			.12903,
			0,
			.72722
		],
		"71": [
			0,
			.68611,
			.07347,
			0,
			.89527
		],
		"72": [
			0,
			.68611,
			.17208,
			0,
			.8961
		],
		"73": [
			0,
			.68611,
			.15681,
			0,
			.47166
		],
		"74": [
			0,
			.68611,
			.145,
			0,
			.61055
		],
		"75": [
			0,
			.68611,
			.14208,
			0,
			.89499
		],
		"76": [
			0,
			.68611,
			0,
			0,
			.69777
		],
		"77": [
			0,
			.68611,
			.17208,
			0,
			1.07277
		],
		"78": [
			0,
			.68611,
			.17208,
			0,
			.8961
		],
		"79": [
			0,
			.68611,
			.09062,
			0,
			.85499
		],
		"80": [
			0,
			.68611,
			.0992,
			0,
			.78721
		],
		"81": [
			.19444,
			.68611,
			.09062,
			0,
			.85499
		],
		"82": [
			0,
			.68611,
			.02559,
			0,
			.85944
		],
		"83": [
			0,
			.68611,
			.11264,
			0,
			.64999
		],
		"84": [
			0,
			.68611,
			.12903,
			0,
			.7961
		],
		"85": [
			0,
			.68611,
			.17208,
			0,
			.88083
		],
		"86": [
			0,
			.68611,
			.18625,
			0,
			.86555
		],
		"87": [
			0,
			.68611,
			.18625,
			0,
			1.15999
		],
		"88": [
			0,
			.68611,
			.15681,
			0,
			.86555
		],
		"89": [
			0,
			.68611,
			.19803,
			0,
			.86555
		],
		"90": [
			0,
			.68611,
			.14208,
			0,
			.70888
		],
		"91": [
			.25,
			.75,
			.1875,
			0,
			.35611
		],
		"93": [
			.25,
			.75,
			.09972,
			0,
			.35611
		],
		"94": [
			0,
			.69444,
			.06709,
			0,
			.59111
		],
		"95": [
			.31,
			.13444,
			.09811,
			0,
			.59111
		],
		"97": [
			0,
			.44444,
			.09426,
			0,
			.59111
		],
		"98": [
			0,
			.69444,
			.07861,
			0,
			.53222
		],
		"99": [
			0,
			.44444,
			.05222,
			0,
			.53222
		],
		"100": [
			0,
			.69444,
			.10861,
			0,
			.59111
		],
		"101": [
			0,
			.44444,
			.085,
			0,
			.53222
		],
		"102": [
			.19444,
			.69444,
			.21778,
			0,
			.4
		],
		"103": [
			.19444,
			.44444,
			.105,
			0,
			.53222
		],
		"104": [
			0,
			.69444,
			.09426,
			0,
			.59111
		],
		"105": [
			0,
			.69326,
			.11387,
			0,
			.35555
		],
		"106": [
			.19444,
			.69326,
			.1672,
			0,
			.35555
		],
		"107": [
			0,
			.69444,
			.11111,
			0,
			.53222
		],
		"108": [
			0,
			.69444,
			.10861,
			0,
			.29666
		],
		"109": [
			0,
			.44444,
			.09426,
			0,
			.94444
		],
		"110": [
			0,
			.44444,
			.09426,
			0,
			.64999
		],
		"111": [
			0,
			.44444,
			.07861,
			0,
			.59111
		],
		"112": [
			.19444,
			.44444,
			.07861,
			0,
			.59111
		],
		"113": [
			.19444,
			.44444,
			.105,
			0,
			.53222
		],
		"114": [
			0,
			.44444,
			.11111,
			0,
			.50167
		],
		"115": [
			0,
			.44444,
			.08167,
			0,
			.48694
		],
		"116": [
			0,
			.63492,
			.09639,
			0,
			.385
		],
		"117": [
			0,
			.44444,
			.09426,
			0,
			.62055
		],
		"118": [
			0,
			.44444,
			.11111,
			0,
			.53222
		],
		"119": [
			0,
			.44444,
			.11111,
			0,
			.76777
		],
		"120": [
			0,
			.44444,
			.12583,
			0,
			.56055
		],
		"121": [
			.19444,
			.44444,
			.105,
			0,
			.56166
		],
		"122": [
			0,
			.44444,
			.13889,
			0,
			.49055
		],
		"126": [
			.35,
			.34444,
			.11472,
			0,
			.59111
		],
		"160": [
			0,
			0,
			0,
			0,
			.25
		],
		"168": [
			0,
			.69444,
			.11473,
			0,
			.59111
		],
		"176": [
			0,
			.69444,
			0,
			0,
			.94888
		],
		"184": [
			.17014,
			0,
			0,
			0,
			.53222
		],
		"198": [
			0,
			.68611,
			.11431,
			0,
			1.02277
		],
		"216": [
			.04861,
			.73472,
			.09062,
			0,
			.88555
		],
		"223": [
			.19444,
			.69444,
			.09736,
			0,
			.665
		],
		"230": [
			0,
			.44444,
			.085,
			0,
			.82666
		],
		"248": [
			.09722,
			.54167,
			.09458,
			0,
			.59111
		],
		"305": [
			0,
			.44444,
			.09426,
			0,
			.35555
		],
		"338": [
			0,
			.68611,
			.11431,
			0,
			1.14054
		],
		"339": [
			0,
			.44444,
			.085,
			0,
			.82666
		],
		"567": [
			.19444,
			.44444,
			.04611,
			0,
			.385
		],
		"710": [
			0,
			.69444,
			.06709,
			0,
			.59111
		],
		"711": [
			0,
			.63194,
			.08271,
			0,
			.59111
		],
		"713": [
			0,
			.59444,
			.10444,
			0,
			.59111
		],
		"714": [
			0,
			.69444,
			.08528,
			0,
			.59111
		],
		"715": [
			0,
			.69444,
			0,
			0,
			.59111
		],
		"728": [
			0,
			.69444,
			.10333,
			0,
			.59111
		],
		"729": [
			0,
			.69444,
			.12945,
			0,
			.35555
		],
		"730": [
			0,
			.69444,
			0,
			0,
			.94888
		],
		"732": [
			0,
			.69444,
			.11472,
			0,
			.59111
		],
		"733": [
			0,
			.69444,
			.11472,
			0,
			.59111
		],
		"915": [
			0,
			.68611,
			.12903,
			0,
			.69777
		],
		"916": [
			0,
			.68611,
			0,
			0,
			.94444
		],
		"920": [
			0,
			.68611,
			.09062,
			0,
			.88555
		],
		"923": [
			0,
			.68611,
			0,
			0,
			.80666
		],
		"926": [
			0,
			.68611,
			.15092,
			0,
			.76777
		],
		"928": [
			0,
			.68611,
			.17208,
			0,
			.8961
		],
		"931": [
			0,
			.68611,
			.11431,
			0,
			.82666
		],
		"933": [
			0,
			.68611,
			.10778,
			0,
			.88555
		],
		"934": [
			0,
			.68611,
			.05632,
			0,
			.82666
		],
		"936": [
			0,
			.68611,
			.10778,
			0,
			.88555
		],
		"937": [
			0,
			.68611,
			.0992,
			0,
			.82666
		],
		"8211": [
			0,
			.44444,
			.09811,
			0,
			.59111
		],
		"8212": [
			0,
			.44444,
			.09811,
			0,
			1.18221
		],
		"8216": [
			0,
			.69444,
			.12945,
			0,
			.35555
		],
		"8217": [
			0,
			.69444,
			.12945,
			0,
			.35555
		],
		"8220": [
			0,
			.69444,
			.16772,
			0,
			.62055
		],
		"8221": [
			0,
			.69444,
			.07939,
			0,
			.62055
		]
	},
	"Main-Italic": {
		"32": [
			0,
			0,
			0,
			0,
			.25
		],
		"33": [
			0,
			.69444,
			.12417,
			0,
			.30667
		],
		"34": [
			0,
			.69444,
			.06961,
			0,
			.51444
		],
		"35": [
			.19444,
			.69444,
			.06616,
			0,
			.81777
		],
		"37": [
			.05556,
			.75,
			.13639,
			0,
			.81777
		],
		"38": [
			0,
			.69444,
			.09694,
			0,
			.76666
		],
		"39": [
			0,
			.69444,
			.12417,
			0,
			.30667
		],
		"40": [
			.25,
			.75,
			.16194,
			0,
			.40889
		],
		"41": [
			.25,
			.75,
			.03694,
			0,
			.40889
		],
		"42": [
			0,
			.75,
			.14917,
			0,
			.51111
		],
		"43": [
			.05667,
			.56167,
			.03694,
			0,
			.76666
		],
		"44": [
			.19444,
			.10556,
			0,
			0,
			.30667
		],
		"45": [
			0,
			.43056,
			.02826,
			0,
			.35778
		],
		"46": [
			0,
			.10556,
			0,
			0,
			.30667
		],
		"47": [
			.25,
			.75,
			.16194,
			0,
			.51111
		],
		"48": [
			0,
			.64444,
			.13556,
			0,
			.51111
		],
		"49": [
			0,
			.64444,
			.13556,
			0,
			.51111
		],
		"50": [
			0,
			.64444,
			.13556,
			0,
			.51111
		],
		"51": [
			0,
			.64444,
			.13556,
			0,
			.51111
		],
		"52": [
			.19444,
			.64444,
			.13556,
			0,
			.51111
		],
		"53": [
			0,
			.64444,
			.13556,
			0,
			.51111
		],
		"54": [
			0,
			.64444,
			.13556,
			0,
			.51111
		],
		"55": [
			.19444,
			.64444,
			.13556,
			0,
			.51111
		],
		"56": [
			0,
			.64444,
			.13556,
			0,
			.51111
		],
		"57": [
			0,
			.64444,
			.13556,
			0,
			.51111
		],
		"58": [
			0,
			.43056,
			.0582,
			0,
			.30667
		],
		"59": [
			.19444,
			.43056,
			.0582,
			0,
			.30667
		],
		"61": [
			-.13313,
			.36687,
			.06616,
			0,
			.76666
		],
		"63": [
			0,
			.69444,
			.1225,
			0,
			.51111
		],
		"64": [
			0,
			.69444,
			.09597,
			0,
			.76666
		],
		"65": [
			0,
			.68333,
			0,
			0,
			.74333
		],
		"66": [
			0,
			.68333,
			.10257,
			0,
			.70389
		],
		"67": [
			0,
			.68333,
			.14528,
			0,
			.71555
		],
		"68": [
			0,
			.68333,
			.09403,
			0,
			.755
		],
		"69": [
			0,
			.68333,
			.12028,
			0,
			.67833
		],
		"70": [
			0,
			.68333,
			.13305,
			0,
			.65277
		],
		"71": [
			0,
			.68333,
			.08722,
			0,
			.77361
		],
		"72": [
			0,
			.68333,
			.16389,
			0,
			.74333
		],
		"73": [
			0,
			.68333,
			.15806,
			0,
			.38555
		],
		"74": [
			0,
			.68333,
			.14028,
			0,
			.525
		],
		"75": [
			0,
			.68333,
			.14528,
			0,
			.76888
		],
		"76": [
			0,
			.68333,
			0,
			0,
			.62722
		],
		"77": [
			0,
			.68333,
			.16389,
			0,
			.89666
		],
		"78": [
			0,
			.68333,
			.16389,
			0,
			.74333
		],
		"79": [
			0,
			.68333,
			.09403,
			0,
			.76666
		],
		"80": [
			0,
			.68333,
			.10257,
			0,
			.67833
		],
		"81": [
			.19444,
			.68333,
			.09403,
			0,
			.76666
		],
		"82": [
			0,
			.68333,
			.03868,
			0,
			.72944
		],
		"83": [
			0,
			.68333,
			.11972,
			0,
			.56222
		],
		"84": [
			0,
			.68333,
			.13305,
			0,
			.71555
		],
		"85": [
			0,
			.68333,
			.16389,
			0,
			.74333
		],
		"86": [
			0,
			.68333,
			.18361,
			0,
			.74333
		],
		"87": [
			0,
			.68333,
			.18361,
			0,
			.99888
		],
		"88": [
			0,
			.68333,
			.15806,
			0,
			.74333
		],
		"89": [
			0,
			.68333,
			.19383,
			0,
			.74333
		],
		"90": [
			0,
			.68333,
			.14528,
			0,
			.61333
		],
		"91": [
			.25,
			.75,
			.1875,
			0,
			.30667
		],
		"93": [
			.25,
			.75,
			.10528,
			0,
			.30667
		],
		"94": [
			0,
			.69444,
			.06646,
			0,
			.51111
		],
		"95": [
			.31,
			.12056,
			.09208,
			0,
			.51111
		],
		"97": [
			0,
			.43056,
			.07671,
			0,
			.51111
		],
		"98": [
			0,
			.69444,
			.06312,
			0,
			.46
		],
		"99": [
			0,
			.43056,
			.05653,
			0,
			.46
		],
		"100": [
			0,
			.69444,
			.10333,
			0,
			.51111
		],
		"101": [
			0,
			.43056,
			.07514,
			0,
			.46
		],
		"102": [
			.19444,
			.69444,
			.21194,
			0,
			.30667
		],
		"103": [
			.19444,
			.43056,
			.08847,
			0,
			.46
		],
		"104": [
			0,
			.69444,
			.07671,
			0,
			.51111
		],
		"105": [
			0,
			.65536,
			.1019,
			0,
			.30667
		],
		"106": [
			.19444,
			.65536,
			.14467,
			0,
			.30667
		],
		"107": [
			0,
			.69444,
			.10764,
			0,
			.46
		],
		"108": [
			0,
			.69444,
			.10333,
			0,
			.25555
		],
		"109": [
			0,
			.43056,
			.07671,
			0,
			.81777
		],
		"110": [
			0,
			.43056,
			.07671,
			0,
			.56222
		],
		"111": [
			0,
			.43056,
			.06312,
			0,
			.51111
		],
		"112": [
			.19444,
			.43056,
			.06312,
			0,
			.51111
		],
		"113": [
			.19444,
			.43056,
			.08847,
			0,
			.46
		],
		"114": [
			0,
			.43056,
			.10764,
			0,
			.42166
		],
		"115": [
			0,
			.43056,
			.08208,
			0,
			.40889
		],
		"116": [
			0,
			.61508,
			.09486,
			0,
			.33222
		],
		"117": [
			0,
			.43056,
			.07671,
			0,
			.53666
		],
		"118": [
			0,
			.43056,
			.10764,
			0,
			.46
		],
		"119": [
			0,
			.43056,
			.10764,
			0,
			.66444
		],
		"120": [
			0,
			.43056,
			.12042,
			0,
			.46389
		],
		"121": [
			.19444,
			.43056,
			.08847,
			0,
			.48555
		],
		"122": [
			0,
			.43056,
			.12292,
			0,
			.40889
		],
		"126": [
			.35,
			.31786,
			.11585,
			0,
			.51111
		],
		"160": [
			0,
			0,
			0,
			0,
			.25
		],
		"168": [
			0,
			.66786,
			.10474,
			0,
			.51111
		],
		"176": [
			0,
			.69444,
			0,
			0,
			.83129
		],
		"184": [
			.17014,
			0,
			0,
			0,
			.46
		],
		"198": [
			0,
			.68333,
			.12028,
			0,
			.88277
		],
		"216": [
			.04861,
			.73194,
			.09403,
			0,
			.76666
		],
		"223": [
			.19444,
			.69444,
			.10514,
			0,
			.53666
		],
		"230": [
			0,
			.43056,
			.07514,
			0,
			.71555
		],
		"248": [
			.09722,
			.52778,
			.09194,
			0,
			.51111
		],
		"338": [
			0,
			.68333,
			.12028,
			0,
			.98499
		],
		"339": [
			0,
			.43056,
			.07514,
			0,
			.71555
		],
		"710": [
			0,
			.69444,
			.06646,
			0,
			.51111
		],
		"711": [
			0,
			.62847,
			.08295,
			0,
			.51111
		],
		"713": [
			0,
			.56167,
			.10333,
			0,
			.51111
		],
		"714": [
			0,
			.69444,
			.09694,
			0,
			.51111
		],
		"715": [
			0,
			.69444,
			0,
			0,
			.51111
		],
		"728": [
			0,
			.69444,
			.10806,
			0,
			.51111
		],
		"729": [
			0,
			.66786,
			.11752,
			0,
			.30667
		],
		"730": [
			0,
			.69444,
			0,
			0,
			.83129
		],
		"732": [
			0,
			.66786,
			.11585,
			0,
			.51111
		],
		"733": [
			0,
			.69444,
			.1225,
			0,
			.51111
		],
		"915": [
			0,
			.68333,
			.13305,
			0,
			.62722
		],
		"916": [
			0,
			.68333,
			0,
			0,
			.81777
		],
		"920": [
			0,
			.68333,
			.09403,
			0,
			.76666
		],
		"923": [
			0,
			.68333,
			0,
			0,
			.69222
		],
		"926": [
			0,
			.68333,
			.15294,
			0,
			.66444
		],
		"928": [
			0,
			.68333,
			.16389,
			0,
			.74333
		],
		"931": [
			0,
			.68333,
			.12028,
			0,
			.71555
		],
		"933": [
			0,
			.68333,
			.11111,
			0,
			.76666
		],
		"934": [
			0,
			.68333,
			.05986,
			0,
			.71555
		],
		"936": [
			0,
			.68333,
			.11111,
			0,
			.76666
		],
		"937": [
			0,
			.68333,
			.10257,
			0,
			.71555
		],
		"8211": [
			0,
			.43056,
			.09208,
			0,
			.51111
		],
		"8212": [
			0,
			.43056,
			.09208,
			0,
			1.02222
		],
		"8216": [
			0,
			.69444,
			.12417,
			0,
			.30667
		],
		"8217": [
			0,
			.69444,
			.12417,
			0,
			.30667
		],
		"8220": [
			0,
			.69444,
			.1685,
			0,
			.51444
		],
		"8221": [
			0,
			.69444,
			.06961,
			0,
			.51444
		],
		"8463": [
			0,
			.68889,
			0,
			0,
			.54028
		]
	},
	"Main-Regular": {
		"32": [
			0,
			0,
			0,
			0,
			.25
		],
		"33": [
			0,
			.69444,
			0,
			0,
			.27778
		],
		"34": [
			0,
			.69444,
			0,
			0,
			.5
		],
		"35": [
			.19444,
			.69444,
			0,
			0,
			.83334
		],
		"36": [
			.05556,
			.75,
			0,
			0,
			.5
		],
		"37": [
			.05556,
			.75,
			0,
			0,
			.83334
		],
		"38": [
			0,
			.69444,
			0,
			0,
			.77778
		],
		"39": [
			0,
			.69444,
			0,
			0,
			.27778
		],
		"40": [
			.25,
			.75,
			0,
			0,
			.38889
		],
		"41": [
			.25,
			.75,
			0,
			0,
			.38889
		],
		"42": [
			0,
			.75,
			0,
			0,
			.5
		],
		"43": [
			.08333,
			.58333,
			0,
			0,
			.77778
		],
		"44": [
			.19444,
			.10556,
			0,
			0,
			.27778
		],
		"45": [
			0,
			.43056,
			0,
			0,
			.33333
		],
		"46": [
			0,
			.10556,
			0,
			0,
			.27778
		],
		"47": [
			.25,
			.75,
			0,
			0,
			.5
		],
		"48": [
			0,
			.64444,
			0,
			0,
			.5
		],
		"49": [
			0,
			.64444,
			0,
			0,
			.5
		],
		"50": [
			0,
			.64444,
			0,
			0,
			.5
		],
		"51": [
			0,
			.64444,
			0,
			0,
			.5
		],
		"52": [
			0,
			.64444,
			0,
			0,
			.5
		],
		"53": [
			0,
			.64444,
			0,
			0,
			.5
		],
		"54": [
			0,
			.64444,
			0,
			0,
			.5
		],
		"55": [
			0,
			.64444,
			0,
			0,
			.5
		],
		"56": [
			0,
			.64444,
			0,
			0,
			.5
		],
		"57": [
			0,
			.64444,
			0,
			0,
			.5
		],
		"58": [
			0,
			.43056,
			0,
			0,
			.27778
		],
		"59": [
			.19444,
			.43056,
			0,
			0,
			.27778
		],
		"60": [
			.0391,
			.5391,
			0,
			0,
			.77778
		],
		"61": [
			-.13313,
			.36687,
			0,
			0,
			.77778
		],
		"62": [
			.0391,
			.5391,
			0,
			0,
			.77778
		],
		"63": [
			0,
			.69444,
			0,
			0,
			.47222
		],
		"64": [
			0,
			.69444,
			0,
			0,
			.77778
		],
		"65": [
			0,
			.68333,
			0,
			0,
			.75
		],
		"66": [
			0,
			.68333,
			0,
			0,
			.70834
		],
		"67": [
			0,
			.68333,
			0,
			0,
			.72222
		],
		"68": [
			0,
			.68333,
			0,
			0,
			.76389
		],
		"69": [
			0,
			.68333,
			0,
			0,
			.68056
		],
		"70": [
			0,
			.68333,
			0,
			0,
			.65278
		],
		"71": [
			0,
			.68333,
			0,
			0,
			.78472
		],
		"72": [
			0,
			.68333,
			0,
			0,
			.75
		],
		"73": [
			0,
			.68333,
			0,
			0,
			.36111
		],
		"74": [
			0,
			.68333,
			0,
			0,
			.51389
		],
		"75": [
			0,
			.68333,
			0,
			0,
			.77778
		],
		"76": [
			0,
			.68333,
			0,
			0,
			.625
		],
		"77": [
			0,
			.68333,
			0,
			0,
			.91667
		],
		"78": [
			0,
			.68333,
			0,
			0,
			.75
		],
		"79": [
			0,
			.68333,
			0,
			0,
			.77778
		],
		"80": [
			0,
			.68333,
			0,
			0,
			.68056
		],
		"81": [
			.19444,
			.68333,
			0,
			0,
			.77778
		],
		"82": [
			0,
			.68333,
			0,
			0,
			.73611
		],
		"83": [
			0,
			.68333,
			0,
			0,
			.55556
		],
		"84": [
			0,
			.68333,
			0,
			0,
			.72222
		],
		"85": [
			0,
			.68333,
			0,
			0,
			.75
		],
		"86": [
			0,
			.68333,
			.01389,
			0,
			.75
		],
		"87": [
			0,
			.68333,
			.01389,
			0,
			1.02778
		],
		"88": [
			0,
			.68333,
			0,
			0,
			.75
		],
		"89": [
			0,
			.68333,
			.025,
			0,
			.75
		],
		"90": [
			0,
			.68333,
			0,
			0,
			.61111
		],
		"91": [
			.25,
			.75,
			0,
			0,
			.27778
		],
		"92": [
			.25,
			.75,
			0,
			0,
			.5
		],
		"93": [
			.25,
			.75,
			0,
			0,
			.27778
		],
		"94": [
			0,
			.69444,
			0,
			0,
			.5
		],
		"95": [
			.31,
			.12056,
			.02778,
			0,
			.5
		],
		"97": [
			0,
			.43056,
			0,
			0,
			.5
		],
		"98": [
			0,
			.69444,
			0,
			0,
			.55556
		],
		"99": [
			0,
			.43056,
			0,
			0,
			.44445
		],
		"100": [
			0,
			.69444,
			0,
			0,
			.55556
		],
		"101": [
			0,
			.43056,
			0,
			0,
			.44445
		],
		"102": [
			0,
			.69444,
			.07778,
			0,
			.30556
		],
		"103": [
			.19444,
			.43056,
			.01389,
			0,
			.5
		],
		"104": [
			0,
			.69444,
			0,
			0,
			.55556
		],
		"105": [
			0,
			.66786,
			0,
			0,
			.27778
		],
		"106": [
			.19444,
			.66786,
			0,
			0,
			.30556
		],
		"107": [
			0,
			.69444,
			0,
			0,
			.52778
		],
		"108": [
			0,
			.69444,
			0,
			0,
			.27778
		],
		"109": [
			0,
			.43056,
			0,
			0,
			.83334
		],
		"110": [
			0,
			.43056,
			0,
			0,
			.55556
		],
		"111": [
			0,
			.43056,
			0,
			0,
			.5
		],
		"112": [
			.19444,
			.43056,
			0,
			0,
			.55556
		],
		"113": [
			.19444,
			.43056,
			0,
			0,
			.52778
		],
		"114": [
			0,
			.43056,
			0,
			0,
			.39167
		],
		"115": [
			0,
			.43056,
			0,
			0,
			.39445
		],
		"116": [
			0,
			.61508,
			0,
			0,
			.38889
		],
		"117": [
			0,
			.43056,
			0,
			0,
			.55556
		],
		"118": [
			0,
			.43056,
			.01389,
			0,
			.52778
		],
		"119": [
			0,
			.43056,
			.01389,
			0,
			.72222
		],
		"120": [
			0,
			.43056,
			0,
			0,
			.52778
		],
		"121": [
			.19444,
			.43056,
			.01389,
			0,
			.52778
		],
		"122": [
			0,
			.43056,
			0,
			0,
			.44445
		],
		"123": [
			.25,
			.75,
			0,
			0,
			.5
		],
		"124": [
			.25,
			.75,
			0,
			0,
			.27778
		],
		"125": [
			.25,
			.75,
			0,
			0,
			.5
		],
		"126": [
			.35,
			.31786,
			0,
			0,
			.5
		],
		"160": [
			0,
			0,
			0,
			0,
			.25
		],
		"163": [
			0,
			.69444,
			0,
			0,
			.76909
		],
		"167": [
			.19444,
			.69444,
			0,
			0,
			.44445
		],
		"168": [
			0,
			.66786,
			0,
			0,
			.5
		],
		"172": [
			0,
			.43056,
			0,
			0,
			.66667
		],
		"176": [
			0,
			.69444,
			0,
			0,
			.75
		],
		"177": [
			.08333,
			.58333,
			0,
			0,
			.77778
		],
		"182": [
			.19444,
			.69444,
			0,
			0,
			.61111
		],
		"184": [
			.17014,
			0,
			0,
			0,
			.44445
		],
		"198": [
			0,
			.68333,
			0,
			0,
			.90278
		],
		"215": [
			.08333,
			.58333,
			0,
			0,
			.77778
		],
		"216": [
			.04861,
			.73194,
			0,
			0,
			.77778
		],
		"223": [
			0,
			.69444,
			0,
			0,
			.5
		],
		"230": [
			0,
			.43056,
			0,
			0,
			.72222
		],
		"247": [
			.08333,
			.58333,
			0,
			0,
			.77778
		],
		"248": [
			.09722,
			.52778,
			0,
			0,
			.5
		],
		"305": [
			0,
			.43056,
			0,
			0,
			.27778
		],
		"338": [
			0,
			.68333,
			0,
			0,
			1.01389
		],
		"339": [
			0,
			.43056,
			0,
			0,
			.77778
		],
		"567": [
			.19444,
			.43056,
			0,
			0,
			.30556
		],
		"710": [
			0,
			.69444,
			0,
			0,
			.5
		],
		"711": [
			0,
			.62847,
			0,
			0,
			.5
		],
		"713": [
			0,
			.56778,
			0,
			0,
			.5
		],
		"714": [
			0,
			.69444,
			0,
			0,
			.5
		],
		"715": [
			0,
			.69444,
			0,
			0,
			.5
		],
		"728": [
			0,
			.69444,
			0,
			0,
			.5
		],
		"729": [
			0,
			.66786,
			0,
			0,
			.27778
		],
		"730": [
			0,
			.69444,
			0,
			0,
			.75
		],
		"732": [
			0,
			.66786,
			0,
			0,
			.5
		],
		"733": [
			0,
			.69444,
			0,
			0,
			.5
		],
		"915": [
			0,
			.68333,
			0,
			0,
			.625
		],
		"916": [
			0,
			.68333,
			0,
			0,
			.83334
		],
		"920": [
			0,
			.68333,
			0,
			0,
			.77778
		],
		"923": [
			0,
			.68333,
			0,
			0,
			.69445
		],
		"926": [
			0,
			.68333,
			0,
			0,
			.66667
		],
		"928": [
			0,
			.68333,
			0,
			0,
			.75
		],
		"931": [
			0,
			.68333,
			0,
			0,
			.72222
		],
		"933": [
			0,
			.68333,
			0,
			0,
			.77778
		],
		"934": [
			0,
			.68333,
			0,
			0,
			.72222
		],
		"936": [
			0,
			.68333,
			0,
			0,
			.77778
		],
		"937": [
			0,
			.68333,
			0,
			0,
			.72222
		],
		"8211": [
			0,
			.43056,
			.02778,
			0,
			.5
		],
		"8212": [
			0,
			.43056,
			.02778,
			0,
			1
		],
		"8216": [
			0,
			.69444,
			0,
			0,
			.27778
		],
		"8217": [
			0,
			.69444,
			0,
			0,
			.27778
		],
		"8220": [
			0,
			.69444,
			0,
			0,
			.5
		],
		"8221": [
			0,
			.69444,
			0,
			0,
			.5
		],
		"8224": [
			.19444,
			.69444,
			0,
			0,
			.44445
		],
		"8225": [
			.19444,
			.69444,
			0,
			0,
			.44445
		],
		"8230": [
			0,
			.123,
			0,
			0,
			1.172
		],
		"8242": [
			0,
			.55556,
			0,
			0,
			.275
		],
		"8407": [
			0,
			.71444,
			.15382,
			0,
			.5
		],
		"8463": [
			0,
			.68889,
			0,
			0,
			.54028
		],
		"8465": [
			0,
			.69444,
			0,
			0,
			.72222
		],
		"8467": [
			0,
			.69444,
			0,
			.11111,
			.41667
		],
		"8472": [
			.19444,
			.43056,
			0,
			.11111,
			.63646
		],
		"8476": [
			0,
			.69444,
			0,
			0,
			.72222
		],
		"8501": [
			0,
			.69444,
			0,
			0,
			.61111
		],
		"8592": [
			-.13313,
			.36687,
			0,
			0,
			1
		],
		"8593": [
			.19444,
			.69444,
			0,
			0,
			.5
		],
		"8594": [
			-.13313,
			.36687,
			0,
			0,
			1
		],
		"8595": [
			.19444,
			.69444,
			0,
			0,
			.5
		],
		"8596": [
			-.13313,
			.36687,
			0,
			0,
			1
		],
		"8597": [
			.25,
			.75,
			0,
			0,
			.5
		],
		"8598": [
			.19444,
			.69444,
			0,
			0,
			1
		],
		"8599": [
			.19444,
			.69444,
			0,
			0,
			1
		],
		"8600": [
			.19444,
			.69444,
			0,
			0,
			1
		],
		"8601": [
			.19444,
			.69444,
			0,
			0,
			1
		],
		"8614": [
			.011,
			.511,
			0,
			0,
			1
		],
		"8617": [
			.011,
			.511,
			0,
			0,
			1.126
		],
		"8618": [
			.011,
			.511,
			0,
			0,
			1.126
		],
		"8636": [
			-.13313,
			.36687,
			0,
			0,
			1
		],
		"8637": [
			-.13313,
			.36687,
			0,
			0,
			1
		],
		"8640": [
			-.13313,
			.36687,
			0,
			0,
			1
		],
		"8641": [
			-.13313,
			.36687,
			0,
			0,
			1
		],
		"8652": [
			.011,
			.671,
			0,
			0,
			1
		],
		"8656": [
			-.13313,
			.36687,
			0,
			0,
			1
		],
		"8657": [
			.19444,
			.69444,
			0,
			0,
			.61111
		],
		"8658": [
			-.13313,
			.36687,
			0,
			0,
			1
		],
		"8659": [
			.19444,
			.69444,
			0,
			0,
			.61111
		],
		"8660": [
			-.13313,
			.36687,
			0,
			0,
			1
		],
		"8661": [
			.25,
			.75,
			0,
			0,
			.61111
		],
		"8704": [
			0,
			.69444,
			0,
			0,
			.55556
		],
		"8706": [
			0,
			.69444,
			.05556,
			.08334,
			.5309
		],
		"8707": [
			0,
			.69444,
			0,
			0,
			.55556
		],
		"8709": [
			.05556,
			.75,
			0,
			0,
			.5
		],
		"8711": [
			0,
			.68333,
			0,
			0,
			.83334
		],
		"8712": [
			.0391,
			.5391,
			0,
			0,
			.66667
		],
		"8715": [
			.0391,
			.5391,
			0,
			0,
			.66667
		],
		"8722": [
			.08333,
			.58333,
			0,
			0,
			.77778
		],
		"8723": [
			.08333,
			.58333,
			0,
			0,
			.77778
		],
		"8725": [
			.25,
			.75,
			0,
			0,
			.5
		],
		"8726": [
			.25,
			.75,
			0,
			0,
			.5
		],
		"8727": [
			-.03472,
			.46528,
			0,
			0,
			.5
		],
		"8728": [
			-.05555,
			.44445,
			0,
			0,
			.5
		],
		"8729": [
			-.05555,
			.44445,
			0,
			0,
			.5
		],
		"8730": [
			.2,
			.8,
			0,
			0,
			.83334
		],
		"8733": [
			0,
			.43056,
			0,
			0,
			.77778
		],
		"8734": [
			0,
			.43056,
			0,
			0,
			1
		],
		"8736": [
			0,
			.69224,
			0,
			0,
			.72222
		],
		"8739": [
			.25,
			.75,
			0,
			0,
			.27778
		],
		"8741": [
			.25,
			.75,
			0,
			0,
			.5
		],
		"8743": [
			0,
			.55556,
			0,
			0,
			.66667
		],
		"8744": [
			0,
			.55556,
			0,
			0,
			.66667
		],
		"8745": [
			0,
			.55556,
			0,
			0,
			.66667
		],
		"8746": [
			0,
			.55556,
			0,
			0,
			.66667
		],
		"8747": [
			.19444,
			.69444,
			.11111,
			0,
			.41667
		],
		"8764": [
			-.13313,
			.36687,
			0,
			0,
			.77778
		],
		"8768": [
			.19444,
			.69444,
			0,
			0,
			.27778
		],
		"8771": [
			-.03625,
			.46375,
			0,
			0,
			.77778
		],
		"8773": [
			-.022,
			.589,
			0,
			0,
			.778
		],
		"8776": [
			-.01688,
			.48312,
			0,
			0,
			.77778
		],
		"8781": [
			-.03625,
			.46375,
			0,
			0,
			.77778
		],
		"8784": [
			-.133,
			.673,
			0,
			0,
			.778
		],
		"8801": [
			-.03625,
			.46375,
			0,
			0,
			.77778
		],
		"8804": [
			.13597,
			.63597,
			0,
			0,
			.77778
		],
		"8805": [
			.13597,
			.63597,
			0,
			0,
			.77778
		],
		"8810": [
			.0391,
			.5391,
			0,
			0,
			1
		],
		"8811": [
			.0391,
			.5391,
			0,
			0,
			1
		],
		"8826": [
			.0391,
			.5391,
			0,
			0,
			.77778
		],
		"8827": [
			.0391,
			.5391,
			0,
			0,
			.77778
		],
		"8834": [
			.0391,
			.5391,
			0,
			0,
			.77778
		],
		"8835": [
			.0391,
			.5391,
			0,
			0,
			.77778
		],
		"8838": [
			.13597,
			.63597,
			0,
			0,
			.77778
		],
		"8839": [
			.13597,
			.63597,
			0,
			0,
			.77778
		],
		"8846": [
			0,
			.55556,
			0,
			0,
			.66667
		],
		"8849": [
			.13597,
			.63597,
			0,
			0,
			.77778
		],
		"8850": [
			.13597,
			.63597,
			0,
			0,
			.77778
		],
		"8851": [
			0,
			.55556,
			0,
			0,
			.66667
		],
		"8852": [
			0,
			.55556,
			0,
			0,
			.66667
		],
		"8853": [
			.08333,
			.58333,
			0,
			0,
			.77778
		],
		"8854": [
			.08333,
			.58333,
			0,
			0,
			.77778
		],
		"8855": [
			.08333,
			.58333,
			0,
			0,
			.77778
		],
		"8856": [
			.08333,
			.58333,
			0,
			0,
			.77778
		],
		"8857": [
			.08333,
			.58333,
			0,
			0,
			.77778
		],
		"8866": [
			0,
			.69444,
			0,
			0,
			.61111
		],
		"8867": [
			0,
			.69444,
			0,
			0,
			.61111
		],
		"8868": [
			0,
			.69444,
			0,
			0,
			.77778
		],
		"8869": [
			0,
			.69444,
			0,
			0,
			.77778
		],
		"8872": [
			.249,
			.75,
			0,
			0,
			.867
		],
		"8900": [
			-.05555,
			.44445,
			0,
			0,
			.5
		],
		"8901": [
			-.05555,
			.44445,
			0,
			0,
			.27778
		],
		"8902": [
			-.03472,
			.46528,
			0,
			0,
			.5
		],
		"8904": [
			.005,
			.505,
			0,
			0,
			.9
		],
		"8942": [
			.03,
			.903,
			0,
			0,
			.278
		],
		"8943": [
			-.19,
			.313,
			0,
			0,
			1.172
		],
		"8945": [
			-.1,
			.823,
			0,
			0,
			1.282
		],
		"8968": [
			.25,
			.75,
			0,
			0,
			.44445
		],
		"8969": [
			.25,
			.75,
			0,
			0,
			.44445
		],
		"8970": [
			.25,
			.75,
			0,
			0,
			.44445
		],
		"8971": [
			.25,
			.75,
			0,
			0,
			.44445
		],
		"8994": [
			-.14236,
			.35764,
			0,
			0,
			1
		],
		"8995": [
			-.14236,
			.35764,
			0,
			0,
			1
		],
		"9136": [
			.244,
			.744,
			0,
			0,
			.412
		],
		"9137": [
			.244,
			.745,
			0,
			0,
			.412
		],
		"9651": [
			.19444,
			.69444,
			0,
			0,
			.88889
		],
		"9657": [
			-.03472,
			.46528,
			0,
			0,
			.5
		],
		"9661": [
			.19444,
			.69444,
			0,
			0,
			.88889
		],
		"9667": [
			-.03472,
			.46528,
			0,
			0,
			.5
		],
		"9711": [
			.19444,
			.69444,
			0,
			0,
			1
		],
		"9824": [
			.12963,
			.69444,
			0,
			0,
			.77778
		],
		"9825": [
			.12963,
			.69444,
			0,
			0,
			.77778
		],
		"9826": [
			.12963,
			.69444,
			0,
			0,
			.77778
		],
		"9827": [
			.12963,
			.69444,
			0,
			0,
			.77778
		],
		"9837": [
			0,
			.75,
			0,
			0,
			.38889
		],
		"9838": [
			.19444,
			.69444,
			0,
			0,
			.38889
		],
		"9839": [
			.19444,
			.69444,
			0,
			0,
			.38889
		],
		"10216": [
			.25,
			.75,
			0,
			0,
			.38889
		],
		"10217": [
			.25,
			.75,
			0,
			0,
			.38889
		],
		"10222": [
			.244,
			.744,
			0,
			0,
			.412
		],
		"10223": [
			.244,
			.745,
			0,
			0,
			.412
		],
		"10229": [
			.011,
			.511,
			0,
			0,
			1.609
		],
		"10230": [
			.011,
			.511,
			0,
			0,
			1.638
		],
		"10231": [
			.011,
			.511,
			0,
			0,
			1.859
		],
		"10232": [
			.024,
			.525,
			0,
			0,
			1.609
		],
		"10233": [
			.024,
			.525,
			0,
			0,
			1.638
		],
		"10234": [
			.024,
			.525,
			0,
			0,
			1.858
		],
		"10236": [
			.011,
			.511,
			0,
			0,
			1.638
		],
		"10815": [
			0,
			.68333,
			0,
			0,
			.75
		],
		"10927": [
			.13597,
			.63597,
			0,
			0,
			.77778
		],
		"10928": [
			.13597,
			.63597,
			0,
			0,
			.77778
		],
		"57376": [
			.19444,
			.69444,
			0,
			0,
			0
		]
	},
	"Math-BoldItalic": {
		"32": [
			0,
			0,
			0,
			0,
			.25
		],
		"48": [
			0,
			.44444,
			0,
			0,
			.575
		],
		"49": [
			0,
			.44444,
			0,
			0,
			.575
		],
		"50": [
			0,
			.44444,
			0,
			0,
			.575
		],
		"51": [
			.19444,
			.44444,
			0,
			0,
			.575
		],
		"52": [
			.19444,
			.44444,
			0,
			0,
			.575
		],
		"53": [
			.19444,
			.44444,
			0,
			0,
			.575
		],
		"54": [
			0,
			.64444,
			0,
			0,
			.575
		],
		"55": [
			.19444,
			.44444,
			0,
			0,
			.575
		],
		"56": [
			0,
			.64444,
			0,
			0,
			.575
		],
		"57": [
			.19444,
			.44444,
			0,
			0,
			.575
		],
		"65": [
			0,
			.68611,
			0,
			0,
			.86944
		],
		"66": [
			0,
			.68611,
			.04835,
			0,
			.8664
		],
		"67": [
			0,
			.68611,
			.06979,
			0,
			.81694
		],
		"68": [
			0,
			.68611,
			.03194,
			0,
			.93812
		],
		"69": [
			0,
			.68611,
			.05451,
			0,
			.81007
		],
		"70": [
			0,
			.68611,
			.15972,
			0,
			.68889
		],
		"71": [
			0,
			.68611,
			0,
			0,
			.88673
		],
		"72": [
			0,
			.68611,
			.08229,
			0,
			.98229
		],
		"73": [
			0,
			.68611,
			.07778,
			0,
			.51111
		],
		"74": [
			0,
			.68611,
			.10069,
			0,
			.63125
		],
		"75": [
			0,
			.68611,
			.06979,
			0,
			.97118
		],
		"76": [
			0,
			.68611,
			0,
			0,
			.75555
		],
		"77": [
			0,
			.68611,
			.11424,
			0,
			1.14201
		],
		"78": [
			0,
			.68611,
			.11424,
			0,
			.95034
		],
		"79": [
			0,
			.68611,
			.03194,
			0,
			.83666
		],
		"80": [
			0,
			.68611,
			.15972,
			0,
			.72309
		],
		"81": [
			.19444,
			.68611,
			0,
			0,
			.86861
		],
		"82": [
			0,
			.68611,
			.00421,
			0,
			.87235
		],
		"83": [
			0,
			.68611,
			.05382,
			0,
			.69271
		],
		"84": [
			0,
			.68611,
			.15972,
			0,
			.63663
		],
		"85": [
			0,
			.68611,
			.11424,
			0,
			.80027
		],
		"86": [
			0,
			.68611,
			.25555,
			0,
			.67778
		],
		"87": [
			0,
			.68611,
			.15972,
			0,
			1.09305
		],
		"88": [
			0,
			.68611,
			.07778,
			0,
			.94722
		],
		"89": [
			0,
			.68611,
			.25555,
			0,
			.67458
		],
		"90": [
			0,
			.68611,
			.06979,
			0,
			.77257
		],
		"97": [
			0,
			.44444,
			0,
			0,
			.63287
		],
		"98": [
			0,
			.69444,
			0,
			0,
			.52083
		],
		"99": [
			0,
			.44444,
			0,
			0,
			.51342
		],
		"100": [
			0,
			.69444,
			0,
			0,
			.60972
		],
		"101": [
			0,
			.44444,
			0,
			0,
			.55361
		],
		"102": [
			.19444,
			.69444,
			.11042,
			0,
			.56806
		],
		"103": [
			.19444,
			.44444,
			.03704,
			0,
			.5449
		],
		"104": [
			0,
			.69444,
			0,
			0,
			.66759
		],
		"105": [
			0,
			.69326,
			0,
			0,
			.4048
		],
		"106": [
			.19444,
			.69326,
			.0622,
			0,
			.47083
		],
		"107": [
			0,
			.69444,
			.01852,
			0,
			.6037
		],
		"108": [
			0,
			.69444,
			.0088,
			0,
			.34815
		],
		"109": [
			0,
			.44444,
			0,
			0,
			1.0324
		],
		"110": [
			0,
			.44444,
			0,
			0,
			.71296
		],
		"111": [
			0,
			.44444,
			0,
			0,
			.58472
		],
		"112": [
			.19444,
			.44444,
			0,
			0,
			.60092
		],
		"113": [
			.19444,
			.44444,
			.03704,
			0,
			.54213
		],
		"114": [
			0,
			.44444,
			.03194,
			0,
			.5287
		],
		"115": [
			0,
			.44444,
			0,
			0,
			.53125
		],
		"116": [
			0,
			.63492,
			0,
			0,
			.41528
		],
		"117": [
			0,
			.44444,
			0,
			0,
			.68102
		],
		"118": [
			0,
			.44444,
			.03704,
			0,
			.56666
		],
		"119": [
			0,
			.44444,
			.02778,
			0,
			.83148
		],
		"120": [
			0,
			.44444,
			0,
			0,
			.65903
		],
		"121": [
			.19444,
			.44444,
			.03704,
			0,
			.59028
		],
		"122": [
			0,
			.44444,
			.04213,
			0,
			.55509
		],
		"160": [
			0,
			0,
			0,
			0,
			.25
		],
		"915": [
			0,
			.68611,
			.15972,
			0,
			.65694
		],
		"916": [
			0,
			.68611,
			0,
			0,
			.95833
		],
		"920": [
			0,
			.68611,
			.03194,
			0,
			.86722
		],
		"923": [
			0,
			.68611,
			0,
			0,
			.80555
		],
		"926": [
			0,
			.68611,
			.07458,
			0,
			.84125
		],
		"928": [
			0,
			.68611,
			.08229,
			0,
			.98229
		],
		"931": [
			0,
			.68611,
			.05451,
			0,
			.88507
		],
		"933": [
			0,
			.68611,
			.15972,
			0,
			.67083
		],
		"934": [
			0,
			.68611,
			0,
			0,
			.76666
		],
		"936": [
			0,
			.68611,
			.11653,
			0,
			.71402
		],
		"937": [
			0,
			.68611,
			.04835,
			0,
			.8789
		],
		"945": [
			0,
			.44444,
			0,
			0,
			.76064
		],
		"946": [
			.19444,
			.69444,
			.03403,
			0,
			.65972
		],
		"947": [
			.19444,
			.44444,
			.06389,
			0,
			.59003
		],
		"948": [
			0,
			.69444,
			.03819,
			0,
			.52222
		],
		"949": [
			0,
			.44444,
			0,
			0,
			.52882
		],
		"950": [
			.19444,
			.69444,
			.06215,
			0,
			.50833
		],
		"951": [
			.19444,
			.44444,
			.03704,
			0,
			.6
		],
		"952": [
			0,
			.69444,
			.03194,
			0,
			.5618
		],
		"953": [
			0,
			.44444,
			0,
			0,
			.41204
		],
		"954": [
			0,
			.44444,
			0,
			0,
			.66759
		],
		"955": [
			0,
			.69444,
			0,
			0,
			.67083
		],
		"956": [
			.19444,
			.44444,
			0,
			0,
			.70787
		],
		"957": [
			0,
			.44444,
			.06898,
			0,
			.57685
		],
		"958": [
			.19444,
			.69444,
			.03021,
			0,
			.50833
		],
		"959": [
			0,
			.44444,
			0,
			0,
			.58472
		],
		"960": [
			0,
			.44444,
			.03704,
			0,
			.68241
		],
		"961": [
			.19444,
			.44444,
			0,
			0,
			.6118
		],
		"962": [
			.09722,
			.44444,
			.07917,
			0,
			.42361
		],
		"963": [
			0,
			.44444,
			.03704,
			0,
			.68588
		],
		"964": [
			0,
			.44444,
			.13472,
			0,
			.52083
		],
		"965": [
			0,
			.44444,
			.03704,
			0,
			.63055
		],
		"966": [
			.19444,
			.44444,
			0,
			0,
			.74722
		],
		"967": [
			.19444,
			.44444,
			0,
			0,
			.71805
		],
		"968": [
			.19444,
			.69444,
			.03704,
			0,
			.75833
		],
		"969": [
			0,
			.44444,
			.03704,
			0,
			.71782
		],
		"977": [
			0,
			.69444,
			0,
			0,
			.69155
		],
		"981": [
			.19444,
			.69444,
			0,
			0,
			.7125
		],
		"982": [
			0,
			.44444,
			.03194,
			0,
			.975
		],
		"1009": [
			.19444,
			.44444,
			0,
			0,
			.6118
		],
		"1013": [
			0,
			.44444,
			0,
			0,
			.48333
		],
		"57649": [
			0,
			.44444,
			0,
			0,
			.39352
		],
		"57911": [
			.19444,
			.44444,
			0,
			0,
			.43889
		]
	},
	"Math-Italic": {
		"32": [
			0,
			0,
			0,
			0,
			.25
		],
		"48": [
			0,
			.43056,
			0,
			0,
			.5
		],
		"49": [
			0,
			.43056,
			0,
			0,
			.5
		],
		"50": [
			0,
			.43056,
			0,
			0,
			.5
		],
		"51": [
			.19444,
			.43056,
			0,
			0,
			.5
		],
		"52": [
			.19444,
			.43056,
			0,
			0,
			.5
		],
		"53": [
			.19444,
			.43056,
			0,
			0,
			.5
		],
		"54": [
			0,
			.64444,
			0,
			0,
			.5
		],
		"55": [
			.19444,
			.43056,
			0,
			0,
			.5
		],
		"56": [
			0,
			.64444,
			0,
			0,
			.5
		],
		"57": [
			.19444,
			.43056,
			0,
			0,
			.5
		],
		"65": [
			0,
			.68333,
			0,
			.13889,
			.75
		],
		"66": [
			0,
			.68333,
			.05017,
			.08334,
			.75851
		],
		"67": [
			0,
			.68333,
			.07153,
			.08334,
			.71472
		],
		"68": [
			0,
			.68333,
			.02778,
			.05556,
			.82792
		],
		"69": [
			0,
			.68333,
			.05764,
			.08334,
			.7382
		],
		"70": [
			0,
			.68333,
			.13889,
			.08334,
			.64306
		],
		"71": [
			0,
			.68333,
			0,
			.08334,
			.78625
		],
		"72": [
			0,
			.68333,
			.08125,
			.05556,
			.83125
		],
		"73": [
			0,
			.68333,
			.07847,
			.11111,
			.43958
		],
		"74": [
			0,
			.68333,
			.09618,
			.16667,
			.55451
		],
		"75": [
			0,
			.68333,
			.07153,
			.05556,
			.84931
		],
		"76": [
			0,
			.68333,
			0,
			.02778,
			.68056
		],
		"77": [
			0,
			.68333,
			.10903,
			.08334,
			.97014
		],
		"78": [
			0,
			.68333,
			.10903,
			.08334,
			.80347
		],
		"79": [
			0,
			.68333,
			.02778,
			.08334,
			.76278
		],
		"80": [
			0,
			.68333,
			.13889,
			.08334,
			.64201
		],
		"81": [
			.19444,
			.68333,
			0,
			.08334,
			.79056
		],
		"82": [
			0,
			.68333,
			.00773,
			.08334,
			.75929
		],
		"83": [
			0,
			.68333,
			.05764,
			.08334,
			.6132
		],
		"84": [
			0,
			.68333,
			.13889,
			.08334,
			.58438
		],
		"85": [
			0,
			.68333,
			.10903,
			.02778,
			.68278
		],
		"86": [
			0,
			.68333,
			.22222,
			0,
			.58333
		],
		"87": [
			0,
			.68333,
			.13889,
			0,
			.94445
		],
		"88": [
			0,
			.68333,
			.07847,
			.08334,
			.82847
		],
		"89": [
			0,
			.68333,
			.22222,
			0,
			.58056
		],
		"90": [
			0,
			.68333,
			.07153,
			.08334,
			.68264
		],
		"97": [
			0,
			.43056,
			0,
			0,
			.52859
		],
		"98": [
			0,
			.69444,
			0,
			0,
			.42917
		],
		"99": [
			0,
			.43056,
			0,
			.05556,
			.43276
		],
		"100": [
			0,
			.69444,
			0,
			.16667,
			.52049
		],
		"101": [
			0,
			.43056,
			0,
			.05556,
			.46563
		],
		"102": [
			.19444,
			.69444,
			.10764,
			.16667,
			.48959
		],
		"103": [
			.19444,
			.43056,
			.03588,
			.02778,
			.47697
		],
		"104": [
			0,
			.69444,
			0,
			0,
			.57616
		],
		"105": [
			0,
			.65952,
			0,
			0,
			.34451
		],
		"106": [
			.19444,
			.65952,
			.05724,
			0,
			.41181
		],
		"107": [
			0,
			.69444,
			.03148,
			0,
			.5206
		],
		"108": [
			0,
			.69444,
			.01968,
			.08334,
			.29838
		],
		"109": [
			0,
			.43056,
			0,
			0,
			.87801
		],
		"110": [
			0,
			.43056,
			0,
			0,
			.60023
		],
		"111": [
			0,
			.43056,
			0,
			.05556,
			.48472
		],
		"112": [
			.19444,
			.43056,
			0,
			.08334,
			.50313
		],
		"113": [
			.19444,
			.43056,
			.03588,
			.08334,
			.44641
		],
		"114": [
			0,
			.43056,
			.02778,
			.05556,
			.45116
		],
		"115": [
			0,
			.43056,
			0,
			.05556,
			.46875
		],
		"116": [
			0,
			.61508,
			0,
			.08334,
			.36111
		],
		"117": [
			0,
			.43056,
			0,
			.02778,
			.57246
		],
		"118": [
			0,
			.43056,
			.03588,
			.02778,
			.48472
		],
		"119": [
			0,
			.43056,
			.02691,
			.08334,
			.71592
		],
		"120": [
			0,
			.43056,
			0,
			.02778,
			.57153
		],
		"121": [
			.19444,
			.43056,
			.03588,
			.05556,
			.49028
		],
		"122": [
			0,
			.43056,
			.04398,
			.05556,
			.46505
		],
		"160": [
			0,
			0,
			0,
			0,
			.25
		],
		"915": [
			0,
			.68333,
			.13889,
			.08334,
			.61528
		],
		"916": [
			0,
			.68333,
			0,
			.16667,
			.83334
		],
		"920": [
			0,
			.68333,
			.02778,
			.08334,
			.76278
		],
		"923": [
			0,
			.68333,
			0,
			.16667,
			.69445
		],
		"926": [
			0,
			.68333,
			.07569,
			.08334,
			.74236
		],
		"928": [
			0,
			.68333,
			.08125,
			.05556,
			.83125
		],
		"931": [
			0,
			.68333,
			.05764,
			.08334,
			.77986
		],
		"933": [
			0,
			.68333,
			.13889,
			.05556,
			.58333
		],
		"934": [
			0,
			.68333,
			0,
			.08334,
			.66667
		],
		"936": [
			0,
			.68333,
			.11,
			.05556,
			.61222
		],
		"937": [
			0,
			.68333,
			.05017,
			.08334,
			.7724
		],
		"945": [
			0,
			.43056,
			.0037,
			.02778,
			.6397
		],
		"946": [
			.19444,
			.69444,
			.05278,
			.08334,
			.56563
		],
		"947": [
			.19444,
			.43056,
			.05556,
			0,
			.51773
		],
		"948": [
			0,
			.69444,
			.03785,
			.05556,
			.44444
		],
		"949": [
			0,
			.43056,
			0,
			.08334,
			.46632
		],
		"950": [
			.19444,
			.69444,
			.07378,
			.08334,
			.4375
		],
		"951": [
			.19444,
			.43056,
			.03588,
			.05556,
			.49653
		],
		"952": [
			0,
			.69444,
			.02778,
			.08334,
			.46944
		],
		"953": [
			0,
			.43056,
			0,
			.05556,
			.35394
		],
		"954": [
			0,
			.43056,
			0,
			0,
			.57616
		],
		"955": [
			0,
			.69444,
			0,
			0,
			.58334
		],
		"956": [
			.19444,
			.43056,
			0,
			.02778,
			.60255
		],
		"957": [
			0,
			.43056,
			.06366,
			.02778,
			.49398
		],
		"958": [
			.19444,
			.69444,
			.04601,
			.11111,
			.4375
		],
		"959": [
			0,
			.43056,
			0,
			.05556,
			.48472
		],
		"960": [
			0,
			.43056,
			.03588,
			0,
			.57003
		],
		"961": [
			.19444,
			.43056,
			0,
			.08334,
			.51702
		],
		"962": [
			.09722,
			.43056,
			.07986,
			.08334,
			.36285
		],
		"963": [
			0,
			.43056,
			.03588,
			0,
			.57141
		],
		"964": [
			0,
			.43056,
			.1132,
			.02778,
			.43715
		],
		"965": [
			0,
			.43056,
			.03588,
			.02778,
			.54028
		],
		"966": [
			.19444,
			.43056,
			0,
			.08334,
			.65417
		],
		"967": [
			.19444,
			.43056,
			0,
			.05556,
			.62569
		],
		"968": [
			.19444,
			.69444,
			.03588,
			.11111,
			.65139
		],
		"969": [
			0,
			.43056,
			.03588,
			0,
			.62245
		],
		"977": [
			0,
			.69444,
			0,
			.08334,
			.59144
		],
		"981": [
			.19444,
			.69444,
			0,
			.08334,
			.59583
		],
		"982": [
			0,
			.43056,
			.02778,
			0,
			.82813
		],
		"1009": [
			.19444,
			.43056,
			0,
			.08334,
			.51702
		],
		"1013": [
			0,
			.43056,
			0,
			.05556,
			.4059
		],
		"57649": [
			0,
			.43056,
			0,
			.02778,
			.32246
		],
		"57911": [
			.19444,
			.43056,
			0,
			.08334,
			.38403
		]
	},
	"SansSerif-Bold": {
		"32": [
			0,
			0,
			0,
			0,
			.25
		],
		"33": [
			0,
			.69444,
			0,
			0,
			.36667
		],
		"34": [
			0,
			.69444,
			0,
			0,
			.55834
		],
		"35": [
			.19444,
			.69444,
			0,
			0,
			.91667
		],
		"36": [
			.05556,
			.75,
			0,
			0,
			.55
		],
		"37": [
			.05556,
			.75,
			0,
			0,
			1.02912
		],
		"38": [
			0,
			.69444,
			0,
			0,
			.83056
		],
		"39": [
			0,
			.69444,
			0,
			0,
			.30556
		],
		"40": [
			.25,
			.75,
			0,
			0,
			.42778
		],
		"41": [
			.25,
			.75,
			0,
			0,
			.42778
		],
		"42": [
			0,
			.75,
			0,
			0,
			.55
		],
		"43": [
			.11667,
			.61667,
			0,
			0,
			.85556
		],
		"44": [
			.10556,
			.13056,
			0,
			0,
			.30556
		],
		"45": [
			0,
			.45833,
			0,
			0,
			.36667
		],
		"46": [
			0,
			.13056,
			0,
			0,
			.30556
		],
		"47": [
			.25,
			.75,
			0,
			0,
			.55
		],
		"48": [
			0,
			.69444,
			0,
			0,
			.55
		],
		"49": [
			0,
			.69444,
			0,
			0,
			.55
		],
		"50": [
			0,
			.69444,
			0,
			0,
			.55
		],
		"51": [
			0,
			.69444,
			0,
			0,
			.55
		],
		"52": [
			0,
			.69444,
			0,
			0,
			.55
		],
		"53": [
			0,
			.69444,
			0,
			0,
			.55
		],
		"54": [
			0,
			.69444,
			0,
			0,
			.55
		],
		"55": [
			0,
			.69444,
			0,
			0,
			.55
		],
		"56": [
			0,
			.69444,
			0,
			0,
			.55
		],
		"57": [
			0,
			.69444,
			0,
			0,
			.55
		],
		"58": [
			0,
			.45833,
			0,
			0,
			.30556
		],
		"59": [
			.10556,
			.45833,
			0,
			0,
			.30556
		],
		"61": [
			-.09375,
			.40625,
			0,
			0,
			.85556
		],
		"63": [
			0,
			.69444,
			0,
			0,
			.51945
		],
		"64": [
			0,
			.69444,
			0,
			0,
			.73334
		],
		"65": [
			0,
			.69444,
			0,
			0,
			.73334
		],
		"66": [
			0,
			.69444,
			0,
			0,
			.73334
		],
		"67": [
			0,
			.69444,
			0,
			0,
			.70278
		],
		"68": [
			0,
			.69444,
			0,
			0,
			.79445
		],
		"69": [
			0,
			.69444,
			0,
			0,
			.64167
		],
		"70": [
			0,
			.69444,
			0,
			0,
			.61111
		],
		"71": [
			0,
			.69444,
			0,
			0,
			.73334
		],
		"72": [
			0,
			.69444,
			0,
			0,
			.79445
		],
		"73": [
			0,
			.69444,
			0,
			0,
			.33056
		],
		"74": [
			0,
			.69444,
			0,
			0,
			.51945
		],
		"75": [
			0,
			.69444,
			0,
			0,
			.76389
		],
		"76": [
			0,
			.69444,
			0,
			0,
			.58056
		],
		"77": [
			0,
			.69444,
			0,
			0,
			.97778
		],
		"78": [
			0,
			.69444,
			0,
			0,
			.79445
		],
		"79": [
			0,
			.69444,
			0,
			0,
			.79445
		],
		"80": [
			0,
			.69444,
			0,
			0,
			.70278
		],
		"81": [
			.10556,
			.69444,
			0,
			0,
			.79445
		],
		"82": [
			0,
			.69444,
			0,
			0,
			.70278
		],
		"83": [
			0,
			.69444,
			0,
			0,
			.61111
		],
		"84": [
			0,
			.69444,
			0,
			0,
			.73334
		],
		"85": [
			0,
			.69444,
			0,
			0,
			.76389
		],
		"86": [
			0,
			.69444,
			.01528,
			0,
			.73334
		],
		"87": [
			0,
			.69444,
			.01528,
			0,
			1.03889
		],
		"88": [
			0,
			.69444,
			0,
			0,
			.73334
		],
		"89": [
			0,
			.69444,
			.0275,
			0,
			.73334
		],
		"90": [
			0,
			.69444,
			0,
			0,
			.67223
		],
		"91": [
			.25,
			.75,
			0,
			0,
			.34306
		],
		"93": [
			.25,
			.75,
			0,
			0,
			.34306
		],
		"94": [
			0,
			.69444,
			0,
			0,
			.55
		],
		"95": [
			.35,
			.10833,
			.03056,
			0,
			.55
		],
		"97": [
			0,
			.45833,
			0,
			0,
			.525
		],
		"98": [
			0,
			.69444,
			0,
			0,
			.56111
		],
		"99": [
			0,
			.45833,
			0,
			0,
			.48889
		],
		"100": [
			0,
			.69444,
			0,
			0,
			.56111
		],
		"101": [
			0,
			.45833,
			0,
			0,
			.51111
		],
		"102": [
			0,
			.69444,
			.07639,
			0,
			.33611
		],
		"103": [
			.19444,
			.45833,
			.01528,
			0,
			.55
		],
		"104": [
			0,
			.69444,
			0,
			0,
			.56111
		],
		"105": [
			0,
			.69444,
			0,
			0,
			.25556
		],
		"106": [
			.19444,
			.69444,
			0,
			0,
			.28611
		],
		"107": [
			0,
			.69444,
			0,
			0,
			.53056
		],
		"108": [
			0,
			.69444,
			0,
			0,
			.25556
		],
		"109": [
			0,
			.45833,
			0,
			0,
			.86667
		],
		"110": [
			0,
			.45833,
			0,
			0,
			.56111
		],
		"111": [
			0,
			.45833,
			0,
			0,
			.55
		],
		"112": [
			.19444,
			.45833,
			0,
			0,
			.56111
		],
		"113": [
			.19444,
			.45833,
			0,
			0,
			.56111
		],
		"114": [
			0,
			.45833,
			.01528,
			0,
			.37222
		],
		"115": [
			0,
			.45833,
			0,
			0,
			.42167
		],
		"116": [
			0,
			.58929,
			0,
			0,
			.40417
		],
		"117": [
			0,
			.45833,
			0,
			0,
			.56111
		],
		"118": [
			0,
			.45833,
			.01528,
			0,
			.5
		],
		"119": [
			0,
			.45833,
			.01528,
			0,
			.74445
		],
		"120": [
			0,
			.45833,
			0,
			0,
			.5
		],
		"121": [
			.19444,
			.45833,
			.01528,
			0,
			.5
		],
		"122": [
			0,
			.45833,
			0,
			0,
			.47639
		],
		"126": [
			.35,
			.34444,
			0,
			0,
			.55
		],
		"160": [
			0,
			0,
			0,
			0,
			.25
		],
		"168": [
			0,
			.69444,
			0,
			0,
			.55
		],
		"176": [
			0,
			.69444,
			0,
			0,
			.73334
		],
		"180": [
			0,
			.69444,
			0,
			0,
			.55
		],
		"184": [
			.17014,
			0,
			0,
			0,
			.48889
		],
		"305": [
			0,
			.45833,
			0,
			0,
			.25556
		],
		"567": [
			.19444,
			.45833,
			0,
			0,
			.28611
		],
		"710": [
			0,
			.69444,
			0,
			0,
			.55
		],
		"711": [
			0,
			.63542,
			0,
			0,
			.55
		],
		"713": [
			0,
			.63778,
			0,
			0,
			.55
		],
		"728": [
			0,
			.69444,
			0,
			0,
			.55
		],
		"729": [
			0,
			.69444,
			0,
			0,
			.30556
		],
		"730": [
			0,
			.69444,
			0,
			0,
			.73334
		],
		"732": [
			0,
			.69444,
			0,
			0,
			.55
		],
		"733": [
			0,
			.69444,
			0,
			0,
			.55
		],
		"915": [
			0,
			.69444,
			0,
			0,
			.58056
		],
		"916": [
			0,
			.69444,
			0,
			0,
			.91667
		],
		"920": [
			0,
			.69444,
			0,
			0,
			.85556
		],
		"923": [
			0,
			.69444,
			0,
			0,
			.67223
		],
		"926": [
			0,
			.69444,
			0,
			0,
			.73334
		],
		"928": [
			0,
			.69444,
			0,
			0,
			.79445
		],
		"931": [
			0,
			.69444,
			0,
			0,
			.79445
		],
		"933": [
			0,
			.69444,
			0,
			0,
			.85556
		],
		"934": [
			0,
			.69444,
			0,
			0,
			.79445
		],
		"936": [
			0,
			.69444,
			0,
			0,
			.85556
		],
		"937": [
			0,
			.69444,
			0,
			0,
			.79445
		],
		"8211": [
			0,
			.45833,
			.03056,
			0,
			.55
		],
		"8212": [
			0,
			.45833,
			.03056,
			0,
			1.10001
		],
		"8216": [
			0,
			.69444,
			0,
			0,
			.30556
		],
		"8217": [
			0,
			.69444,
			0,
			0,
			.30556
		],
		"8220": [
			0,
			.69444,
			0,
			0,
			.55834
		],
		"8221": [
			0,
			.69444,
			0,
			0,
			.55834
		]
	},
	"SansSerif-Italic": {
		"32": [
			0,
			0,
			0,
			0,
			.25
		],
		"33": [
			0,
			.69444,
			.05733,
			0,
			.31945
		],
		"34": [
			0,
			.69444,
			.00316,
			0,
			.5
		],
		"35": [
			.19444,
			.69444,
			.05087,
			0,
			.83334
		],
		"36": [
			.05556,
			.75,
			.11156,
			0,
			.5
		],
		"37": [
			.05556,
			.75,
			.03126,
			0,
			.83334
		],
		"38": [
			0,
			.69444,
			.03058,
			0,
			.75834
		],
		"39": [
			0,
			.69444,
			.07816,
			0,
			.27778
		],
		"40": [
			.25,
			.75,
			.13164,
			0,
			.38889
		],
		"41": [
			.25,
			.75,
			.02536,
			0,
			.38889
		],
		"42": [
			0,
			.75,
			.11775,
			0,
			.5
		],
		"43": [
			.08333,
			.58333,
			.02536,
			0,
			.77778
		],
		"44": [
			.125,
			.08333,
			0,
			0,
			.27778
		],
		"45": [
			0,
			.44444,
			.01946,
			0,
			.33333
		],
		"46": [
			0,
			.08333,
			0,
			0,
			.27778
		],
		"47": [
			.25,
			.75,
			.13164,
			0,
			.5
		],
		"48": [
			0,
			.65556,
			.11156,
			0,
			.5
		],
		"49": [
			0,
			.65556,
			.11156,
			0,
			.5
		],
		"50": [
			0,
			.65556,
			.11156,
			0,
			.5
		],
		"51": [
			0,
			.65556,
			.11156,
			0,
			.5
		],
		"52": [
			0,
			.65556,
			.11156,
			0,
			.5
		],
		"53": [
			0,
			.65556,
			.11156,
			0,
			.5
		],
		"54": [
			0,
			.65556,
			.11156,
			0,
			.5
		],
		"55": [
			0,
			.65556,
			.11156,
			0,
			.5
		],
		"56": [
			0,
			.65556,
			.11156,
			0,
			.5
		],
		"57": [
			0,
			.65556,
			.11156,
			0,
			.5
		],
		"58": [
			0,
			.44444,
			.02502,
			0,
			.27778
		],
		"59": [
			.125,
			.44444,
			.02502,
			0,
			.27778
		],
		"61": [
			-.13,
			.37,
			.05087,
			0,
			.77778
		],
		"63": [
			0,
			.69444,
			.11809,
			0,
			.47222
		],
		"64": [
			0,
			.69444,
			.07555,
			0,
			.66667
		],
		"65": [
			0,
			.69444,
			0,
			0,
			.66667
		],
		"66": [
			0,
			.69444,
			.08293,
			0,
			.66667
		],
		"67": [
			0,
			.69444,
			.11983,
			0,
			.63889
		],
		"68": [
			0,
			.69444,
			.07555,
			0,
			.72223
		],
		"69": [
			0,
			.69444,
			.11983,
			0,
			.59722
		],
		"70": [
			0,
			.69444,
			.13372,
			0,
			.56945
		],
		"71": [
			0,
			.69444,
			.11983,
			0,
			.66667
		],
		"72": [
			0,
			.69444,
			.08094,
			0,
			.70834
		],
		"73": [
			0,
			.69444,
			.13372,
			0,
			.27778
		],
		"74": [
			0,
			.69444,
			.08094,
			0,
			.47222
		],
		"75": [
			0,
			.69444,
			.11983,
			0,
			.69445
		],
		"76": [
			0,
			.69444,
			0,
			0,
			.54167
		],
		"77": [
			0,
			.69444,
			.08094,
			0,
			.875
		],
		"78": [
			0,
			.69444,
			.08094,
			0,
			.70834
		],
		"79": [
			0,
			.69444,
			.07555,
			0,
			.73611
		],
		"80": [
			0,
			.69444,
			.08293,
			0,
			.63889
		],
		"81": [
			.125,
			.69444,
			.07555,
			0,
			.73611
		],
		"82": [
			0,
			.69444,
			.08293,
			0,
			.64584
		],
		"83": [
			0,
			.69444,
			.09205,
			0,
			.55556
		],
		"84": [
			0,
			.69444,
			.13372,
			0,
			.68056
		],
		"85": [
			0,
			.69444,
			.08094,
			0,
			.6875
		],
		"86": [
			0,
			.69444,
			.1615,
			0,
			.66667
		],
		"87": [
			0,
			.69444,
			.1615,
			0,
			.94445
		],
		"88": [
			0,
			.69444,
			.13372,
			0,
			.66667
		],
		"89": [
			0,
			.69444,
			.17261,
			0,
			.66667
		],
		"90": [
			0,
			.69444,
			.11983,
			0,
			.61111
		],
		"91": [
			.25,
			.75,
			.15942,
			0,
			.28889
		],
		"93": [
			.25,
			.75,
			.08719,
			0,
			.28889
		],
		"94": [
			0,
			.69444,
			.0799,
			0,
			.5
		],
		"95": [
			.35,
			.09444,
			.08616,
			0,
			.5
		],
		"97": [
			0,
			.44444,
			.00981,
			0,
			.48056
		],
		"98": [
			0,
			.69444,
			.03057,
			0,
			.51667
		],
		"99": [
			0,
			.44444,
			.08336,
			0,
			.44445
		],
		"100": [
			0,
			.69444,
			.09483,
			0,
			.51667
		],
		"101": [
			0,
			.44444,
			.06778,
			0,
			.44445
		],
		"102": [
			0,
			.69444,
			.21705,
			0,
			.30556
		],
		"103": [
			.19444,
			.44444,
			.10836,
			0,
			.5
		],
		"104": [
			0,
			.69444,
			.01778,
			0,
			.51667
		],
		"105": [
			0,
			.67937,
			.09718,
			0,
			.23889
		],
		"106": [
			.19444,
			.67937,
			.09162,
			0,
			.26667
		],
		"107": [
			0,
			.69444,
			.08336,
			0,
			.48889
		],
		"108": [
			0,
			.69444,
			.09483,
			0,
			.23889
		],
		"109": [
			0,
			.44444,
			.01778,
			0,
			.79445
		],
		"110": [
			0,
			.44444,
			.01778,
			0,
			.51667
		],
		"111": [
			0,
			.44444,
			.06613,
			0,
			.5
		],
		"112": [
			.19444,
			.44444,
			.0389,
			0,
			.51667
		],
		"113": [
			.19444,
			.44444,
			.04169,
			0,
			.51667
		],
		"114": [
			0,
			.44444,
			.10836,
			0,
			.34167
		],
		"115": [
			0,
			.44444,
			.0778,
			0,
			.38333
		],
		"116": [
			0,
			.57143,
			.07225,
			0,
			.36111
		],
		"117": [
			0,
			.44444,
			.04169,
			0,
			.51667
		],
		"118": [
			0,
			.44444,
			.10836,
			0,
			.46111
		],
		"119": [
			0,
			.44444,
			.10836,
			0,
			.68334
		],
		"120": [
			0,
			.44444,
			.09169,
			0,
			.46111
		],
		"121": [
			.19444,
			.44444,
			.10836,
			0,
			.46111
		],
		"122": [
			0,
			.44444,
			.08752,
			0,
			.43472
		],
		"126": [
			.35,
			.32659,
			.08826,
			0,
			.5
		],
		"160": [
			0,
			0,
			0,
			0,
			.25
		],
		"168": [
			0,
			.67937,
			.06385,
			0,
			.5
		],
		"176": [
			0,
			.69444,
			0,
			0,
			.73752
		],
		"184": [
			.17014,
			0,
			0,
			0,
			.44445
		],
		"305": [
			0,
			.44444,
			.04169,
			0,
			.23889
		],
		"567": [
			.19444,
			.44444,
			.04169,
			0,
			.26667
		],
		"710": [
			0,
			.69444,
			.0799,
			0,
			.5
		],
		"711": [
			0,
			.63194,
			.08432,
			0,
			.5
		],
		"713": [
			0,
			.60889,
			.08776,
			0,
			.5
		],
		"714": [
			0,
			.69444,
			.09205,
			0,
			.5
		],
		"715": [
			0,
			.69444,
			0,
			0,
			.5
		],
		"728": [
			0,
			.69444,
			.09483,
			0,
			.5
		],
		"729": [
			0,
			.67937,
			.07774,
			0,
			.27778
		],
		"730": [
			0,
			.69444,
			0,
			0,
			.73752
		],
		"732": [
			0,
			.67659,
			.08826,
			0,
			.5
		],
		"733": [
			0,
			.69444,
			.09205,
			0,
			.5
		],
		"915": [
			0,
			.69444,
			.13372,
			0,
			.54167
		],
		"916": [
			0,
			.69444,
			0,
			0,
			.83334
		],
		"920": [
			0,
			.69444,
			.07555,
			0,
			.77778
		],
		"923": [
			0,
			.69444,
			0,
			0,
			.61111
		],
		"926": [
			0,
			.69444,
			.12816,
			0,
			.66667
		],
		"928": [
			0,
			.69444,
			.08094,
			0,
			.70834
		],
		"931": [
			0,
			.69444,
			.11983,
			0,
			.72222
		],
		"933": [
			0,
			.69444,
			.09031,
			0,
			.77778
		],
		"934": [
			0,
			.69444,
			.04603,
			0,
			.72222
		],
		"936": [
			0,
			.69444,
			.09031,
			0,
			.77778
		],
		"937": [
			0,
			.69444,
			.08293,
			0,
			.72222
		],
		"8211": [
			0,
			.44444,
			.08616,
			0,
			.5
		],
		"8212": [
			0,
			.44444,
			.08616,
			0,
			1
		],
		"8216": [
			0,
			.69444,
			.07816,
			0,
			.27778
		],
		"8217": [
			0,
			.69444,
			.07816,
			0,
			.27778
		],
		"8220": [
			0,
			.69444,
			.14205,
			0,
			.5
		],
		"8221": [
			0,
			.69444,
			.00316,
			0,
			.5
		]
	},
	"SansSerif-Regular": {
		"32": [
			0,
			0,
			0,
			0,
			.25
		],
		"33": [
			0,
			.69444,
			0,
			0,
			.31945
		],
		"34": [
			0,
			.69444,
			0,
			0,
			.5
		],
		"35": [
			.19444,
			.69444,
			0,
			0,
			.83334
		],
		"36": [
			.05556,
			.75,
			0,
			0,
			.5
		],
		"37": [
			.05556,
			.75,
			0,
			0,
			.83334
		],
		"38": [
			0,
			.69444,
			0,
			0,
			.75834
		],
		"39": [
			0,
			.69444,
			0,
			0,
			.27778
		],
		"40": [
			.25,
			.75,
			0,
			0,
			.38889
		],
		"41": [
			.25,
			.75,
			0,
			0,
			.38889
		],
		"42": [
			0,
			.75,
			0,
			0,
			.5
		],
		"43": [
			.08333,
			.58333,
			0,
			0,
			.77778
		],
		"44": [
			.125,
			.08333,
			0,
			0,
			.27778
		],
		"45": [
			0,
			.44444,
			0,
			0,
			.33333
		],
		"46": [
			0,
			.08333,
			0,
			0,
			.27778
		],
		"47": [
			.25,
			.75,
			0,
			0,
			.5
		],
		"48": [
			0,
			.65556,
			0,
			0,
			.5
		],
		"49": [
			0,
			.65556,
			0,
			0,
			.5
		],
		"50": [
			0,
			.65556,
			0,
			0,
			.5
		],
		"51": [
			0,
			.65556,
			0,
			0,
			.5
		],
		"52": [
			0,
			.65556,
			0,
			0,
			.5
		],
		"53": [
			0,
			.65556,
			0,
			0,
			.5
		],
		"54": [
			0,
			.65556,
			0,
			0,
			.5
		],
		"55": [
			0,
			.65556,
			0,
			0,
			.5
		],
		"56": [
			0,
			.65556,
			0,
			0,
			.5
		],
		"57": [
			0,
			.65556,
			0,
			0,
			.5
		],
		"58": [
			0,
			.44444,
			0,
			0,
			.27778
		],
		"59": [
			.125,
			.44444,
			0,
			0,
			.27778
		],
		"61": [
			-.13,
			.37,
			0,
			0,
			.77778
		],
		"63": [
			0,
			.69444,
			0,
			0,
			.47222
		],
		"64": [
			0,
			.69444,
			0,
			0,
			.66667
		],
		"65": [
			0,
			.69444,
			0,
			0,
			.66667
		],
		"66": [
			0,
			.69444,
			0,
			0,
			.66667
		],
		"67": [
			0,
			.69444,
			0,
			0,
			.63889
		],
		"68": [
			0,
			.69444,
			0,
			0,
			.72223
		],
		"69": [
			0,
			.69444,
			0,
			0,
			.59722
		],
		"70": [
			0,
			.69444,
			0,
			0,
			.56945
		],
		"71": [
			0,
			.69444,
			0,
			0,
			.66667
		],
		"72": [
			0,
			.69444,
			0,
			0,
			.70834
		],
		"73": [
			0,
			.69444,
			0,
			0,
			.27778
		],
		"74": [
			0,
			.69444,
			0,
			0,
			.47222
		],
		"75": [
			0,
			.69444,
			0,
			0,
			.69445
		],
		"76": [
			0,
			.69444,
			0,
			0,
			.54167
		],
		"77": [
			0,
			.69444,
			0,
			0,
			.875
		],
		"78": [
			0,
			.69444,
			0,
			0,
			.70834
		],
		"79": [
			0,
			.69444,
			0,
			0,
			.73611
		],
		"80": [
			0,
			.69444,
			0,
			0,
			.63889
		],
		"81": [
			.125,
			.69444,
			0,
			0,
			.73611
		],
		"82": [
			0,
			.69444,
			0,
			0,
			.64584
		],
		"83": [
			0,
			.69444,
			0,
			0,
			.55556
		],
		"84": [
			0,
			.69444,
			0,
			0,
			.68056
		],
		"85": [
			0,
			.69444,
			0,
			0,
			.6875
		],
		"86": [
			0,
			.69444,
			.01389,
			0,
			.66667
		],
		"87": [
			0,
			.69444,
			.01389,
			0,
			.94445
		],
		"88": [
			0,
			.69444,
			0,
			0,
			.66667
		],
		"89": [
			0,
			.69444,
			.025,
			0,
			.66667
		],
		"90": [
			0,
			.69444,
			0,
			0,
			.61111
		],
		"91": [
			.25,
			.75,
			0,
			0,
			.28889
		],
		"93": [
			.25,
			.75,
			0,
			0,
			.28889
		],
		"94": [
			0,
			.69444,
			0,
			0,
			.5
		],
		"95": [
			.35,
			.09444,
			.02778,
			0,
			.5
		],
		"97": [
			0,
			.44444,
			0,
			0,
			.48056
		],
		"98": [
			0,
			.69444,
			0,
			0,
			.51667
		],
		"99": [
			0,
			.44444,
			0,
			0,
			.44445
		],
		"100": [
			0,
			.69444,
			0,
			0,
			.51667
		],
		"101": [
			0,
			.44444,
			0,
			0,
			.44445
		],
		"102": [
			0,
			.69444,
			.06944,
			0,
			.30556
		],
		"103": [
			.19444,
			.44444,
			.01389,
			0,
			.5
		],
		"104": [
			0,
			.69444,
			0,
			0,
			.51667
		],
		"105": [
			0,
			.67937,
			0,
			0,
			.23889
		],
		"106": [
			.19444,
			.67937,
			0,
			0,
			.26667
		],
		"107": [
			0,
			.69444,
			0,
			0,
			.48889
		],
		"108": [
			0,
			.69444,
			0,
			0,
			.23889
		],
		"109": [
			0,
			.44444,
			0,
			0,
			.79445
		],
		"110": [
			0,
			.44444,
			0,
			0,
			.51667
		],
		"111": [
			0,
			.44444,
			0,
			0,
			.5
		],
		"112": [
			.19444,
			.44444,
			0,
			0,
			.51667
		],
		"113": [
			.19444,
			.44444,
			0,
			0,
			.51667
		],
		"114": [
			0,
			.44444,
			.01389,
			0,
			.34167
		],
		"115": [
			0,
			.44444,
			0,
			0,
			.38333
		],
		"116": [
			0,
			.57143,
			0,
			0,
			.36111
		],
		"117": [
			0,
			.44444,
			0,
			0,
			.51667
		],
		"118": [
			0,
			.44444,
			.01389,
			0,
			.46111
		],
		"119": [
			0,
			.44444,
			.01389,
			0,
			.68334
		],
		"120": [
			0,
			.44444,
			0,
			0,
			.46111
		],
		"121": [
			.19444,
			.44444,
			.01389,
			0,
			.46111
		],
		"122": [
			0,
			.44444,
			0,
			0,
			.43472
		],
		"126": [
			.35,
			.32659,
			0,
			0,
			.5
		],
		"160": [
			0,
			0,
			0,
			0,
			.25
		],
		"168": [
			0,
			.67937,
			0,
			0,
			.5
		],
		"176": [
			0,
			.69444,
			0,
			0,
			.66667
		],
		"184": [
			.17014,
			0,
			0,
			0,
			.44445
		],
		"305": [
			0,
			.44444,
			0,
			0,
			.23889
		],
		"567": [
			.19444,
			.44444,
			0,
			0,
			.26667
		],
		"710": [
			0,
			.69444,
			0,
			0,
			.5
		],
		"711": [
			0,
			.63194,
			0,
			0,
			.5
		],
		"713": [
			0,
			.60889,
			0,
			0,
			.5
		],
		"714": [
			0,
			.69444,
			0,
			0,
			.5
		],
		"715": [
			0,
			.69444,
			0,
			0,
			.5
		],
		"728": [
			0,
			.69444,
			0,
			0,
			.5
		],
		"729": [
			0,
			.67937,
			0,
			0,
			.27778
		],
		"730": [
			0,
			.69444,
			0,
			0,
			.66667
		],
		"732": [
			0,
			.67659,
			0,
			0,
			.5
		],
		"733": [
			0,
			.69444,
			0,
			0,
			.5
		],
		"915": [
			0,
			.69444,
			0,
			0,
			.54167
		],
		"916": [
			0,
			.69444,
			0,
			0,
			.83334
		],
		"920": [
			0,
			.69444,
			0,
			0,
			.77778
		],
		"923": [
			0,
			.69444,
			0,
			0,
			.61111
		],
		"926": [
			0,
			.69444,
			0,
			0,
			.66667
		],
		"928": [
			0,
			.69444,
			0,
			0,
			.70834
		],
		"931": [
			0,
			.69444,
			0,
			0,
			.72222
		],
		"933": [
			0,
			.69444,
			0,
			0,
			.77778
		],
		"934": [
			0,
			.69444,
			0,
			0,
			.72222
		],
		"936": [
			0,
			.69444,
			0,
			0,
			.77778
		],
		"937": [
			0,
			.69444,
			0,
			0,
			.72222
		],
		"8211": [
			0,
			.44444,
			.02778,
			0,
			.5
		],
		"8212": [
			0,
			.44444,
			.02778,
			0,
			1
		],
		"8216": [
			0,
			.69444,
			0,
			0,
			.27778
		],
		"8217": [
			0,
			.69444,
			0,
			0,
			.27778
		],
		"8220": [
			0,
			.69444,
			0,
			0,
			.5
		],
		"8221": [
			0,
			.69444,
			0,
			0,
			.5
		]
	},
	"Script-Regular": {
		"32": [
			0,
			0,
			0,
			0,
			.25
		],
		"65": [
			0,
			.7,
			.22925,
			0,
			.80253
		],
		"66": [
			0,
			.7,
			.04087,
			0,
			.90757
		],
		"67": [
			0,
			.7,
			.1689,
			0,
			.66619
		],
		"68": [
			0,
			.7,
			.09371,
			0,
			.77443
		],
		"69": [
			0,
			.7,
			.18583,
			0,
			.56162
		],
		"70": [
			0,
			.7,
			.13634,
			0,
			.89544
		],
		"71": [
			0,
			.7,
			.17322,
			0,
			.60961
		],
		"72": [
			0,
			.7,
			.29694,
			0,
			.96919
		],
		"73": [
			0,
			.7,
			.19189,
			0,
			.80907
		],
		"74": [
			.27778,
			.7,
			.19189,
			0,
			1.05159
		],
		"75": [
			0,
			.7,
			.31259,
			0,
			.91364
		],
		"76": [
			0,
			.7,
			.19189,
			0,
			.87373
		],
		"77": [
			0,
			.7,
			.15981,
			0,
			1.08031
		],
		"78": [
			0,
			.7,
			.3525,
			0,
			.9015
		],
		"79": [
			0,
			.7,
			.08078,
			0,
			.73787
		],
		"80": [
			0,
			.7,
			.08078,
			0,
			1.01262
		],
		"81": [
			0,
			.7,
			.03305,
			0,
			.88282
		],
		"82": [
			0,
			.7,
			.06259,
			0,
			.85
		],
		"83": [
			0,
			.7,
			.19189,
			0,
			.86767
		],
		"84": [
			0,
			.7,
			.29087,
			0,
			.74697
		],
		"85": [
			0,
			.7,
			.25815,
			0,
			.79996
		],
		"86": [
			0,
			.7,
			.27523,
			0,
			.62204
		],
		"87": [
			0,
			.7,
			.27523,
			0,
			.80532
		],
		"88": [
			0,
			.7,
			.26006,
			0,
			.94445
		],
		"89": [
			0,
			.7,
			.2939,
			0,
			.70961
		],
		"90": [
			0,
			.7,
			.24037,
			0,
			.8212
		],
		"160": [
			0,
			0,
			0,
			0,
			.25
		]
	},
	"Size1-Regular": {
		"32": [
			0,
			0,
			0,
			0,
			.25
		],
		"40": [
			.35001,
			.85,
			0,
			0,
			.45834
		],
		"41": [
			.35001,
			.85,
			0,
			0,
			.45834
		],
		"47": [
			.35001,
			.85,
			0,
			0,
			.57778
		],
		"91": [
			.35001,
			.85,
			0,
			0,
			.41667
		],
		"92": [
			.35001,
			.85,
			0,
			0,
			.57778
		],
		"93": [
			.35001,
			.85,
			0,
			0,
			.41667
		],
		"123": [
			.35001,
			.85,
			0,
			0,
			.58334
		],
		"125": [
			.35001,
			.85,
			0,
			0,
			.58334
		],
		"160": [
			0,
			0,
			0,
			0,
			.25
		],
		"710": [
			0,
			.72222,
			0,
			0,
			.55556
		],
		"732": [
			0,
			.72222,
			0,
			0,
			.55556
		],
		"770": [
			0,
			.72222,
			0,
			0,
			.55556
		],
		"771": [
			0,
			.72222,
			0,
			0,
			.55556
		],
		"8214": [
			-99e-5,
			.601,
			0,
			0,
			.77778
		],
		"8593": [
			1e-5,
			.6,
			0,
			0,
			.66667
		],
		"8595": [
			1e-5,
			.6,
			0,
			0,
			.66667
		],
		"8657": [
			1e-5,
			.6,
			0,
			0,
			.77778
		],
		"8659": [
			1e-5,
			.6,
			0,
			0,
			.77778
		],
		"8719": [
			.25001,
			.75,
			0,
			0,
			.94445
		],
		"8720": [
			.25001,
			.75,
			0,
			0,
			.94445
		],
		"8721": [
			.25001,
			.75,
			0,
			0,
			1.05556
		],
		"8730": [
			.35001,
			.85,
			0,
			0,
			1
		],
		"8739": [
			-.00599,
			.606,
			0,
			0,
			.33333
		],
		"8741": [
			-.00599,
			.606,
			0,
			0,
			.55556
		],
		"8747": [
			.30612,
			.805,
			.19445,
			0,
			.47222
		],
		"8748": [
			.306,
			.805,
			.19445,
			0,
			.47222
		],
		"8749": [
			.306,
			.805,
			.19445,
			0,
			.47222
		],
		"8750": [
			.30612,
			.805,
			.19445,
			0,
			.47222
		],
		"8896": [
			.25001,
			.75,
			0,
			0,
			.83334
		],
		"8897": [
			.25001,
			.75,
			0,
			0,
			.83334
		],
		"8898": [
			.25001,
			.75,
			0,
			0,
			.83334
		],
		"8899": [
			.25001,
			.75,
			0,
			0,
			.83334
		],
		"8968": [
			.35001,
			.85,
			0,
			0,
			.47222
		],
		"8969": [
			.35001,
			.85,
			0,
			0,
			.47222
		],
		"8970": [
			.35001,
			.85,
			0,
			0,
			.47222
		],
		"8971": [
			.35001,
			.85,
			0,
			0,
			.47222
		],
		"9168": [
			-99e-5,
			.601,
			0,
			0,
			.66667
		],
		"10216": [
			.35001,
			.85,
			0,
			0,
			.47222
		],
		"10217": [
			.35001,
			.85,
			0,
			0,
			.47222
		],
		"10752": [
			.25001,
			.75,
			0,
			0,
			1.11111
		],
		"10753": [
			.25001,
			.75,
			0,
			0,
			1.11111
		],
		"10754": [
			.25001,
			.75,
			0,
			0,
			1.11111
		],
		"10756": [
			.25001,
			.75,
			0,
			0,
			.83334
		],
		"10758": [
			.25001,
			.75,
			0,
			0,
			.83334
		]
	},
	"Size2-Regular": {
		"32": [
			0,
			0,
			0,
			0,
			.25
		],
		"40": [
			.65002,
			1.15,
			0,
			0,
			.59722
		],
		"41": [
			.65002,
			1.15,
			0,
			0,
			.59722
		],
		"47": [
			.65002,
			1.15,
			0,
			0,
			.81111
		],
		"91": [
			.65002,
			1.15,
			0,
			0,
			.47222
		],
		"92": [
			.65002,
			1.15,
			0,
			0,
			.81111
		],
		"93": [
			.65002,
			1.15,
			0,
			0,
			.47222
		],
		"123": [
			.65002,
			1.15,
			0,
			0,
			.66667
		],
		"125": [
			.65002,
			1.15,
			0,
			0,
			.66667
		],
		"160": [
			0,
			0,
			0,
			0,
			.25
		],
		"710": [
			0,
			.75,
			0,
			0,
			1
		],
		"732": [
			0,
			.75,
			0,
			0,
			1
		],
		"770": [
			0,
			.75,
			0,
			0,
			1
		],
		"771": [
			0,
			.75,
			0,
			0,
			1
		],
		"8719": [
			.55001,
			1.05,
			0,
			0,
			1.27778
		],
		"8720": [
			.55001,
			1.05,
			0,
			0,
			1.27778
		],
		"8721": [
			.55001,
			1.05,
			0,
			0,
			1.44445
		],
		"8730": [
			.65002,
			1.15,
			0,
			0,
			1
		],
		"8747": [
			.86225,
			1.36,
			.44445,
			0,
			.55556
		],
		"8748": [
			.862,
			1.36,
			.44445,
			0,
			.55556
		],
		"8749": [
			.862,
			1.36,
			.44445,
			0,
			.55556
		],
		"8750": [
			.86225,
			1.36,
			.44445,
			0,
			.55556
		],
		"8896": [
			.55001,
			1.05,
			0,
			0,
			1.11111
		],
		"8897": [
			.55001,
			1.05,
			0,
			0,
			1.11111
		],
		"8898": [
			.55001,
			1.05,
			0,
			0,
			1.11111
		],
		"8899": [
			.55001,
			1.05,
			0,
			0,
			1.11111
		],
		"8968": [
			.65002,
			1.15,
			0,
			0,
			.52778
		],
		"8969": [
			.65002,
			1.15,
			0,
			0,
			.52778
		],
		"8970": [
			.65002,
			1.15,
			0,
			0,
			.52778
		],
		"8971": [
			.65002,
			1.15,
			0,
			0,
			.52778
		],
		"10216": [
			.65002,
			1.15,
			0,
			0,
			.61111
		],
		"10217": [
			.65002,
			1.15,
			0,
			0,
			.61111
		],
		"10752": [
			.55001,
			1.05,
			0,
			0,
			1.51112
		],
		"10753": [
			.55001,
			1.05,
			0,
			0,
			1.51112
		],
		"10754": [
			.55001,
			1.05,
			0,
			0,
			1.51112
		],
		"10756": [
			.55001,
			1.05,
			0,
			0,
			1.11111
		],
		"10758": [
			.55001,
			1.05,
			0,
			0,
			1.11111
		]
	},
	"Size3-Regular": {
		"32": [
			0,
			0,
			0,
			0,
			.25
		],
		"40": [
			.95003,
			1.45,
			0,
			0,
			.73611
		],
		"41": [
			.95003,
			1.45,
			0,
			0,
			.73611
		],
		"47": [
			.95003,
			1.45,
			0,
			0,
			1.04445
		],
		"91": [
			.95003,
			1.45,
			0,
			0,
			.52778
		],
		"92": [
			.95003,
			1.45,
			0,
			0,
			1.04445
		],
		"93": [
			.95003,
			1.45,
			0,
			0,
			.52778
		],
		"123": [
			.95003,
			1.45,
			0,
			0,
			.75
		],
		"125": [
			.95003,
			1.45,
			0,
			0,
			.75
		],
		"160": [
			0,
			0,
			0,
			0,
			.25
		],
		"710": [
			0,
			.75,
			0,
			0,
			1.44445
		],
		"732": [
			0,
			.75,
			0,
			0,
			1.44445
		],
		"770": [
			0,
			.75,
			0,
			0,
			1.44445
		],
		"771": [
			0,
			.75,
			0,
			0,
			1.44445
		],
		"8730": [
			.95003,
			1.45,
			0,
			0,
			1
		],
		"8968": [
			.95003,
			1.45,
			0,
			0,
			.58334
		],
		"8969": [
			.95003,
			1.45,
			0,
			0,
			.58334
		],
		"8970": [
			.95003,
			1.45,
			0,
			0,
			.58334
		],
		"8971": [
			.95003,
			1.45,
			0,
			0,
			.58334
		],
		"10216": [
			.95003,
			1.45,
			0,
			0,
			.75
		],
		"10217": [
			.95003,
			1.45,
			0,
			0,
			.75
		]
	},
	"Size4-Regular": {
		"32": [
			0,
			0,
			0,
			0,
			.25
		],
		"40": [
			1.25003,
			1.75,
			0,
			0,
			.79167
		],
		"41": [
			1.25003,
			1.75,
			0,
			0,
			.79167
		],
		"47": [
			1.25003,
			1.75,
			0,
			0,
			1.27778
		],
		"91": [
			1.25003,
			1.75,
			0,
			0,
			.58334
		],
		"92": [
			1.25003,
			1.75,
			0,
			0,
			1.27778
		],
		"93": [
			1.25003,
			1.75,
			0,
			0,
			.58334
		],
		"123": [
			1.25003,
			1.75,
			0,
			0,
			.80556
		],
		"125": [
			1.25003,
			1.75,
			0,
			0,
			.80556
		],
		"160": [
			0,
			0,
			0,
			0,
			.25
		],
		"710": [
			0,
			.825,
			0,
			0,
			1.8889
		],
		"732": [
			0,
			.825,
			0,
			0,
			1.8889
		],
		"770": [
			0,
			.825,
			0,
			0,
			1.8889
		],
		"771": [
			0,
			.825,
			0,
			0,
			1.8889
		],
		"8730": [
			1.25003,
			1.75,
			0,
			0,
			1
		],
		"8968": [
			1.25003,
			1.75,
			0,
			0,
			.63889
		],
		"8969": [
			1.25003,
			1.75,
			0,
			0,
			.63889
		],
		"8970": [
			1.25003,
			1.75,
			0,
			0,
			.63889
		],
		"8971": [
			1.25003,
			1.75,
			0,
			0,
			.63889
		],
		"9115": [
			.64502,
			1.155,
			0,
			0,
			.875
		],
		"9116": [
			1e-5,
			.6,
			0,
			0,
			.875
		],
		"9117": [
			.64502,
			1.155,
			0,
			0,
			.875
		],
		"9118": [
			.64502,
			1.155,
			0,
			0,
			.875
		],
		"9119": [
			1e-5,
			.6,
			0,
			0,
			.875
		],
		"9120": [
			.64502,
			1.155,
			0,
			0,
			.875
		],
		"9121": [
			.64502,
			1.155,
			0,
			0,
			.66667
		],
		"9122": [
			-99e-5,
			.601,
			0,
			0,
			.66667
		],
		"9123": [
			.64502,
			1.155,
			0,
			0,
			.66667
		],
		"9124": [
			.64502,
			1.155,
			0,
			0,
			.66667
		],
		"9125": [
			-99e-5,
			.601,
			0,
			0,
			.66667
		],
		"9126": [
			.64502,
			1.155,
			0,
			0,
			.66667
		],
		"9127": [
			1e-5,
			.9,
			0,
			0,
			.88889
		],
		"9128": [
			.65002,
			1.15,
			0,
			0,
			.88889
		],
		"9129": [
			.90001,
			0,
			0,
			0,
			.88889
		],
		"9130": [
			0,
			.3,
			0,
			0,
			.88889
		],
		"9131": [
			1e-5,
			.9,
			0,
			0,
			.88889
		],
		"9132": [
			.65002,
			1.15,
			0,
			0,
			.88889
		],
		"9133": [
			.90001,
			0,
			0,
			0,
			.88889
		],
		"9143": [
			.88502,
			.915,
			0,
			0,
			1.05556
		],
		"10216": [
			1.25003,
			1.75,
			0,
			0,
			.80556
		],
		"10217": [
			1.25003,
			1.75,
			0,
			0,
			.80556
		],
		"57344": [
			-.00499,
			.605,
			0,
			0,
			1.05556
		],
		"57345": [
			-.00499,
			.605,
			0,
			0,
			1.05556
		],
		"57680": [
			0,
			.12,
			0,
			0,
			.45
		],
		"57681": [
			0,
			.12,
			0,
			0,
			.45
		],
		"57682": [
			0,
			.12,
			0,
			0,
			.45
		],
		"57683": [
			0,
			.12,
			0,
			0,
			.45
		]
	},
	"Typewriter-Regular": {
		"32": [
			0,
			0,
			0,
			0,
			.525
		],
		"33": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"34": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"35": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"36": [
			.08333,
			.69444,
			0,
			0,
			.525
		],
		"37": [
			.08333,
			.69444,
			0,
			0,
			.525
		],
		"38": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"39": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"40": [
			.08333,
			.69444,
			0,
			0,
			.525
		],
		"41": [
			.08333,
			.69444,
			0,
			0,
			.525
		],
		"42": [
			0,
			.52083,
			0,
			0,
			.525
		],
		"43": [
			-.08056,
			.53055,
			0,
			0,
			.525
		],
		"44": [
			.13889,
			.125,
			0,
			0,
			.525
		],
		"45": [
			-.08056,
			.53055,
			0,
			0,
			.525
		],
		"46": [
			0,
			.125,
			0,
			0,
			.525
		],
		"47": [
			.08333,
			.69444,
			0,
			0,
			.525
		],
		"48": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"49": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"50": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"51": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"52": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"53": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"54": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"55": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"56": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"57": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"58": [
			0,
			.43056,
			0,
			0,
			.525
		],
		"59": [
			.13889,
			.43056,
			0,
			0,
			.525
		],
		"60": [
			-.05556,
			.55556,
			0,
			0,
			.525
		],
		"61": [
			-.19549,
			.41562,
			0,
			0,
			.525
		],
		"62": [
			-.05556,
			.55556,
			0,
			0,
			.525
		],
		"63": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"64": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"65": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"66": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"67": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"68": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"69": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"70": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"71": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"72": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"73": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"74": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"75": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"76": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"77": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"78": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"79": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"80": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"81": [
			.13889,
			.61111,
			0,
			0,
			.525
		],
		"82": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"83": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"84": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"85": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"86": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"87": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"88": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"89": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"90": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"91": [
			.08333,
			.69444,
			0,
			0,
			.525
		],
		"92": [
			.08333,
			.69444,
			0,
			0,
			.525
		],
		"93": [
			.08333,
			.69444,
			0,
			0,
			.525
		],
		"94": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"95": [
			.09514,
			0,
			0,
			0,
			.525
		],
		"96": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"97": [
			0,
			.43056,
			0,
			0,
			.525
		],
		"98": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"99": [
			0,
			.43056,
			0,
			0,
			.525
		],
		"100": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"101": [
			0,
			.43056,
			0,
			0,
			.525
		],
		"102": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"103": [
			.22222,
			.43056,
			0,
			0,
			.525
		],
		"104": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"105": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"106": [
			.22222,
			.61111,
			0,
			0,
			.525
		],
		"107": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"108": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"109": [
			0,
			.43056,
			0,
			0,
			.525
		],
		"110": [
			0,
			.43056,
			0,
			0,
			.525
		],
		"111": [
			0,
			.43056,
			0,
			0,
			.525
		],
		"112": [
			.22222,
			.43056,
			0,
			0,
			.525
		],
		"113": [
			.22222,
			.43056,
			0,
			0,
			.525
		],
		"114": [
			0,
			.43056,
			0,
			0,
			.525
		],
		"115": [
			0,
			.43056,
			0,
			0,
			.525
		],
		"116": [
			0,
			.55358,
			0,
			0,
			.525
		],
		"117": [
			0,
			.43056,
			0,
			0,
			.525
		],
		"118": [
			0,
			.43056,
			0,
			0,
			.525
		],
		"119": [
			0,
			.43056,
			0,
			0,
			.525
		],
		"120": [
			0,
			.43056,
			0,
			0,
			.525
		],
		"121": [
			.22222,
			.43056,
			0,
			0,
			.525
		],
		"122": [
			0,
			.43056,
			0,
			0,
			.525
		],
		"123": [
			.08333,
			.69444,
			0,
			0,
			.525
		],
		"124": [
			.08333,
			.69444,
			0,
			0,
			.525
		],
		"125": [
			.08333,
			.69444,
			0,
			0,
			.525
		],
		"126": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"127": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"160": [
			0,
			0,
			0,
			0,
			.525
		],
		"176": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"184": [
			.19445,
			0,
			0,
			0,
			.525
		],
		"305": [
			0,
			.43056,
			0,
			0,
			.525
		],
		"567": [
			.22222,
			.43056,
			0,
			0,
			.525
		],
		"711": [
			0,
			.56597,
			0,
			0,
			.525
		],
		"713": [
			0,
			.56555,
			0,
			0,
			.525
		],
		"714": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"715": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"728": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"730": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"770": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"771": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"776": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"915": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"916": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"920": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"923": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"926": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"928": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"931": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"933": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"934": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"936": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"937": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"8216": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"8217": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"8242": [
			0,
			.61111,
			0,
			0,
			.525
		],
		"9251": [
			.11111,
			.21944,
			0,
			0,
			.525
		]
	}
};
/**
* This file contains metrics regarding fonts and individual symbols. The sigma
* and xi variables, as well as the metricMap map contain data extracted from
* TeX, TeX font metrics, and the TTF files. These data are then exposed via the
* `metrics` variable and the getCharacterMetrics function.
*/
var sigmasAndXis = {
	slant: [
		.25,
		.25,
		.25
	],
	space: [
		0,
		0,
		0
	],
	stretch: [
		0,
		0,
		0
	],
	shrink: [
		0,
		0,
		0
	],
	xHeight: [
		.431,
		.431,
		.431
	],
	quad: [
		1,
		1.171,
		1.472
	],
	extraSpace: [
		0,
		0,
		0
	],
	num1: [
		.677,
		.732,
		.925
	],
	num2: [
		.394,
		.384,
		.387
	],
	num3: [
		.444,
		.471,
		.504
	],
	denom1: [
		.686,
		.752,
		1.025
	],
	denom2: [
		.345,
		.344,
		.532
	],
	sup1: [
		.413,
		.503,
		.504
	],
	sup2: [
		.363,
		.431,
		.404
	],
	sup3: [
		.289,
		.286,
		.294
	],
	sub1: [
		.15,
		.143,
		.2
	],
	sub2: [
		.247,
		.286,
		.4
	],
	supDrop: [
		.386,
		.353,
		.494
	],
	subDrop: [
		.05,
		.071,
		.1
	],
	delim1: [
		2.39,
		1.7,
		1.98
	],
	delim2: [
		1.01,
		1.157,
		1.42
	],
	axisHeight: [
		.25,
		.25,
		.25
	],
	defaultRuleThickness: [
		.04,
		.049,
		.049
	],
	bigOpSpacing1: [
		.111,
		.111,
		.111
	],
	bigOpSpacing2: [
		.166,
		.166,
		.166
	],
	bigOpSpacing3: [
		.2,
		.2,
		.2
	],
	bigOpSpacing4: [
		.6,
		.611,
		.611
	],
	bigOpSpacing5: [
		.1,
		.143,
		.143
	],
	sqrtRuleThickness: [
		.04,
		.04,
		.04
	],
	ptPerEm: [
		10,
		10,
		10
	],
	doubleRuleSep: [
		.2,
		.2,
		.2
	],
	arrayRuleWidth: [
		.04,
		.04,
		.04
	],
	fboxsep: [
		.3,
		.3,
		.3
	],
	fboxrule: [
		.04,
		.04,
		.04
	]
};
var extraCharacterMap = {
	"Å": "A",
	"Ð": "D",
	"Þ": "o",
	"å": "a",
	"ð": "d",
	"þ": "o",
	"А": "A",
	"Б": "B",
	"В": "B",
	"Г": "F",
	"Д": "A",
	"Е": "E",
	"Ж": "K",
	"З": "3",
	"И": "N",
	"Й": "N",
	"К": "K",
	"Л": "N",
	"М": "M",
	"Н": "H",
	"О": "O",
	"П": "N",
	"Р": "P",
	"С": "C",
	"Т": "T",
	"У": "y",
	"Ф": "O",
	"Х": "X",
	"Ц": "U",
	"Ч": "h",
	"Ш": "W",
	"Щ": "W",
	"Ъ": "B",
	"Ы": "X",
	"Ь": "B",
	"Э": "3",
	"Ю": "X",
	"Я": "R",
	"а": "a",
	"б": "b",
	"в": "a",
	"г": "r",
	"д": "y",
	"е": "e",
	"ж": "m",
	"з": "e",
	"и": "n",
	"й": "n",
	"к": "n",
	"л": "n",
	"м": "m",
	"н": "n",
	"о": "o",
	"п": "n",
	"р": "p",
	"с": "c",
	"т": "o",
	"у": "y",
	"ф": "b",
	"х": "x",
	"ц": "n",
	"ч": "n",
	"ш": "w",
	"щ": "w",
	"ъ": "a",
	"ы": "m",
	"ь": "a",
	"э": "e",
	"ю": "m",
	"я": "r"
};
/**
* This function adds new font metrics to default metricMap
* It can also override existing metrics
*/
function setFontMetrics(fontName, metrics) {
	fontMetricsData[fontName] = metrics;
}
/**
* This function is a convenience function for looking up information in the
* metricMap table. It takes a character as a string, and a font.
*
* Note: the `width` property may be undefined if fontMetricsData.js wasn't
* built using `Make extended_metrics`.
*/
function getCharacterMetrics(character, font, mode) {
	if (!fontMetricsData[font]) throw new Error("Font metrics not found for font: " + font + ".");
	var ch = character.charCodeAt(0);
	var metrics = fontMetricsData[font][ch];
	if (!metrics && character[0] in extraCharacterMap) {
		ch = extraCharacterMap[character[0]].charCodeAt(0);
		metrics = fontMetricsData[font][ch];
	}
	if (!metrics && mode === "text") {
		if (supportedCodepoint(ch)) metrics = fontMetricsData[font][77];
	}
	if (metrics) return {
		depth: metrics[0],
		height: metrics[1],
		italic: metrics[2],
		skew: metrics[3],
		width: metrics[4]
	};
}
var fontMetricsBySizeIndex = {};
/**
* Get the font metrics for a given size.
*/
function getGlobalMetrics(size) {
	var sizeIndex;
	if (size >= 5) sizeIndex = 0;
	else if (size >= 3) sizeIndex = 1;
	else sizeIndex = 2;
	if (!fontMetricsBySizeIndex[sizeIndex]) {
		var metrics = fontMetricsBySizeIndex[sizeIndex] = { cssEmPerMu: sigmasAndXis.quad[sizeIndex] / 18 };
		for (var key in sigmasAndXis) if (sigmasAndXis.hasOwnProperty(key)) metrics[key] = sigmasAndXis[key][sizeIndex];
	}
	return fontMetricsBySizeIndex[sizeIndex];
}
/**
* This file holds a list of all no-argument functions and single-character
* symbols (like 'a' or ';').
*
* For each of the symbols, there are three properties they can have:
* - font (required): the font to be used for this symbol. Either "main" (the
normal font), or "ams" (the ams fonts).
* - group (required): the ParseNode group type the symbol should have (i.e.
"textord", "mathord", etc).
See https://github.com/KaTeX/KaTeX/wiki/Examining-TeX#group-types
* - replace: the character that this symbol or function should be
*   replaced with (i.e. "\phi" has a replace value of "\u03d5", the phi
*   character in the main font).
*
* The outermost map in the table indicates what mode the symbols should be
* accepted in (e.g. "math" or "text").
*/
var symbols = {
	"math": {},
	"text": {}
};
/** `acceptUnicodeChar = true` is only applicable if `replace` is set. */
function defineSymbol(mode, font, group, replace, name, acceptUnicodeChar) {
	symbols[mode][name] = {
		font,
		group,
		replace
	};
	if (acceptUnicodeChar && replace) symbols[mode][replace] = symbols[mode][name];
}
var math$1 = "math";
var text = "text";
var main = "main";
var ams = "ams";
var accent = "accent-token";
var bin = "bin";
var close = "close";
var inner = "inner";
var mathord = "mathord";
var op = "op-token";
var open = "open";
var punct = "punct";
var rel = "rel";
var spacing = "spacing";
var textord = "textord";
defineSymbol(math$1, main, rel, "≡", "\\equiv", true);
defineSymbol(math$1, main, rel, "≺", "\\prec", true);
defineSymbol(math$1, main, rel, "≻", "\\succ", true);
defineSymbol(math$1, main, rel, "∼", "\\sim", true);
defineSymbol(math$1, main, rel, "⊥", "\\perp");
defineSymbol(math$1, main, rel, "⪯", "\\preceq", true);
defineSymbol(math$1, main, rel, "⪰", "\\succeq", true);
defineSymbol(math$1, main, rel, "≃", "\\simeq", true);
defineSymbol(math$1, main, rel, "∣", "\\mid", true);
defineSymbol(math$1, main, rel, "≪", "\\ll", true);
defineSymbol(math$1, main, rel, "≫", "\\gg", true);
defineSymbol(math$1, main, rel, "≍", "\\asymp", true);
defineSymbol(math$1, main, rel, "∥", "\\parallel");
defineSymbol(math$1, main, rel, "⋈", "\\bowtie", true);
defineSymbol(math$1, main, rel, "⌣", "\\smile", true);
defineSymbol(math$1, main, rel, "⊑", "\\sqsubseteq", true);
defineSymbol(math$1, main, rel, "⊒", "\\sqsupseteq", true);
defineSymbol(math$1, main, rel, "≐", "\\doteq", true);
defineSymbol(math$1, main, rel, "⌢", "\\frown", true);
defineSymbol(math$1, main, rel, "∋", "\\ni", true);
defineSymbol(math$1, main, rel, "∝", "\\propto", true);
defineSymbol(math$1, main, rel, "⊢", "\\vdash", true);
defineSymbol(math$1, main, rel, "⊣", "\\dashv", true);
defineSymbol(math$1, main, rel, "∋", "\\owns");
defineSymbol(math$1, main, punct, ".", "\\ldotp");
defineSymbol(math$1, main, punct, "⋅", "\\cdotp");
defineSymbol(math$1, main, punct, "⋅", "·");
defineSymbol(text, main, textord, "⋅", "·");
defineSymbol(math$1, main, textord, "#", "\\#");
defineSymbol(text, main, textord, "#", "\\#");
defineSymbol(math$1, main, textord, "&", "\\&");
defineSymbol(text, main, textord, "&", "\\&");
defineSymbol(math$1, main, textord, "ℵ", "\\aleph", true);
defineSymbol(math$1, main, textord, "∀", "\\forall", true);
defineSymbol(math$1, main, textord, "ℏ", "\\hbar", true);
defineSymbol(math$1, main, textord, "∃", "\\exists", true);
defineSymbol(math$1, main, textord, "∇", "\\nabla", true);
defineSymbol(math$1, main, textord, "♭", "\\flat", true);
defineSymbol(math$1, main, textord, "ℓ", "\\ell", true);
defineSymbol(math$1, main, textord, "♮", "\\natural", true);
defineSymbol(math$1, main, textord, "♣", "\\clubsuit", true);
defineSymbol(math$1, main, textord, "℘", "\\wp", true);
defineSymbol(math$1, main, textord, "♯", "\\sharp", true);
defineSymbol(math$1, main, textord, "♢", "\\diamondsuit", true);
defineSymbol(math$1, main, textord, "ℜ", "\\Re", true);
defineSymbol(math$1, main, textord, "♡", "\\heartsuit", true);
defineSymbol(math$1, main, textord, "ℑ", "\\Im", true);
defineSymbol(math$1, main, textord, "♠", "\\spadesuit", true);
defineSymbol(math$1, main, textord, "§", "\\S", true);
defineSymbol(text, main, textord, "§", "\\S");
defineSymbol(math$1, main, textord, "¶", "\\P", true);
defineSymbol(text, main, textord, "¶", "\\P");
defineSymbol(math$1, main, textord, "†", "\\dag");
defineSymbol(text, main, textord, "†", "\\dag");
defineSymbol(text, main, textord, "†", "\\textdagger");
defineSymbol(math$1, main, textord, "‡", "\\ddag");
defineSymbol(text, main, textord, "‡", "\\ddag");
defineSymbol(text, main, textord, "‡", "\\textdaggerdbl");
defineSymbol(math$1, main, close, "⎱", "\\rmoustache", true);
defineSymbol(math$1, main, open, "⎰", "\\lmoustache", true);
defineSymbol(math$1, main, close, "⟯", "\\rgroup", true);
defineSymbol(math$1, main, open, "⟮", "\\lgroup", true);
defineSymbol(math$1, main, bin, "∓", "\\mp", true);
defineSymbol(math$1, main, bin, "⊖", "\\ominus", true);
defineSymbol(math$1, main, bin, "⊎", "\\uplus", true);
defineSymbol(math$1, main, bin, "⊓", "\\sqcap", true);
defineSymbol(math$1, main, bin, "∗", "\\ast");
defineSymbol(math$1, main, bin, "⊔", "\\sqcup", true);
defineSymbol(math$1, main, bin, "◯", "\\bigcirc", true);
defineSymbol(math$1, main, bin, "∙", "\\bullet", true);
defineSymbol(math$1, main, bin, "‡", "\\ddagger");
defineSymbol(math$1, main, bin, "≀", "\\wr", true);
defineSymbol(math$1, main, bin, "⨿", "\\amalg");
defineSymbol(math$1, main, bin, "&", "\\And");
defineSymbol(math$1, main, rel, "⟵", "\\longleftarrow", true);
defineSymbol(math$1, main, rel, "⇐", "\\Leftarrow", true);
defineSymbol(math$1, main, rel, "⟸", "\\Longleftarrow", true);
defineSymbol(math$1, main, rel, "⟶", "\\longrightarrow", true);
defineSymbol(math$1, main, rel, "⇒", "\\Rightarrow", true);
defineSymbol(math$1, main, rel, "⟹", "\\Longrightarrow", true);
defineSymbol(math$1, main, rel, "↔", "\\leftrightarrow", true);
defineSymbol(math$1, main, rel, "⟷", "\\longleftrightarrow", true);
defineSymbol(math$1, main, rel, "⇔", "\\Leftrightarrow", true);
defineSymbol(math$1, main, rel, "⟺", "\\Longleftrightarrow", true);
defineSymbol(math$1, main, rel, "↦", "\\mapsto", true);
defineSymbol(math$1, main, rel, "⟼", "\\longmapsto", true);
defineSymbol(math$1, main, rel, "↗", "\\nearrow", true);
defineSymbol(math$1, main, rel, "↩", "\\hookleftarrow", true);
defineSymbol(math$1, main, rel, "↪", "\\hookrightarrow", true);
defineSymbol(math$1, main, rel, "↘", "\\searrow", true);
defineSymbol(math$1, main, rel, "↼", "\\leftharpoonup", true);
defineSymbol(math$1, main, rel, "⇀", "\\rightharpoonup", true);
defineSymbol(math$1, main, rel, "↙", "\\swarrow", true);
defineSymbol(math$1, main, rel, "↽", "\\leftharpoondown", true);
defineSymbol(math$1, main, rel, "⇁", "\\rightharpoondown", true);
defineSymbol(math$1, main, rel, "↖", "\\nwarrow", true);
defineSymbol(math$1, main, rel, "⇌", "\\rightleftharpoons", true);
defineSymbol(math$1, ams, rel, "≮", "\\nless", true);
defineSymbol(math$1, ams, rel, "", "\\@nleqslant");
defineSymbol(math$1, ams, rel, "", "\\@nleqq");
defineSymbol(math$1, ams, rel, "⪇", "\\lneq", true);
defineSymbol(math$1, ams, rel, "≨", "\\lneqq", true);
defineSymbol(math$1, ams, rel, "", "\\@lvertneqq");
defineSymbol(math$1, ams, rel, "⋦", "\\lnsim", true);
defineSymbol(math$1, ams, rel, "⪉", "\\lnapprox", true);
defineSymbol(math$1, ams, rel, "⊀", "\\nprec", true);
defineSymbol(math$1, ams, rel, "⋠", "\\npreceq", true);
defineSymbol(math$1, ams, rel, "⋨", "\\precnsim", true);
defineSymbol(math$1, ams, rel, "⪹", "\\precnapprox", true);
defineSymbol(math$1, ams, rel, "≁", "\\nsim", true);
defineSymbol(math$1, ams, rel, "", "\\@nshortmid");
defineSymbol(math$1, ams, rel, "∤", "\\nmid", true);
defineSymbol(math$1, ams, rel, "⊬", "\\nvdash", true);
defineSymbol(math$1, ams, rel, "⊭", "\\nvDash", true);
defineSymbol(math$1, ams, rel, "⋪", "\\ntriangleleft");
defineSymbol(math$1, ams, rel, "⋬", "\\ntrianglelefteq", true);
defineSymbol(math$1, ams, rel, "⊊", "\\subsetneq", true);
defineSymbol(math$1, ams, rel, "", "\\@varsubsetneq");
defineSymbol(math$1, ams, rel, "⫋", "\\subsetneqq", true);
defineSymbol(math$1, ams, rel, "", "\\@varsubsetneqq");
defineSymbol(math$1, ams, rel, "≯", "\\ngtr", true);
defineSymbol(math$1, ams, rel, "", "\\@ngeqslant");
defineSymbol(math$1, ams, rel, "", "\\@ngeqq");
defineSymbol(math$1, ams, rel, "⪈", "\\gneq", true);
defineSymbol(math$1, ams, rel, "≩", "\\gneqq", true);
defineSymbol(math$1, ams, rel, "", "\\@gvertneqq");
defineSymbol(math$1, ams, rel, "⋧", "\\gnsim", true);
defineSymbol(math$1, ams, rel, "⪊", "\\gnapprox", true);
defineSymbol(math$1, ams, rel, "⊁", "\\nsucc", true);
defineSymbol(math$1, ams, rel, "⋡", "\\nsucceq", true);
defineSymbol(math$1, ams, rel, "⋩", "\\succnsim", true);
defineSymbol(math$1, ams, rel, "⪺", "\\succnapprox", true);
defineSymbol(math$1, ams, rel, "≆", "\\ncong", true);
defineSymbol(math$1, ams, rel, "", "\\@nshortparallel");
defineSymbol(math$1, ams, rel, "∦", "\\nparallel", true);
defineSymbol(math$1, ams, rel, "⊯", "\\nVDash", true);
defineSymbol(math$1, ams, rel, "⋫", "\\ntriangleright");
defineSymbol(math$1, ams, rel, "⋭", "\\ntrianglerighteq", true);
defineSymbol(math$1, ams, rel, "", "\\@nsupseteqq");
defineSymbol(math$1, ams, rel, "⊋", "\\supsetneq", true);
defineSymbol(math$1, ams, rel, "", "\\@varsupsetneq");
defineSymbol(math$1, ams, rel, "⫌", "\\supsetneqq", true);
defineSymbol(math$1, ams, rel, "", "\\@varsupsetneqq");
defineSymbol(math$1, ams, rel, "⊮", "\\nVdash", true);
defineSymbol(math$1, ams, rel, "⪵", "\\precneqq", true);
defineSymbol(math$1, ams, rel, "⪶", "\\succneqq", true);
defineSymbol(math$1, ams, rel, "", "\\@nsubseteqq");
defineSymbol(math$1, ams, bin, "⊴", "\\unlhd");
defineSymbol(math$1, ams, bin, "⊵", "\\unrhd");
defineSymbol(math$1, ams, rel, "↚", "\\nleftarrow", true);
defineSymbol(math$1, ams, rel, "↛", "\\nrightarrow", true);
defineSymbol(math$1, ams, rel, "⇍", "\\nLeftarrow", true);
defineSymbol(math$1, ams, rel, "⇏", "\\nRightarrow", true);
defineSymbol(math$1, ams, rel, "↮", "\\nleftrightarrow", true);
defineSymbol(math$1, ams, rel, "⇎", "\\nLeftrightarrow", true);
defineSymbol(math$1, ams, rel, "△", "\\vartriangle");
defineSymbol(math$1, ams, textord, "ℏ", "\\hslash");
defineSymbol(math$1, ams, textord, "▽", "\\triangledown");
defineSymbol(math$1, ams, textord, "◊", "\\lozenge");
defineSymbol(math$1, ams, textord, "Ⓢ", "\\circledS");
defineSymbol(math$1, ams, textord, "®", "\\circledR");
defineSymbol(text, ams, textord, "®", "\\circledR");
defineSymbol(math$1, ams, textord, "∡", "\\measuredangle", true);
defineSymbol(math$1, ams, textord, "∄", "\\nexists");
defineSymbol(math$1, ams, textord, "℧", "\\mho");
defineSymbol(math$1, ams, textord, "Ⅎ", "\\Finv", true);
defineSymbol(math$1, ams, textord, "⅁", "\\Game", true);
defineSymbol(math$1, ams, textord, "‵", "\\backprime");
defineSymbol(math$1, ams, textord, "▲", "\\blacktriangle");
defineSymbol(math$1, ams, textord, "▼", "\\blacktriangledown");
defineSymbol(math$1, ams, textord, "■", "\\blacksquare");
defineSymbol(math$1, ams, textord, "⧫", "\\blacklozenge");
defineSymbol(math$1, ams, textord, "★", "\\bigstar");
defineSymbol(math$1, ams, textord, "∢", "\\sphericalangle", true);
defineSymbol(math$1, ams, textord, "∁", "\\complement", true);
defineSymbol(math$1, ams, textord, "ð", "\\eth", true);
defineSymbol(text, main, textord, "ð", "ð");
defineSymbol(math$1, ams, textord, "╱", "\\diagup");
defineSymbol(math$1, ams, textord, "╲", "\\diagdown");
defineSymbol(math$1, ams, textord, "□", "\\square");
defineSymbol(math$1, ams, textord, "□", "\\Box");
defineSymbol(math$1, ams, textord, "◊", "\\Diamond");
defineSymbol(math$1, ams, textord, "¥", "\\yen", true);
defineSymbol(text, ams, textord, "¥", "\\yen", true);
defineSymbol(math$1, ams, textord, "✓", "\\checkmark", true);
defineSymbol(text, ams, textord, "✓", "\\checkmark");
defineSymbol(math$1, ams, textord, "ℶ", "\\beth", true);
defineSymbol(math$1, ams, textord, "ℸ", "\\daleth", true);
defineSymbol(math$1, ams, textord, "ℷ", "\\gimel", true);
defineSymbol(math$1, ams, textord, "ϝ", "\\digamma", true);
defineSymbol(math$1, ams, textord, "ϰ", "\\varkappa");
defineSymbol(math$1, ams, open, "┌", "\\@ulcorner", true);
defineSymbol(math$1, ams, close, "┐", "\\@urcorner", true);
defineSymbol(math$1, ams, open, "└", "\\@llcorner", true);
defineSymbol(math$1, ams, close, "┘", "\\@lrcorner", true);
defineSymbol(math$1, ams, rel, "≦", "\\leqq", true);
defineSymbol(math$1, ams, rel, "⩽", "\\leqslant", true);
defineSymbol(math$1, ams, rel, "⪕", "\\eqslantless", true);
defineSymbol(math$1, ams, rel, "≲", "\\lesssim", true);
defineSymbol(math$1, ams, rel, "⪅", "\\lessapprox", true);
defineSymbol(math$1, ams, rel, "≊", "\\approxeq", true);
defineSymbol(math$1, ams, bin, "⋖", "\\lessdot");
defineSymbol(math$1, ams, rel, "⋘", "\\lll", true);
defineSymbol(math$1, ams, rel, "≶", "\\lessgtr", true);
defineSymbol(math$1, ams, rel, "⋚", "\\lesseqgtr", true);
defineSymbol(math$1, ams, rel, "⪋", "\\lesseqqgtr", true);
defineSymbol(math$1, ams, rel, "≑", "\\doteqdot");
defineSymbol(math$1, ams, rel, "≓", "\\risingdotseq", true);
defineSymbol(math$1, ams, rel, "≒", "\\fallingdotseq", true);
defineSymbol(math$1, ams, rel, "∽", "\\backsim", true);
defineSymbol(math$1, ams, rel, "⋍", "\\backsimeq", true);
defineSymbol(math$1, ams, rel, "⫅", "\\subseteqq", true);
defineSymbol(math$1, ams, rel, "⋐", "\\Subset", true);
defineSymbol(math$1, ams, rel, "⊏", "\\sqsubset", true);
defineSymbol(math$1, ams, rel, "≼", "\\preccurlyeq", true);
defineSymbol(math$1, ams, rel, "⋞", "\\curlyeqprec", true);
defineSymbol(math$1, ams, rel, "≾", "\\precsim", true);
defineSymbol(math$1, ams, rel, "⪷", "\\precapprox", true);
defineSymbol(math$1, ams, rel, "⊲", "\\vartriangleleft");
defineSymbol(math$1, ams, rel, "⊴", "\\trianglelefteq");
defineSymbol(math$1, ams, rel, "⊨", "\\vDash", true);
defineSymbol(math$1, ams, rel, "⊪", "\\Vvdash", true);
defineSymbol(math$1, ams, rel, "⌣", "\\smallsmile");
defineSymbol(math$1, ams, rel, "⌢", "\\smallfrown");
defineSymbol(math$1, ams, rel, "≏", "\\bumpeq", true);
defineSymbol(math$1, ams, rel, "≎", "\\Bumpeq", true);
defineSymbol(math$1, ams, rel, "≧", "\\geqq", true);
defineSymbol(math$1, ams, rel, "⩾", "\\geqslant", true);
defineSymbol(math$1, ams, rel, "⪖", "\\eqslantgtr", true);
defineSymbol(math$1, ams, rel, "≳", "\\gtrsim", true);
defineSymbol(math$1, ams, rel, "⪆", "\\gtrapprox", true);
defineSymbol(math$1, ams, bin, "⋗", "\\gtrdot");
defineSymbol(math$1, ams, rel, "⋙", "\\ggg", true);
defineSymbol(math$1, ams, rel, "≷", "\\gtrless", true);
defineSymbol(math$1, ams, rel, "⋛", "\\gtreqless", true);
defineSymbol(math$1, ams, rel, "⪌", "\\gtreqqless", true);
defineSymbol(math$1, ams, rel, "≖", "\\eqcirc", true);
defineSymbol(math$1, ams, rel, "≗", "\\circeq", true);
defineSymbol(math$1, ams, rel, "≜", "\\triangleq", true);
defineSymbol(math$1, ams, rel, "∼", "\\thicksim");
defineSymbol(math$1, ams, rel, "≈", "\\thickapprox");
defineSymbol(math$1, ams, rel, "⫆", "\\supseteqq", true);
defineSymbol(math$1, ams, rel, "⋑", "\\Supset", true);
defineSymbol(math$1, ams, rel, "⊐", "\\sqsupset", true);
defineSymbol(math$1, ams, rel, "≽", "\\succcurlyeq", true);
defineSymbol(math$1, ams, rel, "⋟", "\\curlyeqsucc", true);
defineSymbol(math$1, ams, rel, "≿", "\\succsim", true);
defineSymbol(math$1, ams, rel, "⪸", "\\succapprox", true);
defineSymbol(math$1, ams, rel, "⊳", "\\vartriangleright");
defineSymbol(math$1, ams, rel, "⊵", "\\trianglerighteq");
defineSymbol(math$1, ams, rel, "⊩", "\\Vdash", true);
defineSymbol(math$1, ams, rel, "∣", "\\shortmid");
defineSymbol(math$1, ams, rel, "∥", "\\shortparallel");
defineSymbol(math$1, ams, rel, "≬", "\\between", true);
defineSymbol(math$1, ams, rel, "⋔", "\\pitchfork", true);
defineSymbol(math$1, ams, rel, "∝", "\\varpropto");
defineSymbol(math$1, ams, rel, "◀", "\\blacktriangleleft");
defineSymbol(math$1, ams, rel, "∴", "\\therefore", true);
defineSymbol(math$1, ams, rel, "∍", "\\backepsilon");
defineSymbol(math$1, ams, rel, "▶", "\\blacktriangleright");
defineSymbol(math$1, ams, rel, "∵", "\\because", true);
defineSymbol(math$1, ams, rel, "⋘", "\\llless");
defineSymbol(math$1, ams, rel, "⋙", "\\gggtr");
defineSymbol(math$1, ams, bin, "⊲", "\\lhd");
defineSymbol(math$1, ams, bin, "⊳", "\\rhd");
defineSymbol(math$1, ams, rel, "≂", "\\eqsim", true);
defineSymbol(math$1, main, rel, "⋈", "\\Join");
defineSymbol(math$1, ams, rel, "≑", "\\Doteq", true);
defineSymbol(math$1, ams, bin, "∔", "\\dotplus", true);
defineSymbol(math$1, ams, bin, "∖", "\\smallsetminus");
defineSymbol(math$1, ams, bin, "⋒", "\\Cap", true);
defineSymbol(math$1, ams, bin, "⋓", "\\Cup", true);
defineSymbol(math$1, ams, bin, "⩞", "\\doublebarwedge", true);
defineSymbol(math$1, ams, bin, "⊟", "\\boxminus", true);
defineSymbol(math$1, ams, bin, "⊞", "\\boxplus", true);
defineSymbol(math$1, ams, bin, "⋇", "\\divideontimes", true);
defineSymbol(math$1, ams, bin, "⋉", "\\ltimes", true);
defineSymbol(math$1, ams, bin, "⋊", "\\rtimes", true);
defineSymbol(math$1, ams, bin, "⋋", "\\leftthreetimes", true);
defineSymbol(math$1, ams, bin, "⋌", "\\rightthreetimes", true);
defineSymbol(math$1, ams, bin, "⋏", "\\curlywedge", true);
defineSymbol(math$1, ams, bin, "⋎", "\\curlyvee", true);
defineSymbol(math$1, ams, bin, "⊝", "\\circleddash", true);
defineSymbol(math$1, ams, bin, "⊛", "\\circledast", true);
defineSymbol(math$1, ams, bin, "⋅", "\\centerdot");
defineSymbol(math$1, ams, bin, "⊺", "\\intercal", true);
defineSymbol(math$1, ams, bin, "⋒", "\\doublecap");
defineSymbol(math$1, ams, bin, "⋓", "\\doublecup");
defineSymbol(math$1, ams, bin, "⊠", "\\boxtimes", true);
defineSymbol(math$1, ams, rel, "⇢", "\\dashrightarrow", true);
defineSymbol(math$1, ams, rel, "⇠", "\\dashleftarrow", true);
defineSymbol(math$1, ams, rel, "⇇", "\\leftleftarrows", true);
defineSymbol(math$1, ams, rel, "⇆", "\\leftrightarrows", true);
defineSymbol(math$1, ams, rel, "⇚", "\\Lleftarrow", true);
defineSymbol(math$1, ams, rel, "↞", "\\twoheadleftarrow", true);
defineSymbol(math$1, ams, rel, "↢", "\\leftarrowtail", true);
defineSymbol(math$1, ams, rel, "↫", "\\looparrowleft", true);
defineSymbol(math$1, ams, rel, "⇋", "\\leftrightharpoons", true);
defineSymbol(math$1, ams, rel, "↶", "\\curvearrowleft", true);
defineSymbol(math$1, ams, rel, "↺", "\\circlearrowleft", true);
defineSymbol(math$1, ams, rel, "↰", "\\Lsh", true);
defineSymbol(math$1, ams, rel, "⇈", "\\upuparrows", true);
defineSymbol(math$1, ams, rel, "↿", "\\upharpoonleft", true);
defineSymbol(math$1, ams, rel, "⇃", "\\downharpoonleft", true);
defineSymbol(math$1, main, rel, "⊶", "\\origof", true);
defineSymbol(math$1, main, rel, "⊷", "\\imageof", true);
defineSymbol(math$1, ams, rel, "⊸", "\\multimap", true);
defineSymbol(math$1, ams, rel, "↭", "\\leftrightsquigarrow", true);
defineSymbol(math$1, ams, rel, "⇉", "\\rightrightarrows", true);
defineSymbol(math$1, ams, rel, "⇄", "\\rightleftarrows", true);
defineSymbol(math$1, ams, rel, "↠", "\\twoheadrightarrow", true);
defineSymbol(math$1, ams, rel, "↣", "\\rightarrowtail", true);
defineSymbol(math$1, ams, rel, "↬", "\\looparrowright", true);
defineSymbol(math$1, ams, rel, "↷", "\\curvearrowright", true);
defineSymbol(math$1, ams, rel, "↻", "\\circlearrowright", true);
defineSymbol(math$1, ams, rel, "↱", "\\Rsh", true);
defineSymbol(math$1, ams, rel, "⇊", "\\downdownarrows", true);
defineSymbol(math$1, ams, rel, "↾", "\\upharpoonright", true);
defineSymbol(math$1, ams, rel, "⇂", "\\downharpoonright", true);
defineSymbol(math$1, ams, rel, "⇝", "\\rightsquigarrow", true);
defineSymbol(math$1, ams, rel, "⇝", "\\leadsto");
defineSymbol(math$1, ams, rel, "⇛", "\\Rrightarrow", true);
defineSymbol(math$1, ams, rel, "↾", "\\restriction");
defineSymbol(math$1, main, textord, "‘", "`");
defineSymbol(math$1, main, textord, "$", "\\$");
defineSymbol(text, main, textord, "$", "\\$");
defineSymbol(text, main, textord, "$", "\\textdollar");
defineSymbol(math$1, main, textord, "%", "\\%");
defineSymbol(text, main, textord, "%", "\\%");
defineSymbol(math$1, main, textord, "_", "\\_");
defineSymbol(text, main, textord, "_", "\\_");
defineSymbol(text, main, textord, "_", "\\textunderscore");
defineSymbol(math$1, main, textord, "∠", "\\angle", true);
defineSymbol(math$1, main, textord, "∞", "\\infty", true);
defineSymbol(math$1, main, textord, "′", "\\prime");
defineSymbol(math$1, main, textord, "△", "\\triangle");
defineSymbol(math$1, main, textord, "Γ", "\\Gamma", true);
defineSymbol(math$1, main, textord, "Δ", "\\Delta", true);
defineSymbol(math$1, main, textord, "Θ", "\\Theta", true);
defineSymbol(math$1, main, textord, "Λ", "\\Lambda", true);
defineSymbol(math$1, main, textord, "Ξ", "\\Xi", true);
defineSymbol(math$1, main, textord, "Π", "\\Pi", true);
defineSymbol(math$1, main, textord, "Σ", "\\Sigma", true);
defineSymbol(math$1, main, textord, "Υ", "\\Upsilon", true);
defineSymbol(math$1, main, textord, "Φ", "\\Phi", true);
defineSymbol(math$1, main, textord, "Ψ", "\\Psi", true);
defineSymbol(math$1, main, textord, "Ω", "\\Omega", true);
defineSymbol(math$1, main, textord, "A", "Α");
defineSymbol(math$1, main, textord, "B", "Β");
defineSymbol(math$1, main, textord, "E", "Ε");
defineSymbol(math$1, main, textord, "Z", "Ζ");
defineSymbol(math$1, main, textord, "H", "Η");
defineSymbol(math$1, main, textord, "I", "Ι");
defineSymbol(math$1, main, textord, "K", "Κ");
defineSymbol(math$1, main, textord, "M", "Μ");
defineSymbol(math$1, main, textord, "N", "Ν");
defineSymbol(math$1, main, textord, "O", "Ο");
defineSymbol(math$1, main, textord, "P", "Ρ");
defineSymbol(math$1, main, textord, "T", "Τ");
defineSymbol(math$1, main, textord, "X", "Χ");
defineSymbol(math$1, main, textord, "¬", "\\neg", true);
defineSymbol(math$1, main, textord, "¬", "\\lnot");
defineSymbol(math$1, main, textord, "⊤", "\\top");
defineSymbol(math$1, main, textord, "⊥", "\\bot");
defineSymbol(math$1, main, textord, "∅", "\\emptyset");
defineSymbol(math$1, ams, textord, "∅", "\\varnothing");
defineSymbol(math$1, main, mathord, "α", "\\alpha", true);
defineSymbol(math$1, main, mathord, "β", "\\beta", true);
defineSymbol(math$1, main, mathord, "γ", "\\gamma", true);
defineSymbol(math$1, main, mathord, "δ", "\\delta", true);
defineSymbol(math$1, main, mathord, "ϵ", "\\epsilon", true);
defineSymbol(math$1, main, mathord, "ζ", "\\zeta", true);
defineSymbol(math$1, main, mathord, "η", "\\eta", true);
defineSymbol(math$1, main, mathord, "θ", "\\theta", true);
defineSymbol(math$1, main, mathord, "ι", "\\iota", true);
defineSymbol(math$1, main, mathord, "κ", "\\kappa", true);
defineSymbol(math$1, main, mathord, "λ", "\\lambda", true);
defineSymbol(math$1, main, mathord, "μ", "\\mu", true);
defineSymbol(math$1, main, mathord, "ν", "\\nu", true);
defineSymbol(math$1, main, mathord, "ξ", "\\xi", true);
defineSymbol(math$1, main, mathord, "ο", "\\omicron", true);
defineSymbol(math$1, main, mathord, "π", "\\pi", true);
defineSymbol(math$1, main, mathord, "ρ", "\\rho", true);
defineSymbol(math$1, main, mathord, "σ", "\\sigma", true);
defineSymbol(math$1, main, mathord, "τ", "\\tau", true);
defineSymbol(math$1, main, mathord, "υ", "\\upsilon", true);
defineSymbol(math$1, main, mathord, "ϕ", "\\phi", true);
defineSymbol(math$1, main, mathord, "χ", "\\chi", true);
defineSymbol(math$1, main, mathord, "ψ", "\\psi", true);
defineSymbol(math$1, main, mathord, "ω", "\\omega", true);
defineSymbol(math$1, main, mathord, "ε", "\\varepsilon", true);
defineSymbol(math$1, main, mathord, "ϑ", "\\vartheta", true);
defineSymbol(math$1, main, mathord, "ϖ", "\\varpi", true);
defineSymbol(math$1, main, mathord, "ϱ", "\\varrho", true);
defineSymbol(math$1, main, mathord, "ς", "\\varsigma", true);
defineSymbol(math$1, main, mathord, "φ", "\\varphi", true);
defineSymbol(math$1, main, bin, "∗", "*", true);
defineSymbol(math$1, main, bin, "+", "+");
defineSymbol(math$1, main, bin, "−", "-", true);
defineSymbol(math$1, main, bin, "⋅", "\\cdot", true);
defineSymbol(math$1, main, bin, "∘", "\\circ", true);
defineSymbol(math$1, main, bin, "÷", "\\div", true);
defineSymbol(math$1, main, bin, "±", "\\pm", true);
defineSymbol(math$1, main, bin, "×", "\\times", true);
defineSymbol(math$1, main, bin, "∩", "\\cap", true);
defineSymbol(math$1, main, bin, "∪", "\\cup", true);
defineSymbol(math$1, main, bin, "∖", "\\setminus", true);
defineSymbol(math$1, main, bin, "∧", "\\land");
defineSymbol(math$1, main, bin, "∨", "\\lor");
defineSymbol(math$1, main, bin, "∧", "\\wedge", true);
defineSymbol(math$1, main, bin, "∨", "\\vee", true);
defineSymbol(math$1, main, textord, "√", "\\surd");
defineSymbol(math$1, main, open, "⟨", "\\langle", true);
defineSymbol(math$1, main, open, "∣", "\\lvert");
defineSymbol(math$1, main, open, "∥", "\\lVert");
defineSymbol(math$1, main, close, "?", "?");
defineSymbol(math$1, main, close, "!", "!");
defineSymbol(math$1, main, close, "⟩", "\\rangle", true);
defineSymbol(math$1, main, close, "∣", "\\rvert");
defineSymbol(math$1, main, close, "∥", "\\rVert");
defineSymbol(math$1, main, rel, "=", "=");
defineSymbol(math$1, main, rel, ":", ":");
defineSymbol(math$1, main, rel, "≈", "\\approx", true);
defineSymbol(math$1, main, rel, "≅", "\\cong", true);
defineSymbol(math$1, main, rel, "≥", "\\ge");
defineSymbol(math$1, main, rel, "≥", "\\geq", true);
defineSymbol(math$1, main, rel, "←", "\\gets");
defineSymbol(math$1, main, rel, ">", "\\gt", true);
defineSymbol(math$1, main, rel, "∈", "\\in", true);
defineSymbol(math$1, main, rel, "", "\\@not");
defineSymbol(math$1, main, rel, "⊂", "\\subset", true);
defineSymbol(math$1, main, rel, "⊃", "\\supset", true);
defineSymbol(math$1, main, rel, "⊆", "\\subseteq", true);
defineSymbol(math$1, main, rel, "⊇", "\\supseteq", true);
defineSymbol(math$1, ams, rel, "⊈", "\\nsubseteq", true);
defineSymbol(math$1, ams, rel, "⊉", "\\nsupseteq", true);
defineSymbol(math$1, main, rel, "⊨", "\\models");
defineSymbol(math$1, main, rel, "←", "\\leftarrow", true);
defineSymbol(math$1, main, rel, "≤", "\\le");
defineSymbol(math$1, main, rel, "≤", "\\leq", true);
defineSymbol(math$1, main, rel, "<", "\\lt", true);
defineSymbol(math$1, main, rel, "→", "\\rightarrow", true);
defineSymbol(math$1, main, rel, "→", "\\to");
defineSymbol(math$1, ams, rel, "≱", "\\ngeq", true);
defineSymbol(math$1, ams, rel, "≰", "\\nleq", true);
defineSymbol(math$1, main, spacing, "\xA0", "\\ ");
defineSymbol(math$1, main, spacing, "\xA0", "\\space");
defineSymbol(math$1, main, spacing, "\xA0", "\\nobreakspace");
defineSymbol(text, main, spacing, "\xA0", "\\ ");
defineSymbol(text, main, spacing, "\xA0", " ");
defineSymbol(text, main, spacing, "\xA0", "\\space");
defineSymbol(text, main, spacing, "\xA0", "\\nobreakspace");
defineSymbol(math$1, main, spacing, "", "\\nobreak");
defineSymbol(math$1, main, spacing, "", "\\allowbreak");
defineSymbol(math$1, main, punct, ",", ",");
defineSymbol(math$1, main, punct, ";", ";");
defineSymbol(math$1, ams, bin, "⊼", "\\barwedge", true);
defineSymbol(math$1, ams, bin, "⊻", "\\veebar", true);
defineSymbol(math$1, main, bin, "⊙", "\\odot", true);
defineSymbol(math$1, main, bin, "⊕", "\\oplus", true);
defineSymbol(math$1, main, bin, "⊗", "\\otimes", true);
defineSymbol(math$1, main, textord, "∂", "\\partial", true);
defineSymbol(math$1, main, bin, "⊘", "\\oslash", true);
defineSymbol(math$1, ams, bin, "⊚", "\\circledcirc", true);
defineSymbol(math$1, ams, bin, "⊡", "\\boxdot", true);
defineSymbol(math$1, main, bin, "△", "\\bigtriangleup");
defineSymbol(math$1, main, bin, "▽", "\\bigtriangledown");
defineSymbol(math$1, main, bin, "†", "\\dagger");
defineSymbol(math$1, main, bin, "⋄", "\\diamond");
defineSymbol(math$1, main, bin, "⋆", "\\star");
defineSymbol(math$1, main, bin, "◃", "\\triangleleft");
defineSymbol(math$1, main, bin, "▹", "\\triangleright");
defineSymbol(math$1, main, open, "{", "\\{");
defineSymbol(text, main, textord, "{", "\\{");
defineSymbol(text, main, textord, "{", "\\textbraceleft");
defineSymbol(math$1, main, close, "}", "\\}");
defineSymbol(text, main, textord, "}", "\\}");
defineSymbol(text, main, textord, "}", "\\textbraceright");
defineSymbol(math$1, main, open, "{", "\\lbrace");
defineSymbol(math$1, main, close, "}", "\\rbrace");
defineSymbol(math$1, main, open, "[", "\\lbrack", true);
defineSymbol(text, main, textord, "[", "\\lbrack", true);
defineSymbol(math$1, main, close, "]", "\\rbrack", true);
defineSymbol(text, main, textord, "]", "\\rbrack", true);
defineSymbol(math$1, main, open, "(", "\\lparen", true);
defineSymbol(math$1, main, close, ")", "\\rparen", true);
defineSymbol(text, main, textord, "<", "\\textless", true);
defineSymbol(text, main, textord, ">", "\\textgreater", true);
defineSymbol(math$1, main, open, "⌊", "\\lfloor", true);
defineSymbol(math$1, main, close, "⌋", "\\rfloor", true);
defineSymbol(math$1, main, open, "⌈", "\\lceil", true);
defineSymbol(math$1, main, close, "⌉", "\\rceil", true);
defineSymbol(math$1, main, textord, "\\", "\\backslash");
defineSymbol(math$1, main, textord, "∣", "|");
defineSymbol(math$1, main, textord, "∣", "\\vert");
defineSymbol(text, main, textord, "|", "\\textbar", true);
defineSymbol(math$1, main, textord, "∥", "\\|");
defineSymbol(math$1, main, textord, "∥", "\\Vert");
defineSymbol(text, main, textord, "∥", "\\textbardbl");
defineSymbol(text, main, textord, "~", "\\textasciitilde");
defineSymbol(text, main, textord, "\\", "\\textbackslash");
defineSymbol(text, main, textord, "^", "\\textasciicircum");
defineSymbol(math$1, main, rel, "↑", "\\uparrow", true);
defineSymbol(math$1, main, rel, "⇑", "\\Uparrow", true);
defineSymbol(math$1, main, rel, "↓", "\\downarrow", true);
defineSymbol(math$1, main, rel, "⇓", "\\Downarrow", true);
defineSymbol(math$1, main, rel, "↕", "\\updownarrow", true);
defineSymbol(math$1, main, rel, "⇕", "\\Updownarrow", true);
defineSymbol(math$1, main, op, "∐", "\\coprod");
defineSymbol(math$1, main, op, "⋁", "\\bigvee");
defineSymbol(math$1, main, op, "⋀", "\\bigwedge");
defineSymbol(math$1, main, op, "⨄", "\\biguplus");
defineSymbol(math$1, main, op, "⋂", "\\bigcap");
defineSymbol(math$1, main, op, "⋃", "\\bigcup");
defineSymbol(math$1, main, op, "∫", "\\int");
defineSymbol(math$1, main, op, "∫", "\\intop");
defineSymbol(math$1, main, op, "∬", "\\iint");
defineSymbol(math$1, main, op, "∭", "\\iiint");
defineSymbol(math$1, main, op, "∏", "\\prod");
defineSymbol(math$1, main, op, "∑", "\\sum");
defineSymbol(math$1, main, op, "⨂", "\\bigotimes");
defineSymbol(math$1, main, op, "⨁", "\\bigoplus");
defineSymbol(math$1, main, op, "⨀", "\\bigodot");
defineSymbol(math$1, main, op, "∮", "\\oint");
defineSymbol(math$1, main, op, "∯", "\\oiint");
defineSymbol(math$1, main, op, "∰", "\\oiiint");
defineSymbol(math$1, main, op, "⨆", "\\bigsqcup");
defineSymbol(math$1, main, op, "∫", "\\smallint");
defineSymbol(text, main, inner, "…", "\\textellipsis");
defineSymbol(math$1, main, inner, "…", "\\mathellipsis");
defineSymbol(text, main, inner, "…", "\\ldots", true);
defineSymbol(math$1, main, inner, "…", "\\ldots", true);
defineSymbol(math$1, main, inner, "⋯", "\\@cdots", true);
defineSymbol(math$1, main, inner, "⋱", "\\ddots", true);
defineSymbol(math$1, main, textord, "⋮", "\\varvdots");
defineSymbol(text, main, textord, "⋮", "\\varvdots");
defineSymbol(math$1, main, accent, "ˊ", "\\acute");
defineSymbol(math$1, main, accent, "ˋ", "\\grave");
defineSymbol(math$1, main, accent, "¨", "\\ddot");
defineSymbol(math$1, main, accent, "~", "\\tilde");
defineSymbol(math$1, main, accent, "ˉ", "\\bar");
defineSymbol(math$1, main, accent, "˘", "\\breve");
defineSymbol(math$1, main, accent, "ˇ", "\\check");
defineSymbol(math$1, main, accent, "^", "\\hat");
defineSymbol(math$1, main, accent, "⃗", "\\vec");
defineSymbol(math$1, main, accent, "˙", "\\dot");
defineSymbol(math$1, main, accent, "˚", "\\mathring");
defineSymbol(math$1, main, mathord, "", "\\@imath");
defineSymbol(math$1, main, mathord, "", "\\@jmath");
defineSymbol(math$1, main, textord, "ı", "ı");
defineSymbol(math$1, main, textord, "ȷ", "ȷ");
defineSymbol(text, main, textord, "ı", "\\i", true);
defineSymbol(text, main, textord, "ȷ", "\\j", true);
defineSymbol(text, main, textord, "ß", "\\ss", true);
defineSymbol(text, main, textord, "æ", "\\ae", true);
defineSymbol(text, main, textord, "œ", "\\oe", true);
defineSymbol(text, main, textord, "ø", "\\o", true);
defineSymbol(text, main, textord, "Æ", "\\AE", true);
defineSymbol(text, main, textord, "Œ", "\\OE", true);
defineSymbol(text, main, textord, "Ø", "\\O", true);
defineSymbol(text, main, accent, "ˊ", "\\'");
defineSymbol(text, main, accent, "ˋ", "\\`");
defineSymbol(text, main, accent, "ˆ", "\\^");
defineSymbol(text, main, accent, "˜", "\\~");
defineSymbol(text, main, accent, "ˉ", "\\=");
defineSymbol(text, main, accent, "˘", "\\u");
defineSymbol(text, main, accent, "˙", "\\.");
defineSymbol(text, main, accent, "¸", "\\c");
defineSymbol(text, main, accent, "˚", "\\r");
defineSymbol(text, main, accent, "ˇ", "\\v");
defineSymbol(text, main, accent, "¨", "\\\"");
defineSymbol(text, main, accent, "˝", "\\H");
defineSymbol(text, main, accent, "◯", "\\textcircled");
var ligatures = {
	"--": true,
	"---": true,
	"``": true,
	"''": true
};
defineSymbol(text, main, textord, "–", "--", true);
defineSymbol(text, main, textord, "–", "\\textendash");
defineSymbol(text, main, textord, "—", "---", true);
defineSymbol(text, main, textord, "—", "\\textemdash");
defineSymbol(text, main, textord, "‘", "`", true);
defineSymbol(text, main, textord, "‘", "\\textquoteleft");
defineSymbol(text, main, textord, "’", "'", true);
defineSymbol(text, main, textord, "’", "\\textquoteright");
defineSymbol(text, main, textord, "“", "``", true);
defineSymbol(text, main, textord, "“", "\\textquotedblleft");
defineSymbol(text, main, textord, "”", "''", true);
defineSymbol(text, main, textord, "”", "\\textquotedblright");
defineSymbol(math$1, main, textord, "°", "\\degree", true);
defineSymbol(text, main, textord, "°", "\\degree");
defineSymbol(text, main, textord, "°", "\\textdegree", true);
defineSymbol(math$1, main, textord, "£", "\\pounds");
defineSymbol(math$1, main, textord, "£", "\\mathsterling", true);
defineSymbol(text, main, textord, "£", "\\pounds");
defineSymbol(text, main, textord, "£", "\\textsterling", true);
defineSymbol(math$1, ams, textord, "✠", "\\maltese");
defineSymbol(text, ams, textord, "✠", "\\maltese");
var mathTextSymbols = "0123456789/@.\"";
for (var i = 0; i < mathTextSymbols.length; i++) {
	var ch = mathTextSymbols.charAt(i);
	defineSymbol(math$1, main, textord, ch, ch);
}
var textSymbols = "0123456789!@*()-=+\";:?/.,";
for (var _i = 0; _i < textSymbols.length; _i++) {
	var _ch = textSymbols.charAt(_i);
	defineSymbol(text, main, textord, _ch, _ch);
}
var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
for (var _i2 = 0; _i2 < letters.length; _i2++) {
	var _ch2 = letters.charAt(_i2);
	defineSymbol(math$1, main, mathord, _ch2, _ch2);
	defineSymbol(text, main, textord, _ch2, _ch2);
}
defineSymbol(math$1, ams, textord, "C", "ℂ");
defineSymbol(text, ams, textord, "C", "ℂ");
defineSymbol(math$1, ams, textord, "H", "ℍ");
defineSymbol(text, ams, textord, "H", "ℍ");
defineSymbol(math$1, ams, textord, "N", "ℕ");
defineSymbol(text, ams, textord, "N", "ℕ");
defineSymbol(math$1, ams, textord, "P", "ℙ");
defineSymbol(text, ams, textord, "P", "ℙ");
defineSymbol(math$1, ams, textord, "Q", "ℚ");
defineSymbol(text, ams, textord, "Q", "ℚ");
defineSymbol(math$1, ams, textord, "R", "ℝ");
defineSymbol(text, ams, textord, "R", "ℝ");
defineSymbol(math$1, ams, textord, "Z", "ℤ");
defineSymbol(text, ams, textord, "Z", "ℤ");
defineSymbol(math$1, main, mathord, "h", "ℎ");
defineSymbol(text, main, mathord, "h", "ℎ");
var wideChar;
for (var _i3 = 0; _i3 < letters.length; _i3++) {
	var _ch3 = letters.charAt(_i3);
	wideChar = String.fromCharCode(55349, 56320 + _i3);
	defineSymbol(math$1, main, mathord, _ch3, wideChar);
	defineSymbol(text, main, textord, _ch3, wideChar);
	wideChar = String.fromCharCode(55349, 56372 + _i3);
	defineSymbol(math$1, main, mathord, _ch3, wideChar);
	defineSymbol(text, main, textord, _ch3, wideChar);
	wideChar = String.fromCharCode(55349, 56424 + _i3);
	defineSymbol(math$1, main, mathord, _ch3, wideChar);
	defineSymbol(text, main, textord, _ch3, wideChar);
	wideChar = String.fromCharCode(55349, 56580 + _i3);
	defineSymbol(math$1, main, mathord, _ch3, wideChar);
	defineSymbol(text, main, textord, _ch3, wideChar);
	wideChar = String.fromCharCode(55349, 56684 + _i3);
	defineSymbol(math$1, main, mathord, _ch3, wideChar);
	defineSymbol(text, main, textord, _ch3, wideChar);
	wideChar = String.fromCharCode(55349, 56736 + _i3);
	defineSymbol(math$1, main, mathord, _ch3, wideChar);
	defineSymbol(text, main, textord, _ch3, wideChar);
	wideChar = String.fromCharCode(55349, 56788 + _i3);
	defineSymbol(math$1, main, mathord, _ch3, wideChar);
	defineSymbol(text, main, textord, _ch3, wideChar);
	wideChar = String.fromCharCode(55349, 56840 + _i3);
	defineSymbol(math$1, main, mathord, _ch3, wideChar);
	defineSymbol(text, main, textord, _ch3, wideChar);
	wideChar = String.fromCharCode(55349, 56944 + _i3);
	defineSymbol(math$1, main, mathord, _ch3, wideChar);
	defineSymbol(text, main, textord, _ch3, wideChar);
	if (_i3 < 26) {
		wideChar = String.fromCharCode(55349, 56632 + _i3);
		defineSymbol(math$1, main, mathord, _ch3, wideChar);
		defineSymbol(text, main, textord, _ch3, wideChar);
		wideChar = String.fromCharCode(55349, 56476 + _i3);
		defineSymbol(math$1, main, mathord, _ch3, wideChar);
		defineSymbol(text, main, textord, _ch3, wideChar);
	}
}
wideChar = String.fromCharCode(55349, 56668);
defineSymbol(math$1, main, mathord, "k", wideChar);
defineSymbol(text, main, textord, "k", wideChar);
for (var _i4 = 0; _i4 < 10; _i4++) {
	var _ch4 = _i4.toString();
	wideChar = String.fromCharCode(55349, 57294 + _i4);
	defineSymbol(math$1, main, mathord, _ch4, wideChar);
	defineSymbol(text, main, textord, _ch4, wideChar);
	wideChar = String.fromCharCode(55349, 57314 + _i4);
	defineSymbol(math$1, main, mathord, _ch4, wideChar);
	defineSymbol(text, main, textord, _ch4, wideChar);
	wideChar = String.fromCharCode(55349, 57324 + _i4);
	defineSymbol(math$1, main, mathord, _ch4, wideChar);
	defineSymbol(text, main, textord, _ch4, wideChar);
	wideChar = String.fromCharCode(55349, 57334 + _i4);
	defineSymbol(math$1, main, mathord, _ch4, wideChar);
	defineSymbol(text, main, textord, _ch4, wideChar);
}
var extraLatin = "ÐÞþ";
for (var _i5 = 0; _i5 < extraLatin.length; _i5++) {
	var _ch5 = extraLatin.charAt(_i5);
	defineSymbol(math$1, main, mathord, _ch5, _ch5);
	defineSymbol(text, main, textord, _ch5, _ch5);
}
/**
* This file provides support for Unicode range U+1D400 to U+1D7FF,
* Mathematical Alphanumeric Symbols.
*
* Function wideCharacterFont takes a wide character as input and returns
* the font information necessary to render it properly.
*/
var boldUpright = {
	mathClass: "mathbf",
	textClass: "textbf",
	font: "Main-Bold"
};
var italic = {
	mathClass: "mathnormal",
	textClass: "textit",
	font: "Math-Italic"
};
var boldItalic = {
	mathClass: "boldsymbol",
	textClass: "boldsymbol",
	font: "Main-BoldItalic"
};
var script = {
	mathClass: "mathscr",
	textClass: "textscr",
	font: "Script-Regular"
};
var noFont = {
	mathClass: "",
	textClass: "",
	font: ""
};
var fraktur = {
	mathClass: "mathfrak",
	textClass: "textfrak",
	font: "Fraktur-Regular"
};
var doubleStruck = {
	mathClass: "mathbb",
	textClass: "textbb",
	font: "AMS-Regular"
};
var boldFraktur = {
	mathClass: "mathboldfrak",
	textClass: "textboldfrak",
	font: "Fraktur-Regular"
};
var sansSerif = {
	mathClass: "mathsf",
	textClass: "textsf",
	font: "SansSerif-Regular"
};
var boldSansSerif = {
	mathClass: "mathboldsf",
	textClass: "textboldsf",
	font: "SansSerif-Bold"
};
var italicSansSerif = {
	mathClass: "mathitsf",
	textClass: "textitsf",
	font: "SansSerif-Italic"
};
var monospace = {
	mathClass: "mathtt",
	textClass: "texttt",
	font: "Typewriter-Regular"
};
/**
* Data below is from https://www.unicode.org/charts/PDF/U1D400.pdf
* That document sorts characters into groups by font type, say bold or italic.
*
* In the arrays below, each object consists of three properties:
*      * The CSS class of that group when in math mode.
*      * The CSS class of that group when in text mode.
*      * The font name, so that KaTeX can get font metrics.
*/
var wideLatinLetterData = [
	boldUpright,
	boldUpright,
	italic,
	italic,
	boldItalic,
	boldItalic,
	script,
	noFont,
	noFont,
	noFont,
	fraktur,
	fraktur,
	doubleStruck,
	doubleStruck,
	boldFraktur,
	boldFraktur,
	sansSerif,
	sansSerif,
	boldSansSerif,
	boldSansSerif,
	italicSansSerif,
	italicSansSerif,
	noFont,
	noFont,
	monospace,
	monospace
];
var wideNumeralData = [
	boldUpright,
	noFont,
	sansSerif,
	boldSansSerif,
	monospace
];
var wideCharacterFont = (wideChar) => {
	var H = wideChar.charCodeAt(0);
	var L = wideChar.charCodeAt(1);
	var codePoint = (H - 55296) * 1024 + (L - 56320) + 65536;
	if (119808 <= codePoint && codePoint < 120484) return wideLatinLetterData[Math.floor((codePoint - 119808) / 26)];
	else if (120782 <= codePoint && codePoint <= 120831) return wideNumeralData[Math.floor((codePoint - 120782) / 10)];
	else if (codePoint === 120485 || codePoint === 120486) return wideLatinLetterData[0];
	else if (120486 < codePoint && codePoint < 120782) return noFont;
	else throw new ParseError("Unsupported character: " + wideChar);
};
/**
* Looks up the given symbol in fontMetrics, after applying any symbol
* replacements defined in symbol.js
*/
var lookupSymbol = function lookupSymbol(value, fontName, mode) {
	if (symbols[mode][value]) {
		var replacement = symbols[mode][value].replace;
		if (replacement) value = replacement;
	}
	return {
		value,
		metrics: getCharacterMetrics(value, fontName, mode)
	};
};
/**
* Makes a symbolNode after translation via the list of symbols in symbols.js.
* Correctly pulls out metrics for the character, and optionally takes a list of
* classes to be attached to the node.
*
* TODO: make argument order closer to makeSpan
* TODO: add a separate argument for math class (e.g. `mop`, `mbin`), which
* should if present come first in `classes`.
* TODO(#953): Make `options` mandatory and always pass it in.
*/
var makeSymbol = function makeSymbol(value, fontName, mode, options, classes) {
	var lookup = lookupSymbol(value, fontName, mode);
	var metrics = lookup.metrics;
	value = lookup.value;
	var symbolNode;
	if (metrics) {
		var italic = metrics.italic;
		if (mode === "text" || options && options.font === "mathit") italic = 0;
		symbolNode = new SymbolNode(value, metrics.height, metrics.depth, italic, metrics.skew, metrics.width, classes);
	} else {
		typeof console !== "undefined" && console.warn("No character metrics " + ("for '" + value + "' in style '" + fontName + "' and mode '" + mode + "'"));
		symbolNode = new SymbolNode(value, 0, 0, 0, 0, 0, classes);
	}
	if (options) {
		symbolNode.maxFontSize = options.sizeMultiplier;
		if (options.style.isTight()) symbolNode.classes.push("mtight");
		var color = options.getColor();
		if (color) symbolNode.style.color = color;
	}
	return symbolNode;
};
/**
* Makes a symbol in Main-Regular or AMS-Regular.
* Used for rel, bin, open, close, inner, and punct.
*/
var mathsym = function mathsym(value, mode, options, classes) {
	if (classes === void 0) classes = [];
	if (options.font === "boldsymbol" && lookupSymbol(value, "Main-Bold", mode).metrics) return makeSymbol(value, "Main-Bold", mode, options, classes.concat(["mathbf"]));
	else if (value === "\\" || symbols[mode][value].font === "main") return makeSymbol(value, "Main-Regular", mode, options, classes);
	else return makeSymbol(value, "AMS-Regular", mode, options, classes.concat(["amsrm"]));
};
/**
* Determines which of the two font names (Main-Bold and Math-BoldItalic) and
* corresponding style tags (mathbf or boldsymbol) to use for font "boldsymbol",
* depending on the symbol.  Use this function instead of fontMap for font
* "boldsymbol".
*/
var boldSymbol = function boldSymbol(value, mode, type) {
	if (type !== "textord" && lookupSymbol(value, "Math-BoldItalic", mode).metrics) return {
		fontName: "Math-BoldItalic",
		fontClass: "boldsymbol"
	};
	else return {
		fontName: "Main-Bold",
		fontClass: "mathbf"
	};
};
/**
* Makes either a mathord or textord in the correct font and color.
*/
var makeOrd = function makeOrd(group, options, type) {
	var mode = group.mode;
	var text = group.text;
	var classes = ["mord"];
	var { font, fontFamily, fontWeight, fontShape } = options;
	var useFont = mode === "math" || mode === "text" && !!font;
	var fontOrFamily = useFont ? font : fontFamily;
	var wideFontName = "";
	var wideFontClass = "";
	if (text.charCodeAt(0) === 55349) {
		var wideCharData = wideCharacterFont(text);
		wideFontName = wideCharData.font;
		wideFontClass = wideCharData[mode + "Class"];
	}
	if (wideFontName) return makeSymbol(text, wideFontName, mode, options, classes.concat(wideFontClass));
	else if (fontOrFamily) {
		var fontName;
		var fontClasses;
		if (fontOrFamily === "boldsymbol") {
			var fontData = boldSymbol(text, mode, type);
			fontName = fontData.fontName;
			fontClasses = [fontData.fontClass];
		} else if (useFont) {
			fontName = fontMap[font].fontName;
			fontClasses = [font];
		} else {
			fontName = retrieveTextFontName(fontFamily, fontWeight, fontShape);
			fontClasses = [
				fontFamily,
				fontWeight,
				fontShape
			];
		}
		if (lookupSymbol(text, fontName, mode).metrics) return makeSymbol(text, fontName, mode, options, classes.concat(fontClasses));
		else if (ligatures.hasOwnProperty(text) && fontName.slice(0, 10) === "Typewriter") {
			var parts = [];
			for (var i = 0; i < text.length; i++) parts.push(makeSymbol(text[i], fontName, mode, options, classes.concat(fontClasses)));
			return makeFragment(parts);
		}
	}
	if (type === "mathord") return makeSymbol(text, "Math-Italic", mode, options, classes.concat(["mathnormal"]));
	else if (type === "textord") {
		var _font = symbols[mode][text] && symbols[mode][text].font;
		if (_font === "ams") return makeSymbol(text, retrieveTextFontName("amsrm", fontWeight, fontShape), mode, options, classes.concat("amsrm", fontWeight, fontShape));
		else if (_font === "main" || !_font) return makeSymbol(text, retrieveTextFontName("textrm", fontWeight, fontShape), mode, options, classes.concat(fontWeight, fontShape));
		else {
			var _fontName3 = retrieveTextFontName(_font, fontWeight, fontShape);
			return makeSymbol(text, _fontName3, mode, options, classes.concat(_fontName3, fontWeight, fontShape));
		}
	} else throw new Error("unexpected type: " + type + " in makeOrd");
};
/**
* Returns true if subsequent symbolNodes have the same classes, skew, maxFont,
* and styles. For mathnormal text, the left node must also have zero italic
* correction so we don't lose spacing between combined glyphs.
*/
var canCombine = (prev, next) => {
	if (createClass(prev.classes) !== createClass(next.classes) || prev.skew !== next.skew || prev.maxFontSize !== next.maxFontSize || prev.italic !== 0 && prev.hasClass("mathnormal")) return false;
	if (prev.classes.length === 1) {
		var cls = prev.classes[0];
		if (cls === "mbin" || cls === "mord") return false;
	}
	for (var key of Object.keys(prev.style)) if (prev.style[key] !== next.style[key]) return false;
	for (var _key of Object.keys(next.style)) if (prev.style[_key] !== next.style[_key]) return false;
	return true;
};
/**
* Combine consecutive domTree.symbolNodes into a single symbolNode.
* Note: this function mutates the argument.
*/
var tryCombineChars = (chars) => {
	for (var i = 0; i < chars.length - 1; i++) {
		var prev = chars[i];
		var next = chars[i + 1];
		if (prev instanceof SymbolNode && next instanceof SymbolNode && canCombine(prev, next)) {
			prev.text += next.text;
			prev.height = Math.max(prev.height, next.height);
			prev.depth = Math.max(prev.depth, next.depth);
			prev.italic = next.italic;
			chars.splice(i + 1, 1);
			i--;
		}
	}
	return chars;
};
/**
* Calculate the height, depth, and maxFontSize of an element based on its
* children.
*/
var sizeElementFromChildren = function sizeElementFromChildren(elem) {
	var height = 0;
	var depth = 0;
	var maxFontSize = 0;
	for (var i = 0; i < elem.children.length; i++) {
		var child = elem.children[i];
		if (child.height > height) height = child.height;
		if (child.depth > depth) depth = child.depth;
		if (child.maxFontSize > maxFontSize) maxFontSize = child.maxFontSize;
	}
	elem.height = height;
	elem.depth = depth;
	elem.maxFontSize = maxFontSize;
};
/**
* Makes a span with the given list of classes, list of children, and options.
*
* TODO(#953): Ensure that `options` is always provided (currently some call
* sites don't pass it) and make the type below mandatory.
* TODO: add a separate argument for math class (e.g. `mop`, `mbin`), which
* should if present come first in `classes`.
*/
var makeSpan = function makeSpan(classes, children, options, style) {
	var span = new Span(classes, children, options, style);
	sizeElementFromChildren(span);
	return span;
};
var makeSvgSpan = (classes, children, options, style) => new Span(classes, children, options, style);
var makeLineSpan = function makeLineSpan(className, options, thickness) {
	var line = makeSpan([className], [], options);
	line.height = Math.max(thickness || options.fontMetrics().defaultRuleThickness, options.minRuleThickness);
	line.style.borderBottomWidth = makeEm(line.height);
	line.maxFontSize = 1;
	return line;
};
/**
* Makes an anchor with the given href, list of classes, list of children,
* and options.
*/
var makeAnchor = function makeAnchor(href, classes, children, options) {
	var anchor = new Anchor(href, classes, children, options);
	sizeElementFromChildren(anchor);
	return anchor;
};
/**
* Makes a document fragment with the given list of children.
*/
var makeFragment = function makeFragment(children) {
	var fragment = new DocumentFragment(children);
	sizeElementFromChildren(fragment);
	return fragment;
};
/**
* Wraps group in a span if it's a document fragment, allowing to apply classes
* and styles
*/
var wrapFragment = function wrapFragment(group, options) {
	if (group instanceof DocumentFragment) return makeSpan([], [group], options);
	return group;
};
var getVListChildrenAndDepth = function getVListChildrenAndDepth(params) {
	if (params.positionType === "individualShift") {
		var oldChildren = params.children;
		var children = [oldChildren[0]];
		var _depth = -oldChildren[0].shift - oldChildren[0].elem.depth;
		var currPos = _depth;
		for (var i = 1; i < oldChildren.length; i++) {
			var diff = -oldChildren[i].shift - currPos - oldChildren[i].elem.depth;
			var size = diff - (oldChildren[i - 1].elem.height + oldChildren[i - 1].elem.depth);
			currPos = currPos + diff;
			children.push({
				type: "kern",
				size
			});
			children.push(oldChildren[i]);
		}
		return {
			children,
			depth: _depth
		};
	}
	var depth;
	if (params.positionType === "top") {
		var bottom = params.positionData;
		for (var _i = 0; _i < params.children.length; _i++) {
			var child = params.children[_i];
			bottom -= child.type === "kern" ? child.size : child.elem.height + child.elem.depth;
		}
		depth = bottom;
	} else if (params.positionType === "bottom") depth = -params.positionData;
	else {
		var firstChild = params.children[0];
		if (firstChild.type !== "elem") throw new Error("First child must have type \"elem\".");
		if (params.positionType === "shift") depth = -firstChild.elem.depth - params.positionData;
		else if (params.positionType === "firstBaseline") depth = -firstChild.elem.depth;
		else throw new Error("Invalid positionType " + params.positionType + ".");
	}
	return {
		children: params.children,
		depth
	};
};
/**
* Makes a vertical list by stacking elements and kerns on top of each other.
* Allows for many different ways of specifying the positioning method.
*
* See VListParam documentation above.
*/
var makeVList = function makeVList(params, options) {
	var { children, depth } = getVListChildrenAndDepth(params);
	var pstrutSize = 0;
	for (var i = 0; i < children.length; i++) {
		var child = children[i];
		if (child.type === "elem") {
			var elem = child.elem;
			pstrutSize = Math.max(pstrutSize, elem.maxFontSize, elem.height);
		}
	}
	pstrutSize += 2;
	var pstrut = makeSpan(["pstrut"], []);
	pstrut.style.height = makeEm(pstrutSize);
	var realChildren = [];
	var minPos = depth;
	var maxPos = depth;
	var currPos = depth;
	for (var _i2 = 0; _i2 < children.length; _i2++) {
		var _child = children[_i2];
		if (_child.type === "kern") currPos += _child.size;
		else {
			var _elem = _child.elem;
			var classes = _child.wrapperClasses || [];
			var style = _child.wrapperStyle || {};
			var childWrap = makeSpan(classes, [pstrut, _elem], void 0, style);
			childWrap.style.top = makeEm(-pstrutSize - currPos - _elem.depth);
			if (_child.marginLeft) childWrap.style.marginLeft = _child.marginLeft;
			if (_child.marginRight) childWrap.style.marginRight = _child.marginRight;
			realChildren.push(childWrap);
			currPos += _elem.height + _elem.depth;
		}
		minPos = Math.min(minPos, currPos);
		maxPos = Math.max(maxPos, currPos);
	}
	var vlist = makeSpan(["vlist"], realChildren);
	vlist.style.height = makeEm(maxPos);
	var rows;
	if (minPos < 0) {
		var depthStrut = makeSpan(["vlist"], [makeSpan([], [])]);
		depthStrut.style.height = makeEm(-minPos);
		rows = [makeSpan(["vlist-r"], [vlist, makeSpan(["vlist-s"], [new SymbolNode("​")])]), makeSpan(["vlist-r"], [depthStrut])];
	} else rows = [makeSpan(["vlist-r"], [vlist])];
	var vtable = makeSpan(["vlist-t"], rows);
	if (rows.length === 2) vtable.classes.push("vlist-t2");
	vtable.height = maxPos;
	vtable.depth = -minPos;
	return vtable;
};
var makeGlue = (measurement, options) => {
	var rule = makeSpan(["mspace"], [], options);
	var size = calculateSize(measurement, options);
	rule.style.marginRight = makeEm(size);
	return rule;
};
var retrieveTextFontName = (fontFamily, fontWeight, fontShape) => {
	var baseFontName;
	var fontStylesName;
	switch (fontFamily) {
		case "amsrm":
			baseFontName = "AMS";
			break;
		case "textrm":
			baseFontName = "Main";
			break;
		case "textsf":
			baseFontName = "SansSerif";
			break;
		case "texttt":
			baseFontName = "Typewriter";
			break;
		default: baseFontName = fontFamily;
	}
	if (fontWeight === "textbf" && fontShape === "textit") fontStylesName = "BoldItalic";
	else if (fontWeight === "textbf") fontStylesName = "Bold";
	else if (fontShape === "textit") fontStylesName = "Italic";
	else fontStylesName = "Regular";
	return baseFontName + "-" + fontStylesName;
};
/**
* Maps TeX font commands to objects containing:
* - variant: string used for "mathvariant" attribute in buildMathML.js
* - fontName: the "style" parameter to fontMetrics.getCharacterMetrics
*/
var fontMap = {
	"mathbf": {
		variant: "bold",
		fontName: "Main-Bold"
	},
	"mathrm": {
		variant: "normal",
		fontName: "Main-Regular"
	},
	"textit": {
		variant: "italic",
		fontName: "Main-Italic"
	},
	"mathit": {
		variant: "italic",
		fontName: "Main-Italic"
	},
	"mathnormal": {
		variant: "italic",
		fontName: "Math-Italic"
	},
	"mathsfit": {
		variant: "sans-serif-italic",
		fontName: "SansSerif-Italic"
	},
	"mathbb": {
		variant: "double-struck",
		fontName: "AMS-Regular"
	},
	"mathcal": {
		variant: "script",
		fontName: "Caligraphic-Regular"
	},
	"mathfrak": {
		variant: "fraktur",
		fontName: "Fraktur-Regular"
	},
	"mathscr": {
		variant: "script",
		fontName: "Script-Regular"
	},
	"mathsf": {
		variant: "sans-serif",
		fontName: "SansSerif-Regular"
	},
	"mathtt": {
		variant: "monospace",
		fontName: "Typewriter-Regular"
	}
};
var svgData = {
	vec: [
		"vec",
		.471,
		.714
	],
	oiintSize1: [
		"oiintSize1",
		.957,
		.499
	],
	oiintSize2: [
		"oiintSize2",
		1.472,
		.659
	],
	oiiintSize1: [
		"oiiintSize1",
		1.304,
		.499
	],
	oiiintSize2: [
		"oiiintSize2",
		1.98,
		.659
	]
};
var staticSvg = function staticSvg(value, options) {
	var [pathName, width, height] = svgData[value];
	var span = makeSvgSpan(["overlay"], [new SvgNode([new PathNode(pathName)], {
		"width": makeEm(width),
		"height": makeEm(height),
		"style": "width:" + makeEm(width),
		"viewBox": "0 0 " + 1e3 * width + " " + 1e3 * height,
		"preserveAspectRatio": "xMinYMin"
	})], options);
	span.height = height;
	span.style.height = makeEm(height);
	span.style.width = makeEm(width);
	return span;
};
var thinspace = {
	number: 3,
	unit: "mu"
};
var mediumspace = {
	number: 4,
	unit: "mu"
};
var thickspace = {
	number: 5,
	unit: "mu"
};
var spacings = {
	mord: {
		mop: thinspace,
		mbin: mediumspace,
		mrel: thickspace,
		minner: thinspace
	},
	mop: {
		mord: thinspace,
		mop: thinspace,
		mrel: thickspace,
		minner: thinspace
	},
	mbin: {
		mord: mediumspace,
		mop: mediumspace,
		mopen: mediumspace,
		minner: mediumspace
	},
	mrel: {
		mord: thickspace,
		mop: thickspace,
		mopen: thickspace,
		minner: thickspace
	},
	mopen: {},
	mclose: {
		mop: thinspace,
		mbin: mediumspace,
		mrel: thickspace,
		minner: thinspace
	},
	mpunct: {
		mord: thinspace,
		mop: thinspace,
		mrel: thickspace,
		mopen: thinspace,
		mclose: thinspace,
		mpunct: thinspace,
		minner: thinspace
	},
	minner: {
		mord: thinspace,
		mop: thinspace,
		mbin: mediumspace,
		mrel: thickspace,
		mopen: thinspace,
		mpunct: thinspace,
		minner: thinspace
	}
};
var tightSpacings = {
	mord: { mop: thinspace },
	mop: {
		mord: thinspace,
		mop: thinspace
	},
	mbin: {},
	mrel: {},
	mopen: {},
	mclose: { mop: thinspace },
	mpunct: {},
	minner: { mop: thinspace }
};
/**
* All registered functions.
* `functions.js` just exports this same dictionary again and makes it public.
* `Parser.js` requires this dictionary.
*/
var _functions = {};
/**
* All HTML builders. Should be only used in the `define*` and the `build*ML`
* functions.
*
* Builders for different node types are stored side by side, but
* `HtmlBuilder<T>` is contravariant in `T`, so there is no single type
* argument that makes storing/retrieving them typecheck.  `any` is used
* as an existential-quantifier escape hatch.
*/
var _htmlGroupBuilders = {};
/**
* All MathML builders. Should be only used in the `define*` and the `build*ML`
* functions.  See `_htmlGroupBuilders` above for the rationale behind `any`.
*/
var _mathmlGroupBuilders = {};
function defineFunction(_ref) {
	var { type, names, props, handler, htmlBuilder, mathmlBuilder } = _ref;
	var data = {
		type,
		numArgs: props.numArgs,
		argTypes: props.argTypes,
		allowedInArgument: !!props.allowedInArgument,
		allowedInText: !!props.allowedInText,
		allowedInMath: props.allowedInMath === void 0 ? true : props.allowedInMath,
		numOptionalArgs: props.numOptionalArgs || 0,
		infix: !!props.infix,
		primitive: !!props.primitive,
		handler
	};
	for (var i = 0; i < names.length; ++i) _functions[names[i]] = data;
	if (type) {
		if (htmlBuilder) _htmlGroupBuilders[type] = htmlBuilder;
		if (mathmlBuilder) _mathmlGroupBuilders[type] = mathmlBuilder;
	}
}
/**
* Use this to register only the HTML and MathML builders for a function (e.g.
* if the function's ParseNode is generated in Parser.js rather than via a
* stand-alone handler provided to `defineFunction`).
*/
function defineFunctionBuilders(_ref2) {
	var { type, htmlBuilder, mathmlBuilder } = _ref2;
	defineFunction({
		type,
		names: [],
		props: { numArgs: 0 },
		handler() {
			throw new Error("Should never be called.");
		},
		htmlBuilder,
		mathmlBuilder
	});
}
var normalizeArgument = function normalizeArgument(arg) {
	return arg.type === "ordgroup" && arg.body.length === 1 ? arg.body[0] : arg;
};
var ordargument = function ordargument(arg) {
	return arg.type === "ordgroup" ? arg.body : [arg];
};
/**
* This file does the main work of building a domTree structure from a parse
* tree. The entry point is the `buildHTML` function, which takes a parse tree.
* Then, the buildExpression, buildGroup, and various groupBuilders functions
* are called, to produce a final HTML tree.
*/
var binLeftCanceller = /* @__PURE__ */ new Set([
	"leftmost",
	"mbin",
	"mopen",
	"mrel",
	"mop",
	"mpunct"
]);
var binRightCanceller = /* @__PURE__ */ new Set([
	"rightmost",
	"mrel",
	"mclose",
	"mpunct"
]);
var styleMap$1 = {
	"display": Style$1.DISPLAY,
	"text": Style$1.TEXT,
	"script": Style$1.SCRIPT,
	"scriptscript": Style$1.SCRIPTSCRIPT
};
var DomEnum = {
	mord: "mord",
	mop: "mop",
	mbin: "mbin",
	mrel: "mrel",
	mopen: "mopen",
	mclose: "mclose",
	mpunct: "mpunct",
	minner: "minner"
};
/**
* Take a list of nodes, build them in order, and return a list of the built
* nodes. documentFragments are flattened into their contents, so the
* returned list contains no fragments. `isRealGroup` is true if `expression`
* is a real group (no atoms will be added on either side), as opposed to
* a partial group (e.g. one created by \color). `surrounding` is an array
* consisting type of nodes that will be added to the left and right.
*/
var buildExpression$1 = function buildExpression(expression, options, isRealGroup, surrounding) {
	if (surrounding === void 0) surrounding = [null, null];
	var groups = [];
	for (var i = 0; i < expression.length; i++) {
		var output = buildGroup$1(expression[i], options);
		if (output instanceof DocumentFragment) {
			var children = output.children;
			groups.push(...children);
		} else groups.push(output);
	}
	tryCombineChars(groups);
	if (!isRealGroup) return groups;
	var glueOptions = options;
	if (expression.length === 1) {
		var node = expression[0];
		if (node.type === "sizing") glueOptions = options.havingSize(node.size);
		else if (node.type === "styling") glueOptions = options.havingStyle(styleMap$1[node.style]);
	}
	var dummyPrev = makeSpan([surrounding[0] || "leftmost"], [], options);
	var dummyNext = makeSpan([surrounding[1] || "rightmost"], [], options);
	var isRoot = isRealGroup === "root";
	_traverseNonSpaceNodes(groups, (node, prev) => {
		var prevType = prev.classes[0];
		var type = node.classes[0];
		if (prevType === "mbin" && binRightCanceller.has(type)) prev.classes[0] = "mord";
		else if (type === "mbin" && binLeftCanceller.has(prevType)) node.classes[0] = "mord";
	}, { node: dummyPrev }, dummyNext, isRoot);
	_traverseNonSpaceNodes(groups, (node, prev) => {
		var _tightSpacings$prevTy, _spacings$prevType;
		var prevType = getTypeOfDomTree(prev);
		var type = getTypeOfDomTree(node);
		var space = prevType && type ? node.hasClass("mtight") ? (_tightSpacings$prevTy = tightSpacings[prevType]) == null ? void 0 : _tightSpacings$prevTy[type] : (_spacings$prevType = spacings[prevType]) == null ? void 0 : _spacings$prevType[type] : null;
		if (space) return makeGlue(space, glueOptions);
	}, { node: dummyPrev }, dummyNext, isRoot);
	return groups;
};
var _traverseNonSpaceNodes = function traverseNonSpaceNodes(nodes, callback, prev, next, isRoot) {
	if (next) nodes.push(next);
	var i = 0;
	for (; i < nodes.length; i++) {
		var node = nodes[i];
		var partialGroup = checkPartialGroup(node);
		if (partialGroup) {
			_traverseNonSpaceNodes(partialGroup.children, callback, prev, null, isRoot);
			continue;
		}
		var nonspace = !node.hasClass("mspace");
		if (nonspace) {
			var result = callback(node, prev.node);
			if (result) if (prev.insertAfter) prev.insertAfter(result);
			else {
				nodes.unshift(result);
				i++;
			}
		}
		if (nonspace) prev.node = node;
		else if (isRoot && node.hasClass("newline")) prev.node = makeSpan(["leftmost"]);
		prev.insertAfter = ((index) => (n) => {
			nodes.splice(index + 1, 0, n);
			i++;
		})(i);
	}
	if (next) nodes.pop();
};
var checkPartialGroup = function checkPartialGroup(node) {
	if (node instanceof DocumentFragment || node instanceof Anchor || node instanceof Span && node.hasClass("enclosing")) return node;
	return null;
};
var _getOutermostNode = function getOutermostNode(node, side) {
	var partialGroup = checkPartialGroup(node);
	if (partialGroup) {
		var children = partialGroup.children;
		if (children.length) {
			if (side === "right") return _getOutermostNode(children[children.length - 1], "right");
			else if (side === "left") return _getOutermostNode(children[0], "left");
		}
	}
	return node;
};
var getTypeOfDomTree = function getTypeOfDomTree(node, side) {
	if (!node) return null;
	if (side) node = _getOutermostNode(node, side);
	return DomEnum[node.classes[0]] || null;
};
var makeNullDelimiter = function makeNullDelimiter(options, classes) {
	var moreClasses = ["nulldelimiter"].concat(options.baseSizingClasses());
	return makeSpan(classes.concat(moreClasses));
};
/**
* buildGroup is the function that takes a group and calls the correct groupType
* function for it. It also handles the interaction of size and style changes
* between parents and children.
*/
var buildGroup$1 = function buildGroup(group, options, baseOptions) {
	if (!group) return makeSpan();
	if (_htmlGroupBuilders[group.type]) {
		var groupNode = _htmlGroupBuilders[group.type](group, options);
		if (baseOptions && options.size !== baseOptions.size) {
			groupNode = makeSpan(options.sizingClasses(baseOptions), [groupNode], options);
			var multiplier = options.sizeMultiplier / baseOptions.sizeMultiplier;
			groupNode.height *= multiplier;
			groupNode.depth *= multiplier;
		}
		return groupNode;
	} else throw new ParseError("Got group of unknown type: '" + group.type + "'");
};
/**
* Combine an array of HTML DOM nodes (e.g., the output of `buildExpression`)
* into an unbreakable HTML node of class .base, with proper struts to
* guarantee correct vertical extent.  `buildHTML` calls this repeatedly to
* make up the entire expression as a sequence of unbreakable units.
*/
function buildHTMLUnbreakable(children, options) {
	var body = makeSpan(["base"], children, options);
	var strut = makeSpan(["strut"]);
	strut.style.height = makeEm(body.height + body.depth);
	if (body.depth) strut.style.verticalAlign = makeEm(-body.depth);
	body.children.unshift(strut);
	return body;
}
/**
* Take an entire parse tree, and build it into an appropriate set of HTML
* nodes.
*/
function buildHTML(tree, options) {
	var tag = null;
	if (tree.length === 1 && tree[0].type === "tag") {
		tag = tree[0].tag;
		tree = tree[0].body;
	}
	var expression = buildExpression$1(tree, options, "root");
	var eqnNum;
	if (expression.length === 2 && expression[1].hasClass("tag")) eqnNum = expression.pop();
	var children = [];
	var parts = [];
	for (var i = 0; i < expression.length; i++) {
		parts.push(expression[i]);
		if (expression[i].hasClass("mbin") || expression[i].hasClass("mrel") || expression[i].hasClass("allowbreak")) {
			var nobreak = false;
			while (i < expression.length - 1 && expression[i + 1].hasClass("mspace") && !expression[i + 1].hasClass("newline")) {
				i++;
				parts.push(expression[i]);
				if (expression[i].hasClass("nobreak")) nobreak = true;
			}
			if (!nobreak) {
				children.push(buildHTMLUnbreakable(parts, options));
				parts = [];
			}
		} else if (expression[i].hasClass("newline")) {
			parts.pop();
			if (parts.length > 0) {
				children.push(buildHTMLUnbreakable(parts, options));
				parts = [];
			}
			children.push(expression[i]);
		}
	}
	if (parts.length > 0) children.push(buildHTMLUnbreakable(parts, options));
	var tagChild;
	if (tag) {
		tagChild = buildHTMLUnbreakable(buildExpression$1(tag, options, true), options);
		tagChild.classes = ["tag"];
		children.push(tagChild);
	} else if (eqnNum) children.push(eqnNum);
	var htmlNode = makeSpan(["katex-html"], children);
	htmlNode.setAttribute("aria-hidden", "true");
	if (tagChild) {
		var strut = tagChild.children[0];
		strut.style.height = makeEm(htmlNode.height + htmlNode.depth);
		if (htmlNode.depth) strut.style.verticalAlign = makeEm(-htmlNode.depth);
	}
	return htmlNode;
}
/**
* These objects store data about MathML nodes. This is the MathML equivalent
* of the types in domTree.js. Since MathML handles its own rendering, and
* since we're mainly using MathML to improve accessibility, we don't manage
* any of the styling state that the plain DOM nodes do.
*
* The `toNode` and `toMarkup` functions work similarly to how they do in
* domTree.js, creating namespaced DOM nodes and HTML text markup respectively.
*/
function newDocumentFragment(children) {
	return new DocumentFragment(children);
}
/**
* This node represents a general purpose MathML node of any type. The
* constructor requires the type of node to create (for example, `"mo"` or
* `"mspace"`, corresponding to `<mo>` and `<mspace>` tags).
*/
var MathNode = class {
	constructor(type, children, classes) {
		this.type = void 0;
		this.attributes = void 0;
		this.children = void 0;
		this.classes = void 0;
		this.type = type;
		this.attributes = {};
		this.children = children || [];
		this.classes = classes || [];
	}
	/**
	* Sets an attribute on a MathML node. MathML depends on attributes to convey a
	* semantic content, so this is used heavily.
	*/
	setAttribute(name, value) {
		this.attributes[name] = value;
	}
	/**
	* Gets an attribute on a MathML node.
	*/
	getAttribute(name) {
		return this.attributes[name];
	}
	/**
	* Converts the math node into a MathML-namespaced DOM element.
	*/
	toNode() {
		var node = document.createElementNS("http://www.w3.org/1998/Math/MathML", this.type);
		for (var attr in this.attributes) if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) node.setAttribute(attr, this.attributes[attr]);
		if (this.classes.length > 0) node.className = createClass(this.classes);
		for (var i = 0; i < this.children.length; i++) if (this.children[i] instanceof TextNode && this.children[i + 1] instanceof TextNode) {
			var text = this.children[i].toText() + this.children[++i].toText();
			while (this.children[i + 1] instanceof TextNode) text += this.children[++i].toText();
			node.appendChild(new TextNode(text).toNode());
		} else node.appendChild(this.children[i].toNode());
		return node;
	}
	/**
	* Converts the math node into an HTML markup string.
	*/
	toMarkup() {
		var markup = "<" + this.type;
		for (var attr in this.attributes) if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
			markup += " " + attr + "=\"";
			markup += escape(this.attributes[attr]);
			markup += "\"";
		}
		if (this.classes.length > 0) markup += " class =\"" + escape(createClass(this.classes)) + "\"";
		markup += ">";
		for (var i = 0; i < this.children.length; i++) markup += this.children[i].toMarkup();
		markup += "</" + this.type + ">";
		return markup;
	}
	/**
	* Converts the math node into a string, similar to innerText, but escaped.
	*/
	toText() {
		return this.children.map((child) => child.toText()).join("");
	}
};
/**
* This node represents a piece of text.
*/
var TextNode = class {
	constructor(text) {
		this.text = void 0;
		this.text = text;
	}
	/**
	* Converts the text node into a DOM text node.
	*/
	toNode() {
		return document.createTextNode(this.text);
	}
	/**
	* Converts the text node into escaped HTML markup
	* (representing the text itself).
	*/
	toMarkup() {
		return escape(this.toText());
	}
	/**
	* Converts the text node into a string
	* (representing the text itself).
	*/
	toText() {
		return this.text;
	}
};
/**
* This node represents a space, but may render as <mspace.../> or as text,
* depending on the width.
*/
var SpaceNode = class {
	/**
	* Create a Space node with width given in CSS ems.
	*/
	constructor(width) {
		this.width = void 0;
		this.character = void 0;
		this.width = width;
		if (width >= .05555 && width <= .05556) this.character = " ";
		else if (width >= .1666 && width <= .1667) this.character = " ";
		else if (width >= .2222 && width <= .2223) this.character = " ";
		else if (width >= .2777 && width <= .2778) this.character = "  ";
		else if (width >= -.05556 && width <= -.05555) this.character = " ⁣";
		else if (width >= -.1667 && width <= -.1666) this.character = " ⁣";
		else if (width >= -.2223 && width <= -.2222) this.character = " ⁣";
		else if (width >= -.2778 && width <= -.2777) this.character = " ⁣";
		else this.character = null;
	}
	/**
	* Converts the math node into a MathML-namespaced DOM element.
	*/
	toNode() {
		if (this.character) return document.createTextNode(this.character);
		else {
			var node = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mspace");
			node.setAttribute("width", makeEm(this.width));
			return node;
		}
	}
	/**
	* Converts the math node into an HTML markup string.
	*/
	toMarkup() {
		if (this.character) return "<mtext>" + this.character + "</mtext>";
		else return "<mspace width=\"" + makeEm(this.width) + "\"/>";
	}
	/**
	* Converts the math node into a string, similar to innerText.
	*/
	toText() {
		if (this.character) return this.character;
		else return " ";
	}
};
/**
* This file converts a parse tree into a corresponding MathML tree. The main
* entry point is the `buildMathML` function, which takes a parse tree from the
* parser.
*/
var noVariantSymbols = /* @__PURE__ */ new Set(["\\imath", "\\jmath"]);
var rowLikeTypes = /* @__PURE__ */ new Set(["mrow", "mtable"]);
/**
* Takes a symbol and converts it into a MathML text node after performing
* optional replacement from symbols.js.
*/
var makeText = function makeText(text, mode, options) {
	if (symbols[mode][text] && symbols[mode][text].replace && text.charCodeAt(0) !== 55349 && !(ligatures.hasOwnProperty(text) && options && (options.fontFamily && options.fontFamily.slice(4, 6) === "tt" || options.font && options.font.slice(4, 6) === "tt"))) text = symbols[mode][text].replace;
	return new TextNode(text);
};
/**
* Wrap the given array of nodes in an <mrow> node if needed, i.e.,
* unless the array has length 1.  Always returns a single node.
*/
var makeRow = function makeRow(body) {
	if (body.length === 1) return body[0];
	else return new MathNode("mrow", body);
};
var mathFontVariants = {
	mathit: "italic",
	boldsymbol: (group) => group.type === "textord" ? "bold" : "bold-italic",
	mathbf: "bold",
	mathbb: "double-struck",
	mathsfit: "sans-serif-italic",
	mathfrak: "fraktur",
	mathscr: "script",
	mathcal: "script",
	mathsf: "sans-serif",
	mathtt: "monospace"
};
/**
* Returns the math variant as a string or null if none is required.
*/
var getVariant = (group, options) => {
	if (group.mode === "text") {
		if (options.fontFamily === "texttt") return "monospace";
		else if (options.fontFamily === "textsf") if (options.fontShape === "textit" && options.fontWeight === "textbf") return "sans-serif-bold-italic";
		else if (options.fontShape === "textit") return "sans-serif-italic";
		else if (options.fontWeight === "textbf") return "bold-sans-serif";
		else return "sans-serif";
		else if (options.fontShape === "textit" && options.fontWeight === "textbf") return "bold-italic";
		else if (options.fontShape === "textit") return "italic";
		else if (options.fontWeight === "textbf") return "bold";
	}
	var font = options.font;
	if (!font || font === "mathnormal") return null;
	var mode = group.mode;
	var mathVariant = mathFontVariants[font];
	if (mathVariant) return typeof mathVariant === "function" ? mathVariant(group) : mathVariant;
	var text = group.text;
	if (noVariantSymbols.has(text)) return null;
	if (symbols[mode][text]) {
		var replacement = symbols[mode][text].replace;
		if (replacement) text = replacement;
	}
	var fontName = fontMap[font].fontName;
	if (getCharacterMetrics(text, fontName, mode)) return fontMap[font].variant;
	return null;
};
/**
* Check for <mi>.</mi> which is how a dot renders in MathML,
* or <mo separator="true" lspace="0em" rspace="0em">,</mo>
* which is how a braced comma {,} renders in MathML
*/
function isNumberPunctuation(group) {
	if (!group) return false;
	if (group.type === "mi" && group.children.length === 1) {
		var child = group.children[0];
		return child instanceof TextNode && child.text === ".";
	} else if (group.type === "mo" && group.children.length === 1 && group.getAttribute("separator") === "true" && group.getAttribute("lspace") === "0em" && group.getAttribute("rspace") === "0em") {
		var _child = group.children[0];
		return _child instanceof TextNode && _child.text === ",";
	} else return false;
}
/**
* Takes a list of nodes, builds them, and returns a list of the generated
* MathML nodes.  Also combine consecutive <mtext> outputs into a single
* <mtext> tag.
*/
var buildExpression = function buildExpression(expression, options, isOrdgroup) {
	if (expression.length === 1) {
		var group = buildGroup(expression[0], options);
		if (isOrdgroup && group instanceof MathNode && group.type === "mo") {
			group.setAttribute("lspace", "0em");
			group.setAttribute("rspace", "0em");
		}
		return [group];
	}
	var groups = [];
	var lastGroup;
	for (var i = 0; i < expression.length; i++) {
		var _group = buildGroup(expression[i], options);
		if (_group instanceof MathNode && lastGroup instanceof MathNode) {
			if (_group.type === "mtext" && lastGroup.type === "mtext" && _group.getAttribute("mathvariant") === lastGroup.getAttribute("mathvariant")) {
				lastGroup.children.push(..._group.children);
				continue;
			} else if (_group.type === "mn" && lastGroup.type === "mn") {
				lastGroup.children.push(..._group.children);
				continue;
			} else if (isNumberPunctuation(_group) && lastGroup.type === "mn") {
				lastGroup.children.push(..._group.children);
				continue;
			} else if (_group.type === "mn" && isNumberPunctuation(lastGroup)) {
				_group.children = [...lastGroup.children, ..._group.children];
				groups.pop();
			} else if ((_group.type === "msup" || _group.type === "msub") && _group.children.length >= 1 && (lastGroup.type === "mn" || isNumberPunctuation(lastGroup))) {
				var base = _group.children[0];
				if (base instanceof MathNode && base.type === "mn") {
					base.children = [...lastGroup.children, ...base.children];
					groups.pop();
				}
			} else if (lastGroup.type === "mi" && lastGroup.children.length === 1) {
				var lastChild = lastGroup.children[0];
				if (lastChild instanceof TextNode && lastChild.text === "̸" && (_group.type === "mo" || _group.type === "mi" || _group.type === "mn")) {
					var child = _group.children[0];
					if (child instanceof TextNode && child.text.length > 0) {
						child.text = child.text.slice(0, 1) + "̸" + child.text.slice(1);
						groups.pop();
					}
				}
			}
		}
		groups.push(_group);
		lastGroup = _group;
	}
	return groups;
};
/**
* Equivalent to buildExpression, but wraps the elements in an <mrow>
* if there's more than one.  Returns a single node instead of an array.
*/
var buildExpressionRow = function buildExpressionRow(expression, options, isOrdgroup) {
	return makeRow(buildExpression(expression, options, isOrdgroup));
};
/**
* Takes a group from the parser and calls the appropriate groupBuilders function
* on it to produce a MathML node.
*/
var buildGroup = function buildGroup(group, options) {
	if (!group) return new MathNode("mrow");
	if (_mathmlGroupBuilders[group.type]) return _mathmlGroupBuilders[group.type](group, options);
	else throw new ParseError("Got group of unknown type: '" + group.type + "'");
};
/**
* Takes a full parse tree and settings and builds a MathML representation of
* it. In particular, we put the elements from building the parse tree into a
* <semantics> tag so we can also include that TeX source as an annotation.
*
* Note that we actually return a domTree element with a `<math>` inside it so
* we can do appropriate styling.
*/
function buildMathML(tree, texExpression, options, isDisplayMode, forMathmlOnly) {
	var expression = buildExpression(tree, options);
	var wrapper;
	if (expression.length === 1 && expression[0] instanceof MathNode && rowLikeTypes.has(expression[0].type)) wrapper = expression[0];
	else wrapper = new MathNode("mrow", expression);
	var annotation = new MathNode("annotation", [new TextNode(texExpression)]);
	annotation.setAttribute("encoding", "application/x-tex");
	var math = new MathNode("math", [new MathNode("semantics", [wrapper, annotation])]);
	math.setAttribute("xmlns", "http://www.w3.org/1998/Math/MathML");
	if (isDisplayMode) math.setAttribute("display", "block");
	return makeSpan([forMathmlOnly ? "katex" : "katex-mathml"], [math]);
}
/**
* This file contains information about the options that the Parser carries
* around with it while parsing. Data is held in an `Options` object, and when
* recursing, a new `Options` object can be created with the `.with*` and
* `.reset` functions.
*/
var sizeStyleMap = [
	[
		1,
		1,
		1
	],
	[
		2,
		1,
		1
	],
	[
		3,
		1,
		1
	],
	[
		4,
		2,
		1
	],
	[
		5,
		2,
		1
	],
	[
		6,
		3,
		1
	],
	[
		7,
		4,
		2
	],
	[
		8,
		6,
		3
	],
	[
		9,
		7,
		6
	],
	[
		10,
		8,
		7
	],
	[
		11,
		10,
		9
	]
];
var sizeMultipliers = [
	.5,
	.6,
	.7,
	.8,
	.9,
	1,
	1.2,
	1.44,
	1.728,
	2.074,
	2.488
];
var sizeAtStyle = function sizeAtStyle(size, style) {
	return style.size < 2 ? size : sizeStyleMap[size - 1][style.size - 1];
};
/**
* This is the main options class. It contains the current style, size, color,
* and font.
*
* Options objects should not be modified. To create a new Options with
* different properties, call a `.having*` method.
*/
var Options = class Options {
	constructor(data) {
		this.style = void 0;
		this.color = void 0;
		this.size = void 0;
		this.textSize = void 0;
		this.phantom = void 0;
		this.font = void 0;
		this.fontFamily = void 0;
		this.fontWeight = void 0;
		this.fontShape = void 0;
		this.sizeMultiplier = void 0;
		this.maxSize = void 0;
		this.minRuleThickness = void 0;
		this._fontMetrics = void 0;
		this.style = data.style;
		this.color = data.color;
		this.size = data.size || Options.BASESIZE;
		this.textSize = data.textSize || this.size;
		this.phantom = !!data.phantom;
		this.font = data.font || "";
		this.fontFamily = data.fontFamily || "";
		this.fontWeight = data.fontWeight || "";
		this.fontShape = data.fontShape || "";
		this.sizeMultiplier = sizeMultipliers[this.size - 1];
		this.maxSize = data.maxSize;
		this.minRuleThickness = data.minRuleThickness;
		this._fontMetrics = void 0;
	}
	/**
	* Returns a new options object with the same properties as "this".  Properties
	* from "extension" will be copied to the new options object.
	*/
	extend(extension) {
		var data = {
			style: this.style,
			size: this.size,
			textSize: this.textSize,
			color: this.color,
			phantom: this.phantom,
			font: this.font,
			fontFamily: this.fontFamily,
			fontWeight: this.fontWeight,
			fontShape: this.fontShape,
			maxSize: this.maxSize,
			minRuleThickness: this.minRuleThickness
		};
		Object.assign(data, extension);
		return new Options(data);
	}
	/**
	* Return an options object with the given style. If `this.style === style`,
	* returns `this`.
	*/
	havingStyle(style) {
		if (this.style === style) return this;
		else return this.extend({
			style,
			size: sizeAtStyle(this.textSize, style)
		});
	}
	/**
	* Return an options object with a cramped version of the current style. If
	* the current style is cramped, returns `this`.
	*/
	havingCrampedStyle() {
		return this.havingStyle(this.style.cramp());
	}
	/**
	* Return an options object with the given size and in at least `\textstyle`.
	* Returns `this` if appropriate.
	*/
	havingSize(size) {
		if (this.size === size && this.textSize === size) return this;
		else return this.extend({
			style: this.style.text(),
			size,
			textSize: size,
			sizeMultiplier: sizeMultipliers[size - 1]
		});
	}
	/**
	* Like `this.havingSize(BASESIZE).havingStyle(style)`. If `style` is omitted,
	* changes to at least `\textstyle`.
	*/
	havingBaseStyle(style) {
		style = style || this.style.text();
		var wantSize = sizeAtStyle(Options.BASESIZE, style);
		if (this.size === wantSize && this.textSize === Options.BASESIZE && this.style === style) return this;
		else return this.extend({
			style,
			size: wantSize
		});
	}
	/**
	* Remove the effect of sizing changes such as \Huge.
	* Keep the effect of the current style, such as \scriptstyle.
	*/
	havingBaseSizing() {
		var size;
		switch (this.style.id) {
			case 4:
			case 5:
				size = 3;
				break;
			case 6:
			case 7:
				size = 1;
				break;
			default: size = 6;
		}
		return this.extend({
			style: this.style.text(),
			size
		});
	}
	/**
	* Create a new options object with the given color.
	*/
	withColor(color) {
		return this.extend({ color });
	}
	/**
	* Create a new options object with "phantom" set to true.
	*/
	withPhantom() {
		return this.extend({ phantom: true });
	}
	/**
	* Creates a new options object with the given math font or old text font.
	* @type {[type]}
	*/
	withFont(font) {
		return this.extend({ font });
	}
	/**
	* Create a new options objects with the given fontFamily.
	*/
	withTextFontFamily(fontFamily) {
		return this.extend({
			fontFamily,
			font: ""
		});
	}
	/**
	* Creates a new options object with the given font weight
	*/
	withTextFontWeight(fontWeight) {
		return this.extend({
			fontWeight,
			font: ""
		});
	}
	/**
	* Creates a new options object with the given font weight
	*/
	withTextFontShape(fontShape) {
		return this.extend({
			fontShape,
			font: ""
		});
	}
	/**
	* Return the CSS sizing classes required to switch from enclosing options
	* `oldOptions` to `this`. Returns an array of classes.
	*/
	sizingClasses(oldOptions) {
		if (oldOptions.size !== this.size) return [
			"sizing",
			"reset-size" + oldOptions.size,
			"size" + this.size
		];
		else return [];
	}
	/**
	* Return the CSS sizing classes required to switch to the base size. Like
	* `this.havingSize(BASESIZE).sizingClasses(this)`.
	*/
	baseSizingClasses() {
		if (this.size !== Options.BASESIZE) return [
			"sizing",
			"reset-size" + this.size,
			"size" + Options.BASESIZE
		];
		else return [];
	}
	/**
	* Return the font metrics for this size.
	*/
	fontMetrics() {
		if (!this._fontMetrics) this._fontMetrics = getGlobalMetrics(this.size);
		return this._fontMetrics;
	}
	/**
	* Gets the CSS color of the current options object
	*/
	getColor() {
		if (this.phantom) return "transparent";
		else return this.color;
	}
};
/**
* The base size index.
*/
Options.BASESIZE = 6;
var optionsFromSettings = function optionsFromSettings(settings) {
	return new Options({
		style: settings.displayMode ? Style$1.DISPLAY : Style$1.TEXT,
		maxSize: settings.maxSize,
		minRuleThickness: settings.minRuleThickness
	});
};
var displayWrap = function displayWrap(node, settings) {
	if (settings.displayMode) {
		var classes = ["katex-display"];
		if (settings.leqno) classes.push("leqno");
		if (settings.fleqn) classes.push("fleqn");
		node = makeSpan(classes, [node]);
	}
	return node;
};
var buildTree = function buildTree(tree, expression, settings) {
	var options = optionsFromSettings(settings);
	var katexNode;
	if (settings.output === "mathml") return buildMathML(tree, expression, options, settings.displayMode, true);
	else if (settings.output === "html") katexNode = makeSpan(["katex"], [buildHTML(tree, options)]);
	else katexNode = makeSpan(["katex"], [buildMathML(tree, expression, options, settings.displayMode, false), buildHTML(tree, options)]);
	return displayWrap(katexNode, settings);
};
var buildHTMLTree = function buildHTMLTree(tree, expression, settings) {
	return displayWrap(makeSpan(["katex"], [buildHTML(tree, optionsFromSettings(settings))]), settings);
};
/**
* This file provides support to buildMathML.js and buildHTML.js
* for stretchy wide elements rendered from SVG files
* and other CSS trickery.
*/
var stretchyCodePoint = {
	widehat: "^",
	widecheck: "ˇ",
	widetilde: "~",
	utilde: "~",
	overleftarrow: "←",
	underleftarrow: "←",
	xleftarrow: "←",
	overrightarrow: "→",
	underrightarrow: "→",
	xrightarrow: "→",
	underbrace: "⏟",
	overbrace: "⏞",
	underbracket: "⎵",
	overbracket: "⎴",
	overgroup: "⏠",
	undergroup: "⏡",
	overleftrightarrow: "↔",
	underleftrightarrow: "↔",
	xleftrightarrow: "↔",
	Overrightarrow: "⇒",
	xRightarrow: "⇒",
	overleftharpoon: "↼",
	xleftharpoonup: "↼",
	overrightharpoon: "⇀",
	xrightharpoonup: "⇀",
	xLeftarrow: "⇐",
	xLeftrightarrow: "⇔",
	xhookleftarrow: "↩",
	xhookrightarrow: "↪",
	xmapsto: "↦",
	xrightharpoondown: "⇁",
	xleftharpoondown: "↽",
	xrightleftharpoons: "⇌",
	xleftrightharpoons: "⇋",
	xtwoheadleftarrow: "↞",
	xtwoheadrightarrow: "↠",
	xlongequal: "=",
	xtofrom: "⇄",
	xrightleftarrows: "⇄",
	xrightequilibrium: "⇌",
	xleftequilibrium: "⇋",
	"\\cdrightarrow": "→",
	"\\cdleftarrow": "←",
	"\\cdlongequal": "="
};
var stretchyMathML = function stretchyMathML(label) {
	var node = new MathNode("mo", [new TextNode(stretchyCodePoint[label.replace(/^\\/, "")])]);
	node.setAttribute("stretchy", "true");
	return node;
};
var katexImagesData = {
	overrightarrow: [
		["rightarrow"],
		.888,
		522,
		"xMaxYMin"
	],
	overleftarrow: [
		["leftarrow"],
		.888,
		522,
		"xMinYMin"
	],
	underrightarrow: [
		["rightarrow"],
		.888,
		522,
		"xMaxYMin"
	],
	underleftarrow: [
		["leftarrow"],
		.888,
		522,
		"xMinYMin"
	],
	xrightarrow: [
		["rightarrow"],
		1.469,
		522,
		"xMaxYMin"
	],
	"\\cdrightarrow": [
		["rightarrow"],
		3,
		522,
		"xMaxYMin"
	],
	xleftarrow: [
		["leftarrow"],
		1.469,
		522,
		"xMinYMin"
	],
	"\\cdleftarrow": [
		["leftarrow"],
		3,
		522,
		"xMinYMin"
	],
	Overrightarrow: [
		["doublerightarrow"],
		.888,
		560,
		"xMaxYMin"
	],
	xRightarrow: [
		["doublerightarrow"],
		1.526,
		560,
		"xMaxYMin"
	],
	xLeftarrow: [
		["doubleleftarrow"],
		1.526,
		560,
		"xMinYMin"
	],
	overleftharpoon: [
		["leftharpoon"],
		.888,
		522,
		"xMinYMin"
	],
	xleftharpoonup: [
		["leftharpoon"],
		.888,
		522,
		"xMinYMin"
	],
	xleftharpoondown: [
		["leftharpoondown"],
		.888,
		522,
		"xMinYMin"
	],
	overrightharpoon: [
		["rightharpoon"],
		.888,
		522,
		"xMaxYMin"
	],
	xrightharpoonup: [
		["rightharpoon"],
		.888,
		522,
		"xMaxYMin"
	],
	xrightharpoondown: [
		["rightharpoondown"],
		.888,
		522,
		"xMaxYMin"
	],
	xlongequal: [
		["longequal"],
		.888,
		334,
		"xMinYMin"
	],
	"\\cdlongequal": [
		["longequal"],
		3,
		334,
		"xMinYMin"
	],
	xtwoheadleftarrow: [
		["twoheadleftarrow"],
		.888,
		334,
		"xMinYMin"
	],
	xtwoheadrightarrow: [
		["twoheadrightarrow"],
		.888,
		334,
		"xMaxYMin"
	],
	overleftrightarrow: [
		["leftarrow", "rightarrow"],
		.888,
		522
	],
	overbrace: [
		[
			"leftbrace",
			"midbrace",
			"rightbrace"
		],
		1.6,
		548
	],
	underbrace: [
		[
			"leftbraceunder",
			"midbraceunder",
			"rightbraceunder"
		],
		1.6,
		548
	],
	underleftrightarrow: [
		["leftarrow", "rightarrow"],
		.888,
		522
	],
	xleftrightarrow: [
		["leftarrow", "rightarrow"],
		1.75,
		522
	],
	xLeftrightarrow: [
		["doubleleftarrow", "doublerightarrow"],
		1.75,
		560
	],
	xrightleftharpoons: [
		["leftharpoondownplus", "rightharpoonplus"],
		1.75,
		716
	],
	xleftrightharpoons: [
		["leftharpoonplus", "rightharpoondownplus"],
		1.75,
		716
	],
	xhookleftarrow: [
		["leftarrow", "righthook"],
		1.08,
		522
	],
	xhookrightarrow: [
		["lefthook", "rightarrow"],
		1.08,
		522
	],
	overlinesegment: [
		["leftlinesegment", "rightlinesegment"],
		.888,
		522
	],
	underlinesegment: [
		["leftlinesegment", "rightlinesegment"],
		.888,
		522
	],
	overbracket: [
		["leftbracketover", "rightbracketover"],
		1.6,
		440
	],
	underbracket: [
		["leftbracketunder", "rightbracketunder"],
		1.6,
		410
	],
	overgroup: [
		["leftgroup", "rightgroup"],
		.888,
		342
	],
	undergroup: [
		["leftgroupunder", "rightgroupunder"],
		.888,
		342
	],
	xmapsto: [
		["leftmapsto", "rightarrow"],
		1.5,
		522
	],
	xtofrom: [
		["leftToFrom", "rightToFrom"],
		1.75,
		528
	],
	xrightleftarrows: [
		["baraboveleftarrow", "rightarrowabovebar"],
		1.75,
		901
	],
	xrightequilibrium: [
		["baraboveshortleftharpoon", "rightharpoonaboveshortbar"],
		1.75,
		716
	],
	xleftequilibrium: [
		["shortbaraboveleftharpoon", "shortrightharpoonabovebar"],
		1.75,
		716
	]
};
var wideAccentLabels = /* @__PURE__ */ new Set([
	"widehat",
	"widecheck",
	"widetilde",
	"utilde"
]);
var stretchySvg = function stretchySvg(group, options) {
	function buildSvgSpan_() {
		var viewBoxWidth = 4e5;
		var label = group.label.slice(1);
		if (wideAccentLabels.has(label) && "base" in group) {
			var numChars = group.base.type === "ordgroup" ? group.base.body.length : 1;
			var viewBoxHeight;
			var pathName;
			var _height;
			if (numChars > 5) if (label === "widehat" || label === "widecheck") {
				viewBoxHeight = 420;
				viewBoxWidth = 2364;
				_height = .42;
				pathName = label + "4";
			} else {
				viewBoxHeight = 312;
				viewBoxWidth = 2340;
				_height = .34;
				pathName = "tilde4";
			}
			else {
				var imgIndex = [
					1,
					1,
					2,
					2,
					3,
					3
				][numChars];
				if (label === "widehat" || label === "widecheck") {
					viewBoxWidth = [
						0,
						1062,
						2364,
						2364,
						2364
					][imgIndex];
					viewBoxHeight = [
						0,
						239,
						300,
						360,
						420
					][imgIndex];
					_height = [
						0,
						.24,
						.3,
						.3,
						.36,
						.42
					][imgIndex];
					pathName = label + imgIndex;
				} else {
					viewBoxWidth = [
						0,
						600,
						1033,
						2339,
						2340
					][imgIndex];
					viewBoxHeight = [
						0,
						260,
						286,
						306,
						312
					][imgIndex];
					_height = [
						0,
						.26,
						.286,
						.3,
						.306,
						.34
					][imgIndex];
					pathName = "tilde" + imgIndex;
				}
			}
			return {
				span: makeSvgSpan([], [new SvgNode([new PathNode(pathName)], {
					"width": "100%",
					"height": makeEm(_height),
					"viewBox": "0 0 " + viewBoxWidth + " " + viewBoxHeight,
					"preserveAspectRatio": "none"
				})], options),
				minWidth: 0,
				height: _height
			};
		} else {
			var spans = [];
			var data = katexImagesData[label];
			if (!data) throw new Error("No SVG data for \"" + label + "\".");
			var [paths, _minWidth, _viewBoxHeight] = data;
			var _height2 = _viewBoxHeight / 1e3;
			var numSvgChildren = paths.length;
			var widthClasses;
			var aligns;
			if (numSvgChildren === 1) {
				if (data.length !== 4) throw new Error("Expected 4-tuple for single-path SVG data \"" + label + "\".");
				widthClasses = ["hide-tail"];
				aligns = [data[3]];
			} else if (numSvgChildren === 2) {
				widthClasses = ["halfarrow-left", "halfarrow-right"];
				aligns = ["xMinYMin", "xMaxYMin"];
			} else if (numSvgChildren === 3) {
				widthClasses = [
					"brace-left",
					"brace-center",
					"brace-right"
				];
				aligns = [
					"xMinYMin",
					"xMidYMin",
					"xMaxYMin"
				];
			} else throw new Error("Correct katexImagesData or update code here to support\n                    " + numSvgChildren + " children.");
			for (var i = 0; i < numSvgChildren; i++) {
				var _svgNode = new SvgNode([new PathNode(paths[i])], {
					"width": "400em",
					"height": makeEm(_height2),
					"viewBox": "0 0 " + viewBoxWidth + " " + _viewBoxHeight,
					"preserveAspectRatio": aligns[i] + " slice"
				});
				var _span = makeSvgSpan([widthClasses[i]], [_svgNode], options);
				if (numSvgChildren === 1) return {
					span: _span,
					minWidth: _minWidth,
					height: _height2
				};
				else {
					_span.style.height = makeEm(_height2);
					spans.push(_span);
				}
			}
			return {
				span: makeSpan(["stretchy"], spans, options),
				minWidth: _minWidth,
				height: _height2
			};
		}
	}
	var { span, minWidth, height } = buildSvgSpan_();
	span.height = height;
	span.style.height = makeEm(height);
	if (minWidth > 0) span.style.minWidth = makeEm(minWidth);
	return span;
};
var stretchyEnclose = function stretchyEnclose(inner, label, topPad, bottomPad, options) {
	var img;
	var totalHeight = inner.height + inner.depth + topPad + bottomPad;
	if (/fbox|color|angl/.test(label)) {
		img = makeSpan(["stretchy", label], [], options);
		if (label === "fbox") {
			var color = options.color && options.getColor();
			if (color) img.style.borderColor = color;
		}
	} else {
		var lines = [];
		if (/^[bx]cancel$/.test(label)) lines.push(new LineNode({
			"x1": "0",
			"y1": "0",
			"x2": "100%",
			"y2": "100%",
			"stroke-width": "0.046em"
		}));
		if (/^x?cancel$/.test(label)) lines.push(new LineNode({
			"x1": "0",
			"y1": "100%",
			"x2": "100%",
			"y2": "0",
			"stroke-width": "0.046em"
		}));
		img = makeSvgSpan([], [new SvgNode(lines, {
			"width": "100%",
			"height": makeEm(totalHeight)
		})], options);
	}
	img.height = totalHeight;
	img.style.height = makeEm(totalHeight);
	return img;
};
/**
* Small module for atom-group constants and type guard.  Kept separate from
* `symbols.ts` so that consumers (notably `contrib/render-a11y-string`) can
* pull in `isAtom` without dragging in the ~870-line symbol tables.
*/
var ATOMS = {
	"bin": 1,
	"close": 1,
	"inner": 1,
	"open": 1,
	"punct": 1,
	"rel": 1
};
var NON_ATOMS = {
	"accent-token": 1,
	"mathord": 1,
	"op-token": 1,
	"spacing": 1,
	"textord": 1
};
function isAtom(value) {
	return value in ATOMS;
}
/**
* Asserts that the node is of the given type and returns it with stricter
* typing. Throws if the node's type does not match.
*/
function assertNodeType(node, type) {
	if (!node || node.type !== type) throw new Error("Expected node of type " + type + ", but got " + (node ? "node of type " + node.type : String(node)));
	return node;
}
/**
* Returns the node more strictly typed iff it is of the given type. Otherwise,
* returns null.
*/
function assertSymbolNodeType(node) {
	var typedNode = checkSymbolNodeType(node);
	if (!typedNode) throw new Error("Expected node of symbol group type, but got " + (node ? "node of type " + node.type : String(node)));
	return typedNode;
}
/**
* Returns the node more strictly typed iff it is of the given type. Otherwise,
* returns null.
*/
function checkSymbolNodeType(node) {
	if (node && (node.type === "atom" || NON_ATOMS.hasOwnProperty(node.type))) return node;
	return null;
}
var getBaseSymbol = (group) => {
	if (group instanceof SymbolNode) return group;
	if (hasHtmlDomChildren(group) && group.children.length === 1) return getBaseSymbol(group.children[0]);
};
var htmlBuilder$a = (grp, options) => {
	var base;
	var group;
	var supSubGroup;
	if (grp && grp.type === "supsub") {
		group = assertNodeType(grp.base, "accent");
		base = group.base;
		grp.base = base;
		supSubGroup = assertSpan(buildGroup$1(grp, options));
		grp.base = group;
	} else {
		group = assertNodeType(grp, "accent");
		base = group.base;
	}
	var body = buildGroup$1(base, options.havingCrampedStyle());
	var mustShift = group.isShifty && isCharacterBox(base);
	var skew = 0;
	if (mustShift) {
		var _getBaseSymbol$skew, _getBaseSymbol;
		skew = (_getBaseSymbol$skew = (_getBaseSymbol = getBaseSymbol(body)) == null ? void 0 : _getBaseSymbol.skew) != null ? _getBaseSymbol$skew : 0;
	}
	var accentBelow = group.label === "\\c";
	var clearance = accentBelow ? body.height + body.depth : Math.min(body.height, options.fontMetrics().xHeight);
	var accentBody;
	if (!group.isStretchy) {
		var accent;
		var width;
		if (group.label === "\\vec") {
			accent = staticSvg("vec", options);
			width = svgData.vec[1];
		} else {
			accent = makeOrd({
				type: "textord",
				mode: group.mode,
				text: group.label
			}, options, "textord");
			accent = assertSymbolDomNode(accent);
			accent.italic = 0;
			width = accent.width;
			if (accentBelow) clearance += accent.depth;
		}
		accentBody = makeSpan(["accent-body"], [accent]);
		var accentFull = group.label === "\\textcircled";
		if (accentFull) {
			accentBody.classes.push("accent-full");
			clearance = body.height;
		}
		var left = skew;
		if (!accentFull) left -= width / 2;
		accentBody.style.left = makeEm(left);
		if (group.label === "\\textcircled") accentBody.style.top = ".2em";
		accentBody = makeVList({
			positionType: "firstBaseline",
			children: [
				{
					type: "elem",
					elem: body
				},
				{
					type: "kern",
					size: -clearance
				},
				{
					type: "elem",
					elem: accentBody
				}
			]
		});
	} else {
		accentBody = stretchySvg(group, options);
		accentBody = makeVList({
			positionType: "firstBaseline",
			children: [{
				type: "elem",
				elem: body
			}, {
				type: "elem",
				elem: accentBody,
				wrapperClasses: ["svg-align"],
				wrapperStyle: skew > 0 ? {
					width: "calc(100% - " + makeEm(2 * skew) + ")",
					marginLeft: makeEm(2 * skew)
				} : void 0
			}]
		});
	}
	var accentWrap = makeSpan(["mord", "accent"], [accentBody], options);
	if (supSubGroup) {
		supSubGroup.children[0] = accentWrap;
		supSubGroup.height = Math.max(accentWrap.height, supSubGroup.height);
		supSubGroup.classes[0] = "mord";
		return supSubGroup;
	} else return accentWrap;
};
var mathmlBuilder$9 = (group, options) => {
	var accentNode = group.isStretchy ? stretchyMathML(group.label) : new MathNode("mo", [makeText(group.label, group.mode)]);
	var node = new MathNode("mover", [buildGroup(group.base, options), accentNode]);
	node.setAttribute("accent", "true");
	return node;
};
var NON_STRETCHY_ACCENT_REGEX = new RegExp([
	"\\acute",
	"\\grave",
	"\\ddot",
	"\\tilde",
	"\\bar",
	"\\breve",
	"\\check",
	"\\hat",
	"\\vec",
	"\\dot",
	"\\mathring"
].map((accent) => "\\" + accent).join("|"));
defineFunction({
	type: "accent",
	names: [
		"\\acute",
		"\\grave",
		"\\ddot",
		"\\tilde",
		"\\bar",
		"\\breve",
		"\\check",
		"\\hat",
		"\\vec",
		"\\dot",
		"\\mathring",
		"\\widecheck",
		"\\widehat",
		"\\widetilde",
		"\\overrightarrow",
		"\\overleftarrow",
		"\\Overrightarrow",
		"\\overleftrightarrow",
		"\\overgroup",
		"\\overlinesegment",
		"\\overleftharpoon",
		"\\overrightharpoon"
	],
	props: { numArgs: 1 },
	handler: (context, args) => {
		var base = normalizeArgument(args[0]);
		var isStretchy = !NON_STRETCHY_ACCENT_REGEX.test(context.funcName);
		var isShifty = !isStretchy || context.funcName === "\\widehat" || context.funcName === "\\widetilde" || context.funcName === "\\widecheck";
		return {
			type: "accent",
			mode: context.parser.mode,
			label: context.funcName,
			isStretchy,
			isShifty,
			base
		};
	},
	htmlBuilder: htmlBuilder$a,
	mathmlBuilder: mathmlBuilder$9
});
defineFunction({
	type: "accent",
	names: [
		"\\'",
		"\\`",
		"\\^",
		"\\~",
		"\\=",
		"\\u",
		"\\.",
		"\\\"",
		"\\c",
		"\\r",
		"\\H",
		"\\v",
		"\\textcircled"
	],
	props: {
		numArgs: 1,
		allowedInText: true,
		allowedInMath: true,
		argTypes: ["primitive"]
	},
	handler: (context, args) => {
		var base = args[0];
		var mode = context.parser.mode;
		if (mode === "math") {
			context.parser.settings.reportNonstrict("mathVsTextAccents", "LaTeX's accent " + context.funcName + " works only in text mode");
			mode = "text";
		}
		return {
			type: "accent",
			mode,
			label: context.funcName,
			isStretchy: false,
			isShifty: true,
			base
		};
	},
	htmlBuilder: htmlBuilder$a,
	mathmlBuilder: mathmlBuilder$9
});
defineFunction({
	type: "accentUnder",
	names: [
		"\\underleftarrow",
		"\\underrightarrow",
		"\\underleftrightarrow",
		"\\undergroup",
		"\\underlinesegment",
		"\\utilde"
	],
	props: { numArgs: 1 },
	handler: (_ref, args) => {
		var { parser, funcName } = _ref;
		var base = args[0];
		return {
			type: "accentUnder",
			mode: parser.mode,
			label: funcName,
			base
		};
	},
	htmlBuilder: (group, options) => {
		var innerGroup = buildGroup$1(group.base, options);
		var accentBody = stretchySvg(group, options);
		var kern = group.label === "\\utilde" ? .12 : 0;
		return makeSpan(["mord", "accentunder"], [makeVList({
			positionType: "top",
			positionData: innerGroup.height,
			children: [
				{
					type: "elem",
					elem: accentBody,
					wrapperClasses: ["svg-align"]
				},
				{
					type: "kern",
					size: kern
				},
				{
					type: "elem",
					elem: innerGroup
				}
			]
		})], options);
	},
	mathmlBuilder: (group, options) => {
		var accentNode = stretchyMathML(group.label);
		var node = new MathNode("munder", [buildGroup(group.base, options), accentNode]);
		node.setAttribute("accentunder", "true");
		return node;
	}
});
var paddedNode = (group) => {
	var node = new MathNode("mpadded", group ? [group] : []);
	node.setAttribute("width", "+0.6em");
	node.setAttribute("lspace", "0.3em");
	return node;
};
defineFunction({
	type: "xArrow",
	names: [
		"\\xleftarrow",
		"\\xrightarrow",
		"\\xLeftarrow",
		"\\xRightarrow",
		"\\xleftrightarrow",
		"\\xLeftrightarrow",
		"\\xhookleftarrow",
		"\\xhookrightarrow",
		"\\xmapsto",
		"\\xrightharpoondown",
		"\\xrightharpoonup",
		"\\xleftharpoondown",
		"\\xleftharpoonup",
		"\\xrightleftharpoons",
		"\\xleftrightharpoons",
		"\\xlongequal",
		"\\xtwoheadrightarrow",
		"\\xtwoheadleftarrow",
		"\\xtofrom",
		"\\xrightleftarrows",
		"\\xrightequilibrium",
		"\\xleftequilibrium",
		"\\\\cdrightarrow",
		"\\\\cdleftarrow",
		"\\\\cdlongequal"
	],
	props: {
		numArgs: 1,
		numOptionalArgs: 1
	},
	handler(_ref, args, optArgs) {
		var { parser, funcName } = _ref;
		return {
			type: "xArrow",
			mode: parser.mode,
			label: funcName,
			body: args[0],
			below: optArgs[0]
		};
	},
	htmlBuilder(group, options) {
		var style = options.style;
		var newOptions = options.havingStyle(style.sup());
		var upperGroup = wrapFragment(buildGroup$1(group.body, newOptions, options), options);
		var arrowPrefix = group.label.slice(0, 2) === "\\x" ? "x" : "cd";
		upperGroup.classes.push(arrowPrefix + "-arrow-pad");
		var lowerGroup;
		if (group.below) {
			newOptions = options.havingStyle(style.sub());
			lowerGroup = wrapFragment(buildGroup$1(group.below, newOptions, options), options);
			lowerGroup.classes.push(arrowPrefix + "-arrow-pad");
		}
		var arrowBody = stretchySvg(group, options);
		var arrowShift = -options.fontMetrics().axisHeight + .5 * arrowBody.height;
		var upperShift = -options.fontMetrics().axisHeight - .5 * arrowBody.height - .111;
		if (upperGroup.depth > .25 || group.label === "\\xleftequilibrium") upperShift -= upperGroup.depth;
		var vlist;
		if (lowerGroup) {
			var lowerShift = -options.fontMetrics().axisHeight + lowerGroup.height + .5 * arrowBody.height + .111;
			vlist = makeVList({
				positionType: "individualShift",
				children: [
					{
						type: "elem",
						elem: upperGroup,
						shift: upperShift
					},
					{
						type: "elem",
						elem: arrowBody,
						shift: arrowShift,
						wrapperClasses: ["svg-align"]
					},
					{
						type: "elem",
						elem: lowerGroup,
						shift: lowerShift
					}
				]
			});
		} else vlist = makeVList({
			positionType: "individualShift",
			children: [{
				type: "elem",
				elem: upperGroup,
				shift: upperShift
			}, {
				type: "elem",
				elem: arrowBody,
				shift: arrowShift,
				wrapperClasses: ["svg-align"]
			}]
		});
		return makeSpan(["mrel", "x-arrow"], [vlist], options);
	},
	mathmlBuilder(group, options) {
		var arrowNode = stretchyMathML(group.label);
		arrowNode.setAttribute("minsize", group.label.charAt(0) === "x" ? "1.75em" : "3.0em");
		var node;
		if (group.body) {
			var upperNode = paddedNode(buildGroup(group.body, options));
			if (group.below) node = new MathNode("munderover", [
				arrowNode,
				paddedNode(buildGroup(group.below, options)),
				upperNode
			]);
			else node = new MathNode("mover", [arrowNode, upperNode]);
		} else if (group.below) node = new MathNode("munder", [arrowNode, paddedNode(buildGroup(group.below, options))]);
		else {
			node = paddedNode();
			node = new MathNode("mover", [arrowNode, node]);
		}
		return node;
	}
});
function htmlBuilder$9(group, options) {
	var elements = buildExpression$1(group.body, options, true);
	return makeSpan([group.mclass], elements, options);
}
function mathmlBuilder$8(group, options) {
	var node;
	var inner = buildExpression(group.body, options);
	if (group.mclass === "minner") node = new MathNode("mpadded", inner);
	else if (group.mclass === "mord") if (group.isCharacterBox) {
		node = inner[0];
		node.type = "mi";
	} else node = new MathNode("mi", inner);
	else {
		if (group.isCharacterBox) {
			node = inner[0];
			node.type = "mo";
		} else node = new MathNode("mo", inner);
		if (group.mclass === "mbin") {
			node.attributes.lspace = "0.22em";
			node.attributes.rspace = "0.22em";
		} else if (group.mclass === "mpunct") {
			node.attributes.lspace = "0em";
			node.attributes.rspace = "0.17em";
		} else if (group.mclass === "mopen" || group.mclass === "mclose") {
			node.attributes.lspace = "0em";
			node.attributes.rspace = "0em";
		} else if (group.mclass === "minner") {
			node.attributes.lspace = "0.0556em";
			node.attributes.width = "+0.1111em";
		}
	}
	return node;
}
defineFunction({
	type: "mclass",
	names: [
		"\\mathord",
		"\\mathbin",
		"\\mathrel",
		"\\mathopen",
		"\\mathclose",
		"\\mathpunct",
		"\\mathinner"
	],
	props: {
		numArgs: 1,
		primitive: true
	},
	handler(_ref, args) {
		var { parser, funcName } = _ref;
		var body = args[0];
		return {
			type: "mclass",
			mode: parser.mode,
			mclass: "m" + funcName.slice(5),
			body: ordargument(body),
			isCharacterBox: isCharacterBox(body)
		};
	},
	htmlBuilder: htmlBuilder$9,
	mathmlBuilder: mathmlBuilder$8
});
var binrelClass = (arg) => {
	var atom = arg.type === "ordgroup" && arg.body.length ? arg.body[0] : arg;
	if (atom.type === "atom" && (atom.family === "bin" || atom.family === "rel")) return "m" + atom.family;
	else return "mord";
};
defineFunction({
	type: "mclass",
	names: ["\\@binrel"],
	props: { numArgs: 2 },
	handler(_ref2, args) {
		var { parser } = _ref2;
		return {
			type: "mclass",
			mode: parser.mode,
			mclass: binrelClass(args[0]),
			body: ordargument(args[1]),
			isCharacterBox: isCharacterBox(args[1])
		};
	}
});
defineFunction({
	type: "mclass",
	names: [
		"\\stackrel",
		"\\overset",
		"\\underset"
	],
	props: { numArgs: 2 },
	handler(_ref3, args) {
		var { parser, funcName } = _ref3;
		var baseArg = args[1];
		var shiftedArg = args[0];
		var mclass;
		if (funcName !== "\\stackrel") mclass = binrelClass(baseArg);
		else mclass = "mrel";
		var baseOp = {
			type: "op",
			mode: baseArg.mode,
			limits: true,
			alwaysHandleSupSub: true,
			parentIsSupSub: false,
			symbol: false,
			suppressBaseShift: funcName !== "\\stackrel",
			body: ordargument(baseArg)
		};
		var supsub = {
			type: "supsub",
			mode: shiftedArg.mode,
			base: baseOp,
			sup: funcName === "\\underset" ? null : shiftedArg,
			sub: funcName === "\\underset" ? shiftedArg : null
		};
		return {
			type: "mclass",
			mode: parser.mode,
			mclass,
			body: [supsub],
			isCharacterBox: isCharacterBox(supsub)
		};
	},
	htmlBuilder: htmlBuilder$9,
	mathmlBuilder: mathmlBuilder$8
});
defineFunction({
	type: "pmb",
	names: ["\\pmb"],
	props: {
		numArgs: 1,
		allowedInText: true
	},
	handler(_ref, args) {
		var { parser } = _ref;
		return {
			type: "pmb",
			mode: parser.mode,
			mclass: binrelClass(args[0]),
			body: ordargument(args[0])
		};
	},
	htmlBuilder(group, options) {
		var elements = buildExpression$1(group.body, options, true);
		var node = makeSpan([group.mclass], elements, options);
		node.style.textShadow = "0.02em 0.01em 0.04px";
		return node;
	},
	mathmlBuilder(group, style) {
		var node = new MathNode("mstyle", buildExpression(group.body, style));
		node.setAttribute("style", "text-shadow: 0.02em 0.01em 0.04px");
		return node;
	}
});
var cdArrowFunctionName = {
	">": "\\\\cdrightarrow",
	"<": "\\\\cdleftarrow",
	"=": "\\\\cdlongequal",
	"A": "\\uparrow",
	"V": "\\downarrow",
	"|": "\\Vert",
	".": "no arrow"
};
var newCell = () => {
	return {
		type: "styling",
		body: [],
		mode: "math",
		style: "display",
		resetFont: true
	};
};
var isStartOfArrow = (node) => {
	return node.type === "textord" && node.text === "@";
};
var isLabelEnd = (node, endChar) => {
	return (node.type === "mathord" || node.type === "atom") && node.text === endChar;
};
function cdArrow(arrowChar, labels, parser) {
	var funcName = cdArrowFunctionName[arrowChar];
	switch (funcName) {
		case "\\\\cdrightarrow":
		case "\\\\cdleftarrow": return parser.callFunction(funcName, [labels[0]], [labels[1]]);
		case "\\uparrow":
		case "\\downarrow":
			var leftLabel = parser.callFunction("\\\\cdleft", [labels[0]], []);
			var bareArrow = {
				type: "atom",
				text: funcName,
				mode: "math",
				family: "rel"
			};
			var arrowGroup = {
				type: "ordgroup",
				mode: "math",
				body: [
					leftLabel,
					parser.callFunction("\\Big", [bareArrow], []),
					parser.callFunction("\\\\cdright", [labels[1]], [])
				]
			};
			return parser.callFunction("\\\\cdparent", [arrowGroup], []);
		case "\\\\cdlongequal": return parser.callFunction("\\\\cdlongequal", [], []);
		case "\\Vert": return parser.callFunction("\\Big", [{
			type: "textord",
			text: "\\Vert",
			mode: "math"
		}], []);
		default: return {
			type: "textord",
			text: " ",
			mode: "math"
		};
	}
}
function parseCD(parser) {
	var parsedRows = [];
	parser.gullet.beginGroup();
	parser.gullet.macros.set("\\cr", "\\\\\\relax");
	parser.gullet.beginGroup();
	while (true) {
		parsedRows.push(parser.parseExpression(false, "\\\\"));
		parser.gullet.endGroup();
		parser.gullet.beginGroup();
		var next = parser.fetch().text;
		if (next === "&" || next === "\\\\") parser.consume();
		else if (next === "\\end") {
			if (parsedRows[parsedRows.length - 1].length === 0) parsedRows.pop();
			break;
		} else throw new ParseError("Expected \\\\ or \\cr or \\end", parser.nextToken);
	}
	var row = [];
	var body = [row];
	for (var i = 0; i < parsedRows.length; i++) {
		var rowNodes = parsedRows[i];
		var cell = newCell();
		for (var j = 0; j < rowNodes.length; j++) if (!isStartOfArrow(rowNodes[j])) cell.body.push(rowNodes[j]);
		else {
			row.push(cell);
			j += 1;
			var arrowChar = assertSymbolNodeType(rowNodes[j]).text;
			var labels = new Array(2);
			labels[0] = {
				type: "ordgroup",
				mode: "math",
				body: []
			};
			labels[1] = {
				type: "ordgroup",
				mode: "math",
				body: []
			};
			if ("=|.".includes(arrowChar));
			else if ("<>AV".includes(arrowChar)) for (var labelNum = 0; labelNum < 2; labelNum++) {
				var inLabel = true;
				for (var k = j + 1; k < rowNodes.length; k++) {
					if (isLabelEnd(rowNodes[k], arrowChar)) {
						inLabel = false;
						j = k;
						break;
					}
					if (isStartOfArrow(rowNodes[k])) throw new ParseError("Missing a " + arrowChar + " character to complete a CD arrow.", rowNodes[k]);
					labels[labelNum].body.push(rowNodes[k]);
				}
				if (inLabel) throw new ParseError("Missing a " + arrowChar + " character to complete a CD arrow.", rowNodes[j]);
			}
			else throw new ParseError("Expected one of \"<>AV=|.\" after @", rowNodes[j]);
			var wrappedArrow = {
				type: "styling",
				body: [cdArrow(arrowChar, labels, parser)],
				mode: "math",
				style: "display",
				resetFont: true
			};
			row.push(wrappedArrow);
			cell = newCell();
		}
		if (i % 2 === 0) row.push(cell);
		else row.shift();
		row = [];
		body.push(row);
	}
	parser.gullet.endGroup();
	parser.gullet.endGroup();
	return {
		type: "array",
		mode: "math",
		body,
		arraystretch: 1,
		addJot: true,
		rowGaps: [null],
		cols: new Array(body[0].length).fill({
			type: "align",
			align: "c",
			pregap: .25,
			postgap: .25
		}),
		colSeparationType: "CD",
		hLinesBeforeRow: new Array(body.length + 1).fill([])
	};
}
defineFunction({
	type: "cdlabel",
	names: ["\\\\cdleft", "\\\\cdright"],
	props: { numArgs: 1 },
	handler(_ref, args) {
		var { parser, funcName } = _ref;
		return {
			type: "cdlabel",
			mode: parser.mode,
			side: funcName.slice(4),
			label: args[0]
		};
	},
	htmlBuilder(group, options) {
		var newOptions = options.havingStyle(options.style.sup());
		var label = wrapFragment(buildGroup$1(group.label, newOptions, options), options);
		label.classes.push("cd-label-" + group.side);
		label.style.bottom = makeEm(.8 - label.depth);
		label.height = 0;
		label.depth = 0;
		return label;
	},
	mathmlBuilder(group, options) {
		var label = new MathNode("mrow", [buildGroup(group.label, options)]);
		label = new MathNode("mpadded", [label]);
		label.setAttribute("width", "0");
		if (group.side === "left") label.setAttribute("lspace", "-1width");
		label.setAttribute("voffset", "0.7em");
		label = new MathNode("mstyle", [label]);
		label.setAttribute("displaystyle", "false");
		label.setAttribute("scriptlevel", "1");
		return label;
	}
});
defineFunction({
	type: "cdlabelparent",
	names: ["\\\\cdparent"],
	props: { numArgs: 1 },
	handler(_ref2, args) {
		var { parser } = _ref2;
		return {
			type: "cdlabelparent",
			mode: parser.mode,
			fragment: args[0]
		};
	},
	htmlBuilder(group, options) {
		var parent = wrapFragment(buildGroup$1(group.fragment, options), options);
		parent.classes.push("cd-vert-arrow");
		return parent;
	},
	mathmlBuilder(group, options) {
		return new MathNode("mrow", [buildGroup(group.fragment, options)]);
	}
});
defineFunction({
	type: "textord",
	names: ["\\@char"],
	props: {
		numArgs: 1,
		allowedInText: true
	},
	handler(_ref, args) {
		var { parser } = _ref;
		var group = assertNodeType(args[0], "ordgroup").body;
		var number = "";
		for (var i = 0; i < group.length; i++) {
			var node = assertNodeType(group[i], "textord");
			number += node.text;
		}
		var code = parseInt(number);
		var text;
		if (isNaN(code)) throw new ParseError("\\@char has non-numeric argument " + number);
		else if (code < 0 || code >= 1114111) throw new ParseError("\\@char with invalid code point " + number);
		else if (code <= 65535) text = String.fromCharCode(code);
		else {
			code -= 65536;
			text = String.fromCharCode((code >> 10) + 55296, (code & 1023) + 56320);
		}
		return {
			type: "textord",
			mode: parser.mode,
			text
		};
	}
});
var htmlBuilder$8 = (group, options) => {
	return makeFragment(buildExpression$1(group.body, options.withColor(group.color), false));
};
var mathmlBuilder$7 = (group, options) => {
	var node = new MathNode("mstyle", buildExpression(group.body, options.withColor(group.color)));
	node.setAttribute("mathcolor", group.color);
	return node;
};
defineFunction({
	type: "color",
	names: ["\\textcolor"],
	props: {
		numArgs: 2,
		allowedInText: true,
		argTypes: ["color", "original"]
	},
	handler(_ref, args) {
		var { parser } = _ref;
		var color = assertNodeType(args[0], "color-token").color;
		var body = args[1];
		return {
			type: "color",
			mode: parser.mode,
			color,
			body: ordargument(body)
		};
	},
	htmlBuilder: htmlBuilder$8,
	mathmlBuilder: mathmlBuilder$7
});
defineFunction({
	type: "color",
	names: ["\\color"],
	props: {
		numArgs: 1,
		allowedInText: true,
		argTypes: ["color"]
	},
	handler(_ref2, args) {
		var { parser, breakOnTokenText } = _ref2;
		var color = assertNodeType(args[0], "color-token").color;
		parser.gullet.macros.set("\\current@color", color);
		var body = parser.parseExpression(true, breakOnTokenText);
		return {
			type: "color",
			mode: parser.mode,
			color,
			body
		};
	},
	htmlBuilder: htmlBuilder$8,
	mathmlBuilder: mathmlBuilder$7
});
defineFunction({
	type: "cr",
	names: ["\\\\"],
	props: {
		numArgs: 0,
		numOptionalArgs: 0,
		allowedInText: true
	},
	handler(_ref, args, optArgs) {
		var { parser } = _ref;
		var size = parser.gullet.future().text === "[" ? parser.parseSizeGroup(true) : null;
		var newLine = !parser.settings.displayMode || !parser.settings.useStrictBehavior("newLineInDisplayMode", "In LaTeX, \\\\ or \\newline does nothing in display mode");
		return {
			type: "cr",
			mode: parser.mode,
			newLine,
			size: size && assertNodeType(size, "size").value
		};
	},
	htmlBuilder(group, options) {
		var span = makeSpan(["mspace"], [], options);
		if (group.newLine) {
			span.classes.push("newline");
			if (group.size) span.style.marginTop = makeEm(calculateSize(group.size, options));
		}
		return span;
	},
	mathmlBuilder(group, options) {
		var node = new MathNode("mspace");
		if (group.newLine) {
			node.setAttribute("linebreak", "newline");
			if (group.size) node.setAttribute("height", makeEm(calculateSize(group.size, options)));
		}
		return node;
	}
});
var globalMap = {
	"\\global": "\\global",
	"\\long": "\\\\globallong",
	"\\\\globallong": "\\\\globallong",
	"\\def": "\\gdef",
	"\\gdef": "\\gdef",
	"\\edef": "\\xdef",
	"\\xdef": "\\xdef",
	"\\let": "\\\\globallet",
	"\\futurelet": "\\\\globalfuture"
};
var checkControlSequence = (tok) => {
	var name = tok.text;
	if (/^(?:[\\{}$&#^_]|EOF)$/.test(name)) throw new ParseError("Expected a control sequence", tok);
	return name;
};
var getRHS = (parser) => {
	var tok = parser.gullet.popToken();
	if (tok.text === "=") {
		tok = parser.gullet.popToken();
		if (tok.text === " ") tok = parser.gullet.popToken();
	}
	return tok;
};
var letCommand = (parser, name, tok, global) => {
	var macro = parser.gullet.macros.get(tok.text);
	if (macro == null) {
		tok.noexpand = true;
		macro = {
			tokens: [tok],
			numArgs: 0,
			unexpandable: !parser.gullet.isExpandable(tok.text)
		};
	}
	parser.gullet.macros.set(name, macro, global);
};
defineFunction({
	type: "internal",
	names: [
		"\\global",
		"\\long",
		"\\\\globallong"
	],
	props: {
		numArgs: 0,
		allowedInText: true
	},
	handler(_ref) {
		var { parser, funcName } = _ref;
		parser.consumeSpaces();
		var token = parser.fetch();
		if (globalMap[token.text]) {
			if (funcName === "\\global" || funcName === "\\\\globallong") token.text = globalMap[token.text];
			return assertNodeType(parser.parseFunction(), "internal");
		}
		throw new ParseError("Invalid token after macro prefix", token);
	}
});
defineFunction({
	type: "internal",
	names: [
		"\\def",
		"\\gdef",
		"\\edef",
		"\\xdef"
	],
	props: {
		numArgs: 0,
		allowedInText: true,
		primitive: true
	},
	handler(_ref2) {
		var { parser, funcName } = _ref2;
		var tok = parser.gullet.popToken();
		var name = tok.text;
		if (/^(?:[\\{}$&#^_]|EOF)$/.test(name)) throw new ParseError("Expected a control sequence", tok);
		var numArgs = 0;
		var insert;
		var delimiters = [[]];
		while (parser.gullet.future().text !== "{") {
			tok = parser.gullet.popToken();
			if (tok.text === "#") {
				if (parser.gullet.future().text === "{") {
					insert = parser.gullet.future();
					delimiters[numArgs].push("{");
					break;
				}
				tok = parser.gullet.popToken();
				if (!/^[1-9]$/.test(tok.text)) throw new ParseError("Invalid argument number \"" + tok.text + "\"");
				if (parseInt(tok.text) !== numArgs + 1) throw new ParseError("Argument number \"" + tok.text + "\" out of order");
				numArgs++;
				delimiters.push([]);
			} else if (tok.text === "EOF") throw new ParseError("Expected a macro definition");
			else delimiters[numArgs].push(tok.text);
		}
		var { tokens } = parser.gullet.consumeArg();
		if (insert) tokens.unshift(insert);
		if (funcName === "\\edef" || funcName === "\\xdef") {
			tokens = parser.gullet.expandTokens(tokens);
			tokens.reverse();
		}
		parser.gullet.macros.set(name, {
			tokens,
			numArgs,
			delimiters
		}, funcName === globalMap[funcName]);
		return {
			type: "internal",
			mode: parser.mode
		};
	}
});
defineFunction({
	type: "internal",
	names: ["\\let", "\\\\globallet"],
	props: {
		numArgs: 0,
		allowedInText: true,
		primitive: true
	},
	handler(_ref3) {
		var { parser, funcName } = _ref3;
		var name = checkControlSequence(parser.gullet.popToken());
		parser.gullet.consumeSpaces();
		letCommand(parser, name, getRHS(parser), funcName === "\\\\globallet");
		return {
			type: "internal",
			mode: parser.mode
		};
	}
});
defineFunction({
	type: "internal",
	names: ["\\futurelet", "\\\\globalfuture"],
	props: {
		numArgs: 0,
		allowedInText: true,
		primitive: true
	},
	handler(_ref4) {
		var { parser, funcName } = _ref4;
		var name = checkControlSequence(parser.gullet.popToken());
		var middle = parser.gullet.popToken();
		var tok = parser.gullet.popToken();
		letCommand(parser, name, tok, funcName === "\\\\globalfuture");
		parser.gullet.pushToken(tok);
		parser.gullet.pushToken(middle);
		return {
			type: "internal",
			mode: parser.mode
		};
	}
});
/**
* This file deals with creating delimiters of various sizes. The TeXbook
* discusses these routines on page 441-442, in the "Another subroutine sets box
* x to a specified variable delimiter" paragraph.
*
* There are three main routines here. `makeSmallDelim` makes a delimiter in the
* normal font, but in either text, script, or scriptscript style.
* `makeLargeDelim` makes a delimiter in textstyle, but in one of the Size1,
* Size2, Size3, or Size4 fonts. `makeStackedDelim` makes a delimiter out of
* smaller pieces that are stacked on top of one another.
*
* The functions take a parameter `center`, which determines if the delimiter
* should be centered around the axis.
*
* Then, there are three exposed functions. `sizedDelim` makes a delimiter in
* one of the given sizes. This is used for things like `\bigl`.
* `customSizedDelim` makes a delimiter with a given total height+depth. It is
* called in places like `\sqrt`. `leftRightDelim` makes an appropriate
* delimiter which surrounds an expression of a given height an depth. It is
* used in `\left` and `\right`.
*/
/**
* Get the metrics for a given symbol and font, after transformation (i.e.
* after following replacement from symbols.js)
*/
var getMetrics = function getMetrics(symbol, font, mode) {
	var metrics = getCharacterMetrics(symbols.math[symbol] && symbols.math[symbol].replace || symbol, font, mode);
	if (!metrics) throw new Error("Unsupported symbol " + symbol + " and font size " + font + ".");
	return metrics;
};
/**
* Puts a delimiter span in a given style, and adds appropriate height, depth,
* and maxFontSizes.
*/
var styleWrap = function styleWrap(delim, toStyle, options, classes) {
	var newOptions = options.havingBaseStyle(toStyle);
	var span = makeSpan(classes.concat(newOptions.sizingClasses(options)), [delim], options);
	var delimSizeMultiplier = newOptions.sizeMultiplier / options.sizeMultiplier;
	span.height *= delimSizeMultiplier;
	span.depth *= delimSizeMultiplier;
	span.maxFontSize = newOptions.sizeMultiplier;
	return span;
};
var centerSpan = function centerSpan(span, options, style) {
	var newOptions = options.havingBaseStyle(style);
	var shift = (1 - options.sizeMultiplier / newOptions.sizeMultiplier) * options.fontMetrics().axisHeight;
	span.classes.push("delimcenter");
	span.style.top = makeEm(shift);
	span.height -= shift;
	span.depth += shift;
};
/**
* Makes a small delimiter. This is a delimiter that comes in the Main-Regular
* font, but is restyled to either be in textstyle, scriptstyle, or
* scriptscriptstyle.
*/
var makeSmallDelim = function makeSmallDelim(delim, style, center, options, mode, classes) {
	var span = styleWrap(makeSymbol(delim, "Main-Regular", mode, options), style, options, classes);
	if (center) centerSpan(span, options, style);
	return span;
};
/**
* Builds a symbol in the given font size (note size is an integer)
*/
var mathrmSize = function mathrmSize(value, size, mode, options) {
	return makeSymbol(value, "Size" + size + "-Regular", mode, options);
};
/**
* Makes a large delimiter. This is a delimiter that comes in the Size1, Size2,
* Size3, or Size4 fonts. It is always rendered in textstyle.
*/
var makeLargeDelim = function makeLargeDelim(delim, size, center, options, mode, classes) {
	var inner = mathrmSize(delim, size, mode, options);
	var span = styleWrap(makeSpan(["delimsizing", "size" + size], [inner], options), Style$1.TEXT, options, classes);
	if (center) centerSpan(span, options, Style$1.TEXT);
	return span;
};
/**
* Make a span from a font glyph with the given offset and in the given font.
* This is used in makeStackedDelim to make the stacking pieces for the delimiter.
*/
var makeGlyphSpan = function makeGlyphSpan(symbol, font, mode) {
	var sizeClass;
	if (font === "Size1-Regular") sizeClass = "delim-size1";
	else sizeClass = "delim-size4";
	return {
		type: "elem",
		elem: makeSpan(["delimsizinginner", sizeClass], [makeSpan([], [makeSymbol(symbol, font, mode)])])
	};
};
var makeInner = function makeInner(ch, height, options) {
	var width = fontMetricsData["Size4-Regular"][ch.charCodeAt(0)] ? fontMetricsData["Size4-Regular"][ch.charCodeAt(0)][4] : fontMetricsData["Size1-Regular"][ch.charCodeAt(0)][4];
	var span = makeSvgSpan([], [new SvgNode([new PathNode("inner", innerPath(ch, Math.round(1e3 * height)))], {
		"width": makeEm(width),
		"height": makeEm(height),
		"style": "width:" + makeEm(width),
		"viewBox": "0 0 " + 1e3 * width + " " + Math.round(1e3 * height),
		"preserveAspectRatio": "xMinYMin"
	})], options);
	span.height = height;
	span.style.height = makeEm(height);
	span.style.width = makeEm(width);
	return {
		type: "elem",
		elem: span
	};
};
var lapInEms = .008;
var lap = {
	type: "kern",
	size: -1 * lapInEms
};
var verts = /* @__PURE__ */ new Set([
	"|",
	"\\lvert",
	"\\rvert",
	"\\vert"
]);
var doubleVerts = /* @__PURE__ */ new Set([
	"\\|",
	"\\lVert",
	"\\rVert",
	"\\Vert"
]);
/**
* Make a stacked delimiter out of a given delimiter, with the total height at
* least `heightTotal`. This routine is mentioned on page 442 of the TeXbook.
*/
var makeStackedDelim = function makeStackedDelim(delim, heightTotal, center, options, mode, classes) {
	var top;
	var middle;
	var repeat;
	var bottom;
	var svgLabel = "";
	var viewBoxWidth = 0;
	top = repeat = bottom = delim;
	middle = null;
	var font = "Size1-Regular";
	if (delim === "\\uparrow") repeat = bottom = "⏐";
	else if (delim === "\\Uparrow") repeat = bottom = "‖";
	else if (delim === "\\downarrow") top = repeat = "⏐";
	else if (delim === "\\Downarrow") top = repeat = "‖";
	else if (delim === "\\updownarrow") {
		top = "\\uparrow";
		repeat = "⏐";
		bottom = "\\downarrow";
	} else if (delim === "\\Updownarrow") {
		top = "\\Uparrow";
		repeat = "‖";
		bottom = "\\Downarrow";
	} else if (verts.has(delim)) {
		repeat = "∣";
		svgLabel = "vert";
		viewBoxWidth = 333;
	} else if (doubleVerts.has(delim)) {
		repeat = "∥";
		svgLabel = "doublevert";
		viewBoxWidth = 556;
	} else if (delim === "[" || delim === "\\lbrack") {
		top = "⎡";
		repeat = "⎢";
		bottom = "⎣";
		font = "Size4-Regular";
		svgLabel = "lbrack";
		viewBoxWidth = 667;
	} else if (delim === "]" || delim === "\\rbrack") {
		top = "⎤";
		repeat = "⎥";
		bottom = "⎦";
		font = "Size4-Regular";
		svgLabel = "rbrack";
		viewBoxWidth = 667;
	} else if (delim === "\\lfloor" || delim === "⌊") {
		repeat = top = "⎢";
		bottom = "⎣";
		font = "Size4-Regular";
		svgLabel = "lfloor";
		viewBoxWidth = 667;
	} else if (delim === "\\lceil" || delim === "⌈") {
		top = "⎡";
		repeat = bottom = "⎢";
		font = "Size4-Regular";
		svgLabel = "lceil";
		viewBoxWidth = 667;
	} else if (delim === "\\rfloor" || delim === "⌋") {
		repeat = top = "⎥";
		bottom = "⎦";
		font = "Size4-Regular";
		svgLabel = "rfloor";
		viewBoxWidth = 667;
	} else if (delim === "\\rceil" || delim === "⌉") {
		top = "⎤";
		repeat = bottom = "⎥";
		font = "Size4-Regular";
		svgLabel = "rceil";
		viewBoxWidth = 667;
	} else if (delim === "(" || delim === "\\lparen") {
		top = "⎛";
		repeat = "⎜";
		bottom = "⎝";
		font = "Size4-Regular";
		svgLabel = "lparen";
		viewBoxWidth = 875;
	} else if (delim === ")" || delim === "\\rparen") {
		top = "⎞";
		repeat = "⎟";
		bottom = "⎠";
		font = "Size4-Regular";
		svgLabel = "rparen";
		viewBoxWidth = 875;
	} else if (delim === "\\{" || delim === "\\lbrace") {
		top = "⎧";
		middle = "⎨";
		bottom = "⎩";
		repeat = "⎪";
		font = "Size4-Regular";
	} else if (delim === "\\}" || delim === "\\rbrace") {
		top = "⎫";
		middle = "⎬";
		bottom = "⎭";
		repeat = "⎪";
		font = "Size4-Regular";
	} else if (delim === "\\lgroup" || delim === "⟮") {
		top = "⎧";
		bottom = "⎩";
		repeat = "⎪";
		font = "Size4-Regular";
	} else if (delim === "\\rgroup" || delim === "⟯") {
		top = "⎫";
		bottom = "⎭";
		repeat = "⎪";
		font = "Size4-Regular";
	} else if (delim === "\\lmoustache" || delim === "⎰") {
		top = "⎧";
		bottom = "⎭";
		repeat = "⎪";
		font = "Size4-Regular";
	} else if (delim === "\\rmoustache" || delim === "⎱") {
		top = "⎫";
		bottom = "⎩";
		repeat = "⎪";
		font = "Size4-Regular";
	}
	var topMetrics = getMetrics(top, font, mode);
	var topHeightTotal = topMetrics.height + topMetrics.depth;
	var repeatMetrics = getMetrics(repeat, font, mode);
	var repeatHeightTotal = repeatMetrics.height + repeatMetrics.depth;
	var bottomMetrics = getMetrics(bottom, font, mode);
	var bottomHeightTotal = bottomMetrics.height + bottomMetrics.depth;
	var middleHeightTotal = 0;
	var middleFactor = 1;
	if (middle !== null) {
		var middleMetrics = getMetrics(middle, font, mode);
		middleHeightTotal = middleMetrics.height + middleMetrics.depth;
		middleFactor = 2;
	}
	var minHeight = topHeightTotal + bottomHeightTotal + middleHeightTotal;
	var realHeightTotal = minHeight + Math.max(0, Math.ceil((heightTotal - minHeight) / (middleFactor * repeatHeightTotal))) * middleFactor * repeatHeightTotal;
	var axisHeight = options.fontMetrics().axisHeight;
	if (center) axisHeight *= options.sizeMultiplier;
	var depth = realHeightTotal / 2 - axisHeight;
	var stack = [];
	if (svgLabel.length > 0) {
		var midHeight = realHeightTotal - topHeightTotal - bottomHeightTotal;
		var viewBoxHeight = Math.round(realHeightTotal * 1e3);
		var pathStr = tallDelim(svgLabel, Math.round(midHeight * 1e3));
		var path = new PathNode(svgLabel, pathStr);
		var width = makeEm(viewBoxWidth / 1e3);
		var height = makeEm(viewBoxHeight / 1e3);
		var wrapper = makeSvgSpan([], [new SvgNode([path], {
			"width": width,
			"height": height,
			"viewBox": "0 0 " + viewBoxWidth + " " + viewBoxHeight
		})], options);
		wrapper.height = viewBoxHeight / 1e3;
		wrapper.style.width = width;
		wrapper.style.height = height;
		stack.push({
			type: "elem",
			elem: wrapper
		});
	} else {
		stack.push(makeGlyphSpan(bottom, font, mode));
		stack.push(lap);
		if (middle === null) {
			var innerHeight = realHeightTotal - topHeightTotal - bottomHeightTotal + 2 * lapInEms;
			stack.push(makeInner(repeat, innerHeight, options));
		} else {
			var _innerHeight = (realHeightTotal - topHeightTotal - bottomHeightTotal - middleHeightTotal) / 2 + 2 * lapInEms;
			stack.push(makeInner(repeat, _innerHeight, options));
			stack.push(lap);
			stack.push(makeGlyphSpan(middle, font, mode));
			stack.push(lap);
			stack.push(makeInner(repeat, _innerHeight, options));
		}
		stack.push(lap);
		stack.push(makeGlyphSpan(top, font, mode));
	}
	var newOptions = options.havingBaseStyle(Style$1.TEXT);
	return styleWrap(makeSpan(["delimsizing", "mult"], [makeVList({
		positionType: "bottom",
		positionData: depth,
		children: stack
	})], newOptions), Style$1.TEXT, options, classes);
};
var vbPad = 80;
var emPad = .08;
var sqrtSvg = function sqrtSvg(sqrtName, height, viewBoxHeight, extraVinculum, options) {
	return makeSvgSpan(["hide-tail"], [new SvgNode([new PathNode(sqrtName, sqrtPath(sqrtName, extraVinculum, viewBoxHeight))], {
		"width": "400em",
		"height": makeEm(height),
		"viewBox": "0 0 400000 " + viewBoxHeight,
		"preserveAspectRatio": "xMinYMin slice"
	})], options);
};
/**
* Make a sqrt image of the given height,
*/
var makeSqrtImage = function makeSqrtImage(height, options) {
	var newOptions = options.havingBaseSizing();
	var delim = traverseSequence("\\surd", height * newOptions.sizeMultiplier, stackLargeDelimiterSequence, newOptions);
	var sizeMultiplier = newOptions.sizeMultiplier;
	var extraVinculum = Math.max(0, options.minRuleThickness - options.fontMetrics().sqrtRuleThickness);
	var span;
	var spanHeight;
	var texHeight;
	var viewBoxHeight;
	var advanceWidth;
	if (delim.type === "small") {
		viewBoxHeight = 1e3 + 1e3 * extraVinculum + vbPad;
		if (height < 1) sizeMultiplier = 1;
		else if (height < 1.4) sizeMultiplier = .7;
		spanHeight = (1 + extraVinculum + emPad) / sizeMultiplier;
		texHeight = (1 + extraVinculum) / sizeMultiplier;
		span = sqrtSvg("sqrtMain", spanHeight, viewBoxHeight, extraVinculum, options);
		span.style.minWidth = "0.853em";
		advanceWidth = .833 / sizeMultiplier;
	} else if (delim.type === "large") {
		viewBoxHeight = (1e3 + vbPad) * sizeToMaxHeight[delim.size];
		texHeight = (sizeToMaxHeight[delim.size] + extraVinculum) / sizeMultiplier;
		spanHeight = (sizeToMaxHeight[delim.size] + extraVinculum + emPad) / sizeMultiplier;
		span = sqrtSvg("sqrtSize" + delim.size, spanHeight, viewBoxHeight, extraVinculum, options);
		span.style.minWidth = "1.02em";
		advanceWidth = 1 / sizeMultiplier;
	} else {
		spanHeight = height + extraVinculum + emPad;
		texHeight = height + extraVinculum;
		viewBoxHeight = Math.floor(1e3 * height + extraVinculum) + vbPad;
		span = sqrtSvg("sqrtTall", spanHeight, viewBoxHeight, extraVinculum, options);
		span.style.minWidth = "0.742em";
		advanceWidth = 1.056;
	}
	span.height = texHeight;
	span.style.height = makeEm(spanHeight);
	return {
		span,
		advanceWidth,
		ruleWidth: (options.fontMetrics().sqrtRuleThickness + extraVinculum) * sizeMultiplier
	};
};
var stackLargeDelimiters = /* @__PURE__ */ new Set([
	"(",
	"\\lparen",
	")",
	"\\rparen",
	"[",
	"\\lbrack",
	"]",
	"\\rbrack",
	"\\{",
	"\\lbrace",
	"\\}",
	"\\rbrace",
	"\\lfloor",
	"\\rfloor",
	"⌊",
	"⌋",
	"\\lceil",
	"\\rceil",
	"⌈",
	"⌉",
	"\\surd"
]);
var stackAlwaysDelimiters = /* @__PURE__ */ new Set([
	"\\uparrow",
	"\\downarrow",
	"\\updownarrow",
	"\\Uparrow",
	"\\Downarrow",
	"\\Updownarrow",
	"|",
	"\\|",
	"\\vert",
	"\\Vert",
	"\\lvert",
	"\\rvert",
	"\\lVert",
	"\\rVert",
	"\\lgroup",
	"\\rgroup",
	"⟮",
	"⟯",
	"\\lmoustache",
	"\\rmoustache",
	"⎰",
	"⎱"
]);
var stackNeverDelimiters = /* @__PURE__ */ new Set([
	"<",
	">",
	"\\langle",
	"\\rangle",
	"/",
	"\\backslash",
	"\\lt",
	"\\gt"
]);
var sizeToMaxHeight = [
	0,
	1.2,
	1.8,
	2.4,
	3
];
/**
* Used to create a delimiter of a specific size, where `size` is 1, 2, 3, or 4.
*/
var makeSizedDelim = function makeSizedDelim(delim, size, options, mode, classes) {
	if (delim === "<" || delim === "\\lt" || delim === "⟨") delim = "\\langle";
	else if (delim === ">" || delim === "\\gt" || delim === "⟩") delim = "\\rangle";
	if (stackLargeDelimiters.has(delim) || stackNeverDelimiters.has(delim)) return makeLargeDelim(delim, size, false, options, mode, classes);
	else if (stackAlwaysDelimiters.has(delim)) return makeStackedDelim(delim, sizeToMaxHeight[size], false, options, mode, classes);
	else throw new ParseError("Illegal delimiter: '" + delim + "'");
};
var stackNeverDelimiterSequence = [
	{
		type: "small",
		style: Style$1.SCRIPTSCRIPT
	},
	{
		type: "small",
		style: Style$1.SCRIPT
	},
	{
		type: "small",
		style: Style$1.TEXT
	},
	{
		type: "large",
		size: 1
	},
	{
		type: "large",
		size: 2
	},
	{
		type: "large",
		size: 3
	},
	{
		type: "large",
		size: 4
	}
];
var stackAlwaysDelimiterSequence = [
	{
		type: "small",
		style: Style$1.SCRIPTSCRIPT
	},
	{
		type: "small",
		style: Style$1.SCRIPT
	},
	{
		type: "small",
		style: Style$1.TEXT
	},
	{ type: "stack" }
];
var stackLargeDelimiterSequence = [
	{
		type: "small",
		style: Style$1.SCRIPTSCRIPT
	},
	{
		type: "small",
		style: Style$1.SCRIPT
	},
	{
		type: "small",
		style: Style$1.TEXT
	},
	{
		type: "large",
		size: 1
	},
	{
		type: "large",
		size: 2
	},
	{
		type: "large",
		size: 3
	},
	{
		type: "large",
		size: 4
	},
	{ type: "stack" }
];
/**
* Get the font used in a delimiter based on what kind of delimiter it is.
* TODO(#963) Use more specific font family return type once that is introduced.
*/
var delimTypeToFont = function delimTypeToFont(type) {
	if (type.type === "small") return "Main-Regular";
	else if (type.type === "large") return "Size" + type.size + "-Regular";
	else if (type.type === "stack") return "Size4-Regular";
	else {
		var delimKind = type.type;
		throw new Error("Add support for delim type '" + delimKind + "' here.");
	}
};
/**
* Traverse a sequence of types of delimiters to decide what kind of delimiter
* should be used to create a delimiter of the given height+depth.
*/
var traverseSequence = function traverseSequence(delim, height, sequence, options) {
	for (var i = Math.min(2, 3 - options.style.size); i < sequence.length; i++) {
		var delimType = sequence[i];
		if (delimType.type === "stack") break;
		var metrics = getMetrics(delim, delimTypeToFont(delimType), "math");
		var heightDepth = metrics.height + metrics.depth;
		if (delimType.type === "small") {
			var newOptions = options.havingBaseStyle(delimType.style);
			heightDepth *= newOptions.sizeMultiplier;
		}
		if (heightDepth > height) return delimType;
	}
	return sequence[sequence.length - 1];
};
/**
* Make a delimiter of a given height+depth, with optional centering. Here, we
* traverse the sequences, and create a delimiter that the sequence tells us to.
*/
var makeCustomSizedDelim = function makeCustomSizedDelim(delim, height, center, options, mode, classes) {
	if (delim === "<" || delim === "\\lt" || delim === "⟨") delim = "\\langle";
	else if (delim === ">" || delim === "\\gt" || delim === "⟩") delim = "\\rangle";
	var sequence;
	if (stackNeverDelimiters.has(delim)) sequence = stackNeverDelimiterSequence;
	else if (stackLargeDelimiters.has(delim)) sequence = stackLargeDelimiterSequence;
	else sequence = stackAlwaysDelimiterSequence;
	var delimType = traverseSequence(delim, height, sequence, options);
	if (delimType.type === "small") return makeSmallDelim(delim, delimType.style, center, options, mode, classes);
	else if (delimType.type === "large") return makeLargeDelim(delim, delimType.size, center, options, mode, classes);
	else return makeStackedDelim(delim, height, center, options, mode, classes);
};
/**
* Make a delimiter for use with `\left` and `\right`, given a height and depth
* of an expression that the delimiters surround.
*/
var makeLeftRightDelim = function makeLeftRightDelim(delim, height, depth, options, mode, classes) {
	var axisHeight = options.fontMetrics().axisHeight * options.sizeMultiplier;
	var delimiterFactor = 901;
	var delimiterExtend = 5 / options.fontMetrics().ptPerEm;
	var maxDistFromAxis = Math.max(height - axisHeight, depth + axisHeight);
	return makeCustomSizedDelim(delim, Math.max(maxDistFromAxis / 500 * delimiterFactor, 2 * maxDistFromAxis - delimiterExtend), true, options, mode, classes);
};
var delimiterSizes = {
	"\\bigl": {
		mclass: "mopen",
		size: 1
	},
	"\\Bigl": {
		mclass: "mopen",
		size: 2
	},
	"\\biggl": {
		mclass: "mopen",
		size: 3
	},
	"\\Biggl": {
		mclass: "mopen",
		size: 4
	},
	"\\bigr": {
		mclass: "mclose",
		size: 1
	},
	"\\Bigr": {
		mclass: "mclose",
		size: 2
	},
	"\\biggr": {
		mclass: "mclose",
		size: 3
	},
	"\\Biggr": {
		mclass: "mclose",
		size: 4
	},
	"\\bigm": {
		mclass: "mrel",
		size: 1
	},
	"\\Bigm": {
		mclass: "mrel",
		size: 2
	},
	"\\biggm": {
		mclass: "mrel",
		size: 3
	},
	"\\Biggm": {
		mclass: "mrel",
		size: 4
	},
	"\\big": {
		mclass: "mord",
		size: 1
	},
	"\\Big": {
		mclass: "mord",
		size: 2
	},
	"\\bigg": {
		mclass: "mord",
		size: 3
	},
	"\\Bigg": {
		mclass: "mord",
		size: 4
	}
};
var delimiters = /* @__PURE__ */ new Set([
	"(",
	"\\lparen",
	")",
	"\\rparen",
	"[",
	"\\lbrack",
	"]",
	"\\rbrack",
	"\\{",
	"\\lbrace",
	"\\}",
	"\\rbrace",
	"\\lfloor",
	"\\rfloor",
	"⌊",
	"⌋",
	"\\lceil",
	"\\rceil",
	"⌈",
	"⌉",
	"<",
	">",
	"\\langle",
	"⟨",
	"\\rangle",
	"⟩",
	"\\lt",
	"\\gt",
	"\\lvert",
	"\\rvert",
	"\\lVert",
	"\\rVert",
	"\\lgroup",
	"\\rgroup",
	"⟮",
	"⟯",
	"\\lmoustache",
	"\\rmoustache",
	"⎰",
	"⎱",
	"/",
	"\\backslash",
	"|",
	"\\vert",
	"\\|",
	"\\Vert",
	"\\uparrow",
	"\\Uparrow",
	"\\downarrow",
	"\\Downarrow",
	"\\updownarrow",
	"\\Updownarrow",
	"."
]);
function isMiddleDelimNode(node) {
	return "isMiddle" in node;
}
function checkDelimiter(delim, context) {
	var symDelim = checkSymbolNodeType(delim);
	if (symDelim && delimiters.has(symDelim.text)) return symDelim;
	else if (symDelim) throw new ParseError("Invalid delimiter '" + symDelim.text + "' after '" + context.funcName + "'", delim);
	else throw new ParseError("Invalid delimiter type '" + delim.type + "'", delim);
}
defineFunction({
	type: "delimsizing",
	names: [
		"\\bigl",
		"\\Bigl",
		"\\biggl",
		"\\Biggl",
		"\\bigr",
		"\\Bigr",
		"\\biggr",
		"\\Biggr",
		"\\bigm",
		"\\Bigm",
		"\\biggm",
		"\\Biggm",
		"\\big",
		"\\Big",
		"\\bigg",
		"\\Bigg"
	],
	props: {
		numArgs: 1,
		argTypes: ["primitive"]
	},
	handler: (context, args) => {
		var delim = checkDelimiter(args[0], context);
		return {
			type: "delimsizing",
			mode: context.parser.mode,
			size: delimiterSizes[context.funcName].size,
			mclass: delimiterSizes[context.funcName].mclass,
			delim: delim.text
		};
	},
	htmlBuilder: (group, options) => {
		if (group.delim === ".") return makeSpan([group.mclass]);
		return makeSizedDelim(group.delim, group.size, options, group.mode, [group.mclass]);
	},
	mathmlBuilder: (group) => {
		var children = [];
		if (group.delim !== ".") children.push(makeText(group.delim, group.mode));
		var node = new MathNode("mo", children);
		if (group.mclass === "mopen" || group.mclass === "mclose") node.setAttribute("fence", "true");
		else node.setAttribute("fence", "false");
		node.setAttribute("stretchy", "true");
		var size = makeEm(sizeToMaxHeight[group.size]);
		node.setAttribute("minsize", size);
		node.setAttribute("maxsize", size);
		return node;
	}
});
function assertParsed(group) {
	if (!group.body) throw new Error("Bug: The leftright ParseNode wasn't fully parsed.");
}
defineFunction({
	type: "leftright-right",
	names: ["\\right"],
	props: {
		numArgs: 1,
		primitive: true
	},
	handler: (context, args) => {
		var color = context.parser.gullet.macros.get("\\current@color");
		if (color && typeof color !== "string") throw new ParseError("\\current@color set to non-string in \\right");
		return {
			type: "leftright-right",
			mode: context.parser.mode,
			delim: checkDelimiter(args[0], context).text,
			color
		};
	}
});
defineFunction({
	type: "leftright",
	names: ["\\left"],
	props: {
		numArgs: 1,
		primitive: true
	},
	handler: (context, args) => {
		var delim = checkDelimiter(args[0], context);
		var parser = context.parser;
		++parser.leftrightDepth;
		var body = parser.parseExpression(false);
		--parser.leftrightDepth;
		parser.expect("\\right", false);
		var right = assertNodeType(parser.parseFunction(), "leftright-right");
		return {
			type: "leftright",
			mode: parser.mode,
			body,
			left: delim.text,
			right: right.delim,
			rightColor: right.color
		};
	},
	htmlBuilder: (group, options) => {
		assertParsed(group);
		var inner = buildExpression$1(group.body, options, true, ["mopen", "mclose"]);
		var innerHeight = 0;
		var innerDepth = 0;
		var hadMiddle = false;
		for (var i = 0; i < inner.length; i++) {
			var node = inner[i];
			if (isMiddleDelimNode(node)) hadMiddle = true;
			else {
				innerHeight = Math.max(inner[i].height, innerHeight);
				innerDepth = Math.max(inner[i].depth, innerDepth);
			}
		}
		innerHeight *= options.sizeMultiplier;
		innerDepth *= options.sizeMultiplier;
		var leftDelim;
		if (group.left === ".") leftDelim = makeNullDelimiter(options, ["mopen"]);
		else leftDelim = makeLeftRightDelim(group.left, innerHeight, innerDepth, options, group.mode, ["mopen"]);
		inner.unshift(leftDelim);
		if (hadMiddle) for (var _i = 1; _i < inner.length; _i++) {
			var middleDelim = inner[_i];
			if (isMiddleDelimNode(middleDelim)) {
				var isMiddle = middleDelim.isMiddle;
				inner[_i] = makeLeftRightDelim(isMiddle.delim, innerHeight, innerDepth, isMiddle.options, group.mode, []);
			}
		}
		var rightDelim;
		if (group.right === ".") rightDelim = makeNullDelimiter(options, ["mclose"]);
		else {
			var colorOptions = group.rightColor ? options.withColor(group.rightColor) : options;
			rightDelim = makeLeftRightDelim(group.right, innerHeight, innerDepth, colorOptions, group.mode, ["mclose"]);
		}
		inner.push(rightDelim);
		return makeSpan(["minner"], inner, options);
	},
	mathmlBuilder: (group, options) => {
		assertParsed(group);
		var inner = buildExpression(group.body, options);
		if (group.left !== ".") {
			var leftNode = new MathNode("mo", [makeText(group.left, group.mode)]);
			leftNode.setAttribute("fence", "true");
			inner.unshift(leftNode);
		}
		if (group.right !== ".") {
			var rightNode = new MathNode("mo", [makeText(group.right, group.mode)]);
			rightNode.setAttribute("fence", "true");
			if (group.rightColor) rightNode.setAttribute("mathcolor", group.rightColor);
			inner.push(rightNode);
		}
		return makeRow(inner);
	}
});
defineFunction({
	type: "middle",
	names: ["\\middle"],
	props: {
		numArgs: 1,
		primitive: true
	},
	handler: (context, args) => {
		var delim = checkDelimiter(args[0], context);
		if (!context.parser.leftrightDepth) throw new ParseError("\\middle without preceding \\left", delim);
		return {
			type: "middle",
			mode: context.parser.mode,
			delim: delim.text
		};
	},
	htmlBuilder: (group, options) => {
		var middleDelim;
		if (group.delim === ".") middleDelim = makeNullDelimiter(options, []);
		else {
			middleDelim = makeSizedDelim(group.delim, 1, options, group.mode, []);
			middleDelim.isMiddle = {
				delim: group.delim,
				options
			};
		}
		return middleDelim;
	},
	mathmlBuilder: (group, options) => {
		var middleNode = new MathNode("mo", [group.delim === "\\vert" || group.delim === "|" ? makeText("|", "text") : makeText(group.delim, group.mode)]);
		middleNode.setAttribute("fence", "true");
		middleNode.setAttribute("lspace", "0.05em");
		middleNode.setAttribute("rspace", "0.05em");
		return middleNode;
	}
});
var htmlBuilder$7 = (group, options) => {
	var inner = wrapFragment(buildGroup$1(group.body, options), options);
	var label = group.label.slice(1);
	var scale = options.sizeMultiplier;
	var img;
	var imgShift;
	var isSingleChar = isCharacterBox(group.body);
	if (label === "sout") {
		img = makeSpan(["stretchy", "sout"]);
		img.height = options.fontMetrics().defaultRuleThickness / scale;
		imgShift = -.5 * options.fontMetrics().xHeight;
	} else if (label === "phase") {
		var lineWeight = calculateSize({
			number: .6,
			unit: "pt"
		}, options);
		var clearance = calculateSize({
			number: .35,
			unit: "ex"
		}, options);
		var newOptions = options.havingBaseSizing();
		scale = scale / newOptions.sizeMultiplier;
		var angleHeight = inner.height + inner.depth + lineWeight + clearance;
		inner.style.paddingLeft = makeEm(angleHeight / 2 + lineWeight);
		var viewBoxHeight = Math.floor(1e3 * angleHeight * scale);
		img = makeSvgSpan(["hide-tail"], [new SvgNode([new PathNode("phase", phasePath(viewBoxHeight))], {
			"width": "400em",
			"height": makeEm(viewBoxHeight / 1e3),
			"viewBox": "0 0 400000 " + viewBoxHeight,
			"preserveAspectRatio": "xMinYMin slice"
		})], options);
		img.style.height = makeEm(angleHeight);
		imgShift = inner.depth + lineWeight + clearance;
	} else {
		if (/cancel/.test(label)) {
			if (!isSingleChar) inner.classes.push("cancel-pad");
		} else if (label === "angl") inner.classes.push("anglpad");
		else inner.classes.push("boxpad");
		var topPad;
		var bottomPad;
		var ruleThickness = 0;
		if (/box/.test(label)) {
			ruleThickness = Math.max(options.fontMetrics().fboxrule, options.minRuleThickness);
			topPad = options.fontMetrics().fboxsep + (label === "colorbox" ? 0 : ruleThickness);
			bottomPad = topPad;
		} else if (label === "angl") {
			ruleThickness = Math.max(options.fontMetrics().defaultRuleThickness, options.minRuleThickness);
			topPad = 4 * ruleThickness;
			bottomPad = Math.max(0, .25 - inner.depth);
		} else {
			topPad = isSingleChar ? .2 : 0;
			bottomPad = topPad;
		}
		img = stretchyEnclose(inner, label, topPad, bottomPad, options);
		if (/fbox|boxed|fcolorbox/.test(label)) {
			img.style.borderStyle = "solid";
			img.style.borderWidth = makeEm(ruleThickness);
		} else if (label === "angl" && ruleThickness !== .049) {
			img.style.borderTopWidth = makeEm(ruleThickness);
			img.style.borderRightWidth = makeEm(ruleThickness);
		}
		imgShift = inner.depth + bottomPad;
		if (group.backgroundColor) {
			img.style.backgroundColor = group.backgroundColor;
			if (group.borderColor) img.style.borderColor = group.borderColor;
		}
	}
	var vlist;
	if (group.backgroundColor) vlist = makeVList({
		positionType: "individualShift",
		children: [{
			type: "elem",
			elem: img,
			shift: imgShift
		}, {
			type: "elem",
			elem: inner,
			shift: 0
		}]
	});
	else {
		var classes = /cancel|phase/.test(label) ? ["svg-align"] : [];
		vlist = makeVList({
			positionType: "individualShift",
			children: [{
				type: "elem",
				elem: inner,
				shift: 0
			}, {
				type: "elem",
				elem: img,
				shift: imgShift,
				wrapperClasses: classes
			}]
		});
	}
	if (/cancel/.test(label)) {
		vlist.height = inner.height;
		vlist.depth = inner.depth;
	}
	if (/cancel/.test(label) && !isSingleChar) return makeSpan(["mord", "cancel-lap"], [vlist], options);
	else return makeSpan(["mord"], [vlist], options);
};
var mathmlBuilder$6 = (group, options) => {
	var fboxsep;
	var node = new MathNode(group.label.includes("colorbox") ? "mpadded" : "menclose", [buildGroup(group.body, options)]);
	switch (group.label) {
		case "\\cancel":
			node.setAttribute("notation", "updiagonalstrike");
			break;
		case "\\bcancel":
			node.setAttribute("notation", "downdiagonalstrike");
			break;
		case "\\phase":
			node.setAttribute("notation", "phasorangle");
			break;
		case "\\sout":
			node.setAttribute("notation", "horizontalstrike");
			break;
		case "\\fbox":
			node.setAttribute("notation", "box");
			break;
		case "\\angl":
			node.setAttribute("notation", "actuarial");
			break;
		case "\\fcolorbox":
		case "\\colorbox":
			fboxsep = options.fontMetrics().fboxsep * options.fontMetrics().ptPerEm;
			node.setAttribute("width", "+" + 2 * fboxsep + "pt");
			node.setAttribute("height", "+" + 2 * fboxsep + "pt");
			node.setAttribute("lspace", fboxsep + "pt");
			node.setAttribute("voffset", fboxsep + "pt");
			if (group.label === "\\fcolorbox") {
				var thk = Math.max(options.fontMetrics().fboxrule, options.minRuleThickness);
				node.setAttribute("style", "border: " + makeEm(thk) + " solid " + group.borderColor);
			}
			break;
		case "\\xcancel": node.setAttribute("notation", "updiagonalstrike downdiagonalstrike");
	}
	if (group.backgroundColor) node.setAttribute("mathbackground", group.backgroundColor);
	return node;
};
defineFunction({
	type: "enclose",
	names: ["\\colorbox"],
	props: {
		numArgs: 2,
		allowedInText: true,
		argTypes: ["color", "hbox"]
	},
	handler(_ref, args, optArgs) {
		var { parser, funcName } = _ref;
		var color = assertNodeType(args[0], "color-token").color;
		var body = args[1];
		return {
			type: "enclose",
			mode: parser.mode,
			label: funcName,
			backgroundColor: color,
			body
		};
	},
	htmlBuilder: htmlBuilder$7,
	mathmlBuilder: mathmlBuilder$6
});
defineFunction({
	type: "enclose",
	names: ["\\fcolorbox"],
	props: {
		numArgs: 3,
		allowedInText: true,
		argTypes: [
			"color",
			"color",
			"hbox"
		]
	},
	handler(_ref2, args, optArgs) {
		var { parser, funcName } = _ref2;
		var borderColor = assertNodeType(args[0], "color-token").color;
		var backgroundColor = assertNodeType(args[1], "color-token").color;
		var body = args[2];
		return {
			type: "enclose",
			mode: parser.mode,
			label: funcName,
			backgroundColor,
			borderColor,
			body
		};
	},
	htmlBuilder: htmlBuilder$7,
	mathmlBuilder: mathmlBuilder$6
});
defineFunction({
	type: "enclose",
	names: ["\\fbox"],
	props: {
		numArgs: 1,
		argTypes: ["hbox"],
		allowedInText: true
	},
	handler(_ref3, args) {
		var { parser } = _ref3;
		return {
			type: "enclose",
			mode: parser.mode,
			label: "\\fbox",
			body: args[0]
		};
	}
});
defineFunction({
	type: "enclose",
	names: [
		"\\cancel",
		"\\bcancel",
		"\\xcancel",
		"\\phase"
	],
	props: { numArgs: 1 },
	handler(_ref4, args) {
		var { parser, funcName } = _ref4;
		var body = args[0];
		return {
			type: "enclose",
			mode: parser.mode,
			label: funcName,
			body
		};
	},
	htmlBuilder: htmlBuilder$7,
	mathmlBuilder: mathmlBuilder$6
});
defineFunction({
	type: "enclose",
	names: ["\\sout"],
	props: {
		numArgs: 1,
		allowedInText: true
	},
	handler(_ref5, args) {
		var { parser, funcName } = _ref5;
		if (parser.mode === "math") parser.settings.reportNonstrict("mathVsSout", "LaTeX's \\sout works only in text mode");
		var body = args[0];
		return {
			type: "enclose",
			mode: parser.mode,
			label: funcName,
			body
		};
	},
	htmlBuilder: htmlBuilder$7,
	mathmlBuilder: mathmlBuilder$6
});
defineFunction({
	type: "enclose",
	names: ["\\angl"],
	props: {
		numArgs: 1,
		argTypes: ["hbox"],
		allowedInText: false
	},
	handler(_ref6, args) {
		var { parser } = _ref6;
		return {
			type: "enclose",
			mode: parser.mode,
			label: "\\angl",
			body: args[0]
		};
	}
});
/**
* All registered environments.
* `environments.js` exports this same dictionary again and makes it public.
* `Parser.js` requires this dictionary via `environments.js`.
*/
var _environments = {};
function defineEnvironment(_ref) {
	var { type, names, props, handler, htmlBuilder, mathmlBuilder } = _ref;
	var data = {
		type,
		numArgs: props.numArgs || 0,
		allowedInText: false,
		numOptionalArgs: 0,
		handler
	};
	for (var i = 0; i < names.length; ++i) _environments[names[i]] = data;
	if (htmlBuilder) _htmlGroupBuilders[type] = htmlBuilder;
	if (mathmlBuilder) _mathmlGroupBuilders[type] = mathmlBuilder;
}
/**
* All registered global/built-in macros.
* `macros.js` exports this same dictionary again and makes it public.
* `Parser.js` requires this dictionary via `macros.js`.
*/
var _macros = {};
function defineMacro(name, body) {
	_macros[name] = body;
}
/**
* Lexing or parsing positional information for error reporting.
* This object is immutable.
*/
var SourceLocation = class SourceLocation {
	constructor(lexer, start, end) {
		this.lexer = void 0;
		this.start = void 0;
		this.end = void 0;
		this.lexer = lexer;
		this.start = start;
		this.end = end;
	}
	/**
	* Merges two `SourceLocation`s from location providers, given they are
	* provided in order of appearance.
	* - Returns the first one's location if only the first is provided.
	* - Returns a merged range of the first and the last if both are provided
	*   and their lexers match.
	* - Otherwise, returns null.
	*/
	static range(first, second) {
		if (!second) return first && first.loc;
		else if (!first || !first.loc || !second.loc || first.loc.lexer !== second.loc.lexer) return null;
		else return new SourceLocation(first.loc.lexer, first.loc.start, second.loc.end);
	}
};
/**
* The resulting token returned from `lex`.
*
* It consists of the token text plus some position information.
* The position information is essentially a range in an input string,
* but instead of referencing the bare input string, we refer to the lexer.
* That way it is possible to attach extra metadata to the input string,
* like for example a file name or similar.
*
* The position information is optional, so it is OK to construct synthetic
* tokens if appropriate. Not providing available position information may
* lead to degraded error reporting, though.
*/
var Token = class Token {
	constructor(text, loc) {
		this.text = void 0;
		this.loc = void 0;
		this.noexpand = void 0;
		this.treatAsRelax = void 0;
		this.text = text;
		this.loc = loc;
	}
	/**
	* Given a pair of tokens (this and endToken), compute a `Token` encompassing
	* the whole input range enclosed by these two.
	*/
	range(endToken, text) {
		return new Token(text, SourceLocation.range(this, endToken));
	}
};
function getHLines(parser) {
	var hlineInfo = [];
	parser.consumeSpaces();
	var nxt = parser.fetch().text;
	if (nxt === "\\relax") {
		parser.consume();
		parser.consumeSpaces();
		nxt = parser.fetch().text;
	}
	while (nxt === "\\hline" || nxt === "\\hdashline") {
		parser.consume();
		hlineInfo.push(nxt === "\\hdashline");
		parser.consumeSpaces();
		nxt = parser.fetch().text;
	}
	return hlineInfo;
}
var validateAmsEnvironmentContext = (context) => {
	if (!context.parser.settings.displayMode) throw new ParseError("{" + context.envName + "} can be used only in display mode.");
};
var gatherEnvironments = /* @__PURE__ */ new Set(["gather", "gather*"]);
function getAutoTag(name) {
	if (!name.includes("ed")) return !name.includes("*");
}
/**
* Parse the body of the environment, with rows delimited by \\ and
* columns delimited by &, and create a nested list in row-major order
* with one group per cell.  If given an optional argument style
* ("text", "display", etc.), then each cell is cast into that style.
*/
function parseArray(parser, _ref, style) {
	var { hskipBeforeAndAfter, addJot, cols, arraystretch, colSeparationType, autoTag, singleRow, emptySingleRow, maxNumCols, leqno } = _ref;
	parser.gullet.beginGroup();
	if (!singleRow) parser.gullet.macros.set("\\cr", "\\\\\\relax");
	if (!arraystretch) {
		var stretch = parser.gullet.expandMacroAsText("\\arraystretch");
		if (stretch == null) arraystretch = 1;
		else {
			arraystretch = parseFloat(stretch);
			if (!arraystretch || arraystretch < 0) throw new ParseError("Invalid \\arraystretch: " + stretch);
		}
	}
	parser.gullet.beginGroup();
	var row = [];
	var body = [row];
	var rowGaps = [];
	var hLinesBeforeRow = [];
	var tags = autoTag != null ? [] : void 0;
	function beginRow() {
		if (autoTag) parser.gullet.macros.set("\\@eqnsw", "1", true);
	}
	function endRow() {
		if (tags) if (parser.gullet.macros.get("\\df@tag")) {
			tags.push(parser.subparse([new Token("\\df@tag")]));
			parser.gullet.macros.set("\\df@tag", void 0, true);
		} else tags.push(Boolean(autoTag) && parser.gullet.macros.get("\\@eqnsw") === "1");
	}
	beginRow();
	hLinesBeforeRow.push(getHLines(parser));
	while (true) {
		var cellBody = parser.parseExpression(false, singleRow ? "\\end" : "\\\\");
		parser.gullet.endGroup();
		parser.gullet.beginGroup();
		var cell = {
			type: "ordgroup",
			mode: parser.mode,
			body: cellBody
		};
		if (style) cell = {
			type: "styling",
			mode: parser.mode,
			style,
			resetFont: true,
			body: [cell]
		};
		row.push(cell);
		var next = parser.fetch().text;
		if (next === "&") {
			if (maxNumCols && row.length === maxNumCols) if (singleRow || colSeparationType) throw new ParseError("Too many tab characters: &", parser.nextToken);
			else parser.settings.reportNonstrict("textEnv", "Too few columns specified in the {array} column argument.");
			parser.consume();
		} else if (next === "\\end") {
			endRow();
			if (row.length === 1 && cell.type === "styling" && cell.body.length === 1 && cell.body[0].type === "ordgroup" && cell.body[0].body.length === 0 && (body.length > 1 || !emptySingleRow)) body.pop();
			if (hLinesBeforeRow.length < body.length + 1) hLinesBeforeRow.push([]);
			break;
		} else if (next === "\\\\") {
			parser.consume();
			var size = void 0;
			if (parser.gullet.future().text !== " ") size = parser.parseSizeGroup(true);
			rowGaps.push(size ? size.value : null);
			endRow();
			hLinesBeforeRow.push(getHLines(parser));
			row = [];
			body.push(row);
			beginRow();
		} else throw new ParseError("Expected & or \\\\ or \\cr or \\end", parser.nextToken);
	}
	parser.gullet.endGroup();
	parser.gullet.endGroup();
	return {
		type: "array",
		mode: parser.mode,
		addJot,
		arraystretch,
		body,
		cols,
		rowGaps,
		hskipBeforeAndAfter,
		hLinesBeforeRow,
		colSeparationType,
		tags,
		leqno
	};
}
function dCellStyle(envName) {
	if (envName.slice(0, 1) === "d") return "display";
	else return "text";
}
var htmlBuilder$6 = function htmlBuilder(group, options) {
	var r;
	var c;
	var nr = group.body.length;
	var hLinesBeforeRow = group.hLinesBeforeRow;
	var nc = 0;
	var body = new Array(nr);
	var hlines = [];
	var ruleThickness = Math.max(options.fontMetrics().arrayRuleWidth, options.minRuleThickness);
	var pt = 1 / options.fontMetrics().ptPerEm;
	var arraycolsep = 5 * pt;
	if (group.colSeparationType && group.colSeparationType === "small") arraycolsep = .2778 * (options.havingStyle(Style$1.SCRIPT).sizeMultiplier / options.sizeMultiplier);
	var baselineskip = group.colSeparationType === "CD" ? calculateSize({
		number: 3,
		unit: "ex"
	}, options) : 12 * pt;
	var jot = 3 * pt;
	var arrayskip = group.arraystretch * baselineskip;
	var arstrutHeight = .7 * arrayskip;
	var arstrutDepth = .3 * arrayskip;
	var totalHeight = 0;
	function setHLinePos(hlinesInGap) {
		for (var i = 0; i < hlinesInGap.length; ++i) {
			if (i > 0) totalHeight += .25;
			hlines.push({
				pos: totalHeight,
				isDashed: hlinesInGap[i]
			});
		}
	}
	setHLinePos(hLinesBeforeRow[0]);
	for (r = 0; r < group.body.length; ++r) {
		var inrow = group.body[r];
		var height = arstrutHeight;
		var depth = arstrutDepth;
		if (nc < inrow.length) nc = inrow.length;
		var outrow = {
			cells: new Array(inrow.length),
			height: 0,
			depth: 0,
			pos: 0
		};
		for (c = 0; c < inrow.length; ++c) {
			var elt = buildGroup$1(inrow[c], options);
			if (depth < elt.depth) depth = elt.depth;
			if (height < elt.height) height = elt.height;
			outrow.cells[c] = elt;
		}
		var rowGap = group.rowGaps[r];
		var gap = 0;
		if (rowGap) {
			gap = calculateSize(rowGap, options);
			if (gap > 0) {
				gap += arstrutDepth;
				if (depth < gap) depth = gap;
				gap = 0;
			}
		}
		if (group.addJot && r < group.body.length - 1) depth += jot;
		outrow.height = height;
		outrow.depth = depth;
		totalHeight += height;
		outrow.pos = totalHeight;
		totalHeight += depth + gap;
		body[r] = outrow;
		setHLinePos(hLinesBeforeRow[r + 1]);
	}
	var offset = totalHeight / 2 + options.fontMetrics().axisHeight;
	var colDescriptions = group.cols || [];
	var cols = [];
	var colSep;
	var colDescrNum;
	var tagSpans = [];
	if (group.tags && group.tags.some((tag) => tag)) for (r = 0; r < nr; ++r) {
		var rw = body[r];
		var shift = rw.pos - offset;
		var tag = group.tags[r];
		var tagSpan = void 0;
		if (tag === true) tagSpan = makeSpan(["eqn-num"], [], options);
		else if (tag === false) tagSpan = makeSpan([], [], options);
		else tagSpan = makeSpan([], buildExpression$1(tag, options, true), options);
		tagSpan.depth = rw.depth;
		tagSpan.height = rw.height;
		tagSpans.push({
			type: "elem",
			elem: tagSpan,
			shift
		});
	}
	for (c = 0, colDescrNum = 0; c < nc || colDescrNum < colDescriptions.length; ++c, ++colDescrNum) {
		var _colDescr3;
		var colDescr = colDescriptions[colDescrNum];
		var firstSeparator = true;
		while (((_colDescr = colDescr) == null ? void 0 : _colDescr.type) === "separator") {
			var _colDescr;
			if (!firstSeparator) {
				colSep = makeSpan(["arraycolsep"], []);
				colSep.style.width = makeEm(options.fontMetrics().doubleRuleSep);
				cols.push(colSep);
			}
			if (colDescr.separator === "|" || colDescr.separator === ":") {
				var lineType = colDescr.separator === "|" ? "solid" : "dashed";
				var separator = makeSpan(["vertical-separator"], [], options);
				separator.style.height = makeEm(totalHeight);
				separator.style.borderRightWidth = makeEm(ruleThickness);
				separator.style.borderRightStyle = lineType;
				separator.style.margin = "0 " + makeEm(-ruleThickness / 2);
				var _shift = totalHeight - offset;
				if (_shift) separator.style.verticalAlign = makeEm(-_shift);
				cols.push(separator);
			} else throw new ParseError("Invalid separator type: " + colDescr.separator);
			colDescrNum++;
			colDescr = colDescriptions[colDescrNum];
			firstSeparator = false;
		}
		if (c >= nc) continue;
		var sepwidth = void 0;
		if (c > 0 || group.hskipBeforeAndAfter) {
			var _colDescr$pregap, _colDescr2;
			sepwidth = (_colDescr$pregap = (_colDescr2 = colDescr) == null ? void 0 : _colDescr2.pregap) != null ? _colDescr$pregap : arraycolsep;
			if (sepwidth !== 0) {
				colSep = makeSpan(["arraycolsep"], []);
				colSep.style.width = makeEm(sepwidth);
				cols.push(colSep);
			}
		}
		var colElems = [];
		for (r = 0; r < nr; ++r) {
			var row = body[r];
			var elem = row.cells[c];
			if (!elem) continue;
			var _shift2 = row.pos - offset;
			elem.depth = row.depth;
			elem.height = row.height;
			colElems.push({
				type: "elem",
				elem,
				shift: _shift2
			});
		}
		var colVList = makeVList({
			positionType: "individualShift",
			children: colElems
		});
		var colSpan = makeSpan(["col-align-" + (((_colDescr3 = colDescr) == null ? void 0 : _colDescr3.align) || "c")], [colVList]);
		cols.push(colSpan);
		if (c < nc - 1 || group.hskipBeforeAndAfter) {
			var _colDescr$postgap, _colDescr4;
			sepwidth = (_colDescr$postgap = (_colDescr4 = colDescr) == null ? void 0 : _colDescr4.postgap) != null ? _colDescr$postgap : arraycolsep;
			if (sepwidth !== 0) {
				colSep = makeSpan(["arraycolsep"], []);
				colSep.style.width = makeEm(sepwidth);
				cols.push(colSep);
			}
		}
	}
	var tableBody = makeSpan(["mtable"], cols);
	if (hlines.length > 0) {
		var line = makeLineSpan("hline", options, ruleThickness);
		var dashes = makeLineSpan("hdashline", options, ruleThickness);
		var vListElems = [{
			type: "elem",
			elem: tableBody,
			shift: 0
		}];
		while (hlines.length > 0) {
			var hline = hlines.pop();
			var lineShift = hline.pos - offset;
			if (hline.isDashed) vListElems.push({
				type: "elem",
				elem: dashes,
				shift: lineShift
			});
			else vListElems.push({
				type: "elem",
				elem: line,
				shift: lineShift
			});
		}
		tableBody = makeVList({
			positionType: "individualShift",
			children: vListElems
		});
	}
	if (tagSpans.length === 0) return makeSpan(["mord"], [tableBody], options);
	else {
		var tagCol = makeSpan(["tag"], [makeVList({
			positionType: "individualShift",
			children: tagSpans
		})], options);
		return makeFragment([tableBody, tagCol]);
	}
};
var alignMap = {
	c: "center ",
	l: "left ",
	r: "right "
};
var mathmlBuilder$5 = function mathmlBuilder(group, options) {
	var tbl = [];
	var glue = new MathNode("mtd", [], ["mtr-glue"]);
	var tag = new MathNode("mtd", [], ["mml-eqn-num"]);
	for (var i = 0; i < group.body.length; i++) {
		var rw = group.body[i];
		var row = [];
		for (var j = 0; j < rw.length; j++) row.push(new MathNode("mtd", [buildGroup(rw[j], options)]));
		if (group.tags && group.tags[i]) {
			row.unshift(glue);
			row.push(glue);
			if (group.leqno) row.unshift(tag);
			else row.push(tag);
		}
		tbl.push(new MathNode("mtr", row));
	}
	var table = new MathNode("mtable", tbl);
	var gap = group.arraystretch === .5 ? .1 : .16 + group.arraystretch - 1 + (group.addJot ? .09 : 0);
	table.setAttribute("rowspacing", makeEm(gap));
	var menclose = "";
	var align = "";
	if (group.cols && group.cols.length > 0) {
		var cols = group.cols;
		var columnLines = "";
		var prevTypeWasAlign = false;
		var iStart = 0;
		var iEnd = cols.length;
		if (cols[0].type === "separator") {
			menclose += "top ";
			iStart = 1;
		}
		if (cols[cols.length - 1].type === "separator") {
			menclose += "bottom ";
			iEnd -= 1;
		}
		for (var _i = iStart; _i < iEnd; _i++) {
			var col = cols[_i];
			if (col.type === "align") {
				align += alignMap[col.align];
				if (prevTypeWasAlign) columnLines += "none ";
				prevTypeWasAlign = true;
			} else if (col.type === "separator") {
				if (prevTypeWasAlign) {
					columnLines += col.separator === "|" ? "solid " : "dashed ";
					prevTypeWasAlign = false;
				}
			}
		}
		table.setAttribute("columnalign", align.trim());
		if (/[sd]/.test(columnLines)) table.setAttribute("columnlines", columnLines.trim());
	}
	if (group.colSeparationType === "align") {
		var _cols = group.cols || [];
		var spacing = "";
		for (var _i2 = 1; _i2 < _cols.length; _i2++) spacing += _i2 % 2 ? "0em " : "1em ";
		table.setAttribute("columnspacing", spacing.trim());
	} else if (group.colSeparationType === "alignat" || group.colSeparationType === "gather") table.setAttribute("columnspacing", "0em");
	else if (group.colSeparationType === "small") table.setAttribute("columnspacing", "0.2778em");
	else if (group.colSeparationType === "CD") table.setAttribute("columnspacing", "0.5em");
	else table.setAttribute("columnspacing", "1em");
	var rowLines = "";
	var hlines = group.hLinesBeforeRow;
	menclose += hlines[0].length > 0 ? "left " : "";
	menclose += hlines[hlines.length - 1].length > 0 ? "right " : "";
	for (var _i3 = 1; _i3 < hlines.length - 1; _i3++) rowLines += hlines[_i3].length === 0 ? "none " : hlines[_i3][0] ? "dashed " : "solid ";
	if (/[sd]/.test(rowLines)) table.setAttribute("rowlines", rowLines.trim());
	if (menclose !== "") {
		table = new MathNode("menclose", [table]);
		table.setAttribute("notation", menclose.trim());
	}
	if (group.arraystretch && group.arraystretch < 1) {
		table = new MathNode("mstyle", [table]);
		table.setAttribute("scriptlevel", "1");
	}
	return table;
};
var alignedHandler = function alignedHandler(context, args) {
	if (!context.envName.includes("ed")) validateAmsEnvironmentContext(context);
	var cols = [];
	var separationType = context.envName.includes("at") ? "alignat" : "align";
	var isSplit = context.envName === "split";
	var res = parseArray(context.parser, {
		cols,
		addJot: true,
		autoTag: isSplit ? void 0 : getAutoTag(context.envName),
		emptySingleRow: true,
		colSeparationType: separationType,
		maxNumCols: isSplit ? 2 : void 0,
		leqno: context.parser.settings.leqno
	}, "display");
	var numMaths = 0;
	var numCols = 0;
	var emptyGroup = {
		type: "ordgroup",
		mode: context.mode,
		body: []
	};
	if (args[0] && args[0].type === "ordgroup") {
		var arg0 = "";
		for (var i = 0; i < args[0].body.length; i++) {
			var textord = assertNodeType(args[0].body[i], "textord");
			arg0 += textord.text;
		}
		numMaths = Number(arg0);
		numCols = numMaths * 2;
	}
	var isAligned = !numCols;
	res.body.forEach(function(row) {
		for (var _i4 = 1; _i4 < row.length; _i4 += 2) assertNodeType(assertNodeType(row[_i4], "styling").body[0], "ordgroup").body.unshift(emptyGroup);
		if (!isAligned) {
			var curMaths = row.length / 2;
			if (numMaths < curMaths) throw new ParseError("Too many math in a row: " + ("expected " + numMaths + ", but got " + curMaths), row[0]);
		} else if (numCols < row.length) numCols = row.length;
	});
	for (var _i5 = 0; _i5 < numCols; ++_i5) {
		var align = "r";
		var pregap = 0;
		if (_i5 % 2 === 1) align = "l";
		else if (_i5 > 0 && isAligned) pregap = 1;
		cols[_i5] = {
			type: "align",
			align,
			pregap,
			postgap: 0
		};
	}
	res.colSeparationType = isAligned ? "align" : "alignat";
	return res;
};
defineEnvironment({
	type: "array",
	names: ["array", "darray"],
	props: { numArgs: 1 },
	handler(context, args) {
		var cols = (checkSymbolNodeType(args[0]) ? [args[0]] : assertNodeType(args[0], "ordgroup").body).map(function(nde) {
			var ca = assertSymbolNodeType(nde).text;
			if ("lcr".includes(ca)) return {
				type: "align",
				align: ca
			};
			else if (ca === "|") return {
				type: "separator",
				separator: "|"
			};
			else if (ca === ":") return {
				type: "separator",
				separator: ":"
			};
			throw new ParseError("Unknown column alignment: " + ca, nde);
		});
		var res = {
			cols,
			hskipBeforeAndAfter: true,
			maxNumCols: cols.length
		};
		return parseArray(context.parser, res, dCellStyle(context.envName));
	},
	htmlBuilder: htmlBuilder$6,
	mathmlBuilder: mathmlBuilder$5
});
defineEnvironment({
	type: "array",
	names: [
		"matrix",
		"pmatrix",
		"bmatrix",
		"Bmatrix",
		"vmatrix",
		"Vmatrix",
		"matrix*",
		"pmatrix*",
		"bmatrix*",
		"Bmatrix*",
		"vmatrix*",
		"Vmatrix*"
	],
	props: { numArgs: 0 },
	handler(context) {
		var delimiters = {
			"matrix": null,
			"pmatrix": ["(", ")"],
			"bmatrix": ["[", "]"],
			"Bmatrix": ["\\{", "\\}"],
			"vmatrix": ["|", "|"],
			"Vmatrix": ["\\Vert", "\\Vert"]
		}[context.envName.replace("*", "")];
		var colAlign = "c";
		var payload = {
			hskipBeforeAndAfter: false,
			cols: [{
				type: "align",
				align: colAlign
			}]
		};
		if (context.envName.charAt(context.envName.length - 1) === "*") {
			var parser = context.parser;
			parser.consumeSpaces();
			if (parser.fetch().text === "[") {
				parser.consume();
				parser.consumeSpaces();
				colAlign = parser.fetch().text;
				if (!"lcr".includes(colAlign)) throw new ParseError("Expected l or c or r", parser.nextToken);
				parser.consume();
				parser.consumeSpaces();
				parser.expect("]");
				parser.consume();
				payload.cols = [{
					type: "align",
					align: colAlign
				}];
			}
		}
		var res = parseArray(context.parser, payload, dCellStyle(context.envName));
		var numCols = Math.max(0, ...res.body.map((row) => row.length));
		res.cols = new Array(numCols).fill({
			type: "align",
			align: colAlign
		});
		return delimiters ? {
			type: "leftright",
			mode: context.mode,
			body: [res],
			left: delimiters[0],
			right: delimiters[1],
			rightColor: void 0
		} : res;
	},
	htmlBuilder: htmlBuilder$6,
	mathmlBuilder: mathmlBuilder$5
});
defineEnvironment({
	type: "array",
	names: ["smallmatrix"],
	props: { numArgs: 0 },
	handler(context) {
		var res = parseArray(context.parser, { arraystretch: .5 }, "script");
		res.colSeparationType = "small";
		return res;
	},
	htmlBuilder: htmlBuilder$6,
	mathmlBuilder: mathmlBuilder$5
});
defineEnvironment({
	type: "array",
	names: ["subarray"],
	props: { numArgs: 1 },
	handler(context, args) {
		var cols = (checkSymbolNodeType(args[0]) ? [args[0]] : assertNodeType(args[0], "ordgroup").body).map(function(nde) {
			var ca = assertSymbolNodeType(nde).text;
			if ("lc".includes(ca)) return {
				type: "align",
				align: ca
			};
			throw new ParseError("Unknown column alignment: " + ca, nde);
		});
		if (cols.length > 1) throw new ParseError("{subarray} can contain only one column");
		var payload = {
			cols,
			hskipBeforeAndAfter: false,
			arraystretch: .5
		};
		var res = parseArray(context.parser, payload, "script");
		if (res.body.length > 0 && res.body[0].length > 1) throw new ParseError("{subarray} can contain only one column");
		return res;
	},
	htmlBuilder: htmlBuilder$6,
	mathmlBuilder: mathmlBuilder$5
});
defineEnvironment({
	type: "array",
	names: [
		"cases",
		"dcases",
		"rcases",
		"drcases"
	],
	props: { numArgs: 0 },
	handler(context) {
		var res = parseArray(context.parser, {
			arraystretch: 1.2,
			cols: [{
				type: "align",
				align: "l",
				pregap: 0,
				postgap: 1
			}, {
				type: "align",
				align: "l",
				pregap: 0,
				postgap: 0
			}]
		}, dCellStyle(context.envName));
		return {
			type: "leftright",
			mode: context.mode,
			body: [res],
			left: context.envName.includes("r") ? "." : "\\{",
			right: context.envName.includes("r") ? "\\}" : ".",
			rightColor: void 0
		};
	},
	htmlBuilder: htmlBuilder$6,
	mathmlBuilder: mathmlBuilder$5
});
defineEnvironment({
	type: "array",
	names: [
		"align",
		"align*",
		"aligned",
		"split"
	],
	props: { numArgs: 0 },
	handler: alignedHandler,
	htmlBuilder: htmlBuilder$6,
	mathmlBuilder: mathmlBuilder$5
});
defineEnvironment({
	type: "array",
	names: [
		"gathered",
		"gather",
		"gather*"
	],
	props: { numArgs: 0 },
	handler(context) {
		if (gatherEnvironments.has(context.envName)) validateAmsEnvironmentContext(context);
		var res = {
			cols: [{
				type: "align",
				align: "c"
			}],
			addJot: true,
			colSeparationType: "gather",
			autoTag: getAutoTag(context.envName),
			emptySingleRow: true,
			leqno: context.parser.settings.leqno
		};
		return parseArray(context.parser, res, "display");
	},
	htmlBuilder: htmlBuilder$6,
	mathmlBuilder: mathmlBuilder$5
});
defineEnvironment({
	type: "array",
	names: [
		"alignat",
		"alignat*",
		"alignedat"
	],
	props: { numArgs: 1 },
	handler: alignedHandler,
	htmlBuilder: htmlBuilder$6,
	mathmlBuilder: mathmlBuilder$5
});
defineEnvironment({
	type: "array",
	names: ["equation", "equation*"],
	props: { numArgs: 0 },
	handler(context) {
		validateAmsEnvironmentContext(context);
		var res = {
			autoTag: getAutoTag(context.envName),
			emptySingleRow: true,
			singleRow: true,
			maxNumCols: 1,
			leqno: context.parser.settings.leqno
		};
		return parseArray(context.parser, res, "display");
	},
	htmlBuilder: htmlBuilder$6,
	mathmlBuilder: mathmlBuilder$5
});
defineEnvironment({
	type: "array",
	names: ["CD"],
	props: { numArgs: 0 },
	handler(context) {
		validateAmsEnvironmentContext(context);
		return parseCD(context.parser);
	},
	htmlBuilder: htmlBuilder$6,
	mathmlBuilder: mathmlBuilder$5
});
defineMacro("\\nonumber", "\\gdef\\@eqnsw{0}");
defineMacro("\\notag", "\\nonumber");
defineFunction({
	type: "text",
	names: ["\\hline", "\\hdashline"],
	props: {
		numArgs: 0,
		allowedInText: true,
		allowedInMath: true
	},
	handler(context, args) {
		throw new ParseError(context.funcName + " valid only within array environment");
	}
});
var environments = _environments;
defineFunction({
	type: "environment",
	names: ["\\begin", "\\end"],
	props: {
		numArgs: 1,
		argTypes: ["text"]
	},
	handler(_ref, args) {
		var { parser, funcName } = _ref;
		var nameGroup = args[0];
		if (nameGroup.type !== "ordgroup") throw new ParseError("Invalid environment name", nameGroup);
		var envName = "";
		for (var i = 0; i < nameGroup.body.length; ++i) envName += assertNodeType(nameGroup.body[i], "textord").text;
		if (funcName === "\\begin") {
			if (!environments.hasOwnProperty(envName)) throw new ParseError("No such environment: " + envName, nameGroup);
			var env = environments[envName];
			var { args: _args, optArgs } = parser.parseArguments("\\begin{" + envName + "}", env);
			var context = {
				mode: parser.mode,
				envName,
				parser
			};
			var result = env.handler(context, _args, optArgs);
			parser.expect("\\end", false);
			var endNameToken = parser.nextToken;
			var end = assertNodeType(parser.parseFunction(), "environment");
			if (end.name !== envName) throw new ParseError("Mismatch: \\begin{" + envName + "} matched by \\end{" + end.name + "}", endNameToken);
			return result;
		}
		return {
			type: "environment",
			mode: parser.mode,
			name: envName,
			nameGroup
		};
	}
});
var htmlBuilder$5 = (group, options) => {
	var font = group.font;
	var newOptions = options.withFont(font);
	return buildGroup$1(group.body, newOptions);
};
var mathmlBuilder$4 = (group, options) => {
	var font = group.font;
	var newOptions = options.withFont(font);
	return buildGroup(group.body, newOptions);
};
var fontAliases = {
	"\\Bbb": "\\mathbb",
	"\\bold": "\\mathbf",
	"\\frak": "\\mathfrak"
};
defineFunction({
	type: "font",
	names: [
		"\\mathrm",
		"\\mathit",
		"\\mathbf",
		"\\mathnormal",
		"\\mathsfit",
		"\\mathbb",
		"\\mathcal",
		"\\mathfrak",
		"\\mathscr",
		"\\mathsf",
		"\\mathtt",
		"\\Bbb",
		"\\bold",
		"\\frak"
	],
	props: {
		numArgs: 1,
		allowedInArgument: true
	},
	handler: (_ref, args) => {
		var { parser, funcName } = _ref;
		var body = normalizeArgument(args[0]);
		var func = funcName;
		if (func in fontAliases) func = fontAliases[func];
		return {
			type: "font",
			mode: parser.mode,
			font: func.slice(1),
			body
		};
	},
	htmlBuilder: htmlBuilder$5,
	mathmlBuilder: mathmlBuilder$4
});
defineFunction({
	type: "mclass",
	names: ["\\boldsymbol", "\\bm"],
	props: { numArgs: 1 },
	handler: (_ref2, args) => {
		var { parser } = _ref2;
		var body = args[0];
		return {
			type: "mclass",
			mode: parser.mode,
			mclass: binrelClass(body),
			body: [{
				type: "font",
				mode: parser.mode,
				font: "boldsymbol",
				body
			}],
			isCharacterBox: isCharacterBox(body)
		};
	}
});
defineFunction({
	type: "font",
	names: [
		"\\rm",
		"\\sf",
		"\\tt",
		"\\bf",
		"\\it",
		"\\cal"
	],
	props: {
		numArgs: 0,
		allowedInText: true
	},
	handler: (_ref3, args) => {
		var { parser, funcName, breakOnTokenText } = _ref3;
		var { mode } = parser;
		var body = parser.parseExpression(true, breakOnTokenText);
		return {
			type: "font",
			mode,
			font: "math" + funcName.slice(1),
			body: {
				type: "ordgroup",
				mode: parser.mode,
				body
			}
		};
	},
	htmlBuilder: htmlBuilder$5,
	mathmlBuilder: mathmlBuilder$4
});
var htmlBuilder$4 = (group, options) => {
	var style = options.style;
	var nstyle = style.fracNum();
	var dstyle = style.fracDen();
	var newOptions = options.havingStyle(nstyle);
	var numerm = buildGroup$1(group.numer, newOptions, options);
	if (group.continued) {
		var hStrut = 8.5 / options.fontMetrics().ptPerEm;
		var dStrut = 3.5 / options.fontMetrics().ptPerEm;
		numerm.height = numerm.height < hStrut ? hStrut : numerm.height;
		numerm.depth = numerm.depth < dStrut ? dStrut : numerm.depth;
	}
	newOptions = options.havingStyle(dstyle);
	var denomm = buildGroup$1(group.denom, newOptions, options);
	var rule;
	var ruleWidth;
	var ruleSpacing;
	if (group.hasBarLine) {
		if (group.barSize) {
			ruleWidth = calculateSize(group.barSize, options);
			rule = makeLineSpan("frac-line", options, ruleWidth);
		} else rule = makeLineSpan("frac-line", options);
		ruleWidth = rule.height;
		ruleSpacing = rule.height;
	} else {
		rule = null;
		ruleWidth = 0;
		ruleSpacing = options.fontMetrics().defaultRuleThickness;
	}
	var numShift;
	var clearance;
	var denomShift;
	if (style.size === Style$1.DISPLAY.size) {
		numShift = options.fontMetrics().num1;
		if (ruleWidth > 0) clearance = 3 * ruleSpacing;
		else clearance = 7 * ruleSpacing;
		denomShift = options.fontMetrics().denom1;
	} else {
		if (ruleWidth > 0) {
			numShift = options.fontMetrics().num2;
			clearance = ruleSpacing;
		} else {
			numShift = options.fontMetrics().num3;
			clearance = 3 * ruleSpacing;
		}
		denomShift = options.fontMetrics().denom2;
	}
	var frac;
	if (!rule) {
		var candidateClearance = numShift - numerm.depth - (denomm.height - denomShift);
		if (candidateClearance < clearance) {
			numShift += .5 * (clearance - candidateClearance);
			denomShift += .5 * (clearance - candidateClearance);
		}
		frac = makeVList({
			positionType: "individualShift",
			children: [{
				type: "elem",
				elem: denomm,
				shift: denomShift
			}, {
				type: "elem",
				elem: numerm,
				shift: -numShift
			}]
		});
	} else {
		var axisHeight = options.fontMetrics().axisHeight;
		if (numShift - numerm.depth - (axisHeight + .5 * ruleWidth) < clearance) numShift += clearance - (numShift - numerm.depth - (axisHeight + .5 * ruleWidth));
		if (axisHeight - .5 * ruleWidth - (denomm.height - denomShift) < clearance) denomShift += clearance - (axisHeight - .5 * ruleWidth - (denomm.height - denomShift));
		var midShift = -(axisHeight - .5 * ruleWidth);
		frac = makeVList({
			positionType: "individualShift",
			children: [
				{
					type: "elem",
					elem: denomm,
					shift: denomShift
				},
				{
					type: "elem",
					elem: rule,
					shift: midShift
				},
				{
					type: "elem",
					elem: numerm,
					shift: -numShift
				}
			]
		});
	}
	newOptions = options.havingStyle(style);
	frac.height *= newOptions.sizeMultiplier / options.sizeMultiplier;
	frac.depth *= newOptions.sizeMultiplier / options.sizeMultiplier;
	var delimSize;
	if (style.size === Style$1.DISPLAY.size) delimSize = options.fontMetrics().delim1;
	else if (style.size === Style$1.SCRIPTSCRIPT.size) delimSize = options.havingStyle(Style$1.SCRIPT).fontMetrics().delim2;
	else delimSize = options.fontMetrics().delim2;
	var leftDelim;
	var rightDelim;
	if (group.leftDelim == null) leftDelim = makeNullDelimiter(options, ["mopen"]);
	else leftDelim = makeCustomSizedDelim(group.leftDelim, delimSize, true, options.havingStyle(style), group.mode, ["mopen"]);
	if (group.continued) rightDelim = makeSpan([]);
	else if (group.rightDelim == null) rightDelim = makeNullDelimiter(options, ["mclose"]);
	else rightDelim = makeCustomSizedDelim(group.rightDelim, delimSize, true, options.havingStyle(style), group.mode, ["mclose"]);
	return makeSpan(["mord"].concat(newOptions.sizingClasses(options)), [
		leftDelim,
		makeSpan(["mfrac"], [frac]),
		rightDelim
	], options);
};
var mathmlBuilder$3 = (group, options) => {
	var node = new MathNode("mfrac", [buildGroup(group.numer, options), buildGroup(group.denom, options)]);
	if (!group.hasBarLine) node.setAttribute("linethickness", "0px");
	else if (group.barSize) {
		var ruleWidth = calculateSize(group.barSize, options);
		node.setAttribute("linethickness", makeEm(ruleWidth));
	}
	if (group.leftDelim != null || group.rightDelim != null) {
		var withDelims = [];
		if (group.leftDelim != null) {
			var leftOp = new MathNode("mo", [new TextNode(group.leftDelim.replace("\\", ""))]);
			leftOp.setAttribute("fence", "true");
			withDelims.push(leftOp);
		}
		withDelims.push(node);
		if (group.rightDelim != null) {
			var rightOp = new MathNode("mo", [new TextNode(group.rightDelim.replace("\\", ""))]);
			rightOp.setAttribute("fence", "true");
			withDelims.push(rightOp);
		}
		return makeRow(withDelims);
	}
	return node;
};
var wrapWithStyle = (frac, style) => {
	if (!style) return frac;
	return {
		type: "styling",
		mode: frac.mode,
		style,
		body: [frac]
	};
};
defineFunction({
	type: "genfrac",
	names: [
		"\\cfrac",
		"\\dfrac",
		"\\frac",
		"\\tfrac",
		"\\dbinom",
		"\\binom",
		"\\tbinom",
		"\\\\atopfrac",
		"\\\\bracefrac",
		"\\\\brackfrac"
	],
	props: {
		numArgs: 2,
		allowedInArgument: true
	},
	handler: (_ref, args) => {
		var { parser, funcName } = _ref;
		var numer = args[0];
		var denom = args[1];
		var hasBarLine;
		var leftDelim = null;
		var rightDelim = null;
		switch (funcName) {
			case "\\cfrac":
			case "\\dfrac":
			case "\\frac":
			case "\\tfrac":
				hasBarLine = true;
				break;
			case "\\\\atopfrac":
				hasBarLine = false;
				break;
			case "\\dbinom":
			case "\\binom":
			case "\\tbinom":
				hasBarLine = false;
				leftDelim = "(";
				rightDelim = ")";
				break;
			case "\\\\bracefrac":
				hasBarLine = false;
				leftDelim = "\\{";
				rightDelim = "\\}";
				break;
			case "\\\\brackfrac":
				hasBarLine = false;
				leftDelim = "[";
				rightDelim = "]";
				break;
			default: throw new Error("Unrecognized genfrac command");
		}
		var continued = funcName === "\\cfrac";
		var style = null;
		if (continued || funcName.startsWith("\\d")) style = "display";
		else if (funcName.startsWith("\\t")) style = "text";
		return wrapWithStyle({
			type: "genfrac",
			mode: parser.mode,
			numer,
			denom,
			continued,
			hasBarLine,
			leftDelim,
			rightDelim,
			barSize: null
		}, style);
	},
	htmlBuilder: htmlBuilder$4,
	mathmlBuilder: mathmlBuilder$3
});
defineFunction({
	type: "infix",
	names: [
		"\\over",
		"\\choose",
		"\\atop",
		"\\brace",
		"\\brack"
	],
	props: {
		numArgs: 0,
		infix: true
	},
	handler(_ref2) {
		var { parser, funcName, token } = _ref2;
		var replaceWith;
		switch (funcName) {
			case "\\over":
				replaceWith = "\\frac";
				break;
			case "\\choose":
				replaceWith = "\\binom";
				break;
			case "\\atop":
				replaceWith = "\\\\atopfrac";
				break;
			case "\\brace":
				replaceWith = "\\\\bracefrac";
				break;
			case "\\brack":
				replaceWith = "\\\\brackfrac";
				break;
			default: throw new Error("Unrecognized infix genfrac command");
		}
		return {
			type: "infix",
			mode: parser.mode,
			replaceWith,
			token
		};
	}
});
var stylArray = [
	"display",
	"text",
	"script",
	"scriptscript"
];
var delimFromValue = function delimFromValue(delimString) {
	var delim = null;
	if (delimString.length > 0) {
		delim = delimString;
		delim = delim === "." ? null : delim;
	}
	return delim;
};
defineFunction({
	type: "genfrac",
	names: ["\\genfrac"],
	props: {
		numArgs: 6,
		allowedInArgument: true,
		argTypes: [
			"math",
			"math",
			"size",
			"text",
			"math",
			"math"
		]
	},
	handler(_ref3, args) {
		var { parser } = _ref3;
		var numer = args[4];
		var denom = args[5];
		var leftNode = normalizeArgument(args[0]);
		var leftDelim = leftNode.type === "atom" && leftNode.family === "open" ? delimFromValue(leftNode.text) : null;
		var rightNode = normalizeArgument(args[1]);
		var rightDelim = rightNode.type === "atom" && rightNode.family === "close" ? delimFromValue(rightNode.text) : null;
		var barNode = assertNodeType(args[2], "size");
		var hasBarLine;
		var barSize = null;
		if (barNode.isBlank) hasBarLine = true;
		else {
			barSize = barNode.value;
			hasBarLine = barSize.number > 0;
		}
		var size = null;
		var styl = args[3];
		if (styl.type === "ordgroup") {
			if (styl.body.length > 0) {
				var textOrd = assertNodeType(styl.body[0], "textord");
				size = stylArray[Number(textOrd.text)];
			}
		} else {
			styl = assertNodeType(styl, "textord");
			size = stylArray[Number(styl.text)];
		}
		return wrapWithStyle({
			type: "genfrac",
			mode: parser.mode,
			numer,
			denom,
			continued: false,
			hasBarLine,
			barSize,
			leftDelim,
			rightDelim
		}, size);
	}
});
defineFunction({
	type: "infix",
	names: ["\\above"],
	props: {
		numArgs: 1,
		argTypes: ["size"],
		infix: true
	},
	handler(_ref4, args) {
		var { parser, funcName, token } = _ref4;
		return {
			type: "infix",
			mode: parser.mode,
			replaceWith: "\\\\abovefrac",
			size: assertNodeType(args[0], "size").value,
			token
		};
	}
});
defineFunction({
	type: "genfrac",
	names: ["\\\\abovefrac"],
	props: {
		numArgs: 3,
		argTypes: [
			"math",
			"size",
			"math"
		]
	},
	handler: (_ref5, args) => {
		var { parser, funcName } = _ref5;
		var numer = args[0];
		var barSize = assertNodeType(args[1], "infix").size;
		if (!barSize) throw new Error("\\\\abovefrac expected size, but got " + String(barSize));
		var denom = args[2];
		var hasBarLine = barSize.number > 0;
		return {
			type: "genfrac",
			mode: parser.mode,
			numer,
			denom,
			continued: false,
			hasBarLine,
			barSize,
			leftDelim: null,
			rightDelim: null
		};
	}
});
var htmlBuilder$3 = (grp, options) => {
	var style = options.style;
	var supSubGroup;
	var group;
	if (grp.type === "supsub") {
		supSubGroup = grp.sup ? buildGroup$1(grp.sup, options.havingStyle(style.sup()), options) : buildGroup$1(grp.sub, options.havingStyle(style.sub()), options);
		group = assertNodeType(grp.base, "horizBrace");
	} else group = assertNodeType(grp, "horizBrace");
	var body = buildGroup$1(group.base, options.havingBaseStyle(Style$1.DISPLAY));
	var braceBody = stretchySvg(group, options);
	var vlist;
	if (group.isOver) vlist = makeVList({
		positionType: "firstBaseline",
		children: [
			{
				type: "elem",
				elem: body
			},
			{
				type: "kern",
				size: .1
			},
			{
				type: "elem",
				elem: braceBody,
				wrapperClasses: ["svg-align"]
			}
		]
	});
	else vlist = makeVList({
		positionType: "bottom",
		positionData: body.depth + .1 + braceBody.height,
		children: [
			{
				type: "elem",
				elem: braceBody,
				wrapperClasses: ["svg-align"]
			},
			{
				type: "kern",
				size: .1
			},
			{
				type: "elem",
				elem: body
			}
		]
	});
	if (supSubGroup) {
		var vSpan = makeSpan(["minner", group.isOver ? "mover" : "munder"], [vlist], options);
		if (group.isOver) vlist = makeVList({
			positionType: "firstBaseline",
			children: [
				{
					type: "elem",
					elem: vSpan
				},
				{
					type: "kern",
					size: .2
				},
				{
					type: "elem",
					elem: supSubGroup
				}
			]
		});
		else vlist = makeVList({
			positionType: "bottom",
			positionData: vSpan.depth + .2 + supSubGroup.height + supSubGroup.depth,
			children: [
				{
					type: "elem",
					elem: supSubGroup
				},
				{
					type: "kern",
					size: .2
				},
				{
					type: "elem",
					elem: vSpan
				}
			]
		});
	}
	return makeSpan(["minner", group.isOver ? "mover" : "munder"], [vlist], options);
};
var mathmlBuilder$2 = (group, options) => {
	var accentNode = stretchyMathML(group.label);
	return new MathNode(group.isOver ? "mover" : "munder", [buildGroup(group.base, options), accentNode]);
};
defineFunction({
	type: "horizBrace",
	names: [
		"\\overbrace",
		"\\underbrace",
		"\\overbracket",
		"\\underbracket"
	],
	props: { numArgs: 1 },
	handler(_ref, args) {
		var { parser, funcName } = _ref;
		return {
			type: "horizBrace",
			mode: parser.mode,
			label: funcName,
			isOver: funcName.includes("\\over"),
			base: args[0]
		};
	},
	htmlBuilder: htmlBuilder$3,
	mathmlBuilder: mathmlBuilder$2
});
defineFunction({
	type: "href",
	names: ["\\href"],
	props: {
		numArgs: 2,
		argTypes: ["url", "original"],
		allowedInText: true
	},
	handler: (_ref, args) => {
		var { parser } = _ref;
		var body = args[1];
		var href = assertNodeType(args[0], "url").url;
		if (!parser.settings.isTrusted({
			command: "\\href",
			url: href
		})) return parser.formatUnsupportedCmd("\\href");
		return {
			type: "href",
			mode: parser.mode,
			href,
			body: ordargument(body)
		};
	},
	htmlBuilder: (group, options) => {
		var elements = buildExpression$1(group.body, options, false);
		return makeAnchor(group.href, [], elements, options);
	},
	mathmlBuilder: (group, options) => {
		var math = buildExpressionRow(group.body, options);
		if (!(math instanceof MathNode)) math = new MathNode("mrow", [math]);
		math.setAttribute("href", group.href);
		return math;
	}
});
defineFunction({
	type: "href",
	names: ["\\url"],
	props: {
		numArgs: 1,
		argTypes: ["url"],
		allowedInText: true
	},
	handler: (_ref2, args) => {
		var { parser } = _ref2;
		var href = assertNodeType(args[0], "url").url;
		if (!parser.settings.isTrusted({
			command: "\\url",
			url: href
		})) return parser.formatUnsupportedCmd("\\url");
		var chars = [];
		for (var i = 0; i < href.length; i++) {
			var c = href[i];
			if (c === "~") c = "\\textasciitilde";
			chars.push({
				type: "textord",
				mode: "text",
				text: c
			});
		}
		var body = {
			type: "text",
			mode: parser.mode,
			font: "\\texttt",
			body: chars
		};
		return {
			type: "href",
			mode: parser.mode,
			href,
			body: ordargument(body)
		};
	}
});
defineFunction({
	type: "hbox",
	names: ["\\hbox"],
	props: {
		numArgs: 1,
		argTypes: ["text"],
		allowedInText: true,
		primitive: true
	},
	handler(_ref, args) {
		var { parser } = _ref;
		return {
			type: "hbox",
			mode: parser.mode,
			body: ordargument(args[0])
		};
	},
	htmlBuilder(group, options) {
		return makeFragment(buildExpression$1(group.body, options.withFont(""), false));
	},
	mathmlBuilder(group, options) {
		return new MathNode("mrow", buildExpression(group.body, options.withFont("")));
	}
});
defineFunction({
	type: "html",
	names: [
		"\\htmlClass",
		"\\htmlId",
		"\\htmlStyle",
		"\\htmlData"
	],
	props: {
		numArgs: 2,
		argTypes: ["raw", "original"],
		allowedInText: true
	},
	handler: (_ref, args) => {
		var { parser, funcName, token } = _ref;
		var value = assertNodeType(args[0], "raw").string;
		var body = args[1];
		if (parser.settings.strict) parser.settings.reportNonstrict("htmlExtension", "HTML extension is disabled on strict mode");
		var trustContext;
		var attributes = {};
		switch (funcName) {
			case "\\htmlClass":
				attributes.class = value;
				trustContext = {
					command: "\\htmlClass",
					class: value
				};
				break;
			case "\\htmlId":
				attributes.id = value;
				trustContext = {
					command: "\\htmlId",
					id: value
				};
				break;
			case "\\htmlStyle":
				attributes.style = value;
				trustContext = {
					command: "\\htmlStyle",
					style: value
				};
				break;
			case "\\htmlData":
				var data = value.split(",");
				for (var i = 0; i < data.length; i++) {
					var item = data[i];
					var firstEquals = item.indexOf("=");
					if (firstEquals < 0) throw new ParseError("\\htmlData key/value '" + item + "' missing equals sign");
					var key = item.slice(0, firstEquals);
					var _value = item.slice(firstEquals + 1);
					attributes["data-" + key.trim()] = _value;
				}
				trustContext = {
					command: "\\htmlData",
					attributes
				};
				break;
			default: throw new Error("Unrecognized html command");
		}
		if (!parser.settings.isTrusted(trustContext)) return parser.formatUnsupportedCmd(funcName);
		return {
			type: "html",
			mode: parser.mode,
			attributes,
			body: ordargument(body)
		};
	},
	htmlBuilder: (group, options) => {
		var elements = buildExpression$1(group.body, options, false);
		var classes = ["enclosing"];
		if (group.attributes.class) classes.push(...group.attributes.class.trim().split(/\s+/));
		var span = makeSpan(classes, elements, options);
		for (var attr in group.attributes) if (attr !== "class" && group.attributes.hasOwnProperty(attr)) span.setAttribute(attr, group.attributes[attr]);
		return span;
	},
	mathmlBuilder: (group, options) => {
		return buildExpressionRow(group.body, options);
	}
});
defineFunction({
	type: "htmlmathml",
	names: ["\\html@mathml"],
	props: {
		numArgs: 2,
		allowedInArgument: true,
		allowedInText: true
	},
	handler: (_ref, args) => {
		var { parser } = _ref;
		return {
			type: "htmlmathml",
			mode: parser.mode,
			html: ordargument(args[0]),
			mathml: ordargument(args[1])
		};
	},
	htmlBuilder: (group, options) => {
		return makeFragment(buildExpression$1(group.html, options, false));
	},
	mathmlBuilder: (group, options) => {
		return buildExpressionRow(group.mathml, options);
	}
});
var sizeData = function sizeData(str) {
	if (/^[-+]? *(\d+(\.\d*)?|\.\d+)$/.test(str)) return {
		number: +str,
		unit: "bp"
	};
	else {
		var match = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(str);
		if (!match) throw new ParseError("Invalid size: '" + str + "' in \\includegraphics");
		var data = {
			number: +(match[1] + match[2]),
			unit: match[3]
		};
		if (!validUnit(data)) throw new ParseError("Invalid unit: '" + data.unit + "' in \\includegraphics.");
		return data;
	}
};
defineFunction({
	type: "includegraphics",
	names: ["\\includegraphics"],
	props: {
		numArgs: 1,
		numOptionalArgs: 1,
		argTypes: ["raw", "url"],
		allowedInText: false
	},
	handler: (_ref, args, optArgs) => {
		var { parser } = _ref;
		var width = {
			number: 0,
			unit: "em"
		};
		var height = {
			number: .9,
			unit: "em"
		};
		var totalheight = {
			number: 0,
			unit: "em"
		};
		var alt = "";
		if (optArgs[0]) {
			var attributes = assertNodeType(optArgs[0], "raw").string.split(",");
			for (var i = 0; i < attributes.length; i++) {
				var keyVal = attributes[i].split("=");
				if (keyVal.length === 2) {
					var str = keyVal[1].trim();
					switch (keyVal[0].trim()) {
						case "alt":
							alt = str;
							break;
						case "width":
							width = sizeData(str);
							break;
						case "height":
							height = sizeData(str);
							break;
						case "totalheight":
							totalheight = sizeData(str);
							break;
						default: throw new ParseError("Invalid key: '" + keyVal[0] + "' in \\includegraphics.");
					}
				}
			}
		}
		var src = assertNodeType(args[0], "url").url;
		if (alt === "") {
			alt = src;
			alt = alt.replace(/^.*[\\/]/, "");
			alt = alt.substring(0, alt.lastIndexOf("."));
		}
		if (!parser.settings.isTrusted({
			command: "\\includegraphics",
			url: src
		})) return parser.formatUnsupportedCmd("\\includegraphics");
		return {
			type: "includegraphics",
			mode: parser.mode,
			alt,
			width,
			height,
			totalheight,
			src
		};
	},
	htmlBuilder: (group, options) => {
		var height = calculateSize(group.height, options);
		var depth = 0;
		if (group.totalheight.number > 0) depth = calculateSize(group.totalheight, options) - height;
		var width = 0;
		if (group.width.number > 0) width = calculateSize(group.width, options);
		var style = { height: makeEm(height + depth) };
		if (width > 0) style.width = makeEm(width);
		if (depth > 0) style.verticalAlign = makeEm(-depth);
		var node = new Img(group.src, group.alt, style);
		node.height = height;
		node.depth = depth;
		return node;
	},
	mathmlBuilder: (group, options) => {
		var node = new MathNode("mglyph", []);
		node.setAttribute("alt", group.alt);
		var height = calculateSize(group.height, options);
		var depth = 0;
		if (group.totalheight.number > 0) {
			depth = calculateSize(group.totalheight, options) - height;
			node.setAttribute("valign", makeEm(-depth));
		}
		node.setAttribute("height", makeEm(height + depth));
		if (group.width.number > 0) {
			var width = calculateSize(group.width, options);
			node.setAttribute("width", makeEm(width));
		}
		node.setAttribute("src", group.src);
		return node;
	}
});
defineFunction({
	type: "kern",
	names: [
		"\\kern",
		"\\mkern",
		"\\hskip",
		"\\mskip"
	],
	props: {
		numArgs: 1,
		argTypes: ["size"],
		primitive: true,
		allowedInText: true
	},
	handler(_ref, args) {
		var { parser, funcName } = _ref;
		var size = assertNodeType(args[0], "size");
		if (parser.settings.strict) {
			var mathFunction = funcName[1] === "m";
			var muUnit = size.value.unit === "mu";
			if (mathFunction) {
				if (!muUnit) parser.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + funcName + " supports only mu units, " + ("not " + size.value.unit + " units"));
				if (parser.mode !== "math") parser.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + funcName + " works only in math mode");
			} else if (muUnit) parser.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + funcName + " doesn't support mu units");
		}
		return {
			type: "kern",
			mode: parser.mode,
			dimension: size.value
		};
	},
	htmlBuilder(group, options) {
		return makeGlue(group.dimension, options);
	},
	mathmlBuilder(group, options) {
		return new SpaceNode(calculateSize(group.dimension, options));
	}
});
defineFunction({
	type: "lap",
	names: [
		"\\mathllap",
		"\\mathrlap",
		"\\mathclap"
	],
	props: {
		numArgs: 1,
		allowedInText: true
	},
	handler: (_ref, args) => {
		var { parser, funcName } = _ref;
		var body = args[0];
		return {
			type: "lap",
			mode: parser.mode,
			alignment: funcName.slice(5),
			body
		};
	},
	htmlBuilder: (group, options) => {
		var inner;
		if (group.alignment === "clap") {
			inner = makeSpan([], [buildGroup$1(group.body, options)]);
			inner = makeSpan(["inner"], [inner], options);
		} else inner = makeSpan(["inner"], [buildGroup$1(group.body, options)]);
		var fix = makeSpan(["fix"], []);
		var node = makeSpan([group.alignment], [inner, fix], options);
		var strut = makeSpan(["strut"]);
		strut.style.height = makeEm(node.height + node.depth);
		if (node.depth) strut.style.verticalAlign = makeEm(-node.depth);
		node.children.unshift(strut);
		node = makeSpan(["thinbox"], [node], options);
		return makeSpan(["mord", "vbox"], [node], options);
	},
	mathmlBuilder: (group, options) => {
		var node = new MathNode("mpadded", [buildGroup(group.body, options)]);
		if (group.alignment !== "rlap") {
			var offset = group.alignment === "llap" ? "-1" : "-0.5";
			node.setAttribute("lspace", offset + "width");
		}
		node.setAttribute("width", "0px");
		return node;
	}
});
defineFunction({
	type: "styling",
	names: ["\\(", "$"],
	props: {
		numArgs: 0,
		allowedInText: true,
		allowedInMath: false
	},
	handler(_ref, args) {
		var { funcName, parser } = _ref;
		var outerMode = parser.mode;
		parser.switchMode("math");
		var close = funcName === "\\(" ? "\\)" : "$";
		var body = parser.parseExpression(false, close);
		parser.expect(close);
		parser.switchMode(outerMode);
		return {
			type: "styling",
			mode: parser.mode,
			style: "text",
			resetFont: true,
			body
		};
	}
});
defineFunction({
	type: "text",
	names: ["\\)", "\\]"],
	props: {
		numArgs: 0,
		allowedInText: true,
		allowedInMath: false
	},
	handler(context, args) {
		throw new ParseError("Mismatched " + context.funcName);
	}
});
var chooseMathStyle = (group, options) => {
	switch (options.style.size) {
		case Style$1.DISPLAY.size: return group.display;
		case Style$1.TEXT.size: return group.text;
		case Style$1.SCRIPT.size: return group.script;
		case Style$1.SCRIPTSCRIPT.size: return group.scriptscript;
		default: return group.text;
	}
};
defineFunction({
	type: "mathchoice",
	names: ["\\mathchoice"],
	props: {
		numArgs: 4,
		primitive: true
	},
	handler: (_ref, args) => {
		var { parser } = _ref;
		return {
			type: "mathchoice",
			mode: parser.mode,
			display: ordargument(args[0]),
			text: ordargument(args[1]),
			script: ordargument(args[2]),
			scriptscript: ordargument(args[3])
		};
	},
	htmlBuilder: (group, options) => {
		return makeFragment(buildExpression$1(chooseMathStyle(group, options), options, false));
	},
	mathmlBuilder: (group, options) => {
		return buildExpressionRow(chooseMathStyle(group, options), options);
	}
});
var assembleSupSub = (base, supGroup, subGroup, options, style, slant, baseShift) => {
	base = makeSpan([], [base]);
	var subIsSingleCharacter = subGroup && isCharacterBox(subGroup);
	var sub;
	var sup;
	if (supGroup) {
		var elem = buildGroup$1(supGroup, options.havingStyle(style.sup()), options);
		sup = {
			elem,
			kern: Math.max(options.fontMetrics().bigOpSpacing1, options.fontMetrics().bigOpSpacing3 - elem.depth)
		};
	}
	if (subGroup) {
		var _elem = buildGroup$1(subGroup, options.havingStyle(style.sub()), options);
		sub = {
			elem: _elem,
			kern: Math.max(options.fontMetrics().bigOpSpacing2, options.fontMetrics().bigOpSpacing4 - _elem.height)
		};
	}
	var finalGroup;
	if (sup && sub) finalGroup = makeVList({
		positionType: "bottom",
		positionData: options.fontMetrics().bigOpSpacing5 + sub.elem.height + sub.elem.depth + sub.kern + base.depth + baseShift,
		children: [
			{
				type: "kern",
				size: options.fontMetrics().bigOpSpacing5
			},
			{
				type: "elem",
				elem: sub.elem,
				marginLeft: makeEm(-slant)
			},
			{
				type: "kern",
				size: sub.kern
			},
			{
				type: "elem",
				elem: base
			},
			{
				type: "kern",
				size: sup.kern
			},
			{
				type: "elem",
				elem: sup.elem,
				marginLeft: makeEm(slant)
			},
			{
				type: "kern",
				size: options.fontMetrics().bigOpSpacing5
			}
		]
	});
	else if (sub) finalGroup = makeVList({
		positionType: "top",
		positionData: base.height - baseShift,
		children: [
			{
				type: "kern",
				size: options.fontMetrics().bigOpSpacing5
			},
			{
				type: "elem",
				elem: sub.elem,
				marginLeft: makeEm(-slant)
			},
			{
				type: "kern",
				size: sub.kern
			},
			{
				type: "elem",
				elem: base
			}
		]
	});
	else if (sup) finalGroup = makeVList({
		positionType: "bottom",
		positionData: base.depth + baseShift,
		children: [
			{
				type: "elem",
				elem: base
			},
			{
				type: "kern",
				size: sup.kern
			},
			{
				type: "elem",
				elem: sup.elem,
				marginLeft: makeEm(slant)
			},
			{
				type: "kern",
				size: options.fontMetrics().bigOpSpacing5
			}
		]
	});
	else return base;
	var parts = [finalGroup];
	if (sub && slant !== 0 && !subIsSingleCharacter) {
		var spacer = makeSpan(["mspace"], [], options);
		spacer.style.marginRight = makeEm(slant);
		parts.unshift(spacer);
	}
	return makeSpan(["mop", "op-limits"], parts, options);
};
var noSuccessor = /* @__PURE__ */ new Set(["\\smallint"]);
var htmlBuilder$2 = (grp, options) => {
	var supGroup;
	var subGroup;
	var hasLimits = false;
	var group;
	if (grp.type === "supsub") {
		supGroup = grp.sup;
		subGroup = grp.sub;
		group = assertNodeType(grp.base, "op");
		hasLimits = true;
	} else group = assertNodeType(grp, "op");
	var style = options.style;
	var large = false;
	if (style.size === Style$1.DISPLAY.size && group.symbol && !noSuccessor.has(group.name)) large = true;
	var base;
	var symbolItalic;
	if (group.symbol) {
		var fontName = large ? "Size2-Regular" : "Size1-Regular";
		var stash = "";
		if (group.name === "\\oiint" || group.name === "\\oiiint") {
			stash = group.name.slice(1);
			group.name = stash === "oiint" ? "\\iint" : "\\iiint";
		}
		base = makeSymbol(group.name, fontName, "math", options, [
			"mop",
			"op-symbol",
			large ? "large-op" : "small-op"
		]);
		symbolItalic = base.italic;
		if (stash.length > 0) {
			var oval = staticSvg(stash + "Size" + (large ? "2" : "1"), options);
			base = makeVList({
				positionType: "individualShift",
				children: [{
					type: "elem",
					elem: base,
					shift: 0
				}, {
					type: "elem",
					elem: oval,
					shift: large ? .08 : 0
				}]
			});
			group.name = "\\" + stash;
			base.classes.unshift("mop");
			base.italic = symbolItalic;
		}
	} else if (group.body) {
		var inner = buildExpression$1(group.body, options, true);
		if (inner.length === 1 && inner[0] instanceof SymbolNode) {
			base = inner[0];
			base.classes[0] = "mop";
		} else base = makeSpan(["mop"], inner, options);
	} else {
		var output = [];
		for (var i = 1; i < group.name.length; i++) output.push(mathsym(group.name[i], group.mode, options));
		base = makeSpan(["mop"], output, options);
	}
	var baseShift = 0;
	var slant = 0;
	if ((base instanceof SymbolNode || group.name === "\\oiint" || group.name === "\\oiiint") && !group.suppressBaseShift) {
		var _base$italic;
		baseShift = (base.height - base.depth) / 2 - options.fontMetrics().axisHeight;
		slant = (_base$italic = base.italic) != null ? _base$italic : 0;
	}
	if (hasLimits) return assembleSupSub(base, supGroup, subGroup, options, style, slant, baseShift);
	else {
		if (baseShift) {
			base.style.position = "relative";
			base.style.top = makeEm(baseShift);
		}
		return base;
	}
};
var mathmlBuilder$1 = (group, options) => {
	var node;
	if (group.symbol) {
		node = new MathNode("mo", [makeText(group.name, group.mode)]);
		if (noSuccessor.has(group.name)) node.setAttribute("largeop", "false");
	} else if (group.body) node = new MathNode("mo", buildExpression(group.body, options));
	else {
		node = new MathNode("mi", [new TextNode(group.name.slice(1))]);
		var operator = new MathNode("mo", [makeText("⁡", "text")]);
		if (group.parentIsSupSub) node = new MathNode("mrow", [node, operator]);
		else node = newDocumentFragment([node, operator]);
	}
	return node;
};
var singleCharBigOps = {
	"∏": "\\prod",
	"∐": "\\coprod",
	"∑": "\\sum",
	"⋀": "\\bigwedge",
	"⋁": "\\bigvee",
	"⋂": "\\bigcap",
	"⋃": "\\bigcup",
	"⨀": "\\bigodot",
	"⨁": "\\bigoplus",
	"⨂": "\\bigotimes",
	"⨄": "\\biguplus",
	"⨆": "\\bigsqcup"
};
defineFunction({
	type: "op",
	names: [
		"\\coprod",
		"\\bigvee",
		"\\bigwedge",
		"\\biguplus",
		"\\bigcap",
		"\\bigcup",
		"\\intop",
		"\\prod",
		"\\sum",
		"\\bigotimes",
		"\\bigoplus",
		"\\bigodot",
		"\\bigsqcup",
		"\\smallint",
		"∏",
		"∐",
		"∑",
		"⋀",
		"⋁",
		"⋂",
		"⋃",
		"⨀",
		"⨁",
		"⨂",
		"⨄",
		"⨆"
	],
	props: { numArgs: 0 },
	handler: (_ref, args) => {
		var { parser, funcName } = _ref;
		var fName = funcName;
		if (fName.length === 1) fName = singleCharBigOps[fName];
		return {
			type: "op",
			mode: parser.mode,
			limits: true,
			parentIsSupSub: false,
			symbol: true,
			name: fName
		};
	},
	htmlBuilder: htmlBuilder$2,
	mathmlBuilder: mathmlBuilder$1
});
defineFunction({
	type: "op",
	names: ["\\mathop"],
	props: {
		numArgs: 1,
		primitive: true
	},
	handler: (_ref2, args) => {
		var { parser } = _ref2;
		var body = args[0];
		return {
			type: "op",
			mode: parser.mode,
			limits: false,
			parentIsSupSub: false,
			symbol: false,
			body: ordargument(body)
		};
	},
	htmlBuilder: htmlBuilder$2,
	mathmlBuilder: mathmlBuilder$1
});
var singleCharIntegrals = {
	"∫": "\\int",
	"∬": "\\iint",
	"∭": "\\iiint",
	"∮": "\\oint",
	"∯": "\\oiint",
	"∰": "\\oiiint"
};
defineFunction({
	type: "op",
	names: [
		"\\arcsin",
		"\\arccos",
		"\\arctan",
		"\\arctg",
		"\\arcctg",
		"\\arg",
		"\\ch",
		"\\cos",
		"\\cosec",
		"\\cosh",
		"\\cot",
		"\\cotg",
		"\\coth",
		"\\csc",
		"\\ctg",
		"\\cth",
		"\\deg",
		"\\dim",
		"\\exp",
		"\\hom",
		"\\ker",
		"\\lg",
		"\\ln",
		"\\log",
		"\\sec",
		"\\sin",
		"\\sinh",
		"\\sh",
		"\\tan",
		"\\tanh",
		"\\tg",
		"\\th"
	],
	props: { numArgs: 0 },
	handler(_ref3) {
		var { parser, funcName } = _ref3;
		return {
			type: "op",
			mode: parser.mode,
			limits: false,
			parentIsSupSub: false,
			symbol: false,
			name: funcName
		};
	},
	htmlBuilder: htmlBuilder$2,
	mathmlBuilder: mathmlBuilder$1
});
defineFunction({
	type: "op",
	names: [
		"\\det",
		"\\gcd",
		"\\inf",
		"\\lim",
		"\\max",
		"\\min",
		"\\Pr",
		"\\sup"
	],
	props: { numArgs: 0 },
	handler(_ref4) {
		var { parser, funcName } = _ref4;
		return {
			type: "op",
			mode: parser.mode,
			limits: true,
			parentIsSupSub: false,
			symbol: false,
			name: funcName
		};
	},
	htmlBuilder: htmlBuilder$2,
	mathmlBuilder: mathmlBuilder$1
});
defineFunction({
	type: "op",
	names: [
		"\\int",
		"\\iint",
		"\\iiint",
		"\\oint",
		"\\oiint",
		"\\oiiint",
		"∫",
		"∬",
		"∭",
		"∮",
		"∯",
		"∰"
	],
	props: {
		numArgs: 0,
		allowedInArgument: true
	},
	handler(_ref5) {
		var { parser, funcName } = _ref5;
		var fName = funcName;
		if (fName.length === 1) fName = singleCharIntegrals[fName];
		return {
			type: "op",
			mode: parser.mode,
			limits: false,
			parentIsSupSub: false,
			symbol: true,
			name: fName
		};
	},
	htmlBuilder: htmlBuilder$2,
	mathmlBuilder: mathmlBuilder$1
});
var htmlBuilder$1 = (grp, options) => {
	var supGroup;
	var subGroup;
	var hasLimits = false;
	var group;
	if (grp.type === "supsub") {
		supGroup = grp.sup;
		subGroup = grp.sub;
		group = assertNodeType(grp.base, "operatorname");
		hasLimits = true;
	} else group = assertNodeType(grp, "operatorname");
	var base;
	if (group.body.length > 0) {
		var expression = buildExpression$1(group.body.map((child) => {
			var childText = "text" in child ? child.text : void 0;
			if (typeof childText === "string") return {
				type: "textord",
				mode: child.mode,
				text: childText
			};
			else return child;
		}), options.withFont("mathrm"), true);
		for (var i = 0; i < expression.length; i++) {
			var child = expression[i];
			if (child instanceof SymbolNode) child.text = child.text.replace(/\u2212/, "-").replace(/\u2217/, "*");
		}
		base = makeSpan(["mop"], expression, options);
	} else base = makeSpan(["mop"], [], options);
	if (hasLimits) return assembleSupSub(base, supGroup, subGroup, options, options.style, 0, 0);
	else return base;
};
var mathmlBuilder = (group, options) => {
	var expression = buildExpression(group.body, options.withFont("mathrm"));
	var isAllString = true;
	for (var i = 0; i < expression.length; i++) {
		var node = expression[i];
		if (node instanceof SpaceNode);
		else if (node instanceof MathNode) switch (node.type) {
			case "mi":
			case "mn":
			case "mspace":
			case "mtext": break;
			case "mo":
				var child = node.children[0];
				if (node.children.length === 1 && child instanceof TextNode) child.text = child.text.replace(/\u2212/, "-").replace(/\u2217/, "*");
				else isAllString = false;
				break;
			default: isAllString = false;
		}
		else isAllString = false;
	}
	if (isAllString) expression = [new TextNode(expression.map((node) => node.toText()).join(""))];
	var identifier = new MathNode("mi", expression);
	identifier.setAttribute("mathvariant", "normal");
	var operator = new MathNode("mo", [makeText("⁡", "text")]);
	if (group.parentIsSupSub) return new MathNode("mrow", [identifier, operator]);
	else return newDocumentFragment([identifier, operator]);
};
defineFunction({
	type: "operatorname",
	names: ["\\operatorname@", "\\operatornamewithlimits"],
	props: { numArgs: 1 },
	handler: (_ref, args) => {
		var { parser, funcName } = _ref;
		var body = args[0];
		return {
			type: "operatorname",
			mode: parser.mode,
			body: ordargument(body),
			alwaysHandleSupSub: funcName === "\\operatornamewithlimits",
			limits: false,
			parentIsSupSub: false
		};
	},
	htmlBuilder: htmlBuilder$1,
	mathmlBuilder
});
defineMacro("\\operatorname", "\\@ifstar\\operatornamewithlimits\\operatorname@");
defineFunctionBuilders({
	type: "ordgroup",
	htmlBuilder(group, options) {
		if (group.semisimple) return makeFragment(buildExpression$1(group.body, options, false));
		return makeSpan(["mord"], buildExpression$1(group.body, options, true), options);
	},
	mathmlBuilder(group, options) {
		return buildExpressionRow(group.body, options, true);
	}
});
defineFunction({
	type: "overline",
	names: ["\\overline"],
	props: { numArgs: 1 },
	handler(_ref, args) {
		var { parser } = _ref;
		var body = args[0];
		return {
			type: "overline",
			mode: parser.mode,
			body
		};
	},
	htmlBuilder(group, options) {
		var innerGroup = buildGroup$1(group.body, options.havingCrampedStyle());
		var line = makeLineSpan("overline-line", options);
		var defaultRuleThickness = options.fontMetrics().defaultRuleThickness;
		return makeSpan(["mord", "overline"], [makeVList({
			positionType: "firstBaseline",
			children: [
				{
					type: "elem",
					elem: innerGroup
				},
				{
					type: "kern",
					size: 3 * defaultRuleThickness
				},
				{
					type: "elem",
					elem: line
				},
				{
					type: "kern",
					size: defaultRuleThickness
				}
			]
		})], options);
	},
	mathmlBuilder(group, options) {
		var operator = new MathNode("mo", [new TextNode("‾")]);
		operator.setAttribute("stretchy", "true");
		var node = new MathNode("mover", [buildGroup(group.body, options), operator]);
		node.setAttribute("accent", "true");
		return node;
	}
});
defineFunction({
	type: "phantom",
	names: ["\\phantom"],
	props: {
		numArgs: 1,
		allowedInText: true
	},
	handler: (_ref, args) => {
		var { parser } = _ref;
		var body = args[0];
		return {
			type: "phantom",
			mode: parser.mode,
			body: ordargument(body)
		};
	},
	htmlBuilder: (group, options) => {
		return makeFragment(buildExpression$1(group.body, options.withPhantom(), false));
	},
	mathmlBuilder: (group, options) => {
		return new MathNode("mphantom", buildExpression(group.body, options));
	}
});
defineMacro("\\hphantom", "\\smash{\\phantom{#1}}");
defineFunction({
	type: "vphantom",
	names: ["\\vphantom"],
	props: {
		numArgs: 1,
		allowedInText: true
	},
	handler: (_ref2, args) => {
		var { parser } = _ref2;
		var body = args[0];
		return {
			type: "vphantom",
			mode: parser.mode,
			body
		};
	},
	htmlBuilder: (group, options) => {
		return makeSpan(["mord", "rlap"], [makeSpan(["inner"], [buildGroup$1(group.body, options.withPhantom())]), makeSpan(["fix"], [])], options);
	},
	mathmlBuilder: (group, options) => {
		var node = new MathNode("mpadded", [new MathNode("mphantom", buildExpression(ordargument(group.body), options))]);
		node.setAttribute("width", "0px");
		return node;
	}
});
defineFunction({
	type: "raisebox",
	names: ["\\raisebox"],
	props: {
		numArgs: 2,
		argTypes: ["size", "hbox"],
		allowedInText: true
	},
	handler(_ref, args) {
		var { parser } = _ref;
		var amount = assertNodeType(args[0], "size").value;
		var body = args[1];
		return {
			type: "raisebox",
			mode: parser.mode,
			dy: amount,
			body
		};
	},
	htmlBuilder(group, options) {
		var body = buildGroup$1(group.body, options);
		return makeVList({
			positionType: "shift",
			positionData: -calculateSize(group.dy, options),
			children: [{
				type: "elem",
				elem: body
			}]
		});
	},
	mathmlBuilder(group, options) {
		var node = new MathNode("mpadded", [buildGroup(group.body, options)]);
		var dy = group.dy.number + group.dy.unit;
		node.setAttribute("voffset", dy);
		return node;
	}
});
defineFunction({
	type: "internal",
	names: ["\\relax"],
	props: {
		numArgs: 0,
		allowedInText: true,
		allowedInArgument: true
	},
	handler(_ref) {
		var { parser } = _ref;
		return {
			type: "internal",
			mode: parser.mode
		};
	}
});
defineFunction({
	type: "rule",
	names: ["\\rule"],
	props: {
		numArgs: 2,
		numOptionalArgs: 1,
		allowedInText: true,
		allowedInMath: true,
		argTypes: [
			"size",
			"size",
			"size"
		]
	},
	handler(_ref, args, optArgs) {
		var { parser } = _ref;
		var shift = optArgs[0];
		var width = assertNodeType(args[0], "size");
		var height = assertNodeType(args[1], "size");
		return {
			type: "rule",
			mode: parser.mode,
			shift: shift && assertNodeType(shift, "size").value,
			width: width.value,
			height: height.value
		};
	},
	htmlBuilder(group, options) {
		var rule = makeSpan(["mord", "rule"], [], options);
		var width = calculateSize(group.width, options);
		var height = calculateSize(group.height, options);
		var shift = group.shift ? calculateSize(group.shift, options) : 0;
		rule.style.borderRightWidth = makeEm(width);
		rule.style.borderTopWidth = makeEm(height);
		rule.style.bottom = makeEm(shift);
		rule.width = width;
		rule.height = height + shift;
		rule.depth = -shift;
		rule.maxFontSize = height * 1.125 * options.sizeMultiplier;
		return rule;
	},
	mathmlBuilder(group, options) {
		var width = calculateSize(group.width, options);
		var height = calculateSize(group.height, options);
		var shift = group.shift ? calculateSize(group.shift, options) : 0;
		var color = options.color && options.getColor() || "black";
		var rule = new MathNode("mspace");
		rule.setAttribute("mathbackground", color);
		rule.setAttribute("width", makeEm(width));
		rule.setAttribute("height", makeEm(height));
		var wrapper = new MathNode("mpadded", [rule]);
		if (shift >= 0) wrapper.setAttribute("height", makeEm(shift));
		else {
			wrapper.setAttribute("height", makeEm(shift));
			wrapper.setAttribute("depth", makeEm(-shift));
		}
		wrapper.setAttribute("voffset", makeEm(shift));
		return wrapper;
	}
});
function sizingGroup(value, options, baseOptions) {
	var inner = buildExpression$1(value, options, false);
	var multiplier = options.sizeMultiplier / baseOptions.sizeMultiplier;
	for (var i = 0; i < inner.length; i++) {
		var pos = inner[i].classes.indexOf("sizing");
		if (pos < 0) Array.prototype.push.apply(inner[i].classes, options.sizingClasses(baseOptions));
		else if (inner[i].classes[pos + 1] === "reset-size" + options.size) inner[i].classes[pos + 1] = "reset-size" + baseOptions.size;
		inner[i].height *= multiplier;
		inner[i].depth *= multiplier;
	}
	return makeFragment(inner);
}
var sizeFuncs = [
	"\\tiny",
	"\\sixptsize",
	"\\scriptsize",
	"\\footnotesize",
	"\\small",
	"\\normalsize",
	"\\large",
	"\\Large",
	"\\LARGE",
	"\\huge",
	"\\Huge"
];
var htmlBuilder = (group, options) => {
	var newOptions = options.havingSize(group.size);
	return sizingGroup(group.body, newOptions, options);
};
defineFunction({
	type: "sizing",
	names: sizeFuncs,
	props: {
		numArgs: 0,
		allowedInText: true
	},
	handler: (_ref, args) => {
		var { breakOnTokenText, funcName, parser } = _ref;
		var body = parser.parseExpression(false, breakOnTokenText);
		return {
			type: "sizing",
			mode: parser.mode,
			size: sizeFuncs.indexOf(funcName) + 1,
			body
		};
	},
	htmlBuilder,
	mathmlBuilder: (group, options) => {
		var newOptions = options.havingSize(group.size);
		var node = new MathNode("mstyle", buildExpression(group.body, newOptions));
		node.setAttribute("mathsize", makeEm(newOptions.sizeMultiplier));
		return node;
	}
});
defineFunction({
	type: "smash",
	names: ["\\smash"],
	props: {
		numArgs: 1,
		numOptionalArgs: 1,
		allowedInText: true
	},
	handler: (_ref, args, optArgs) => {
		var { parser } = _ref;
		var smashHeight = false;
		var smashDepth = false;
		var tbArg = optArgs[0] && assertNodeType(optArgs[0], "ordgroup");
		if (tbArg) {
			var letter;
			for (var i = 0; i < tbArg.body.length; ++i) {
				var node = tbArg.body[i];
				letter = assertSymbolNodeType(node).text;
				if (letter === "t") smashHeight = true;
				else if (letter === "b") smashDepth = true;
				else {
					smashHeight = false;
					smashDepth = false;
					break;
				}
			}
		} else {
			smashHeight = true;
			smashDepth = true;
		}
		var body = args[0];
		return {
			type: "smash",
			mode: parser.mode,
			body,
			smashHeight,
			smashDepth
		};
	},
	htmlBuilder: (group, options) => {
		var node = makeSpan([], [buildGroup$1(group.body, options)]);
		if (!group.smashHeight && !group.smashDepth) return node;
		if (group.smashHeight) node.height = 0;
		if (group.smashDepth) node.depth = 0;
		if (group.smashHeight && group.smashDepth) return makeSpan(["mord", "smash"], [node], options);
		if (node.children) for (var i = 0; i < node.children.length; i++) {
			if (group.smashHeight) node.children[i].height = 0;
			if (group.smashDepth) node.children[i].depth = 0;
		}
		return makeSpan(["mord"], [makeVList({
			positionType: "firstBaseline",
			children: [{
				type: "elem",
				elem: node
			}]
		})], options);
	},
	mathmlBuilder: (group, options) => {
		var node = new MathNode("mpadded", [buildGroup(group.body, options)]);
		if (group.smashHeight) node.setAttribute("height", "0px");
		if (group.smashDepth) node.setAttribute("depth", "0px");
		return node;
	}
});
defineFunction({
	type: "sqrt",
	names: ["\\sqrt"],
	props: {
		numArgs: 1,
		numOptionalArgs: 1
	},
	handler(_ref, args, optArgs) {
		var { parser } = _ref;
		var index = optArgs[0];
		var body = args[0];
		return {
			type: "sqrt",
			mode: parser.mode,
			body,
			index
		};
	},
	htmlBuilder(group, options) {
		var inner = buildGroup$1(group.body, options.havingCrampedStyle());
		if (inner.height === 0) inner.height = options.fontMetrics().xHeight;
		inner = wrapFragment(inner, options);
		var theta = options.fontMetrics().defaultRuleThickness;
		var phi = theta;
		if (options.style.id < Style$1.TEXT.id) phi = options.fontMetrics().xHeight;
		var lineClearance = theta + phi / 4;
		var { span: img, ruleWidth, advanceWidth } = makeSqrtImage(inner.height + inner.depth + lineClearance + theta, options);
		var delimDepth = img.height - ruleWidth;
		if (delimDepth > inner.height + inner.depth + lineClearance) lineClearance = (lineClearance + delimDepth - inner.height - inner.depth) / 2;
		var imgShift = img.height - inner.height - lineClearance - ruleWidth;
		inner.style.paddingLeft = makeEm(advanceWidth);
		var body = makeVList({
			positionType: "firstBaseline",
			children: [
				{
					type: "elem",
					elem: inner,
					wrapperClasses: ["svg-align"]
				},
				{
					type: "kern",
					size: -(inner.height + imgShift)
				},
				{
					type: "elem",
					elem: img
				},
				{
					type: "kern",
					size: ruleWidth
				}
			]
		});
		if (!group.index) return makeSpan(["mord", "sqrt"], [body], options);
		else {
			var newOptions = options.havingStyle(Style$1.SCRIPTSCRIPT);
			var rootm = buildGroup$1(group.index, newOptions, options);
			return makeSpan(["mord", "sqrt"], [makeSpan(["root"], [makeVList({
				positionType: "shift",
				positionData: -(.6 * (body.height - body.depth)),
				children: [{
					type: "elem",
					elem: rootm
				}]
			})]), body], options);
		}
	},
	mathmlBuilder(group, options) {
		var { body, index } = group;
		return index ? new MathNode("mroot", [buildGroup(body, options), buildGroup(index, options)]) : new MathNode("msqrt", [buildGroup(body, options)]);
	}
});
var styleMap = {
	"display": Style$1.DISPLAY,
	"text": Style$1.TEXT,
	"script": Style$1.SCRIPT,
	"scriptscript": Style$1.SCRIPTSCRIPT
};
function isStyleStr(s) {
	return s in styleMap;
}
defineFunction({
	type: "styling",
	names: [
		"\\displaystyle",
		"\\textstyle",
		"\\scriptstyle",
		"\\scriptscriptstyle"
	],
	props: {
		numArgs: 0,
		allowedInText: true,
		primitive: true
	},
	handler(_ref, args) {
		var { breakOnTokenText, funcName, parser } = _ref;
		var body = parser.parseExpression(true, breakOnTokenText);
		var style = funcName.slice(1, funcName.length - 5);
		if (!isStyleStr(style)) throw new Error("Unknown style: " + style);
		return {
			type: "styling",
			mode: parser.mode,
			style,
			body
		};
	},
	htmlBuilder(group, options) {
		var newStyle = styleMap[group.style];
		var newOptions = options.havingStyle(newStyle);
		if (group.resetFont) newOptions = newOptions.withFont("");
		return sizingGroup(group.body, newOptions, options);
	},
	mathmlBuilder(group, options) {
		var newStyle = styleMap[group.style];
		var newOptions = options.havingStyle(newStyle);
		if (group.resetFont) newOptions = newOptions.withFont("");
		var node = new MathNode("mstyle", buildExpression(group.body, newOptions));
		var attr = {
			"display": ["0", "true"],
			"text": ["0", "false"],
			"script": ["1", "false"],
			"scriptscript": ["2", "false"]
		}[group.style];
		node.setAttribute("scriptlevel", attr[0]);
		node.setAttribute("displaystyle", attr[1]);
		return node;
	}
});
/**
* Sometimes, groups perform special rules when they have superscripts or
* subscripts attached to them. This function lets the `supsub` group know that
* Sometimes, groups perform special rules when they have superscripts or
* its inner element should handle the superscripts and subscripts instead of
* handling them itself.
*/
var htmlBuilderDelegate = function htmlBuilderDelegate(group, options) {
	var base = group.base;
	if (!base) return null;
	else if (base.type === "op") return base.limits && (options.style.size === Style$1.DISPLAY.size || base.alwaysHandleSupSub) ? htmlBuilder$2 : null;
	else if (base.type === "operatorname") return base.alwaysHandleSupSub && (options.style.size === Style$1.DISPLAY.size || base.limits) ? htmlBuilder$1 : null;
	else if (base.type === "accent") return isCharacterBox(base.base) ? htmlBuilder$a : null;
	else if (base.type === "horizBrace") return !group.sub === base.isOver ? htmlBuilder$3 : null;
	else return null;
};
defineFunctionBuilders({
	type: "supsub",
	htmlBuilder(group, options) {
		var builderDelegate = htmlBuilderDelegate(group, options);
		if (builderDelegate) return builderDelegate(group, options);
		var { base: valueBase, sup: valueSup, sub: valueSub } = group;
		var base = buildGroup$1(valueBase, options);
		var supm;
		var subm;
		var metrics = options.fontMetrics();
		var supShift = 0;
		var subShift = 0;
		var isCharBox = valueBase && isCharacterBox(valueBase);
		if (valueSup) {
			var newOptions = options.havingStyle(options.style.sup());
			supm = buildGroup$1(valueSup, newOptions, options);
			if (!isCharBox) supShift = base.height - newOptions.fontMetrics().supDrop * newOptions.sizeMultiplier / options.sizeMultiplier;
		}
		if (valueSub) {
			var _newOptions = options.havingStyle(options.style.sub());
			subm = buildGroup$1(valueSub, _newOptions, options);
			if (!isCharBox) subShift = base.depth + _newOptions.fontMetrics().subDrop * _newOptions.sizeMultiplier / options.sizeMultiplier;
		}
		var minSupShift;
		if (options.style === Style$1.DISPLAY) minSupShift = metrics.sup1;
		else if (options.style.cramped) minSupShift = metrics.sup3;
		else minSupShift = metrics.sup2;
		var multiplier = options.sizeMultiplier;
		var marginRight = makeEm(.5 / metrics.ptPerEm / multiplier);
		var marginLeft = null;
		if (subm) {
			var isOiint = group.base && group.base.type === "op" && group.base.name && (group.base.name === "\\oiint" || group.base.name === "\\oiiint");
			if (base instanceof SymbolNode || isOiint) {
				var _base$italic;
				marginLeft = makeEm(-((_base$italic = base.italic) != null ? _base$italic : 0));
			}
		}
		var supsub;
		if (supm && subm) {
			supShift = Math.max(supShift, minSupShift, supm.depth + .25 * metrics.xHeight);
			subShift = Math.max(subShift, metrics.sub2);
			var maxWidth = 4 * metrics.defaultRuleThickness;
			if (supShift - supm.depth - (subm.height - subShift) < maxWidth) {
				subShift = maxWidth - (supShift - supm.depth) + subm.height;
				var psi = .8 * metrics.xHeight - (supShift - supm.depth);
				if (psi > 0) {
					supShift += psi;
					subShift -= psi;
				}
			}
			supsub = makeVList({
				positionType: "individualShift",
				children: [{
					type: "elem",
					elem: subm,
					shift: subShift,
					marginRight,
					marginLeft
				}, {
					type: "elem",
					elem: supm,
					shift: -supShift,
					marginRight
				}]
			});
		} else if (subm) {
			subShift = Math.max(subShift, metrics.sub1, subm.height - .8 * metrics.xHeight);
			supsub = makeVList({
				positionType: "shift",
				positionData: subShift,
				children: [{
					type: "elem",
					elem: subm,
					marginLeft,
					marginRight
				}]
			});
		} else if (supm) {
			supShift = Math.max(supShift, minSupShift, supm.depth + .25 * metrics.xHeight);
			supsub = makeVList({
				positionType: "shift",
				positionData: -supShift,
				children: [{
					type: "elem",
					elem: supm,
					marginRight
				}]
			});
		} else throw new Error("supsub must have either sup or sub.");
		return makeSpan([getTypeOfDomTree(base, "right") || "mord"], [base, makeSpan(["msupsub"], [supsub])], options);
	},
	mathmlBuilder(group, options) {
		var isBrace = false;
		var isOver;
		var isSup;
		if (group.base && group.base.type === "horizBrace") {
			isSup = !!group.sup;
			if (isSup === group.base.isOver) {
				isBrace = true;
				isOver = group.base.isOver;
			}
		}
		if (group.base && (group.base.type === "op" || group.base.type === "operatorname")) group.base.parentIsSupSub = true;
		var children = [buildGroup(group.base, options)];
		if (group.sub) children.push(buildGroup(group.sub, options));
		if (group.sup) children.push(buildGroup(group.sup, options));
		var nodeType;
		if (isBrace) nodeType = isOver ? "mover" : "munder";
		else if (!group.sub) {
			var base = group.base;
			if (base && base.type === "op" && base.limits && (options.style === Style$1.DISPLAY || base.alwaysHandleSupSub)) nodeType = "mover";
			else if (base && base.type === "operatorname" && base.alwaysHandleSupSub && (base.limits || options.style === Style$1.DISPLAY)) nodeType = "mover";
			else nodeType = "msup";
		} else if (!group.sup) {
			var _base = group.base;
			if (_base && _base.type === "op" && _base.limits && (options.style === Style$1.DISPLAY || _base.alwaysHandleSupSub)) nodeType = "munder";
			else if (_base && _base.type === "operatorname" && _base.alwaysHandleSupSub && (_base.limits || options.style === Style$1.DISPLAY)) nodeType = "munder";
			else nodeType = "msub";
		} else {
			var _base2 = group.base;
			if (_base2 && _base2.type === "op" && _base2.limits && options.style === Style$1.DISPLAY) nodeType = "munderover";
			else if (_base2 && _base2.type === "operatorname" && _base2.alwaysHandleSupSub && (options.style === Style$1.DISPLAY || _base2.limits)) nodeType = "munderover";
			else nodeType = "msubsup";
		}
		return new MathNode(nodeType, children);
	}
});
defineFunctionBuilders({
	type: "atom",
	htmlBuilder(group, options) {
		return mathsym(group.text, group.mode, options, ["m" + group.family]);
	},
	mathmlBuilder(group, options) {
		var node = new MathNode("mo", [makeText(group.text, group.mode)]);
		if (group.family === "bin") {
			var variant = getVariant(group, options);
			if (variant === "bold-italic") node.setAttribute("mathvariant", variant);
		} else if (group.family === "punct") node.setAttribute("separator", "true");
		else if (group.family === "open" || group.family === "close") node.setAttribute("stretchy", "false");
		return node;
	}
});
var defaultVariant = {
	"mi": "italic",
	"mn": "normal",
	"mtext": "normal"
};
defineFunctionBuilders({
	type: "mathord",
	htmlBuilder(group, options) {
		return makeOrd(group, options, "mathord");
	},
	mathmlBuilder(group, options) {
		var node = new MathNode("mi", [makeText(group.text, group.mode, options)]);
		var variant = getVariant(group, options) || "italic";
		if (variant !== defaultVariant[node.type]) node.setAttribute("mathvariant", variant);
		return node;
	}
});
defineFunctionBuilders({
	type: "textord",
	htmlBuilder(group, options) {
		return makeOrd(group, options, "textord");
	},
	mathmlBuilder(group, options) {
		var text = makeText(group.text, group.mode, options);
		var variant = getVariant(group, options) || "normal";
		var node;
		if (group.mode === "text") node = new MathNode("mtext", [text]);
		else if (/[0-9]/.test(group.text)) node = new MathNode("mn", [text]);
		else if (group.text === "\\prime") node = new MathNode("mo", [text]);
		else node = new MathNode("mi", [text]);
		if (variant !== defaultVariant[node.type]) node.setAttribute("mathvariant", variant);
		return node;
	}
});
var cssSpace = {
	"\\nobreak": "nobreak",
	"\\allowbreak": "allowbreak"
};
var regularSpace = {
	" ": {},
	"\\ ": {},
	"~": { className: "nobreak" },
	"\\space": {},
	"\\nobreakspace": { className: "nobreak" }
};
defineFunctionBuilders({
	type: "spacing",
	htmlBuilder(group, options) {
		if (regularSpace.hasOwnProperty(group.text)) {
			var className = regularSpace[group.text].className || "";
			if (group.mode === "text") {
				var ord = makeOrd(group, options, "textord");
				ord.classes.push(className);
				return ord;
			} else return makeSpan(["mspace", className], [mathsym(group.text, group.mode, options)], options);
		} else if (cssSpace.hasOwnProperty(group.text)) return makeSpan(["mspace", cssSpace[group.text]], [], options);
		else throw new ParseError("Unknown type of space \"" + group.text + "\"");
	},
	mathmlBuilder(group, options) {
		var node;
		if (regularSpace.hasOwnProperty(group.text)) node = new MathNode("mtext", [new TextNode("\xA0")]);
		else if (cssSpace.hasOwnProperty(group.text)) return new MathNode("mspace");
		else throw new ParseError("Unknown type of space \"" + group.text + "\"");
		return node;
	}
});
var pad = () => {
	var padNode = new MathNode("mtd", []);
	padNode.setAttribute("width", "50%");
	return padNode;
};
defineFunctionBuilders({
	type: "tag",
	mathmlBuilder(group, options) {
		var table = new MathNode("mtable", [new MathNode("mtr", [
			pad(),
			new MathNode("mtd", [buildExpressionRow(group.body, options)]),
			pad(),
			new MathNode("mtd", [buildExpressionRow(group.tag, options)])
		])]);
		table.setAttribute("width", "100%");
		return table;
	}
});
var textFontFamilies = {
	"\\text": void 0,
	"\\textrm": "textrm",
	"\\textsf": "textsf",
	"\\texttt": "texttt",
	"\\textnormal": "textrm"
};
var textFontWeights = {
	"\\textbf": "textbf",
	"\\textmd": "textmd"
};
var textFontShapes = {
	"\\textit": "textit",
	"\\textup": "textup"
};
var optionsWithFont = (group, options) => {
	var font = group.font;
	if (!font) return options;
	else if (textFontFamilies[font]) return options.withTextFontFamily(textFontFamilies[font]);
	else if (textFontWeights[font]) return options.withTextFontWeight(textFontWeights[font]);
	else if (font === "\\emph") return options.fontShape === "textit" ? options.withTextFontShape("textup") : options.withTextFontShape("textit");
	return options.withTextFontShape(textFontShapes[font]);
};
defineFunction({
	type: "text",
	names: [
		"\\text",
		"\\textrm",
		"\\textsf",
		"\\texttt",
		"\\textnormal",
		"\\textbf",
		"\\textmd",
		"\\textit",
		"\\textup",
		"\\emph"
	],
	props: {
		numArgs: 1,
		argTypes: ["text"],
		allowedInArgument: true,
		allowedInText: true
	},
	handler(_ref, args) {
		var { parser, funcName } = _ref;
		var body = args[0];
		return {
			type: "text",
			mode: parser.mode,
			body: ordargument(body),
			font: funcName
		};
	},
	htmlBuilder(group, options) {
		var newOptions = optionsWithFont(group, options);
		return makeSpan(["mord", "text"], buildExpression$1(group.body, newOptions, true), newOptions);
	},
	mathmlBuilder(group, options) {
		var newOptions = optionsWithFont(group, options);
		return buildExpressionRow(group.body, newOptions);
	}
});
defineFunction({
	type: "underline",
	names: ["\\underline"],
	props: {
		numArgs: 1,
		allowedInText: true
	},
	handler(_ref, args) {
		var { parser } = _ref;
		return {
			type: "underline",
			mode: parser.mode,
			body: args[0]
		};
	},
	htmlBuilder(group, options) {
		var innerGroup = buildGroup$1(group.body, options);
		var line = makeLineSpan("underline-line", options);
		var defaultRuleThickness = options.fontMetrics().defaultRuleThickness;
		return makeSpan(["mord", "underline"], [makeVList({
			positionType: "top",
			positionData: innerGroup.height,
			children: [
				{
					type: "kern",
					size: defaultRuleThickness
				},
				{
					type: "elem",
					elem: line
				},
				{
					type: "kern",
					size: 3 * defaultRuleThickness
				},
				{
					type: "elem",
					elem: innerGroup
				}
			]
		})], options);
	},
	mathmlBuilder(group, options) {
		var operator = new MathNode("mo", [new TextNode("‾")]);
		operator.setAttribute("stretchy", "true");
		var node = new MathNode("munder", [buildGroup(group.body, options), operator]);
		node.setAttribute("accentunder", "true");
		return node;
	}
});
defineFunction({
	type: "vcenter",
	names: ["\\vcenter"],
	props: {
		numArgs: 1,
		argTypes: ["original"],
		allowedInText: false
	},
	handler(_ref, args) {
		var { parser } = _ref;
		return {
			type: "vcenter",
			mode: parser.mode,
			body: args[0]
		};
	},
	htmlBuilder(group, options) {
		var body = buildGroup$1(group.body, options);
		var axisHeight = options.fontMetrics().axisHeight;
		return makeVList({
			positionType: "shift",
			positionData: .5 * (body.height - axisHeight - (body.depth + axisHeight)),
			children: [{
				type: "elem",
				elem: body
			}]
		});
	},
	mathmlBuilder(group, options) {
		return new MathNode("mrow", [new MathNode("mpadded", [buildGroup(group.body, options)], ["vcenter"])]);
	}
});
defineFunction({
	type: "verb",
	names: ["\\verb"],
	props: {
		numArgs: 0,
		allowedInText: true
	},
	handler(context, args, optArgs) {
		throw new ParseError("\\verb ended by end of line instead of matching delimiter");
	},
	htmlBuilder(group, options) {
		var text = makeVerb(group);
		var body = [];
		var newOptions = options.havingStyle(options.style.text());
		for (var i = 0; i < text.length; i++) {
			var c = text[i];
			if (c === "~") c = "\\textasciitilde";
			body.push(makeSymbol(c, "Typewriter-Regular", group.mode, newOptions, ["mord", "texttt"]));
		}
		return makeSpan(["mord", "text"].concat(newOptions.sizingClasses(options)), tryCombineChars(body), newOptions);
	},
	mathmlBuilder(group, options) {
		var node = new MathNode("mtext", [new TextNode(makeVerb(group))]);
		node.setAttribute("mathvariant", "monospace");
		return node;
	}
});
/**
* Converts verb group into body string.
*
* \verb* replaces each space with an open box \u2423
* \verb replaces each space with a no-break space \xA0
*/
var makeVerb = (group) => group.body.replace(/ /g, group.star ? "␣" : "\xA0");
/** Include this to ensure that all functions are defined. */
var functions = _functions;
/**
* The Lexer class handles tokenizing the input in various ways. Since our
* parser expects us to be able to backtrack, the lexer allows lexing from any
* given starting point.
*
* Its main exposed function is the `lex` function, which takes a position to
* lex from and a type of token to lex. It defers to the appropriate `_innerLex`
* function.
*
* The various `_innerLex` functions perform the actual lexing of different
* kinds.
*/
var spaceRegexString = "[ \r\n	]";
var controlWordRegexString = "\\\\[a-zA-Z@]+";
var controlSymbolRegexString = "\\\\[^\ud800-\udfff]";
var controlWordWhitespaceRegexString = "(" + controlWordRegexString + ")" + spaceRegexString + "*";
var controlSpaceRegexString = "\\\\(\n|[ \r	]+\n?)[ \r	]*";
var combiningDiacriticalMarkString = "[̀-ͯ]";
var combiningDiacriticalMarksEndRegex = new RegExp(combiningDiacriticalMarkString + "+$");
var tokenRegexString = "(" + spaceRegexString + "+)|" + (controlSpaceRegexString + "|") + "([!-\\[\\]-‧‪-퟿豈-￿]" + (combiningDiacriticalMarkString + "*") + "|[\ud800-\udbff][\udc00-\udfff]" + (combiningDiacriticalMarkString + "*") + "|\\\\verb\\*([^]).*?\\4|\\\\verb([^*a-zA-Z]).*?\\5" + ("|" + controlWordWhitespaceRegexString) + ("|" + controlSymbolRegexString + ")");
/** Main Lexer class */
var Lexer = class {
	constructor(input, settings) {
		this.input = void 0;
		this.settings = void 0;
		this.tokenRegex = void 0;
		this.catcodes = void 0;
		this.input = input;
		this.settings = settings;
		this.tokenRegex = new RegExp(tokenRegexString, "g");
		this.catcodes = {
			"%": 14,
			"~": 13
		};
	}
	setCatcode(char, code) {
		this.catcodes[char] = code;
	}
	/**
	* This function lexes a single token.
	*/
	lex() {
		var input = this.input;
		var pos = this.tokenRegex.lastIndex;
		if (pos === input.length) return new Token("EOF", new SourceLocation(this, pos, pos));
		var match = this.tokenRegex.exec(input);
		if (match === null || match.index !== pos) throw new ParseError("Unexpected character: '" + input[pos] + "'", new Token(input[pos], new SourceLocation(this, pos, pos + 1)));
		var text = match[6] || match[3] || (match[2] ? "\\ " : " ");
		if (this.catcodes[text] === 14) {
			var nlIndex = input.indexOf("\n", this.tokenRegex.lastIndex);
			if (nlIndex === -1) {
				this.tokenRegex.lastIndex = input.length;
				this.settings.reportNonstrict("commentAtEnd", "% comment has no terminating newline; LaTeX would fail because of commenting the end of math mode (e.g. $)");
			} else this.tokenRegex.lastIndex = nlIndex + 1;
			return this.lex();
		}
		return new Token(text, new SourceLocation(this, pos, this.tokenRegex.lastIndex));
	}
};
/**
* A `Namespace` refers to a space of nameable things like macros or lengths,
* which can be `set` either globally or local to a nested group, using an
* undo stack similar to how TeX implements this functionality.
* Performance-wise, `get` and local `set` take constant time, while global
* `set` takes time proportional to the depth of group nesting.
*/
var Namespace = class {
	/**
	* Both arguments are optional.  The first argument is an object of
	* built-in mappings which never change.  The second argument is an object
	* of initial (global-level) mappings, which will constantly change
	* according to any global/top-level `set`s done.
	*/
	constructor(builtins, globalMacros) {
		if (builtins === void 0) builtins = {};
		if (globalMacros === void 0) globalMacros = {};
		this.current = void 0;
		this.builtins = void 0;
		this.undefStack = void 0;
		this.current = globalMacros;
		this.builtins = builtins;
		this.undefStack = [];
	}
	/**
	* Start a new nested group, affecting future local `set`s.
	*/
	beginGroup() {
		this.undefStack.push({});
	}
	/**
	* End current nested group, restoring values before the group began.
	*/
	endGroup() {
		if (this.undefStack.length === 0) throw new ParseError("Unbalanced namespace destruction: attempt to pop global namespace; please report this as a bug");
		var undefs = this.undefStack.pop();
		for (var undef in undefs) if (undefs.hasOwnProperty(undef)) if (undefs[undef] == null) delete this.current[undef];
		else this.current[undef] = undefs[undef];
	}
	/**
	* Ends all currently nested groups (if any), restoring values before the
	* groups began.  Useful in case of an error in the middle of parsing.
	*/
	endGroups() {
		while (this.undefStack.length > 0) this.endGroup();
	}
	/**
	* Detect whether `name` has a definition.  Equivalent to
	* `get(name) != null`.
	*/
	has(name) {
		return this.current.hasOwnProperty(name) || this.builtins.hasOwnProperty(name);
	}
	/**
	* Get the current value of a name, or `undefined` if there is no value.
	*
	* Note: Do not use `if (namespace.get(...))` to detect whether a macro
	* is defined, as the definition may be the empty string which evaluates
	* to `false` in JavaScript.  Use `if (namespace.get(...) != null)` or
	* `if (namespace.has(...))`.
	*/
	get(name) {
		if (this.current.hasOwnProperty(name)) return this.current[name];
		else return this.builtins[name];
	}
	/**
	* Set the current value of a name, and optionally set it globally too.
	* Local set() sets the current value and (when appropriate) adds an undo
	* operation to the undo stack.  Global set() may change the undo
	* operation at every level, so takes time linear in their number.
	* A value of undefined means to delete existing definitions.
	*/
	set(name, value, global) {
		if (global === void 0) global = false;
		if (global) {
			for (var i = 0; i < this.undefStack.length; i++) delete this.undefStack[i][name];
			if (this.undefStack.length > 0) this.undefStack[this.undefStack.length - 1][name] = value;
		} else {
			var top = this.undefStack[this.undefStack.length - 1];
			if (top && !top.hasOwnProperty(name)) top[name] = this.current[name];
		}
		if (value == null) delete this.current[name];
		else this.current[name] = value;
	}
};
/**
* Predefined macros for KaTeX.
* This can be used to define some commands in terms of others.
*/
var macros = _macros;
defineMacro("\\noexpand", function(context) {
	var t = context.popToken();
	if (context.isExpandable(t.text)) {
		t.noexpand = true;
		t.treatAsRelax = true;
	}
	return {
		tokens: [t],
		numArgs: 0
	};
});
defineMacro("\\expandafter", function(context) {
	var t = context.popToken();
	context.expandOnce(true);
	return {
		tokens: [t],
		numArgs: 0
	};
});
defineMacro("\\@firstoftwo", function(context) {
	return {
		tokens: context.consumeArgs(2)[0],
		numArgs: 0
	};
});
defineMacro("\\@secondoftwo", function(context) {
	return {
		tokens: context.consumeArgs(2)[1],
		numArgs: 0
	};
});
defineMacro("\\@ifnextchar", function(context) {
	var args = context.consumeArgs(3);
	context.consumeSpaces();
	var nextToken = context.future();
	if (args[0].length === 1 && args[0][0].text === nextToken.text) return {
		tokens: args[1],
		numArgs: 0
	};
	else return {
		tokens: args[2],
		numArgs: 0
	};
});
defineMacro("\\@ifstar", "\\@ifnextchar *{\\@firstoftwo{#1}}");
defineMacro("\\TextOrMath", function(context) {
	var args = context.consumeArgs(2);
	if (context.mode === "text") return {
		tokens: args[0],
		numArgs: 0
	};
	else return {
		tokens: args[1],
		numArgs: 0
	};
});
var digitToNumber = {
	"0": 0,
	"1": 1,
	"2": 2,
	"3": 3,
	"4": 4,
	"5": 5,
	"6": 6,
	"7": 7,
	"8": 8,
	"9": 9,
	"a": 10,
	"A": 10,
	"b": 11,
	"B": 11,
	"c": 12,
	"C": 12,
	"d": 13,
	"D": 13,
	"e": 14,
	"E": 14,
	"f": 15,
	"F": 15
};
defineMacro("\\char", function(context) {
	var token = context.popToken();
	var base;
	var number = 0;
	if (token.text === "'") {
		base = 8;
		token = context.popToken();
	} else if (token.text === "\"") {
		base = 16;
		token = context.popToken();
	} else if (token.text === "`") {
		token = context.popToken();
		if (token.text[0] === "\\") number = token.text.charCodeAt(1);
		else if (token.text === "EOF") throw new ParseError("\\char` missing argument");
		else number = token.text.charCodeAt(0);
	} else base = 10;
	if (base) {
		number = digitToNumber[token.text];
		if (number == null || number >= base) throw new ParseError("Invalid base-" + base + " digit " + token.text);
		var digit;
		while ((digit = digitToNumber[context.future().text]) != null && digit < base) {
			number *= base;
			number += digit;
			context.popToken();
		}
	}
	return "\\@char{" + number + "}";
});
var newcommand = (context, existsOK, nonexistsOK, skipIfExists) => {
	var arg = context.consumeArg().tokens;
	if (arg.length !== 1) throw new ParseError("\\newcommand's first argument must be a macro name");
	var name = arg[0].text;
	var exists = context.isDefined(name);
	if (exists && !existsOK) throw new ParseError("\\newcommand{" + name + "} attempting to redefine " + (name + "; use \\renewcommand"));
	if (!exists && !nonexistsOK) throw new ParseError("\\renewcommand{" + name + "} when command " + name + " does not yet exist; use \\newcommand");
	var numArgs = 0;
	arg = context.consumeArg().tokens;
	if (arg.length === 1 && arg[0].text === "[") {
		var argText = "";
		var token = context.expandNextToken();
		while (token.text !== "]" && token.text !== "EOF") {
			argText += token.text;
			token = context.expandNextToken();
		}
		if (!argText.match(/^\s*[0-9]+\s*$/)) throw new ParseError("Invalid number of arguments: " + argText);
		numArgs = parseInt(argText);
		arg = context.consumeArg().tokens;
	}
	if (!(exists && skipIfExists)) context.macros.set(name, {
		tokens: arg,
		numArgs
	});
	return "";
};
defineMacro("\\newcommand", (context) => newcommand(context, false, true, false));
defineMacro("\\renewcommand", (context) => newcommand(context, true, false, false));
defineMacro("\\providecommand", (context) => newcommand(context, true, true, true));
defineMacro("\\message", (context) => {
	var arg = context.consumeArgs(1)[0];
	console.log(arg.reverse().map((token) => token.text).join(""));
	return "";
});
defineMacro("\\errmessage", (context) => {
	var arg = context.consumeArgs(1)[0];
	console.error(arg.reverse().map((token) => token.text).join(""));
	return "";
});
defineMacro("\\show", (context) => {
	var tok = context.popToken();
	var name = tok.text;
	console.log(tok, context.macros.get(name), functions[name], symbols.math[name], symbols.text[name]);
	return "";
});
defineMacro("\\bgroup", "{");
defineMacro("\\egroup", "}");
defineMacro("~", "\\nobreakspace");
defineMacro("\\lq", "`");
defineMacro("\\rq", "'");
defineMacro("\\aa", "\\r a");
defineMacro("\\AA", "\\r A");
defineMacro("\\textcopyright", "\\html@mathml{\\textcircled{c}}{\\char`©}");
defineMacro("\\copyright", "\\TextOrMath{\\textcopyright}{\\text{\\textcopyright}}");
defineMacro("\\textregistered", "\\html@mathml{\\textcircled{\\scriptsize R}}{\\char`®}");
defineMacro("ℬ", "\\mathscr{B}");
defineMacro("ℰ", "\\mathscr{E}");
defineMacro("ℱ", "\\mathscr{F}");
defineMacro("ℋ", "\\mathscr{H}");
defineMacro("ℐ", "\\mathscr{I}");
defineMacro("ℒ", "\\mathscr{L}");
defineMacro("ℳ", "\\mathscr{M}");
defineMacro("ℛ", "\\mathscr{R}");
defineMacro("ℭ", "\\mathfrak{C}");
defineMacro("ℌ", "\\mathfrak{H}");
defineMacro("ℨ", "\\mathfrak{Z}");
defineMacro("\\Bbbk", "\\Bbb{k}");
defineMacro("\\llap", "\\mathllap{\\textrm{#1}}");
defineMacro("\\rlap", "\\mathrlap{\\textrm{#1}}");
defineMacro("\\clap", "\\mathclap{\\textrm{#1}}");
defineMacro("\\mathstrut", "\\vphantom{(}");
defineMacro("\\underbar", "\\underline{\\text{#1}}");
defineMacro("\\not", "\\html@mathml{\\mathrel{\\mathrlap\\@not}\\nobreak}{\\char\"338}");
defineMacro("\\neq", "\\html@mathml{\\mathrel{\\not=}}{\\mathrel{\\char`≠}}");
defineMacro("\\ne", "\\neq");
defineMacro("≠", "\\neq");
defineMacro("\\notin", "\\html@mathml{\\mathrel{{\\in}\\mathllap{/\\mskip1mu}}}{\\mathrel{\\char`∉}}");
defineMacro("∉", "\\notin");
defineMacro("≘", "\\html@mathml{\\mathrel{=\\kern{-1em}\\raisebox{0.4em}{$\\scriptsize\\frown$}}}{\\mathrel{\\char`≘}}");
defineMacro("≙", "\\html@mathml{\\stackrel{\\tiny\\wedge}{=}}{\\mathrel{\\char`≘}}");
defineMacro("≚", "\\html@mathml{\\stackrel{\\tiny\\vee}{=}}{\\mathrel{\\char`≚}}");
defineMacro("≛", "\\html@mathml{\\stackrel{\\scriptsize\\star}{=}}{\\mathrel{\\char`≛}}");
defineMacro("≝", "\\html@mathml{\\stackrel{\\tiny\\mathrm{def}}{=}}{\\mathrel{\\char`≝}}");
defineMacro("≞", "\\html@mathml{\\stackrel{\\tiny\\mathrm{m}}{=}}{\\mathrel{\\char`≞}}");
defineMacro("≟", "\\html@mathml{\\stackrel{\\tiny?}{=}}{\\mathrel{\\char`≟}}");
defineMacro("⟂", "\\perp");
defineMacro("‼", "\\mathclose{!\\mkern-0.8mu!}");
defineMacro("∌", "\\notni");
defineMacro("⌜", "\\ulcorner");
defineMacro("⌝", "\\urcorner");
defineMacro("⌞", "\\llcorner");
defineMacro("⌟", "\\lrcorner");
defineMacro("©", "\\copyright");
defineMacro("®", "\\textregistered");
defineMacro("\\ulcorner", "\\html@mathml{\\@ulcorner}{\\mathop{\\char\"231c}}");
defineMacro("\\urcorner", "\\html@mathml{\\@urcorner}{\\mathop{\\char\"231d}}");
defineMacro("\\llcorner", "\\html@mathml{\\@llcorner}{\\mathop{\\char\"231e}}");
defineMacro("\\lrcorner", "\\html@mathml{\\@lrcorner}{\\mathop{\\char\"231f}}");
defineMacro("\\vdots", "{\\varvdots\\rule{0pt}{15pt}}");
defineMacro("⋮", "\\vdots");
defineMacro("\\varGamma", "\\mathit{\\Gamma}");
defineMacro("\\varDelta", "\\mathit{\\Delta}");
defineMacro("\\varTheta", "\\mathit{\\Theta}");
defineMacro("\\varLambda", "\\mathit{\\Lambda}");
defineMacro("\\varXi", "\\mathit{\\Xi}");
defineMacro("\\varPi", "\\mathit{\\Pi}");
defineMacro("\\varSigma", "\\mathit{\\Sigma}");
defineMacro("\\varUpsilon", "\\mathit{\\Upsilon}");
defineMacro("\\varPhi", "\\mathit{\\Phi}");
defineMacro("\\varPsi", "\\mathit{\\Psi}");
defineMacro("\\varOmega", "\\mathit{\\Omega}");
defineMacro("\\substack", "\\begin{subarray}{c}#1\\end{subarray}");
defineMacro("\\colon", "\\nobreak\\mskip2mu\\mathpunct{}\\mathchoice{\\mkern-3mu}{\\mkern-3mu}{}{}{:}\\mskip6mu\\relax");
defineMacro("\\boxed", "\\fbox{$\\displaystyle{#1}$}");
defineMacro("\\iff", "\\DOTSB\\;\\Longleftrightarrow\\;");
defineMacro("\\implies", "\\DOTSB\\;\\Longrightarrow\\;");
defineMacro("\\impliedby", "\\DOTSB\\;\\Longleftarrow\\;");
defineMacro("\\dddot", "{\\overset{\\raisebox{-0.1ex}{\\normalsize ...}}{#1}}");
defineMacro("\\ddddot", "{\\overset{\\raisebox{-0.1ex}{\\normalsize ....}}{#1}}");
var dotsByToken = {
	",": "\\dotsc",
	"\\not": "\\dotsb",
	"+": "\\dotsb",
	"=": "\\dotsb",
	"<": "\\dotsb",
	">": "\\dotsb",
	"-": "\\dotsb",
	"*": "\\dotsb",
	":": "\\dotsb",
	"\\DOTSB": "\\dotsb",
	"\\coprod": "\\dotsb",
	"\\bigvee": "\\dotsb",
	"\\bigwedge": "\\dotsb",
	"\\biguplus": "\\dotsb",
	"\\bigcap": "\\dotsb",
	"\\bigcup": "\\dotsb",
	"\\prod": "\\dotsb",
	"\\sum": "\\dotsb",
	"\\bigotimes": "\\dotsb",
	"\\bigoplus": "\\dotsb",
	"\\bigodot": "\\dotsb",
	"\\bigsqcup": "\\dotsb",
	"\\And": "\\dotsb",
	"\\longrightarrow": "\\dotsb",
	"\\Longrightarrow": "\\dotsb",
	"\\longleftarrow": "\\dotsb",
	"\\Longleftarrow": "\\dotsb",
	"\\longleftrightarrow": "\\dotsb",
	"\\Longleftrightarrow": "\\dotsb",
	"\\mapsto": "\\dotsb",
	"\\longmapsto": "\\dotsb",
	"\\hookrightarrow": "\\dotsb",
	"\\doteq": "\\dotsb",
	"\\mathbin": "\\dotsb",
	"\\mathrel": "\\dotsb",
	"\\relbar": "\\dotsb",
	"\\Relbar": "\\dotsb",
	"\\xrightarrow": "\\dotsb",
	"\\xleftarrow": "\\dotsb",
	"\\DOTSI": "\\dotsi",
	"\\int": "\\dotsi",
	"\\oint": "\\dotsi",
	"\\iint": "\\dotsi",
	"\\iiint": "\\dotsi",
	"\\iiiint": "\\dotsi",
	"\\idotsint": "\\dotsi",
	"\\DOTSX": "\\dotsx"
};
var dotsbGroups = /* @__PURE__ */ new Set(["bin", "rel"]);
defineMacro("\\dots", function(context) {
	var thedots = "\\dotso";
	var next = context.expandAfterFuture().text;
	if (next in dotsByToken) thedots = dotsByToken[next];
	else if (next.slice(0, 4) === "\\not") thedots = "\\dotsb";
	else if (next in symbols.math) {
		if (dotsbGroups.has(symbols.math[next].group)) thedots = "\\dotsb";
	}
	return thedots;
});
var spaceAfterDots = {
	")": true,
	"]": true,
	"\\rbrack": true,
	"\\}": true,
	"\\rbrace": true,
	"\\rangle": true,
	"\\rceil": true,
	"\\rfloor": true,
	"\\rgroup": true,
	"\\rmoustache": true,
	"\\right": true,
	"\\bigr": true,
	"\\biggr": true,
	"\\Bigr": true,
	"\\Biggr": true,
	"$": true,
	";": true,
	".": true,
	",": true
};
defineMacro("\\dotso", function(context) {
	if (context.future().text in spaceAfterDots) return "\\ldots\\,";
	else return "\\ldots";
});
defineMacro("\\dotsc", function(context) {
	var next = context.future().text;
	if (next in spaceAfterDots && next !== ",") return "\\ldots\\,";
	else return "\\ldots";
});
defineMacro("\\cdots", function(context) {
	if (context.future().text in spaceAfterDots) return "\\@cdots\\,";
	else return "\\@cdots";
});
defineMacro("\\dotsb", "\\cdots");
defineMacro("\\dotsm", "\\cdots");
defineMacro("\\dotsi", "\\!\\cdots");
defineMacro("\\dotsx", "\\ldots\\,");
defineMacro("\\DOTSI", "\\relax");
defineMacro("\\DOTSB", "\\relax");
defineMacro("\\DOTSX", "\\relax");
defineMacro("\\tmspace", "\\TextOrMath{\\kern#1#3}{\\mskip#1#2}\\relax");
defineMacro("\\,", "\\tmspace+{3mu}{.1667em}");
defineMacro("\\thinspace", "\\,");
defineMacro("\\>", "\\mskip{4mu}");
defineMacro("\\:", "\\tmspace+{4mu}{.2222em}");
defineMacro("\\medspace", "\\:");
defineMacro("\\;", "\\tmspace+{5mu}{.2777em}");
defineMacro("\\thickspace", "\\;");
defineMacro("\\!", "\\tmspace-{3mu}{.1667em}");
defineMacro("\\negthinspace", "\\!");
defineMacro("\\negmedspace", "\\tmspace-{4mu}{.2222em}");
defineMacro("\\negthickspace", "\\tmspace-{5mu}{.277em}");
defineMacro("\\enspace", "\\kern.5em ");
defineMacro("\\enskip", "\\hskip.5em\\relax");
defineMacro("\\quad", "\\hskip1em\\relax");
defineMacro("\\qquad", "\\hskip2em\\relax");
defineMacro("\\tag", "\\@ifstar\\tag@literal\\tag@paren");
defineMacro("\\tag@paren", "\\tag@literal{({#1})}");
defineMacro("\\tag@literal", (context) => {
	if (context.macros.get("\\df@tag")) throw new ParseError("Multiple \\tag");
	return "\\gdef\\df@tag{\\text{#1}}";
});
defineMacro("\\bmod", "\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}\\mathbin{\\rm mod}\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}");
defineMacro("\\pod", "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern8mu}{\\mkern8mu}{\\mkern8mu}(#1)");
defineMacro("\\pmod", "\\pod{{\\rm mod}\\mkern6mu#1}");
defineMacro("\\mod", "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern12mu}{\\mkern12mu}{\\mkern12mu}{\\rm mod}\\,\\,#1");
defineMacro("\\newline", "\\\\\\relax");
defineMacro("\\TeX", "\\textrm{\\html@mathml{T\\kern-.1667em\\raisebox{-.5ex}{E}\\kern-.125emX}{TeX}}");
var latexRaiseA = makeEm(fontMetricsData["Main-Regular"]["T".charCodeAt(0)][1] - .7 * fontMetricsData["Main-Regular"]["A".charCodeAt(0)][1]);
defineMacro("\\LaTeX", "\\textrm{\\html@mathml{" + ("L\\kern-.36em\\raisebox{" + latexRaiseA + "}{\\scriptstyle A}") + "\\kern-.15em\\TeX}{LaTeX}}");
defineMacro("\\KaTeX", "\\textrm{\\html@mathml{" + ("K\\kern-.17em\\raisebox{" + latexRaiseA + "}{\\scriptstyle A}") + "\\kern-.15em\\TeX}{KaTeX}}");
defineMacro("\\hspace", "\\@ifstar\\@hspacer\\@hspace");
defineMacro("\\@hspace", "\\hskip #1\\relax");
defineMacro("\\@hspacer", "\\rule{0pt}{0pt}\\hskip #1\\relax");
defineMacro("\\ordinarycolon", ":");
defineMacro("\\vcentcolon", "\\mathrel{\\mathop\\ordinarycolon}");
defineMacro("\\dblcolon", "\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-.9mu}\\vcentcolon}}{\\mathop{\\char\"2237}}");
defineMacro("\\coloneqq", "\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char\"2254}}");
defineMacro("\\Coloneqq", "\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char\"2237\\char\"3d}}");
defineMacro("\\coloneq", "\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char\"3a\\char\"2212}}");
defineMacro("\\Coloneq", "\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char\"2237\\char\"2212}}");
defineMacro("\\eqqcolon", "\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char\"2255}}");
defineMacro("\\Eqqcolon", "\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char\"3d\\char\"2237}}");
defineMacro("\\eqcolon", "\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char\"2239}}");
defineMacro("\\Eqcolon", "\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char\"2212\\char\"2237}}");
defineMacro("\\colonapprox", "\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char\"3a\\char\"2248}}");
defineMacro("\\Colonapprox", "\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char\"2237\\char\"2248}}");
defineMacro("\\colonsim", "\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char\"3a\\char\"223c}}");
defineMacro("\\Colonsim", "\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char\"2237\\char\"223c}}");
defineMacro("∷", "\\dblcolon");
defineMacro("∹", "\\eqcolon");
defineMacro("≔", "\\coloneqq");
defineMacro("≕", "\\eqqcolon");
defineMacro("⩴", "\\Coloneqq");
defineMacro("\\ratio", "\\vcentcolon");
defineMacro("\\coloncolon", "\\dblcolon");
defineMacro("\\colonequals", "\\coloneqq");
defineMacro("\\coloncolonequals", "\\Coloneqq");
defineMacro("\\equalscolon", "\\eqqcolon");
defineMacro("\\equalscoloncolon", "\\Eqqcolon");
defineMacro("\\colonminus", "\\coloneq");
defineMacro("\\coloncolonminus", "\\Coloneq");
defineMacro("\\minuscolon", "\\eqcolon");
defineMacro("\\minuscoloncolon", "\\Eqcolon");
defineMacro("\\coloncolonapprox", "\\Colonapprox");
defineMacro("\\coloncolonsim", "\\Colonsim");
defineMacro("\\simcolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\vcentcolon}");
defineMacro("\\simcoloncolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\dblcolon}");
defineMacro("\\approxcolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\vcentcolon}");
defineMacro("\\approxcoloncolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\dblcolon}");
defineMacro("\\notni", "\\html@mathml{\\not\\ni}{\\mathrel{\\char`∌}}");
defineMacro("\\limsup", "\\DOTSB\\operatorname*{lim\\,sup}");
defineMacro("\\liminf", "\\DOTSB\\operatorname*{lim\\,inf}");
defineMacro("\\injlim", "\\DOTSB\\operatorname*{inj\\,lim}");
defineMacro("\\projlim", "\\DOTSB\\operatorname*{proj\\,lim}");
defineMacro("\\varlimsup", "\\DOTSB\\operatorname*{\\overline{lim}}");
defineMacro("\\varliminf", "\\DOTSB\\operatorname*{\\underline{lim}}");
defineMacro("\\varinjlim", "\\DOTSB\\operatorname*{\\underrightarrow{lim}}");
defineMacro("\\varprojlim", "\\DOTSB\\operatorname*{\\underleftarrow{lim}}");
defineMacro("\\gvertneqq", "\\html@mathml{\\@gvertneqq}{≩}");
defineMacro("\\lvertneqq", "\\html@mathml{\\@lvertneqq}{≨}");
defineMacro("\\ngeqq", "\\html@mathml{\\@ngeqq}{≱}");
defineMacro("\\ngeqslant", "\\html@mathml{\\@ngeqslant}{≱}");
defineMacro("\\nleqq", "\\html@mathml{\\@nleqq}{≰}");
defineMacro("\\nleqslant", "\\html@mathml{\\@nleqslant}{≰}");
defineMacro("\\nshortmid", "\\html@mathml{\\@nshortmid}{∤}");
defineMacro("\\nshortparallel", "\\html@mathml{\\@nshortparallel}{∦}");
defineMacro("\\nsubseteqq", "\\html@mathml{\\@nsubseteqq}{⊈}");
defineMacro("\\nsupseteqq", "\\html@mathml{\\@nsupseteqq}{⊉}");
defineMacro("\\varsubsetneq", "\\html@mathml{\\@varsubsetneq}{⊊}");
defineMacro("\\varsubsetneqq", "\\html@mathml{\\@varsubsetneqq}{⫋}");
defineMacro("\\varsupsetneq", "\\html@mathml{\\@varsupsetneq}{⊋}");
defineMacro("\\varsupsetneqq", "\\html@mathml{\\@varsupsetneqq}{⫌}");
defineMacro("\\imath", "\\html@mathml{\\@imath}{ı}");
defineMacro("\\jmath", "\\html@mathml{\\@jmath}{ȷ}");
defineMacro("\\llbracket", "\\html@mathml{\\mathopen{[\\mkern-3.2mu[}}{\\mathopen{\\char`⟦}}");
defineMacro("\\rrbracket", "\\html@mathml{\\mathclose{]\\mkern-3.2mu]}}{\\mathclose{\\char`⟧}}");
defineMacro("⟦", "\\llbracket");
defineMacro("⟧", "\\rrbracket");
defineMacro("\\lBrace", "\\html@mathml{\\mathopen{\\{\\mkern-3.2mu[}}{\\mathopen{\\char`⦃}}");
defineMacro("\\rBrace", "\\html@mathml{\\mathclose{]\\mkern-3.2mu\\}}}{\\mathclose{\\char`⦄}}");
defineMacro("⦃", "\\lBrace");
defineMacro("⦄", "\\rBrace");
defineMacro("\\minuso", "\\mathbin{\\html@mathml{{\\mathrlap{\\mathchoice{\\kern{0.145em}}{\\kern{0.145em}}{\\kern{0.1015em}}{\\kern{0.0725em}}\\circ}{-}}}{\\char`⦵}}");
defineMacro("⦵", "\\minuso");
defineMacro("\\darr", "\\downarrow");
defineMacro("\\dArr", "\\Downarrow");
defineMacro("\\Darr", "\\Downarrow");
defineMacro("\\lang", "\\langle");
defineMacro("\\rang", "\\rangle");
defineMacro("\\uarr", "\\uparrow");
defineMacro("\\uArr", "\\Uparrow");
defineMacro("\\Uarr", "\\Uparrow");
defineMacro("\\N", "\\mathbb{N}");
defineMacro("\\R", "\\mathbb{R}");
defineMacro("\\Z", "\\mathbb{Z}");
defineMacro("\\alef", "\\aleph");
defineMacro("\\alefsym", "\\aleph");
defineMacro("\\Alpha", "\\mathrm{A}");
defineMacro("\\Beta", "\\mathrm{B}");
defineMacro("\\bull", "\\bullet");
defineMacro("\\Chi", "\\mathrm{X}");
defineMacro("\\clubs", "\\clubsuit");
defineMacro("\\cnums", "\\mathbb{C}");
defineMacro("\\Complex", "\\mathbb{C}");
defineMacro("\\Dagger", "\\ddagger");
defineMacro("\\diamonds", "\\diamondsuit");
defineMacro("\\empty", "\\emptyset");
defineMacro("\\Epsilon", "\\mathrm{E}");
defineMacro("\\Eta", "\\mathrm{H}");
defineMacro("\\exist", "\\exists");
defineMacro("\\harr", "\\leftrightarrow");
defineMacro("\\hArr", "\\Leftrightarrow");
defineMacro("\\Harr", "\\Leftrightarrow");
defineMacro("\\hearts", "\\heartsuit");
defineMacro("\\image", "\\Im");
defineMacro("\\infin", "\\infty");
defineMacro("\\Iota", "\\mathrm{I}");
defineMacro("\\isin", "\\in");
defineMacro("\\Kappa", "\\mathrm{K}");
defineMacro("\\larr", "\\leftarrow");
defineMacro("\\lArr", "\\Leftarrow");
defineMacro("\\Larr", "\\Leftarrow");
defineMacro("\\lrarr", "\\leftrightarrow");
defineMacro("\\lrArr", "\\Leftrightarrow");
defineMacro("\\Lrarr", "\\Leftrightarrow");
defineMacro("\\Mu", "\\mathrm{M}");
defineMacro("\\natnums", "\\mathbb{N}");
defineMacro("\\Nu", "\\mathrm{N}");
defineMacro("\\Omicron", "\\mathrm{O}");
defineMacro("\\plusmn", "\\pm");
defineMacro("\\rarr", "\\rightarrow");
defineMacro("\\rArr", "\\Rightarrow");
defineMacro("\\Rarr", "\\Rightarrow");
defineMacro("\\real", "\\Re");
defineMacro("\\reals", "\\mathbb{R}");
defineMacro("\\Reals", "\\mathbb{R}");
defineMacro("\\Rho", "\\mathrm{P}");
defineMacro("\\sdot", "\\cdot");
defineMacro("\\sect", "\\S");
defineMacro("\\spades", "\\spadesuit");
defineMacro("\\sub", "\\subset");
defineMacro("\\sube", "\\subseteq");
defineMacro("\\supe", "\\supseteq");
defineMacro("\\Tau", "\\mathrm{T}");
defineMacro("\\thetasym", "\\vartheta");
defineMacro("\\weierp", "\\wp");
defineMacro("\\Zeta", "\\mathrm{Z}");
defineMacro("\\argmin", "\\DOTSB\\operatorname*{arg\\,min}");
defineMacro("\\argmax", "\\DOTSB\\operatorname*{arg\\,max}");
defineMacro("\\plim", "\\DOTSB\\mathop{\\operatorname{plim}}\\limits");
defineMacro("\\bra", "\\mathinner{\\langle{#1}|}");
defineMacro("\\ket", "\\mathinner{|{#1}\\rangle}");
defineMacro("\\braket", "\\mathinner{\\langle{#1}\\rangle}");
defineMacro("\\Bra", "\\left\\langle#1\\right|");
defineMacro("\\Ket", "\\left|#1\\right\\rangle");
var braketHelper = (one) => (context) => {
	var left = context.consumeArg().tokens;
	var middle = context.consumeArg().tokens;
	var middleDouble = context.consumeArg().tokens;
	var right = context.consumeArg().tokens;
	var oldMiddle = context.macros.get("|");
	var oldMiddleDouble = context.macros.get("\\|");
	context.macros.beginGroup();
	var midMacro = (double) => (context) => {
		if (one) {
			context.macros.set("|", oldMiddle);
			if (middleDouble.length) context.macros.set("\\|", oldMiddleDouble);
		}
		var doubled = double;
		if (!double && middleDouble.length) {
			if (context.future().text === "|") {
				context.popToken();
				doubled = true;
			}
		}
		return {
			tokens: doubled ? middleDouble : middle,
			numArgs: 0
		};
	};
	context.macros.set("|", midMacro(false));
	if (middleDouble.length) context.macros.set("\\|", midMacro(true));
	var arg = context.consumeArg().tokens;
	var expanded = context.expandTokens([
		...right,
		...arg,
		...left
	]);
	context.macros.endGroup();
	return {
		tokens: expanded.reverse(),
		numArgs: 0
	};
};
defineMacro("\\bra@ket", braketHelper(false));
defineMacro("\\bra@set", braketHelper(true));
defineMacro("\\Braket", "\\bra@ket{\\left\\langle}{\\,\\middle\\vert\\,}{\\,\\middle\\vert\\,}{\\right\\rangle}");
defineMacro("\\Set", "\\bra@set{\\left\\{\\:}{\\;\\middle\\vert\\;}{\\;\\middle\\Vert\\;}{\\:\\right\\}}");
defineMacro("\\set", "\\bra@set{\\{\\,}{\\mid}{}{\\,\\}}");
defineMacro("\\angln", "{\\angl n}");
defineMacro("\\blue", "\\textcolor{##6495ed}{#1}");
defineMacro("\\orange", "\\textcolor{##ffa500}{#1}");
defineMacro("\\pink", "\\textcolor{##ff00af}{#1}");
defineMacro("\\red", "\\textcolor{##df0030}{#1}");
defineMacro("\\green", "\\textcolor{##28ae7b}{#1}");
defineMacro("\\gray", "\\textcolor{gray}{#1}");
defineMacro("\\purple", "\\textcolor{##9d38bd}{#1}");
defineMacro("\\blueA", "\\textcolor{##ccfaff}{#1}");
defineMacro("\\blueB", "\\textcolor{##80f6ff}{#1}");
defineMacro("\\blueC", "\\textcolor{##63d9ea}{#1}");
defineMacro("\\blueD", "\\textcolor{##11accd}{#1}");
defineMacro("\\blueE", "\\textcolor{##0c7f99}{#1}");
defineMacro("\\tealA", "\\textcolor{##94fff5}{#1}");
defineMacro("\\tealB", "\\textcolor{##26edd5}{#1}");
defineMacro("\\tealC", "\\textcolor{##01d1c1}{#1}");
defineMacro("\\tealD", "\\textcolor{##01a995}{#1}");
defineMacro("\\tealE", "\\textcolor{##208170}{#1}");
defineMacro("\\greenA", "\\textcolor{##b6ffb0}{#1}");
defineMacro("\\greenB", "\\textcolor{##8af281}{#1}");
defineMacro("\\greenC", "\\textcolor{##74cf70}{#1}");
defineMacro("\\greenD", "\\textcolor{##1fab54}{#1}");
defineMacro("\\greenE", "\\textcolor{##0d923f}{#1}");
defineMacro("\\goldA", "\\textcolor{##ffd0a9}{#1}");
defineMacro("\\goldB", "\\textcolor{##ffbb71}{#1}");
defineMacro("\\goldC", "\\textcolor{##ff9c39}{#1}");
defineMacro("\\goldD", "\\textcolor{##e07d10}{#1}");
defineMacro("\\goldE", "\\textcolor{##a75a05}{#1}");
defineMacro("\\redA", "\\textcolor{##fca9a9}{#1}");
defineMacro("\\redB", "\\textcolor{##ff8482}{#1}");
defineMacro("\\redC", "\\textcolor{##f9685d}{#1}");
defineMacro("\\redD", "\\textcolor{##e84d39}{#1}");
defineMacro("\\redE", "\\textcolor{##bc2612}{#1}");
defineMacro("\\maroonA", "\\textcolor{##ffbde0}{#1}");
defineMacro("\\maroonB", "\\textcolor{##ff92c6}{#1}");
defineMacro("\\maroonC", "\\textcolor{##ed5fa6}{#1}");
defineMacro("\\maroonD", "\\textcolor{##ca337c}{#1}");
defineMacro("\\maroonE", "\\textcolor{##9e034e}{#1}");
defineMacro("\\purpleA", "\\textcolor{##ddd7ff}{#1}");
defineMacro("\\purpleB", "\\textcolor{##c6b9fc}{#1}");
defineMacro("\\purpleC", "\\textcolor{##aa87ff}{#1}");
defineMacro("\\purpleD", "\\textcolor{##7854ab}{#1}");
defineMacro("\\purpleE", "\\textcolor{##543b78}{#1}");
defineMacro("\\mintA", "\\textcolor{##f5f9e8}{#1}");
defineMacro("\\mintB", "\\textcolor{##edf2df}{#1}");
defineMacro("\\mintC", "\\textcolor{##e0e5cc}{#1}");
defineMacro("\\grayA", "\\textcolor{##f6f7f7}{#1}");
defineMacro("\\grayB", "\\textcolor{##f0f1f2}{#1}");
defineMacro("\\grayC", "\\textcolor{##e3e5e6}{#1}");
defineMacro("\\grayD", "\\textcolor{##d6d8da}{#1}");
defineMacro("\\grayE", "\\textcolor{##babec2}{#1}");
defineMacro("\\grayF", "\\textcolor{##888d93}{#1}");
defineMacro("\\grayG", "\\textcolor{##626569}{#1}");
defineMacro("\\grayH", "\\textcolor{##3b3e40}{#1}");
defineMacro("\\grayI", "\\textcolor{##21242c}{#1}");
defineMacro("\\kaBlue", "\\textcolor{##314453}{#1}");
defineMacro("\\kaGreen", "\\textcolor{##71B307}{#1}");
/**
* This file contains the “gullet” where macros are expanded
* until only non-macro tokens remain.
*/
var implicitCommands = {
	"^": true,
	"_": true,
	"\\limits": true,
	"\\nolimits": true
};
var MacroExpander = class {
	constructor(input, settings, mode) {
		this.settings = void 0;
		this.expansionCount = void 0;
		this.lexer = void 0;
		this.macros = void 0;
		this.stack = void 0;
		this.mode = void 0;
		this.settings = settings;
		this.expansionCount = 0;
		this.feed(input);
		this.macros = new Namespace(macros, settings.macros);
		this.mode = mode;
		this.stack = [];
	}
	/**
	* Feed a new input string to the same MacroExpander
	* (with existing macros etc.).
	*/
	feed(input) {
		this.lexer = new Lexer(input, this.settings);
	}
	/**
	* Switches between "text" and "math" modes.
	*/
	switchMode(newMode) {
		this.mode = newMode;
	}
	/**
	* Start a new group nesting within all namespaces.
	*/
	beginGroup() {
		this.macros.beginGroup();
	}
	/**
	* End current group nesting within all namespaces.
	*/
	endGroup() {
		this.macros.endGroup();
	}
	/**
	* Ends all currently nested groups (if any), restoring values before the
	* groups began.  Useful in case of an error in the middle of parsing.
	*/
	endGroups() {
		this.macros.endGroups();
	}
	/**
	* Returns the topmost token on the stack, without expanding it.
	* Similar in behavior to TeX's `\futurelet`.
	*/
	future() {
		if (this.stack.length === 0) this.pushToken(this.lexer.lex());
		return this.stack[this.stack.length - 1];
	}
	/**
	* Remove and return the next unexpanded token.
	*/
	popToken() {
		this.future();
		return this.stack.pop();
	}
	/**
	* Add a given token to the token stack.  In particular, this get be used
	* to put back a token returned from one of the other methods.
	*/
	pushToken(token) {
		this.stack.push(token);
	}
	/**
	* Append an array of tokens to the token stack.
	*/
	pushTokens(tokens) {
		this.stack.push(...tokens);
	}
	/**
	* Find an macro argument without expanding tokens and append the array of
	* tokens to the token stack. Uses Token as a container for the result.
	*/
	scanArgument(isOptional) {
		var start;
		var end;
		var tokens;
		if (isOptional) {
			this.consumeSpaces();
			if (this.future().text !== "[") return null;
			start = this.popToken();
			({tokens, end} = this.consumeArg(["]"]));
		} else ({tokens, start, end} = this.consumeArg());
		this.pushToken(new Token("EOF", end.loc));
		this.pushTokens(tokens);
		return new Token("", SourceLocation.range(start, end));
	}
	/**
	* Consume all following space tokens, without expansion.
	*/
	consumeSpaces() {
		for (;;) if (this.future().text === " ") this.stack.pop();
		else break;
	}
	/**
	* Consume an argument from the token stream, and return the resulting array
	* of tokens and start/end token.
	*/
	consumeArg(delims) {
		var tokens = [];
		var isDelimited = delims && delims.length > 0;
		if (!isDelimited) this.consumeSpaces();
		var start = this.future();
		var tok;
		var depth = 0;
		var match = 0;
		do {
			tok = this.popToken();
			tokens.push(tok);
			if (tok.text === "{") ++depth;
			else if (tok.text === "}") {
				--depth;
				if (depth === -1) throw new ParseError("Extra }", tok);
			} else if (tok.text === "EOF") throw new ParseError("Unexpected end of input in a macro argument, expected '" + (delims && isDelimited ? delims[match] : "}") + "'", tok);
			if (delims && isDelimited) if ((depth === 0 || depth === 1 && delims[match] === "{") && tok.text === delims[match]) {
				++match;
				if (match === delims.length) {
					tokens.splice(-match, match);
					break;
				}
			} else match = 0;
		} while (depth !== 0 || isDelimited);
		if (start.text === "{" && tokens[tokens.length - 1].text === "}") {
			tokens.pop();
			tokens.shift();
		}
		tokens.reverse();
		return {
			tokens,
			start,
			end: tok
		};
	}
	/**
	* Consume the specified number of (delimited) arguments from the token
	* stream and return the resulting array of arguments.
	*/
	consumeArgs(numArgs, delimiters) {
		if (delimiters) {
			if (delimiters.length !== numArgs + 1) throw new ParseError("The length of delimiters doesn't match the number of args!");
			var delims = delimiters[0];
			for (var i = 0; i < delims.length; i++) {
				var tok = this.popToken();
				if (delims[i] !== tok.text) throw new ParseError("Use of the macro doesn't match its definition", tok);
			}
		}
		var args = [];
		for (var _i = 0; _i < numArgs; _i++) args.push(this.consumeArg(delimiters && delimiters[_i + 1]).tokens);
		return args;
	}
	/**
	* Increment `expansionCount` by the specified amount.
	* Throw an error if it exceeds `maxExpand`.
	*/
	countExpansion(amount) {
		this.expansionCount += amount;
		if (this.expansionCount > this.settings.maxExpand) throw new ParseError("Too many expansions: infinite loop or need to increase maxExpand setting");
	}
	/**
	* Expand the next token only once if possible.
	*
	* If the token is expanded, the resulting tokens will be pushed onto
	* the stack in reverse order, and the number of such tokens will be
	* returned.  This number might be zero or positive.
	*
	* If not, the return value is `false`, and the next token remains at the
	* top of the stack.
	*
	* In either case, the next token will be on the top of the stack,
	* or the stack will be empty (in case of empty expansion
	* and no other tokens).
	*
	* Used to implement `expandAfterFuture` and `expandNextToken`.
	*
	* If expandableOnly, only expandable tokens are expanded and
	* an undefined control sequence results in an error.
	*/
	expandOnce(expandableOnly) {
		var topToken = this.popToken();
		var name = topToken.text;
		var expansion = !topToken.noexpand ? this._getExpansion(name) : null;
		if (expansion == null || expandableOnly && expansion.unexpandable) {
			if (expandableOnly && expansion == null && name[0] === "\\" && !this.isDefined(name)) throw new ParseError("Undefined control sequence: " + name);
			this.pushToken(topToken);
			return false;
		}
		this.countExpansion(1);
		var tokens = expansion.tokens;
		var args = this.consumeArgs(expansion.numArgs, expansion.delimiters);
		if (expansion.numArgs) {
			tokens = tokens.slice();
			for (var i = tokens.length - 1; i >= 0; --i) {
				var tok = tokens[i];
				if (tok.text === "#") {
					if (i === 0) throw new ParseError("Incomplete placeholder at end of macro body", tok);
					tok = tokens[--i];
					if (tok.text === "#") tokens.splice(i + 1, 1);
					else if (/^[1-9]$/.test(tok.text)) tokens.splice(i, 2, ...args[+tok.text - 1]);
					else throw new ParseError("Not a valid argument number", tok);
				}
			}
		}
		this.pushTokens(tokens);
		return tokens.length;
	}
	/**
	* Expand the next token only once (if possible), and return the resulting
	* top token on the stack (without removing anything from the stack).
	* Similar in behavior to TeX's `\expandafter\futurelet`.
	* Equivalent to expandOnce() followed by future().
	*/
	expandAfterFuture() {
		this.expandOnce();
		return this.future();
	}
	/**
	* Recursively expand first token, then return first non-expandable token.
	*/
	expandNextToken() {
		for (;;) if (this.expandOnce() === false) {
			var token = this.stack.pop();
			if (token.treatAsRelax) token.text = "\\relax";
			return token;
		}
	}
	/**
	* Fully expand the given macro name and return the resulting list of
	* tokens, or return `undefined` if no such macro is defined.
	*/
	expandMacro(name) {
		return this.macros.has(name) ? this.expandTokens([new Token(name)]) : void 0;
	}
	/**
	* Fully expand the given token stream and return the resulting list of
	* tokens.  Note that the input tokens are in reverse order, but the
	* output tokens are in forward order.
	*/
	expandTokens(tokens) {
		var output = [];
		var oldStackLength = this.stack.length;
		this.pushTokens(tokens);
		while (this.stack.length > oldStackLength) if (this.expandOnce(true) === false) {
			var token = this.stack.pop();
			if (token.treatAsRelax) {
				token.noexpand = false;
				token.treatAsRelax = false;
			}
			output.push(token);
		}
		this.countExpansion(output.length);
		return output;
	}
	/**
	* Fully expand the given macro name and return the result as a string,
	* or return `undefined` if no such macro is defined.
	*/
	expandMacroAsText(name) {
		var tokens = this.expandMacro(name);
		if (tokens) return tokens.map((token) => token.text).join("");
		else return tokens;
	}
	/**
	* Returns the expanded macro as a reversed array of tokens and a macro
	* argument count.  Or returns `null` if no such macro.
	*/
	_getExpansion(name) {
		var definition = this.macros.get(name);
		if (definition == null) return definition;
		if (name.length === 1) {
			var catcode = this.lexer.catcodes[name];
			if (catcode != null && catcode !== 13) return;
		}
		var expansion = typeof definition === "function" ? definition(this) : definition;
		if (typeof expansion === "string") {
			var numArgs = 0;
			if (expansion.includes("#")) {
				var stripped = expansion.replace(/##/g, "");
				while (stripped.includes("#" + (numArgs + 1))) ++numArgs;
			}
			var bodyLexer = new Lexer(expansion, this.settings);
			var tokens = [];
			var tok = bodyLexer.lex();
			while (tok.text !== "EOF") {
				tokens.push(tok);
				tok = bodyLexer.lex();
			}
			tokens.reverse();
			return {
				tokens,
				numArgs
			};
		}
		return expansion;
	}
	/**
	* Determine whether a command is currently "defined" (has some
	* functionality), meaning that it's a macro (in the current group),
	* a function, a symbol, or one of the special commands listed in
	* `implicitCommands`.
	*/
	isDefined(name) {
		return this.macros.has(name) || functions.hasOwnProperty(name) || symbols.math.hasOwnProperty(name) || symbols.text.hasOwnProperty(name) || implicitCommands.hasOwnProperty(name);
	}
	/**
	* Determine whether a command is expandable.
	*/
	isExpandable(name) {
		var macro = this.macros.get(name);
		return macro != null ? typeof macro === "string" || typeof macro === "function" || !macro.unexpandable : functions.hasOwnProperty(name) && !functions[name].primitive;
	}
};
var unicodeSubRegEx = /^[₊₋₌₍₎₀₁₂₃₄₅₆₇₈₉ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵦᵧᵨᵩᵪ]/;
var uSubsAndSups = Object.freeze({
	"₊": "+",
	"₋": "-",
	"₌": "=",
	"₍": "(",
	"₎": ")",
	"₀": "0",
	"₁": "1",
	"₂": "2",
	"₃": "3",
	"₄": "4",
	"₅": "5",
	"₆": "6",
	"₇": "7",
	"₈": "8",
	"₉": "9",
	"ₐ": "a",
	"ₑ": "e",
	"ₕ": "h",
	"ᵢ": "i",
	"ⱼ": "j",
	"ₖ": "k",
	"ₗ": "l",
	"ₘ": "m",
	"ₙ": "n",
	"ₒ": "o",
	"ₚ": "p",
	"ᵣ": "r",
	"ₛ": "s",
	"ₜ": "t",
	"ᵤ": "u",
	"ᵥ": "v",
	"ₓ": "x",
	"ᵦ": "β",
	"ᵧ": "γ",
	"ᵨ": "ρ",
	"ᵩ": "ϕ",
	"ᵪ": "χ",
	"⁺": "+",
	"⁻": "-",
	"⁼": "=",
	"⁽": "(",
	"⁾": ")",
	"⁰": "0",
	"¹": "1",
	"²": "2",
	"³": "3",
	"⁴": "4",
	"⁵": "5",
	"⁶": "6",
	"⁷": "7",
	"⁸": "8",
	"⁹": "9",
	"ᴬ": "A",
	"ᴮ": "B",
	"ᴰ": "D",
	"ᴱ": "E",
	"ᴳ": "G",
	"ᴴ": "H",
	"ᴵ": "I",
	"ᴶ": "J",
	"ᴷ": "K",
	"ᴸ": "L",
	"ᴹ": "M",
	"ᴺ": "N",
	"ᴼ": "O",
	"ᴾ": "P",
	"ᴿ": "R",
	"ᵀ": "T",
	"ᵁ": "U",
	"ⱽ": "V",
	"ᵂ": "W",
	"ᵃ": "a",
	"ᵇ": "b",
	"ᶜ": "c",
	"ᵈ": "d",
	"ᵉ": "e",
	"ᶠ": "f",
	"ᵍ": "g",
	"ʰ": "h",
	"ⁱ": "i",
	"ʲ": "j",
	"ᵏ": "k",
	"ˡ": "l",
	"ᵐ": "m",
	"ⁿ": "n",
	"ᵒ": "o",
	"ᵖ": "p",
	"ʳ": "r",
	"ˢ": "s",
	"ᵗ": "t",
	"ᵘ": "u",
	"ᵛ": "v",
	"ʷ": "w",
	"ˣ": "x",
	"ʸ": "y",
	"ᶻ": "z",
	"ᵝ": "β",
	"ᵞ": "γ",
	"ᵟ": "δ",
	"ᵠ": "ϕ",
	"ᵡ": "χ",
	"ᶿ": "θ"
});
var unicodeAccents = {
	"́": {
		"text": "\\'",
		"math": "\\acute"
	},
	"̀": {
		"text": "\\`",
		"math": "\\grave"
	},
	"̈": {
		"text": "\\\"",
		"math": "\\ddot"
	},
	"̃": {
		"text": "\\~",
		"math": "\\tilde"
	},
	"̄": {
		"text": "\\=",
		"math": "\\bar"
	},
	"̆": {
		"text": "\\u",
		"math": "\\breve"
	},
	"̌": {
		"text": "\\v",
		"math": "\\check"
	},
	"̂": {
		"text": "\\^",
		"math": "\\hat"
	},
	"̇": {
		"text": "\\.",
		"math": "\\dot"
	},
	"̊": {
		"text": "\\r",
		"math": "\\mathring"
	},
	"̋": { "text": "\\H" },
	"̧": { "text": "\\c" }
};
var unicodeSymbols = {
	"á": "á",
	"à": "à",
	"ä": "ä",
	"ǟ": "ǟ",
	"ã": "ã",
	"ā": "ā",
	"ă": "ă",
	"ắ": "ắ",
	"ằ": "ằ",
	"ẵ": "ẵ",
	"ǎ": "ǎ",
	"â": "â",
	"ấ": "ấ",
	"ầ": "ầ",
	"ẫ": "ẫ",
	"ȧ": "ȧ",
	"ǡ": "ǡ",
	"å": "å",
	"ǻ": "ǻ",
	"ḃ": "ḃ",
	"ć": "ć",
	"ḉ": "ḉ",
	"č": "č",
	"ĉ": "ĉ",
	"ċ": "ċ",
	"ç": "ç",
	"ď": "ď",
	"ḋ": "ḋ",
	"ḑ": "ḑ",
	"é": "é",
	"è": "è",
	"ë": "ë",
	"ẽ": "ẽ",
	"ē": "ē",
	"ḗ": "ḗ",
	"ḕ": "ḕ",
	"ĕ": "ĕ",
	"ḝ": "ḝ",
	"ě": "ě",
	"ê": "ê",
	"ế": "ế",
	"ề": "ề",
	"ễ": "ễ",
	"ė": "ė",
	"ȩ": "ȩ",
	"ḟ": "ḟ",
	"ǵ": "ǵ",
	"ḡ": "ḡ",
	"ğ": "ğ",
	"ǧ": "ǧ",
	"ĝ": "ĝ",
	"ġ": "ġ",
	"ģ": "ģ",
	"ḧ": "ḧ",
	"ȟ": "ȟ",
	"ĥ": "ĥ",
	"ḣ": "ḣ",
	"ḩ": "ḩ",
	"í": "í",
	"ì": "ì",
	"ï": "ï",
	"ḯ": "ḯ",
	"ĩ": "ĩ",
	"ī": "ī",
	"ĭ": "ĭ",
	"ǐ": "ǐ",
	"î": "î",
	"ǰ": "ǰ",
	"ĵ": "ĵ",
	"ḱ": "ḱ",
	"ǩ": "ǩ",
	"ķ": "ķ",
	"ĺ": "ĺ",
	"ľ": "ľ",
	"ļ": "ļ",
	"ḿ": "ḿ",
	"ṁ": "ṁ",
	"ń": "ń",
	"ǹ": "ǹ",
	"ñ": "ñ",
	"ň": "ň",
	"ṅ": "ṅ",
	"ņ": "ņ",
	"ó": "ó",
	"ò": "ò",
	"ö": "ö",
	"ȫ": "ȫ",
	"õ": "õ",
	"ṍ": "ṍ",
	"ṏ": "ṏ",
	"ȭ": "ȭ",
	"ō": "ō",
	"ṓ": "ṓ",
	"ṑ": "ṑ",
	"ŏ": "ŏ",
	"ǒ": "ǒ",
	"ô": "ô",
	"ố": "ố",
	"ồ": "ồ",
	"ỗ": "ỗ",
	"ȯ": "ȯ",
	"ȱ": "ȱ",
	"ő": "ő",
	"ṕ": "ṕ",
	"ṗ": "ṗ",
	"ŕ": "ŕ",
	"ř": "ř",
	"ṙ": "ṙ",
	"ŗ": "ŗ",
	"ś": "ś",
	"ṥ": "ṥ",
	"š": "š",
	"ṧ": "ṧ",
	"ŝ": "ŝ",
	"ṡ": "ṡ",
	"ş": "ş",
	"ẗ": "ẗ",
	"ť": "ť",
	"ṫ": "ṫ",
	"ţ": "ţ",
	"ú": "ú",
	"ù": "ù",
	"ü": "ü",
	"ǘ": "ǘ",
	"ǜ": "ǜ",
	"ǖ": "ǖ",
	"ǚ": "ǚ",
	"ũ": "ũ",
	"ṹ": "ṹ",
	"ū": "ū",
	"ṻ": "ṻ",
	"ŭ": "ŭ",
	"ǔ": "ǔ",
	"û": "û",
	"ů": "ů",
	"ű": "ű",
	"ṽ": "ṽ",
	"ẃ": "ẃ",
	"ẁ": "ẁ",
	"ẅ": "ẅ",
	"ŵ": "ŵ",
	"ẇ": "ẇ",
	"ẘ": "ẘ",
	"ẍ": "ẍ",
	"ẋ": "ẋ",
	"ý": "ý",
	"ỳ": "ỳ",
	"ÿ": "ÿ",
	"ỹ": "ỹ",
	"ȳ": "ȳ",
	"ŷ": "ŷ",
	"ẏ": "ẏ",
	"ẙ": "ẙ",
	"ź": "ź",
	"ž": "ž",
	"ẑ": "ẑ",
	"ż": "ż",
	"Á": "Á",
	"À": "À",
	"Ä": "Ä",
	"Ǟ": "Ǟ",
	"Ã": "Ã",
	"Ā": "Ā",
	"Ă": "Ă",
	"Ắ": "Ắ",
	"Ằ": "Ằ",
	"Ẵ": "Ẵ",
	"Ǎ": "Ǎ",
	"Â": "Â",
	"Ấ": "Ấ",
	"Ầ": "Ầ",
	"Ẫ": "Ẫ",
	"Ȧ": "Ȧ",
	"Ǡ": "Ǡ",
	"Å": "Å",
	"Ǻ": "Ǻ",
	"Ḃ": "Ḃ",
	"Ć": "Ć",
	"Ḉ": "Ḉ",
	"Č": "Č",
	"Ĉ": "Ĉ",
	"Ċ": "Ċ",
	"Ç": "Ç",
	"Ď": "Ď",
	"Ḋ": "Ḋ",
	"Ḑ": "Ḑ",
	"É": "É",
	"È": "È",
	"Ë": "Ë",
	"Ẽ": "Ẽ",
	"Ē": "Ē",
	"Ḗ": "Ḗ",
	"Ḕ": "Ḕ",
	"Ĕ": "Ĕ",
	"Ḝ": "Ḝ",
	"Ě": "Ě",
	"Ê": "Ê",
	"Ế": "Ế",
	"Ề": "Ề",
	"Ễ": "Ễ",
	"Ė": "Ė",
	"Ȩ": "Ȩ",
	"Ḟ": "Ḟ",
	"Ǵ": "Ǵ",
	"Ḡ": "Ḡ",
	"Ğ": "Ğ",
	"Ǧ": "Ǧ",
	"Ĝ": "Ĝ",
	"Ġ": "Ġ",
	"Ģ": "Ģ",
	"Ḧ": "Ḧ",
	"Ȟ": "Ȟ",
	"Ĥ": "Ĥ",
	"Ḣ": "Ḣ",
	"Ḩ": "Ḩ",
	"Í": "Í",
	"Ì": "Ì",
	"Ï": "Ï",
	"Ḯ": "Ḯ",
	"Ĩ": "Ĩ",
	"Ī": "Ī",
	"Ĭ": "Ĭ",
	"Ǐ": "Ǐ",
	"Î": "Î",
	"İ": "İ",
	"Ĵ": "Ĵ",
	"Ḱ": "Ḱ",
	"Ǩ": "Ǩ",
	"Ķ": "Ķ",
	"Ĺ": "Ĺ",
	"Ľ": "Ľ",
	"Ļ": "Ļ",
	"Ḿ": "Ḿ",
	"Ṁ": "Ṁ",
	"Ń": "Ń",
	"Ǹ": "Ǹ",
	"Ñ": "Ñ",
	"Ň": "Ň",
	"Ṅ": "Ṅ",
	"Ņ": "Ņ",
	"Ó": "Ó",
	"Ò": "Ò",
	"Ö": "Ö",
	"Ȫ": "Ȫ",
	"Õ": "Õ",
	"Ṍ": "Ṍ",
	"Ṏ": "Ṏ",
	"Ȭ": "Ȭ",
	"Ō": "Ō",
	"Ṓ": "Ṓ",
	"Ṑ": "Ṑ",
	"Ŏ": "Ŏ",
	"Ǒ": "Ǒ",
	"Ô": "Ô",
	"Ố": "Ố",
	"Ồ": "Ồ",
	"Ỗ": "Ỗ",
	"Ȯ": "Ȯ",
	"Ȱ": "Ȱ",
	"Ő": "Ő",
	"Ṕ": "Ṕ",
	"Ṗ": "Ṗ",
	"Ŕ": "Ŕ",
	"Ř": "Ř",
	"Ṙ": "Ṙ",
	"Ŗ": "Ŗ",
	"Ś": "Ś",
	"Ṥ": "Ṥ",
	"Š": "Š",
	"Ṧ": "Ṧ",
	"Ŝ": "Ŝ",
	"Ṡ": "Ṡ",
	"Ş": "Ş",
	"Ť": "Ť",
	"Ṫ": "Ṫ",
	"Ţ": "Ţ",
	"Ú": "Ú",
	"Ù": "Ù",
	"Ü": "Ü",
	"Ǘ": "Ǘ",
	"Ǜ": "Ǜ",
	"Ǖ": "Ǖ",
	"Ǚ": "Ǚ",
	"Ũ": "Ũ",
	"Ṹ": "Ṹ",
	"Ū": "Ū",
	"Ṻ": "Ṻ",
	"Ŭ": "Ŭ",
	"Ǔ": "Ǔ",
	"Û": "Û",
	"Ů": "Ů",
	"Ű": "Ű",
	"Ṽ": "Ṽ",
	"Ẃ": "Ẃ",
	"Ẁ": "Ẁ",
	"Ẅ": "Ẅ",
	"Ŵ": "Ŵ",
	"Ẇ": "Ẇ",
	"Ẍ": "Ẍ",
	"Ẋ": "Ẋ",
	"Ý": "Ý",
	"Ỳ": "Ỳ",
	"Ÿ": "Ÿ",
	"Ỹ": "Ỹ",
	"Ȳ": "Ȳ",
	"Ŷ": "Ŷ",
	"Ẏ": "Ẏ",
	"Ź": "Ź",
	"Ž": "Ž",
	"Ẑ": "Ẑ",
	"Ż": "Ż",
	"ά": "ά",
	"ὰ": "ὰ",
	"ᾱ": "ᾱ",
	"ᾰ": "ᾰ",
	"έ": "έ",
	"ὲ": "ὲ",
	"ή": "ή",
	"ὴ": "ὴ",
	"ί": "ί",
	"ὶ": "ὶ",
	"ϊ": "ϊ",
	"ΐ": "ΐ",
	"ῒ": "ῒ",
	"ῑ": "ῑ",
	"ῐ": "ῐ",
	"ό": "ό",
	"ὸ": "ὸ",
	"ύ": "ύ",
	"ὺ": "ὺ",
	"ϋ": "ϋ",
	"ΰ": "ΰ",
	"ῢ": "ῢ",
	"ῡ": "ῡ",
	"ῠ": "ῠ",
	"ώ": "ώ",
	"ὼ": "ὼ",
	"Ύ": "Ύ",
	"Ὺ": "Ὺ",
	"Ϋ": "Ϋ",
	"Ῡ": "Ῡ",
	"Ῠ": "Ῠ",
	"Ώ": "Ώ",
	"Ὼ": "Ὼ"
};
/**
* This file contains the parser used to parse out a TeX expression from the
* input. Since TeX isn't context-free, standard parsers don't work particularly
* well.
*
* The strategy of this parser is as such:
*
* The main functions (the `.parse...` ones) take a position in the current
* parse string to parse tokens from. The lexer (found in Lexer.js, stored at
* this.gullet.lexer) also supports pulling out tokens at arbitrary places. When
* individual tokens are needed at a position, the lexer is called to pull out a
* token, which is then used.
*
* The parser has a property called "mode" indicating the mode that
* the parser is currently in. Currently it has to be one of "math" or
* "text", which denotes whether the current environment is a math-y
* one or a text-y one (e.g. inside \text). Currently, this serves to
* limit the functions which can be used in text mode.
*
* The main functions then return an object which contains the useful data that
* was parsed at its given point, and a new position at the end of the parsed
* data. The main functions can call each other and continue the parsing by
* using the returned position as a new starting point.
*
* There are also extra `.handle...` functions, which pull out some reused
* functionality into self-contained functions.
*
* The functions return ParseNodes.
*/
var Parser = class Parser {
	constructor(input, settings) {
		this.mode = void 0;
		this.gullet = void 0;
		this.settings = void 0;
		this.leftrightDepth = void 0;
		this.nextToken = void 0;
		this.mode = "math";
		this.gullet = new MacroExpander(input, settings, this.mode);
		this.settings = settings;
		this.leftrightDepth = 0;
		this.nextToken = null;
	}
	/**
	* Checks a result to make sure it has the right type, and throws an
	* appropriate error otherwise.
	*/
	expect(text, consume) {
		if (consume === void 0) consume = true;
		if (this.fetch().text !== text) throw new ParseError("Expected '" + text + "', got '" + this.fetch().text + "'", this.fetch());
		if (consume) this.consume();
	}
	/**
	* Discards the current lookahead token, considering it consumed.
	*/
	consume() {
		this.nextToken = null;
	}
	/**
	* Return the current lookahead token, or if there isn't one (at the
	* beginning, or if the previous lookahead token was consume()d),
	* fetch the next token as the new lookahead token and return it.
	*/
	fetch() {
		if (this.nextToken == null) this.nextToken = this.gullet.expandNextToken();
		return this.nextToken;
	}
	/**
	* Switches between "text" and "math" modes.
	*/
	switchMode(newMode) {
		this.mode = newMode;
		this.gullet.switchMode(newMode);
	}
	/**
	* Main parsing function, which parses an entire input.
	*/
	parse() {
		if (!this.settings.globalGroup) this.gullet.beginGroup();
		if (this.settings.colorIsTextColor) this.gullet.macros.set("\\color", "\\textcolor");
		try {
			var parse = this.parseExpression(false);
			this.expect("EOF");
			if (!this.settings.globalGroup) this.gullet.endGroup();
			return parse;
		} finally {
			this.gullet.endGroups();
		}
	}
	/**
	* Fully parse a separate sequence of tokens as a separate job.
	* Tokens should be specified in reverse order, as in a MacroDefinition.
	*/
	subparse(tokens) {
		var oldToken = this.nextToken;
		this.consume();
		this.gullet.pushToken(new Token("}"));
		this.gullet.pushTokens(tokens);
		var parse = this.parseExpression(false);
		this.expect("}");
		this.nextToken = oldToken;
		return parse;
	}
	/**
	* Parses an "expression", which is a list of atoms.
	*
	* `breakOnInfix`: Should the parsing stop when we hit infix nodes? This
	*                 happens when functions have higher precedence than infix
	*                 nodes in implicit parses.
	*
	* `breakOnTokenText`: The text of the token that the expression should end
	*                     with, or `null` if something else should end the
	*                     expression.
	*/
	parseExpression(breakOnInfix, breakOnTokenText) {
		var body = [];
		while (true) {
			if (this.mode === "math") this.consumeSpaces();
			var lex = this.fetch();
			if (Parser.endOfExpression.has(lex.text)) break;
			if (breakOnTokenText && lex.text === breakOnTokenText) break;
			if (breakOnInfix && functions[lex.text] && functions[lex.text].infix) break;
			var atom = this.parseAtom(breakOnTokenText);
			if (!atom) break;
			else if (atom.type === "internal") continue;
			body.push(atom);
		}
		if (this.mode === "text") this.formLigatures(body);
		return this.handleInfixNodes(body);
	}
	/**
	* Rewrites infix operators such as \over with corresponding commands such
	* as \frac.
	*
	* There can only be one infix operator per group.  If there's more than one
	* then the expression is ambiguous.  This can be resolved by adding {}.
	*/
	handleInfixNodes(body) {
		var overIndex = -1;
		var funcName;
		for (var i = 0; i < body.length; i++) {
			var node = body[i];
			if (node.type === "infix") {
				if (overIndex !== -1) throw new ParseError("only one infix operator per group", node.token);
				overIndex = i;
				funcName = node.replaceWith;
			}
		}
		if (overIndex !== -1 && funcName) {
			var numerNode;
			var denomNode;
			var numerBody = body.slice(0, overIndex);
			var denomBody = body.slice(overIndex + 1);
			if (numerBody.length === 1 && numerBody[0].type === "ordgroup") numerNode = numerBody[0];
			else numerNode = {
				type: "ordgroup",
				mode: this.mode,
				body: numerBody
			};
			if (denomBody.length === 1 && denomBody[0].type === "ordgroup") denomNode = denomBody[0];
			else denomNode = {
				type: "ordgroup",
				mode: this.mode,
				body: denomBody
			};
			var _node;
			if (funcName === "\\\\abovefrac") _node = this.callFunction(funcName, [
				numerNode,
				body[overIndex],
				denomNode
			], []);
			else _node = this.callFunction(funcName, [numerNode, denomNode], []);
			return [_node];
		} else return body;
	}
	/**
	* Handle a subscript or superscript with nice errors.
	*/
	handleSupSubscript(name) {
		var symbolToken = this.fetch();
		var symbol = symbolToken.text;
		this.consume();
		this.consumeSpaces();
		var group;
		do {
			var _group;
			group = this.parseGroup(name);
		} while (((_group = group) == null ? void 0 : _group.type) === "internal");
		if (!group) throw new ParseError("Expected group after '" + symbol + "'", symbolToken);
		return group;
	}
	/**
	* Converts the textual input of an unsupported command into a text node
	* contained within a color node whose color is determined by errorColor
	*/
	formatUnsupportedCmd(text) {
		var textordArray = [];
		for (var i = 0; i < text.length; i++) textordArray.push({
			type: "textord",
			mode: "text",
			text: text[i]
		});
		var textNode = {
			type: "text",
			mode: this.mode,
			body: textordArray
		};
		return {
			type: "color",
			mode: this.mode,
			color: this.settings.errorColor,
			body: [textNode]
		};
	}
	/**
	* Parses a group with optional super/subscripts.
	*/
	parseAtom(breakOnTokenText) {
		var base = this.parseGroup("atom", breakOnTokenText);
		if ((base == null ? void 0 : base.type) === "internal") return base;
		if (this.mode === "text") return base;
		var superscript;
		var subscript;
		while (true) {
			this.consumeSpaces();
			var lex = this.fetch();
			if (lex.text === "\\limits" || lex.text === "\\nolimits") {
				if (base && base.type === "op") {
					base.limits = lex.text === "\\limits";
					base.alwaysHandleSupSub = true;
				} else if (base && base.type === "operatorname") {
					if (base.alwaysHandleSupSub) base.limits = lex.text === "\\limits";
				} else throw new ParseError("Limit controls must follow a math operator", lex);
				this.consume();
			} else if (lex.text === "^") {
				if (superscript) throw new ParseError("Double superscript", lex);
				superscript = this.handleSupSubscript("superscript");
			} else if (lex.text === "_") {
				if (subscript) throw new ParseError("Double subscript", lex);
				subscript = this.handleSupSubscript("subscript");
			} else if (lex.text === "'") {
				if (superscript) throw new ParseError("Double superscript", lex);
				var prime = {
					type: "textord",
					mode: this.mode,
					text: "\\prime"
				};
				var primes = [prime];
				this.consume();
				while (this.fetch().text === "'") {
					primes.push(prime);
					this.consume();
				}
				if (this.fetch().text === "^") primes.push(this.handleSupSubscript("superscript"));
				superscript = {
					type: "ordgroup",
					mode: this.mode,
					body: primes
				};
			} else if (uSubsAndSups[lex.text]) {
				var isSub = unicodeSubRegEx.test(lex.text);
				var subsupTokens = [];
				subsupTokens.push(new Token(uSubsAndSups[lex.text]));
				this.consume();
				while (true) {
					var token = this.fetch().text;
					if (!uSubsAndSups[token]) break;
					if (unicodeSubRegEx.test(token) !== isSub) break;
					subsupTokens.unshift(new Token(uSubsAndSups[token]));
					this.consume();
				}
				var body = this.subparse(subsupTokens);
				if (isSub) subscript = {
					type: "ordgroup",
					mode: "math",
					body
				};
				else superscript = {
					type: "ordgroup",
					mode: "math",
					body
				};
			} else break;
		}
		if (superscript || subscript) return {
			type: "supsub",
			mode: this.mode,
			base,
			sup: superscript,
			sub: subscript
		};
		else return base;
	}
	/**
	* Parses an entire function, including its base and all of its arguments.
	*/
	parseFunction(breakOnTokenText, name) {
		var token = this.fetch();
		var func = token.text;
		var funcData = functions[func];
		if (!funcData) return null;
		this.consume();
		if (name && name !== "atom" && !funcData.allowedInArgument) throw new ParseError("Got function '" + func + "' with no arguments" + (name ? " as " + name : ""), token);
		else if (this.mode === "text" && !funcData.allowedInText) throw new ParseError("Can't use function '" + func + "' in text mode", token);
		else if (this.mode === "math" && funcData.allowedInMath === false) throw new ParseError("Can't use function '" + func + "' in math mode", token);
		var { args, optArgs } = this.parseArguments(func, funcData);
		return this.callFunction(func, args, optArgs, token, breakOnTokenText);
	}
	/**
	* Call a function handler with a suitable context and arguments.
	*/
	callFunction(name, args, optArgs, token, breakOnTokenText) {
		var context = {
			funcName: name,
			parser: this,
			token,
			breakOnTokenText
		};
		var func = functions[name];
		if (func && func.handler) return func.handler(context, args, optArgs);
		else throw new ParseError("No function handler for " + name);
	}
	/**
	* Parses the arguments of a function or environment
	*/
	parseArguments(func, funcData) {
		var totalArgs = funcData.numArgs + funcData.numOptionalArgs;
		if (totalArgs === 0) return {
			args: [],
			optArgs: []
		};
		var args = [];
		var optArgs = [];
		for (var i = 0; i < totalArgs; i++) {
			var argType = funcData.argTypes && funcData.argTypes[i];
			var isOptional = i < funcData.numOptionalArgs;
			if ("primitive" in funcData && funcData.primitive && argType == null || funcData.type === "sqrt" && i === 1 && optArgs[0] == null) argType = "primitive";
			var arg = this.parseGroupOfType("argument to '" + func + "'", argType, isOptional);
			if (isOptional) optArgs.push(arg);
			else if (arg != null) args.push(arg);
			else throw new ParseError("Null argument, please report this as a bug");
		}
		return {
			args,
			optArgs
		};
	}
	/**
	* Parses a group when the mode is changing.
	*/
	parseGroupOfType(name, type, optional) {
		switch (type) {
			case "color": return this.parseColorGroup(optional);
			case "size": return this.parseSizeGroup(optional);
			case "url": return this.parseUrlGroup(optional);
			case "math":
			case "text": return this.parseArgumentGroup(optional, type);
			case "hbox":
				var group = this.parseArgumentGroup(optional, "text");
				return group != null ? {
					type: "styling",
					mode: group.mode,
					body: [group],
					style: "text",
					resetFont: true
				} : null;
			case "raw":
				var token = this.parseStringGroup("raw", optional);
				return token != null ? {
					type: "raw",
					mode: "text",
					string: token.text
				} : null;
			case "primitive":
				if (optional) throw new ParseError("A primitive argument cannot be optional");
				var _group2 = this.parseGroup(name);
				if (_group2 == null) throw new ParseError("Expected group as " + name, this.fetch());
				return _group2;
			case "original":
			case null:
			case void 0: return this.parseArgumentGroup(optional);
			default: throw new ParseError("Unknown group type as " + name, this.fetch());
		}
	}
	/**
	* Discard any space tokens, fetching the next non-space token.
	*/
	consumeSpaces() {
		while (this.fetch().text === " ") this.consume();
	}
	/**
	* Parses a group, essentially returning the string formed by the
	* brace-enclosed tokens plus some position information.
	*/
	parseStringGroup(modeName, optional) {
		var argToken = this.gullet.scanArgument(optional);
		if (argToken == null) return null;
		var str = "";
		var nextToken;
		while ((nextToken = this.fetch()).text !== "EOF") {
			str += nextToken.text;
			this.consume();
		}
		this.consume();
		argToken.text = str;
		return argToken;
	}
	/**
	* Parses a regex-delimited group: the largest sequence of tokens
	* whose concatenated strings match `regex`. Returns the string
	* formed by the tokens plus some position information.
	*/
	parseRegexGroup(regex, modeName) {
		var firstToken = this.fetch();
		var lastToken = firstToken;
		var str = "";
		var nextToken;
		while ((nextToken = this.fetch()).text !== "EOF" && regex.test(str + nextToken.text)) {
			lastToken = nextToken;
			str += lastToken.text;
			this.consume();
		}
		if (str === "") throw new ParseError("Invalid " + modeName + ": '" + firstToken.text + "'", firstToken);
		return firstToken.range(lastToken, str);
	}
	/**
	* Parses a color description.
	*/
	parseColorGroup(optional) {
		var res = this.parseStringGroup("color", optional);
		if (res == null) return null;
		var match = /^(#[a-f0-9]{3,4}|#[a-f0-9]{6}|#[a-f0-9]{8}|[a-f0-9]{6}|[a-z]+)$/i.exec(res.text);
		if (!match) throw new ParseError("Invalid color: '" + res.text + "'", res);
		var color = match[0];
		if (/^[0-9a-f]{6}$/i.test(color)) color = "#" + color;
		return {
			type: "color-token",
			mode: this.mode,
			color
		};
	}
	/**
	* Parses a size specification, consisting of magnitude and unit.
	*/
	parseSizeGroup(optional) {
		var res;
		var isBlank = false;
		this.gullet.consumeSpaces();
		if (!optional && this.gullet.future().text !== "{") res = this.parseRegexGroup(/^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2} *$/, "size");
		else res = this.parseStringGroup("size", optional);
		if (!res) return null;
		if (!optional && res.text.length === 0) {
			res.text = "0pt";
			isBlank = true;
		}
		var match = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(res.text);
		if (!match) throw new ParseError("Invalid size: '" + res.text + "'", res);
		var data = {
			number: +(match[1] + match[2]),
			unit: match[3]
		};
		if (!validUnit(data)) throw new ParseError("Invalid unit: '" + data.unit + "'", res);
		return {
			type: "size",
			mode: this.mode,
			value: data,
			isBlank
		};
	}
	/**
	* Parses an URL, checking escaped letters and allowed protocols,
	* and setting the catcode of % as an active character (as in \hyperref).
	*/
	parseUrlGroup(optional) {
		this.gullet.lexer.setCatcode("%", 13);
		this.gullet.lexer.setCatcode("~", 12);
		var res = this.parseStringGroup("url", optional);
		this.gullet.lexer.setCatcode("%", 14);
		this.gullet.lexer.setCatcode("~", 13);
		if (res == null) return null;
		var url = res.text.replace(/\\([#$%&~_^{}])/g, "$1");
		return {
			type: "url",
			mode: this.mode,
			url
		};
	}
	/**
	* Parses an argument with the mode specified.
	*/
	parseArgumentGroup(optional, mode) {
		var argToken = this.gullet.scanArgument(optional);
		if (argToken == null) return null;
		var outerMode = this.mode;
		if (mode) this.switchMode(mode);
		this.gullet.beginGroup();
		var expression = this.parseExpression(false, "EOF");
		this.expect("EOF");
		this.gullet.endGroup();
		var result = {
			type: "ordgroup",
			mode: this.mode,
			loc: argToken.loc,
			body: expression
		};
		if (mode) this.switchMode(outerMode);
		return result;
	}
	/**
	* Parses an ordinary group, which is either a single nucleus (like "x")
	* or an expression in braces (like "{x+y}") or an implicit group, a group
	* that starts at the current position, and ends right before a higher explicit
	* group ends, or at EOF.
	*/
	parseGroup(name, breakOnTokenText) {
		var firstToken = this.fetch();
		var text = firstToken.text;
		var result;
		if (text === "{" || text === "\\begingroup") {
			this.consume();
			var groupEnd = text === "{" ? "}" : "\\endgroup";
			this.gullet.beginGroup();
			var expression = this.parseExpression(false, groupEnd);
			var lastToken = this.fetch();
			this.expect(groupEnd);
			this.gullet.endGroup();
			result = {
				type: "ordgroup",
				mode: this.mode,
				loc: SourceLocation.range(firstToken, lastToken),
				body: expression,
				semisimple: text === "\\begingroup" || void 0
			};
		} else {
			result = this.parseFunction(breakOnTokenText, name) || this.parseSymbol();
			if (result == null && text[0] === "\\" && !implicitCommands.hasOwnProperty(text)) {
				if (this.settings.throwOnError) throw new ParseError("Undefined control sequence: " + text, firstToken);
				result = this.formatUnsupportedCmd(text);
				this.consume();
			}
		}
		return result;
	}
	/**
	* Form ligature-like combinations of characters for text mode.
	* This includes inputs like "--", "---", "``" and "''".
	* The result will simply replace multiple textord nodes with a single
	* character in each value by a single textord node having multiple
	* characters in its value.  The representation is still ASCII source.
	* The group will be modified in place.
	*/
	formLigatures(group) {
		var n = group.length - 1;
		for (var i = 0; i < n; ++i) {
			var a = group[i];
			if (a.type !== "textord") continue;
			var v = a.text;
			var next = group[i + 1];
			if (!next || next.type !== "textord") continue;
			if (v === "-" && next.text === "-") {
				var afterNext = group[i + 2];
				if (i + 1 < n && afterNext && afterNext.type === "textord" && afterNext.text === "-") {
					group.splice(i, 3, {
						type: "textord",
						mode: "text",
						loc: SourceLocation.range(a, afterNext),
						text: "---"
					});
					n -= 2;
				} else {
					group.splice(i, 2, {
						type: "textord",
						mode: "text",
						loc: SourceLocation.range(a, next),
						text: "--"
					});
					n -= 1;
				}
			}
			if ((v === "'" || v === "`") && next.text === v) {
				group.splice(i, 2, {
					type: "textord",
					mode: "text",
					loc: SourceLocation.range(a, next),
					text: v + v
				});
				n -= 1;
			}
		}
	}
	/**
	* Parse a single symbol out of the string. Here, we handle single character
	* symbols and special functions like \verb.
	*/
	parseSymbol() {
		var nucleus = this.fetch();
		var text = nucleus.text;
		if (/^\\verb[^a-zA-Z]/.test(text)) {
			this.consume();
			var arg = text.slice(5);
			var star = arg.charAt(0) === "*";
			if (star) arg = arg.slice(1);
			if (arg.length < 2 || arg.charAt(0) !== arg.slice(-1)) throw new ParseError("\\verb assertion failed --\n                    please report what input caused this bug");
			arg = arg.slice(1, -1);
			return {
				type: "verb",
				mode: "text",
				body: arg,
				star
			};
		}
		if (unicodeSymbols.hasOwnProperty(text[0]) && !symbols[this.mode][text[0]]) {
			if (this.settings.strict && this.mode === "math") this.settings.reportNonstrict("unicodeTextInMathMode", "Accented Unicode text character \"" + text[0] + "\" used in math mode", nucleus);
			text = unicodeSymbols[text[0]] + text.slice(1);
		}
		var match = combiningDiacriticalMarksEndRegex.exec(text);
		if (match) {
			text = text.substring(0, match.index);
			if (text === "i") text = "ı";
			else if (text === "j") text = "ȷ";
		}
		var symbol;
		if (symbols[this.mode][text]) {
			if (this.settings.strict && this.mode === "math" && extraLatin.includes(text)) this.settings.reportNonstrict("unicodeTextInMathMode", "Latin-1/Unicode text character \"" + text[0] + "\" used in math mode", nucleus);
			var group = symbols[this.mode][text].group;
			var loc = SourceLocation.range(nucleus);
			var s;
			if (isAtom(group)) s = {
				type: "atom",
				mode: this.mode,
				family: group,
				loc,
				text
			};
			else s = {
				type: group,
				mode: this.mode,
				loc,
				text
			};
			symbol = s;
		} else if (text.charCodeAt(0) >= 128) {
			if (this.settings.strict) {
				if (!supportedCodepoint(text.charCodeAt(0))) this.settings.reportNonstrict("unknownSymbol", "Unrecognized Unicode character \"" + text[0] + "\"" + (" (" + text.charCodeAt(0) + ")"), nucleus);
				else if (this.mode === "math") this.settings.reportNonstrict("unicodeTextInMathMode", "Unicode text character \"" + text[0] + "\" used in math mode", nucleus);
			}
			symbol = {
				type: "textord",
				mode: "text",
				loc: SourceLocation.range(nucleus),
				text
			};
		} else return null;
		this.consume();
		if (match) for (var i = 0; i < match[0].length; i++) {
			var accent = match[0][i];
			if (!unicodeAccents[accent]) throw new ParseError("Unknown accent ' " + accent + "'", nucleus);
			var command = unicodeAccents[accent][this.mode] || unicodeAccents[accent].text;
			if (!command) throw new ParseError("Accent " + accent + " unsupported in " + this.mode + " mode", nucleus);
			symbol = {
				type: "accent",
				mode: this.mode,
				loc: SourceLocation.range(nucleus),
				label: command,
				isStretchy: false,
				isShifty: true,
				base: symbol
			};
		}
		return symbol;
	}
};
Parser.endOfExpression = /* @__PURE__ */ new Set([
	"}",
	"\\endgroup",
	"\\end",
	"\\right",
	"&"
]);
/**
* Provides a single function for parsing an expression using a Parser
* TODO(emily): Remove this
*/
/**
* Parses an expression using a Parser, then returns the parsed result.
*/
var parseTree = function parseTree(toParse, settings) {
	if (!(typeof toParse === "string" || toParse instanceof String)) throw new TypeError("KaTeX can only parse string typed expression");
	var parser = new Parser(toParse, settings);
	delete parser.gullet.macros.current["\\df@tag"];
	var tree = parser.parse();
	delete parser.gullet.macros.current["\\current@color"];
	delete parser.gullet.macros.current["\\color"];
	if (parser.gullet.macros.get("\\df@tag")) {
		if (!settings.displayMode) throw new ParseError("\\tag works only in display equations");
		tree = [{
			type: "tag",
			mode: "text",
			body: tree,
			tag: parser.subparse([new Token("\\df@tag")])
		}];
	}
	return tree;
};
/**
* Parse and build an expression, and place that expression in the DOM node
* given.
*/
var render = function render(expression, baseNode, options) {
	baseNode.textContent = "";
	var node = renderToDomTree(expression, options).toNode();
	baseNode.appendChild(node);
};
if (typeof document !== "undefined") {
	if (document.compatMode !== "CSS1Compat") {
		typeof console !== "undefined" && console.warn("Warning: KaTeX doesn't work in quirks mode. Make sure your website has a suitable doctype.");
		render = function render() {
			throw new ParseError("KaTeX doesn't work in quirks mode.");
		};
	}
}
/**
* Parse and build an expression, and return the markup for that.
*/
var renderToString = function renderToString(expression, options) {
	return renderToDomTree(expression, options).toMarkup();
};
/**
* Parse an expression and return the parse tree.
*/
var generateParseTree = function generateParseTree(expression, options) {
	return parseTree(expression, new Settings(options));
};
/**
* If the given error is a KaTeX ParseError and options.throwOnError is false,
* renders the invalid LaTeX as a span with hover title giving the KaTeX
* error message.  Otherwise, simply throws the error.
*/
var renderError = function renderError(error, expression, options) {
	if (options.throwOnError || !(error instanceof ParseError)) throw error;
	var node = makeSpan(["katex-error"], [new SymbolNode(expression)]);
	node.setAttribute("title", error.toString());
	node.setAttribute("style", "color:" + options.errorColor);
	return node;
};
/**
* Generates and returns the katex build tree. This is used for advanced
* use cases (like rendering to custom output).
*/
var renderToDomTree = function renderToDomTree(expression, options) {
	var settings = new Settings(options);
	try {
		return buildTree(parseTree(expression, settings), expression, settings);
	} catch (error) {
		return renderError(error, expression, settings);
	}
};
/**
* Generates and returns the katex build tree, with just HTML (no MathML).
* This is used for advanced use cases (like rendering to custom output).
*/
var renderToHTMLTree = function renderToHTMLTree(expression, options) {
	var settings = new Settings(options);
	try {
		return buildHTMLTree(parseTree(expression, settings), expression, settings);
	} catch (error) {
		return renderError(error, expression, settings);
	}
};
var version = "0.16.47";
var __domTree = {
	Span,
	Anchor,
	SymbolNode,
	SvgNode,
	PathNode,
	LineNode
};
var katex = {
	/**
	* Current KaTeX version
	*/
	version,
	/**
	* Renders the given LaTeX into an HTML+MathML combination, and adds
	* it as a child to the specified DOM node.
	*/
	render,
	/**
	* Renders the given LaTeX into an HTML+MathML combination string,
	* for sending to the client.
	*/
	renderToString,
	/**
	* KaTeX error, usually during parsing.
	*/
	ParseError,
	/**
	* The schema of Settings
	*/
	SETTINGS_SCHEMA,
	/**
	* Parses the given LaTeX into KaTeX's internal parse tree structure,
	* without rendering to HTML or MathML.
	*
	* NOTE: This method is not currently recommended for public use.
	* The internal tree representation is unstable and is very likely
	* to change. Use at your own risk.
	*/
	__parse: generateParseTree,
	/**
	* Renders the given LaTeX into an HTML+MathML internal DOM tree
	* representation, without flattening that representation to a string.
	*
	* NOTE: This method is not currently recommended for public use.
	* The internal tree representation is unstable and is very likely
	* to change. Use at your own risk.
	*/
	__renderToDomTree: renderToDomTree,
	/**
	* Renders the given LaTeX into an HTML internal DOM tree representation,
	* without MathML and without flattening that representation to a string.
	*
	* NOTE: This method is not currently recommended for public use.
	* The internal tree representation is unstable and is very likely
	* to change. Use at your own risk.
	*/
	__renderToHTMLTree: renderToHTMLTree,
	/**
	* extends internal font metrics object with a new object
	* each key in the new object represents a font name
	*/
	__setFontMetrics: setFontMetrics,
	/**
	* adds a new symbol to builtin symbols table
	*/
	__defineSymbol: defineSymbol,
	/**
	* adds a new function to builtin function list,
	* which directly produce parse tree elements
	* and have their own html/mathml builders
	*/
	__defineFunction: defineFunction,
	/**
	* adds a new macro to builtin macro list
	*/
	__defineMacro: defineMacro,
	/**
	* Expose the dom tree node types, which can be useful for type checking nodes.
	*
	* NOTE: These methods are not currently recommended for public use.
	* The internal tree representation is unstable and is very likely
	* to change. Use at your own risk.
	*/
	__domTree
};
//#endregion
//#region node_modules/rehype-katex/lib/index.js
/**
* @import {ElementContent, Root} from 'hast'
* @import {KatexOptions} from 'katex'
* @import {VFile} from 'vfile'
*/
/**
* @typedef {Omit<KatexOptions, 'displayMode' | 'throwOnError'>} Options
*/
/** @type {Readonly<Options>} */
var emptyOptions$1 = {};
/** @type {ReadonlyArray<unknown>} */
var emptyClasses = [];
/**
* Render elements with a `language-math` (or `math-display`, `math-inline`)
* class with KaTeX.
*
* @param {Readonly<Options> | null | undefined} [options]
*   Configuration (optional).
* @returns
*   Transform.
*/
function rehypeKatex(options) {
	const settings = options || emptyOptions$1;
	/**
	* Transform.
	*
	* @param {Root} tree
	*   Tree.
	* @param {VFile} file
	*   File.
	* @returns {undefined}
	*   Nothing.
	*/
	return function(tree, file) {
		visitParents(tree, "element", function(element, parents) {
			const classes = Array.isArray(element.properties.className) ? element.properties.className : emptyClasses;
			const languageMath = classes.includes("language-math");
			const mathDisplay = classes.includes("math-display");
			const mathInline = classes.includes("math-inline");
			let displayMode = mathDisplay;
			if (!languageMath && !mathDisplay && !mathInline) return;
			let parent = parents[parents.length - 1];
			let scope = element;
			if (element.tagName === "code" && languageMath && parent && parent.type === "element" && parent.tagName === "pre") {
				scope = parent;
				parent = parents[parents.length - 2];
				displayMode = true;
			}
			/* c8 ignore next -- verbose to test. */
			if (!parent) return;
			const value = toText(scope, { whitespace: "pre" });
			/** @type {Array<ElementContent> | string | undefined} */
			let result;
			try {
				result = katex.renderToString(value, {
					...settings,
					displayMode,
					throwOnError: true
				});
			} catch (error) {
				const cause = error;
				const ruleId = cause.name.toLowerCase();
				file.message("Could not render math with KaTeX", {
					ancestors: [...parents, element],
					cause,
					place: element.position,
					ruleId,
					source: "rehype-katex"
				});
				try {
					result = katex.renderToString(value, {
						...settings,
						displayMode,
						strict: "ignore",
						throwOnError: false
					});
				} catch {
					result = [{
						type: "element",
						tagName: "span",
						properties: {
							className: ["katex-error"],
							style: "color:" + (settings.errorColor || "#cc0000"),
							title: String(error)
						},
						children: [{
							type: "text",
							value
						}]
					}];
				}
			}
			if (typeof result === "string") result = fromHtmlIsomorphic(result, { fragment: true }).children;
			const index = parent.children.indexOf(scope);
			parent.children.splice(index, 1, ...result);
			return SKIP;
		});
	};
}
//#endregion
//#region node_modules/longest-streak/index.js
/**
* Get the count of the longest repeating streak of `substring` in `value`.
*
* @param {string} value
*   Content to search in.
* @param {string} substring
*   Substring to look for, typically one character.
* @returns {number}
*   Count of most frequent adjacent `substring`s in `value`.
*/
function longestStreak(value, substring) {
	const source = String(value);
	let index = source.indexOf(substring);
	let expected = index;
	let count = 0;
	let max = 0;
	if (typeof substring !== "string") throw new TypeError("Expected substring");
	while (index !== -1) {
		if (index === expected) {
			if (++count > max) max = count;
		} else count = 1;
		expected = index + substring.length;
		index = source.indexOf(substring, expected);
	}
	return max;
}
//#endregion
//#region node_modules/mdast-util-math/lib/index.js
/**
* @typedef {import('hast').Element} HastElement
* @typedef {import('hast').ElementContent} HastElementContent
* @typedef {import('mdast-util-from-markdown').CompileContext} CompileContext
* @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
* @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
* @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
* @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
* @typedef {import('../index.js').InlineMath} InlineMath
* @typedef {import('../index.js').Math} Math
*
* @typedef ToOptions
*   Configuration.
* @property {boolean | null | undefined} [singleDollarTextMath=true]
*   Whether to support math (text) with a single dollar (default: `true`).
*
*   Single dollars work in Pandoc and many other places, but often interfere
*   with “normal” dollars in text.
*   If you turn this off, you can still use two or more dollars for text math.
*/
/**
* Create an extension for `mdast-util-from-markdown`.
*
* @returns {FromMarkdownExtension}
*   Extension for `mdast-util-from-markdown`.
*/
function mathFromMarkdown() {
	return {
		enter: {
			mathFlow: enterMathFlow,
			mathFlowFenceMeta: enterMathFlowMeta,
			mathText: enterMathText
		},
		exit: {
			mathFlow: exitMathFlow,
			mathFlowFence: exitMathFlowFence,
			mathFlowFenceMeta: exitMathFlowMeta,
			mathFlowValue: exitMathData,
			mathText: exitMathText,
			mathTextData: exitMathData
		}
	};
	/**
	* @this {CompileContext}
	* @type {FromMarkdownHandle}
	*/
	function enterMathFlow(token) {
		this.enter({
			type: "math",
			meta: null,
			value: "",
			data: {
				hName: "pre",
				hChildren: [{
					type: "element",
					tagName: "code",
					properties: { className: ["language-math", "math-display"] },
					children: []
				}]
			}
		}, token);
	}
	/**
	* @this {CompileContext}
	* @type {FromMarkdownHandle}
	*/
	function enterMathFlowMeta() {
		this.buffer();
	}
	/**
	* @this {CompileContext}
	* @type {FromMarkdownHandle}
	*/
	function exitMathFlowMeta() {
		const data = this.resume();
		const node = this.stack[this.stack.length - 1];
		node.type;
		node.meta = data;
	}
	/**
	* @this {CompileContext}
	* @type {FromMarkdownHandle}
	*/
	function exitMathFlowFence() {
		if (this.data.mathFlowInside) return;
		this.buffer();
		this.data.mathFlowInside = true;
	}
	/**
	* @this {CompileContext}
	* @type {FromMarkdownHandle}
	*/
	function exitMathFlow(token) {
		const data = this.resume().replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, "");
		const node = this.stack[this.stack.length - 1];
		node.type;
		this.exit(token);
		node.value = data;
		const code = node.data.hChildren[0];
		code.type;
		code.tagName;
		code.children.push({
			type: "text",
			value: data
		});
		this.data.mathFlowInside = void 0;
	}
	/**
	* @this {CompileContext}
	* @type {FromMarkdownHandle}
	*/
	function enterMathText(token) {
		this.enter({
			type: "inlineMath",
			value: "",
			data: {
				hName: "code",
				hProperties: { className: ["language-math", "math-inline"] },
				hChildren: []
			}
		}, token);
		this.buffer();
	}
	/**
	* @this {CompileContext}
	* @type {FromMarkdownHandle}
	*/
	function exitMathText(token) {
		const data = this.resume();
		const node = this.stack[this.stack.length - 1];
		node.type;
		this.exit(token);
		node.value = data;
		node.data.hChildren.push({
			type: "text",
			value: data
		});
	}
	/**
	* @this {CompileContext}
	* @type {FromMarkdownHandle}
	*/
	function exitMathData(token) {
		this.config.enter.data.call(this, token);
		this.config.exit.data.call(this, token);
	}
}
/**
* Create an extension for `mdast-util-to-markdown`.
*
* @param {ToOptions | null | undefined} [options]
*   Configuration (optional).
* @returns {ToMarkdownExtension}
*   Extension for `mdast-util-to-markdown`.
*/
function mathToMarkdown(options) {
	let single = (options || {}).singleDollarTextMath;
	if (single === null || single === void 0) single = true;
	inlineMath.peek = inlineMathPeek;
	return {
		unsafe: [
			{
				character: "\r",
				inConstruct: "mathFlowMeta"
			},
			{
				character: "\n",
				inConstruct: "mathFlowMeta"
			},
			{
				character: "$",
				after: single ? void 0 : "\\$",
				inConstruct: "phrasing"
			},
			{
				character: "$",
				inConstruct: "mathFlowMeta"
			},
			{
				atBreak: true,
				character: "$",
				after: "\\$"
			}
		],
		handlers: {
			math,
			inlineMath
		}
	};
	/**
	* @type {ToMarkdownHandle}
	* @param {Math} node
	*/
	function math(node, _, state, info) {
		const raw = node.value || "";
		const tracker = state.createTracker(info);
		const sequence = "$".repeat(Math.max(longestStreak(raw, "$") + 1, 2));
		const exit = state.enter("mathFlow");
		let value = tracker.move(sequence);
		if (node.meta) {
			const subexit = state.enter("mathFlowMeta");
			value += tracker.move(state.safe(node.meta, {
				after: "\n",
				before: value,
				encode: ["$"],
				...tracker.current()
			}));
			subexit();
		}
		value += tracker.move("\n");
		if (raw) value += tracker.move(raw + "\n");
		value += tracker.move(sequence);
		exit();
		return value;
	}
	/**
	* @type {ToMarkdownHandle}
	* @param {InlineMath} node
	*/
	function inlineMath(node, _, state) {
		let value = node.value || "";
		let size = 1;
		if (!single) size++;
		while (new RegExp("(^|[^$])" + "\\$".repeat(size) + "([^$]|$)").test(value)) size++;
		const sequence = "$".repeat(size);
		if (/[^ \r\n]/.test(value) && (/^[ \r\n]/.test(value) && /[ \r\n]$/.test(value) || /^\$|\$$/.test(value))) value = " " + value + " ";
		let index = -1;
		while (++index < state.unsafe.length) {
			const pattern = state.unsafe[index];
			if (!pattern.atBreak) continue;
			const expression = state.compilePattern(pattern);
			/** @type {RegExpExecArray | null} */
			let match;
			while (match = expression.exec(value)) {
				let position = match.index;
				if (value.codePointAt(position) === 10 && value.codePointAt(position - 1) === 13) position--;
				value = value.slice(0, position) + " " + value.slice(match.index + 1);
			}
		}
		return sequence + value + sequence;
	}
	/**
	* @returns {string}
	*/
	function inlineMathPeek() {
		return "$";
	}
}
//#endregion
//#region node_modules/micromark-factory-space/index.js
/**
* @import {Effects, State, TokenType} from 'micromark-util-types'
*/
/**
* Parse spaces and tabs.
*
* There is no `nok` parameter:
*
* *   spaces in markdown are often optional, in which case this factory can be
*     used and `ok` will be switched to whether spaces were found or not
* *   one line ending or space can be detected with `markdownSpace(code)` right
*     before using `factorySpace`
*
* ###### Examples
*
* Where `␉` represents a tab (plus how much it expands) and `␠` represents a
* single space.
*
* ```markdown
* ␉
* ␠␠␠␠
* ␉␠
* ```
*
* @param {Effects} effects
*   Context.
* @param {State} ok
*   State switched to when successful.
* @param {TokenType} type
*   Type (`' \t'`).
* @param {number | undefined} [max=Infinity]
*   Max (exclusive).
* @returns {State}
*   Start state.
*/
function factorySpace(effects, ok, type, max) {
	const limit = max ? max - 1 : Number.POSITIVE_INFINITY;
	let size = 0;
	return start;
	/** @type {State} */
	function start(code) {
		if (markdownSpace(code)) {
			effects.enter(type);
			return prefix(code);
		}
		return ok(code);
	}
	/** @type {State} */
	function prefix(code) {
		if (markdownSpace(code) && size++ < limit) {
			effects.consume(code);
			return prefix;
		}
		effects.exit(type);
		return ok(code);
	}
}
//#endregion
//#region node_modules/micromark-extension-math/lib/math-flow.js
/**
* @import {Construct, State, TokenizeContext, Tokenizer} from 'micromark-util-types'
*/
/** @type {Construct} */
var mathFlow = {
	tokenize: tokenizeMathFenced,
	concrete: true,
	name: "mathFlow"
};
/** @type {Construct} */
var nonLazyContinuation = {
	tokenize: tokenizeNonLazyContinuation,
	partial: true
};
/**
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeMathFenced(effects, ok, nok) {
	const self = this;
	const tail = self.events[self.events.length - 1];
	const initialSize = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
	let sizeOpen = 0;
	return start;
	/**
	* Start of math.
	*
	* ```markdown
	* > | $$
	*     ^
	*   | \frac{1}{2}
	*   | $$
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		effects.enter("mathFlow");
		effects.enter("mathFlowFence");
		effects.enter("mathFlowFenceSequence");
		return sequenceOpen(code);
	}
	/**
	* In opening fence sequence.
	*
	* ```markdown
	* > | $$
	*      ^
	*   | \frac{1}{2}
	*   | $$
	* ```
	*
	* @type {State}
	*/
	function sequenceOpen(code) {
		if (code === 36) {
			effects.consume(code);
			sizeOpen++;
			return sequenceOpen;
		}
		if (sizeOpen < 2) return nok(code);
		effects.exit("mathFlowFenceSequence");
		return factorySpace(effects, metaBefore, "whitespace")(code);
	}
	/**
	* In opening fence, before meta.
	*
	* ```markdown
	* > | $$asciimath
	*       ^
	*   | x < y
	*   | $$
	* ```
	*
	* @type {State}
	*/
	function metaBefore(code) {
		if (code === null || markdownLineEnding(code)) return metaAfter(code);
		effects.enter("mathFlowFenceMeta");
		effects.enter("chunkString", { contentType: "string" });
		return meta(code);
	}
	/**
	* In meta.
	*
	* ```markdown
	* > | $$asciimath
	*        ^
	*   | x < y
	*   | $$
	* ```
	*
	* @type {State}
	*/
	function meta(code) {
		if (code === null || markdownLineEnding(code)) {
			effects.exit("chunkString");
			effects.exit("mathFlowFenceMeta");
			return metaAfter(code);
		}
		if (code === 36) return nok(code);
		effects.consume(code);
		return meta;
	}
	/**
	* After meta.
	*
	* ```markdown
	* > | $$
	*       ^
	*   | \frac{1}{2}
	*   | $$
	* ```
	*
	* @type {State}
	*/
	function metaAfter(code) {
		effects.exit("mathFlowFence");
		if (self.interrupt) return ok(code);
		return effects.attempt(nonLazyContinuation, beforeNonLazyContinuation, after)(code);
	}
	/**
	* After eol/eof in math, at a non-lazy closing fence or content.
	*
	* ```markdown
	*   | $$
	* > | \frac{1}{2}
	*     ^
	* > | $$
	*     ^
	* ```
	*
	* @type {State}
	*/
	function beforeNonLazyContinuation(code) {
		return effects.attempt({
			tokenize: tokenizeClosingFence,
			partial: true
		}, after, contentStart)(code);
	}
	/**
	* Before math content, definitely not before a closing fence.
	*
	* ```markdown
	*   | $$
	* > | \frac{1}{2}
	*     ^
	*   | $$
	* ```
	*
	* @type {State}
	*/
	function contentStart(code) {
		return (initialSize ? factorySpace(effects, beforeContentChunk, "linePrefix", initialSize + 1) : beforeContentChunk)(code);
	}
	/**
	* Before math content, after optional prefix.
	*
	* ```markdown
	*   | $$
	* > | \frac{1}{2}
	*     ^
	*   | $$
	* ```
	*
	* @type {State}
	*/
	function beforeContentChunk(code) {
		if (code === null) return after(code);
		if (markdownLineEnding(code)) return effects.attempt(nonLazyContinuation, beforeNonLazyContinuation, after)(code);
		effects.enter("mathFlowValue");
		return contentChunk(code);
	}
	/**
	* In math content.
	*
	* ```markdown
	*   | $$
	* > | \frac{1}{2}
	*      ^
	*   | $$
	* ```
	*
	* @type {State}
	*/
	function contentChunk(code) {
		if (code === null || markdownLineEnding(code)) {
			effects.exit("mathFlowValue");
			return beforeContentChunk(code);
		}
		effects.consume(code);
		return contentChunk;
	}
	/**
	* After math (ha!).
	*
	* ```markdown
	*   | $$
	*   | \frac{1}{2}
	* > | $$
	*       ^
	* ```
	*
	* @type {State}
	*/
	function after(code) {
		effects.exit("mathFlow");
		return ok(code);
	}
	/** @type {Tokenizer} */
	function tokenizeClosingFence(effects, ok, nok) {
		let size = 0;
		/**
		* Before closing fence, at optional whitespace.
		*
		* ```markdown
		*   | $$
		*   | \frac{1}{2}
		* > | $$
		*     ^
		* ```
		*/
		return factorySpace(effects, beforeSequenceClose, "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
		/**
		* In closing fence, after optional whitespace, at sequence.
		*
		* ```markdown
		*   | $$
		*   | \frac{1}{2}
		* > | $$
		*     ^
		* ```
		*
		* @type {State}
		*/
		function beforeSequenceClose(code) {
			effects.enter("mathFlowFence");
			effects.enter("mathFlowFenceSequence");
			return sequenceClose(code);
		}
		/**
		* In closing fence sequence.
		*
		* ```markdown
		*   | $$
		*   | \frac{1}{2}
		* > | $$
		*      ^
		* ```
		*
		* @type {State}
		*/
		function sequenceClose(code) {
			if (code === 36) {
				size++;
				effects.consume(code);
				return sequenceClose;
			}
			if (size < sizeOpen) return nok(code);
			effects.exit("mathFlowFenceSequence");
			return factorySpace(effects, afterSequenceClose, "whitespace")(code);
		}
		/**
		* After closing fence sequence, after optional whitespace.
		*
		* ```markdown
		*   | $$
		*   | \frac{1}{2}
		* > | $$
		*       ^
		* ```
		*
		* @type {State}
		*/
		function afterSequenceClose(code) {
			if (code === null || markdownLineEnding(code)) {
				effects.exit("mathFlowFence");
				return ok(code);
			}
			return nok(code);
		}
	}
}
/**
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeNonLazyContinuation(effects, ok, nok) {
	const self = this;
	return start;
	/** @type {State} */
	function start(code) {
		if (code === null) return ok(code);
		effects.enter("lineEnding");
		effects.consume(code);
		effects.exit("lineEnding");
		return lineStart;
	}
	/** @type {State} */
	function lineStart(code) {
		return self.parser.lazy[self.now().line] ? nok(code) : ok(code);
	}
}
//#endregion
//#region node_modules/micromark-extension-math/lib/math-text.js
/**
* @import {Options} from 'micromark-extension-math'
* @import {Construct, Previous, Resolver, State, Token, TokenizeContext, Tokenizer} from 'micromark-util-types'
*/
/**
* @param {Options | null | undefined} [options={}]
*   Configuration (default: `{}`).
* @returns {Construct}
*   Construct.
*/
function mathText(options) {
	let single = (options || {}).singleDollarTextMath;
	if (single === null || single === void 0) single = true;
	return {
		tokenize: tokenizeMathText,
		resolve: resolveMathText,
		previous,
		name: "mathText"
	};
	/**
	* @this {TokenizeContext}
	* @type {Tokenizer}
	*/
	function tokenizeMathText(effects, ok, nok) {
		let sizeOpen = 0;
		/** @type {number} */
		let size;
		/** @type {Token} */
		let token;
		return start;
		/**
		* Start of math (text).
		*
		* ```markdown
		* > | $a$
		*     ^
		* > | \$a$
		*      ^
		* ```
		*
		* @type {State}
		*/
		function start(code) {
			effects.enter("mathText");
			effects.enter("mathTextSequence");
			return sequenceOpen(code);
		}
		/**
		* In opening sequence.
		*
		* ```markdown
		* > | $a$
		*     ^
		* ```
		*
		* @type {State}
		*/
		function sequenceOpen(code) {
			if (code === 36) {
				effects.consume(code);
				sizeOpen++;
				return sequenceOpen;
			}
			if (sizeOpen < 2 && !single) return nok(code);
			effects.exit("mathTextSequence");
			return between(code);
		}
		/**
		* Between something and something else.
		*
		* ```markdown
		* > | $a$
		*      ^^
		* ```
		*
		* @type {State}
		*/
		function between(code) {
			if (code === null) return nok(code);
			if (code === 36) {
				token = effects.enter("mathTextSequence");
				size = 0;
				return sequenceClose(code);
			}
			if (code === 32) {
				effects.enter("space");
				effects.consume(code);
				effects.exit("space");
				return between;
			}
			if (markdownLineEnding(code)) {
				effects.enter("lineEnding");
				effects.consume(code);
				effects.exit("lineEnding");
				return between;
			}
			effects.enter("mathTextData");
			return data(code);
		}
		/**
		* In data.
		*
		* ```markdown
		* > | $a$
		*      ^
		* ```
		*
		* @type {State}
		*/
		function data(code) {
			if (code === null || code === 32 || code === 36 || markdownLineEnding(code)) {
				effects.exit("mathTextData");
				return between(code);
			}
			effects.consume(code);
			return data;
		}
		/**
		* In closing sequence.
		*
		* ```markdown
		* > | `a`
		*       ^
		* ```
		*
		* @type {State}
		*/
		function sequenceClose(code) {
			if (code === 36) {
				effects.consume(code);
				size++;
				return sequenceClose;
			}
			if (size === sizeOpen) {
				effects.exit("mathTextSequence");
				effects.exit("mathText");
				return ok(code);
			}
			token.type = "mathTextData";
			return data(code);
		}
	}
}
/** @type {Resolver} */
function resolveMathText(events) {
	let tailExitIndex = events.length - 4;
	let headEnterIndex = 3;
	/** @type {number} */
	let index;
	/** @type {number | undefined} */
	let enter;
	if ((events[headEnterIndex][1].type === "lineEnding" || events[headEnterIndex][1].type === "space") && (events[tailExitIndex][1].type === "lineEnding" || events[tailExitIndex][1].type === "space")) {
		index = headEnterIndex;
		while (++index < tailExitIndex) if (events[index][1].type === "mathTextData") {
			events[tailExitIndex][1].type = "mathTextPadding";
			events[headEnterIndex][1].type = "mathTextPadding";
			headEnterIndex += 2;
			tailExitIndex -= 2;
			break;
		}
	}
	index = headEnterIndex - 1;
	tailExitIndex++;
	while (++index <= tailExitIndex) if (enter === void 0) {
		if (index !== tailExitIndex && events[index][1].type !== "lineEnding") enter = index;
	} else if (index === tailExitIndex || events[index][1].type === "lineEnding") {
		events[enter][1].type = "mathTextData";
		if (index !== enter + 2) {
			events[enter][1].end = events[index - 1][1].end;
			events.splice(enter + 2, index - enter - 2);
			tailExitIndex -= index - enter - 2;
			index = enter + 2;
		}
		enter = void 0;
	}
	return events;
}
/**
* @this {TokenizeContext}
* @type {Previous}
*/
function previous(code) {
	return code !== 36 || this.events[this.events.length - 1][1].type === "characterEscape";
}
//#endregion
//#region node_modules/micromark-extension-math/lib/syntax.js
/**
* @import {Options} from 'micromark-extension-math'
* @import {Extension} from 'micromark-util-types'
*/
/**
* Create an extension for `micromark` to enable math syntax.
*
* @param {Options | null | undefined} [options={}]
*   Configuration (default: `{}`).
* @returns {Extension}
*   Extension for `micromark` that can be passed in `extensions`, to
*   enable math syntax.
*/
function math(options) {
	return {
		flow: { [36]: mathFlow },
		text: { [36]: mathText(options) }
	};
}
//#endregion
//#region node_modules/remark-math/lib/index.js
/**
* @typedef {import('mdast').Root} Root
* @typedef {import('mdast-util-math').ToOptions} Options
* @typedef {import('unified').Processor<Root>} Processor
*/
/** @type {Readonly<Options>} */
var emptyOptions = {};
/**
* Add support for math.
*
* @param {Readonly<Options> | null | undefined} [options]
*   Configuration (optional).
* @returns {undefined}
*   Nothing.
*/
function remarkMath(options) {
	const self = this;
	const settings = options || emptyOptions;
	const data = self.data();
	const micromarkExtensions = data.micromarkExtensions || (data.micromarkExtensions = []);
	const fromMarkdownExtensions = data.fromMarkdownExtensions || (data.fromMarkdownExtensions = []);
	const toMarkdownExtensions = data.toMarkdownExtensions || (data.toMarkdownExtensions = []);
	micromarkExtensions.push(math(settings));
	fromMarkdownExtensions.push(mathFromMarkdown());
	toMarkdownExtensions.push(mathToMarkdown(settings));
}
//#endregion
//#region node_modules/@streamdown/math/dist/index.js
function g(e = {}) {
	var t, r;
	return {
		name: "katex",
		type: "math",
		remarkPlugin: [remarkMath, { singleDollarTextMath: (t = e.singleDollarTextMath) != null ? t : false }],
		rehypePlugin: [rehypeKatex, { errorColor: (r = e.errorColor) != null ? r : "var(--color-muted-foreground)" }],
		getStyles() {
			return "katex/dist/katex.min.css";
		}
	};
}
var h = g();
//#endregion
export { VFile as a, Parser$1 as c, TokenType as d, fromParse5 as f, katex_exports as i, TokenizerMode as l, factorySpace as n, VFileMessage as o, webNamespaces as p, longestStreak as r, stringifyPosition as s, h as t, getTagID as u };
