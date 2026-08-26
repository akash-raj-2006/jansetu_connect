//#region node_modules/micromark-util-symbol/lib/codes.js
/**
* Character codes.
*
* This module is compiled away!
*
* micromark works based on character codes.
* This module contains constants for the ASCII block and the replacement
* character.
* A couple of them are handled in a special way, such as the line endings
* (CR, LF, and CR+LF, commonly known as end-of-line: EOLs), the tab (horizontal
* tab) and its expansion based on what column it’s at (virtual space),
* and the end-of-file (eof) character.
* As values are preprocessed before handling them, the actual characters LF,
* CR, HT, and NUL (which is present as the replacement character), are
* guaranteed to not exist.
*
* Unicode basic latin block.
*/
var codes = {
	carriageReturn: -5,
	lineFeed: -4,
	carriageReturnLineFeed: -3,
	horizontalTab: -2,
	virtualSpace: -1,
	eof: null,
	nul: 0,
	soh: 1,
	stx: 2,
	etx: 3,
	eot: 4,
	enq: 5,
	ack: 6,
	bel: 7,
	bs: 8,
	ht: 9,
	lf: 10,
	vt: 11,
	ff: 12,
	cr: 13,
	so: 14,
	si: 15,
	dle: 16,
	dc1: 17,
	dc2: 18,
	dc3: 19,
	dc4: 20,
	nak: 21,
	syn: 22,
	etb: 23,
	can: 24,
	em: 25,
	sub: 26,
	esc: 27,
	fs: 28,
	gs: 29,
	rs: 30,
	us: 31,
	space: 32,
	exclamationMark: 33,
	quotationMark: 34,
	numberSign: 35,
	dollarSign: 36,
	percentSign: 37,
	ampersand: 38,
	apostrophe: 39,
	leftParenthesis: 40,
	rightParenthesis: 41,
	asterisk: 42,
	plusSign: 43,
	comma: 44,
	dash: 45,
	dot: 46,
	slash: 47,
	digit0: 48,
	digit1: 49,
	digit2: 50,
	digit3: 51,
	digit4: 52,
	digit5: 53,
	digit6: 54,
	digit7: 55,
	digit8: 56,
	digit9: 57,
	colon: 58,
	semicolon: 59,
	lessThan: 60,
	equalsTo: 61,
	greaterThan: 62,
	questionMark: 63,
	atSign: 64,
	uppercaseA: 65,
	uppercaseB: 66,
	uppercaseC: 67,
	uppercaseD: 68,
	uppercaseE: 69,
	uppercaseF: 70,
	uppercaseG: 71,
	uppercaseH: 72,
	uppercaseI: 73,
	uppercaseJ: 74,
	uppercaseK: 75,
	uppercaseL: 76,
	uppercaseM: 77,
	uppercaseN: 78,
	uppercaseO: 79,
	uppercaseP: 80,
	uppercaseQ: 81,
	uppercaseR: 82,
	uppercaseS: 83,
	uppercaseT: 84,
	uppercaseU: 85,
	uppercaseV: 86,
	uppercaseW: 87,
	uppercaseX: 88,
	uppercaseY: 89,
	uppercaseZ: 90,
	leftSquareBracket: 91,
	backslash: 92,
	rightSquareBracket: 93,
	caret: 94,
	underscore: 95,
	graveAccent: 96,
	lowercaseA: 97,
	lowercaseB: 98,
	lowercaseC: 99,
	lowercaseD: 100,
	lowercaseE: 101,
	lowercaseF: 102,
	lowercaseG: 103,
	lowercaseH: 104,
	lowercaseI: 105,
	lowercaseJ: 106,
	lowercaseK: 107,
	lowercaseL: 108,
	lowercaseM: 109,
	lowercaseN: 110,
	lowercaseO: 111,
	lowercaseP: 112,
	lowercaseQ: 113,
	lowercaseR: 114,
	lowercaseS: 115,
	lowercaseT: 116,
	lowercaseU: 117,
	lowercaseV: 118,
	lowercaseW: 119,
	lowercaseX: 120,
	lowercaseY: 121,
	lowercaseZ: 122,
	leftCurlyBrace: 123,
	verticalBar: 124,
	rightCurlyBrace: 125,
	tilde: 126,
	del: 127,
	byteOrderMarker: 65279,
	replacementCharacter: 65533
};
//#endregion
//#region node_modules/micromark-util-symbol/lib/constants.js
/**
* This module is compiled away!
*
* Parsing markdown comes with a couple of constants, such as minimum or maximum
* sizes of certain sequences.
* Additionally, there are a couple symbols used inside micromark.
* These are all defined here, but compiled away by scripts.
*/
var constants = {
	attentionSideAfter: 2,
	attentionSideBefore: 1,
	atxHeadingOpeningFenceSizeMax: 6,
	autolinkDomainSizeMax: 63,
	autolinkSchemeSizeMax: 32,
	cdataOpeningString: "CDATA[",
	characterGroupPunctuation: 2,
	characterGroupWhitespace: 1,
	characterReferenceDecimalSizeMax: 7,
	characterReferenceHexadecimalSizeMax: 6,
	characterReferenceNamedSizeMax: 31,
	codeFencedSequenceSizeMin: 3,
	contentTypeContent: "content",
	contentTypeDocument: "document",
	contentTypeFlow: "flow",
	contentTypeString: "string",
	contentTypeText: "text",
	hardBreakPrefixSizeMin: 2,
	htmlBasic: 6,
	htmlCdata: 5,
	htmlComment: 2,
	htmlComplete: 7,
	htmlDeclaration: 4,
	htmlInstruction: 3,
	htmlRawSizeMax: 8,
	htmlRaw: 1,
	linkResourceDestinationBalanceMax: 32,
	linkReferenceSizeMax: 999,
	listItemValueSizeMax: 10,
	numericBaseDecimal: 10,
	numericBaseHexadecimal: 16,
	tabSize: 4,
	thematicBreakMarkerCountMin: 3,
	v8MaxSafeChunkSize: 1e4
};
//#endregion
//#region node_modules/micromark-util-symbol/lib/types.js
/**
* This module is compiled away!
*
* Here is the list of all types of tokens exposed by micromark, with a short
* explanation of what they include and where they are found.
* In picking names, generally, the rule is to be as explicit as possible
* instead of reusing names.
* For example, there is a `definitionDestination` and a `resourceDestination`,
* instead of one shared name.
*/
var types = {
	data: "data",
	whitespace: "whitespace",
	lineEnding: "lineEnding",
	lineEndingBlank: "lineEndingBlank",
	linePrefix: "linePrefix",
	lineSuffix: "lineSuffix",
	atxHeading: "atxHeading",
	atxHeadingSequence: "atxHeadingSequence",
	atxHeadingText: "atxHeadingText",
	autolink: "autolink",
	autolinkEmail: "autolinkEmail",
	autolinkMarker: "autolinkMarker",
	autolinkProtocol: "autolinkProtocol",
	characterEscape: "characterEscape",
	characterEscapeValue: "characterEscapeValue",
	characterReference: "characterReference",
	characterReferenceMarker: "characterReferenceMarker",
	characterReferenceMarkerNumeric: "characterReferenceMarkerNumeric",
	characterReferenceMarkerHexadecimal: "characterReferenceMarkerHexadecimal",
	characterReferenceValue: "characterReferenceValue",
	codeFenced: "codeFenced",
	codeFencedFence: "codeFencedFence",
	codeFencedFenceSequence: "codeFencedFenceSequence",
	codeFencedFenceInfo: "codeFencedFenceInfo",
	codeFencedFenceMeta: "codeFencedFenceMeta",
	codeFlowValue: "codeFlowValue",
	codeIndented: "codeIndented",
	codeText: "codeText",
	codeTextData: "codeTextData",
	codeTextPadding: "codeTextPadding",
	codeTextSequence: "codeTextSequence",
	content: "content",
	definition: "definition",
	definitionDestination: "definitionDestination",
	definitionDestinationLiteral: "definitionDestinationLiteral",
	definitionDestinationLiteralMarker: "definitionDestinationLiteralMarker",
	definitionDestinationRaw: "definitionDestinationRaw",
	definitionDestinationString: "definitionDestinationString",
	definitionLabel: "definitionLabel",
	definitionLabelMarker: "definitionLabelMarker",
	definitionLabelString: "definitionLabelString",
	definitionMarker: "definitionMarker",
	definitionTitle: "definitionTitle",
	definitionTitleMarker: "definitionTitleMarker",
	definitionTitleString: "definitionTitleString",
	emphasis: "emphasis",
	emphasisSequence: "emphasisSequence",
	emphasisText: "emphasisText",
	escapeMarker: "escapeMarker",
	hardBreakEscape: "hardBreakEscape",
	hardBreakTrailing: "hardBreakTrailing",
	htmlFlow: "htmlFlow",
	htmlFlowData: "htmlFlowData",
	htmlText: "htmlText",
	htmlTextData: "htmlTextData",
	image: "image",
	label: "label",
	labelText: "labelText",
	labelLink: "labelLink",
	labelImage: "labelImage",
	labelMarker: "labelMarker",
	labelImageMarker: "labelImageMarker",
	labelEnd: "labelEnd",
	link: "link",
	paragraph: "paragraph",
	reference: "reference",
	referenceMarker: "referenceMarker",
	referenceString: "referenceString",
	resource: "resource",
	resourceDestination: "resourceDestination",
	resourceDestinationLiteral: "resourceDestinationLiteral",
	resourceDestinationLiteralMarker: "resourceDestinationLiteralMarker",
	resourceDestinationRaw: "resourceDestinationRaw",
	resourceDestinationString: "resourceDestinationString",
	resourceMarker: "resourceMarker",
	resourceTitle: "resourceTitle",
	resourceTitleMarker: "resourceTitleMarker",
	resourceTitleString: "resourceTitleString",
	setextHeading: "setextHeading",
	setextHeadingText: "setextHeadingText",
	setextHeadingLine: "setextHeadingLine",
	setextHeadingLineSequence: "setextHeadingLineSequence",
	strong: "strong",
	strongSequence: "strongSequence",
	strongText: "strongText",
	thematicBreak: "thematicBreak",
	thematicBreakSequence: "thematicBreakSequence",
	blockQuote: "blockQuote",
	blockQuotePrefix: "blockQuotePrefix",
	blockQuoteMarker: "blockQuoteMarker",
	blockQuotePrefixWhitespace: "blockQuotePrefixWhitespace",
	listOrdered: "listOrdered",
	listUnordered: "listUnordered",
	listItemIndent: "listItemIndent",
	listItemMarker: "listItemMarker",
	listItemPrefix: "listItemPrefix",
	listItemPrefixWhitespace: "listItemPrefixWhitespace",
	listItemValue: "listItemValue",
	chunkDocument: "chunkDocument",
	chunkContent: "chunkContent",
	chunkFlow: "chunkFlow",
	chunkText: "chunkText",
	chunkString: "chunkString"
};
//#endregion
//#region node_modules/devlop/lib/default.js
function ok$1() {}
var ambiguousRanges = [
	161,
	161,
	164,
	164,
	167,
	168,
	170,
	170,
	173,
	174,
	176,
	180,
	182,
	186,
	188,
	191,
	198,
	198,
	208,
	208,
	215,
	216,
	222,
	225,
	230,
	230,
	232,
	234,
	236,
	237,
	240,
	240,
	242,
	243,
	247,
	250,
	252,
	252,
	254,
	254,
	257,
	257,
	273,
	273,
	275,
	275,
	283,
	283,
	294,
	295,
	299,
	299,
	305,
	307,
	312,
	312,
	319,
	322,
	324,
	324,
	328,
	331,
	333,
	333,
	338,
	339,
	358,
	359,
	363,
	363,
	462,
	462,
	464,
	464,
	466,
	466,
	468,
	468,
	470,
	470,
	472,
	472,
	474,
	474,
	476,
	476,
	593,
	593,
	609,
	609,
	708,
	708,
	711,
	711,
	713,
	715,
	717,
	717,
	720,
	720,
	728,
	731,
	733,
	733,
	735,
	735,
	768,
	879,
	913,
	929,
	931,
	937,
	945,
	961,
	963,
	969,
	1025,
	1025,
	1040,
	1103,
	1105,
	1105,
	8208,
	8208,
	8211,
	8214,
	8216,
	8217,
	8220,
	8221,
	8224,
	8226,
	8228,
	8231,
	8240,
	8240,
	8242,
	8243,
	8245,
	8245,
	8251,
	8251,
	8254,
	8254,
	8308,
	8308,
	8319,
	8319,
	8321,
	8324,
	8364,
	8364,
	8451,
	8451,
	8453,
	8453,
	8457,
	8457,
	8467,
	8467,
	8470,
	8470,
	8481,
	8482,
	8486,
	8486,
	8491,
	8491,
	8531,
	8532,
	8539,
	8542,
	8544,
	8555,
	8560,
	8569,
	8585,
	8585,
	8592,
	8601,
	8632,
	8633,
	8658,
	8658,
	8660,
	8660,
	8679,
	8679,
	8704,
	8704,
	8706,
	8707,
	8711,
	8712,
	8715,
	8715,
	8719,
	8719,
	8721,
	8721,
	8725,
	8725,
	8730,
	8730,
	8733,
	8736,
	8739,
	8739,
	8741,
	8741,
	8743,
	8748,
	8750,
	8750,
	8756,
	8759,
	8764,
	8765,
	8776,
	8776,
	8780,
	8780,
	8786,
	8786,
	8800,
	8801,
	8804,
	8807,
	8810,
	8811,
	8814,
	8815,
	8834,
	8835,
	8838,
	8839,
	8853,
	8853,
	8857,
	8857,
	8869,
	8869,
	8895,
	8895,
	8978,
	8978,
	9312,
	9449,
	9451,
	9547,
	9552,
	9587,
	9600,
	9615,
	9618,
	9621,
	9632,
	9633,
	9635,
	9641,
	9650,
	9651,
	9654,
	9655,
	9660,
	9661,
	9664,
	9665,
	9670,
	9672,
	9675,
	9675,
	9678,
	9681,
	9698,
	9701,
	9711,
	9711,
	9733,
	9734,
	9737,
	9737,
	9742,
	9743,
	9756,
	9756,
	9758,
	9758,
	9792,
	9792,
	9794,
	9794,
	9824,
	9825,
	9827,
	9829,
	9831,
	9834,
	9836,
	9837,
	9839,
	9839,
	9886,
	9887,
	9919,
	9919,
	9926,
	9933,
	9935,
	9939,
	9941,
	9953,
	9955,
	9955,
	9960,
	9961,
	9963,
	9969,
	9972,
	9972,
	9974,
	9977,
	9979,
	9980,
	9982,
	9983,
	10045,
	10045,
	10102,
	10111,
	11094,
	11097,
	12872,
	12879,
	57344,
	63743,
	65024,
	65039,
	65533,
	65533,
	127232,
	127242,
	127248,
	127277,
	127280,
	127337,
	127344,
	127373,
	127375,
	127376,
	127387,
	127404,
	917760,
	917999,
	983040,
	1048573,
	1048576,
	1114109
];
var fullwidthRanges = [
	12288,
	12288,
	65281,
	65376,
	65504,
	65510
];
var halfwidthRanges = [
	8361,
	8361,
	65377,
	65470,
	65474,
	65479,
	65482,
	65487,
	65490,
	65495,
	65498,
	65500,
	65512,
	65518
];
var narrowRanges = [
	32,
	126,
	162,
	163,
	165,
	166,
	172,
	172,
	175,
	175,
	10214,
	10221,
	10629,
	10630
];
var wideRanges = [
	4352,
	4447,
	8986,
	8987,
	9001,
	9002,
	9193,
	9196,
	9200,
	9200,
	9203,
	9203,
	9725,
	9726,
	9748,
	9749,
	9776,
	9783,
	9800,
	9811,
	9855,
	9855,
	9866,
	9871,
	9875,
	9875,
	9889,
	9889,
	9898,
	9899,
	9917,
	9918,
	9924,
	9925,
	9934,
	9934,
	9940,
	9940,
	9962,
	9962,
	9970,
	9971,
	9973,
	9973,
	9978,
	9978,
	9981,
	9981,
	9989,
	9989,
	9994,
	9995,
	10024,
	10024,
	10060,
	10060,
	10062,
	10062,
	10067,
	10069,
	10071,
	10071,
	10133,
	10135,
	10160,
	10160,
	10175,
	10175,
	11035,
	11036,
	11088,
	11088,
	11093,
	11093,
	11904,
	11929,
	11931,
	12019,
	12032,
	12245,
	12272,
	12287,
	12289,
	12350,
	12353,
	12438,
	12441,
	12543,
	12549,
	12591,
	12593,
	12686,
	12688,
	12773,
	12783,
	12830,
	12832,
	12871,
	12880,
	42124,
	42128,
	42182,
	43360,
	43388,
	44032,
	55203,
	63744,
	64255,
	65040,
	65049,
	65072,
	65106,
	65108,
	65126,
	65128,
	65131,
	94176,
	94180,
	94192,
	94198,
	94208,
	101589,
	101631,
	101662,
	101760,
	101874,
	110576,
	110579,
	110581,
	110587,
	110589,
	110590,
	110592,
	110882,
	110898,
	110898,
	110928,
	110930,
	110933,
	110933,
	110948,
	110951,
	110960,
	111355,
	119552,
	119638,
	119648,
	119670,
	126980,
	126980,
	127183,
	127183,
	127374,
	127374,
	127377,
	127386,
	127488,
	127490,
	127504,
	127547,
	127552,
	127560,
	127568,
	127569,
	127584,
	127589,
	127744,
	127776,
	127789,
	127797,
	127799,
	127868,
	127870,
	127891,
	127904,
	127946,
	127951,
	127955,
	127968,
	127984,
	127988,
	127988,
	127992,
	128062,
	128064,
	128064,
	128066,
	128252,
	128255,
	128317,
	128331,
	128334,
	128336,
	128359,
	128378,
	128378,
	128405,
	128406,
	128420,
	128420,
	128507,
	128591,
	128640,
	128709,
	128716,
	128716,
	128720,
	128722,
	128725,
	128728,
	128732,
	128735,
	128747,
	128748,
	128756,
	128764,
	128992,
	129003,
	129008,
	129008,
	129292,
	129338,
	129340,
	129349,
	129351,
	129535,
	129648,
	129660,
	129664,
	129674,
	129678,
	129734,
	129736,
	129736,
	129741,
	129756,
	129759,
	129770,
	129775,
	129784,
	131072,
	196605,
	196608,
	262141
];
//#endregion
//#region node_modules/get-east-asian-width/utilities.js
/**
Binary search on a sorted flat array of [start, end] pairs.

@param {number[]} ranges - Flat array of inclusive [start, end] range pairs, e.g. [0, 5, 10, 20].
@param {number} codePoint - The value to search for.
@returns {boolean} Whether the value falls within any of the ranges.
*/
var isInRange = (ranges, codePoint) => {
	let low = 0;
	let high = Math.floor(ranges.length / 2) - 1;
	while (low <= high) {
		const mid = Math.floor((low + high) / 2);
		const i = mid * 2;
		if (codePoint < ranges[i]) high = mid - 1;
		else if (codePoint > ranges[i + 1]) low = mid + 1;
		else return true;
	}
	return false;
};
//#endregion
//#region node_modules/get-east-asian-width/lookup.js
var commonCjkCodePoint = 19968;
var [wideFastPathStart, wideFastPathEnd] = /* #__PURE__ */ findWideFastPathRange(wideRanges);
function findWideFastPathRange(ranges) {
	let fastPathStart = ranges[0];
	let fastPathEnd = ranges[1];
	for (let index = 0; index < ranges.length; index += 2) {
		const start = ranges[index];
		const end = ranges[index + 1];
		if (commonCjkCodePoint >= start && commonCjkCodePoint <= end) return [start, end];
		if (end - start > fastPathEnd - fastPathStart) {
			fastPathStart = start;
			fastPathEnd = end;
		}
	}
	return [fastPathStart, fastPathEnd];
}
var isAmbiguous = (codePoint) => {
	if (codePoint < 161 || codePoint > 1114109) return false;
	return isInRange(ambiguousRanges, codePoint);
};
var isFullWidth = (codePoint) => {
	if (codePoint < 12288 || codePoint > 65510) return false;
	return isInRange(fullwidthRanges, codePoint);
};
var isHalfWidth = (codePoint) => {
	if (codePoint < 8361 || codePoint > 65518) return false;
	return isInRange(halfwidthRanges, codePoint);
};
var isNarrow = (codePoint) => {
	if (codePoint < 32 || codePoint > 10630) return false;
	return isInRange(narrowRanges, codePoint);
};
var isWide = (codePoint) => {
	if (codePoint >= wideFastPathStart && codePoint <= wideFastPathEnd) return true;
	if (codePoint < 4352 || codePoint > 262141) return false;
	return isInRange(wideRanges, codePoint);
};
function getCategory(codePoint) {
	if (isAmbiguous(codePoint)) return "ambiguous";
	if (isFullWidth(codePoint)) return "fullwidth";
	if (isHalfWidth(codePoint)) return "halfwidth";
	if (isNarrow(codePoint)) return "narrow";
	if (isWide(codePoint)) return "wide";
	return "neutral";
}
//#endregion
//#region node_modules/get-east-asian-width/index.js
function validate(codePoint) {
	if (!Number.isSafeInteger(codePoint)) throw new TypeError(`Expected a code point, got \`${typeof codePoint}\`.`);
}
function eastAsianWidthType(codePoint) {
	validate(codePoint);
	return getCategory(codePoint);
}
//#endregion
//#region node_modules/micromark-extension-cjk-friendly-util/dist/characterWithNonBmp.js
function isEmoji(uc) {
	return /^\p{Emoji_Presentation}/u.test(String.fromCodePoint(uc));
}
/**
* Check if `uc` is CJK or IVS
*
* @param uc code point
* @returns `true` if `uc` is CJK, `null` if IVS, or `false` if neither
*/
function cjkOrIvs(uc) {
	if (!uc || uc < 4352) return false;
	switch (eastAsianWidthType(uc)) {
		case "fullwidth":
		case "halfwidth": return true;
		case "wide": return !isEmoji(uc);
		case "narrow": return false;
		case "ambiguous": return 917760 <= uc && uc <= 917999 ? null : false;
		case "neutral": return /^\p{sc=Hangul}/u.test(String.fromCodePoint(uc));
	}
}
function isCjkAmbiguousPunctuation(main, vs) {
	if (vs !== 65025 || !main || main < 8216) return false;
	return main === 8216 || main === 8217 || main === 8220 || main === 8221;
}
/**
* Check whether the character code represents Non-emoji General-use Variation Selector (U+FE00-U+FE0E).
*/
function nonEmojiGeneralUseVS(code) {
	return code !== null && code >= 65024 && code <= 65038;
}
/**
* Check whether the character code represents Unicode punctuation.
*
* A **Unicode punctuation** is a character in the Unicode `Pc` (Punctuation,
* Connector), `Pd` (Punctuation, Dash), `Pe` (Punctuation, Close), `Pf`
* (Punctuation, Final quote), `Pi` (Punctuation, Initial quote), `Po`
* (Punctuation, Other), or `Ps` (Punctuation, Open) categories, or an ASCII
* punctuation (see `asciiPunctuation`).
*
* See:
* **\[UNICODE]**:
* [The Unicode Standard](https://www.unicode.org/versions/).
* Unicode Consortium.
*
* @param code
*   Code.
* @returns
*   Whether it matches.
*/
var unicodePunctuation$1 = regexCheck$1(/\p{P}|\p{S}/u);
/**
* Check whether the character code represents Unicode whitespace.
*
* Note that this does handle micromark specific markdown whitespace characters.
* See `markdownLineEndingOrSpace` to check that.
*
* A **Unicode whitespace** is a character in the Unicode `Zs` (Separator,
* Space) category, or U+0009 CHARACTER TABULATION (HT), U+000A LINE FEED (LF),
* U+000C (FF), or U+000D CARRIAGE RETURN (CR) (**\[UNICODE]**).
*
* See:
* **\[UNICODE]**:
* [The Unicode Standard](https://www.unicode.org/versions/).
* Unicode Consortium.
*
* @param code
*   Code.
* @returns
*   Whether it matches.
*/
var unicodeWhitespace$1 = regexCheck$1(/\s/);
/**
* Create a code check from a regex.
*
* @param regex
*   Expression.
* @returns
*   Check.
*/
function regexCheck$1(regex) {
	return check;
	/**
	* Check whether a code matches the bound regex.
	*
	* @param code
	*   Character code.
	* @returns
	*   Whether the character code matches the bound regex.
	*/
	function check(code) {
		return code !== null && code > -1 && regex.test(String.fromCodePoint(code));
	}
}
//#endregion
//#region node_modules/micromark-extension-cjk-friendly-util/dist/categoryUtil.js
/**
* `true` if the code point represents a [Unicode whitespace character](https://spec.commonmark.org/0.31.2/#unicode-whitespace-character).
*
* @param category the return value of `classifyCharacter`.
* @returns `true` if the code point represents a Unicode whitespace character
*/
function isUnicodeWhitespace(category) {
	return Boolean(category & constants.characterGroupWhitespace);
}
/**
* `true` if the code point represents a [non-CJK punctuation character](https://github.com/tats-u/markdown-cjk-friendly/blob/main/specification.md#non-cjk-punctuation-character).
*
* @param category the return value of `classifyCharacter`.
* @returns `true` if the code point represents a non-CJK punctuation character
*/
function isNonCjkPunctuation(category) {
	return (category & constantsEx.cjkPunctuation) === constants.characterGroupPunctuation;
}
/**
* `true` if the code point represents a [CJK character](https://github.com/tats-u/markdown-cjk-friendly/blob/main/specification.md#cjk-character).
*
* @param category the return value of `classifyCharacter`.
* @returns `true` if the code point represents a CJK character
*/
function isCjk(category) {
	return Boolean(category & constantsEx.cjk);
}
/**
* `true` if the code point represents an [Ideographic Variation Selector](https://github.com/tats-u/markdown-cjk-friendly/blob/main/specification.md#ideographi-variation-selector).
*
* @param category the return value of `classifyCharacter`.
* @returns `true` if the code point represents an IVS
*/
function isIvs(category) {
	return category === constantsEx.ivs;
}
/**
* `true` if {@link isCjk} or {@link isIvs}.
*
* @param category the return value of {@link classifyCharacter}.
* @returns `true` if the code point represents a CJK or IVS
*/
function isCjkOrIvs(category) {
	return Boolean(category & constantsEx.cjkOrIvs);
}
/**
* `true` if the code point represents a [Non-emoji General-use Variation Selector](https://github.com/tats-u/markdown-cjk-friendly/blob/main/specification.md#non-emoji-general-use-variation-selector).
*
* @param category the return value of `classifyCharacter`.
* @returns `true` if the code point represents an Non-emoji General-use Variation Selector
*/
function isNonEmojiGeneralUseVS(category) {
	return category === constantsEx.nonEmojiGeneralUseVS;
}
/**
* `true` if the code point represents a [Unicode whitespace character](https://spec.commonmark.org/0.31.2/#unicode-whitespace-character) or a [Unicode punctuation character](https://spec.commonmark.org/0.31.2/#unicode-punctuation-character).
*
* @param category the return value of `classifyCharacter`.
* @returns `true` if the code point represents a space or punctuation
*/
function isSpaceOrPunctuation(category) {
	return Boolean(category & constantsEx.spaceOrPunctuation);
}
//#endregion
//#region node_modules/micromark-util-character/index.js
/**
* @import {Code} from 'micromark-util-types'
*/
/**
* Check whether the character code represents an ASCII alpha (`a` through `z`,
* case insensitive).
*
* An **ASCII alpha** is an ASCII upper alpha or ASCII lower alpha.
*
* An **ASCII upper alpha** is a character in the inclusive range U+0041 (`A`)
* to U+005A (`Z`).
*
* An **ASCII lower alpha** is a character in the inclusive range U+0061 (`a`)
* to U+007A (`z`).
*
* @param code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
var asciiAlpha = regexCheck(/[A-Za-z]/);
/**
* Check whether the character code represents an ASCII alphanumeric (`a`
* through `z`, case insensitive, or `0` through `9`).
*
* An **ASCII alphanumeric** is an ASCII digit (see `asciiDigit`) or ASCII alpha
* (see `asciiAlpha`).
*
* @param code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
var asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);
/**
* Check whether the character code represents an ASCII atext.
*
* atext is an ASCII alphanumeric (see `asciiAlphanumeric`), or a character in
* the inclusive ranges U+0023 NUMBER SIGN (`#`) to U+0027 APOSTROPHE (`'`),
* U+002A ASTERISK (`*`), U+002B PLUS SIGN (`+`), U+002D DASH (`-`), U+002F
* SLASH (`/`), U+003D EQUALS TO (`=`), U+003F QUESTION MARK (`?`), U+005E
* CARET (`^`) to U+0060 GRAVE ACCENT (`` ` ``), or U+007B LEFT CURLY BRACE
* (`{`) to U+007E TILDE (`~`).
*
* See:
* **\[RFC5322]**:
* [Internet Message Format](https://tools.ietf.org/html/rfc5322).
* P. Resnick.
* IETF.
*
* @param code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
var asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);
/**
* Check whether a character code is an ASCII control character.
*
* An **ASCII control** is a character in the inclusive range U+0000 NULL (NUL)
* to U+001F (US), or U+007F (DEL).
*
* @param {Code} code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
function asciiControl(code) {
	return code !== null && (code < 32 || code === 127);
}
/**
* Check whether the character code represents an ASCII digit (`0` through `9`).
*
* An **ASCII digit** is a character in the inclusive range U+0030 (`0`) to
* U+0039 (`9`).
*
* @param code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
var asciiDigit = regexCheck(/\d/);
/**
* Check whether the character code represents an ASCII hex digit (`a` through
* `f`, case insensitive, or `0` through `9`).
*
* An **ASCII hex digit** is an ASCII digit (see `asciiDigit`), ASCII upper hex
* digit, or an ASCII lower hex digit.
*
* An **ASCII upper hex digit** is a character in the inclusive range U+0041
* (`A`) to U+0046 (`F`).
*
* An **ASCII lower hex digit** is a character in the inclusive range U+0061
* (`a`) to U+0066 (`f`).
*
* @param code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
var asciiHexDigit = regexCheck(/[\dA-Fa-f]/);
/**
* Check whether the character code represents ASCII punctuation.
*
* An **ASCII punctuation** is a character in the inclusive ranges U+0021
* EXCLAMATION MARK (`!`) to U+002F SLASH (`/`), U+003A COLON (`:`) to U+0040 AT
* SIGN (`@`), U+005B LEFT SQUARE BRACKET (`[`) to U+0060 GRAVE ACCENT
* (`` ` ``), or U+007B LEFT CURLY BRACE (`{`) to U+007E TILDE (`~`).
*
* @param code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
var asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);
/**
* Check whether a character code is a markdown line ending.
*
* A **markdown line ending** is the virtual characters M-0003 CARRIAGE RETURN
* LINE FEED (CRLF), M-0004 LINE FEED (LF) and M-0005 CARRIAGE RETURN (CR).
*
* In micromark, the actual character U+000A LINE FEED (LF) and U+000D CARRIAGE
* RETURN (CR) are replaced by these virtual characters depending on whether
* they occurred together.
*
* @param {Code} code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
function markdownLineEnding(code) {
	return code !== null && code < -2;
}
/**
* Check whether a character code is a markdown line ending (see
* `markdownLineEnding`) or markdown space (see `markdownSpace`).
*
* @param {Code} code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
function markdownLineEndingOrSpace(code) {
	return code !== null && (code < 0 || code === 32);
}
/**
* Check whether a character code is a markdown space.
*
* A **markdown space** is the concrete character U+0020 SPACE (SP) and the
* virtual characters M-0001 VIRTUAL SPACE (VS) and M-0002 HORIZONTAL TAB (HT).
*
* In micromark, the actual character U+0009 CHARACTER TABULATION (HT) is
* replaced by one M-0002 HORIZONTAL TAB (HT) and between 0 and 3 M-0001 VIRTUAL
* SPACE (VS) characters, depending on the column at which the tab occurred.
*
* @param {Code} code
*   Code.
* @returns {boolean}
*   Whether it matches.
*/
function markdownSpace(code) {
	return code === -2 || code === -1 || code === 32;
}
/**
* Check whether the character code represents Unicode punctuation.
*
* A **Unicode punctuation** is a character in the Unicode `Pc` (Punctuation,
* Connector), `Pd` (Punctuation, Dash), `Pe` (Punctuation, Close), `Pf`
* (Punctuation, Final quote), `Pi` (Punctuation, Initial quote), `Po`
* (Punctuation, Other), or `Ps` (Punctuation, Open) categories, or an ASCII
* punctuation (see `asciiPunctuation`).
*
* See:
* **\[UNICODE]**:
* [The Unicode Standard](https://www.unicode.org/versions/).
* Unicode Consortium.
*
* @param code
*   Code.
* @returns
*   Whether it matches.
*/
var unicodePunctuation = regexCheck(/\p{P}|\p{S}/u);
/**
* Check whether the character code represents Unicode whitespace.
*
* Note that this does handle micromark specific markdown whitespace characters.
* See `markdownLineEndingOrSpace` to check that.
*
* A **Unicode whitespace** is a character in the Unicode `Zs` (Separator,
* Space) category, or U+0009 CHARACTER TABULATION (HT), U+000A LINE FEED (LF),
* U+000C (FF), or U+000D CARRIAGE RETURN (CR) (**\[UNICODE]**).
*
* See:
* **\[UNICODE]**:
* [The Unicode Standard](https://www.unicode.org/versions/).
* Unicode Consortium.
*
* @param code
*   Code.
* @returns
*   Whether it matches.
*/
var unicodeWhitespace = regexCheck(/\s/);
/**
* Create a code check from a regex.
*
* @param {RegExp} regex
*   Expression.
* @returns {(code: Code) => boolean}
*   Check.
*/
function regexCheck(regex) {
	return check;
	/**
	* Check whether a code matches the bound regex.
	*
	* @param {Code} code
	*   Character code.
	* @returns {boolean}
	*   Whether the character code matches the bound regex.
	*/
	function check(code) {
		return code !== null && code > -1 && regex.test(String.fromCharCode(code));
	}
}
//#endregion
//#region node_modules/micromark-extension-cjk-friendly-util/dist/classifyCharacter.js
var constantsEx;
(function(_constantsEx) {
	_constantsEx.spaceOrPunctuation = 3;
	_constantsEx.cjk = 4096;
	_constantsEx.cjkPunctuation = 4098;
	_constantsEx.ivs = 8192;
	_constantsEx.cjkOrIvs = 12288;
	_constantsEx.nonEmojiGeneralUseVS = 16384;
	_constantsEx.variationSelector = 24576;
	_constantsEx.ivsToCjkRightShift = 1;
})(constantsEx || (constantsEx = {}));
/**
* Classify whether a code represents whitespace, punctuation, or something
* else.
*
* Used for attention (emphasis, strong), whose sequences can open or close
* based on the class of surrounding characters.
*
* > 👉 **Note**: eof (`null`) is seen as whitespace.
*
* @param code
*   Code.
* @returns
*   Group.
*/
function classifyCharacter(code) {
	if (code === codes.eof || markdownLineEndingOrSpace(code) || unicodeWhitespace$1(code)) return constants.characterGroupWhitespace;
	let value = 0;
	if (code >= 4352) {
		if (nonEmojiGeneralUseVS(code)) return constantsEx.nonEmojiGeneralUseVS;
		switch (cjkOrIvs(code)) {
			case null: return constantsEx.ivs;
			case true: value |= constantsEx.cjk;
		}
	}
	if (unicodePunctuation$1(code)) value |= constants.characterGroupPunctuation;
	return value;
}
/**}
* Classify whether a code represents whitespace, punctuation, or something else.
*
* Recognizes general-use variation selectors. Use this instead of {@linkcode classifyCharacter} for previous character.
*
* @param before result of {@linkcode classifyCharacter} of the preceding character.
* @param get2Previous a function that returns the code point of the character before the preceding character. Use lambda or {@linkcode Function.prototype.bind}.
* @param previous code point of the preceding character
* @returns
*   Group of the main code point of the preceding character. Use `isCjkOrIvs` to check whether it is CJK
*/
function classifyPrecedingCharacter(before, get2Previous, previous) {
	if (!isNonEmojiGeneralUseVS(before)) return before;
	const twoPrevious = get2Previous();
	const twoBefore = classifyCharacter(twoPrevious);
	return !twoPrevious || isUnicodeWhitespace(twoBefore) ? before : isCjkAmbiguousPunctuation(twoPrevious, previous) ? constantsEx.cjkPunctuation : stripIvs(twoBefore);
}
function stripIvs(twoBefore) {
	return twoBefore & ~constantsEx.ivs;
}
//#endregion
//#region node_modules/micromark-extension-cjk-friendly-util/dist/codeUtil.js
/**
* Check if the given code is a [High-Surrogate Code Unit](https://www.unicode.org/glossary/#high_surrogate_code_unit).
*
* A High-Surrogate Code Unit is the _first_ half of a [Surrogate Pair](https://www.unicode.org/glossary/#surrogate_pair).
*
* @param code Code.
* @returns `true` if the code is a High-Surrogate Code Unit, `false` otherwise.
*/
function isCodeHighSurrogate(code) {
	return Boolean(code && code >= 55296 && code <= 56319);
}
/**
* Check if the given code is a [Low-Surrogate Code Unit](https://www.unicode.org/glossary/#low_surrogate_code_unit).
*
* A Low-Surrogate Code Unit is the _second_ half of a [Surrogate Pair](https://www.unicode.org/glossary/#surrogate_pair).
* @param code
*   The character code to check.
* @returns
*   True if the code is a Low-Surrogate Code Unit, false otherwise.
*/
function isCodeLowSurrogate(code) {
	return Boolean(code && code >= 56320 && code <= 57343);
}
/**
* If `code` is a [Low-Surrogate Code Unit](https://www.unicode.org/glossary/#low_surrogate_code_unit), try to get a genuine previous [Unicode Scalar Value](https://www.unicode.org/glossary/#unicode_scalar_value) corresponding to the Low-Surrogate Code Unit.
* @param code a tentative previous [code unit](https://www.unicode.org/glossary/#code_unit) less than 65,536, including a Low-Surrogate one
* @param nowPoint `this.now()` (`this` = `TokenizeContext`)
* @param sliceSerialize `this.sliceSerialize` (`this` = `TokenizeContext`)
* @returns a value greater than 65,535 if the previous code point represents a [Supplementary Character](https://www.unicode.org/glossary/#supplementary_character), or `code` otherwise
*/
function tryGetGenuinePreviousCode(code, nowPoint, sliceSerialize) {
	if (nowPoint._bufferIndex < 2) return code;
	const previousCandidate = sliceSerialize({
		start: {
			...nowPoint,
			_bufferIndex: nowPoint._bufferIndex - 2
		},
		end: nowPoint
	}).codePointAt(0);
	return previousCandidate && previousCandidate >= 65536 ? previousCandidate : code;
}
/**
* Try to get the [Unicode Code Point](https://www.unicode.org/glossary/#code_point) two positions before the current position.
*
* @param previousCode a previous code point. Should be greater than 65,535 if it represents a [Supplementary Character](https://www.unicode.org/glossary/#supplementary_character).
* @param nowPoint `this.now()` (`this` = `TokenizeContext`)
* @param sliceSerialize `this.sliceSerialize` (`this` = `TokenizeContext`)
* @returns a value greater than 65,535 if the code point two positions before represents a [Supplementary Character](https://www.unicode.org/glossary/#supplementary_character), a value less than 65,536 for a [BMP Character](https://www.unicode.org/glossary/#bmp_character), or `null` if not found
*/
function tryGetCodeTwoBefore(previousCode, nowPoint, sliceSerialize) {
	const previousWidth = previousCode >= 65536 ? 2 : 1;
	if (nowPoint._bufferIndex < 1 + previousWidth) return null;
	const idealStart = nowPoint._bufferIndex - previousWidth - 2;
	const twoPreviousBuffer = sliceSerialize({
		start: {
			...nowPoint,
			_bufferIndex: idealStart >= 0 ? idealStart : 0
		},
		end: {
			...nowPoint,
			_bufferIndex: nowPoint._bufferIndex - previousWidth
		}
	});
	const twoPreviousLast = twoPreviousBuffer.charCodeAt(twoPreviousBuffer.length - 1);
	if (Number.isNaN(twoPreviousLast)) return null;
	if (twoPreviousBuffer.length < 2 || twoPreviousLast < 56320 || 57343 < twoPreviousLast) return twoPreviousLast;
	const twoPreviousCandidate = twoPreviousBuffer.codePointAt(0);
	if (twoPreviousCandidate && twoPreviousCandidate >= 65536) return twoPreviousCandidate;
	return twoPreviousLast;
}
/**
* Lazily get the [Unicode Code Point](https://www.unicode.org/glossary/#code_point) two positions before the current position only if necessary.
*
* @see {@link tryGetCodeTwoBefore}
*/
var TwoPreviousCode = class {
	cachedValue = void 0;
	/**
	* @see {@link tryGetCodeTwoBefore}
	*
	* @param previousCode a previous code point. Should be greater than 65,535 if it represents a [Supplementary Character](https://www.unicode.org/glossary/#supplementary_character).
	* @param nowPoint `this.now()` (`this` = `TokenizeContext`)
	* @param sliceSerialize `this.sliceSerialize` (`this` = `TokenizeContext`)
	*/
	constructor(previousCode, nowPoint, sliceSerialize) {
		this.previousCode = previousCode;
		this.nowPoint = nowPoint;
		this.sliceSerialize = sliceSerialize;
	}
	/**
	* Returns the return value of {@link tryGetCodeTwoBefore}.
	*
	* If the value has not been computed yet, it will be computed and cached.
	*
	* @see {@link tryGetCodeTwoBefore}
	*
	* @returns a value greater than 65,535 if the code point two positions before represents a [Supplementary Character](https://www.unicode.org/glossary/#supplementary_character), a value less than 65,536 for a [BMP Character](https://www.unicode.org/glossary/#bmp_character), or `null` if not found
	*/
	value() {
		if (this.cachedValue === void 0) this.cachedValue = tryGetCodeTwoBefore(this.previousCode, this.nowPoint, this.sliceSerialize);
		return this.cachedValue;
	}
};
/**
* If `code` is a [High-Surrogate Code Unit](https://www.unicode.org/glossary/#high_surrogate_code_unit), try to get a genuine next [Unicode Scalar Value](https://www.unicode.org/glossary/#unicode_scalar_value) corresponding to the High-Surrogate Code Unit.
* @param code a tentative next [code unit](https://www.unicode.org/glossary/#code_unit) less than 65,536, including a High-Surrogate one
* @param nowPoint `this.now()` (`this` = `TokenizeContext`)
* @param sliceSerialize `this.sliceSerialize` (`this` = `TokenizeContext`)
* @returns a value greater than 65,535 if the next code point represents a [Supplementary Character](https://www.unicode.org/glossary/#supplementary_character), or `code` otherwise
*/
function tryGetGenuineNextCode(code, nowPoint, sliceSerialize) {
	const nextCandidate = sliceSerialize({
		start: nowPoint,
		end: {
			...nowPoint,
			_bufferIndex: nowPoint._bufferIndex + 2
		}
	}).codePointAt(0);
	return nextCandidate && nextCandidate >= 65536 ? nextCandidate : code;
}
//#endregion
//#region node_modules/micromark-util-chunked/index.js
/**
* Like `Array#splice`, but smarter for giant arrays.
*
* `Array#splice` takes all items to be inserted as individual argument which
* causes a stack overflow in V8 when trying to insert 100k items for instance.
*
* Otherwise, this does not return the removed items, and takes `items` as an
* array instead of rest parameters.
*
* @template {unknown} T
*   Item type.
* @param {Array<T>} list
*   List to operate on.
* @param {number} start
*   Index to remove/insert at (can be negative).
* @param {number} remove
*   Number of items to remove.
* @param {Array<T>} items
*   Items to inject into `list`.
* @returns {undefined}
*   Nothing.
*/
function splice(list, start, remove, items) {
	const end = list.length;
	let chunkStart = 0;
	/** @type {Array<unknown>} */
	let parameters;
	if (start < 0) start = -start > end ? 0 : end + start;
	else start = start > end ? end : start;
	remove = remove > 0 ? remove : 0;
	if (items.length < 1e4) {
		parameters = Array.from(items);
		parameters.unshift(start, remove);
		list.splice(...parameters);
	} else {
		if (remove) list.splice(start, remove);
		while (chunkStart < items.length) {
			parameters = items.slice(chunkStart, chunkStart + 1e4);
			parameters.unshift(start, 0);
			list.splice(...parameters);
			chunkStart += 1e4;
			start += 1e4;
		}
	}
}
/**
* Append `items` (an array) at the end of `list` (another array).
* When `list` was empty, returns `items` instead.
*
* This prevents a potentially expensive operation when `list` is empty,
* and adds items in batches to prevent V8 from hanging.
*
* @template {unknown} T
*   Item type.
* @param {Array<T>} list
*   List to operate on.
* @param {Array<T>} items
*   Items to add to `list`.
* @returns {Array<T>}
*   Either `list` or `items`.
*/
function push(list, items) {
	if (list.length > 0) {
		splice(list, list.length, 0, items);
		return list;
	}
	return items;
}
//#endregion
//#region node_modules/micromark-util-resolve-all/index.js
/**
* @import {Event, Resolver, TokenizeContext} from 'micromark-util-types'
*/
/**
* Call all `resolveAll`s.
*
* @param {ReadonlyArray<{resolveAll?: Resolver | undefined}>} constructs
*   List of constructs, optionally with `resolveAll`s.
* @param {Array<Event>} events
*   List of events.
* @param {TokenizeContext} context
*   Context used by `tokenize`.
* @returns {Array<Event>}
*   Changed events.
*/
function resolveAll(constructs, events, context) {
	/** @type {Array<Resolver>} */
	const called = [];
	let index = -1;
	while (++index < constructs.length) {
		const resolve = constructs[index].resolveAll;
		if (resolve && !called.includes(resolve)) {
			events = resolve(events, context);
			called.push(resolve);
		}
	}
	return events;
}
//#endregion
//#region node_modules/micromark-extension-cjk-friendly/dist/ext/attention.js
var attention = {
	name: "attention",
	resolveAll: resolveAllAttention,
	tokenize: tokenizeAttention
};
function resolveAllAttention(events, context) {
	let index = -1;
	let open;
	let group;
	let text;
	let openingSequence;
	let closingSequence;
	let use;
	let nextEvents;
	let offset;
	while (++index < events.length) if (events[index][0] === "enter" && events[index][1].type === "attentionSequence" && events[index][1]._close) {
		open = index;
		while (open--) if (events[open][0] === "exit" && events[open][1].type === "attentionSequence" && events[open][1]._open && context.sliceSerialize(events[open][1]).charCodeAt(0) === context.sliceSerialize(events[index][1]).charCodeAt(0)) {
			if ((events[open][1]._close || events[index][1]._open) && (events[index][1].end.offset - events[index][1].start.offset) % 3 && !((events[open][1].end.offset - events[open][1].start.offset + events[index][1].end.offset - events[index][1].start.offset) % 3)) continue;
			use = events[open][1].end.offset - events[open][1].start.offset > 1 && events[index][1].end.offset - events[index][1].start.offset > 1 ? 2 : 1;
			const start = { ...events[open][1].end };
			const end = { ...events[index][1].start };
			movePoint(start, -use);
			movePoint(end, use);
			openingSequence = {
				type: use > 1 ? types.strongSequence : types.emphasisSequence,
				start,
				end: { ...events[open][1].end }
			};
			closingSequence = {
				type: use > 1 ? types.strongSequence : types.emphasisSequence,
				start: { ...events[index][1].start },
				end
			};
			text = {
				type: use > 1 ? types.strongText : types.emphasisText,
				start: { ...events[open][1].end },
				end: { ...events[index][1].start }
			};
			group = {
				type: use > 1 ? types.strong : types.emphasis,
				start: { ...openingSequence.start },
				end: { ...closingSequence.end }
			};
			events[open][1].end = { ...openingSequence.start };
			events[index][1].start = { ...closingSequence.end };
			nextEvents = [];
			if (events[open][1].end.offset - events[open][1].start.offset) nextEvents = push(nextEvents, [[
				"enter",
				events[open][1],
				context
			], [
				"exit",
				events[open][1],
				context
			]]);
			nextEvents = push(nextEvents, [
				[
					"enter",
					group,
					context
				],
				[
					"enter",
					openingSequence,
					context
				],
				[
					"exit",
					openingSequence,
					context
				],
				[
					"enter",
					text,
					context
				]
			]);
			context.parser.constructs.insideSpan.null;
			nextEvents = push(nextEvents, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + 1, index), context));
			nextEvents = push(nextEvents, [
				[
					"exit",
					text,
					context
				],
				[
					"enter",
					closingSequence,
					context
				],
				[
					"exit",
					closingSequence,
					context
				],
				[
					"exit",
					group,
					context
				]
			]);
			if (events[index][1].end.offset - events[index][1].start.offset) {
				offset = 2;
				nextEvents = push(nextEvents, [[
					"enter",
					events[index][1],
					context
				], [
					"exit",
					events[index][1],
					context
				]]);
			} else offset = 0;
			splice(events, open - 1, index - open + 3, nextEvents);
			index = open + nextEvents.length - offset - 2;
			break;
		}
	}
	index = -1;
	while (++index < events.length) if (events[index][1].type === "attentionSequence") events[index][1].type = "data";
	return events;
}
/**
* @this {TokenizeContext}
*   Context.
* @type {Tokenizer}
*/
function tokenizeAttention(effects, ok$1$2) {
	const attentionMarkers = this.parser.constructs.attentionMarkers.null;
	const { now, sliceSerialize, previous: tentativePrevious } = this;
	const previous = isCodeLowSurrogate(tentativePrevious) ? tryGetGenuinePreviousCode(tentativePrevious, now(), sliceSerialize) : tentativePrevious;
	const before = classifyCharacter(previous);
	const twoPrevious = new TwoPreviousCode(previous, now(), sliceSerialize);
	const beforePrimary = classifyPrecedingCharacter(before, twoPrevious.value.bind(twoPrevious), previous);
	/** @type {NonNullable<Code>} */
	let marker;
	return start;
	/**
	* Before a sequence.
	*
	* ```markdown
	* > | **
	*     ^
	* ```
	*
	* @type {State}
	*/
	function start(code) {
		code === codes.asterisk || codes.underscore;
		marker = code;
		effects.enter("attentionSequence");
		return inside(code);
	}
	/**
	* In a sequence.
	*
	* ```markdown
	* > | **
	*     ^^
	* ```
	*
	* @type {State}
	*/
	function inside(code) {
		if (code === marker) {
			effects.consume(code);
			return inside;
		}
		const token = effects.exit("attentionSequence");
		const after = classifyCharacter(isCodeHighSurrogate(code) ? tryGetGenuineNextCode(code, now(), sliceSerialize) : code);
		const beforeNonCjkPunctuation = isNonCjkPunctuation(beforePrimary);
		const beforeSpaceOrNonCjkPunctuation = beforeNonCjkPunctuation || isUnicodeWhitespace(beforePrimary);
		const afterNonCjkPunctuation = isNonCjkPunctuation(after);
		const afterSpaceOrNonCjkPunctuation = afterNonCjkPunctuation || isUnicodeWhitespace(after);
		const beforeCjkOrIvs = isCjkOrIvs(beforePrimary);
		const open = !afterSpaceOrNonCjkPunctuation || afterNonCjkPunctuation && (beforeSpaceOrNonCjkPunctuation || beforeCjkOrIvs) || attentionMarkers.includes(code);
		const close = !beforeSpaceOrNonCjkPunctuation || beforeNonCjkPunctuation && (afterSpaceOrNonCjkPunctuation || isCjk(after)) || attentionMarkers.includes(previous);
		token._open = Boolean(marker === codes.asterisk ? open : open && (isSpaceOrPunctuation(beforePrimary) || !close));
		token._close = Boolean(marker === codes.asterisk ? close : close && (isSpaceOrPunctuation(after) || !open));
		return ok$1$2(code);
	}
}
/**
* Move a point a bit.
*
* Note: `move` only works inside lines! It’s not possible to move past other
* chunks (replacement characters, tabs, or line endings).
*
* @param {Point} point
*   Point.
* @param {number} offset
*   Amount to move.
* @returns {undefined}
*   Nothing.
*/
function movePoint(point, offset) {
	point.column += offset;
	point.offset += offset;
	point._bufferIndex += offset;
}
//#endregion
//#region node_modules/micromark-extension-cjk-friendly/dist/index.js
/**
* Make Markdown emphasis (`**`) in CommonMark more friendly with Chinese, Japanese, and Korean (CJK).
*/
function cjkFriendlyExtension() {
	return {
		text: {
			[codes.asterisk]: attention,
			[codes.underscore]: attention
		},
		insideSpan: { null: [attention] }
	};
}
//#endregion
//#region node_modules/remark-cjk-friendly/dist/parseOnly.js
/**
* Make Markdown emphasis (`**`) in CommonMark more friendly with Chinese, Japanese, and Korean (CJK).
*
* This plugin only supports parsing. If you have been using `remark-cjk-friendly` since v2.0.1 or earlier, it is recommended to migrate to this to minimize bundled dependencies.
*/
function remarkCjkFriendly$2() {
	const data = this.data();
	(data.micromarkExtensions || (data.micromarkExtensions = [])).push(cjkFriendlyExtension());
}
//#endregion
//#region node_modules/mdast-util-to-markdown-cjk-friendly/dist/index.mjs
var encodedOutsideBoundary$1 = ";".codePointAt(0) ?? codes.eof;
var encodedInsideBoundary$1 = "&".codePointAt(0) ?? codes.eof;
/**
* Add CJK-friendly `toMarkdown` handlers for emphasis and strong.
*/
function cjkFriendlyToMarkdown() {
	return { handlers: {
		emphasis,
		strong,
		text: text$1
	} };
}
emphasis.peek = emphasisPeek;
strong.peek = strongPeek;
function emphasis(node, parent, state, info) {
	return serializeAttention(node, parent, state, info, emphasisPeek(node, parent, state), 1);
}
function strong(node, parent, state, info) {
	return serializeAttention(node, parent, state, info, strongPeek(node, parent, state), 2);
}
function emphasisPeek(_, _parent, state) {
	return state.options.emphasis || "*";
}
function strongPeek(_, _parent, state) {
	return state.options.strong || "*";
}
function serializeAttention(node, parent, state, info, marker, size) {
	const sequence = marker.repeat(size);
	const exit = state.enter(size === 1 ? "emphasis" : "strong");
	const tracker = state.createTracker(info);
	const before = tracker.move(sequence);
	let between = tracker.move(state.containerPhrasing(node, {
		after: marker,
		before,
		...tracker.current()
	}));
	const beforeBoundary = resolveBeforeBoundary$1(node, parent, state, info.before);
	const afterBoundary = resolveAfterBoundary$1(node, parent, state, info.after);
	const open = encodeInfoCjk$1(beforeBoundary, firstCodePoint$1(between), marker, "open");
	if (open.inside && between) between = encodeFirstCodePoint$1(between);
	const close = encodeInfoCjk$1({
		current: lastCodePoint$1(between),
		previous: codePointBeforeLast$1(between)
	}, afterBoundary, marker, "close");
	if (close.inside && between) between = encodeLastCodePoint$1(between);
	const after = tracker.move(sequence);
	exit();
	const encodeAfterSupplementary = close.outside && shouldEncodeAfterSupplementaryText$1(parent, state);
	state.attentionEncodeSurroundingInfo = {
		after: close.outside && !encodeAfterSupplementary,
		before: open.outside
	};
	getCjkFriendlyState$1(state).cjkFriendlyEncodeAfterSupplementaryText = encodeAfterSupplementary;
	return before + between + after;
}
function text$1(node, _parent, state, info) {
	const cjkFriendlyState = getCjkFriendlyState$1(state);
	if (!cjkFriendlyState.cjkFriendlyEncodeAfterSupplementaryText) return state.safe(node.value, info);
	cjkFriendlyState.cjkFriendlyEncodeAfterSupplementaryText = false;
	const [first = ""] = [...node.value];
	const rest = node.value.slice(first.length);
	return `${encodeCharacterReference$1(first.codePointAt(0) ?? codes.eof)}${state.safe(rest, {
		...info,
		before: ";"
	})}`;
}
function encodeInfoCjk$1(before, after, marker, target) {
	const beforeKind = classifyBoundaryBefore$1(before);
	const afterKind = classifyCharacter(after);
	if (!isCjkOrIvs(beforeKind) && !isCjkOrIvs(afterKind)) return target === "open" ? encodeInfoFallback$1(beforeKind, afterKind, marker) : encodeInfoFallback$1(afterKind, beforeKind, marker);
	const raw = {
		inside: false,
		outside: false
	};
	const preserveOutside = {
		inside: true,
		outside: false
	};
	const preserveInside = {
		inside: false,
		outside: true
	};
	const encodeBoth = {
		inside: true,
		outside: true
	};
	for (const candidate of [
		raw,
		preserveOutside,
		preserveInside,
		encodeBoth
	]) {
		const candidateBefore = target === "open" ? candidate.outside ? encodedBoundaryBeforeContext$1 : before : candidate.inside ? encodedBoundaryBeforeContext$1 : before;
		const candidateAfter = target === "open" ? candidate.inside ? encodedBoundaryAfter$1 : after : candidate.outside ? encodedBoundaryAfter$1 : after;
		if (target === "open" ? canOpen$1(marker, candidateBefore, candidateAfter) : canClose$1(marker, candidateBefore, candidateAfter)) return candidate;
	}
	return encodeBoth;
}
function encodeInfoFallback$1(outsideKind, insideKind, marker) {
	if (isLetterLike$1(outsideKind)) return isLetterLike$1(insideKind) ? marker === "_" ? {
		inside: true,
		outside: true
	} : {
		inside: false,
		outside: false
	} : isUnicodeWhitespace(insideKind) ? {
		inside: true,
		outside: true
	} : {
		inside: false,
		outside: true
	};
	if (isUnicodeWhitespace(outsideKind)) return isLetterLike$1(insideKind) ? {
		inside: false,
		outside: false
	} : isUnicodeWhitespace(insideKind) ? {
		inside: true,
		outside: true
	} : {
		inside: false,
		outside: false
	};
	return isUnicodeWhitespace(insideKind) ? {
		inside: true,
		outside: false
	} : {
		inside: false,
		outside: false
	};
}
function canOpen$1(marker, before, afterCode) {
	const beforeKind = classifyBoundaryBefore$1(before);
	const { close, open } = getAttentionSides$1(beforeKind, classifyCharacter(afterCode));
	return marker === "_" ? open && (isSpaceOrPunctuation(beforeKind) || !close) : open;
}
function canClose$1(marker, before, afterCode) {
	const afterKind = classifyCharacter(afterCode);
	const { close, open } = getAttentionSides$1(classifyBoundaryBefore$1(before), afterKind);
	return marker === "_" ? close && (isSpaceOrPunctuation(afterKind) || !open) : close;
}
function getAttentionSides$1(beforeKind, afterKind) {
	const beforeNonCjkPunctuation = isNonCjkPunctuation(beforeKind);
	const beforeSpaceOrNonCjkPunctuation = beforeNonCjkPunctuation || isUnicodeWhitespace(beforeKind);
	const afterNonCjkPunctuation = isNonCjkPunctuation(afterKind);
	const afterSpaceOrNonCjkPunctuation = afterNonCjkPunctuation || isUnicodeWhitespace(afterKind);
	return {
		open: !afterSpaceOrNonCjkPunctuation || afterNonCjkPunctuation && (beforeSpaceOrNonCjkPunctuation || isCjkOrIvs(beforeKind)),
		close: !beforeSpaceOrNonCjkPunctuation || beforeNonCjkPunctuation && (afterSpaceOrNonCjkPunctuation || isCjk(afterKind))
	};
}
function isLetterLike$1(kind) {
	return !isUnicodeWhitespace(kind) && !isNonCjkPunctuation(kind);
}
function classifyBoundaryBefore$1(before) {
	const kind = classifyCharacter(before.current);
	return before.current === null || !isNonEmojiGeneralUseVS(kind) ? kind : classifyPrecedingCharacter(kind, () => before.previous, before.current);
}
function resolveBeforeBoundary$1(node, parent, state, fallback) {
	let current = lastCodePoint$1(fallback);
	let previous = codePointBeforeLast$1(fallback);
	if (needsPreviousBoundaryRecovery$1(current) || needsPreviousContext$1(current, previous)) {
		const siblingText = getAdjacentSiblingText$1(node, parent, state, -1);
		if (siblingText) {
			current = lastCodePoint$1(siblingText);
			previous = codePointBeforeLast$1(siblingText);
		}
	}
	return {
		current,
		previous
	};
}
function resolveAfterBoundary$1(node, parent, state, fallback) {
	const current = firstCodePoint$1(fallback);
	if (!needsNextBoundaryRecovery$1(current)) return current;
	const siblingText = getAdjacentSiblingText$1(node, parent, state, 1);
	return siblingText ? firstCodePoint$1(siblingText) : current;
}
function needsPreviousBoundaryRecovery$1(codePoint) {
	return codePoint !== null && 56320 <= codePoint && codePoint <= 57343;
}
function needsNextBoundaryRecovery$1(codePoint) {
	return codePoint !== null && 55296 <= codePoint && codePoint <= 56319;
}
function needsPreviousContext$1(current, previous) {
	return isNonEmojiGeneralUseVS(classifyCharacter(current)) && (previous === null || previous === codes.eof);
}
function getAdjacentSiblingText$1(node, parent, state, offset) {
	if (!parent) return;
	const stackIndex = state.indexStack.at(-1);
	const siblings = parent.children;
	const index = typeof stackIndex === "number" ? stackIndex : siblings.indexOf(node);
	if (index < 0) return;
	const sibling = siblings[index + offset];
	return getNodeTextContent$1(sibling) || void 0;
}
function shouldEncodeAfterSupplementaryText$1(parent, state) {
	if (!parent) return false;
	const stackIndex = state.indexStack.at(-1);
	if (typeof stackIndex !== "number") return false;
	const sibling = parent.children[stackIndex + 1];
	return sibling?.type === "text" && (firstCodePoint$1(sibling.value) ?? 0) > 65535;
}
function getCjkFriendlyState$1(state) {
	return state;
}
function getNodeTextContent$1(node) {
	if (!node || typeof node !== "object") return "";
	if ("value" in node && typeof node.value === "string") return node.value;
	if ("alt" in node && typeof node.alt === "string") return node.alt;
	if ("children" in node && Array.isArray(node.children)) return node.children.map(getNodeTextContent$1).join("");
	return "";
}
function encodeCharacterReference$1(codePoint) {
	return `&#x${(codePoint ?? 0).toString(16).toUpperCase()};`;
}
function encodeFirstCodePoint$1(value) {
	const [first = ""] = [...value];
	return encodeCharacterReference$1(first.codePointAt(0) ?? codes.eof) + value.slice(first.length);
}
function encodeLastCodePoint$1(value) {
	const characters = [...value];
	const last = characters.pop();
	return `${characters.join("")}${encodeCharacterReference$1(last?.codePointAt(0) ?? codes.eof)}`;
}
function codePointBeforeLast$1(value) {
	const characters = [...value];
	characters.pop();
	return characters.at(-1)?.codePointAt(0) ?? codes.eof;
}
function firstCodePoint$1(value) {
	return value.codePointAt(0) ?? codes.eof;
}
function lastCodePoint$1(value) {
	return [...value].at(-1)?.codePointAt(0) ?? codes.eof;
}
var encodedBoundaryBeforeContext$1 = {
	current: encodedOutsideBoundary$1,
	previous: codes.eof
};
var encodedBoundaryAfter$1 = encodedInsideBoundary$1;
//#endregion
//#region node_modules/remark-cjk-friendly/dist/serializeOnly.js
/**
* Make Markdown emphasis (`**`) in CommonMark more friendly with Chinese, Japanese, and Korean (CJK).
*
* This plugin only supports serializing.
*/
function remarkCjkFriendly$1() {
	const data = this.data();
	(data.toMarkdownExtensions || (data.toMarkdownExtensions = [])).push(cjkFriendlyToMarkdown());
}
//#endregion
//#region node_modules/remark-cjk-friendly/dist/bidi.js
/**
* Make Markdown emphasis (`**`) in CommonMark more friendly with Chinese, Japanese, and Korean (CJK).
*
* This plugin supports both parsing and serializing. If you want to support only one of them, it is recommended to import this plugin from `remark-cjk-friendly/parseOnly` or `remark-cjk-friendly/serializeOnly` instead to minimize bundled dependencies.
*/
function remarkCjkFriendly() {
	remarkCjkFriendly$2.call(this);
	remarkCjkFriendly$1.call(this);
}
//#endregion
//#region node_modules/remark-cjk-friendly/dist/index.js
var src_default$1 = remarkCjkFriendly;
//#endregion
//#region node_modules/micromark-extension-cjk-friendly-gfm-strikethrough/dist/strikethrough.js
/**
* Create an extension for `micromark` to enable GFM strikethrough syntax.
*
* @param {Options | null | undefined} [options={}]
*   Configuration.
* @returns {Extension}
*   Extension for `micromark` that can be passed in `extensions`, to
*   enable GFM strikethrough syntax.
*/
function gfmStrikethroughCjkFriendly(options) {
	let single = (options || {}).singleTilde;
	const tokenizer = {
		name: "strikethrough",
		tokenize: tokenizeStrikethrough,
		resolveAll: resolveAllStrikethrough
	};
	if (single === null || single === void 0) single = true;
	return {
		text: { [codes.tilde]: tokenizer },
		insideSpan: { null: [tokenizer] },
		attentionMarkers: { null: [codes.tilde] }
	};
	/**
	* Take events and resolve strikethrough.
	*
	* @type {Resolver}
	*/
	function resolveAllStrikethrough(events, context) {
		let index = -1;
		while (++index < events.length) if (events[index][0] === "enter" && events[index][1].type === "strikethroughSequenceTemporary" && events[index][1]._close) {
			let open = index;
			while (open--) if (events[open][0] === "exit" && events[open][1].type === "strikethroughSequenceTemporary" && events[open][1]._open && events[index][1].end.offset - events[index][1].start.offset === events[open][1].end.offset - events[open][1].start.offset) {
				events[index][1].type = "strikethroughSequence";
				events[open][1].type = "strikethroughSequence";
				const strikethrough = {
					type: "strikethrough",
					start: Object.assign({}, events[open][1].start),
					end: Object.assign({}, events[index][1].end)
				};
				const text = {
					type: "strikethroughText",
					start: Object.assign({}, events[open][1].end),
					end: Object.assign({}, events[index][1].start)
				};
				/** @type {Array<Event>} */
				const nextEvents = [
					[
						"enter",
						strikethrough,
						context
					],
					[
						"enter",
						events[open][1],
						context
					],
					[
						"exit",
						events[open][1],
						context
					],
					[
						"enter",
						text,
						context
					]
				];
				const insideSpan = context.parser.constructs.insideSpan.null;
				if (insideSpan) splice(nextEvents, nextEvents.length, 0, resolveAll(insideSpan, events.slice(open + 1, index), context));
				splice(nextEvents, nextEvents.length, 0, [
					[
						"exit",
						text,
						context
					],
					[
						"enter",
						events[index][1],
						context
					],
					[
						"exit",
						events[index][1],
						context
					],
					[
						"exit",
						strikethrough,
						context
					]
				]);
				splice(events, open - 1, index - open + 3, nextEvents);
				index = open + nextEvents.length - 2;
				break;
			}
		}
		index = -1;
		while (++index < events.length) if (events[index][1].type === "strikethroughSequenceTemporary") events[index][1].type = types.data;
		return events;
	}
	/**
	* @type {Tokenizer}
	*/
	function tokenizeStrikethrough(effects, ok$1$1, nok) {
		const { now, sliceSerialize, previous: tentativePrevious } = this;
		const previous = isCodeLowSurrogate(tentativePrevious) ? tryGetGenuinePreviousCode(tentativePrevious, now(), sliceSerialize) : tentativePrevious;
		const before = classifyCharacter(previous);
		const twoPrevious = new TwoPreviousCode(previous, now(), sliceSerialize);
		const beforePrimary = classifyPrecedingCharacter(before, twoPrevious.value.bind(twoPrevious), previous);
		const events = this.events;
		let size = 0;
		return start;
		function start(code) {
			codes.tilde;
			if (previous === codes.tilde && events[events.length - 1][1].type !== types.characterEscape) return nok(code);
			effects.enter("strikethroughSequenceTemporary");
			return more(code);
		}
		/** @type {State} */
		function more(code) {
			const before$1 = classifyCharacter(previous);
			if (code === codes.tilde) {
				if (size > 1) return nok(code);
				effects.consume(code);
				size++;
				return more;
			}
			if (size < 2 && !single) return nok(code);
			const token = effects.exit("strikethroughSequenceTemporary");
			const after = classifyCharacter(isCodeHighSurrogate(code) ? tryGetGenuineNextCode(code, now(), sliceSerialize) : code);
			const beforeSpaceOrNonCjkPunctuation = isNonCjkPunctuation(beforePrimary) || isUnicodeWhitespace(beforePrimary);
			const afterSpaceOrNonCjkPunctuation = isNonCjkPunctuation(after) || isUnicodeWhitespace(after);
			const beforeCjkOrIvs = isCjk(beforePrimary) || isIvs(before$1);
			token._open = !afterSpaceOrNonCjkPunctuation || after === constants.attentionSideAfter && (beforeSpaceOrNonCjkPunctuation || beforeCjkOrIvs);
			token._close = !beforeSpaceOrNonCjkPunctuation || before$1 === constants.attentionSideAfter && (afterSpaceOrNonCjkPunctuation || isCjk(after));
			return ok$1$1(code);
		}
	}
}
//#endregion
//#region node_modules/remark-cjk-friendly-gfm-strikethrough/dist/parseOnly.js
/**
* Make Markdown strikethrough (`~~`) in GFM more friendly with Chinese, Japanese, and Korean (CJK).
*
* This plugin only supports parsing. If you have been using `remark-cjk-friendly-gfm-strikethrough` since v2.0.1 or earlier, it is recommended to migrate to this to minimize bundled dependencies.
*/
function remarkCjkFriendlyGfmStrikethrough$1(options) {
	const data = this.data();
	(data.micromarkExtensions || (data.micromarkExtensions = [])).push(gfmStrikethroughCjkFriendly(options));
}
//#endregion
//#region node_modules/mdast-util-to-markdown-cjk-friendly-gfm-strikethrough/dist/index.mjs
var constructsWithoutStrikethrough = [
	"autolink",
	"destinationLiteral",
	"destinationRaw",
	"reference",
	"titleQuote",
	"titleApostrophe"
];
var encodedOutsideBoundary = ";".codePointAt(0) ?? codes.eof;
var encodedInsideBoundary = "&".codePointAt(0) ?? codes.eof;
/**
* Add the GFM strikethrough `toMarkdown` extension used by the CJK-friendly remark plugin.
*/
function cjkFriendlyGfmStrikethroughToMarkdown() {
	return {
		unsafe: [{
			character: "~",
			inConstruct: "phrasing",
			notInConstruct: constructsWithoutStrikethrough
		}],
		handlers: {
			delete: handleDelete,
			text
		}
	};
}
handleDelete.peek = peekDelete;
function handleDelete(node, parent, state, info) {
	const sequence = "~~";
	const exit = state.enter("strikethrough");
	const tracker = state.createTracker(info);
	const before = tracker.move(sequence);
	let between = tracker.move(state.containerPhrasing(node, {
		after: "~",
		before,
		...tracker.current()
	}));
	const beforeBoundary = resolveBeforeBoundary(node, parent, state, info.before);
	const afterBoundary = resolveAfterBoundary(node, parent, state, info.after);
	const open = encodeInfoCjk(beforeBoundary, firstCodePoint(between), "open");
	if (open.inside && between) between = encodeFirstCodePoint(between);
	const close = encodeInfoCjk({
		current: lastCodePoint(between),
		previous: codePointBeforeLast(between)
	}, afterBoundary, "close");
	if (close.inside && between) between = encodeLastCodePoint(between);
	const after = tracker.move(sequence);
	exit();
	const encodeAfterSupplementary = close.outside && shouldEncodeAfterSupplementaryText(parent, state);
	state.attentionEncodeSurroundingInfo = {
		after: close.outside && !encodeAfterSupplementary,
		before: open.outside
	};
	getCjkFriendlyState(state).cjkFriendlyEncodeAfterSupplementaryText = encodeAfterSupplementary;
	return before + between + after;
}
function text(node, _parent, state, info) {
	const cjkFriendlyState = getCjkFriendlyState(state);
	if (!cjkFriendlyState.cjkFriendlyEncodeAfterSupplementaryText) return state.safe(node.value, info);
	cjkFriendlyState.cjkFriendlyEncodeAfterSupplementaryText = false;
	const [first = ""] = [...node.value];
	const rest = node.value.slice(first.length);
	return `${encodeCharacterReference(first.codePointAt(0) ?? codes.eof)}${state.safe(rest, {
		...info,
		before: ";"
	})}`;
}
function peekDelete() {
	return "~";
}
function encodeInfoCjk(before, after, target) {
	const beforeKind = classifyBoundaryBefore(before);
	const afterKind = classifyCharacter(after);
	if (!isCjkOrIvs(beforeKind) && !isCjkOrIvs(afterKind)) return target === "open" ? encodeInfoFallback(beforeKind, afterKind) : encodeInfoFallback(afterKind, beforeKind);
	const raw = {
		inside: false,
		outside: false
	};
	const preserveOutside = {
		inside: true,
		outside: false
	};
	const preserveInside = {
		inside: false,
		outside: true
	};
	const encodeBoth = {
		inside: true,
		outside: true
	};
	for (const candidate of [
		raw,
		preserveOutside,
		preserveInside,
		encodeBoth
	]) {
		const candidateBefore = target === "open" ? candidate.outside ? encodedBoundaryBeforeContext : before : candidate.inside ? encodedBoundaryBeforeContext : before;
		const candidateAfter = target === "open" ? candidate.inside ? encodedBoundaryAfter : after : candidate.outside ? encodedBoundaryAfter : after;
		if (target === "open" ? canOpen(candidateBefore, candidateAfter) : canClose(candidateBefore, candidateAfter)) return candidate;
	}
	return encodeBoth;
}
function encodeInfoFallback(outsideKind, insideKind) {
	if (isLetterLike(outsideKind)) return isLetterLike(insideKind) ? {
		inside: false,
		outside: false
	} : isUnicodeWhitespace(insideKind) ? {
		inside: true,
		outside: true
	} : {
		inside: false,
		outside: true
	};
	if (isUnicodeWhitespace(outsideKind)) return isLetterLike(insideKind) ? {
		inside: false,
		outside: false
	} : isUnicodeWhitespace(insideKind) ? {
		inside: true,
		outside: true
	} : {
		inside: false,
		outside: false
	};
	return isUnicodeWhitespace(insideKind) ? {
		inside: true,
		outside: false
	} : {
		inside: false,
		outside: false
	};
}
function canOpen(before, afterCode) {
	const { open } = getAttentionSides(classifyBoundaryBefore(before), classifyCharacter(afterCode));
	return open;
}
function canClose(before, afterCode) {
	const afterKind = classifyCharacter(afterCode);
	const { close } = getAttentionSides(classifyBoundaryBefore(before), afterKind);
	return close;
}
function getAttentionSides(beforeKind, afterKind) {
	const beforeNonCjkPunctuation = isNonCjkPunctuation(beforeKind);
	const beforeSpaceOrNonCjkPunctuation = beforeNonCjkPunctuation || isUnicodeWhitespace(beforeKind);
	const afterNonCjkPunctuation = isNonCjkPunctuation(afterKind);
	const afterSpaceOrNonCjkPunctuation = afterNonCjkPunctuation || isUnicodeWhitespace(afterKind);
	return {
		open: !afterSpaceOrNonCjkPunctuation || afterNonCjkPunctuation && (beforeSpaceOrNonCjkPunctuation || isCjkOrIvs(beforeKind)),
		close: !beforeSpaceOrNonCjkPunctuation || beforeNonCjkPunctuation && (afterSpaceOrNonCjkPunctuation || isCjk(afterKind))
	};
}
function isLetterLike(kind) {
	return !isUnicodeWhitespace(kind) && !isNonCjkPunctuation(kind);
}
function classifyBoundaryBefore(before) {
	const kind = classifyCharacter(before.current);
	return before.current === null || !isNonEmojiGeneralUseVS(kind) ? kind : classifyPrecedingCharacter(kind, () => before.previous, before.current);
}
function resolveBeforeBoundary(node, parent, state, fallback) {
	let current = lastCodePoint(fallback);
	let previous = codePointBeforeLast(fallback);
	if (needsPreviousBoundaryRecovery(current) || needsPreviousContext(current, previous)) {
		const siblingText = getAdjacentSiblingText(node, parent, state, -1);
		if (siblingText) {
			current = lastCodePoint(siblingText);
			previous = codePointBeforeLast(siblingText);
		}
	}
	return {
		current,
		previous
	};
}
function resolveAfterBoundary(node, parent, state, fallback) {
	const current = firstCodePoint(fallback);
	if (!needsNextBoundaryRecovery(current)) return current;
	const siblingText = getAdjacentSiblingText(node, parent, state, 1);
	return siblingText ? firstCodePoint(siblingText) : current;
}
function needsPreviousBoundaryRecovery(codePoint) {
	return codePoint !== null && 56320 <= codePoint && codePoint <= 57343;
}
function needsNextBoundaryRecovery(codePoint) {
	return codePoint !== null && 55296 <= codePoint && codePoint <= 56319;
}
function needsPreviousContext(current, previous) {
	return isNonEmojiGeneralUseVS(classifyCharacter(current)) && (previous === null || previous === codes.eof);
}
function getAdjacentSiblingText(node, parent, state, offset) {
	if (!parent) return;
	const stackIndex = state.indexStack.at(-1);
	const siblings = parent.children;
	const index = typeof stackIndex === "number" ? stackIndex : siblings.indexOf(node);
	if (index < 0) return;
	const sibling = siblings[index + offset];
	return getNodeTextContent(sibling) || void 0;
}
function shouldEncodeAfterSupplementaryText(parent, state) {
	if (!parent) return false;
	const stackIndex = state.indexStack.at(-1);
	if (typeof stackIndex !== "number") return false;
	const sibling = parent.children[stackIndex + 1];
	return sibling?.type === "text" && (firstCodePoint(sibling.value) ?? 0) > 65535;
}
function getCjkFriendlyState(state) {
	return state;
}
function getNodeTextContent(node) {
	if (!node || typeof node !== "object") return "";
	if ("value" in node && typeof node.value === "string") return node.value;
	if ("alt" in node && typeof node.alt === "string") return node.alt;
	if ("children" in node && Array.isArray(node.children)) return node.children.map(getNodeTextContent).join("");
	return "";
}
function encodeCharacterReference(codePoint) {
	return `&#x${(codePoint ?? 0).toString(16).toUpperCase()};`;
}
function encodeFirstCodePoint(value) {
	const [first = ""] = [...value];
	return encodeCharacterReference(first.codePointAt(0) ?? codes.eof) + value.slice(first.length);
}
function encodeLastCodePoint(value) {
	const characters = [...value];
	const last = characters.pop();
	return `${characters.join("")}${encodeCharacterReference(last?.codePointAt(0) ?? codes.eof)}`;
}
function codePointBeforeLast(value) {
	const characters = [...value];
	characters.pop();
	return characters.at(-1)?.codePointAt(0) ?? codes.eof;
}
function firstCodePoint(value) {
	return value.codePointAt(0) ?? codes.eof;
}
function lastCodePoint(value) {
	return [...value].at(-1)?.codePointAt(0) ?? codes.eof;
}
var encodedBoundaryBeforeContext = {
	current: encodedOutsideBoundary,
	previous: codes.eof
};
var encodedBoundaryAfter = encodedInsideBoundary;
//#endregion
//#region node_modules/remark-cjk-friendly-gfm-strikethrough/dist/serializeOnly.js
/**
* Make Markdown strikethrough (`~~`) in GFM more friendly with Chinese, Japanese, and Korean (CJK).
*
* This plugin only supports serializing.
*/
function remarkCjkFriendlyGfmStrikethrough() {
	const data = this.data();
	(data.toMarkdownExtensions || (data.toMarkdownExtensions = [])).push(cjkFriendlyGfmStrikethroughToMarkdown());
}
//#endregion
//#region node_modules/remark-cjk-friendly-gfm-strikethrough/dist/bidi.js
/**
* Make Markdown strikethrough (`~~`) in GFM more friendly with Chinese, Japanese, and Korean (CJK)
*
* This plugin supports both parsing and serializing. If you want to support only one of them, it is recommended to import this plugin from `remark-cjk-friendly-gfm-strikethrough/parseOnly` or `remark-cjk-friendly-gfm-strikethrough/serializeOnly` instead to minimize bundled dependencies.
*/
function remarkGfmStrikethroughCjkFriendly(options) {
	remarkCjkFriendlyGfmStrikethrough$1.call(this, options);
	remarkCjkFriendlyGfmStrikethrough.call(this);
}
//#endregion
//#region node_modules/remark-cjk-friendly-gfm-strikethrough/dist/index.js
var src_default = remarkGfmStrikethroughCjkFriendly;
//#endregion
//#region node_modules/unist-util-is/lib/index.js
/**
* Generate an assertion from a test.
*
* Useful if you’re going to test many nodes, for example when creating a
* utility where something else passes a compatible test.
*
* The created function is a bit faster because it expects valid input only:
* a `node`, `index`, and `parent`.
*
* @param {Test} test
*   *   when nullish, checks if `node` is a `Node`.
*   *   when `string`, works like passing `(node) => node.type === test`.
*   *   when `function` checks if function passed the node is true.
*   *   when `object`, checks that all keys in test are in node, and that they have (strictly) equal values.
*   *   when `array`, checks if any one of the subtests pass.
* @returns {Check}
*   An assertion.
*/
var convert = (
/**
* @param {Test} [test]
* @returns {Check}
*/
function(test) {
	if (test === null || test === void 0) return ok;
	if (typeof test === "function") return castFactory(test);
	if (typeof test === "object") return Array.isArray(test) ? anyFactory(test) : propertiesFactory(test);
	if (typeof test === "string") return typeFactory(test);
	throw new Error("Expected function, string, or object as test");
});
/**
* @param {Array<Props | TestFunction | string>} tests
* @returns {Check}
*/
function anyFactory(tests) {
	/** @type {Array<Check>} */
	const checks = [];
	let index = -1;
	while (++index < tests.length) checks[index] = convert(tests[index]);
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
* Turn an object into a test for a node with a certain fields.
*
* @param {Props} check
* @returns {Check}
*/
function propertiesFactory(check) {
	const checkAsRecord = check;
	return castFactory(all);
	/**
	* @param {Node} node
	* @returns {boolean}
	*/
	function all(node) {
		const nodeAsRecord = node;
		/** @type {string} */
		let key;
		for (key in check) if (nodeAsRecord[key] !== checkAsRecord[key]) return false;
		return true;
	}
}
/**
* Turn a string into a test for a node with a certain type.
*
* @param {string} check
* @returns {Check}
*/
function typeFactory(check) {
	return castFactory(type);
	/**
	* @param {Node} node
	*/
	function type(node) {
		return node && node.type === check;
	}
}
/**
* Turn a custom test into a test for a node that passes that test.
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
		return Boolean(looksLikeANode(value) && testFunction.call(this, value, typeof index === "number" ? index : void 0, parent || void 0));
	}
}
function ok() {
	return true;
}
/**
* @param {unknown} value
* @returns {value is Node}
*/
function looksLikeANode(value) {
	return value !== null && typeof value === "object" && "type" in value;
}
//#endregion
//#region node_modules/unist-util-visit-parents/lib/color.node.js
/**
* @param {string} d
* @returns {string}
*/
function color(d) {
	return "\x1B[33m" + d + "\x1B[39m";
}
//#endregion
//#region node_modules/unist-util-visit-parents/lib/index.js
/**
* @import {Node as UnistNode, Parent as UnistParent} from 'unist'
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
*   Check extends ReadonlyArray<infer T>
*   ? MatchesOne<Value, T>
*   : Check extends Array<infer T>
*   ? MatchesOne<Value, T>
*   : MatchesOne<Value, Check>
* )} Matches
*   Check whether a node matches a check in the type system.
* @template Value
*   Value; typically unist `Node`.
* @template Check
*   Value; typically `unist-util-is`-compatible test.
*/
/**
* @typedef {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10} Uint
*   Number; capped reasonably.
*/
/**
* @typedef {I extends 0 ? 1 : I extends 1 ? 2 : I extends 2 ? 3 : I extends 3 ? 4 : I extends 4 ? 5 : I extends 5 ? 6 : I extends 6 ? 7 : I extends 7 ? 8 : I extends 8 ? 9 : 10} Increment
*   Increment a number in the type system.
* @template {Uint} [I=0]
*   Index.
*/
/**
* @typedef {(
*   Node extends UnistParent
*   ? Node extends {children: Array<infer Children>}
*     ? Child extends Children ? Node : never
*     : never
*   : never
* )} InternalParent
*   Collect nodes that can be parents of `Child`.
* @template {UnistNode} Node
*   All node types in a tree.
* @template {UnistNode} Child
*   Node to search for.
*/
/**
* @typedef {InternalParent<InclusiveDescendant<Tree>, Child>} Parent
*   Collect nodes in `Tree` that can be parents of `Child`.
* @template {UnistNode} Tree
*   All node types in a tree.
* @template {UnistNode} Child
*   Node to search for.
*/
/**
* @typedef {(
*   Depth extends Max
*   ? never
*   :
*     | InternalParent<Node, Child>
*     | InternalAncestor<Node, InternalParent<Node, Child>, Max, Increment<Depth>>
* )} InternalAncestor
*   Collect nodes in `Tree` that can be ancestors of `Child`.
* @template {UnistNode} Node
*   All node types in a tree.
* @template {UnistNode} Child
*   Node to search for.
* @template {Uint} [Max=10]
*   Max; searches up to this depth.
* @template {Uint} [Depth=0]
*   Current depth.
*/
/**
* @typedef {InternalAncestor<InclusiveDescendant<Tree>, Child>} Ancestor
*   Collect nodes in `Tree` that can be ancestors of `Child`.
* @template {UnistNode} Tree
*   All node types in a tree.
* @template {UnistNode} Child
*   Node to search for.
*/
/**
* @typedef {(
*   Tree extends UnistParent
*     ? Depth extends Max
*       ? Tree
*       : Tree | InclusiveDescendant<Tree['children'][number], Max, Increment<Depth>>
*     : Tree
* )} InclusiveDescendant
*   Collect all (inclusive) descendants of `Tree`.
*
*   > 👉 **Note**: for performance reasons, this seems to be the fastest way to
*   > recurse without actually running into an infinite loop, which the
*   > previous version did.
*   >
*   > Practically, a max of `2` is typically enough assuming a `Root` is
*   > passed, but it doesn’t improve performance.
*   > It gets higher with `List > ListItem > Table > TableRow > TableCell`.
*   > Using up to `10` doesn’t hurt or help either.
* @template {UnistNode} Tree
*   Tree type.
* @template {Uint} [Max=10]
*   Max; searches up to this depth.
* @template {Uint} [Depth=0]
*   Current depth.
*/
/**
* @typedef {'skip' | boolean} Action
*   Union of the action types.
*
* @typedef {number} Index
*   Move to the sibling at `index` next (after node itself is completely
*   traversed).
*
*   Useful if mutating the tree, such as removing the node the visitor is
*   currently on, or any of its previous siblings.
*   Results less than 0 or greater than or equal to `children.length` stop
*   traversing the parent.
*
* @typedef {[(Action | null | undefined | void)?, (Index | null | undefined)?]} ActionTuple
*   List with one or two values, the first an action, the second an index.
*
* @typedef {Action | ActionTuple | Index | null | undefined | void} VisitorResult
*   Any value that can be returned from a visitor.
*/
/**
* @callback Visitor
*   Handle a node (matching `test`, if given).
*
*   Visitors are free to transform `node`.
*   They can also transform the parent of node (the last of `ancestors`).
*
*   Replacing `node` itself, if `SKIP` is not returned, still causes its
*   descendants to be walked (which is a bug).
*
*   When adding or removing previous siblings of `node` (or next siblings, in
*   case of reverse), the `Visitor` should return a new `Index` to specify the
*   sibling to traverse after `node` is traversed.
*   Adding or removing next siblings of `node` (or previous siblings, in case
*   of reverse) is handled as expected without needing to return a new `Index`.
*
*   Removing the children property of an ancestor still results in them being
*   traversed.
* @param {Visited} node
*   Found node.
* @param {Array<VisitedParents>} ancestors
*   Ancestors of `node`.
* @returns {VisitorResult}
*   What to do next.
*
*   An `Index` is treated as a tuple of `[CONTINUE, Index]`.
*   An `Action` is treated as a tuple of `[Action]`.
*
*   Passing a tuple back only makes sense if the `Action` is `SKIP`.
*   When the `Action` is `EXIT`, that action can be returned.
*   When the `Action` is `CONTINUE`, `Index` can be returned.
* @template {UnistNode} [Visited=UnistNode]
*   Visited node type.
* @template {UnistParent} [VisitedParents=UnistParent]
*   Ancestor type.
*/
/**
* @typedef {Visitor<Matches<InclusiveDescendant<Tree>, Check>, Ancestor<Tree, Matches<InclusiveDescendant<Tree>, Check>>>} BuildVisitor
*   Build a typed `Visitor` function from a tree and a test.
*
*   It will infer which values are passed as `node` and which as `parents`.
* @template {UnistNode} [Tree=UnistNode]
*   Tree type.
* @template {Test} [Check=Test]
*   Test type.
*/
/** @type {Readonly<ActionTuple>} */
var empty = [];
/**
* Do not traverse this node’s children.
*/
var SKIP = "skip";
/**
* Visit nodes, with ancestral information.
*
* This algorithm performs *depth-first* *tree traversal* in *preorder*
* (**NLR**) or if `reverse` is given, in *reverse preorder* (**NRL**).
*
* You can choose for which nodes `visitor` is called by passing a `test`.
* For complex tests, you should test yourself in `visitor`, as it will be
* faster and will have improved type information.
*
* Walking the tree is an intensive task.
* Make use of the return values of the visitor when possible.
* Instead of walking a tree multiple times, walk it once, use `unist-util-is`
* to check if a node matches, and then perform different operations.
*
* You can change the tree.
* See `Visitor` for more info.
*
* @overload
* @param {Tree} tree
* @param {Check} check
* @param {BuildVisitor<Tree, Check>} visitor
* @param {boolean | null | undefined} [reverse]
* @returns {undefined}
*
* @overload
* @param {Tree} tree
* @param {BuildVisitor<Tree>} visitor
* @param {boolean | null | undefined} [reverse]
* @returns {undefined}
*
* @param {UnistNode} tree
*   Tree to traverse.
* @param {Visitor | Test} test
*   `unist-util-is`-compatible test
* @param {Visitor | boolean | null | undefined} [visitor]
*   Handle each node.
* @param {boolean | null | undefined} [reverse]
*   Traverse in reverse preorder (NRL) instead of the default preorder (NLR).
* @returns {undefined}
*   Nothing.
*
* @template {UnistNode} Tree
*   Node type.
* @template {Test} Check
*   `unist-util-is`-compatible test.
*/
function visitParents(tree, test, visitor, reverse) {
	/** @type {Test} */
	let check;
	if (typeof test === "function" && typeof visitor !== "function") {
		reverse = visitor;
		visitor = test;
	} else check = test;
	const is = convert(check);
	const step = reverse ? -1 : 1;
	factory(tree, void 0, [])();
	/**
	* @param {UnistNode} node
	* @param {number | undefined} index
	* @param {Array<UnistParent>} parents
	*/
	function factory(node, index, parents) {
		const value = node && typeof node === "object" ? node : {};
		if (typeof value.type === "string") {
			const name = typeof value.tagName === "string" ? value.tagName : typeof value.name === "string" ? value.name : void 0;
			Object.defineProperty(visit, "name", { value: "node (" + color(node.type + (name ? "<" + name + ">" : "")) + ")" });
		}
		return visit;
		function visit() {
			/** @type {Readonly<ActionTuple>} */
			let result = empty;
			/** @type {Readonly<ActionTuple>} */
			let subresult;
			/** @type {number} */
			let offset;
			/** @type {Array<UnistParent>} */
			let grandparents;
			if (!test || is(node, index, parents[parents.length - 1] || void 0)) {
				result = toResult(visitor(node, parents));
				if (result[0] === false) return result;
			}
			if ("children" in node && node.children) {
				const nodeAsParent = node;
				if (nodeAsParent.children && result[0] !== "skip") {
					offset = (reverse ? nodeAsParent.children.length : -1) + step;
					grandparents = parents.concat(nodeAsParent);
					while (offset > -1 && offset < nodeAsParent.children.length) {
						const child = nodeAsParent.children[offset];
						subresult = factory(child, offset, grandparents)();
						if (subresult[0] === false) return subresult;
						offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
					}
				}
			}
			return result;
		}
	}
}
/**
* Turn a return value into a clean result.
*
* @param {VisitorResult} value
*   Valid return values from visitors.
* @returns {Readonly<ActionTuple>}
*   Clean result.
*/
function toResult(value) {
	if (Array.isArray(value)) return value;
	if (typeof value === "number") return [true, value];
	return value === null || value === void 0 ? empty : [value];
}
//#endregion
//#region node_modules/unist-util-visit/lib/index.js
/**
* @import {Node as UnistNode, Parent as UnistParent} from 'unist'
* @import {VisitorResult} from 'unist-util-visit-parents'
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
*   Check extends ReadonlyArray<any>
*   ? MatchesOne<Value, Check[number]>
*   : MatchesOne<Value, Check>
* )} Matches
*   Check whether a node matches a check in the type system.
* @template Value
*   Value; typically unist `Node`.
* @template Check
*   Value; typically `unist-util-is`-compatible test.
*/
/**
* @typedef {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10} Uint
*   Number; capped reasonably.
*/
/**
* @typedef {I extends 0 ? 1 : I extends 1 ? 2 : I extends 2 ? 3 : I extends 3 ? 4 : I extends 4 ? 5 : I extends 5 ? 6 : I extends 6 ? 7 : I extends 7 ? 8 : I extends 8 ? 9 : 10} Increment
*   Increment a number in the type system.
* @template {Uint} [I=0]
*   Index.
*/
/**
* @typedef {(
*   Node extends UnistParent
*   ? Node extends {children: Array<infer Children>}
*     ? Child extends Children ? Node : never
*     : never
*   : never
* )} InternalParent
*   Collect nodes that can be parents of `Child`.
* @template {UnistNode} Node
*   All node types in a tree.
* @template {UnistNode} Child
*   Node to search for.
*/
/**
* @typedef {InternalParent<InclusiveDescendant<Tree>, Child>} Parent
*   Collect nodes in `Tree` that can be parents of `Child`.
* @template {UnistNode} Tree
*   All node types in a tree.
* @template {UnistNode} Child
*   Node to search for.
*/
/**
* @typedef {(
*   Depth extends Max
*   ? never
*   :
*     | InternalParent<Node, Child>
*     | InternalAncestor<Node, InternalParent<Node, Child>, Max, Increment<Depth>>
* )} InternalAncestor
*   Collect nodes in `Tree` that can be ancestors of `Child`.
* @template {UnistNode} Node
*   All node types in a tree.
* @template {UnistNode} Child
*   Node to search for.
* @template {Uint} [Max=10]
*   Max; searches up to this depth.
* @template {Uint} [Depth=0]
*   Current depth.
*/
/**
* @typedef {(
*   Tree extends UnistParent
*     ? Depth extends Max
*       ? Tree
*       : Tree | InclusiveDescendant<Tree['children'][number], Max, Increment<Depth>>
*     : Tree
* )} InclusiveDescendant
*   Collect all (inclusive) descendants of `Tree`.
*
*   > 👉 **Note**: for performance reasons, this seems to be the fastest way to
*   > recurse without actually running into an infinite loop, which the
*   > previous version did.
*   >
*   > Practically, a max of `2` is typically enough assuming a `Root` is
*   > passed, but it doesn’t improve performance.
*   > It gets higher with `List > ListItem > Table > TableRow > TableCell`.
*   > Using up to `10` doesn’t hurt or help either.
* @template {UnistNode} Tree
*   Tree type.
* @template {Uint} [Max=10]
*   Max; searches up to this depth.
* @template {Uint} [Depth=0]
*   Current depth.
*/
/**
* @callback Visitor
*   Handle a node (matching `test`, if given).
*
*   Visitors are free to transform `node`.
*   They can also transform `parent`.
*
*   Replacing `node` itself, if `SKIP` is not returned, still causes its
*   descendants to be walked (which is a bug).
*
*   When adding or removing previous siblings of `node` (or next siblings, in
*   case of reverse), the `Visitor` should return a new `Index` to specify the
*   sibling to traverse after `node` is traversed.
*   Adding or removing next siblings of `node` (or previous siblings, in case
*   of reverse) is handled as expected without needing to return a new `Index`.
*
*   Removing the children property of `parent` still results in them being
*   traversed.
* @param {Visited} node
*   Found node.
* @param {Visited extends UnistNode ? number | undefined : never} index
*   Index of `node` in `parent`.
* @param {Ancestor extends UnistParent ? Ancestor | undefined : never} parent
*   Parent of `node`.
* @returns {VisitorResult}
*   What to do next.
*
*   An `Index` is treated as a tuple of `[CONTINUE, Index]`.
*   An `Action` is treated as a tuple of `[Action]`.
*
*   Passing a tuple back only makes sense if the `Action` is `SKIP`.
*   When the `Action` is `EXIT`, that action can be returned.
*   When the `Action` is `CONTINUE`, `Index` can be returned.
* @template {UnistNode} [Visited=UnistNode]
*   Visited node type.
* @template {UnistParent} [Ancestor=UnistParent]
*   Ancestor type.
*/
/**
* @typedef {Visitor<Visited, Parent<Ancestor, Visited>>} BuildVisitorFromMatch
*   Build a typed `Visitor` function from a node and all possible parents.
*
*   It will infer which values are passed as `node` and which as `parent`.
* @template {UnistNode} Visited
*   Node type.
* @template {UnistParent} Ancestor
*   Parent type.
*/
/**
* @typedef {(
*   BuildVisitorFromMatch<
*     Matches<Descendant, Check>,
*     Extract<Descendant, UnistParent>
*   >
* )} BuildVisitorFromDescendants
*   Build a typed `Visitor` function from a list of descendants and a test.
*
*   It will infer which values are passed as `node` and which as `parent`.
* @template {UnistNode} Descendant
*   Node type.
* @template {Test} Check
*   Test type.
*/
/**
* @typedef {(
*   BuildVisitorFromDescendants<
*     InclusiveDescendant<Tree>,
*     Check
*   >
* )} BuildVisitor
*   Build a typed `Visitor` function from a tree and a test.
*
*   It will infer which values are passed as `node` and which as `parent`.
* @template {UnistNode} [Tree=UnistNode]
*   Node type.
* @template {Test} [Check=Test]
*   Test type.
*/
/**
* Visit nodes.
*
* This algorithm performs *depth-first* *tree traversal* in *preorder*
* (**NLR**) or if `reverse` is given, in *reverse preorder* (**NRL**).
*
* You can choose for which nodes `visitor` is called by passing a `test`.
* For complex tests, you should test yourself in `visitor`, as it will be
* faster and will have improved type information.
*
* Walking the tree is an intensive task.
* Make use of the return values of the visitor when possible.
* Instead of walking a tree multiple times, walk it once, use `unist-util-is`
* to check if a node matches, and then perform different operations.
*
* You can change the tree.
* See `Visitor` for more info.
*
* @overload
* @param {Tree} tree
* @param {Check} check
* @param {BuildVisitor<Tree, Check>} visitor
* @param {boolean | null | undefined} [reverse]
* @returns {undefined}
*
* @overload
* @param {Tree} tree
* @param {BuildVisitor<Tree>} visitor
* @param {boolean | null | undefined} [reverse]
* @returns {undefined}
*
* @param {UnistNode} tree
*   Tree to traverse.
* @param {Visitor | Test} testOrVisitor
*   `unist-util-is`-compatible test (optional, omit to pass a visitor).
* @param {Visitor | boolean | null | undefined} [visitorOrReverse]
*   Handle each node (when test is omitted, pass `reverse`).
* @param {boolean | null | undefined} [maybeReverse=false]
*   Traverse in reverse preorder (NRL) instead of the default preorder (NLR).
* @returns {undefined}
*   Nothing.
*
* @template {UnistNode} Tree
*   Node type.
* @template {Test} Check
*   `unist-util-is`-compatible test.
*/
function visit(tree, testOrVisitor, visitorOrReverse, maybeReverse) {
	/** @type {boolean | null | undefined} */
	let reverse;
	/** @type {Test} */
	let test;
	/** @type {Visitor} */
	let visitor;
	if (typeof testOrVisitor === "function" && typeof visitorOrReverse !== "function") {
		test = void 0;
		visitor = testOrVisitor;
		reverse = visitorOrReverse;
	} else {
		test = testOrVisitor;
		visitor = visitorOrReverse;
		reverse = maybeReverse;
	}
	visitParents(tree, test, overload, reverse);
	/**
	* @param {UnistNode} node
	* @param {Array<UnistParent>} parents
	*/
	function overload(node, parents) {
		const parent = parents[parents.length - 1];
		const index = parent ? parent.children.indexOf(node) : void 0;
		return visitor(node, index, parent);
	}
}
//#endregion
//#region node_modules/@streamdown/cjk/dist/index.js
var k = /* @__PURE__ */ new Set([
	"。",
	"．",
	"，",
	"、",
	"？",
	"！",
	"：",
	"；",
	"（",
	"）",
	"【",
	"】",
	"「",
	"」",
	"『",
	"』",
	"〈",
	"〉",
	"《",
	"》"
]);
var m = /^(https?:\/\/|mailto:|www\.)/i;
var f = (t) => {
	if (t.children.length !== 1) return false;
	let r = t.children[0];
	return r.type === "text" && r.value === t.url;
};
var P = (t) => {
	let r = 0;
	for (let e of t) {
		if (k.has(e)) return r;
		r += e.length;
	}
	return null;
};
var p = (t, r) => ({
	...r,
	url: t,
	children: [{
		type: "text",
		value: t
	}]
});
var d = (t) => ({
	type: "text",
	value: t
});
var y = () => (t) => {
	visit(t, "link", (r, e, i) => {
		if (!i || typeof e != "number" || !f(r) || !m.test(r.url)) return;
		let n = P(r.url);
		if (n === null || n === 0) return;
		let l = r.url.slice(0, n), u = r.url.slice(n), o = p(l, r), s = d(u);
		return i.children.splice(e, 1, o, s), e + 1;
	});
};
function b() {
	let t = [src_default$1], r = [y, src_default];
	return {
		name: "cjk",
		type: "cjk",
		remarkPluginsBefore: t,
		remarkPluginsAfter: r,
		remarkPlugins: [...t, ...r]
	};
}
var A = b();
//#endregion
export { markdownLineEndingOrSpace as _, convert as a, unicodeWhitespace as b, splice as c, asciiAtext as d, asciiControl as f, markdownLineEnding as g, asciiPunctuation as h, visitParents as i, asciiAlpha as l, asciiHexDigit as m, visit as n, resolveAll as o, asciiDigit as p, SKIP as r, push as s, A as t, asciiAlphanumeric as u, markdownSpace as v, ok$1 as x, unicodePunctuation as y };
