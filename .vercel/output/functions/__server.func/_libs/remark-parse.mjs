import { t as fromMarkdown } from "./mdast-util-from-markdown+[...].mjs";
//#region node_modules/remark-parse/lib/index.js
/**
* @typedef {import('mdast').Root} Root
* @typedef {import('mdast-util-from-markdown').Options} FromMarkdownOptions
* @typedef {import('unified').Parser<Root>} Parser
* @typedef {import('unified').Processor<Root>} Processor
*/
/**
* @typedef {Omit<FromMarkdownOptions, 'extensions' | 'mdastExtensions'>} Options
*/
/**
* Aadd support for parsing from markdown.
*
* @param {Readonly<Options> | null | undefined} [options]
*   Configuration (optional).
* @returns {undefined}
*   Nothing.
*/
function remarkParse(options) {
	/** @type {Processor} */
	const self = this;
	self.parser = parser;
	/**
	* @type {Parser}
	*/
	function parser(doc) {
		return fromMarkdown(doc, {
			...self.data("settings"),
			...options,
			extensions: self.data("micromarkExtensions") || [],
			mdastExtensions: self.data("fromMarkdownExtensions") || []
		});
	}
}
//#endregion
export { remarkParse as t };
