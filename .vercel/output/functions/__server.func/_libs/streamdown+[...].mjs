import { i as __toESM, n as __exportAll } from "../_runtime.mjs";
import { l as require_react_dom, u as require_react } from "./@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "./@radix-ui/react-collection+[...].mjs";
import { n as clsx } from "./class-variance-authority+clsx.mjs";
import { i as visitParents, n as visit, r as SKIP } from "./@streamdown/cjk+[...].mjs";
import { a as VFile } from "./@streamdown/math+[...].mjs";
import { t as harden } from "./rehype-harden.mjs";
import { t as rehypeRaw } from "./rehype-raw.mjs";
import { n as defaultSchema } from "./hast-util-sanitize.mjs";
import { t as rehypeSanitize } from "./rehype-sanitize.mjs";
import { t as remarkGfm } from "./remark-gfm.mjs";
import { t as $e$1 } from "./remend.mjs";
import { t as toJsxRuntime } from "./hast-util-to-jsx-runtime+[...].mjs";
import { t as urlAttributes } from "./html-url-attributes.mjs";
import { t as remarkParse } from "./remark-parse.mjs";
import { t as remarkRehype } from "./remark-rehype.mjs";
import { t as bail } from "./bail.mjs";
import { t as require_extend } from "./extend.mjs";
import { t as isPlainObject } from "./is-plain-obj.mjs";
import { t as x } from "./marked.mjs";
//#region node_modules/tailwind-merge/dist/bundle-mjs.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* Concatenates two arrays faster than the array spread operator.
*/
var concatArrays = (array1, array2) => {
	const combinedArray = new Array(array1.length + array2.length);
	for (let i = 0; i < array1.length; i++) combinedArray[i] = array1[i];
	for (let i = 0; i < array2.length; i++) combinedArray[array1.length + i] = array2[i];
	return combinedArray;
};
var createClassValidatorObject = (classGroupId, validator) => ({
	classGroupId,
	validator
});
var createClassPartObject = (nextPart = /* @__PURE__ */ new Map(), validators = null, classGroupId) => ({
	nextPart,
	validators,
	classGroupId
});
var CLASS_PART_SEPARATOR = "-";
var EMPTY_CONFLICTS = [];
var ARBITRARY_PROPERTY_PREFIX = "arbitrary..";
var createClassGroupUtils = (config) => {
	const classMap = createClassMap(config);
	const { conflictingClassGroups, conflictingClassGroupModifiers } = config;
	const getClassGroupId = (className) => {
		if (className.startsWith("[") && className.endsWith("]")) return getGroupIdForArbitraryProperty(className);
		const classParts = className.split(CLASS_PART_SEPARATOR);
		return getGroupRecursive(classParts, classParts[0] === "" && classParts.length > 1 ? 1 : 0, classMap);
	};
	const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
		if (hasPostfixModifier) {
			const modifierConflicts = conflictingClassGroupModifiers[classGroupId];
			const baseConflicts = conflictingClassGroups[classGroupId];
			if (modifierConflicts) {
				if (baseConflicts) return concatArrays(baseConflicts, modifierConflicts);
				return modifierConflicts;
			}
			return baseConflicts || EMPTY_CONFLICTS;
		}
		return conflictingClassGroups[classGroupId] || EMPTY_CONFLICTS;
	};
	return {
		getClassGroupId,
		getConflictingClassGroupIds
	};
};
var getGroupRecursive = (classParts, startIndex, classPartObject) => {
	if (classParts.length - startIndex === 0) return classPartObject.classGroupId;
	const currentClassPart = classParts[startIndex];
	const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
	if (nextClassPartObject) {
		const result = getGroupRecursive(classParts, startIndex + 1, nextClassPartObject);
		if (result) return result;
	}
	const validators = classPartObject.validators;
	if (validators === null) return;
	const classRest = startIndex === 0 ? classParts.join(CLASS_PART_SEPARATOR) : classParts.slice(startIndex).join(CLASS_PART_SEPARATOR);
	const validatorsLength = validators.length;
	for (let i = 0; i < validatorsLength; i++) {
		const validatorObj = validators[i];
		if (validatorObj.validator(classRest)) return validatorObj.classGroupId;
	}
};
/**
* Get the class group ID for an arbitrary property.
*
* @param className - The class name to get the group ID for. Is expected to be string starting with `[` and ending with `]`.
*/
var getGroupIdForArbitraryProperty = (className) => className.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
	const content = className.slice(1, -1);
	const colonIndex = content.indexOf(":");
	const property = content.slice(0, colonIndex);
	return property ? ARBITRARY_PROPERTY_PREFIX + property : void 0;
})();
/**
* Exported for testing only
*/
var createClassMap = (config) => {
	const { theme, classGroups } = config;
	return processClassGroups(classGroups, theme);
};
var processClassGroups = (classGroups, theme) => {
	const classMap = createClassPartObject();
	for (const classGroupId in classGroups) {
		const group = classGroups[classGroupId];
		processClassesRecursively(group, classMap, classGroupId, theme);
	}
	return classMap;
};
var processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
	const len = classGroup.length;
	for (let i = 0; i < len; i++) {
		const classDefinition = classGroup[i];
		processClassDefinition(classDefinition, classPartObject, classGroupId, theme);
	}
};
var processClassDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
	if (typeof classDefinition === "string") {
		processStringDefinition(classDefinition, classPartObject, classGroupId);
		return;
	}
	if (typeof classDefinition === "function") {
		processFunctionDefinition(classDefinition, classPartObject, classGroupId, theme);
		return;
	}
	processObjectDefinition(classDefinition, classPartObject, classGroupId, theme);
};
var processStringDefinition = (classDefinition, classPartObject, classGroupId) => {
	const classPartObjectToEdit = classDefinition === "" ? classPartObject : getPart(classPartObject, classDefinition);
	classPartObjectToEdit.classGroupId = classGroupId;
};
var processFunctionDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
	if (isThemeGetter(classDefinition)) {
		processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
		return;
	}
	if (classPartObject.validators === null) classPartObject.validators = [];
	classPartObject.validators.push(createClassValidatorObject(classGroupId, classDefinition));
};
var processObjectDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
	const entries = Object.entries(classDefinition);
	const len = entries.length;
	for (let i = 0; i < len; i++) {
		const [key, value] = entries[i];
		processClassesRecursively(value, getPart(classPartObject, key), classGroupId, theme);
	}
};
var getPart = (classPartObject, path) => {
	let current = classPartObject;
	const parts = path.split(CLASS_PART_SEPARATOR);
	const len = parts.length;
	for (let i = 0; i < len; i++) {
		const part = parts[i];
		let next = current.nextPart.get(part);
		if (!next) {
			next = createClassPartObject();
			current.nextPart.set(part, next);
		}
		current = next;
	}
	return current;
};
var isThemeGetter = (func) => "isThemeGetter" in func && func.isThemeGetter === true;
var createLruCache = (maxCacheSize) => {
	if (maxCacheSize < 1) return {
		get: () => void 0,
		set: () => {}
	};
	let cacheSize = 0;
	let cache = Object.create(null);
	let previousCache = Object.create(null);
	const update = (key, value) => {
		cache[key] = value;
		cacheSize++;
		if (cacheSize > maxCacheSize) {
			cacheSize = 0;
			previousCache = cache;
			cache = Object.create(null);
		}
	};
	return {
		get(key) {
			let value = cache[key];
			if (value !== void 0) return value;
			if ((value = previousCache[key]) !== void 0) {
				update(key, value);
				return value;
			}
		},
		set(key, value) {
			if (key in cache) cache[key] = value;
			else update(key, value);
		}
	};
};
var IMPORTANT_MODIFIER = "!";
var MODIFIER_SEPARATOR = ":";
var EMPTY_MODIFIERS = [];
var createResultObject = (modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition, isExternal) => ({
	modifiers,
	hasImportantModifier,
	baseClassName,
	maybePostfixModifierPosition,
	isExternal
});
var createParseClassName = (config) => {
	const { prefix, experimentalParseClassName } = config;
	/**
	* Parse class name into parts.
	*
	* Inspired by `splitAtTopLevelOnly` used in Tailwind CSS
	* @see https://github.com/tailwindlabs/tailwindcss/blob/v3.2.2/src/util/splitAtTopLevelOnly.js
	*/
	let parseClassName = (className) => {
		const modifiers = [];
		let bracketDepth = 0;
		let parenDepth = 0;
		let modifierStart = 0;
		let postfixModifierPosition;
		const len = className.length;
		for (let index = 0; index < len; index++) {
			const currentCharacter = className[index];
			if (bracketDepth === 0 && parenDepth === 0) {
				if (currentCharacter === MODIFIER_SEPARATOR) {
					modifiers.push(className.slice(modifierStart, index));
					modifierStart = index + 1;
					continue;
				}
				if (currentCharacter === "/") {
					postfixModifierPosition = index;
					continue;
				}
			}
			if (currentCharacter === "[") bracketDepth++;
			else if (currentCharacter === "]") bracketDepth--;
			else if (currentCharacter === "(") parenDepth++;
			else if (currentCharacter === ")") parenDepth--;
		}
		const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.slice(modifierStart);
		let baseClassName = baseClassNameWithImportantModifier;
		let hasImportantModifier = false;
		if (baseClassNameWithImportantModifier.endsWith(IMPORTANT_MODIFIER)) {
			baseClassName = baseClassNameWithImportantModifier.slice(0, -1);
			hasImportantModifier = true;
		} else if (baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER)) {
			baseClassName = baseClassNameWithImportantModifier.slice(1);
			hasImportantModifier = true;
		}
		const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : void 0;
		return createResultObject(modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition);
	};
	if (prefix) {
		const fullPrefix = prefix + MODIFIER_SEPARATOR;
		const parseClassNameOriginal = parseClassName;
		parseClassName = (className) => className.startsWith(fullPrefix) ? parseClassNameOriginal(className.slice(fullPrefix.length)) : createResultObject(EMPTY_MODIFIERS, false, className, void 0, true);
	}
	if (experimentalParseClassName) {
		const parseClassNameOriginal = parseClassName;
		parseClassName = (className) => experimentalParseClassName({
			className,
			parseClassName: parseClassNameOriginal
		});
	}
	return parseClassName;
};
/**
* Sorts modifiers according to following schema:
* - Predefined modifiers are sorted alphabetically
* - When an arbitrary variant appears, it must be preserved which modifiers are before and after it
*/
var createSortModifiers = (config) => {
	const modifierWeights = /* @__PURE__ */ new Map();
	config.orderSensitiveModifiers.forEach((mod, index) => {
		modifierWeights.set(mod, 1e6 + index);
	});
	return (modifiers) => {
		const result = [];
		let currentSegment = [];
		for (let i = 0; i < modifiers.length; i++) {
			const modifier = modifiers[i];
			const isArbitrary = modifier[0] === "[";
			const isOrderSensitive = modifierWeights.has(modifier);
			if (isArbitrary || isOrderSensitive) {
				if (currentSegment.length > 0) {
					currentSegment.sort();
					result.push(...currentSegment);
					currentSegment = [];
				}
				result.push(modifier);
			} else currentSegment.push(modifier);
		}
		if (currentSegment.length > 0) {
			currentSegment.sort();
			result.push(...currentSegment);
		}
		return result;
	};
};
var createConfigUtils = (config) => ({
	cache: createLruCache(config.cacheSize),
	parseClassName: createParseClassName(config),
	sortModifiers: createSortModifiers(config),
	postfixLookupClassGroupIds: createPostfixLookupClassGroupIds(config),
	...createClassGroupUtils(config)
});
var createPostfixLookupClassGroupIds = (config) => {
	const lookup = Object.create(null);
	const classGroupIds = config.postfixLookupClassGroups;
	if (classGroupIds) for (let i = 0; i < classGroupIds.length; i++) lookup[classGroupIds[i]] = true;
	return lookup;
};
var SPLIT_CLASSES_REGEX = /\s+/;
var mergeClassList = (classList, configUtils) => {
	const { parseClassName, getClassGroupId, getConflictingClassGroupIds, sortModifiers, postfixLookupClassGroupIds } = configUtils;
	/**
	* Set of classGroupIds in following format:
	* `{importantModifier}{variantModifiers}{classGroupId}`
	* @example 'float'
	* @example 'hover:focus:bg-color'
	* @example 'md:!pr'
	*/
	const classGroupsInConflict = [];
	const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
	let result = "";
	for (let index = classNames.length - 1; index >= 0; index -= 1) {
		const originalClassName = classNames[index];
		const { isExternal, modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition } = parseClassName(originalClassName);
		if (isExternal) {
			result = originalClassName + (result.length > 0 ? " " + result : result);
			continue;
		}
		let hasPostfixModifier = !!maybePostfixModifierPosition;
		let classGroupId;
		if (hasPostfixModifier) {
			classGroupId = getClassGroupId(baseClassName.substring(0, maybePostfixModifierPosition));
			const classGroupIdWithPostfix = classGroupId && postfixLookupClassGroupIds[classGroupId] ? getClassGroupId(baseClassName) : void 0;
			if (classGroupIdWithPostfix && classGroupIdWithPostfix !== classGroupId) {
				classGroupId = classGroupIdWithPostfix;
				hasPostfixModifier = false;
			}
		} else classGroupId = getClassGroupId(baseClassName);
		if (!classGroupId) {
			if (!hasPostfixModifier) {
				result = originalClassName + (result.length > 0 ? " " + result : result);
				continue;
			}
			classGroupId = getClassGroupId(baseClassName);
			if (!classGroupId) {
				result = originalClassName + (result.length > 0 ? " " + result : result);
				continue;
			}
			hasPostfixModifier = false;
		}
		const variantModifier = modifiers.length === 0 ? "" : modifiers.length === 1 ? modifiers[0] : sortModifiers(modifiers).join(":");
		const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
		const classId = modifierId + classGroupId;
		if (classGroupsInConflict.indexOf(classId) > -1) continue;
		classGroupsInConflict.push(classId);
		const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
		for (let i = 0; i < conflictGroups.length; ++i) {
			const group = conflictGroups[i];
			classGroupsInConflict.push(modifierId + group);
		}
		result = originalClassName + (result.length > 0 ? " " + result : result);
	}
	return result;
};
/**
* The code in this file is copied from https://github.com/lukeed/clsx and modified to suit the needs of tailwind-merge better.
*
* Specifically:
* - Runtime code from https://github.com/lukeed/clsx/blob/v1.2.1/src/index.js
* - TypeScript types from https://github.com/lukeed/clsx/blob/v1.2.1/clsx.d.ts
*
* Original code has MIT license: Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
*/
var twJoin = (...classLists) => {
	let index = 0;
	let argument;
	let resolvedValue;
	let string = "";
	while (index < classLists.length) if (argument = classLists[index++]) {
		if (resolvedValue = toValue(argument)) {
			string && (string += " ");
			string += resolvedValue;
		}
	}
	return string;
};
var toValue = (mix) => {
	if (typeof mix === "string") return mix;
	let resolvedValue;
	let string = "";
	for (let k = 0; k < mix.length; k++) if (mix[k]) {
		if (resolvedValue = toValue(mix[k])) {
			string && (string += " ");
			string += resolvedValue;
		}
	}
	return string;
};
var createTailwindMerge = (createConfigFirst, ...createConfigRest) => {
	let configUtils;
	let cacheGet;
	let cacheSet;
	let functionToCall;
	const initTailwindMerge = (classList) => {
		configUtils = createConfigUtils(createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst()));
		cacheGet = configUtils.cache.get;
		cacheSet = configUtils.cache.set;
		functionToCall = tailwindMerge;
		return tailwindMerge(classList);
	};
	const tailwindMerge = (classList) => {
		const cachedResult = cacheGet(classList);
		if (cachedResult) return cachedResult;
		const result = mergeClassList(classList, configUtils);
		cacheSet(classList, result);
		return result;
	};
	functionToCall = initTailwindMerge;
	return (...args) => functionToCall(twJoin(...args));
};
var fallbackThemeArr = [];
var fromTheme = (key) => {
	const themeGetter = (theme) => theme[key] || fallbackThemeArr;
	themeGetter.isThemeGetter = true;
	return themeGetter;
};
var arbitraryValueRegex = /^\[(?:(\w[\w-]*):)?(.+)\]$/i;
var arbitraryVariableRegex = /^\((?:(\w[\w-]*):)?(.+)\)$/i;
var fractionRegex = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/;
var tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
var lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
var colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/;
var shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
var imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
var isFraction = (value) => fractionRegex.test(value);
var isNumber = (value) => !!value && !Number.isNaN(Number(value));
var isInteger = (value) => !!value && Number.isInteger(Number(value));
var isPercent = (value) => value.endsWith("%") && isNumber(value.slice(0, -1));
var isTshirtSize = (value) => tshirtUnitRegex.test(value);
var isAny = () => true;
var isLengthOnly = (value) => lengthUnitRegex.test(value) && !colorFunctionRegex.test(value);
var isNever = () => false;
var isShadow = (value) => shadowRegex.test(value);
var isImage = (value) => imageRegex.test(value);
var isAnyNonArbitrary = (value) => !isArbitraryValue(value) && !isArbitraryVariable(value);
var isNamedContainerQuery = (value) => value.startsWith("@container") && (value[10] === "/" && value[11] !== void 0 || value[11] === "s" && value[16] !== void 0 && value.startsWith("-size/", 10) || value[11] === "n" && value[18] !== void 0 && value.startsWith("-normal/", 10));
var isArbitrarySize = (value) => getIsArbitraryValue(value, isLabelSize, isNever);
var isArbitraryValue = (value) => arbitraryValueRegex.test(value);
var isArbitraryLength = (value) => getIsArbitraryValue(value, isLabelLength, isLengthOnly);
var isArbitraryNumber = (value) => getIsArbitraryValue(value, isLabelNumber, isNumber);
var isArbitraryWeight = (value) => getIsArbitraryValue(value, isLabelWeight, isAny);
var isArbitraryFamilyName = (value) => getIsArbitraryValue(value, isLabelFamilyName, isNever);
var isArbitraryPosition = (value) => getIsArbitraryValue(value, isLabelPosition, isNever);
var isArbitraryImage = (value) => getIsArbitraryValue(value, isLabelImage, isImage);
var isArbitraryShadow = (value) => getIsArbitraryValue(value, isLabelShadow, isShadow);
var isArbitraryVariable = (value) => arbitraryVariableRegex.test(value);
var isArbitraryVariableLength = (value) => getIsArbitraryVariable(value, isLabelLength);
var isArbitraryVariableFamilyName = (value) => getIsArbitraryVariable(value, isLabelFamilyName);
var isArbitraryVariablePosition = (value) => getIsArbitraryVariable(value, isLabelPosition);
var isArbitraryVariableSize = (value) => getIsArbitraryVariable(value, isLabelSize);
var isArbitraryVariableImage = (value) => getIsArbitraryVariable(value, isLabelImage);
var isArbitraryVariableShadow = (value) => getIsArbitraryVariable(value, isLabelShadow, true);
var isArbitraryVariableWeight = (value) => getIsArbitraryVariable(value, isLabelWeight, true);
var getIsArbitraryValue = (value, testLabel, testValue) => {
	const result = arbitraryValueRegex.exec(value);
	if (result) {
		if (result[1]) return testLabel(result[1]);
		return testValue(result[2]);
	}
	return false;
};
var getIsArbitraryVariable = (value, testLabel, shouldMatchNoLabel = false) => {
	const result = arbitraryVariableRegex.exec(value);
	if (result) {
		if (result[1]) return testLabel(result[1]);
		return shouldMatchNoLabel;
	}
	return false;
};
var isLabelPosition = (label) => label === "position" || label === "percentage";
var isLabelImage = (label) => label === "image" || label === "url";
var isLabelSize = (label) => label === "length" || label === "size" || label === "bg-size";
var isLabelLength = (label) => label === "length";
var isLabelNumber = (label) => label === "number";
var isLabelFamilyName = (label) => label === "family-name";
var isLabelWeight = (label) => label === "number" || label === "weight";
var isLabelShadow = (label) => label === "shadow";
var getDefaultConfig = () => {
	/**
	* Theme getters for theme variable namespaces
	* @see https://tailwindcss.com/docs/theme#theme-variable-namespaces
	*/
	const themeColor = fromTheme("color");
	const themeFont = fromTheme("font");
	const themeText = fromTheme("text");
	const themeFontWeight = fromTheme("font-weight");
	const themeTracking = fromTheme("tracking");
	const themeLeading = fromTheme("leading");
	const themeBreakpoint = fromTheme("breakpoint");
	const themeContainer = fromTheme("container");
	const themeSpacing = fromTheme("spacing");
	const themeRadius = fromTheme("radius");
	const themeShadow = fromTheme("shadow");
	const themeInsetShadow = fromTheme("inset-shadow");
	const themeTextShadow = fromTheme("text-shadow");
	const themeDropShadow = fromTheme("drop-shadow");
	const themeBlur = fromTheme("blur");
	const themePerspective = fromTheme("perspective");
	const themeAspect = fromTheme("aspect");
	const themeEase = fromTheme("ease");
	const themeAnimate = fromTheme("animate");
	/**
	* Helpers to avoid repeating the same scales
	*
	* We use functions that create a new array every time they're called instead of static arrays.
	* This ensures that users who modify any scale by mutating the array (e.g. with `array.push(element)`) don't accidentally mutate arrays in other parts of the config.
	*/
	const scaleBreak = () => [
		"auto",
		"avoid",
		"all",
		"avoid-page",
		"page",
		"left",
		"right",
		"column"
	];
	const scalePosition = () => [
		"center",
		"top",
		"bottom",
		"left",
		"right",
		"top-left",
		"left-top",
		"top-right",
		"right-top",
		"bottom-right",
		"right-bottom",
		"bottom-left",
		"left-bottom"
	];
	const scalePositionWithArbitrary = () => [
		...scalePosition(),
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleOverflow = () => [
		"auto",
		"hidden",
		"clip",
		"visible",
		"scroll"
	];
	const scaleOverscroll = () => [
		"auto",
		"contain",
		"none"
	];
	const scaleUnambiguousSpacing = () => [
		isArbitraryVariable,
		isArbitraryValue,
		themeSpacing
	];
	const scaleInset = () => [
		isFraction,
		"full",
		"auto",
		...scaleUnambiguousSpacing()
	];
	const scaleGridTemplateColsRows = () => [
		isInteger,
		"none",
		"subgrid",
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleGridColRowStartAndEnd = () => [
		"auto",
		{ span: [
			"full",
			isInteger,
			isArbitraryVariable,
			isArbitraryValue
		] },
		isInteger,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleGridColRowStartOrEnd = () => [
		isInteger,
		"auto",
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleGridAutoColsRows = () => [
		"auto",
		"min",
		"max",
		"fr",
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleAlignPrimaryAxis = () => [
		"start",
		"end",
		"center",
		"between",
		"around",
		"evenly",
		"stretch",
		"baseline",
		"center-safe",
		"end-safe"
	];
	const scaleAlignSecondaryAxis = () => [
		"start",
		"end",
		"center",
		"stretch",
		"center-safe",
		"end-safe"
	];
	const scaleMargin = () => ["auto", ...scaleUnambiguousSpacing()];
	const scaleSizing = () => [
		isFraction,
		"auto",
		"full",
		"dvw",
		"dvh",
		"lvw",
		"lvh",
		"svw",
		"svh",
		"min",
		"max",
		"fit",
		...scaleUnambiguousSpacing()
	];
	const scaleSizingInline = () => [
		isFraction,
		"screen",
		"full",
		"dvw",
		"lvw",
		"svw",
		"min",
		"max",
		"fit",
		...scaleUnambiguousSpacing()
	];
	const scaleSizingBlock = () => [
		isFraction,
		"screen",
		"full",
		"lh",
		"dvh",
		"lvh",
		"svh",
		"min",
		"max",
		"fit",
		...scaleUnambiguousSpacing()
	];
	const scaleColor = () => [
		themeColor,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleBgPosition = () => [
		...scalePosition(),
		isArbitraryVariablePosition,
		isArbitraryPosition,
		{ position: [isArbitraryVariable, isArbitraryValue] }
	];
	const scaleBgRepeat = () => ["no-repeat", { repeat: [
		"",
		"x",
		"y",
		"space",
		"round"
	] }];
	const scaleBgSize = () => [
		"auto",
		"cover",
		"contain",
		isArbitraryVariableSize,
		isArbitrarySize,
		{ size: [isArbitraryVariable, isArbitraryValue] }
	];
	const scaleGradientStopPosition = () => [
		isPercent,
		isArbitraryVariableLength,
		isArbitraryLength
	];
	const scaleRadius = () => [
		"",
		"none",
		"full",
		themeRadius,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleBorderWidth = () => [
		"",
		isNumber,
		isArbitraryVariableLength,
		isArbitraryLength
	];
	const scaleLineStyle = () => [
		"solid",
		"dashed",
		"dotted",
		"double"
	];
	const scaleBlendMode = () => [
		"normal",
		"multiply",
		"screen",
		"overlay",
		"darken",
		"lighten",
		"color-dodge",
		"color-burn",
		"hard-light",
		"soft-light",
		"difference",
		"exclusion",
		"hue",
		"saturation",
		"color",
		"luminosity"
	];
	const scaleMaskImagePosition = () => [
		isNumber,
		isPercent,
		isArbitraryVariablePosition,
		isArbitraryPosition
	];
	const scaleBlur = () => [
		"",
		"none",
		themeBlur,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleRotate = () => [
		"none",
		isNumber,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleScale = () => [
		"none",
		isNumber,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleSkew = () => [
		isNumber,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleTranslate = () => [
		isFraction,
		"full",
		...scaleUnambiguousSpacing()
	];
	return {
		cacheSize: 500,
		theme: {
			animate: [
				"spin",
				"ping",
				"pulse",
				"bounce"
			],
			aspect: ["video"],
			blur: [isTshirtSize],
			breakpoint: [isTshirtSize],
			color: [isAny],
			container: [isTshirtSize],
			"drop-shadow": [isTshirtSize],
			ease: [
				"in",
				"out",
				"in-out"
			],
			font: [isAnyNonArbitrary],
			"font-weight": [
				"thin",
				"extralight",
				"light",
				"normal",
				"medium",
				"semibold",
				"bold",
				"extrabold",
				"black"
			],
			"inset-shadow": [isTshirtSize],
			leading: [
				"none",
				"tight",
				"snug",
				"normal",
				"relaxed",
				"loose"
			],
			perspective: [
				"dramatic",
				"near",
				"normal",
				"midrange",
				"distant",
				"none"
			],
			radius: [isTshirtSize],
			shadow: [isTshirtSize],
			spacing: ["px", isNumber],
			text: [isTshirtSize],
			"text-shadow": [isTshirtSize],
			tracking: [
				"tighter",
				"tight",
				"normal",
				"wide",
				"wider",
				"widest"
			]
		},
		classGroups: {
			/**
			* Aspect Ratio
			* @see https://tailwindcss.com/docs/aspect-ratio
			*/
			aspect: [{ aspect: [
				"auto",
				"square",
				isFraction,
				isArbitraryValue,
				isArbitraryVariable,
				themeAspect
			] }],
			/**
			* Container
			* @see https://tailwindcss.com/docs/container
			* @deprecated since Tailwind CSS v4.0.0
			*/
			container: ["container"],
			/**
			* Container Type
			* @see https://tailwindcss.com/docs/responsive-design#container-queries
			*/
			"container-type": [{ "@container": [
				"",
				"normal",
				"size",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Container Name
			* @see https://tailwindcss.com/docs/responsive-design#named-containers
			*/
			"container-named": [isNamedContainerQuery],
			/**
			* Columns
			* @see https://tailwindcss.com/docs/columns
			*/
			columns: [{ columns: [
				isNumber,
				isArbitraryValue,
				isArbitraryVariable,
				themeContainer
			] }],
			/**
			* Break After
			* @see https://tailwindcss.com/docs/break-after
			*/
			"break-after": [{ "break-after": scaleBreak() }],
			/**
			* Break Before
			* @see https://tailwindcss.com/docs/break-before
			*/
			"break-before": [{ "break-before": scaleBreak() }],
			/**
			* Break Inside
			* @see https://tailwindcss.com/docs/break-inside
			*/
			"break-inside": [{ "break-inside": [
				"auto",
				"avoid",
				"avoid-page",
				"avoid-column"
			] }],
			/**
			* Box Decoration Break
			* @see https://tailwindcss.com/docs/box-decoration-break
			*/
			"box-decoration": [{ "box-decoration": ["slice", "clone"] }],
			/**
			* Box Sizing
			* @see https://tailwindcss.com/docs/box-sizing
			*/
			box: [{ box: ["border", "content"] }],
			/**
			* Display
			* @see https://tailwindcss.com/docs/display
			*/
			display: [
				"block",
				"inline-block",
				"inline",
				"flex",
				"inline-flex",
				"table",
				"inline-table",
				"table-caption",
				"table-cell",
				"table-column",
				"table-column-group",
				"table-footer-group",
				"table-header-group",
				"table-row-group",
				"table-row",
				"flow-root",
				"grid",
				"inline-grid",
				"contents",
				"list-item",
				"hidden"
			],
			/**
			* Screen Reader Only
			* @see https://tailwindcss.com/docs/display#screen-reader-only
			*/
			sr: ["sr-only", "not-sr-only"],
			/**
			* Floats
			* @see https://tailwindcss.com/docs/float
			*/
			float: [{ float: [
				"right",
				"left",
				"none",
				"start",
				"end"
			] }],
			/**
			* Clear
			* @see https://tailwindcss.com/docs/clear
			*/
			clear: [{ clear: [
				"left",
				"right",
				"both",
				"none",
				"start",
				"end"
			] }],
			/**
			* Isolation
			* @see https://tailwindcss.com/docs/isolation
			*/
			isolation: ["isolate", "isolation-auto"],
			/**
			* Object Fit
			* @see https://tailwindcss.com/docs/object-fit
			*/
			"object-fit": [{ object: [
				"contain",
				"cover",
				"fill",
				"none",
				"scale-down"
			] }],
			/**
			* Object Position
			* @see https://tailwindcss.com/docs/object-position
			*/
			"object-position": [{ object: scalePositionWithArbitrary() }],
			/**
			* Overflow
			* @see https://tailwindcss.com/docs/overflow
			*/
			overflow: [{ overflow: scaleOverflow() }],
			/**
			* Overflow X
			* @see https://tailwindcss.com/docs/overflow
			*/
			"overflow-x": [{ "overflow-x": scaleOverflow() }],
			/**
			* Overflow Y
			* @see https://tailwindcss.com/docs/overflow
			*/
			"overflow-y": [{ "overflow-y": scaleOverflow() }],
			/**
			* Overscroll Behavior
			* @see https://tailwindcss.com/docs/overscroll-behavior
			*/
			overscroll: [{ overscroll: scaleOverscroll() }],
			/**
			* Overscroll Behavior X
			* @see https://tailwindcss.com/docs/overscroll-behavior
			*/
			"overscroll-x": [{ "overscroll-x": scaleOverscroll() }],
			/**
			* Overscroll Behavior Y
			* @see https://tailwindcss.com/docs/overscroll-behavior
			*/
			"overscroll-y": [{ "overscroll-y": scaleOverscroll() }],
			/**
			* Position
			* @see https://tailwindcss.com/docs/position
			*/
			position: [
				"static",
				"fixed",
				"absolute",
				"relative",
				"sticky"
			],
			/**
			* Inset
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			inset: [{ inset: scaleInset() }],
			/**
			* Inset Inline
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-x": [{ "inset-x": scaleInset() }],
			/**
			* Inset Block
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-y": [{ "inset-y": scaleInset() }],
			/**
			* Inset Inline Start
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			* @todo class group will be renamed to `inset-s` in next major release
			*/
			start: [{
				"inset-s": scaleInset(),
				/**
				* @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
				* @see https://github.com/tailwindlabs/tailwindcss/pull/19613
				*/
				start: scaleInset()
			}],
			/**
			* Inset Inline End
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			* @todo class group will be renamed to `inset-e` in next major release
			*/
			end: [{
				"inset-e": scaleInset(),
				/**
				* @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
				* @see https://github.com/tailwindlabs/tailwindcss/pull/19613
				*/
				end: scaleInset()
			}],
			/**
			* Inset Block Start
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-bs": [{ "inset-bs": scaleInset() }],
			/**
			* Inset Block End
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-be": [{ "inset-be": scaleInset() }],
			/**
			* Top
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			top: [{ top: scaleInset() }],
			/**
			* Right
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			right: [{ right: scaleInset() }],
			/**
			* Bottom
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			bottom: [{ bottom: scaleInset() }],
			/**
			* Left
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			left: [{ left: scaleInset() }],
			/**
			* Visibility
			* @see https://tailwindcss.com/docs/visibility
			*/
			visibility: [
				"visible",
				"invisible",
				"collapse"
			],
			/**
			* Z-Index
			* @see https://tailwindcss.com/docs/z-index
			*/
			z: [{ z: [
				isInteger,
				"auto",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Flex Basis
			* @see https://tailwindcss.com/docs/flex-basis
			*/
			basis: [{ basis: [
				isFraction,
				"full",
				"auto",
				themeContainer,
				...scaleUnambiguousSpacing()
			] }],
			/**
			* Flex Direction
			* @see https://tailwindcss.com/docs/flex-direction
			*/
			"flex-direction": [{ flex: [
				"row",
				"row-reverse",
				"col",
				"col-reverse"
			] }],
			/**
			* Flex Wrap
			* @see https://tailwindcss.com/docs/flex-wrap
			*/
			"flex-wrap": [{ flex: [
				"nowrap",
				"wrap",
				"wrap-reverse"
			] }],
			/**
			* Flex
			* @see https://tailwindcss.com/docs/flex
			*/
			flex: [{ flex: [
				isNumber,
				isFraction,
				"auto",
				"initial",
				"none",
				isArbitraryValue
			] }],
			/**
			* Flex Grow
			* @see https://tailwindcss.com/docs/flex-grow
			*/
			grow: [{ grow: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Flex Shrink
			* @see https://tailwindcss.com/docs/flex-shrink
			*/
			shrink: [{ shrink: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Order
			* @see https://tailwindcss.com/docs/order
			*/
			order: [{ order: [
				isInteger,
				"first",
				"last",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Grid Template Columns
			* @see https://tailwindcss.com/docs/grid-template-columns
			*/
			"grid-cols": [{ "grid-cols": scaleGridTemplateColsRows() }],
			/**
			* Grid Column Start / End
			* @see https://tailwindcss.com/docs/grid-column
			*/
			"col-start-end": [{ col: scaleGridColRowStartAndEnd() }],
			/**
			* Grid Column Start
			* @see https://tailwindcss.com/docs/grid-column
			*/
			"col-start": [{ "col-start": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Column End
			* @see https://tailwindcss.com/docs/grid-column
			*/
			"col-end": [{ "col-end": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Template Rows
			* @see https://tailwindcss.com/docs/grid-template-rows
			*/
			"grid-rows": [{ "grid-rows": scaleGridTemplateColsRows() }],
			/**
			* Grid Row Start / End
			* @see https://tailwindcss.com/docs/grid-row
			*/
			"row-start-end": [{ row: scaleGridColRowStartAndEnd() }],
			/**
			* Grid Row Start
			* @see https://tailwindcss.com/docs/grid-row
			*/
			"row-start": [{ "row-start": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Row End
			* @see https://tailwindcss.com/docs/grid-row
			*/
			"row-end": [{ "row-end": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Auto Flow
			* @see https://tailwindcss.com/docs/grid-auto-flow
			*/
			"grid-flow": [{ "grid-flow": [
				"row",
				"col",
				"dense",
				"row-dense",
				"col-dense"
			] }],
			/**
			* Grid Auto Columns
			* @see https://tailwindcss.com/docs/grid-auto-columns
			*/
			"auto-cols": [{ "auto-cols": scaleGridAutoColsRows() }],
			/**
			* Grid Auto Rows
			* @see https://tailwindcss.com/docs/grid-auto-rows
			*/
			"auto-rows": [{ "auto-rows": scaleGridAutoColsRows() }],
			/**
			* Gap
			* @see https://tailwindcss.com/docs/gap
			*/
			gap: [{ gap: scaleUnambiguousSpacing() }],
			/**
			* Gap X
			* @see https://tailwindcss.com/docs/gap
			*/
			"gap-x": [{ "gap-x": scaleUnambiguousSpacing() }],
			/**
			* Gap Y
			* @see https://tailwindcss.com/docs/gap
			*/
			"gap-y": [{ "gap-y": scaleUnambiguousSpacing() }],
			/**
			* Justify Content
			* @see https://tailwindcss.com/docs/justify-content
			*/
			"justify-content": [{ justify: [...scaleAlignPrimaryAxis(), "normal"] }],
			/**
			* Justify Items
			* @see https://tailwindcss.com/docs/justify-items
			*/
			"justify-items": [{ "justify-items": [...scaleAlignSecondaryAxis(), "normal"] }],
			/**
			* Justify Self
			* @see https://tailwindcss.com/docs/justify-self
			*/
			"justify-self": [{ "justify-self": ["auto", ...scaleAlignSecondaryAxis()] }],
			/**
			* Align Content
			* @see https://tailwindcss.com/docs/align-content
			*/
			"align-content": [{ content: ["normal", ...scaleAlignPrimaryAxis()] }],
			/**
			* Align Items
			* @see https://tailwindcss.com/docs/align-items
			*/
			"align-items": [{ items: [...scaleAlignSecondaryAxis(), { baseline: ["", "last"] }] }],
			/**
			* Align Self
			* @see https://tailwindcss.com/docs/align-self
			*/
			"align-self": [{ self: [
				"auto",
				...scaleAlignSecondaryAxis(),
				{ baseline: ["", "last"] }
			] }],
			/**
			* Place Content
			* @see https://tailwindcss.com/docs/place-content
			*/
			"place-content": [{ "place-content": scaleAlignPrimaryAxis() }],
			/**
			* Place Items
			* @see https://tailwindcss.com/docs/place-items
			*/
			"place-items": [{ "place-items": [...scaleAlignSecondaryAxis(), "baseline"] }],
			/**
			* Place Self
			* @see https://tailwindcss.com/docs/place-self
			*/
			"place-self": [{ "place-self": ["auto", ...scaleAlignSecondaryAxis()] }],
			/**
			* Padding
			* @see https://tailwindcss.com/docs/padding
			*/
			p: [{ p: scaleUnambiguousSpacing() }],
			/**
			* Padding Inline
			* @see https://tailwindcss.com/docs/padding
			*/
			px: [{ px: scaleUnambiguousSpacing() }],
			/**
			* Padding Block
			* @see https://tailwindcss.com/docs/padding
			*/
			py: [{ py: scaleUnambiguousSpacing() }],
			/**
			* Padding Inline Start
			* @see https://tailwindcss.com/docs/padding
			*/
			ps: [{ ps: scaleUnambiguousSpacing() }],
			/**
			* Padding Inline End
			* @see https://tailwindcss.com/docs/padding
			*/
			pe: [{ pe: scaleUnambiguousSpacing() }],
			/**
			* Padding Block Start
			* @see https://tailwindcss.com/docs/padding
			*/
			pbs: [{ pbs: scaleUnambiguousSpacing() }],
			/**
			* Padding Block End
			* @see https://tailwindcss.com/docs/padding
			*/
			pbe: [{ pbe: scaleUnambiguousSpacing() }],
			/**
			* Padding Top
			* @see https://tailwindcss.com/docs/padding
			*/
			pt: [{ pt: scaleUnambiguousSpacing() }],
			/**
			* Padding Right
			* @see https://tailwindcss.com/docs/padding
			*/
			pr: [{ pr: scaleUnambiguousSpacing() }],
			/**
			* Padding Bottom
			* @see https://tailwindcss.com/docs/padding
			*/
			pb: [{ pb: scaleUnambiguousSpacing() }],
			/**
			* Padding Left
			* @see https://tailwindcss.com/docs/padding
			*/
			pl: [{ pl: scaleUnambiguousSpacing() }],
			/**
			* Margin
			* @see https://tailwindcss.com/docs/margin
			*/
			m: [{ m: scaleMargin() }],
			/**
			* Margin Inline
			* @see https://tailwindcss.com/docs/margin
			*/
			mx: [{ mx: scaleMargin() }],
			/**
			* Margin Block
			* @see https://tailwindcss.com/docs/margin
			*/
			my: [{ my: scaleMargin() }],
			/**
			* Margin Inline Start
			* @see https://tailwindcss.com/docs/margin
			*/
			ms: [{ ms: scaleMargin() }],
			/**
			* Margin Inline End
			* @see https://tailwindcss.com/docs/margin
			*/
			me: [{ me: scaleMargin() }],
			/**
			* Margin Block Start
			* @see https://tailwindcss.com/docs/margin
			*/
			mbs: [{ mbs: scaleMargin() }],
			/**
			* Margin Block End
			* @see https://tailwindcss.com/docs/margin
			*/
			mbe: [{ mbe: scaleMargin() }],
			/**
			* Margin Top
			* @see https://tailwindcss.com/docs/margin
			*/
			mt: [{ mt: scaleMargin() }],
			/**
			* Margin Right
			* @see https://tailwindcss.com/docs/margin
			*/
			mr: [{ mr: scaleMargin() }],
			/**
			* Margin Bottom
			* @see https://tailwindcss.com/docs/margin
			*/
			mb: [{ mb: scaleMargin() }],
			/**
			* Margin Left
			* @see https://tailwindcss.com/docs/margin
			*/
			ml: [{ ml: scaleMargin() }],
			/**
			* Space Between X
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-x": [{ "space-x": scaleUnambiguousSpacing() }],
			/**
			* Space Between X Reverse
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-x-reverse": ["space-x-reverse"],
			/**
			* Space Between Y
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-y": [{ "space-y": scaleUnambiguousSpacing() }],
			/**
			* Space Between Y Reverse
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-y-reverse": ["space-y-reverse"],
			/**
			* Size
			* @see https://tailwindcss.com/docs/width#setting-both-width-and-height
			*/
			size: [{ size: scaleSizing() }],
			/**
			* Inline Size
			* @see https://tailwindcss.com/docs/width
			*/
			"inline-size": [{ inline: ["auto", ...scaleSizingInline()] }],
			/**
			* Min-Inline Size
			* @see https://tailwindcss.com/docs/min-width
			*/
			"min-inline-size": [{ "min-inline": ["auto", ...scaleSizingInline()] }],
			/**
			* Max-Inline Size
			* @see https://tailwindcss.com/docs/max-width
			*/
			"max-inline-size": [{ "max-inline": ["none", ...scaleSizingInline()] }],
			/**
			* Block Size
			* @see https://tailwindcss.com/docs/height
			*/
			"block-size": [{ block: ["auto", ...scaleSizingBlock()] }],
			/**
			* Min-Block Size
			* @see https://tailwindcss.com/docs/min-height
			*/
			"min-block-size": [{ "min-block": ["auto", ...scaleSizingBlock()] }],
			/**
			* Max-Block Size
			* @see https://tailwindcss.com/docs/max-height
			*/
			"max-block-size": [{ "max-block": ["none", ...scaleSizingBlock()] }],
			/**
			* Width
			* @see https://tailwindcss.com/docs/width
			*/
			w: [{ w: [
				themeContainer,
				"screen",
				...scaleSizing()
			] }],
			/**
			* Min-Width
			* @see https://tailwindcss.com/docs/min-width
			*/
			"min-w": [{ "min-w": [
				themeContainer,
				"screen",
				"none",
				...scaleSizing()
			] }],
			/**
			* Max-Width
			* @see https://tailwindcss.com/docs/max-width
			*/
			"max-w": [{ "max-w": [
				themeContainer,
				"screen",
				"none",
				"prose",
				{ screen: [themeBreakpoint] },
				...scaleSizing()
			] }],
			/**
			* Height
			* @see https://tailwindcss.com/docs/height
			*/
			h: [{ h: [
				"screen",
				"lh",
				...scaleSizing()
			] }],
			/**
			* Min-Height
			* @see https://tailwindcss.com/docs/min-height
			*/
			"min-h": [{ "min-h": [
				"screen",
				"lh",
				"none",
				...scaleSizing()
			] }],
			/**
			* Max-Height
			* @see https://tailwindcss.com/docs/max-height
			*/
			"max-h": [{ "max-h": [
				"screen",
				"lh",
				...scaleSizing()
			] }],
			/**
			* Font Size
			* @see https://tailwindcss.com/docs/font-size
			*/
			"font-size": [{ text: [
				"base",
				themeText,
				isArbitraryVariableLength,
				isArbitraryLength
			] }],
			/**
			* Font Smoothing
			* @see https://tailwindcss.com/docs/font-smoothing
			*/
			"font-smoothing": ["antialiased", "subpixel-antialiased"],
			/**
			* Font Style
			* @see https://tailwindcss.com/docs/font-style
			*/
			"font-style": ["italic", "not-italic"],
			/**
			* Font Weight
			* @see https://tailwindcss.com/docs/font-weight
			*/
			"font-weight": [{ font: [
				themeFontWeight,
				isArbitraryVariableWeight,
				isArbitraryWeight
			] }],
			/**
			* Font Stretch
			* @see https://tailwindcss.com/docs/font-stretch
			*/
			"font-stretch": [{ "font-stretch": [
				"ultra-condensed",
				"extra-condensed",
				"condensed",
				"semi-condensed",
				"normal",
				"semi-expanded",
				"expanded",
				"extra-expanded",
				"ultra-expanded",
				isPercent,
				isArbitraryValue
			] }],
			/**
			* Font Family
			* @see https://tailwindcss.com/docs/font-family
			*/
			"font-family": [{ font: [
				isArbitraryVariableFamilyName,
				isArbitraryFamilyName,
				themeFont
			] }],
			/**
			* Font Feature Settings
			* @see https://tailwindcss.com/docs/font-feature-settings
			*/
			"font-features": [{ "font-features": [isArbitraryValue] }],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-normal": ["normal-nums"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-ordinal": ["ordinal"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-slashed-zero": ["slashed-zero"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-figure": ["lining-nums", "oldstyle-nums"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-spacing": ["proportional-nums", "tabular-nums"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
			/**
			* Letter Spacing
			* @see https://tailwindcss.com/docs/letter-spacing
			*/
			tracking: [{ tracking: [
				themeTracking,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Line Clamp
			* @see https://tailwindcss.com/docs/line-clamp
			*/
			"line-clamp": [{ "line-clamp": [
				isNumber,
				"none",
				isArbitraryVariable,
				isArbitraryNumber
			] }],
			/**
			* Line Height
			* @see https://tailwindcss.com/docs/line-height
			*/
			leading: [{ leading: [themeLeading, ...scaleUnambiguousSpacing()] }],
			/**
			* List Style Image
			* @see https://tailwindcss.com/docs/list-style-image
			*/
			"list-image": [{ "list-image": [
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* List Style Position
			* @see https://tailwindcss.com/docs/list-style-position
			*/
			"list-style-position": [{ list: ["inside", "outside"] }],
			/**
			* List Style Type
			* @see https://tailwindcss.com/docs/list-style-type
			*/
			"list-style-type": [{ list: [
				"disc",
				"decimal",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Text Alignment
			* @see https://tailwindcss.com/docs/text-align
			*/
			"text-alignment": [{ text: [
				"left",
				"center",
				"right",
				"justify",
				"start",
				"end"
			] }],
			/**
			* Placeholder Color
			* @deprecated since Tailwind CSS v3.0.0
			* @see https://v3.tailwindcss.com/docs/placeholder-color
			*/
			"placeholder-color": [{ placeholder: scaleColor() }],
			/**
			* Text Color
			* @see https://tailwindcss.com/docs/text-color
			*/
			"text-color": [{ text: scaleColor() }],
			/**
			* Text Decoration
			* @see https://tailwindcss.com/docs/text-decoration
			*/
			"text-decoration": [
				"underline",
				"overline",
				"line-through",
				"no-underline"
			],
			/**
			* Text Decoration Style
			* @see https://tailwindcss.com/docs/text-decoration-style
			*/
			"text-decoration-style": [{ decoration: [...scaleLineStyle(), "wavy"] }],
			/**
			* Text Decoration Thickness
			* @see https://tailwindcss.com/docs/text-decoration-thickness
			*/
			"text-decoration-thickness": [{ decoration: [
				isNumber,
				"from-font",
				"auto",
				isArbitraryVariable,
				isArbitraryLength
			] }],
			/**
			* Text Decoration Color
			* @see https://tailwindcss.com/docs/text-decoration-color
			*/
			"text-decoration-color": [{ decoration: scaleColor() }],
			/**
			* Text Underline Offset
			* @see https://tailwindcss.com/docs/text-underline-offset
			*/
			"underline-offset": [{ "underline-offset": [
				isNumber,
				"auto",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Text Transform
			* @see https://tailwindcss.com/docs/text-transform
			*/
			"text-transform": [
				"uppercase",
				"lowercase",
				"capitalize",
				"normal-case"
			],
			/**
			* Text Overflow
			* @see https://tailwindcss.com/docs/text-overflow
			*/
			"text-overflow": [
				"truncate",
				"text-ellipsis",
				"text-clip"
			],
			/**
			* Text Wrap
			* @see https://tailwindcss.com/docs/text-wrap
			*/
			"text-wrap": [{ text: [
				"wrap",
				"nowrap",
				"balance",
				"pretty"
			] }],
			/**
			* Text Indent
			* @see https://tailwindcss.com/docs/text-indent
			*/
			indent: [{ indent: scaleUnambiguousSpacing() }],
			/**
			* Tab Size
			* @see https://tailwindcss.com/docs/tab-size
			*/
			"tab-size": [{ tab: [
				isInteger,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Vertical Alignment
			* @see https://tailwindcss.com/docs/vertical-align
			*/
			"vertical-align": [{ align: [
				"baseline",
				"top",
				"middle",
				"bottom",
				"text-top",
				"text-bottom",
				"sub",
				"super",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Whitespace
			* @see https://tailwindcss.com/docs/whitespace
			*/
			whitespace: [{ whitespace: [
				"normal",
				"nowrap",
				"pre",
				"pre-line",
				"pre-wrap",
				"break-spaces"
			] }],
			/**
			* Word Break
			* @see https://tailwindcss.com/docs/word-break
			*/
			break: [{ break: [
				"normal",
				"words",
				"all",
				"keep"
			] }],
			/**
			* Overflow Wrap
			* @see https://tailwindcss.com/docs/overflow-wrap
			*/
			wrap: [{ wrap: [
				"break-word",
				"anywhere",
				"normal"
			] }],
			/**
			* Hyphens
			* @see https://tailwindcss.com/docs/hyphens
			*/
			hyphens: [{ hyphens: [
				"none",
				"manual",
				"auto"
			] }],
			/**
			* Content
			* @see https://tailwindcss.com/docs/content
			*/
			content: [{ content: [
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Background Attachment
			* @see https://tailwindcss.com/docs/background-attachment
			*/
			"bg-attachment": [{ bg: [
				"fixed",
				"local",
				"scroll"
			] }],
			/**
			* Background Clip
			* @see https://tailwindcss.com/docs/background-clip
			*/
			"bg-clip": [{ "bg-clip": [
				"border",
				"padding",
				"content",
				"text"
			] }],
			/**
			* Background Origin
			* @see https://tailwindcss.com/docs/background-origin
			*/
			"bg-origin": [{ "bg-origin": [
				"border",
				"padding",
				"content"
			] }],
			/**
			* Background Position
			* @see https://tailwindcss.com/docs/background-position
			*/
			"bg-position": [{ bg: scaleBgPosition() }],
			/**
			* Background Repeat
			* @see https://tailwindcss.com/docs/background-repeat
			*/
			"bg-repeat": [{ bg: scaleBgRepeat() }],
			/**
			* Background Size
			* @see https://tailwindcss.com/docs/background-size
			*/
			"bg-size": [{ bg: scaleBgSize() }],
			/**
			* Background Image
			* @see https://tailwindcss.com/docs/background-image
			*/
			"bg-image": [{ bg: [
				"none",
				{
					linear: [
						{ to: [
							"t",
							"tr",
							"r",
							"br",
							"b",
							"bl",
							"l",
							"tl"
						] },
						isInteger,
						isArbitraryVariable,
						isArbitraryValue
					],
					radial: [
						"",
						isArbitraryVariable,
						isArbitraryValue
					],
					conic: [
						isInteger,
						isArbitraryVariable,
						isArbitraryValue
					]
				},
				isArbitraryVariableImage,
				isArbitraryImage
			] }],
			/**
			* Background Color
			* @see https://tailwindcss.com/docs/background-color
			*/
			"bg-color": [{ bg: scaleColor() }],
			/**
			* Gradient Color Stops From Position
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-from-pos": [{ from: scaleGradientStopPosition() }],
			/**
			* Gradient Color Stops Via Position
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-via-pos": [{ via: scaleGradientStopPosition() }],
			/**
			* Gradient Color Stops To Position
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-to-pos": [{ to: scaleGradientStopPosition() }],
			/**
			* Gradient Color Stops From
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-from": [{ from: scaleColor() }],
			/**
			* Gradient Color Stops Via
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-via": [{ via: scaleColor() }],
			/**
			* Gradient Color Stops To
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-to": [{ to: scaleColor() }],
			/**
			* Border Radius
			* @see https://tailwindcss.com/docs/border-radius
			*/
			rounded: [{ rounded: scaleRadius() }],
			/**
			* Border Radius Start
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-s": [{ "rounded-s": scaleRadius() }],
			/**
			* Border Radius End
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-e": [{ "rounded-e": scaleRadius() }],
			/**
			* Border Radius Top
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-t": [{ "rounded-t": scaleRadius() }],
			/**
			* Border Radius Right
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-r": [{ "rounded-r": scaleRadius() }],
			/**
			* Border Radius Bottom
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-b": [{ "rounded-b": scaleRadius() }],
			/**
			* Border Radius Left
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-l": [{ "rounded-l": scaleRadius() }],
			/**
			* Border Radius Start Start
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-ss": [{ "rounded-ss": scaleRadius() }],
			/**
			* Border Radius Start End
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-se": [{ "rounded-se": scaleRadius() }],
			/**
			* Border Radius End End
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-ee": [{ "rounded-ee": scaleRadius() }],
			/**
			* Border Radius End Start
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-es": [{ "rounded-es": scaleRadius() }],
			/**
			* Border Radius Top Left
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-tl": [{ "rounded-tl": scaleRadius() }],
			/**
			* Border Radius Top Right
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-tr": [{ "rounded-tr": scaleRadius() }],
			/**
			* Border Radius Bottom Right
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-br": [{ "rounded-br": scaleRadius() }],
			/**
			* Border Radius Bottom Left
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-bl": [{ "rounded-bl": scaleRadius() }],
			/**
			* Border Width
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w": [{ border: scaleBorderWidth() }],
			/**
			* Border Width Inline
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-x": [{ "border-x": scaleBorderWidth() }],
			/**
			* Border Width Block
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-y": [{ "border-y": scaleBorderWidth() }],
			/**
			* Border Width Inline Start
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-s": [{ "border-s": scaleBorderWidth() }],
			/**
			* Border Width Inline End
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-e": [{ "border-e": scaleBorderWidth() }],
			/**
			* Border Width Block Start
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-bs": [{ "border-bs": scaleBorderWidth() }],
			/**
			* Border Width Block End
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-be": [{ "border-be": scaleBorderWidth() }],
			/**
			* Border Width Top
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-t": [{ "border-t": scaleBorderWidth() }],
			/**
			* Border Width Right
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-r": [{ "border-r": scaleBorderWidth() }],
			/**
			* Border Width Bottom
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-b": [{ "border-b": scaleBorderWidth() }],
			/**
			* Border Width Left
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-l": [{ "border-l": scaleBorderWidth() }],
			/**
			* Divide Width X
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-x": [{ "divide-x": scaleBorderWidth() }],
			/**
			* Divide Width X Reverse
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-x-reverse": ["divide-x-reverse"],
			/**
			* Divide Width Y
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-y": [{ "divide-y": scaleBorderWidth() }],
			/**
			* Divide Width Y Reverse
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-y-reverse": ["divide-y-reverse"],
			/**
			* Border Style
			* @see https://tailwindcss.com/docs/border-style
			*/
			"border-style": [{ border: [
				...scaleLineStyle(),
				"hidden",
				"none"
			] }],
			/**
			* Divide Style
			* @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
			*/
			"divide-style": [{ divide: [
				...scaleLineStyle(),
				"hidden",
				"none"
			] }],
			/**
			* Border Color
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color": [{ border: scaleColor() }],
			/**
			* Border Color Inline
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-x": [{ "border-x": scaleColor() }],
			/**
			* Border Color Block
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-y": [{ "border-y": scaleColor() }],
			/**
			* Border Color Inline Start
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-s": [{ "border-s": scaleColor() }],
			/**
			* Border Color Inline End
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-e": [{ "border-e": scaleColor() }],
			/**
			* Border Color Block Start
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-bs": [{ "border-bs": scaleColor() }],
			/**
			* Border Color Block End
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-be": [{ "border-be": scaleColor() }],
			/**
			* Border Color Top
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-t": [{ "border-t": scaleColor() }],
			/**
			* Border Color Right
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-r": [{ "border-r": scaleColor() }],
			/**
			* Border Color Bottom
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-b": [{ "border-b": scaleColor() }],
			/**
			* Border Color Left
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-l": [{ "border-l": scaleColor() }],
			/**
			* Divide Color
			* @see https://tailwindcss.com/docs/divide-color
			*/
			"divide-color": [{ divide: scaleColor() }],
			/**
			* Outline Style
			* @see https://tailwindcss.com/docs/outline-style
			*/
			"outline-style": [{ outline: [
				...scaleLineStyle(),
				"none",
				"hidden"
			] }],
			/**
			* Outline Offset
			* @see https://tailwindcss.com/docs/outline-offset
			*/
			"outline-offset": [{ "outline-offset": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Outline Width
			* @see https://tailwindcss.com/docs/outline-width
			*/
			"outline-w": [{ outline: [
				"",
				isNumber,
				isArbitraryVariableLength,
				isArbitraryLength
			] }],
			/**
			* Outline Color
			* @see https://tailwindcss.com/docs/outline-color
			*/
			"outline-color": [{ outline: scaleColor() }],
			/**
			* Box Shadow
			* @see https://tailwindcss.com/docs/box-shadow
			*/
			shadow: [{ shadow: [
				"",
				"none",
				themeShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Box Shadow Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
			*/
			"shadow-color": [{ shadow: scaleColor() }],
			/**
			* Inset Box Shadow
			* @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
			*/
			"inset-shadow": [{ "inset-shadow": [
				"none",
				themeInsetShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Inset Box Shadow Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
			*/
			"inset-shadow-color": [{ "inset-shadow": scaleColor() }],
			/**
			* Ring Width
			* @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
			*/
			"ring-w": [{ ring: scaleBorderWidth() }],
			/**
			* Ring Width Inset
			* @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
			* @deprecated since Tailwind CSS v4.0.0
			* @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
			*/
			"ring-w-inset": ["ring-inset"],
			/**
			* Ring Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
			*/
			"ring-color": [{ ring: scaleColor() }],
			/**
			* Ring Offset Width
			* @see https://v3.tailwindcss.com/docs/ring-offset-width
			* @deprecated since Tailwind CSS v4.0.0
			* @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
			*/
			"ring-offset-w": [{ "ring-offset": [isNumber, isArbitraryLength] }],
			/**
			* Ring Offset Color
			* @see https://v3.tailwindcss.com/docs/ring-offset-color
			* @deprecated since Tailwind CSS v4.0.0
			* @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
			*/
			"ring-offset-color": [{ "ring-offset": scaleColor() }],
			/**
			* Inset Ring Width
			* @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
			*/
			"inset-ring-w": [{ "inset-ring": scaleBorderWidth() }],
			/**
			* Inset Ring Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
			*/
			"inset-ring-color": [{ "inset-ring": scaleColor() }],
			/**
			* Text Shadow
			* @see https://tailwindcss.com/docs/text-shadow
			*/
			"text-shadow": [{ "text-shadow": [
				"none",
				themeTextShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Text Shadow Color
			* @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
			*/
			"text-shadow-color": [{ "text-shadow": scaleColor() }],
			/**
			* Opacity
			* @see https://tailwindcss.com/docs/opacity
			*/
			opacity: [{ opacity: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Mix Blend Mode
			* @see https://tailwindcss.com/docs/mix-blend-mode
			*/
			"mix-blend": [{ "mix-blend": [
				...scaleBlendMode(),
				"plus-darker",
				"plus-lighter"
			] }],
			/**
			* Background Blend Mode
			* @see https://tailwindcss.com/docs/background-blend-mode
			*/
			"bg-blend": [{ "bg-blend": scaleBlendMode() }],
			/**
			* Mask Clip
			* @see https://tailwindcss.com/docs/mask-clip
			*/
			"mask-clip": [{ "mask-clip": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }, "mask-no-clip"],
			/**
			* Mask Composite
			* @see https://tailwindcss.com/docs/mask-composite
			*/
			"mask-composite": [{ mask: [
				"add",
				"subtract",
				"intersect",
				"exclude"
			] }],
			/**
			* Mask Image
			* @see https://tailwindcss.com/docs/mask-image
			*/
			"mask-image-linear-pos": [{ "mask-linear": [isNumber] }],
			"mask-image-linear-from-pos": [{ "mask-linear-from": scaleMaskImagePosition() }],
			"mask-image-linear-to-pos": [{ "mask-linear-to": scaleMaskImagePosition() }],
			"mask-image-linear-from-color": [{ "mask-linear-from": scaleColor() }],
			"mask-image-linear-to-color": [{ "mask-linear-to": scaleColor() }],
			"mask-image-t-from-pos": [{ "mask-t-from": scaleMaskImagePosition() }],
			"mask-image-t-to-pos": [{ "mask-t-to": scaleMaskImagePosition() }],
			"mask-image-t-from-color": [{ "mask-t-from": scaleColor() }],
			"mask-image-t-to-color": [{ "mask-t-to": scaleColor() }],
			"mask-image-r-from-pos": [{ "mask-r-from": scaleMaskImagePosition() }],
			"mask-image-r-to-pos": [{ "mask-r-to": scaleMaskImagePosition() }],
			"mask-image-r-from-color": [{ "mask-r-from": scaleColor() }],
			"mask-image-r-to-color": [{ "mask-r-to": scaleColor() }],
			"mask-image-b-from-pos": [{ "mask-b-from": scaleMaskImagePosition() }],
			"mask-image-b-to-pos": [{ "mask-b-to": scaleMaskImagePosition() }],
			"mask-image-b-from-color": [{ "mask-b-from": scaleColor() }],
			"mask-image-b-to-color": [{ "mask-b-to": scaleColor() }],
			"mask-image-l-from-pos": [{ "mask-l-from": scaleMaskImagePosition() }],
			"mask-image-l-to-pos": [{ "mask-l-to": scaleMaskImagePosition() }],
			"mask-image-l-from-color": [{ "mask-l-from": scaleColor() }],
			"mask-image-l-to-color": [{ "mask-l-to": scaleColor() }],
			"mask-image-x-from-pos": [{ "mask-x-from": scaleMaskImagePosition() }],
			"mask-image-x-to-pos": [{ "mask-x-to": scaleMaskImagePosition() }],
			"mask-image-x-from-color": [{ "mask-x-from": scaleColor() }],
			"mask-image-x-to-color": [{ "mask-x-to": scaleColor() }],
			"mask-image-y-from-pos": [{ "mask-y-from": scaleMaskImagePosition() }],
			"mask-image-y-to-pos": [{ "mask-y-to": scaleMaskImagePosition() }],
			"mask-image-y-from-color": [{ "mask-y-from": scaleColor() }],
			"mask-image-y-to-color": [{ "mask-y-to": scaleColor() }],
			"mask-image-radial": [{ "mask-radial": [isArbitraryVariable, isArbitraryValue] }],
			"mask-image-radial-from-pos": [{ "mask-radial-from": scaleMaskImagePosition() }],
			"mask-image-radial-to-pos": [{ "mask-radial-to": scaleMaskImagePosition() }],
			"mask-image-radial-from-color": [{ "mask-radial-from": scaleColor() }],
			"mask-image-radial-to-color": [{ "mask-radial-to": scaleColor() }],
			"mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
			"mask-image-radial-size": [{ "mask-radial": [{
				closest: ["side", "corner"],
				farthest: ["side", "corner"]
			}] }],
			"mask-image-radial-pos": [{ "mask-radial-at": scalePosition() }],
			"mask-image-conic-pos": [{ "mask-conic": [isNumber] }],
			"mask-image-conic-from-pos": [{ "mask-conic-from": scaleMaskImagePosition() }],
			"mask-image-conic-to-pos": [{ "mask-conic-to": scaleMaskImagePosition() }],
			"mask-image-conic-from-color": [{ "mask-conic-from": scaleColor() }],
			"mask-image-conic-to-color": [{ "mask-conic-to": scaleColor() }],
			/**
			* Mask Mode
			* @see https://tailwindcss.com/docs/mask-mode
			*/
			"mask-mode": [{ mask: [
				"alpha",
				"luminance",
				"match"
			] }],
			/**
			* Mask Origin
			* @see https://tailwindcss.com/docs/mask-origin
			*/
			"mask-origin": [{ "mask-origin": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }],
			/**
			* Mask Position
			* @see https://tailwindcss.com/docs/mask-position
			*/
			"mask-position": [{ mask: scaleBgPosition() }],
			/**
			* Mask Repeat
			* @see https://tailwindcss.com/docs/mask-repeat
			*/
			"mask-repeat": [{ mask: scaleBgRepeat() }],
			/**
			* Mask Size
			* @see https://tailwindcss.com/docs/mask-size
			*/
			"mask-size": [{ mask: scaleBgSize() }],
			/**
			* Mask Type
			* @see https://tailwindcss.com/docs/mask-type
			*/
			"mask-type": [{ "mask-type": ["alpha", "luminance"] }],
			/**
			* Mask Image
			* @see https://tailwindcss.com/docs/mask-image
			*/
			"mask-image": [{ mask: [
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Filter
			* @see https://tailwindcss.com/docs/filter
			*/
			filter: [{ filter: [
				"",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Blur
			* @see https://tailwindcss.com/docs/blur
			*/
			blur: [{ blur: scaleBlur() }],
			/**
			* Brightness
			* @see https://tailwindcss.com/docs/brightness
			*/
			brightness: [{ brightness: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Contrast
			* @see https://tailwindcss.com/docs/contrast
			*/
			contrast: [{ contrast: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Drop Shadow
			* @see https://tailwindcss.com/docs/drop-shadow
			*/
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				themeDropShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Drop Shadow Color
			* @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
			*/
			"drop-shadow-color": [{ "drop-shadow": scaleColor() }],
			/**
			* Grayscale
			* @see https://tailwindcss.com/docs/grayscale
			*/
			grayscale: [{ grayscale: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Hue Rotate
			* @see https://tailwindcss.com/docs/hue-rotate
			*/
			"hue-rotate": [{ "hue-rotate": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Invert
			* @see https://tailwindcss.com/docs/invert
			*/
			invert: [{ invert: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Saturate
			* @see https://tailwindcss.com/docs/saturate
			*/
			saturate: [{ saturate: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Sepia
			* @see https://tailwindcss.com/docs/sepia
			*/
			sepia: [{ sepia: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Filter
			* @see https://tailwindcss.com/docs/backdrop-filter
			*/
			"backdrop-filter": [{ "backdrop-filter": [
				"",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Blur
			* @see https://tailwindcss.com/docs/backdrop-blur
			*/
			"backdrop-blur": [{ "backdrop-blur": scaleBlur() }],
			/**
			* Backdrop Brightness
			* @see https://tailwindcss.com/docs/backdrop-brightness
			*/
			"backdrop-brightness": [{ "backdrop-brightness": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Contrast
			* @see https://tailwindcss.com/docs/backdrop-contrast
			*/
			"backdrop-contrast": [{ "backdrop-contrast": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Grayscale
			* @see https://tailwindcss.com/docs/backdrop-grayscale
			*/
			"backdrop-grayscale": [{ "backdrop-grayscale": [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Hue Rotate
			* @see https://tailwindcss.com/docs/backdrop-hue-rotate
			*/
			"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Invert
			* @see https://tailwindcss.com/docs/backdrop-invert
			*/
			"backdrop-invert": [{ "backdrop-invert": [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Opacity
			* @see https://tailwindcss.com/docs/backdrop-opacity
			*/
			"backdrop-opacity": [{ "backdrop-opacity": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Saturate
			* @see https://tailwindcss.com/docs/backdrop-saturate
			*/
			"backdrop-saturate": [{ "backdrop-saturate": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Sepia
			* @see https://tailwindcss.com/docs/backdrop-sepia
			*/
			"backdrop-sepia": [{ "backdrop-sepia": [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Border Collapse
			* @see https://tailwindcss.com/docs/border-collapse
			*/
			"border-collapse": [{ border: ["collapse", "separate"] }],
			/**
			* Border Spacing
			* @see https://tailwindcss.com/docs/border-spacing
			*/
			"border-spacing": [{ "border-spacing": scaleUnambiguousSpacing() }],
			/**
			* Border Spacing X
			* @see https://tailwindcss.com/docs/border-spacing
			*/
			"border-spacing-x": [{ "border-spacing-x": scaleUnambiguousSpacing() }],
			/**
			* Border Spacing Y
			* @see https://tailwindcss.com/docs/border-spacing
			*/
			"border-spacing-y": [{ "border-spacing-y": scaleUnambiguousSpacing() }],
			/**
			* Table Layout
			* @see https://tailwindcss.com/docs/table-layout
			*/
			"table-layout": [{ table: ["auto", "fixed"] }],
			/**
			* Caption Side
			* @see https://tailwindcss.com/docs/caption-side
			*/
			caption: [{ caption: ["top", "bottom"] }],
			/**
			* Transition Property
			* @see https://tailwindcss.com/docs/transition-property
			*/
			transition: [{ transition: [
				"",
				"all",
				"colors",
				"opacity",
				"shadow",
				"transform",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Transition Behavior
			* @see https://tailwindcss.com/docs/transition-behavior
			*/
			"transition-behavior": [{ transition: ["normal", "discrete"] }],
			/**
			* Transition Duration
			* @see https://tailwindcss.com/docs/transition-duration
			*/
			duration: [{ duration: [
				isNumber,
				"initial",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Transition Timing Function
			* @see https://tailwindcss.com/docs/transition-timing-function
			*/
			ease: [{ ease: [
				"linear",
				"initial",
				themeEase,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Transition Delay
			* @see https://tailwindcss.com/docs/transition-delay
			*/
			delay: [{ delay: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Animation
			* @see https://tailwindcss.com/docs/animation
			*/
			animate: [{ animate: [
				"none",
				themeAnimate,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backface Visibility
			* @see https://tailwindcss.com/docs/backface-visibility
			*/
			backface: [{ backface: ["hidden", "visible"] }],
			/**
			* Perspective
			* @see https://tailwindcss.com/docs/perspective
			*/
			perspective: [{ perspective: [
				themePerspective,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Perspective Origin
			* @see https://tailwindcss.com/docs/perspective-origin
			*/
			"perspective-origin": [{ "perspective-origin": scalePositionWithArbitrary() }],
			/**
			* Rotate
			* @see https://tailwindcss.com/docs/rotate
			*/
			rotate: [{ rotate: scaleRotate() }],
			/**
			* Rotate X
			* @see https://tailwindcss.com/docs/rotate
			*/
			"rotate-x": [{ "rotate-x": scaleRotate() }],
			/**
			* Rotate Y
			* @see https://tailwindcss.com/docs/rotate
			*/
			"rotate-y": [{ "rotate-y": scaleRotate() }],
			/**
			* Rotate Z
			* @see https://tailwindcss.com/docs/rotate
			*/
			"rotate-z": [{ "rotate-z": scaleRotate() }],
			/**
			* Scale
			* @see https://tailwindcss.com/docs/scale
			*/
			scale: [{ scale: scaleScale() }],
			/**
			* Scale X
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-x": [{ "scale-x": scaleScale() }],
			/**
			* Scale Y
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-y": [{ "scale-y": scaleScale() }],
			/**
			* Scale Z
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-z": [{ "scale-z": scaleScale() }],
			/**
			* Scale 3D
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-3d": ["scale-3d"],
			/**
			* Skew
			* @see https://tailwindcss.com/docs/skew
			*/
			skew: [{ skew: scaleSkew() }],
			/**
			* Skew X
			* @see https://tailwindcss.com/docs/skew
			*/
			"skew-x": [{ "skew-x": scaleSkew() }],
			/**
			* Skew Y
			* @see https://tailwindcss.com/docs/skew
			*/
			"skew-y": [{ "skew-y": scaleSkew() }],
			/**
			* Transform
			* @see https://tailwindcss.com/docs/transform
			*/
			transform: [{ transform: [
				isArbitraryVariable,
				isArbitraryValue,
				"",
				"none",
				"gpu",
				"cpu"
			] }],
			/**
			* Transform Origin
			* @see https://tailwindcss.com/docs/transform-origin
			*/
			"transform-origin": [{ origin: scalePositionWithArbitrary() }],
			/**
			* Transform Style
			* @see https://tailwindcss.com/docs/transform-style
			*/
			"transform-style": [{ transform: ["3d", "flat"] }],
			/**
			* Translate
			* @see https://tailwindcss.com/docs/translate
			*/
			translate: [{ translate: scaleTranslate() }],
			/**
			* Translate X
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-x": [{ "translate-x": scaleTranslate() }],
			/**
			* Translate Y
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-y": [{ "translate-y": scaleTranslate() }],
			/**
			* Translate Z
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-z": [{ "translate-z": scaleTranslate() }],
			/**
			* Translate None
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-none": ["translate-none"],
			/**
			* Zoom
			* @see https://tailwindcss.com/docs/zoom
			*/
			zoom: [{ zoom: [
				isInteger,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Accent Color
			* @see https://tailwindcss.com/docs/accent-color
			*/
			accent: [{ accent: scaleColor() }],
			/**
			* Appearance
			* @see https://tailwindcss.com/docs/appearance
			*/
			appearance: [{ appearance: ["none", "auto"] }],
			/**
			* Caret Color
			* @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
			*/
			"caret-color": [{ caret: scaleColor() }],
			/**
			* Color Scheme
			* @see https://tailwindcss.com/docs/color-scheme
			*/
			"color-scheme": [{ scheme: [
				"normal",
				"dark",
				"light",
				"light-dark",
				"only-dark",
				"only-light"
			] }],
			/**
			* Cursor
			* @see https://tailwindcss.com/docs/cursor
			*/
			cursor: [{ cursor: [
				"auto",
				"default",
				"pointer",
				"wait",
				"text",
				"move",
				"help",
				"not-allowed",
				"none",
				"context-menu",
				"progress",
				"cell",
				"crosshair",
				"vertical-text",
				"alias",
				"copy",
				"no-drop",
				"grab",
				"grabbing",
				"all-scroll",
				"col-resize",
				"row-resize",
				"n-resize",
				"e-resize",
				"s-resize",
				"w-resize",
				"ne-resize",
				"nw-resize",
				"se-resize",
				"sw-resize",
				"ew-resize",
				"ns-resize",
				"nesw-resize",
				"nwse-resize",
				"zoom-in",
				"zoom-out",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Field Sizing
			* @see https://tailwindcss.com/docs/field-sizing
			*/
			"field-sizing": [{ "field-sizing": ["fixed", "content"] }],
			/**
			* Pointer Events
			* @see https://tailwindcss.com/docs/pointer-events
			*/
			"pointer-events": [{ "pointer-events": ["auto", "none"] }],
			/**
			* Resize
			* @see https://tailwindcss.com/docs/resize
			*/
			resize: [{ resize: [
				"none",
				"",
				"y",
				"x"
			] }],
			/**
			* Scroll Behavior
			* @see https://tailwindcss.com/docs/scroll-behavior
			*/
			"scroll-behavior": [{ scroll: ["auto", "smooth"] }],
			/**
			* Scrollbar Thumb Color
			* @see https://tailwindcss.com/docs/scrollbar-color
			*/
			"scrollbar-thumb-color": [{ "scrollbar-thumb": scaleColor() }],
			/**
			* Scrollbar Track Color
			* @see https://tailwindcss.com/docs/scrollbar-color
			*/
			"scrollbar-track-color": [{ "scrollbar-track": scaleColor() }],
			/**
			* Scrollbar Gutter
			* @see https://tailwindcss.com/docs/scrollbar-gutter
			*/
			"scrollbar-gutter": [{ "scrollbar-gutter": [
				"auto",
				"stable",
				"both"
			] }],
			/**
			* Scrollbar Width
			* @see https://tailwindcss.com/docs/scrollbar-width
			*/
			"scrollbar-w": [{ scrollbar: [
				"auto",
				"thin",
				"none"
			] }],
			/**
			* Scroll Margin
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-m": [{ "scroll-m": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Inline
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mx": [{ "scroll-mx": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Block
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-my": [{ "scroll-my": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Inline Start
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-ms": [{ "scroll-ms": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Inline End
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-me": [{ "scroll-me": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Block Start
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mbs": [{ "scroll-mbs": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Block End
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mbe": [{ "scroll-mbe": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Top
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mt": [{ "scroll-mt": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Right
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mr": [{ "scroll-mr": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Bottom
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mb": [{ "scroll-mb": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Left
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-ml": [{ "scroll-ml": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-p": [{ "scroll-p": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Inline
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-px": [{ "scroll-px": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Block
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-py": [{ "scroll-py": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Inline Start
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-ps": [{ "scroll-ps": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Inline End
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pe": [{ "scroll-pe": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Block Start
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pbs": [{ "scroll-pbs": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Block End
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pbe": [{ "scroll-pbe": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Top
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pt": [{ "scroll-pt": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Right
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pr": [{ "scroll-pr": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Bottom
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pb": [{ "scroll-pb": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Left
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pl": [{ "scroll-pl": scaleUnambiguousSpacing() }],
			/**
			* Scroll Snap Align
			* @see https://tailwindcss.com/docs/scroll-snap-align
			*/
			"snap-align": [{ snap: [
				"start",
				"end",
				"center",
				"align-none"
			] }],
			/**
			* Scroll Snap Stop
			* @see https://tailwindcss.com/docs/scroll-snap-stop
			*/
			"snap-stop": [{ snap: ["normal", "always"] }],
			/**
			* Scroll Snap Type
			* @see https://tailwindcss.com/docs/scroll-snap-type
			*/
			"snap-type": [{ snap: [
				"none",
				"x",
				"y",
				"both"
			] }],
			/**
			* Scroll Snap Type Strictness
			* @see https://tailwindcss.com/docs/scroll-snap-type
			*/
			"snap-strictness": [{ snap: ["mandatory", "proximity"] }],
			/**
			* Touch Action
			* @see https://tailwindcss.com/docs/touch-action
			*/
			touch: [{ touch: [
				"auto",
				"none",
				"manipulation"
			] }],
			/**
			* Touch Action X
			* @see https://tailwindcss.com/docs/touch-action
			*/
			"touch-x": [{ "touch-pan": [
				"x",
				"left",
				"right"
			] }],
			/**
			* Touch Action Y
			* @see https://tailwindcss.com/docs/touch-action
			*/
			"touch-y": [{ "touch-pan": [
				"y",
				"up",
				"down"
			] }],
			/**
			* Touch Action Pinch Zoom
			* @see https://tailwindcss.com/docs/touch-action
			*/
			"touch-pz": ["touch-pinch-zoom"],
			/**
			* User Select
			* @see https://tailwindcss.com/docs/user-select
			*/
			select: [{ select: [
				"none",
				"text",
				"all",
				"auto"
			] }],
			/**
			* Will Change
			* @see https://tailwindcss.com/docs/will-change
			*/
			"will-change": [{ "will-change": [
				"auto",
				"scroll",
				"contents",
				"transform",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Fill
			* @see https://tailwindcss.com/docs/fill
			*/
			fill: [{ fill: ["none", ...scaleColor()] }],
			/**
			* Stroke Width
			* @see https://tailwindcss.com/docs/stroke-width
			*/
			"stroke-w": [{ stroke: [
				isNumber,
				isArbitraryVariableLength,
				isArbitraryLength,
				isArbitraryNumber
			] }],
			/**
			* Stroke
			* @see https://tailwindcss.com/docs/stroke
			*/
			stroke: [{ stroke: ["none", ...scaleColor()] }],
			/**
			* Forced Color Adjust
			* @see https://tailwindcss.com/docs/forced-color-adjust
			*/
			"forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }]
		},
		conflictingClassGroups: {
			"container-named": ["container-type"],
			overflow: ["overflow-x", "overflow-y"],
			overscroll: ["overscroll-x", "overscroll-y"],
			inset: [
				"inset-x",
				"inset-y",
				"inset-bs",
				"inset-be",
				"start",
				"end",
				"top",
				"right",
				"bottom",
				"left"
			],
			"inset-x": ["right", "left"],
			"inset-y": ["top", "bottom"],
			flex: [
				"basis",
				"grow",
				"shrink"
			],
			gap: ["gap-x", "gap-y"],
			p: [
				"px",
				"py",
				"ps",
				"pe",
				"pbs",
				"pbe",
				"pt",
				"pr",
				"pb",
				"pl"
			],
			px: ["pr", "pl"],
			py: ["pt", "pb"],
			m: [
				"mx",
				"my",
				"ms",
				"me",
				"mbs",
				"mbe",
				"mt",
				"mr",
				"mb",
				"ml"
			],
			mx: ["mr", "ml"],
			my: ["mt", "mb"],
			size: ["w", "h"],
			"font-size": ["leading"],
			"fvn-normal": [
				"fvn-ordinal",
				"fvn-slashed-zero",
				"fvn-figure",
				"fvn-spacing",
				"fvn-fraction"
			],
			"fvn-ordinal": ["fvn-normal"],
			"fvn-slashed-zero": ["fvn-normal"],
			"fvn-figure": ["fvn-normal"],
			"fvn-spacing": ["fvn-normal"],
			"fvn-fraction": ["fvn-normal"],
			"line-clamp": ["display", "overflow"],
			rounded: [
				"rounded-s",
				"rounded-e",
				"rounded-t",
				"rounded-r",
				"rounded-b",
				"rounded-l",
				"rounded-ss",
				"rounded-se",
				"rounded-ee",
				"rounded-es",
				"rounded-tl",
				"rounded-tr",
				"rounded-br",
				"rounded-bl"
			],
			"rounded-s": ["rounded-ss", "rounded-es"],
			"rounded-e": ["rounded-se", "rounded-ee"],
			"rounded-t": ["rounded-tl", "rounded-tr"],
			"rounded-r": ["rounded-tr", "rounded-br"],
			"rounded-b": ["rounded-br", "rounded-bl"],
			"rounded-l": ["rounded-tl", "rounded-bl"],
			"border-spacing": ["border-spacing-x", "border-spacing-y"],
			"border-w": [
				"border-w-x",
				"border-w-y",
				"border-w-s",
				"border-w-e",
				"border-w-bs",
				"border-w-be",
				"border-w-t",
				"border-w-r",
				"border-w-b",
				"border-w-l"
			],
			"border-w-x": ["border-w-r", "border-w-l"],
			"border-w-y": ["border-w-t", "border-w-b"],
			"border-color": [
				"border-color-x",
				"border-color-y",
				"border-color-s",
				"border-color-e",
				"border-color-bs",
				"border-color-be",
				"border-color-t",
				"border-color-r",
				"border-color-b",
				"border-color-l"
			],
			"border-color-x": ["border-color-r", "border-color-l"],
			"border-color-y": ["border-color-t", "border-color-b"],
			translate: [
				"translate-x",
				"translate-y",
				"translate-none"
			],
			"translate-none": [
				"translate",
				"translate-x",
				"translate-y",
				"translate-z"
			],
			"scroll-m": [
				"scroll-mx",
				"scroll-my",
				"scroll-ms",
				"scroll-me",
				"scroll-mbs",
				"scroll-mbe",
				"scroll-mt",
				"scroll-mr",
				"scroll-mb",
				"scroll-ml"
			],
			"scroll-mx": ["scroll-mr", "scroll-ml"],
			"scroll-my": ["scroll-mt", "scroll-mb"],
			"scroll-p": [
				"scroll-px",
				"scroll-py",
				"scroll-ps",
				"scroll-pe",
				"scroll-pbs",
				"scroll-pbe",
				"scroll-pt",
				"scroll-pr",
				"scroll-pb",
				"scroll-pl"
			],
			"scroll-px": ["scroll-pr", "scroll-pl"],
			"scroll-py": ["scroll-pt", "scroll-pb"],
			touch: [
				"touch-x",
				"touch-y",
				"touch-pz"
			],
			"touch-x": ["touch"],
			"touch-y": ["touch"],
			"touch-pz": ["touch"]
		},
		conflictingClassGroupModifiers: { "font-size": ["leading"] },
		postfixLookupClassGroups: ["container-type"],
		orderSensitiveModifiers: [
			"*",
			"**",
			"after",
			"backdrop",
			"before",
			"details-content",
			"file",
			"first-letter",
			"first-line",
			"marker",
			"placeholder",
			"selection"
		]
	};
};
var twMerge = /*#__PURE__*/ createTailwindMerge(getDefaultConfig);
//#endregion
//#region node_modules/trough/lib/index.js
/**
* @typedef {(error?: Error | null | undefined, ...output: Array<any>) => void} Callback
*   Callback.
*
* @typedef {(...input: Array<any>) => any} Middleware
*   Ware.
*
* @typedef Pipeline
*   Pipeline.
* @property {Run} run
*   Run the pipeline.
* @property {Use} use
*   Add middleware.
*
* @typedef {(...input: Array<any>) => void} Run
*   Call all middleware.
*
*   Calls `done` on completion with either an error or the output of the
*   last middleware.
*
*   > 👉 **Note**: as the length of input defines whether async functions get a
*   > `next` function,
*   > it’s recommended to keep `input` at one value normally.

*
* @typedef {(fn: Middleware) => Pipeline} Use
*   Add middleware.
*/
/**
* Create new middleware.
*
* @returns {Pipeline}
*   Pipeline.
*/
function trough() {
	/** @type {Array<Middleware>} */
	const fns = [];
	/** @type {Pipeline} */
	const pipeline = {
		run,
		use
	};
	return pipeline;
	/** @type {Run} */
	function run(...values) {
		let middlewareIndex = -1;
		/** @type {Callback} */
		const callback = values.pop();
		if (typeof callback !== "function") throw new TypeError("Expected function as last argument, not " + callback);
		next(null, ...values);
		/**
		* Run the next `fn`, or we’re done.
		*
		* @param {Error | null | undefined} error
		* @param {Array<any>} output
		*/
		function next(error, ...output) {
			const fn = fns[++middlewareIndex];
			let index = -1;
			if (error) {
				callback(error);
				return;
			}
			while (++index < values.length) if (output[index] === null || output[index] === void 0) output[index] = values[index];
			values = output;
			if (fn) wrap(fn, next)(...output);
			else callback(null, ...output);
		}
	}
	/** @type {Use} */
	function use(middelware) {
		if (typeof middelware !== "function") throw new TypeError("Expected `middelware` to be a function, not " + middelware);
		fns.push(middelware);
		return pipeline;
	}
}
/**
* Wrap `middleware` into a uniform interface.
*
* You can pass all input to the resulting function.
* `callback` is then called with the output of `middleware`.
*
* If `middleware` accepts more arguments than the later given in input,
* an extra `done` function is passed to it after that input,
* which must be called by `middleware`.
*
* The first value in `input` is the main input value.
* All other input values are the rest input values.
* The values given to `callback` are the input values,
* merged with every non-nullish output value.
*
* * if `middleware` throws an error,
*   returns a promise that is rejected,
*   or calls the given `done` function with an error,
*   `callback` is called with that error
* * if `middleware` returns a value or returns a promise that is resolved,
*   that value is the main output value
* * if `middleware` calls `done`,
*   all non-nullish values except for the first one (the error) overwrite the
*   output values
*
* @param {Middleware} middleware
*   Function to wrap.
* @param {Callback} callback
*   Callback called with the output of `middleware`.
* @returns {Run}
*   Wrapped middleware.
*/
function wrap(middleware, callback) {
	/** @type {boolean} */
	let called;
	return wrapped;
	/**
	* Call `middleware`.
	* @this {any}
	* @param {Array<any>} parameters
	* @returns {void}
	*/
	function wrapped(...parameters) {
		const fnExpectsCallback = middleware.length > parameters.length;
		/** @type {any} */
		let result;
		if (fnExpectsCallback) parameters.push(done);
		try {
			result = middleware.apply(this, parameters);
		} catch (error) {
			const exception = error;
			if (fnExpectsCallback && called) throw exception;
			return done(exception);
		}
		if (!fnExpectsCallback) if (result && result.then && typeof result.then === "function") result.then(then, done);
		else if (result instanceof Error) done(result);
		else then(result);
	}
	/**
	* Call `callback`, only once.
	*
	* @type {Callback}
	*/
	function done(error, ...output) {
		if (!called) {
			called = true;
			callback(error, ...output);
		}
	}
	/**
	* Call `done` with one value.
	*
	* @param {any} [value]
	*/
	function then(value) {
		done(null, value);
	}
}
//#endregion
//#region node_modules/unified/lib/callable-instance.js
var import_extend = /* @__PURE__ */ __toESM(require_extend(), 1);
var CallableInstance = (
/**
* @this {Function}
* @param {string | symbol} property
* @returns {(...parameters: Array<unknown>) => unknown}
*/
function(property) {
	const proto = this.constructor.prototype;
	const value = proto[property];
	/** @type {(...parameters: Array<unknown>) => unknown} */
	const apply = function() {
		return value.apply(apply, arguments);
	};
	Object.setPrototypeOf(apply, proto);
	return apply;
});
//#endregion
//#region node_modules/unified/lib/index.js
/**
* @typedef {import('trough').Pipeline} Pipeline
*
* @typedef {import('unist').Node} Node
*
* @typedef {import('vfile').Compatible} Compatible
* @typedef {import('vfile').Value} Value
*
* @typedef {import('../index.js').CompileResultMap} CompileResultMap
* @typedef {import('../index.js').Data} Data
* @typedef {import('../index.js').Settings} Settings
*/
/**
* @typedef {CompileResultMap[keyof CompileResultMap]} CompileResults
*   Acceptable results from compilers.
*
*   To register custom results, add them to
*   {@linkcode CompileResultMap}.
*/
/**
* @template {Node} [Tree=Node]
*   The node that the compiler receives (default: `Node`).
* @template {CompileResults} [Result=CompileResults]
*   The thing that the compiler yields (default: `CompileResults`).
* @callback Compiler
*   A **compiler** handles the compiling of a syntax tree to something else
*   (in most cases, text) (TypeScript type).
*
*   It is used in the stringify phase and called with a {@linkcode Node}
*   and {@linkcode VFile} representation of the document to compile.
*   It should return the textual representation of the given tree (typically
*   `string`).
*
*   > **Note**: unified typically compiles by serializing: most compilers
*   > return `string` (or `Uint8Array`).
*   > Some compilers, such as the one configured with
*   > [`rehype-react`][rehype-react], return other values (in this case, a
*   > React tree).
*   > If you’re using a compiler that doesn’t serialize, expect different
*   > result values.
*   >
*   > To register custom results in TypeScript, add them to
*   > {@linkcode CompileResultMap}.
*
*   [rehype-react]: https://github.com/rehypejs/rehype-react
* @param {Tree} tree
*   Tree to compile.
* @param {VFile} file
*   File associated with `tree`.
* @returns {Result}
*   New content: compiled text (`string` or `Uint8Array`, for `file.value`) or
*   something else (for `file.result`).
*/
/**
* @template {Node} [Tree=Node]
*   The node that the parser yields (default: `Node`)
* @callback Parser
*   A **parser** handles the parsing of text to a syntax tree.
*
*   It is used in the parse phase and is called with a `string` and
*   {@linkcode VFile} of the document to parse.
*   It must return the syntax tree representation of the given file
*   ({@linkcode Node}).
* @param {string} document
*   Document to parse.
* @param {VFile} file
*   File associated with `document`.
* @returns {Tree}
*   Node representing the given file.
*/
/**
* @typedef {(
*   Plugin<Array<any>, any, any> |
*   PluginTuple<Array<any>, any, any> |
*   Preset
* )} Pluggable
*   Union of the different ways to add plugins and settings.
*/
/**
* @typedef {Array<Pluggable>} PluggableList
*   List of plugins and presets.
*/
/**
* @template {Array<unknown>} [PluginParameters=[]]
*   Arguments passed to the plugin (default: `[]`, the empty tuple).
* @template {Node | string | undefined} [Input=Node]
*   Value that is expected as input (default: `Node`).
*
*   *   If the plugin returns a {@linkcode Transformer}, this
*       should be the node it expects.
*   *   If the plugin sets a {@linkcode Parser}, this should be
*       `string`.
*   *   If the plugin sets a {@linkcode Compiler}, this should be the
*       node it expects.
* @template [Output=Input]
*   Value that is yielded as output (default: `Input`).
*
*   *   If the plugin returns a {@linkcode Transformer}, this
*       should be the node that that yields.
*   *   If the plugin sets a {@linkcode Parser}, this should be the
*       node that it yields.
*   *   If the plugin sets a {@linkcode Compiler}, this should be
*       result it yields.
* @typedef {(
*   (this: Processor, ...parameters: PluginParameters) =>
*     Input extends string ? // Parser.
*        Output extends Node | undefined ? undefined | void : never :
*     Output extends CompileResults ? // Compiler.
*        Input extends Node | undefined ? undefined | void : never :
*     Transformer<
*       Input extends Node ? Input : Node,
*       Output extends Node ? Output : Node
*     > | undefined | void
* )} Plugin
*   Single plugin.
*
*   Plugins configure the processors they are applied on in the following
*   ways:
*
*   *   they change the processor, such as the parser, the compiler, or by
*       configuring data
*   *   they specify how to handle trees and files
*
*   In practice, they are functions that can receive options and configure the
*   processor (`this`).
*
*   > **Note**: plugins are called when the processor is *frozen*, not when
*   > they are applied.
*/
/**
* Tuple of a plugin and its configuration.
*
* The first item is a plugin, the rest are its parameters.
*
* @template {Array<unknown>} [TupleParameters=[]]
*   Arguments passed to the plugin (default: `[]`, the empty tuple).
* @template {Node | string | undefined} [Input=undefined]
*   Value that is expected as input (optional).
*
*   *   If the plugin returns a {@linkcode Transformer}, this
*       should be the node it expects.
*   *   If the plugin sets a {@linkcode Parser}, this should be
*       `string`.
*   *   If the plugin sets a {@linkcode Compiler}, this should be the
*       node it expects.
* @template [Output=undefined] (optional).
*   Value that is yielded as output.
*
*   *   If the plugin returns a {@linkcode Transformer}, this
*       should be the node that that yields.
*   *   If the plugin sets a {@linkcode Parser}, this should be the
*       node that it yields.
*   *   If the plugin sets a {@linkcode Compiler}, this should be
*       result it yields.
* @typedef {(
*   [
*     plugin: Plugin<TupleParameters, Input, Output>,
*     ...parameters: TupleParameters
*   ]
* )} PluginTuple
*/
/**
* @typedef Preset
*   Sharable configuration.
*
*   They can contain plugins and settings.
* @property {PluggableList | undefined} [plugins]
*   List of plugins and presets (optional).
* @property {Settings | undefined} [settings]
*   Shared settings for parsers and compilers (optional).
*/
/**
* @template {VFile} [File=VFile]
*   The file that the callback receives (default: `VFile`).
* @callback ProcessCallback
*   Callback called when the process is done.
*
*   Called with either an error or a result.
* @param {Error | undefined} [error]
*   Fatal error (optional).
* @param {File | undefined} [file]
*   Processed file (optional).
* @returns {undefined}
*   Nothing.
*/
/**
* @template {Node} [Tree=Node]
*   The tree that the callback receives (default: `Node`).
* @callback RunCallback
*   Callback called when transformers are done.
*
*   Called with either an error or results.
* @param {Error | undefined} [error]
*   Fatal error (optional).
* @param {Tree | undefined} [tree]
*   Transformed tree (optional).
* @param {VFile | undefined} [file]
*   File (optional).
* @returns {undefined}
*   Nothing.
*/
/**
* @template {Node} [Output=Node]
*   Node type that the transformer yields (default: `Node`).
* @callback TransformCallback
*   Callback passed to transforms.
*
*   If the signature of a `transformer` accepts a third argument, the
*   transformer may perform asynchronous operations, and must call it.
* @param {Error | undefined} [error]
*   Fatal error to stop the process (optional).
* @param {Output | undefined} [tree]
*   New, changed, tree (optional).
* @param {VFile | undefined} [file]
*   New, changed, file (optional).
* @returns {undefined}
*   Nothing.
*/
/**
* @template {Node} [Input=Node]
*   Node type that the transformer expects (default: `Node`).
* @template {Node} [Output=Input]
*   Node type that the transformer yields (default: `Input`).
* @callback Transformer
*   Transformers handle syntax trees and files.
*
*   They are functions that are called each time a syntax tree and file are
*   passed through the run phase.
*   When an error occurs in them (either because it’s thrown, returned,
*   rejected, or passed to `next`), the process stops.
*
*   The run phase is handled by [`trough`][trough], see its documentation for
*   the exact semantics of these functions.
*
*   > **Note**: you should likely ignore `next`: don’t accept it.
*   > it supports callback-style async work.
*   > But promises are likely easier to reason about.
*
*   [trough]: https://github.com/wooorm/trough#function-fninput-next
* @param {Input} tree
*   Tree to handle.
* @param {VFile} file
*   File to handle.
* @param {TransformCallback<Output>} next
*   Callback.
* @returns {(
*   Promise<Output | undefined | void> |
*   Promise<never> | // For some reason this is needed separately.
*   Output |
*   Error |
*   undefined |
*   void
* )}
*   If you accept `next`, nothing.
*   Otherwise:
*
*   *   `Error` — fatal error to stop the process
*   *   `Promise<undefined>` or `undefined` — the next transformer keeps using
*       same tree
*   *   `Promise<Node>` or `Node` — new, changed, tree
*/
/**
* @template {Node | undefined} ParseTree
*   Output of `parse`.
* @template {Node | undefined} HeadTree
*   Input for `run`.
* @template {Node | undefined} TailTree
*   Output for `run`.
* @template {Node | undefined} CompileTree
*   Input of `stringify`.
* @template {CompileResults | undefined} CompileResult
*   Output of `stringify`.
* @template {Node | string | undefined} Input
*   Input of plugin.
* @template Output
*   Output of plugin (optional).
* @typedef {(
*   Input extends string
*     ? Output extends Node | undefined
*       ? // Parser.
*         Processor<
*           Output extends undefined ? ParseTree : Output,
*           HeadTree,
*           TailTree,
*           CompileTree,
*           CompileResult
*         >
*       : // Unknown.
*         Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>
*     : Output extends CompileResults
*     ? Input extends Node | undefined
*       ? // Compiler.
*         Processor<
*           ParseTree,
*           HeadTree,
*           TailTree,
*           Input extends undefined ? CompileTree : Input,
*           Output extends undefined ? CompileResult : Output
*         >
*       : // Unknown.
*         Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>
*     : Input extends Node | undefined
*     ? Output extends Node | undefined
*       ? // Transform.
*         Processor<
*           ParseTree,
*           HeadTree extends undefined ? Input : HeadTree,
*           Output extends undefined ? TailTree : Output,
*           CompileTree,
*           CompileResult
*         >
*       : // Unknown.
*         Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>
*     : // Unknown.
*       Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>
* )} UsePlugin
*   Create a processor based on the input/output of a {@link Plugin plugin}.
*/
/**
* @template {CompileResults | undefined} Result
*   Node type that the transformer yields.
* @typedef {(
*   Result extends Value | undefined ?
*     VFile :
*     VFile & {result: Result}
*   )} VFileWithOutput
*   Type to generate a {@linkcode VFile} corresponding to a compiler result.
*
*   If a result that is not acceptable on a `VFile` is used, that will
*   be stored on the `result` field of {@linkcode VFile}.
*/
var own = {}.hasOwnProperty;
/**
* Create a new processor.
*
* @example
*   This example shows how a new processor can be created (from `remark`) and linked
*   to **stdin**(4) and **stdout**(4).
*
*   ```js
*   import process from 'node:process'
*   import concatStream from 'concat-stream'
*   import {remark} from 'remark'
*
*   process.stdin.pipe(
*     concatStream(function (buf) {
*       process.stdout.write(String(remark().processSync(buf)))
*     })
*   )
*   ```
*
* @returns
*   New *unfrozen* processor (`processor`).
*
*   This processor is configured to work the same as its ancestor.
*   When the descendant processor is configured in the future it does not
*   affect the ancestral processor.
*/
var unified = new class Processor extends CallableInstance {
	/**
	* Create a processor.
	*/
	constructor() {
		super("copy");
		/**
		* Compiler to use (deprecated).
		*
		* @deprecated
		*   Use `compiler` instead.
		* @type {(
		*   Compiler<
		*     CompileTree extends undefined ? Node : CompileTree,
		*     CompileResult extends undefined ? CompileResults : CompileResult
		*   > |
		*   undefined
		* )}
		*/
		this.Compiler = void 0;
		/**
		* Parser to use (deprecated).
		*
		* @deprecated
		*   Use `parser` instead.
		* @type {(
		*   Parser<ParseTree extends undefined ? Node : ParseTree> |
		*   undefined
		* )}
		*/
		this.Parser = void 0;
		/**
		* Internal list of configured plugins.
		*
		* @deprecated
		*   This is a private internal property and should not be used.
		* @type {Array<PluginTuple<Array<unknown>>>}
		*/
		this.attachers = [];
		/**
		* Compiler to use.
		*
		* @type {(
		*   Compiler<
		*     CompileTree extends undefined ? Node : CompileTree,
		*     CompileResult extends undefined ? CompileResults : CompileResult
		*   > |
		*   undefined
		* )}
		*/
		this.compiler = void 0;
		/**
		* Internal state to track where we are while freezing.
		*
		* @deprecated
		*   This is a private internal property and should not be used.
		* @type {number}
		*/
		this.freezeIndex = -1;
		/**
		* Internal state to track whether we’re frozen.
		*
		* @deprecated
		*   This is a private internal property and should not be used.
		* @type {boolean | undefined}
		*/
		this.frozen = void 0;
		/**
		* Internal state.
		*
		* @deprecated
		*   This is a private internal property and should not be used.
		* @type {Data}
		*/
		this.namespace = {};
		/**
		* Parser to use.
		*
		* @type {(
		*   Parser<ParseTree extends undefined ? Node : ParseTree> |
		*   undefined
		* )}
		*/
		this.parser = void 0;
		/**
		* Internal list of configured transformers.
		*
		* @deprecated
		*   This is a private internal property and should not be used.
		* @type {Pipeline}
		*/
		this.transformers = trough();
	}
	/**
	* Copy a processor.
	*
	* @deprecated
	*   This is a private internal method and should not be used.
	* @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
	*   New *unfrozen* processor ({@linkcode Processor}) that is
	*   configured to work the same as its ancestor.
	*   When the descendant processor is configured in the future it does not
	*   affect the ancestral processor.
	*/
	copy() {
		const destination = new Processor();
		let index = -1;
		while (++index < this.attachers.length) {
			const attacher = this.attachers[index];
			destination.use(...attacher);
		}
		destination.data((0, import_extend.default)(true, {}, this.namespace));
		return destination;
	}
	/**
	* Configure the processor with info available to all plugins.
	* Information is stored in an object.
	*
	* Typically, options can be given to a specific plugin, but sometimes it
	* makes sense to have information shared with several plugins.
	* For example, a list of HTML elements that are self-closing, which is
	* needed during all phases.
	*
	* > **Note**: setting information cannot occur on *frozen* processors.
	* > Call the processor first to create a new unfrozen processor.
	*
	* > **Note**: to register custom data in TypeScript, augment the
	* > {@linkcode Data} interface.
	*
	* @example
	*   This example show how to get and set info:
	*
	*   ```js
	*   import {unified} from 'unified'
	*
	*   const processor = unified().data('alpha', 'bravo')
	*
	*   processor.data('alpha') // => 'bravo'
	*
	*   processor.data() // => {alpha: 'bravo'}
	*
	*   processor.data({charlie: 'delta'})
	*
	*   processor.data() // => {charlie: 'delta'}
	*   ```
	*
	* @template {keyof Data} Key
	*
	* @overload
	* @returns {Data}
	*
	* @overload
	* @param {Data} dataset
	* @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
	*
	* @overload
	* @param {Key} key
	* @returns {Data[Key]}
	*
	* @overload
	* @param {Key} key
	* @param {Data[Key]} value
	* @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
	*
	* @param {Data | Key} [key]
	*   Key to get or set, or entire dataset to set, or nothing to get the
	*   entire dataset (optional).
	* @param {Data[Key]} [value]
	*   Value to set (optional).
	* @returns {unknown}
	*   The current processor when setting, the value at `key` when getting, or
	*   the entire dataset when getting without key.
	*/
	data(key, value) {
		if (typeof key === "string") {
			if (arguments.length === 2) {
				assertUnfrozen("data", this.frozen);
				this.namespace[key] = value;
				return this;
			}
			return own.call(this.namespace, key) && this.namespace[key] || void 0;
		}
		if (key) {
			assertUnfrozen("data", this.frozen);
			this.namespace = key;
			return this;
		}
		return this.namespace;
	}
	/**
	* Freeze a processor.
	*
	* Frozen processors are meant to be extended and not to be configured
	* directly.
	*
	* When a processor is frozen it cannot be unfrozen.
	* New processors working the same way can be created by calling the
	* processor.
	*
	* It’s possible to freeze processors explicitly by calling `.freeze()`.
	* Processors freeze automatically when `.parse()`, `.run()`, `.runSync()`,
	* `.stringify()`, `.process()`, or `.processSync()` are called.
	*
	* @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
	*   The current processor.
	*/
	freeze() {
		if (this.frozen) return this;
		const self = this;
		while (++this.freezeIndex < this.attachers.length) {
			const [attacher, ...options] = this.attachers[this.freezeIndex];
			if (options[0] === false) continue;
			if (options[0] === true) options[0] = void 0;
			const transformer = attacher.call(self, ...options);
			if (typeof transformer === "function") this.transformers.use(transformer);
		}
		this.frozen = true;
		this.freezeIndex = Number.POSITIVE_INFINITY;
		return this;
	}
	/**
	* Parse text to a syntax tree.
	*
	* > **Note**: `parse` freezes the processor if not already *frozen*.
	*
	* > **Note**: `parse` performs the parse phase, not the run phase or other
	* > phases.
	*
	* @param {Compatible | undefined} [file]
	*   file to parse (optional); typically `string` or `VFile`; any value
	*   accepted as `x` in `new VFile(x)`.
	* @returns {ParseTree extends undefined ? Node : ParseTree}
	*   Syntax tree representing `file`.
	*/
	parse(file) {
		this.freeze();
		const realFile = vfile(file);
		const parser = this.parser || this.Parser;
		assertParser("parse", parser);
		return parser(String(realFile), realFile);
	}
	/**
	* Process the given file as configured on the processor.
	*
	* > **Note**: `process` freezes the processor if not already *frozen*.
	*
	* > **Note**: `process` performs the parse, run, and stringify phases.
	*
	* @overload
	* @param {Compatible | undefined} file
	* @param {ProcessCallback<VFileWithOutput<CompileResult>>} done
	* @returns {undefined}
	*
	* @overload
	* @param {Compatible | undefined} [file]
	* @returns {Promise<VFileWithOutput<CompileResult>>}
	*
	* @param {Compatible | undefined} [file]
	*   File (optional); typically `string` or `VFile`]; any value accepted as
	*   `x` in `new VFile(x)`.
	* @param {ProcessCallback<VFileWithOutput<CompileResult>> | undefined} [done]
	*   Callback (optional).
	* @returns {Promise<VFile> | undefined}
	*   Nothing if `done` is given.
	*   Otherwise a promise, rejected with a fatal error or resolved with the
	*   processed file.
	*
	*   The parsed, transformed, and compiled value is available at
	*   `file.value` (see note).
	*
	*   > **Note**: unified typically compiles by serializing: most
	*   > compilers return `string` (or `Uint8Array`).
	*   > Some compilers, such as the one configured with
	*   > [`rehype-react`][rehype-react], return other values (in this case, a
	*   > React tree).
	*   > If you’re using a compiler that doesn’t serialize, expect different
	*   > result values.
	*   >
	*   > To register custom results in TypeScript, add them to
	*   > {@linkcode CompileResultMap}.
	*
	*   [rehype-react]: https://github.com/rehypejs/rehype-react
	*/
	process(file, done) {
		const self = this;
		this.freeze();
		assertParser("process", this.parser || this.Parser);
		assertCompiler("process", this.compiler || this.Compiler);
		return done ? executor(void 0, done) : new Promise(executor);
		/**
		* @param {((file: VFileWithOutput<CompileResult>) => undefined | void) | undefined} resolve
		* @param {(error: Error | undefined) => undefined | void} reject
		* @returns {undefined}
		*/
		function executor(resolve, reject) {
			const realFile = vfile(file);
			const parseTree = self.parse(realFile);
			self.run(parseTree, realFile, function(error, tree, file) {
				if (error || !tree || !file) return realDone(error);
				const compileTree = tree;
				const compileResult = self.stringify(compileTree, file);
				if (looksLikeAValue(compileResult)) file.value = compileResult;
				else file.result = compileResult;
				realDone(error, file);
			});
			/**
			* @param {Error | undefined} error
			* @param {VFileWithOutput<CompileResult> | undefined} [file]
			* @returns {undefined}
			*/
			function realDone(error, file) {
				if (error || !file) reject(error);
				else if (resolve) resolve(file);
				else done(void 0, file);
			}
		}
	}
	/**
	* Process the given file as configured on the processor.
	*
	* An error is thrown if asynchronous transforms are configured.
	*
	* > **Note**: `processSync` freezes the processor if not already *frozen*.
	*
	* > **Note**: `processSync` performs the parse, run, and stringify phases.
	*
	* @param {Compatible | undefined} [file]
	*   File (optional); typically `string` or `VFile`; any value accepted as
	*   `x` in `new VFile(x)`.
	* @returns {VFileWithOutput<CompileResult>}
	*   The processed file.
	*
	*   The parsed, transformed, and compiled value is available at
	*   `file.value` (see note).
	*
	*   > **Note**: unified typically compiles by serializing: most
	*   > compilers return `string` (or `Uint8Array`).
	*   > Some compilers, such as the one configured with
	*   > [`rehype-react`][rehype-react], return other values (in this case, a
	*   > React tree).
	*   > If you’re using a compiler that doesn’t serialize, expect different
	*   > result values.
	*   >
	*   > To register custom results in TypeScript, add them to
	*   > {@linkcode CompileResultMap}.
	*
	*   [rehype-react]: https://github.com/rehypejs/rehype-react
	*/
	processSync(file) {
		/** @type {boolean} */
		let complete = false;
		/** @type {VFileWithOutput<CompileResult> | undefined} */
		let result;
		this.freeze();
		assertParser("processSync", this.parser || this.Parser);
		assertCompiler("processSync", this.compiler || this.Compiler);
		this.process(file, realDone);
		assertDone("processSync", "process", complete);
		return result;
		/**
		* @type {ProcessCallback<VFileWithOutput<CompileResult>>}
		*/
		function realDone(error, file) {
			complete = true;
			bail(error);
			result = file;
		}
	}
	/**
	* Run *transformers* on a syntax tree.
	*
	* > **Note**: `run` freezes the processor if not already *frozen*.
	*
	* > **Note**: `run` performs the run phase, not other phases.
	*
	* @overload
	* @param {HeadTree extends undefined ? Node : HeadTree} tree
	* @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
	* @returns {undefined}
	*
	* @overload
	* @param {HeadTree extends undefined ? Node : HeadTree} tree
	* @param {Compatible | undefined} file
	* @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
	* @returns {undefined}
	*
	* @overload
	* @param {HeadTree extends undefined ? Node : HeadTree} tree
	* @param {Compatible | undefined} [file]
	* @returns {Promise<TailTree extends undefined ? Node : TailTree>}
	*
	* @param {HeadTree extends undefined ? Node : HeadTree} tree
	*   Tree to transform and inspect.
	* @param {(
	*   RunCallback<TailTree extends undefined ? Node : TailTree> |
	*   Compatible
	* )} [file]
	*   File associated with `node` (optional); any value accepted as `x` in
	*   `new VFile(x)`.
	* @param {RunCallback<TailTree extends undefined ? Node : TailTree>} [done]
	*   Callback (optional).
	* @returns {Promise<TailTree extends undefined ? Node : TailTree> | undefined}
	*   Nothing if `done` is given.
	*   Otherwise, a promise rejected with a fatal error or resolved with the
	*   transformed tree.
	*/
	run(tree, file, done) {
		assertNode(tree);
		this.freeze();
		const transformers = this.transformers;
		if (!done && typeof file === "function") {
			done = file;
			file = void 0;
		}
		return done ? executor(void 0, done) : new Promise(executor);
		/**
		* @param {(
		*   ((tree: TailTree extends undefined ? Node : TailTree) => undefined | void) |
		*   undefined
		* )} resolve
		* @param {(error: Error) => undefined | void} reject
		* @returns {undefined}
		*/
		function executor(resolve, reject) {
			const realFile = vfile(file);
			transformers.run(tree, realFile, realDone);
			/**
			* @param {Error | undefined} error
			* @param {Node} outputTree
			* @param {VFile} file
			* @returns {undefined}
			*/
			function realDone(error, outputTree, file) {
				const resultingTree = outputTree || tree;
				if (error) reject(error);
				else if (resolve) resolve(resultingTree);
				else done(void 0, resultingTree, file);
			}
		}
	}
	/**
	* Run *transformers* on a syntax tree.
	*
	* An error is thrown if asynchronous transforms are configured.
	*
	* > **Note**: `runSync` freezes the processor if not already *frozen*.
	*
	* > **Note**: `runSync` performs the run phase, not other phases.
	*
	* @param {HeadTree extends undefined ? Node : HeadTree} tree
	*   Tree to transform and inspect.
	* @param {Compatible | undefined} [file]
	*   File associated with `node` (optional); any value accepted as `x` in
	*   `new VFile(x)`.
	* @returns {TailTree extends undefined ? Node : TailTree}
	*   Transformed tree.
	*/
	runSync(tree, file) {
		/** @type {boolean} */
		let complete = false;
		/** @type {(TailTree extends undefined ? Node : TailTree) | undefined} */
		let result;
		this.run(tree, file, realDone);
		assertDone("runSync", "run", complete);
		return result;
		/**
		* @type {RunCallback<TailTree extends undefined ? Node : TailTree>}
		*/
		function realDone(error, tree) {
			bail(error);
			result = tree;
			complete = true;
		}
	}
	/**
	* Compile a syntax tree.
	*
	* > **Note**: `stringify` freezes the processor if not already *frozen*.
	*
	* > **Note**: `stringify` performs the stringify phase, not the run phase
	* > or other phases.
	*
	* @param {CompileTree extends undefined ? Node : CompileTree} tree
	*   Tree to compile.
	* @param {Compatible | undefined} [file]
	*   File associated with `node` (optional); any value accepted as `x` in
	*   `new VFile(x)`.
	* @returns {CompileResult extends undefined ? Value : CompileResult}
	*   Textual representation of the tree (see note).
	*
	*   > **Note**: unified typically compiles by serializing: most compilers
	*   > return `string` (or `Uint8Array`).
	*   > Some compilers, such as the one configured with
	*   > [`rehype-react`][rehype-react], return other values (in this case, a
	*   > React tree).
	*   > If you’re using a compiler that doesn’t serialize, expect different
	*   > result values.
	*   >
	*   > To register custom results in TypeScript, add them to
	*   > {@linkcode CompileResultMap}.
	*
	*   [rehype-react]: https://github.com/rehypejs/rehype-react
	*/
	stringify(tree, file) {
		this.freeze();
		const realFile = vfile(file);
		const compiler = this.compiler || this.Compiler;
		assertCompiler("stringify", compiler);
		assertNode(tree);
		return compiler(tree, realFile);
	}
	/**
	* Configure the processor to use a plugin, a list of usable values, or a
	* preset.
	*
	* If the processor is already using a plugin, the previous plugin
	* configuration is changed based on the options that are passed in.
	* In other words, the plugin is not added a second time.
	*
	* > **Note**: `use` cannot be called on *frozen* processors.
	* > Call the processor first to create a new unfrozen processor.
	*
	* @example
	*   There are many ways to pass plugins to `.use()`.
	*   This example gives an overview:
	*
	*   ```js
	*   import {unified} from 'unified'
	*
	*   unified()
	*     // Plugin with options:
	*     .use(pluginA, {x: true, y: true})
	*     // Passing the same plugin again merges configuration (to `{x: true, y: false, z: true}`):
	*     .use(pluginA, {y: false, z: true})
	*     // Plugins:
	*     .use([pluginB, pluginC])
	*     // Two plugins, the second with options:
	*     .use([pluginD, [pluginE, {}]])
	*     // Preset with plugins and settings:
	*     .use({plugins: [pluginF, [pluginG, {}]], settings: {position: false}})
	*     // Settings only:
	*     .use({settings: {position: false}})
	*   ```
	*
	* @template {Array<unknown>} [Parameters=[]]
	* @template {Node | string | undefined} [Input=undefined]
	* @template [Output=Input]
	*
	* @overload
	* @param {Preset | null | undefined} [preset]
	* @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
	*
	* @overload
	* @param {PluggableList} list
	* @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
	*
	* @overload
	* @param {Plugin<Parameters, Input, Output>} plugin
	* @param {...(Parameters | [boolean])} parameters
	* @returns {UsePlugin<ParseTree, HeadTree, TailTree, CompileTree, CompileResult, Input, Output>}
	*
	* @param {PluggableList | Plugin | Preset | null | undefined} value
	*   Usable value.
	* @param {...unknown} parameters
	*   Parameters, when a plugin is given as a usable value.
	* @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
	*   Current processor.
	*/
	use(value, ...parameters) {
		const attachers = this.attachers;
		const namespace = this.namespace;
		assertUnfrozen("use", this.frozen);
		if (value === null || value === void 0) {} else if (typeof value === "function") addPlugin(value, parameters);
		else if (typeof value === "object") if (Array.isArray(value)) addList(value);
		else addPreset(value);
		else throw new TypeError("Expected usable value, not `" + value + "`");
		return this;
		/**
		* @param {Pluggable} value
		* @returns {undefined}
		*/
		function add(value) {
			if (typeof value === "function") addPlugin(value, []);
			else if (typeof value === "object") if (Array.isArray(value)) {
				const [plugin, ...parameters] = value;
				addPlugin(plugin, parameters);
			} else addPreset(value);
			else throw new TypeError("Expected usable value, not `" + value + "`");
		}
		/**
		* @param {Preset} result
		* @returns {undefined}
		*/
		function addPreset(result) {
			if (!("plugins" in result) && !("settings" in result)) throw new Error("Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither");
			addList(result.plugins);
			if (result.settings) namespace.settings = (0, import_extend.default)(true, namespace.settings, result.settings);
		}
		/**
		* @param {PluggableList | null | undefined} plugins
		* @returns {undefined}
		*/
		function addList(plugins) {
			let index = -1;
			if (plugins === null || plugins === void 0) {} else if (Array.isArray(plugins)) while (++index < plugins.length) {
				const thing = plugins[index];
				add(thing);
			}
			else throw new TypeError("Expected a list of plugins, not `" + plugins + "`");
		}
		/**
		* @param {Plugin} plugin
		* @param {Array<unknown>} parameters
		* @returns {undefined}
		*/
		function addPlugin(plugin, parameters) {
			let index = -1;
			let entryIndex = -1;
			while (++index < attachers.length) if (attachers[index][0] === plugin) {
				entryIndex = index;
				break;
			}
			if (entryIndex === -1) attachers.push([plugin, ...parameters]);
			else if (parameters.length > 0) {
				let [primary, ...rest] = parameters;
				const currentPrimary = attachers[entryIndex][1];
				if (isPlainObject(currentPrimary) && isPlainObject(primary)) primary = (0, import_extend.default)(true, currentPrimary, primary);
				attachers[entryIndex] = [
					plugin,
					primary,
					...rest
				];
			}
		}
	}
}().freeze();
/**
* Assert a parser is available.
*
* @param {string} name
* @param {unknown} value
* @returns {asserts value is Parser}
*/
function assertParser(name, value) {
	if (typeof value !== "function") throw new TypeError("Cannot `" + name + "` without `parser`");
}
/**
* Assert a compiler is available.
*
* @param {string} name
* @param {unknown} value
* @returns {asserts value is Compiler}
*/
function assertCompiler(name, value) {
	if (typeof value !== "function") throw new TypeError("Cannot `" + name + "` without `compiler`");
}
/**
* Assert the processor is not frozen.
*
* @param {string} name
* @param {unknown} frozen
* @returns {asserts frozen is false}
*/
function assertUnfrozen(name, frozen) {
	if (frozen) throw new Error("Cannot call `" + name + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.");
}
/**
* Assert `node` is a unist node.
*
* @param {unknown} node
* @returns {asserts node is Node}
*/
function assertNode(node) {
	if (!isPlainObject(node) || typeof node.type !== "string") throw new TypeError("Expected node, got `" + node + "`");
}
/**
* Assert that `complete` is `true`.
*
* @param {string} name
* @param {string} asyncName
* @param {unknown} complete
* @returns {asserts complete is true}
*/
function assertDone(name, asyncName, complete) {
	if (!complete) throw new Error("`" + name + "` finished async. Use `" + asyncName + "` instead");
}
/**
* @param {Compatible | undefined} [value]
* @returns {VFile}
*/
function vfile(value) {
	return looksLikeAVFile(value) ? value : new VFile(value);
}
/**
* @param {Compatible | undefined} [value]
* @returns {value is VFile}
*/
function looksLikeAVFile(value) {
	return Boolean(value && typeof value === "object" && "message" in value && "messages" in value);
}
/**
* @param {unknown} [value]
* @returns {value is Value}
*/
function looksLikeAValue(value) {
	return typeof value === "string" || isUint8Array(value);
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
//#region node_modules/streamdown/dist/chunk-BO2N2NFS.js
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
var Bn = 300;
var An = "300px";
var On = 500;
function Rt(e = {}) {
	let { immediate: t = false, debounceDelay: o = Bn, rootMargin: n = An, idleTimeout: r = On } = e, [s, a] = (0, import_react.useState)(false), l = (0, import_react.useRef)(null), i = (0, import_react.useRef)(null), d = (0, import_react.useRef)(null), c = (0, import_react.useMemo)(() => (u) => {
		let f = Date.now();
		return window.setTimeout(() => {
			u({
				didTimeout: false,
				timeRemaining: () => Math.max(0, 50 - (Date.now() - f))
			});
		}, 1);
	}, []), p = (0, import_react.useMemo)(() => typeof window != "undefined" && window.requestIdleCallback ? (u, f) => window.requestIdleCallback(u, f) : c, [c]), m = (0, import_react.useMemo)(() => typeof window != "undefined" && window.cancelIdleCallback ? (u) => window.cancelIdleCallback(u) : (u) => {
		clearTimeout(u);
	}, []);
	return (0, import_react.useEffect)(() => {
		if (t) {
			a(true);
			return;
		}
		let u = l.current;
		if (!u) return;
		i.current && (clearTimeout(i.current), i.current = null), d.current && (m(d.current), d.current = null);
		let f = () => {
			i.current && (clearTimeout(i.current), i.current = null), d.current && (m(d.current), d.current = null);
		}, h = (v) => {
			d.current = p((w) => {
				w.timeRemaining() > 0 || w.didTimeout ? (a(true), v.disconnect()) : d.current = p(() => {
					a(true), v.disconnect();
				}, { timeout: r / 2 });
			}, { timeout: r });
		}, b = (v) => {
			f(), i.current = window.setTimeout(() => {
				var M, H;
				let w = v.takeRecords();
				(w.length === 0 || (H = (M = w.at(-1)) == null ? void 0 : M.isIntersecting) != null && H) && h(v);
			}, o);
		}, g = (v, w) => {
			v.isIntersecting ? b(w) : f();
		}, T = new IntersectionObserver((v) => {
			for (let w of v) g(w, T);
		}, {
			rootMargin: n,
			threshold: 0
		});
		return T.observe(u), () => {
			i.current && clearTimeout(i.current), d.current && m(d.current), T.disconnect();
		};
	}, [
		t,
		o,
		n,
		r,
		m,
		p
	]), {
		shouldRender: s,
		containerRef: l
	};
}
var St = /\s/;
var Fn = /^\s+$/;
var zn = /* @__PURE__ */ new Set([
	"code",
	"pre",
	"svg",
	"math",
	"annotation"
]);
var _n = (e) => typeof e == "object" && e !== null && "type" in e && e.type === "element";
var qn = (e) => e.some((t) => _n(t) && zn.has(t.tagName));
var $n = (e) => {
	let t = [], o = "", n = false;
	for (let r of e) {
		let s = St.test(r);
		s !== n && o && (t.push(o), o = ""), o += r, n = s;
	}
	return o && t.push(o), t;
};
var Wn = (e) => {
	let t = [], o = "";
	for (let n of e) St.test(n) ? o += n : (o && (t.push(o), o = ""), t.push(n));
	return o && t.push(o), t;
};
var Zn = (e, t, o, n, r, s) => {
	let a = `--sd-animation:sd-${t};--sd-duration:${r ? 0 : o}ms;--sd-easing:${n}`;
	return s && (a += `;--sd-delay:${s}ms`), {
		type: "element",
		tagName: "span",
		properties: {
			"data-sd-animate": true,
			style: a
		},
		children: [{
			type: "text",
			value: e
		}]
	};
};
var Xn = (e, t, o, n, r) => {
	let s = t.at(-1);
	if (!(s && "children" in s)) return;
	if (qn(t)) return SKIP;
	let a = s, l = a.children.indexOf(e);
	if (l === -1) return;
	let i = e.value;
	if (!i.trim()) {
		r.count += i.length;
		return;
	}
	let d = o.sep === "char" ? Wn(i) : $n(i), c = n.prevContentLength, p = d.map((m) => {
		let u = r.count;
		if (r.count += m.length, Fn.test(m)) return {
			type: "text",
			value: m
		};
		let f = c > 0 && u < c, h = f ? 0 : r.newIndex++ * o.stagger;
		return Zn(m, o.animation, o.duration, o.easing, f, h);
	});
	return a.children.splice(l, 1, ...p), l + p.length;
};
var Jn = 0;
function be(e) {
	var s, a, l, i, d;
	let t = {
		animation: (s = e == null ? void 0 : e.animation) != null ? s : "fadeIn",
		duration: (a = e == null ? void 0 : e.duration) != null ? a : 150,
		easing: (l = e == null ? void 0 : e.easing) != null ? l : "ease",
		sep: (i = e == null ? void 0 : e.sep) != null ? i : "word",
		stagger: (d = e == null ? void 0 : e.stagger) != null ? d : 40
	}, o = {
		prevContentLength: 0,
		lastRenderCharCount: 0
	}, n = Jn++, r = () => (c) => {
		let p = {
			count: 0,
			newIndex: 0
		};
		visitParents(c, "text", (m, u) => Xn(m, u, t, o, p)), o.lastRenderCharCount = p.count, o.prevContentLength = 0;
	};
	return Object.defineProperty(r, "name", { value: `rehypeAnimate$${n}` }), {
		name: "animate",
		type: "animate",
		rehypePlugin: r,
		setPrevContentLength(c) {
			o.prevContentLength = c;
		},
		getLastRenderCharCount() {
			let c = o.lastRenderCharCount;
			return o.lastRenderCharCount = 0, c;
		}
	};
}
be();
var et = (0, import_react.createContext)(false);
var tt = () => (0, import_react.useContext)(et);
var he = (...e) => twMerge(clsx(e));
var Gn = (e, t) => {
	if (!e || !t) return t;
	let o = `${e}:`;
	return t.split(/\s+/).filter(Boolean).map((n) => n.startsWith(o) ? n : `${e}:${n}`).join(" ");
};
var Dt = (e) => e ? (...t) => Gn(e, twMerge(clsx(t))) : he;
var W = (e, t, o) => {
	let n = typeof t == "string" && o.startsWith("text/csv") ? "﻿" : "", r = typeof t == "string" ? new Blob([n + t], { type: o }) : t, s = URL.createObjectURL(r), a = document.createElement("a");
	a.href = s, a.download = e, document.body.appendChild(a), a.click(), document.body.removeChild(a), URL.revokeObjectURL(s);
};
var Ee = (0, import_react.createContext)(he);
var y = () => (0, import_react.useContext)(Ee);
var tr = he("block", "before:content-[counter(line)]", "before:inline-block", "before:[counter-increment:line]", "before:w-6", "before:mr-4", "before:text-[13px]", "before:text-right", "before:text-muted-foreground/50", "before:font-mono", "before:select-none");
var or = (e) => {
	let t = {};
	for (let o of e.split(";")) {
		let n = o.indexOf(":");
		if (n > 0) {
			let r = o.slice(0, n).trim(), s = o.slice(n + 1).trim();
			r && s && (t[r] = s);
		}
	}
	return t;
};
var At = (0, import_react.memo)(({ children: e, result: t, language: o, className: n, startLine: r, lineNumbers: s = true, ...a }) => {
	let l = y(), i = (0, import_react.useMemo)(() => l(tr), [l]), d = (0, import_react.useMemo)(() => {
		let c = {};
		return t.bg && (c["--sdm-bg"] = t.bg), t.fg && (c["--sdm-fg"] = t.fg), t.rootStyle && Object.assign(c, or(t.rootStyle)), c;
	}, [
		t.bg,
		t.fg,
		t.rootStyle
	]);
	return (0, import_jsx_runtime.jsx)("div", {
		className: l(n, "overflow-x-auto rounded-md border border-border bg-background p-4 text-sm"),
		"data-language": o,
		"data-streamdown": "code-block-body",
		...a,
		children: (0, import_jsx_runtime.jsx)("pre", {
			className: l(n, "bg-[var(--sdm-bg,inherit]", "dark:bg-[var(--shiki-dark-bg,var(--sdm-bg,inherit)]"),
			style: d,
			children: (0, import_jsx_runtime.jsx)("code", {
				className: s ? l("[counter-increment:line_0] [counter-reset:line]") : void 0,
				style: s && r && r > 1 ? { counterReset: `line ${r - 1}` } : void 0,
				children: t.tokens.map((c, p) => (0, import_jsx_runtime.jsx)("span", {
					className: s ? i : void 0,
					children: c.length === 0 || c.length === 1 && c[0].content === "" ? `
` : c.map((m, u) => {
						let f = {}, h = !!m.bgColor;
						if (m.color && (f["--sdm-c"] = m.color), m.bgColor && (f["--sdm-tbg"] = m.bgColor), m.htmlStyle) for (let [b, g] of Object.entries(m.htmlStyle)) b === "color" ? f["--sdm-c"] = g : b === "background-color" ? (f["--sdm-tbg"] = g, h = true) : f[b] = g;
						return (0, import_jsx_runtime.jsx)("span", {
							className: l("text-[var(--sdm-c,inherit)]", "dark:text-[var(--shiki-dark,var(--sdm-c,inherit))]", h && "bg-[var(--sdm-tbg)]", h && "dark:bg-[var(--shiki-dark-bg,var(--sdm-tbg))]"),
							style: f,
							...m.htmlAttrs,
							children: m.content
						}, u);
					})
				}, p))
			})
		})
	});
}, (e, t) => e.result === t.result && e.language === t.language && e.className === t.className && e.startLine === t.startLine && e.lineNumbers === t.lineNumbers);
var ot = ({ className: e, language: t, style: o, isIncomplete: n, ...r }) => {
	let s = y();
	return (0, import_jsx_runtime.jsx)("div", {
		className: s("my-4 flex w-full flex-col gap-2 rounded-xl border border-border bg-sidebar p-2", e),
		"data-incomplete": n || void 0,
		"data-language": t,
		"data-streamdown": "code-block",
		style: {
			contentVisibility: "auto",
			containIntrinsicSize: "auto 200px",
			...o
		},
		...r
	});
};
var nt = (0, import_react.createContext)({ code: "" });
var He = () => (0, import_react.useContext)(nt);
var rt = ({ language: e }) => {
	let t = y();
	return (0, import_jsx_runtime.jsx)("div", {
		className: t("flex h-8 items-center text-muted-foreground text-xs"),
		"data-language": e,
		"data-streamdown": "code-block-header",
		children: (0, import_jsx_runtime.jsx)("span", {
			className: t("ml-1 font-mono lowercase"),
			children: e
		})
	});
};
var lr = (e) => {
	let t = e.length;
	for (; t > 0 && e[t - 1] === `
`;) t--;
	return e.slice(0, t);
};
var cr = (0, import_react.lazy)(() => Promise.resolve().then(() => highlighted_body_OFNGDK62_exports).then((e) => ({ default: e.HighlightedCodeBlockBody })));
var st = ({ code: e, language: t, className: o, children: n, isIncomplete: r = false, startLine: s, lineNumbers: a, ...l }) => {
	let i = y(), d = (0, import_react.useMemo)(() => lr(e), [e]), c = (0, import_react.useMemo)(() => ({
		bg: "transparent",
		fg: "inherit",
		tokens: d.split(`
`).map((p) => [{
			content: p,
			color: "inherit",
			bgColor: "transparent",
			htmlStyle: {},
			offset: 0
		}])
	}), [d]);
	return (0, import_jsx_runtime.jsx)(nt.Provider, {
		value: { code: e },
		children: (0, import_jsx_runtime.jsxs)(ot, {
			isIncomplete: r,
			language: t,
			children: [
				(0, import_jsx_runtime.jsx)(rt, { language: t }),
				n ? (0, import_jsx_runtime.jsx)("div", {
					className: i("pointer-events-none sticky top-2 z-10 -mt-10 flex h-8 items-center justify-end"),
					children: (0, import_jsx_runtime.jsx)("div", {
						className: i("pointer-events-auto flex shrink-0 items-center gap-2 rounded-md border border-sidebar bg-sidebar/80 px-1.5 py-1 supports-[backdrop-filter]:bg-sidebar/70 supports-[backdrop-filter]:backdrop-blur"),
						"data-streamdown": "code-block-actions",
						children: n
					})
				}) : null,
				(0, import_jsx_runtime.jsx)(import_react.Suspense, {
					fallback: (0, import_jsx_runtime.jsx)(At, {
						className: o,
						language: t,
						lineNumbers: a,
						result: c,
						startLine: s,
						...l
					}),
					children: (0, import_jsx_runtime.jsx)(cr, {
						className: o,
						code: d,
						language: t,
						lineNumbers: a,
						raw: c,
						startLine: s,
						...l
					})
				})
			]
		})
	});
};
var jt = (e) => (0, import_jsx_runtime.jsx)("svg", {
	color: "currentColor",
	height: 16,
	strokeLinejoin: "round",
	viewBox: "0 0 16 16",
	width: 16,
	...e,
	children: (0, import_jsx_runtime.jsx)("path", {
		clipRule: "evenodd",
		d: "M15.5607 3.99999L15.0303 4.53032L6.23744 13.3232C5.55403 14.0066 4.44599 14.0066 3.76257 13.3232L4.2929 12.7929L3.76257 13.3232L0.969676 10.5303L0.439346 9.99999L1.50001 8.93933L2.03034 9.46966L4.82323 12.2626C4.92086 12.3602 5.07915 12.3602 5.17678 12.2626L13.9697 3.46966L14.5 2.93933L15.5607 3.99999Z",
		fill: "currentColor",
		fillRule: "evenodd"
	})
});
var Ft = (e) => (0, import_jsx_runtime.jsx)("svg", {
	color: "currentColor",
	height: 16,
	strokeLinejoin: "round",
	viewBox: "0 0 16 16",
	width: 16,
	...e,
	children: (0, import_jsx_runtime.jsx)("path", {
		clipRule: "evenodd",
		d: "M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z",
		fill: "currentColor",
		fillRule: "evenodd"
	})
});
var zt = (e) => (0, import_jsx_runtime.jsx)("svg", {
	color: "currentColor",
	height: 16,
	strokeLinejoin: "round",
	viewBox: "0 0 16 16",
	width: 16,
	...e,
	children: (0, import_jsx_runtime.jsx)("path", {
		clipRule: "evenodd",
		d: "M8.75 1V1.75V8.68934L10.7197 6.71967L11.25 6.18934L12.3107 7.25L11.7803 7.78033L8.70711 10.8536C8.31658 11.2441 7.68342 11.2441 7.29289 10.8536L4.21967 7.78033L3.68934 7.25L4.75 6.18934L5.28033 6.71967L7.25 8.68934V1.75V1H8.75ZM13.5 9.25V13.5H2.5V9.25V8.5H1V9.25V14C1 14.5523 1.44771 15 2 15H14C14.5523 15 15 14.5523 15 14V9.25V8.5H13.5V9.25Z",
		fill: "currentColor",
		fillRule: "evenodd"
	})
});
var _t = (e) => (0, import_jsx_runtime.jsxs)("svg", {
	color: "currentColor",
	height: 16,
	strokeLinejoin: "round",
	viewBox: "0 0 16 16",
	width: 16,
	...e,
	children: [
		(0, import_jsx_runtime.jsx)("path", {
			d: "M8 0V4",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M8 16V12",
			opacity: "0.5",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M3.29773 1.52783L5.64887 4.7639",
			opacity: "0.9",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M12.7023 1.52783L10.3511 4.7639",
			opacity: "0.1",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M12.7023 14.472L10.3511 11.236",
			opacity: "0.4",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M3.29773 14.472L5.64887 11.236",
			opacity: "0.6",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M15.6085 5.52783L11.8043 6.7639",
			opacity: "0.2",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M0.391602 10.472L4.19583 9.23598",
			opacity: "0.7",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M15.6085 10.4722L11.8043 9.2361",
			opacity: "0.3",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M0.391602 5.52783L4.19583 6.7639",
			opacity: "0.8",
			stroke: "currentColor",
			strokeWidth: "1.5"
		})
	]
});
var qt = (e) => (0, import_jsx_runtime.jsx)("svg", {
	color: "currentColor",
	height: 16,
	strokeLinejoin: "round",
	viewBox: "0 0 16 16",
	width: 16,
	...e,
	children: (0, import_jsx_runtime.jsx)("path", {
		clipRule: "evenodd",
		d: "M1 5.25V6H2.5V5.25V2.5H5.25H6V1H5.25H2C1.44772 1 1 1.44772 1 2V5.25ZM5.25 14.9994H6V13.4994H5.25H2.5V10.7494V9.99939H1V10.7494V13.9994C1 14.5517 1.44772 14.9994 2 14.9994H5.25ZM15 10V10.75V14C15 14.5523 14.5523 15 14 15H10.75H10V13.5H10.75H13.5V10.75V10H15ZM10.75 1H10V2.5H10.75H13.5V5.25V6H15V5.25V2C15 1.44772 14.5523 1 14 1H10.75Z",
		fill: "currentColor",
		fillRule: "evenodd"
	})
});
var $t = (e) => (0, import_jsx_runtime.jsx)("svg", {
	color: "currentColor",
	height: 16,
	strokeLinejoin: "round",
	viewBox: "0 0 16 16",
	width: 16,
	...e,
	children: (0, import_jsx_runtime.jsx)("path", {
		clipRule: "evenodd",
		d: "M13.5 8C13.5 4.96643 11.0257 2.5 7.96452 2.5C5.42843 2.5 3.29365 4.19393 2.63724 6.5H5.25H6V8H5.25H0.75C0.335787 8 0 7.66421 0 7.25V2.75V2H1.5V2.75V5.23347C2.57851 2.74164 5.06835 1 7.96452 1C11.8461 1 15 4.13001 15 8C15 11.87 11.8461 15 7.96452 15C5.62368 15 3.54872 13.8617 2.27046 12.1122L1.828 11.5066L3.03915 10.6217L3.48161 11.2273C4.48831 12.6051 6.12055 13.5 7.96452 13.5C11.0257 13.5 13.5 11.0336 13.5 8Z",
		fill: "currentColor",
		fillRule: "evenodd"
	})
});
var Wt = (e) => (0, import_jsx_runtime.jsx)("svg", {
	color: "currentColor",
	height: 16,
	strokeLinejoin: "round",
	viewBox: "0 0 16 16",
	width: 16,
	...e,
	children: (0, import_jsx_runtime.jsx)("path", {
		clipRule: "evenodd",
		d: "M12.4697 13.5303L13 14.0607L14.0607 13L13.5303 12.4697L9.06065 7.99999L13.5303 3.53032L14.0607 2.99999L13 1.93933L12.4697 2.46966L7.99999 6.93933L3.53032 2.46966L2.99999 1.93933L1.93933 2.99999L2.46966 3.53032L6.93933 7.99999L2.46966 12.4697L1.93933 13L2.99999 14.0607L3.53032 13.5303L7.99999 9.06065L12.4697 13.5303Z",
		fill: "currentColor",
		fillRule: "evenodd"
	})
});
var Zt = (e) => (0, import_jsx_runtime.jsx)("svg", {
	color: "currentColor",
	height: 16,
	strokeLinejoin: "round",
	viewBox: "0 0 16 16",
	width: 16,
	...e,
	children: (0, import_jsx_runtime.jsx)("path", {
		clipRule: "evenodd",
		d: "M13.5 10.25V13.25C13.5 13.3881 13.3881 13.5 13.25 13.5H2.75C2.61193 13.5 2.5 13.3881 2.5 13.25L2.5 2.75C2.5 2.61193 2.61193 2.5 2.75 2.5H5.75H6.5V1H5.75H2.75C1.7835 1 1 1.7835 1 2.75V13.25C1 14.2165 1.7835 15 2.75 15H13.25C14.2165 15 15 14.2165 15 13.25V10.25V9.5H13.5V10.25ZM9 1H9.75H14.2495C14.6637 1 14.9995 1.33579 14.9995 1.75V6.25V7H13.4995V6.25V3.56066L8.53033 8.52978L8 9.06011L6.93934 7.99945L7.46967 7.46912L12.4388 2.5H9.75H9V1Z",
		fill: "currentColor",
		fillRule: "evenodd"
	})
});
var Xt = (e) => (0, import_jsx_runtime.jsx)("svg", {
	color: "currentColor",
	height: 16,
	strokeLinejoin: "round",
	viewBox: "0 0 16 16",
	width: 16,
	...e,
	children: (0, import_jsx_runtime.jsx)("path", {
		clipRule: "evenodd",
		d: "M1.5 6.5C1.5 3.73858 3.73858 1.5 6.5 1.5C9.26142 1.5 11.5 3.73858 11.5 6.5C11.5 9.26142 9.26142 11.5 6.5 11.5C3.73858 11.5 1.5 9.26142 1.5 6.5ZM6.5 0C2.91015 0 0 2.91015 0 6.5C0 10.0899 2.91015 13 6.5 13C8.02469 13 9.42677 12.475 10.5353 11.596L13.9697 15.0303L14.5 15.5607L15.5607 14.5L15.0303 13.9697L11.596 10.5353C12.475 9.42677 13 8.02469 13 6.5C13 2.91015 10.0899 0 6.5 0ZM4.125 5.875H4.75H5.875V4.75V4.125H7.125V4.75V5.875H8.25H8.875V7.125H8.25H7.125V8.25V8.875H5.875V8.25V7.125H4.75H4.125V5.875Z",
		fill: "currentColor",
		fillRule: "evenodd"
	})
});
var Jt = (e) => (0, import_jsx_runtime.jsx)("svg", {
	color: "currentColor",
	height: 16,
	strokeLinejoin: "round",
	viewBox: "0 0 16 16",
	width: 16,
	...e,
	children: (0, import_jsx_runtime.jsx)("path", {
		clipRule: "evenodd",
		d: "M1.5 6.5C1.5 3.73858 3.73858 1.5 6.5 1.5C9.26142 1.5 11.5 3.73858 11.5 6.5C11.5 9.26142 9.26142 11.5 6.5 11.5C3.73858 11.5 1.5 9.26142 1.5 6.5ZM6.5 0C2.91015 0 0 2.91015 0 6.5C0 10.0899 2.91015 13 6.5 13C8.02469 13 9.42677 12.475 10.5353 11.596L13.9697 15.0303L14.5 15.5607L15.5607 14.5L15.0303 13.9697L11.596 10.5353C12.475 9.42677 13 8.02469 13 6.5C13 2.91015 10.0899 0 6.5 0ZM4.125 5.875H4.75H8.25H8.875V7.125H8.25H4.75H4.125V5.875Z",
		fill: "currentColor",
		fillRule: "evenodd"
	})
});
var we = {
	CheckIcon: jt,
	CopyIcon: Ft,
	DownloadIcon: zt,
	ExternalLinkIcon: Zt,
	Loader2Icon: _t,
	Maximize2Icon: qt,
	RotateCcwIcon: $t,
	XIcon: Wt,
	ZoomInIcon: Xt,
	ZoomOutIcon: Jt
};
var Ut = (0, import_react.createContext)(we);
var fr = (e, t) => {
	if (e === t) return true;
	if (!(e && t)) return e === t;
	let o = Object.keys(e), n = Object.keys(t);
	return o.length !== n.length ? false : o.every((r) => e[r] === t[r]);
};
var at = ({ icons: e, children: t }) => {
	let o = (0, import_react.useRef)(e), n = (0, import_react.useRef)(e ? {
		...we,
		...e
	} : we);
	fr(o.current, e) || (o.current = e, n.current = e ? {
		...we,
		...e
	} : we);
	let r = n.current;
	return (0, import_jsx_runtime.jsx)(Ut.Provider, {
		value: r,
		children: t
	});
};
var L = () => (0, import_react.useContext)(Ut);
var De = {
	copyCode: "Copy Code",
	downloadFile: "Download file",
	downloadDiagram: "Download diagram",
	downloadDiagramAsSvg: "Download diagram as SVG",
	downloadDiagramAsPng: "Download diagram as PNG",
	downloadDiagramAsMmd: "Download diagram as MMD",
	viewFullscreen: "View fullscreen",
	exitFullscreen: "Exit fullscreen",
	mermaidFormatSvg: "SVG",
	mermaidFormatPng: "PNG",
	mermaidFormatMmd: "MMD",
	copyTable: "Copy table",
	copyTableAsMarkdown: "Copy table as Markdown",
	copyTableAsCsv: "Copy table as CSV",
	copyTableAsTsv: "Copy table as TSV",
	downloadTable: "Download table",
	downloadTableAsCsv: "Download table as CSV",
	downloadTableAsMarkdown: "Download table as Markdown",
	tableFormatMarkdown: "Markdown",
	tableFormatCsv: "CSV",
	tableFormatTsv: "TSV",
	imageNotAvailable: "Image not available",
	downloadImage: "Download image",
	openExternalLink: "Open external link?",
	externalLinkWarning: "You're about to visit an external website.",
	close: "Close",
	copyLink: "Copy link",
	copied: "Copied",
	openLink: "Open link"
};
var Be = (0, import_react.createContext)(De);
var D = () => (0, import_react.useContext)(Be);
var Ae = ({ onCopy: e, onError: t, timeout: o = 2e3, children: n, className: r, code: s, ...a }) => {
	let l = y(), [i, d] = (0, import_react.useState)(false), c = (0, import_react.useRef)(0), { code: p } = He(), { isAnimating: m } = (0, import_react.useContext)(R$1), u = D(), f = s != null ? s : p, h = async () => {
		var T;
		if (typeof window == "undefined" || !((T = navigator == null ? void 0 : navigator.clipboard) != null && T.writeText)) {
			t?.(/* @__PURE__ */ new Error("Clipboard API not available"));
			return;
		}
		try {
			i || (await navigator.clipboard.writeText(f), d(!0), e?.(), c.current = window.setTimeout(() => d(!1), o));
		} catch (v) {
			t?.(v);
		}
	};
	(0, import_react.useEffect)(() => () => {
		window.clearTimeout(c.current);
	}, []);
	let b = L(), g = i ? b.CheckIcon : b.CopyIcon;
	return (0, import_jsx_runtime.jsx)("button", {
		className: l("cursor-pointer p-1 text-muted-foreground transition-all hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50", r),
		"data-streamdown": "code-block-copy-button",
		disabled: m,
		onClick: h,
		title: u.copyCode,
		type: "button",
		...a,
		children: n != null ? n : (0, import_jsx_runtime.jsx)(g, { size: 14 })
	});
};
var Yt = {
	"1c": "1c",
	"1c-query": "1cq",
	abap: "abap",
	"actionscript-3": "as",
	ada: "ada",
	adoc: "adoc",
	"angular-html": "html",
	"angular-ts": "ts",
	apache: "conf",
	apex: "cls",
	apl: "apl",
	applescript: "applescript",
	ara: "ara",
	asciidoc: "adoc",
	asm: "asm",
	astro: "astro",
	awk: "awk",
	ballerina: "bal",
	bash: "sh",
	bat: "bat",
	batch: "bat",
	be: "be",
	beancount: "beancount",
	berry: "berry",
	bibtex: "bib",
	bicep: "bicep",
	blade: "blade.php",
	bsl: "bsl",
	c: "c",
	"c#": "cs",
	"c++": "cpp",
	cadence: "cdc",
	cairo: "cairo",
	cdc: "cdc",
	clarity: "clar",
	clj: "clj",
	clojure: "clj",
	"closure-templates": "soy",
	cmake: "cmake",
	cmd: "cmd",
	cobol: "cob",
	codeowners: "CODEOWNERS",
	codeql: "ql",
	coffee: "coffee",
	coffeescript: "coffee",
	"common-lisp": "lisp",
	console: "sh",
	coq: "v",
	cpp: "cpp",
	cql: "cql",
	crystal: "cr",
	cs: "cs",
	csharp: "cs",
	css: "css",
	csv: "csv",
	cue: "cue",
	cypher: "cql",
	d: "d",
	dart: "dart",
	dax: "dax",
	desktop: "desktop",
	diff: "diff",
	docker: "dockerfile",
	dockerfile: "dockerfile",
	dotenv: "env",
	"dream-maker": "dm",
	edge: "edge",
	elisp: "el",
	elixir: "ex",
	elm: "elm",
	"emacs-lisp": "el",
	erb: "erb",
	erl: "erl",
	erlang: "erl",
	f: "f",
	"f#": "fs",
	f03: "f03",
	f08: "f08",
	f18: "f18",
	f77: "f77",
	f90: "f90",
	f95: "f95",
	fennel: "fnl",
	fish: "fish",
	fluent: "ftl",
	for: "for",
	"fortran-fixed-form": "f",
	"fortran-free-form": "f90",
	fs: "fs",
	fsharp: "fs",
	fsl: "fsl",
	ftl: "ftl",
	gdresource: "tres",
	gdscript: "gd",
	gdshader: "gdshader",
	genie: "gs",
	gherkin: "feature",
	"git-commit": "gitcommit",
	"git-rebase": "gitrebase",
	gjs: "js",
	gleam: "gleam",
	"glimmer-js": "js",
	"glimmer-ts": "ts",
	glsl: "glsl",
	gnuplot: "plt",
	go: "go",
	gql: "gql",
	graphql: "graphql",
	groovy: "groovy",
	gts: "gts",
	hack: "hack",
	haml: "haml",
	handlebars: "hbs",
	haskell: "hs",
	haxe: "hx",
	hbs: "hbs",
	hcl: "hcl",
	hjson: "hjson",
	hlsl: "hlsl",
	hs: "hs",
	html: "html",
	"html-derivative": "html",
	http: "http",
	hxml: "hxml",
	hy: "hy",
	imba: "imba",
	ini: "ini",
	jade: "jade",
	java: "java",
	javascript: "js",
	jinja: "jinja",
	jison: "jison",
	jl: "jl",
	js: "js",
	json: "json",
	json5: "json5",
	jsonc: "jsonc",
	jsonl: "jsonl",
	jsonnet: "jsonnet",
	jssm: "jssm",
	jsx: "jsx",
	julia: "jl",
	kotlin: "kt",
	kql: "kql",
	kt: "kt",
	kts: "kts",
	kusto: "kql",
	latex: "tex",
	lean: "lean",
	lean4: "lean",
	less: "less",
	liquid: "liquid",
	lisp: "lisp",
	lit: "lit",
	llvm: "ll",
	log: "log",
	logo: "logo",
	lua: "lua",
	luau: "luau",
	make: "mak",
	makefile: "mak",
	markdown: "md",
	marko: "marko",
	matlab: "m",
	md: "md",
	mdc: "mdc",
	mdx: "mdx",
	mediawiki: "wiki",
	mermaid: "mmd",
	mips: "s",
	mipsasm: "s",
	mmd: "mmd",
	mojo: "mojo",
	move: "move",
	nar: "nar",
	narrat: "narrat",
	nextflow: "nf",
	nf: "nf",
	nginx: "conf",
	nim: "nim",
	nix: "nix",
	nu: "nu",
	nushell: "nu",
	objc: "m",
	"objective-c": "m",
	"objective-cpp": "mm",
	ocaml: "ml",
	pascal: "pas",
	perl: "pl",
	perl6: "p6",
	php: "php",
	plsql: "pls",
	po: "po",
	polar: "polar",
	postcss: "pcss",
	pot: "pot",
	potx: "potx",
	powerquery: "pq",
	powershell: "ps1",
	prisma: "prisma",
	prolog: "pl",
	properties: "properties",
	proto: "proto",
	protobuf: "proto",
	ps: "ps",
	ps1: "ps1",
	pug: "pug",
	puppet: "pp",
	purescript: "purs",
	py: "py",
	python: "py",
	ql: "ql",
	qml: "qml",
	qmldir: "qmldir",
	qss: "qss",
	r: "r",
	racket: "rkt",
	raku: "raku",
	razor: "cshtml",
	rb: "rb",
	reg: "reg",
	regex: "regex",
	regexp: "regexp",
	rel: "rel",
	riscv: "s",
	rs: "rs",
	rst: "rst",
	ruby: "rb",
	rust: "rs",
	sas: "sas",
	sass: "sass",
	scala: "scala",
	scheme: "scm",
	scss: "scss",
	sdbl: "sdbl",
	sh: "sh",
	shader: "shader",
	shaderlab: "shader",
	shell: "sh",
	shellscript: "sh",
	shellsession: "sh",
	smalltalk: "st",
	solidity: "sol",
	soy: "soy",
	sparql: "rq",
	spl: "spl",
	splunk: "spl",
	sql: "sql",
	"ssh-config": "config",
	stata: "do",
	styl: "styl",
	stylus: "styl",
	svelte: "svelte",
	swift: "swift",
	"system-verilog": "sv",
	systemd: "service",
	talon: "talon",
	talonscript: "talon",
	tasl: "tasl",
	tcl: "tcl",
	templ: "templ",
	terraform: "tf",
	tex: "tex",
	tf: "tf",
	tfvars: "tfvars",
	toml: "toml",
	ts: "ts",
	"ts-tags": "ts",
	tsp: "tsp",
	tsv: "tsv",
	tsx: "tsx",
	turtle: "ttl",
	twig: "twig",
	typ: "typ",
	typescript: "ts",
	typespec: "tsp",
	typst: "typ",
	v: "v",
	vala: "vala",
	vb: "vb",
	verilog: "v",
	vhdl: "vhdl",
	vim: "vim",
	viml: "vim",
	vimscript: "vim",
	vue: "vue",
	"vue-html": "html",
	"vue-vine": "vine",
	vy: "vy",
	vyper: "vy",
	wasm: "wasm",
	wenyan: "wy",
	wgsl: "wgsl",
	wiki: "wiki",
	wikitext: "wiki",
	wit: "wit",
	wl: "wl",
	wolfram: "wl",
	xml: "xml",
	xsl: "xsl",
	yaml: "yaml",
	yml: "yml",
	zenscript: "zs",
	zig: "zig",
	zsh: "zsh",
	文言: "wy"
};
var it = ({ onDownload: e, onError: t, language: o, children: n, className: r, code: s, ...a }) => {
	let l = y(), { code: i } = He(), { isAnimating: d } = (0, import_react.useContext)(R$1), c = D(), p = L(), m = s != null ? s : i, f = `file.${o && o in Yt ? Yt[o] : "txt"}`, h = "text/plain", b = () => {
		try {
			W(f, m, h), e?.();
		} catch (g) {
			t?.(g);
		}
	};
	return (0, import_jsx_runtime.jsx)("button", {
		className: l("cursor-pointer p-1 text-muted-foreground transition-all hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50", r),
		"data-streamdown": "code-block-download-button",
		disabled: d,
		onClick: b,
		title: c.downloadFile,
		type: "button",
		...a,
		children: n != null ? n : (0, import_jsx_runtime.jsx)(p.DownloadIcon, { size: 14 })
	});
};
var Oe = () => {
	let { Loader2Icon: e } = L(), t = y();
	return (0, import_jsx_runtime.jsxs)("div", {
		className: t("w-full divide-y divide-border overflow-hidden rounded-xl border border-border"),
		children: [(0, import_jsx_runtime.jsx)("div", { className: t("h-[46px] w-full bg-muted/80") }), (0, import_jsx_runtime.jsx)("div", {
			className: t("flex w-full items-center justify-center p-4"),
			children: (0, import_jsx_runtime.jsx)(e, { className: t("size-4 animate-spin") })
		})]
	});
};
var Mr = /\.[^/.]+$/;
var oo = ({ node: e, className: t, src: o, alt: n, onLoad: r, onError: s, ...a }) => {
	let { DownloadIcon: l } = L(), i = y(), d = (0, import_react.useRef)(null), [c, p] = (0, import_react.useState)(false), [m, u] = (0, import_react.useState)(false), f = D(), h = a.width != null || a.height != null, b = (c || h) && !m, g = m && !h;
	(0, import_react.useEffect)(() => {
		let P = d.current;
		if (P != null && P.complete) {
			let M = P.naturalWidth > 0;
			p(M), u(!M);
		}
	}, []);
	let T = (0, import_react.useCallback)((P) => {
		p(true), u(false), r?.(P);
	}, [r]), v = (0, import_react.useCallback)((P) => {
		p(false), u(true), s?.(P);
	}, [s]), w = async () => {
		if (o) try {
			let M = await (await fetch(o)).blob(), S = new URL(o, window.location.origin).pathname.split("/").pop() || "", F = S.split(".").pop(), j = S.includes(".") && F !== void 0 && F.length <= 4, z = "";
			if (j) z = S;
			else {
				let B = M.type, _ = "png";
				B.includes("jpeg") || B.includes("jpg") ? _ = "jpg" : B.includes("png") ? _ = "png" : B.includes("svg") ? _ = "svg" : B.includes("gif") ? _ = "gif" : B.includes("webp") && (_ = "webp"), z = `${(n || S || "image").replace(Mr, "")}.${_}`;
			}
			W(z, M, M.type);
		} catch (P) {
			window.open(o, "_blank");
		}
	};
	return o ? (0, import_jsx_runtime.jsxs)("div", {
		className: i("group relative my-4 inline-block"),
		"data-streamdown": "image-wrapper",
		children: [
			(0, import_jsx_runtime.jsx)("img", {
				alt: n,
				className: i("max-w-full rounded-lg", g && "hidden", t),
				"data-streamdown": "image",
				onError: v,
				onLoad: T,
				ref: d,
				src: o,
				...a
			}),
			g && (0, import_jsx_runtime.jsx)("span", {
				className: i("text-muted-foreground text-xs italic"),
				"data-streamdown": "image-fallback",
				children: f.imageNotAvailable
			}),
			(0, import_jsx_runtime.jsx)("div", { className: i("pointer-events-none absolute inset-0 hidden rounded-lg bg-black/10 group-hover:block") }),
			b && (0, import_jsx_runtime.jsx)("button", {
				className: i("absolute right-2 bottom-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-border bg-background/90 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-background", "opacity-0 group-hover:opacity-100"),
				onClick: w,
				title: f.downloadImage,
				type: "button",
				children: (0, import_jsx_runtime.jsx)(l, { size: 14 })
			})
		]
	}) : null;
};
var ke = 0;
var le = () => {
	ke += 1, ke === 1 && (document.body.style.overflow = "hidden");
};
var ce = () => {
	ke = Math.max(0, ke - 1), ke === 0 && (document.body.style.overflow = "");
};
var so = ({ url: e, isOpen: t, onClose: o, onConfirm: n }) => {
	let { CheckIcon: r, CopyIcon: s, ExternalLinkIcon: a, XIcon: l } = L(), i = y(), [d, c] = (0, import_react.useState)(false), p = D(), m = (0, import_react.useCallback)(async () => {
		try {
			await navigator.clipboard.writeText(e), c(!0), setTimeout(() => c(!1), 2e3);
		} catch (f) {}
	}, [e]), u = (0, import_react.useCallback)(() => {
		n(), o();
	}, [n, o]);
	return (0, import_react.useEffect)(() => {
		if (t) {
			le();
			let f = (h) => {
				h.key === "Escape" && o();
			};
			return document.addEventListener("keydown", f), () => {
				document.removeEventListener("keydown", f), ce();
			};
		}
	}, [t, o]), t ? (0, import_jsx_runtime.jsx)("div", {
		className: i("fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm"),
		"data-streamdown": "link-safety-modal",
		onClick: o,
		onKeyDown: (f) => {
			f.key === "Escape" && o();
		},
		role: "button",
		tabIndex: 0,
		children: (0, import_jsx_runtime.jsxs)("div", {
			className: i("relative mx-4 flex w-full max-w-md flex-col gap-4 rounded-xl border bg-background p-6 shadow-lg"),
			onClick: (f) => f.stopPropagation(),
			onKeyDown: (f) => f.stopPropagation(),
			role: "presentation",
			children: [
				(0, import_jsx_runtime.jsx)("button", {
					className: i("absolute top-4 right-4 rounded-md p-1 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"),
					onClick: o,
					title: p.close,
					type: "button",
					children: (0, import_jsx_runtime.jsx)(l, { size: 16 })
				}),
				(0, import_jsx_runtime.jsxs)("div", {
					className: i("flex flex-col gap-2"),
					children: [(0, import_jsx_runtime.jsxs)("div", {
						className: i("flex items-center gap-2 font-semibold text-lg"),
						children: [(0, import_jsx_runtime.jsx)(a, { size: 20 }), (0, import_jsx_runtime.jsx)("span", { children: p.openExternalLink })]
					}), (0, import_jsx_runtime.jsx)("p", {
						className: i("text-muted-foreground text-sm"),
						children: p.externalLinkWarning
					})]
				}),
				(0, import_jsx_runtime.jsx)("div", {
					className: i("break-all rounded-md bg-muted p-3 font-mono text-sm", e.length > 100 && "max-h-32 overflow-y-auto"),
					children: e
				}),
				(0, import_jsx_runtime.jsxs)("div", {
					className: i("flex gap-2"),
					children: [(0, import_jsx_runtime.jsx)("button", {
						className: i("flex flex-1 items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 font-medium text-sm transition-all hover:bg-muted"),
						onClick: m,
						type: "button",
						children: d ? (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsx)(r, { size: 14 }), (0, import_jsx_runtime.jsx)("span", { children: p.copied })] }) : (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsx)(s, { size: 14 }), (0, import_jsx_runtime.jsx)("span", { children: p.copyLink })] })
					}), (0, import_jsx_runtime.jsxs)("button", {
						className: i("flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-all hover:bg-primary/90"),
						onClick: u,
						type: "button",
						children: [(0, import_jsx_runtime.jsx)(a, { size: 14 }), (0, import_jsx_runtime.jsx)("span", { children: p.openLink })]
					})]
				})
			]
		})
	}) : null;
};
var Ve = (0, import_react.createContext)(null);
var ct = () => (0, import_react.useContext)(Ve);
var Li = () => {
	var t;
	let e = ct();
	return (t = e == null ? void 0 : e.code) != null ? t : null;
};
var de = () => {
	var t;
	let e = ct();
	return (t = e == null ? void 0 : e.mermaid) != null ? t : null;
};
var ao = (e) => {
	var o;
	let t = ct();
	return t != null && t.renderers && e && (o = t.renderers.find((n) => Array.isArray(n.language) ? n.language.includes(e) : n.language === e)) != null ? o : null;
};
var io = (e, t) => {
	var n;
	let o = (n = void 0) != null ? n : 5;
	return new Promise((r, s) => {
		let a = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(e))), l = new Image();
		l.crossOrigin = "anonymous", l.onload = () => {
			let i = document.createElement("canvas"), d = l.width * o, c = l.height * o;
			i.width = d, i.height = c;
			let p = i.getContext("2d");
			if (!p) {
				s(/* @__PURE__ */ new Error("Failed to create 2D canvas context for PNG export"));
				return;
			}
			p.drawImage(l, 0, 0, d, c), i.toBlob((m) => {
				if (!m) {
					s(/* @__PURE__ */ new Error("Failed to create PNG blob"));
					return;
				}
				r(m);
			}, "image/png");
		}, l.onerror = () => s(/* @__PURE__ */ new Error("Failed to load SVG image")), l.src = a;
	});
};
var co = ({ chart: e, children: t, className: o, onDownload: n, config: r, onError: s }) => {
	let a = y(), [l, i] = (0, import_react.useState)(false), d = (0, import_react.useRef)(null), { isAnimating: c } = (0, import_react.useContext)(R$1), p = L(), m = de(), u = D(), f = async (h) => {
		try {
			if (h === "mmd") {
				W("diagram.mmd", e, "text/plain"), i(!1), n?.(h);
				return;
			}
			if (!m) {
				s?.(/* @__PURE__ */ new Error("Mermaid plugin not available"));
				return;
			}
			let b = m.getMermaid(r), g = e.split("").reduce((w, P) => (w << 5) - w + P.charCodeAt(0) | 0, 0), T = `mermaid-${Math.abs(g)}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, { svg: v } = await b.render(T, e);
			if (!v) {
				s?.(/* @__PURE__ */ new Error("SVG not found. Please wait for the diagram to render."));
				return;
			}
			if (h === "svg") {
				W("diagram.svg", v, "image/svg+xml"), i(!1), n?.(h);
				return;
			}
			if (h === "png") {
				W("diagram.png", await io(v), "image/png"), n?.(h), i(!1);
				return;
			}
		} catch (b) {
			s?.(b);
		}
	};
	return (0, import_react.useEffect)(() => {
		let h = (b) => {
			let g = b.composedPath();
			d.current && !g.includes(d.current) && i(false);
		};
		return document.addEventListener("mousedown", h), () => {
			document.removeEventListener("mousedown", h);
		};
	}, []), (0, import_jsx_runtime.jsxs)("div", {
		className: a("relative"),
		ref: d,
		children: [(0, import_jsx_runtime.jsx)("button", {
			className: a("cursor-pointer p-1 text-muted-foreground transition-all hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50", o),
			disabled: c,
			onClick: () => i(!l),
			title: u.downloadDiagram,
			type: "button",
			children: t != null ? t : (0, import_jsx_runtime.jsx)(p.DownloadIcon, { size: 14 })
		}), l ? (0, import_jsx_runtime.jsxs)("div", {
			className: a("absolute top-full right-0 z-10 mt-1 min-w-[120px] overflow-hidden rounded-md border border-border bg-background shadow-lg"),
			children: [
				(0, import_jsx_runtime.jsx)("button", {
					className: a("w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40"),
					onClick: () => f("svg"),
					title: u.downloadDiagramAsSvg,
					type: "button",
					children: u.mermaidFormatSvg
				}),
				(0, import_jsx_runtime.jsx)("button", {
					className: a("w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40"),
					onClick: () => f("png"),
					title: u.downloadDiagramAsPng,
					type: "button",
					children: u.mermaidFormatPng
				}),
				(0, import_jsx_runtime.jsx)("button", {
					className: a("w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40"),
					onClick: () => f("mmd"),
					title: u.downloadDiagramAsMmd,
					type: "button",
					children: u.mermaidFormatMmd
				})
			]
		}) : null]
	});
};
var fo = ({ chart: e, config: t, onFullscreen: o, onExit: n, className: r, ...s }) => {
	let { Maximize2Icon: a, XIcon: l } = L(), i = y(), [d, c] = (0, import_react.useState)(false), { isAnimating: p, controls: m } = (0, import_react.useContext)(R$1), u = D(), f = (() => {
		if (typeof m == "boolean") return m;
		let b = m.mermaid;
		return b === false ? false : b === true || b === void 0 ? true : b.panZoom !== false;
	})(), h = () => {
		c(!d);
	};
	return (0, import_react.useEffect)(() => {
		if (d) {
			le();
			let b = (g) => {
				g.key === "Escape" && c(false);
			};
			return document.addEventListener("keydown", b), () => {
				document.removeEventListener("keydown", b), ce();
			};
		}
	}, [d]), (0, import_react.useEffect)(() => {
		d ? o?.() : n && n();
	}, [
		d,
		o,
		n
	]), (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsx)("button", {
		className: i("cursor-pointer p-1 text-muted-foreground transition-all hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50", r),
		disabled: p,
		onClick: h,
		title: u.viewFullscreen,
		type: "button",
		...s,
		children: (0, import_jsx_runtime.jsx)(a, { size: 14 })
	}), d ? (0, import_react_dom.createPortal)((0, import_jsx_runtime.jsxs)("div", {
		className: i("fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"),
		onClick: h,
		onKeyDown: (b) => {
			b.key === "Escape" && h();
		},
		role: "button",
		tabIndex: 0,
		children: [(0, import_jsx_runtime.jsx)("button", {
			className: i("absolute top-4 right-4 z-10 rounded-md p-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"),
			onClick: h,
			title: u.exitFullscreen,
			type: "button",
			children: (0, import_jsx_runtime.jsx)(l, { size: 20 })
		}), (0, import_jsx_runtime.jsx)("div", {
			className: i("flex size-full items-center justify-center p-4"),
			onClick: (b) => b.stopPropagation(),
			onKeyDown: (b) => b.stopPropagation(),
			role: "presentation",
			children: (0, import_jsx_runtime.jsx)(po, {
				chart: e,
				className: i("size-full [&_svg]:h-auto [&_svg]:w-auto"),
				config: t,
				fullscreen: true,
				showControls: f
			})
		})]
	}), document.body) : null] });
};
var ue = (e) => {
	var s, a;
	let t = [], o = [], n = e.querySelectorAll("thead th");
	for (let l of n) t.push(((s = l.textContent) == null ? void 0 : s.trim()) || "");
	let r = e.querySelectorAll("tbody tr");
	for (let l of r) {
		let i = [], d = l.querySelectorAll("td");
		for (let c of d) i.push(((a = c.textContent) == null ? void 0 : a.trim()) || "");
		o.push(i);
	}
	return {
		headers: t,
		rows: o
	};
};
var ne = (e) => {
	let { headers: t, rows: o } = e, n = (l) => {
		let i = false, d = false;
		for (let c of l) {
			if (c === "\"") {
				i = true, d = true;
				break;
			}
			(c === "," || c === `
`) && (i = true);
		}
		return i ? d ? `"${l.replace(/"/g, "\"\"")}"` : `"${l}"` : l;
	}, r = t.length > 0 ? o.length + 1 : o.length, s = new Array(r), a = 0;
	t.length > 0 && (s[a] = t.map(n).join(","), a += 1);
	for (let l of o) s[a] = l.map(n).join(","), a += 1;
	return s.join(`
`);
};
var dt = (e) => {
	let { headers: t, rows: o } = e, n = (l) => {
		let i = false;
		for (let c of l) if (c === "	" || c === `
` || c === "\r") {
			i = true;
			break;
		}
		if (!i) return l;
		let d = [];
		for (let c of l) c === "	" ? d.push("\\t") : c === `
` ? d.push("\\n") : c === "\r" ? d.push("\\r") : d.push(c);
		return d.join("");
	}, r = t.length > 0 ? o.length + 1 : o.length, s = new Array(r), a = 0;
	t.length > 0 && (s[a] = t.map(n).join("	"), a += 1);
	for (let l of o) s[a] = l.map(n).join("	"), a += 1;
	return s.join(`
`);
};
var je = (e) => {
	let t = false;
	for (let n of e) if (n === "\\" || n === "|") {
		t = true;
		break;
	}
	if (!t) return e;
	let o = [];
	for (let n of e) n === "\\" ? o.push("\\\\") : n === "|" ? o.push("\\|") : o.push(n);
	return o.join("");
};
var re = (e) => {
	let { headers: t, rows: o } = e;
	if (t.length === 0) return "";
	let n = new Array(o.length + 2), r = 0, s = t.map((l) => je(l));
	n[r] = `| ${s.join(" | ")} |`, r += 1;
	let a = new Array(t.length);
	for (let l = 0; l < t.length; l += 1) a[l] = "---";
	n[r] = `| ${a.join(" | ")} |`, r += 1;
	for (let l of o) if (l.length < t.length) {
		let i = new Array(t.length);
		for (let d = 0; d < t.length; d += 1) i[d] = d < l.length ? je(l[d]) : "";
		n[r] = `| ${i.join(" | ")} |`, r += 1;
	} else {
		let i = l.map((d) => je(d));
		n[r] = `| ${i.join(" | ")} |`, r += 1;
	}
	return n.join(`
`);
};
var Te = ({ children: e, className: t, onCopy: o, onError: n, timeout: r = 2e3 }) => {
	let s = y(), [a, l] = (0, import_react.useState)(false), [i, d] = (0, import_react.useState)(false), c = (0, import_react.useRef)(null), p = (0, import_react.useRef)(0), { isAnimating: m } = (0, import_react.useContext)(R$1), u = D(), f = async (g) => {
		var T, v;
		if (typeof window == "undefined" || !((T = navigator == null ? void 0 : navigator.clipboard) != null && T.write)) {
			n?.(/* @__PURE__ */ new Error("Clipboard API not available"));
			return;
		}
		try {
			let w = (v = c.current) == null ? void 0 : v.closest("[data-streamdown=\"table-wrapper\"]"), P = w == null ? void 0 : w.querySelector("table");
			if (!P) {
				n?.(/* @__PURE__ */ new Error("Table not found"));
				return;
			}
			let M = ue(P), F = ({
				csv: ne,
				tsv: dt,
				md: re
			}[g] || re)(M), j = new ClipboardItem({
				"text/plain": new Blob([F], { type: "text/plain" }),
				"text/html": new Blob([P.outerHTML], { type: "text/html" })
			});
			await navigator.clipboard.write([j]), d(!0), l(!1), o?.(g), p.current = window.setTimeout(() => d(!1), r);
		} catch (w) {
			n?.(w);
		}
	};
	(0, import_react.useEffect)(() => {
		let g = (T) => {
			let v = T.composedPath();
			c.current && !v.includes(c.current) && l(false);
		};
		return document.addEventListener("mousedown", g), () => {
			document.removeEventListener("mousedown", g), window.clearTimeout(p.current);
		};
	}, []);
	let h = L(), b = i ? h.CheckIcon : h.CopyIcon;
	return (0, import_jsx_runtime.jsxs)("div", {
		className: s("relative"),
		ref: c,
		children: [(0, import_jsx_runtime.jsx)("button", {
			className: s("cursor-pointer p-1 text-muted-foreground transition-all hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50", t),
			disabled: m,
			onClick: () => l(!a),
			title: u.copyTable,
			type: "button",
			children: e != null ? e : (0, import_jsx_runtime.jsx)(b, {
				height: 14,
				width: 14
			})
		}), a ? (0, import_jsx_runtime.jsxs)("div", {
			className: s("absolute top-full right-0 z-20 mt-1 min-w-[120px] overflow-hidden rounded-md border border-border bg-background shadow-lg"),
			children: [
				(0, import_jsx_runtime.jsx)("button", {
					className: s("w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40"),
					onClick: () => f("md"),
					title: u.copyTableAsMarkdown,
					type: "button",
					children: u.tableFormatMarkdown
				}),
				(0, import_jsx_runtime.jsx)("button", {
					className: s("w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40"),
					onClick: () => f("csv"),
					title: u.copyTableAsCsv,
					type: "button",
					children: u.tableFormatCsv
				}),
				(0, import_jsx_runtime.jsx)("button", {
					className: s("w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40"),
					onClick: () => f("tsv"),
					title: u.copyTableAsTsv,
					type: "button",
					children: u.tableFormatTsv
				})
			]
		}) : null]
	});
};
var Pe = ({ children: e, className: t, onDownload: o, onError: n }) => {
	let r = y(), [s, a] = (0, import_react.useState)(false), l = (0, import_react.useRef)(null), { isAnimating: i } = (0, import_react.useContext)(R$1), d = D(), c = L(), p = (m) => {
		var u;
		try {
			let f = (u = l.current) == null ? void 0 : u.closest("[data-streamdown=\"table-wrapper\"]"), h = f == null ? void 0 : f.querySelector("table");
			if (!h) {
				n?.(/* @__PURE__ */ new Error("Table not found"));
				return;
			}
			let b = ue(h), g = m === "csv" ? ne(b) : re(b);
			W(`table.${m === "csv" ? "csv" : "md"}`, g, m === "csv" ? "text/csv" : "text/markdown"), a(!1), o?.(m);
		} catch (f) {
			n?.(f);
		}
	};
	return (0, import_react.useEffect)(() => {
		let m = (u) => {
			let f = u.composedPath();
			l.current && !f.includes(l.current) && a(false);
		};
		return document.addEventListener("mousedown", m), () => {
			document.removeEventListener("mousedown", m);
		};
	}, []), (0, import_jsx_runtime.jsxs)("div", {
		className: r("relative"),
		ref: l,
		children: [(0, import_jsx_runtime.jsx)("button", {
			className: r("cursor-pointer p-1 text-muted-foreground transition-all hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50", t),
			disabled: i,
			onClick: () => a(!s),
			title: d.downloadTable,
			type: "button",
			children: e != null ? e : (0, import_jsx_runtime.jsx)(c.DownloadIcon, { size: 14 })
		}), s ? (0, import_jsx_runtime.jsxs)("div", {
			className: r("absolute top-full right-0 z-20 mt-1 min-w-[120px] overflow-hidden rounded-md border border-border bg-background shadow-lg"),
			children: [(0, import_jsx_runtime.jsx)("button", {
				className: r("w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40"),
				onClick: () => p("csv"),
				title: d.downloadTableAsCsv,
				type: "button",
				children: d.tableFormatCsv
			}), (0, import_jsx_runtime.jsx)("button", {
				className: r("w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40"),
				onClick: () => p("markdown"),
				title: d.downloadTableAsMarkdown,
				type: "button",
				children: d.tableFormatMarkdown
			})]
		}) : null]
	});
};
var Co = ({ children: e, className: t, showCopy: o = true, showDownload: n = true }) => {
	let { Maximize2Icon: r, XIcon: s } = L(), a = y(), [l, i] = (0, import_react.useState)(false), { isAnimating: d } = (0, import_react.useContext)(R$1), c = D(), p = () => {
		i(true);
	}, m = () => {
		i(false);
	};
	return (0, import_react.useEffect)(() => {
		if (l) {
			le();
			let u = (f) => {
				f.key === "Escape" && i(false);
			};
			return document.addEventListener("keydown", u), () => {
				document.removeEventListener("keydown", u), ce();
			};
		}
	}, [l]), (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsx)("button", {
		className: a("cursor-pointer p-1 text-muted-foreground transition-all hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50", t),
		disabled: d,
		onClick: p,
		title: c.viewFullscreen,
		type: "button",
		children: (0, import_jsx_runtime.jsx)(r, { size: 14 })
	}), l ? (0, import_react_dom.createPortal)((0, import_jsx_runtime.jsx)("div", {
		"aria-label": c.viewFullscreen,
		"aria-modal": "true",
		className: a("fixed inset-0 z-50 flex flex-col bg-background"),
		"data-streamdown": "table-fullscreen",
		onClick: m,
		onKeyDown: (u) => {
			u.key === "Escape" && m();
		},
		role: "dialog",
		children: (0, import_jsx_runtime.jsxs)("div", {
			className: a("flex h-full flex-col"),
			onClick: (u) => u.stopPropagation(),
			onKeyDown: (u) => u.stopPropagation(),
			role: "presentation",
			children: [(0, import_jsx_runtime.jsxs)("div", {
				className: a("flex items-center justify-end gap-1 p-4"),
				children: [
					o ? (0, import_jsx_runtime.jsx)(Te, {}) : null,
					n ? (0, import_jsx_runtime.jsx)(Pe, {}) : null,
					(0, import_jsx_runtime.jsx)("button", {
						className: a("rounded-md p-1 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"),
						onClick: m,
						title: c.exitFullscreen,
						type: "button",
						children: (0, import_jsx_runtime.jsx)(s, { size: 20 })
					})
				]
			}), (0, import_jsx_runtime.jsx)("div", {
				className: a("flex-1 overflow-auto p-4 pt-0 [&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10"),
				children: (0, import_jsx_runtime.jsx)("table", {
					className: a("w-full border-collapse border border-border"),
					"data-streamdown": "table",
					children: e
				})
			})]
		})
	}), document.body) : null] });
};
var vo = ({ children: e, className: t, showControls: o, showCopy: n = true, showDownload: r = true, showFullscreen: s = true, ...a }) => {
	let l = y(), i = o && n, d = o && r, c = o && s, p = i || d || c;
	return (0, import_jsx_runtime.jsxs)("div", {
		className: l("my-4 flex flex-col gap-2 rounded-lg border border-border bg-sidebar p-2"),
		"data-streamdown": "table-wrapper",
		children: [p ? (0, import_jsx_runtime.jsxs)("div", {
			className: l("flex items-center justify-end gap-1"),
			children: [
				i ? (0, import_jsx_runtime.jsx)(Te, {}) : null,
				d ? (0, import_jsx_runtime.jsx)(Pe, {}) : null,
				c ? (0, import_jsx_runtime.jsx)(Co, {
					showCopy: i,
					showDownload: d,
					children: e
				}) : null
			]
		}) : null, (0, import_jsx_runtime.jsx)("div", {
			className: l("border-collapse overflow-x-auto overflow-y-auto rounded-md border border-border bg-background"),
			children: (0, import_jsx_runtime.jsx)("table", {
				className: l("w-full divide-y divide-border", t),
				"data-streamdown": "table",
				...a,
				children: e
			})
		})]
	});
};
var es = /startLine=(\d+)/;
var ts = /\bnoLineNumbers\b/;
var os = (0, import_react.lazy)(() => Promise.resolve().then(() => mermaid_GHXKKRXX_exports).then((e) => ({ default: e.Mermaid })));
var ns = /language-([^\s]+)/;
function qe(e, t) {
	if (!(e != null && e.position || t != null && t.position)) return true;
	if (!(e != null && e.position && t != null && t.position)) return false;
	let o = e.position.start, n = t.position.start, r = e.position.end, s = t.position.end;
	return (o == null ? void 0 : o.line) === (n == null ? void 0 : n.line) && (o == null ? void 0 : o.column) === (n == null ? void 0 : n.column) && (r == null ? void 0 : r.line) === (s == null ? void 0 : s.line) && (r == null ? void 0 : r.column) === (s == null ? void 0 : s.column);
}
function E(e, t) {
	return e.className === t.className && qe(e.node, t.node);
}
var ft = (e, t) => typeof e == "boolean" ? e : e[t] !== false;
var pt = (e, t) => {
	if (typeof e == "boolean") return e;
	let o = e.table;
	return o === false ? false : o === true || o === void 0 ? true : o[t] !== false;
};
var To = (e, t) => {
	if (typeof e == "boolean") return e;
	let o = e.code;
	return o === false ? false : o === true || o === void 0 ? true : o[t] !== false;
};
var Fe = (e, t) => {
	if (typeof e == "boolean") return e;
	let o = e.mermaid;
	return o === false ? false : o === true || o === void 0 ? true : o[t] !== false;
};
var bt = (0, import_react.memo)(({ children: e, className: t, node: o, ...n }) => {
	let r = y();
	return (0, import_jsx_runtime.jsx)("ol", {
		className: r("list-inside list-decimal whitespace-normal [li_&]:pl-6", t),
		"data-streamdown": "ordered-list",
		...n,
		children: e
	});
}, (e, t) => E(e, t));
bt.displayName = "MarkdownOl";
var Po = (0, import_react.memo)(({ children: e, className: t, node: o, ...n }) => {
	let r = y();
	return (0, import_jsx_runtime.jsx)("li", {
		className: r("py-1 [&>p]:inline", t),
		"data-streamdown": "list-item",
		...n,
		children: e
	});
}, (e, t) => e.className === t.className && qe(e.node, t.node));
Po.displayName = "MarkdownLi";
var Mo = (0, import_react.memo)(({ children: e, className: t, node: o, ...n }) => {
	let r = y();
	return (0, import_jsx_runtime.jsx)("ul", {
		className: r("list-inside list-disc whitespace-normal [li_&]:pl-6", t),
		"data-streamdown": "unordered-list",
		...n,
		children: e
	});
}, (e, t) => E(e, t));
Mo.displayName = "MarkdownUl";
var Io = (0, import_react.memo)(({ className: e, node: t, ...o }) => {
	let n = y();
	return (0, import_jsx_runtime.jsx)("hr", {
		className: n("my-6 border-border", e),
		"data-streamdown": "horizontal-rule",
		...o
	});
}, (e, t) => E(e, t));
Io.displayName = "MarkdownHr";
var No = (0, import_react.memo)(({ children: e, className: t, node: o, ...n }) => {
	let r = y();
	return (0, import_jsx_runtime.jsx)("span", {
		className: r("font-semibold", t),
		"data-streamdown": "strong",
		...n,
		children: e
	});
}, (e, t) => E(e, t));
No.displayName = "MarkdownStrong";
var rs = ({ children: e, className: t, href: o, node: n, ...r }) => {
	let s = y(), { linkSafety: a } = (0, import_react.useContext)(R$1), [l, i] = (0, import_react.useState)(false), d = o === "streamdown:incomplete-link", c = (0, import_react.useCallback)(async (f) => {
		if (!(!(a != null && a.enabled && o) || d)) {
			if (f.preventDefault(), a.onLinkCheck && await a.onLinkCheck(o)) {
				window.open(o, "_blank", "noreferrer");
				return;
			}
			i(true);
		}
	}, [
		a,
		o,
		d
	]), p = (0, import_react.useCallback)(() => {
		o && window.open(o, "_blank", "noreferrer");
	}, [o]), m = (0, import_react.useCallback)(() => {
		i(false);
	}, []), u = {
		url: o != null ? o : "",
		isOpen: l,
		onClose: m,
		onConfirm: p
	};
	return a != null && a.enabled && o ? (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsx)("button", {
		className: s("wrap-anywhere appearance-none text-left font-medium text-primary underline", t),
		"data-incomplete": d,
		"data-streamdown": "link",
		onClick: c,
		type: "button",
		children: e
	}), a.renderModal ? a.renderModal(u) : (0, import_jsx_runtime.jsx)(so, { ...u })] }) : (0, import_jsx_runtime.jsx)("a", {
		className: s("wrap-anywhere font-medium text-primary underline", t),
		"data-incomplete": d,
		"data-streamdown": "link",
		href: o,
		rel: "noreferrer",
		target: "_blank",
		...r,
		children: e
	});
};
var Lo = (0, import_react.memo)(rs, (e, t) => E(e, t) && e.href === t.href);
Lo.displayName = "MarkdownA";
var Ro = (0, import_react.memo)(({ children: e, className: t, node: o, ...n }) => {
	let r = y();
	return (0, import_jsx_runtime.jsx)("h1", {
		className: r("mt-6 mb-2 font-semibold text-3xl", t),
		"data-streamdown": "heading-1",
		...n,
		children: e
	});
}, (e, t) => E(e, t));
Ro.displayName = "MarkdownH1";
var So = (0, import_react.memo)(({ children: e, className: t, node: o, ...n }) => {
	let r = y();
	return (0, import_jsx_runtime.jsx)("h2", {
		className: r("mt-6 mb-2 font-semibold text-2xl", t),
		"data-streamdown": "heading-2",
		...n,
		children: e
	});
}, (e, t) => E(e, t));
So.displayName = "MarkdownH2";
var Eo = (0, import_react.memo)(({ children: e, className: t, node: o, ...n }) => {
	let r = y();
	return (0, import_jsx_runtime.jsx)("h3", {
		className: r("mt-6 mb-2 font-semibold text-xl", t),
		"data-streamdown": "heading-3",
		...n,
		children: e
	});
}, (e, t) => E(e, t));
Eo.displayName = "MarkdownH3";
var Ho = (0, import_react.memo)(({ children: e, className: t, node: o, ...n }) => {
	let r = y();
	return (0, import_jsx_runtime.jsx)("h4", {
		className: r("mt-6 mb-2 font-semibold text-lg", t),
		"data-streamdown": "heading-4",
		...n,
		children: e
	});
}, (e, t) => E(e, t));
Ho.displayName = "MarkdownH4";
var Do = (0, import_react.memo)(({ children: e, className: t, node: o, ...n }) => {
	let r = y();
	return (0, import_jsx_runtime.jsx)("h5", {
		className: r("mt-6 mb-2 font-semibold text-base", t),
		"data-streamdown": "heading-5",
		...n,
		children: e
	});
}, (e, t) => E(e, t));
Do.displayName = "MarkdownH5";
var Bo = (0, import_react.memo)(({ children: e, className: t, node: o, ...n }) => {
	let r = y();
	return (0, import_jsx_runtime.jsx)("h6", {
		className: r("mt-6 mb-2 font-semibold text-sm", t),
		"data-streamdown": "heading-6",
		...n,
		children: e
	});
}, (e, t) => E(e, t));
Bo.displayName = "MarkdownH6";
var Ao = (0, import_react.memo)(({ children: e, className: t, node: o, ...n }) => {
	let { controls: r } = (0, import_react.useContext)(R$1), s = ft(r, "table"), a = pt(r, "copy"), l = pt(r, "download"), i = pt(r, "fullscreen");
	return (0, import_jsx_runtime.jsx)(vo, {
		className: t,
		showControls: s,
		showCopy: a,
		showDownload: l,
		showFullscreen: i,
		...n,
		children: e
	});
}, (e, t) => E(e, t));
Ao.displayName = "MarkdownTable";
var Oo = (0, import_react.memo)(({ children: e, className: t, node: o, ...n }) => {
	let r = y();
	return (0, import_jsx_runtime.jsx)("thead", {
		className: r("bg-muted/80", t),
		"data-streamdown": "table-header",
		...n,
		children: e
	});
}, (e, t) => E(e, t));
Oo.displayName = "MarkdownThead";
var Vo = (0, import_react.memo)(({ children: e, className: t, node: o, ...n }) => {
	let r = y();
	return (0, import_jsx_runtime.jsx)("tbody", {
		className: r("divide-y divide-border", t),
		"data-streamdown": "table-body",
		...n,
		children: e
	});
}, (e, t) => E(e, t));
Vo.displayName = "MarkdownTbody";
var jo = (0, import_react.memo)(({ children: e, className: t, node: o, ...n }) => {
	let r = y();
	return (0, import_jsx_runtime.jsx)("tr", {
		className: r("border-border", t),
		"data-streamdown": "table-row",
		...n,
		children: e
	});
}, (e, t) => E(e, t));
jo.displayName = "MarkdownTr";
var Fo = (0, import_react.memo)(({ children: e, className: t, node: o, ...n }) => {
	let r = y();
	return (0, import_jsx_runtime.jsx)("th", {
		className: r("whitespace-nowrap px-4 py-2 text-left font-semibold text-sm", t),
		"data-streamdown": "table-header-cell",
		...n,
		children: e
	});
}, (e, t) => E(e, t));
Fo.displayName = "MarkdownTh";
var zo = (0, import_react.memo)(({ children: e, className: t, node: o, ...n }) => {
	let r = y();
	return (0, import_jsx_runtime.jsx)("td", {
		className: r("px-4 py-2 text-sm", t),
		"data-streamdown": "table-cell",
		...n,
		children: e
	});
}, (e, t) => E(e, t));
zo.displayName = "MarkdownTd";
var _o = (0, import_react.memo)(({ children: e, className: t, node: o, ...n }) => {
	let r = y();
	return (0, import_jsx_runtime.jsx)("blockquote", {
		className: r("my-4 border-muted-foreground/30 border-l-4 pl-4 text-muted-foreground italic", t),
		"data-streamdown": "blockquote",
		...n,
		children: e
	});
}, (e, t) => E(e, t));
_o.displayName = "MarkdownBlockquote";
var qo = (0, import_react.memo)(({ children: e, className: t, node: o, ...n }) => {
	let r = y();
	return (0, import_jsx_runtime.jsx)("sup", {
		className: r("text-sm", t),
		"data-streamdown": "superscript",
		...n,
		children: e
	});
}, (e, t) => E(e, t));
qo.displayName = "MarkdownSup";
var $o = (0, import_react.memo)(({ children: e, className: t, node: o, ...n }) => {
	let r = y();
	return (0, import_jsx_runtime.jsx)("sub", {
		className: r("text-sm", t),
		"data-streamdown": "subscript",
		...n,
		children: e
	});
}, (e, t) => E(e, t));
$o.displayName = "MarkdownSub";
var Wo = (0, import_react.memo)(({ children: e, className: t, node: o, ...n }) => {
	if ("data-footnotes" in n) {
		let s = (i) => {
			var m, u;
			if (!(0, import_react.isValidElement)(i)) return false;
			let d = Array.isArray(i.props.children) ? i.props.children : [i.props.children], c = false, p = false;
			for (let f of d) if (f) {
				if (typeof f == "string") f.trim() !== "" && (c = true);
				else if ((0, import_react.isValidElement)(f)) if (((m = f.props) == null ? void 0 : m["data-footnote-backref"]) !== void 0) p = true;
				else {
					let h = Array.isArray(f.props.children) ? f.props.children : [f.props.children];
					for (let b of h) {
						if (typeof b == "string" && b.trim() !== "") {
							c = true;
							break;
						}
						if ((0, import_react.isValidElement)(b) && ((u = b.props) == null ? void 0 : u["data-footnote-backref"]) === void 0) {
							c = true;
							break;
						}
					}
				}
			}
			return p && !c;
		}, a = Array.isArray(e) ? e.map((i) => {
			if (!(0, import_react.isValidElement)(i)) return i;
			if (i.type === bt) {
				let c = (Array.isArray(i.props.children) ? i.props.children : [i.props.children]).filter((p) => !s(p));
				return c.length === 0 ? null : {
					...i,
					props: {
						...i.props,
						children: c
					}
				};
			}
			return i;
		}) : e;
		return (Array.isArray(a) ? a.some((i) => i !== null) : a !== null) ? (0, import_jsx_runtime.jsx)("section", {
			className: t,
			...n,
			children: a
		}) : null;
	}
	return (0, import_jsx_runtime.jsx)("section", {
		className: t,
		...n,
		children: e
	});
}, (e, t) => E(e, t));
Wo.displayName = "MarkdownSection";
var ss = ({ node: e, className: t, children: o, ...n }) => {
	var S, F;
	let r = y(), s = !("data-block" in n), { mermaid: a, controls: l, lineNumbers: i } = (0, import_react.useContext)(R$1), d = de(), c = tt(), p = t == null ? void 0 : t.match(ns), m = (S = p == null ? void 0 : p.at(1)) != null ? S : "", u = ao(m);
	if (s) return (0, import_jsx_runtime.jsx)("code", {
		className: r("rounded bg-muted px-1.5 py-0.5 font-mono text-sm", t),
		"data-streamdown": "inline-code",
		...n,
		children: o
	});
	let f = (F = e == null ? void 0 : e.properties) == null ? void 0 : F.metastring, h = f == null ? void 0 : f.match(es), b = h ? Number.parseInt(h[1], 10) : void 0, g = b !== void 0 && b >= 1 ? b : void 0, v = !(f ? ts.test(f) : false) && i !== false, w = "";
	if ((0, import_react.isValidElement)(o) && o.props && typeof o.props == "object" && "children" in o.props && typeof o.props.children == "string" ? w = o.props.children : typeof o == "string" && (w = o), u) {
		let j = u.component;
		return (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: (0, import_jsx_runtime.jsx)(Oe, {}),
			children: (0, import_jsx_runtime.jsx)(j, {
				code: w,
				isIncomplete: c,
				language: m,
				meta: f
			})
		});
	}
	if (m === "mermaid" && d) {
		let j = ft(l, "mermaid"), z = Fe(l, "download"), B = Fe(l, "copy"), _ = Fe(l, "fullscreen"), Q = Fe(l, "panZoom"), U = j && (z || B || _);
		return (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: (0, import_jsx_runtime.jsx)(Oe, {}),
			children: (0, import_jsx_runtime.jsxs)("div", {
				className: r("group relative my-4 flex w-full flex-col gap-2 rounded-xl border border-border bg-sidebar p-2", t),
				"data-streamdown": "mermaid-block",
				children: [
					(0, import_jsx_runtime.jsx)("div", {
						className: r("flex h-8 items-center text-muted-foreground text-xs"),
						children: (0, import_jsx_runtime.jsx)("span", {
							className: r("ml-1 font-mono lowercase"),
							children: "mermaid"
						})
					}),
					U ? (0, import_jsx_runtime.jsx)("div", {
						className: r("pointer-events-none sticky top-2 z-10 -mt-10 flex h-8 items-center justify-end"),
						children: (0, import_jsx_runtime.jsxs)("div", {
							className: r("pointer-events-auto flex shrink-0 items-center gap-2 rounded-md border border-sidebar bg-sidebar/80 px-1.5 py-1 supports-[backdrop-filter]:bg-sidebar/70 supports-[backdrop-filter]:backdrop-blur"),
							"data-streamdown": "mermaid-block-actions",
							children: [
								z ? (0, import_jsx_runtime.jsx)(co, {
									chart: w,
									config: a == null ? void 0 : a.config
								}) : null,
								B ? (0, import_jsx_runtime.jsx)(Ae, { code: w }) : null,
								_ ? (0, import_jsx_runtime.jsx)(fo, {
									chart: w,
									config: a == null ? void 0 : a.config
								}) : null
							]
						})
					}) : null,
					(0, import_jsx_runtime.jsx)("div", {
						className: r("rounded-md border border-border bg-background"),
						children: (0, import_jsx_runtime.jsx)(os, {
							chart: w,
							config: a == null ? void 0 : a.config,
							showControls: Q
						})
					})
				]
			})
		});
	}
	let P = ft(l, "code"), M = To(l, "download"), H = To(l, "copy");
	return (0, import_jsx_runtime.jsx)(st, {
		className: t,
		code: w,
		isIncomplete: c,
		language: m,
		lineNumbers: v,
		startLine: g,
		children: P ? (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [M ? (0, import_jsx_runtime.jsx)(it, {
			code: w,
			language: m
		}) : null, H ? (0, import_jsx_runtime.jsx)(Ae, {}) : null] }) : null
	});
};
var Zo = (0, import_react.memo)(ss, (e, t) => e.className === t.className && qe(e.node, t.node));
Zo.displayName = "MarkdownCode";
var Xo = (0, import_react.memo)(oo, (e, t) => e.className === t.className && qe(e.node, t.node));
Xo.displayName = "MarkdownImg";
var Jo = (0, import_react.memo)(({ children: e, node: t, ...o }) => {
	let r = (Array.isArray(e) ? e : [e]).filter((s) => s != null && s !== "");
	if (r.length === 1 && (0, import_react.isValidElement)(r[0])) {
		let s = r[0].props.node, a = s == null ? void 0 : s.tagName;
		if (a === "img") return (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: e });
		if (a === "code" && "data-block" in r[0].props) return (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: e });
	}
	return (0, import_jsx_runtime.jsx)("p", {
		...o,
		children: e
	});
}, (e, t) => E(e, t));
Jo.displayName = "MarkdownParagraph";
var Ko = {
	ol: bt,
	li: Po,
	ul: Mo,
	hr: Io,
	strong: No,
	a: Lo,
	h1: Ro,
	h2: So,
	h3: Eo,
	h4: Ho,
	h5: Do,
	h6: Bo,
	table: Ao,
	thead: Oo,
	tbody: Vo,
	tr: jo,
	th: Fo,
	td: zo,
	blockquote: _o,
	code: Zo,
	img: Xo,
	pre: ({ children: e }) => (0, import_react.isValidElement)(e) ? (0, import_react.cloneElement)(e, { "data-block": "true" }) : e,
	sup: qo,
	sub: $o,
	p: Jo,
	section: Wo
};
var as = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;
var is = /\p{L}/u;
function $e(e) {
	let t = e.replace(/^#{1,6}\s+/gm, "").replace(/(\*{1,3}|_{1,3})/g, "").replace(/`[^`]*`/g, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/^[\s>*\-+\d.]+/gm, "");
	for (let o of t) {
		if (as.test(o)) return "rtl";
		if (is.test(o)) return "ltr";
	}
	return "ltr";
}
var ls = /^[ \t]{0,3}(`{3,}|~{3,})/;
var cs = /^\|?[ \t]*:?-{1,}:?[ \t]*(\|[ \t]*:?-{1,}:?[ \t]*)*\|?$/;
var ht = (e) => {
	let t = e.split(`
`), o = null, n = 0;
	for (let r of t) {
		let s = ls.exec(r);
		if (o === null) {
			if (s) {
				let a = s[1];
				o = a[0], n = a.length;
			}
		} else if (s) {
			let a = s[1], l = a[0], i = a.length;
			l === o && i >= n && (o = null, n = 0);
		}
	}
	return o !== null;
};
var Uo = (e) => {
	let t = e.split(`
`);
	for (let o of t) {
		let n = o.trim();
		if (n.length > 0 && n.includes("|") && cs.test(n)) return true;
	}
	return false;
};
var Go = () => (e) => {
	visit(e, "html", (t, o, n) => {
		!n || typeof o != "number" || (n.children[o] = {
			type: "text",
			value: t.value
		});
	});
};
var Qo = [];
var en = { allowDangerousHtml: true };
var We = /* @__PURE__ */ new WeakMap();
var wt = class {
	constructor() {
		this.cache = /* @__PURE__ */ new Map();
		this.keyCache = /* @__PURE__ */ new WeakMap();
		this.maxSize = 100;
	}
	generateCacheKey(t) {
		let o = this.keyCache.get(t);
		if (o) return o;
		let n = t.rehypePlugins, r = t.remarkPlugins, s = t.remarkRehypeOptions;
		if (!(n || r || s)) {
			let p = "default";
			return this.keyCache.set(t, p), p;
		}
		let a = (p) => {
			if (!p || p.length === 0) return "";
			let m = "";
			for (let u = 0; u < p.length; u += 1) {
				let f = p[u];
				if (u > 0 && (m += ","), Array.isArray(f)) {
					let [h, b] = f;
					if (typeof h == "function") {
						let g = We.get(h);
						g || (g = h.name, We.set(h, g)), m += g;
					} else m += String(h);
					m += ":", m += JSON.stringify(b);
				} else if (typeof f == "function") {
					let h = We.get(f);
					h || (h = f.name, We.set(f, h)), m += h;
				} else m += String(f);
			}
			return m;
		}, l = a(n), c = `${a(r)}::${l}::${s ? JSON.stringify(s) : ""}`;
		return this.keyCache.set(t, c), c;
	}
	get(t) {
		let o = this.generateCacheKey(t), n = this.cache.get(o);
		return n && (this.cache.delete(o), this.cache.set(o, n)), n;
	}
	set(t, o) {
		let n = this.generateCacheKey(t);
		if (this.cache.size >= this.maxSize) {
			let r = this.cache.keys().next().value;
			r && this.cache.delete(r);
		}
		this.cache.set(n, o);
	}
	clear() {
		this.cache.clear();
	}
};
var tn = new wt();
var Ct = (e) => {
	let t = ws(e), o = e.children || "";
	return Ps(t.runSync(t.parse(o), o), e);
};
var ws = (e) => {
	let t = tn.get(e);
	if (t) return t;
	let o = ks(e);
	return tn.set(e, o), o;
};
var Cs = (e) => e.some((t) => Array.isArray(t) ? t[0] === rehypeRaw : t === rehypeRaw);
var ks = (e) => {
	let t = e.rehypePlugins || Qo, o = e.remarkPlugins || Qo, n = Cs(t) ? o : [...o, Go], r = e.remarkRehypeOptions ? {
		...en,
		...e.remarkRehypeOptions
	} : en;
	return unified().use(remarkParse).use(n).use(remarkRehype, r).use(t);
};
var on = (e) => e;
var vs = (e, t, o, n) => {
	o ? e.children.splice(t, 1) : e.children[t] = {
		type: "text",
		value: n
	};
};
var xs = (e, t) => {
	var o;
	for (let n in urlAttributes) if (Object.hasOwn(urlAttributes, n) && Object.hasOwn(e.properties, n)) {
		let r = e.properties[n], s = urlAttributes[n];
		(s === null || s.includes(e.tagName)) && (e.properties[n] = (o = t(String(r || ""), n, e)) != null ? o : void 0);
	}
};
var Ts = (e, t, o, n, r, s) => {
	let a = false;
	return n ? a = !n.includes(e.tagName) : r && (a = r.includes(e.tagName)), !a && s && typeof t == "number" && (a = !s(e, t, o)), a;
};
var Ps = (e, t) => {
	let { allowElement: o, allowedElements: n, disallowedElements: r, skipHtml: s, unwrapDisallowed: a, urlTransform: l } = t;
	if (o || n || r || s || l) {
		let d = l || on;
		visit(e, (c, p, m) => {
			if (c.type === "raw" && m && typeof p == "number") return vs(m, p, s, c.value), p;
			if (c.type === "element" && (xs(c, d), Ts(c, p, m, n, r, o) && m && typeof p == "number")) return a && c.children ? m.children.splice(p, 1, ...c.children) : m.children.splice(p, 1), p;
		});
	}
	return toJsxRuntime(e, {
		Fragment: import_jsx_runtime.Fragment,
		components: t.components,
		ignoreInvalidStyle: true,
		jsx: import_jsx_runtime.jsx,
		jsxs: import_jsx_runtime.jsxs,
		passKeys: true,
		passNode: true
	});
};
var Is = /\[\^[\w-]{1,200}\](?!:)/;
var Ns = /\[\^[\w-]{1,200}\]:/;
var Ls = /<(\w+)[\s>]/;
var Rs = /* @__PURE__ */ new Set([
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr"
]);
var nn = /* @__PURE__ */ new Map();
var rn = /* @__PURE__ */ new Map();
var Ss = (e) => {
	let t = e.toLowerCase(), o = nn.get(t);
	if (o) return o;
	let n = new RegExp(`<${t}(?=[\\s>/])[^>]*>`, "gi");
	return nn.set(t, n), n;
};
var Es = (e) => {
	let t = e.toLowerCase(), o = rn.get(t);
	if (o) return o;
	let n = new RegExp(`</${t}(?=[\\s>])[^>]*>`, "gi");
	return rn.set(t, n), n;
};
var sn = (e, t) => {
	if (Rs.has(t.toLowerCase())) return 0;
	let o = e.match(Ss(t));
	if (!o) return 0;
	let n = 0;
	for (let r of o) r.trimEnd().endsWith("/>") || (n += 1);
	return n;
};
var an = (e, t) => {
	let o = e.match(Es(t));
	return o ? o.length : 0;
};
var Hs = (e) => {
	let t = 0;
	for (let o = 0; o < e.length - 1; o += 1) e[o] === "$" && e[o + 1] === "$" && (t += 1, o += 1);
	return t;
};
var kt = (e) => {
	let t = Is.test(e), o = Ns.test(e);
	if (t || o) return [e];
	let n = x.lex(e, { gfm: true }), r = [], s = [], a = false;
	for (let l of n) {
		let i = l.raw, d = r.length;
		if (s.length > 0) {
			r[d - 1] += i;
			let c = s.at(-1), p = sn(i, c), m = an(i, c);
			for (let u = 0; u < p; u += 1) s.push(c);
			for (let u = 0; u < m; u += 1) s.length > 0 && s.at(-1) === c && s.pop();
			continue;
		}
		if (l.type === "html" && l.block) {
			let c = i.match(Ls);
			if (c) {
				let p = c[1];
				sn(i, p) > an(i, p) && s.push(p);
			}
		}
		if (d > 0 && !a) {
			let c = r[d - 1];
			if (Hs(c) % 2 === 1) {
				r[d - 1] = c + i;
				continue;
			}
		}
		r.push(i), l.type !== "space" && (a = l.type === "code");
	}
	return r;
};
var ln = (e, t) => {
	if (!t.length) return e;
	let o = e;
	for (let n of t) {
		let r = new RegExp(`(<${n}(?=[\\s>/])[^>]*>)([\\s\\S]*?)(</${n}\\s*>)`, "gi");
		o = o.replace(r, (s, a, l, i) => {
			if (!l.includes(`

`)) return a + l + i;
			let d = l.replace(/\n\n/g, `
<!---->
`);
			return `${a}${(d.startsWith(`
`) ? "" : `
`) + d + (d.endsWith(`
`) ? "" : `
`)}${i}

`;
		});
	}
	return o;
};
var Ds = /([\\`*_~[\]|])/g;
var Bs = (e) => e.replace(Ds, "\\$1");
var cn = (e, t) => {
	if (!t.length) return e;
	let o = e;
	for (let n of t) {
		let r = new RegExp(`(<${n}(?=[\\s>/])[^>]*>)([\\s\\S]*?)(</${n}\\s*>)`, "gi");
		o = o.replace(r, (s, a, l, i) => {
			return a + Bs(l).replace(/\n\n/g, "&#10;&#10;") + i;
		});
	}
	return o;
};
var dn = (e) => e.type === "text" ? e.value : "children" in e && Array.isArray(e.children) ? e.children.map(dn).join("") : "";
var mn = (e) => (t) => {
	if (!e || e.length === 0) return;
	let o = new Set(e.map((n) => n.toLowerCase()));
	visit(t, "element", (n) => {
		if (o.has(n.tagName.toLowerCase())) {
			let r = dn(n);
			n.children = r ? [{
				type: "text",
				value: r
			}] : [];
		}
	});
};
var un = () => (e) => {
	visit(e, "code", (t) => {
		var o, n;
		t.meta && (t.data = (o = t.data) != null ? o : {}, t.data.hProperties = {
			...(n = t.data.hProperties) != null ? n : {},
			metastring: t.meta
		});
	});
};
var Zs = /^[ \t]*<[\w!/?-]/;
var Xs = /(^|\n)[ \t]{4,}(?=<[\w!/?-])/g;
var Js = (e) => typeof e != "string" || e.length === 0 || !Zs.test(e) ? e : e.replace(Xs, "$1");
var bn;
var hn;
var yn;
var wn;
var Ze = {
	...defaultSchema,
	protocols: {
		...defaultSchema.protocols,
		href: [...(hn = (bn = defaultSchema.protocols) == null ? void 0 : bn.href) != null ? hn : [], "tel"]
	},
	attributes: {
		...defaultSchema.attributes,
		code: [...(wn = (yn = defaultSchema.attributes) == null ? void 0 : yn.code) != null ? wn : [], "metastring"]
	}
};
var xt = {
	raw: rehypeRaw,
	sanitize: [rehypeSanitize, Ze],
	harden: [harden, {
		allowedImagePrefixes: ["*"],
		allowedLinkPrefixes: ["*"],
		allowedProtocols: ["*"],
		defaultOrigin: void 0,
		allowDataImages: true
	}]
};
var Ks = {
	gfm: [remarkGfm, {}],
	codeMeta: un
};
var gn = Object.values(xt);
var Us = Object.values(Ks);
var Gs = {
	block: " ▋",
	circle: " ●"
};
var vn = ["github-light", "github-dark"];
var xn = { enabled: true };
var R$1 = (0, import_react.createContext)({
	shikiTheme: vn,
	controls: true,
	isAnimating: false,
	lineNumbers: true,
	mode: "streaming",
	mermaid: void 0,
	linkSafety: xn
});
var Tn = (0, import_react.memo)(({ content: e, shouldParseIncompleteMarkdown: t, shouldNormalizeHtmlIndentation: o, index: n, isIncomplete: r, dir: s, animatePlugin: a, ...l }) => {
	if (a) {
		let c = a.getLastRenderCharCount();
		a.setPrevContentLength(c);
	}
	let i = typeof e == "string" && o ? Js(e) : e, d = (0, import_jsx_runtime.jsx)(Ct, {
		...l,
		children: i
	});
	return (0, import_jsx_runtime.jsx)(et.Provider, {
		value: r,
		children: s ? (0, import_jsx_runtime.jsx)("div", {
			dir: s,
			style: { display: "contents" },
			children: d
		}) : d
	});
}, (e, t) => {
	if (e.content !== t.content || e.shouldNormalizeHtmlIndentation !== t.shouldNormalizeHtmlIndentation || e.index !== t.index || e.isIncomplete !== t.isIncomplete || e.dir !== t.dir) return false;
	if (e.components !== t.components) {
		let o = Object.keys(e.components || {}), n = Object.keys(t.components || {});
		if (o.length !== n.length || o.some((r) => {
			var s, a;
			return ((s = e.components) == null ? void 0 : s[r]) !== ((a = t.components) == null ? void 0 : a[r]);
		})) return false;
	}
	return !(e.rehypePlugins !== t.rehypePlugins || e.remarkPlugins !== t.remarkPlugins);
});
Tn.displayName = "Block";
var Qs = (0, import_react.memo)(({ children: e, mode: t = "streaming", dir: o, parseIncompleteMarkdown: n = true, normalizeHtmlIndentation: r = false, components: s, rehypePlugins: a = gn, remarkPlugins: l = Us, className: i, shikiTheme: d = vn, mermaid: c, controls: p = true, isAnimating: m = false, animated: u, BlockComponent: f = Tn, parseMarkdownIntoBlocksFn: h = kt, caret: b, plugins: g, remend: T, linkSafety: v = xn, lineNumbers: w = true, allowedTags: P, literalTagContent: M, translations: H, icons: S, prefix: F, onAnimationStart: j, onAnimationEnd: z, ...B }) => {
	let _ = (0, import_react.useId)(), [Q, U] = (0, import_react.useTransition)(), x = (0, import_react.useMemo)(() => Dt(F), [F]), q = (0, import_react.useRef)(null), X = (0, import_react.useRef)(j), Re = (0, import_react.useRef)(z);
	X.current = j, Re.current = z, (0, import_react.useEffect)(() => {
		var A, K, ee;
		if (t === "static") return;
		let k = q.current;
		if (q.current = m, k === null) {
			m && ((A = X.current) == null || A.call(X));
			return;
		}
		m && !k ? (K = X.current) == null || K.call(X) : !m && k && ((ee = Re.current) == null || ee.call(Re));
	}, [m, t]);
	let Je = (0, import_react.useMemo)(() => P ? Object.keys(P) : [], [P]), Se = (0, import_react.useMemo)(() => {
		if (typeof e != "string") return "";
		let k = t === "streaming" && n ? $e$1(e, T) : e;
		return M && M.length > 0 && (k = cn(k, M)), Je.length > 0 && (k = ln(k, Je)), k;
	}, [
		e,
		t,
		n,
		T,
		Je,
		M
	]), fe = (0, import_react.useMemo)(() => h(Se), [Se, h]), [Ln, Tt] = (0, import_react.useState)(fe);
	(0, import_react.useEffect)(() => {
		t === "streaming" && !ge ? U(() => {
			Tt(fe);
		}) : Tt(fe);
	}, [fe, t]);
	let J = t === "streaming" ? Ln : fe, Ke = (0, import_react.useMemo)(() => o === "auto" ? J.map($e) : void 0, [J, o]), Rn = (0, import_react.useMemo)(() => J.map((k, A) => `${_}-${A}`), [J.length, _]), Ue = (0, import_react.useMemo)(() => u === true ? "true" : u ? JSON.stringify(u) : "", [u]), ge = (0, import_react.useMemo)(() => Ue ? Ue === "true" ? be() : be(u) : null, [Ue]), Pt = (0, import_react.useMemo)(() => {
		var k, A;
		return {
			shikiTheme: (A = (k = g == null ? void 0 : g.code) == null ? void 0 : k.getThemes()) != null ? A : d,
			controls: p,
			isAnimating: m,
			lineNumbers: w,
			mode: t,
			mermaid: c,
			linkSafety: v
		};
	}, [
		d,
		p,
		m,
		w,
		t,
		c,
		v,
		g == null ? void 0 : g.code
	]), Sn = (0, import_react.useMemo)(() => H ? JSON.stringify(H) : "", [H]), Mt = (0, import_react.useMemo)(() => ({
		...De,
		...H
	}), [Sn]), It = (0, import_react.useMemo)(() => {
		let { inlineCode: k, ...A } = s != null ? s : {}, K = {
			...Ko,
			...A
		};
		if (k) {
			let ee = K.code;
			K.code = (ie) => "data-block" in ie ? ee ? (0, import_react.createElement)(ee, ie) : null : (0, import_react.createElement)(k, ie);
		}
		return K;
	}, [s]), Nt = (0, import_react.useMemo)(() => {
		let k = [];
		return g != null && g.cjk && (k = [...k, ...g.cjk.remarkPluginsBefore]), k = [...k, ...l], g != null && g.cjk && (k = [...k, ...g.cjk.remarkPluginsAfter]), g != null && g.math && (k = [...k, g.math.remarkPlugin]), k;
	}, [
		l,
		g == null ? void 0 : g.math,
		g == null ? void 0 : g.cjk
	]), Lt = (0, import_react.useMemo)(() => {
		var A;
		let k = a;
		if (P && Object.keys(P).length > 0 && a === gn) {
			let K = {
				...Ze,
				tagNames: [...(A = Ze.tagNames) != null ? A : [], ...Object.keys(P)],
				attributes: {
					...Ze.attributes,
					...P
				}
			};
			k = [
				xt.raw,
				[rehypeSanitize, K],
				xt.harden
			];
		}
		return M && M.length > 0 && (k = [...k, [mn, M]]), g != null && g.math && (k = [...k, g.math.rehypePlugin]), ge && m && (k = [...k, ge.rehypePlugin]), k;
	}, [
		a,
		g == null ? void 0 : g.math,
		ge,
		m,
		P,
		M
	]), Ge = (0, import_react.useMemo)(() => {
		if (!m || J.length === 0) return false;
		let k = J.at(-1);
		return ht(k) || Uo(k);
	}, [m, J]), En = (0, import_react.useMemo)(() => b && m && !Ge ? { "--streamdown-caret": `"${Gs[b]}"` } : void 0, [
		b,
		m,
		Ge
	]);
	return t === "static" ? (0, import_jsx_runtime.jsx)(Be.Provider, {
		value: Mt,
		children: (0, import_jsx_runtime.jsx)(Ve.Provider, {
			value: g != null ? g : null,
			children: (0, import_jsx_runtime.jsx)(R$1.Provider, {
				value: Pt,
				children: (0, import_jsx_runtime.jsx)(at, {
					icons: S,
					children: (0, import_jsx_runtime.jsx)(Ee.Provider, {
						value: x,
						children: (0, import_jsx_runtime.jsx)("div", {
							className: x("space-y-4 whitespace-normal [&>*:first-child]:mt-0 [&>*:last-child]:mb-0", i),
							dir: o === "auto" ? $e(Se) : o,
							children: (0, import_jsx_runtime.jsx)(Ct, {
								components: It,
								rehypePlugins: Lt,
								remarkPlugins: Nt,
								...B,
								children: Se
							})
						})
					})
				})
			})
		})
	}) : (0, import_jsx_runtime.jsx)(Be.Provider, {
		value: Mt,
		children: (0, import_jsx_runtime.jsx)(Ve.Provider, {
			value: g != null ? g : null,
			children: (0, import_jsx_runtime.jsx)(R$1.Provider, {
				value: Pt,
				children: (0, import_jsx_runtime.jsx)(at, {
					icons: S,
					children: (0, import_jsx_runtime.jsx)(Ee.Provider, {
						value: x,
						children: (0, import_jsx_runtime.jsxs)("div", {
							className: x("space-y-4 whitespace-normal [&>*:first-child]:mt-0 [&>*:last-child]:mb-0", b && !Ge ? "[&>*:last-child]:after:inline [&>*:last-child]:after:align-baseline [&>*:last-child]:after:content-[var(--streamdown-caret)]" : null, i),
							style: En,
							children: [J.length === 0 && b && m && (0, import_jsx_runtime.jsx)("span", {}), J.map((k, A) => {
								var ie;
								let K = A === J.length - 1, ee = m && K && ht(k);
								return (0, import_jsx_runtime.jsx)(f, {
									animatePlugin: ge,
									components: It,
									content: k,
									dir: (ie = Ke == null ? void 0 : Ke[A]) != null ? ie : o !== "auto" ? o : void 0,
									index: A,
									isIncomplete: ee,
									rehypePlugins: Lt,
									remarkPlugins: Nt,
									shouldNormalizeHtmlIndentation: r,
									shouldParseIncompleteMarkdown: n,
									...B
								}, Rn[A]);
							})]
						})
					})
				})
			})
		})
	});
}, (e, t) => e.children === t.children && e.shikiTheme === t.shikiTheme && e.isAnimating === t.isAnimating && e.animated === t.animated && e.mode === t.mode && e.plugins === t.plugins && e.className === t.className && e.linkSafety === t.linkSafety && e.lineNumbers === t.lineNumbers && e.normalizeHtmlIndentation === t.normalizeHtmlIndentation && e.literalTagContent === t.literalTagContent && JSON.stringify(e.translations) === JSON.stringify(t.translations) && e.prefix === t.prefix && e.dir === t.dir);
Qs.displayName = "Streamdown";
var Nn = ({ children: e, className: t, minZoom: o = .5, maxZoom: n = 3, zoomStep: r = .1, showControls: s = true, initialZoom: a = 1, fullscreen: l = false }) => {
	let { RotateCcwIcon: i, ZoomInIcon: d, ZoomOutIcon: c } = L(), p = y(), m = (0, import_react.useRef)(null), u = (0, import_react.useRef)(null), [f, h] = (0, import_react.useState)(a), [b, g] = (0, import_react.useState)({
		x: 0,
		y: 0
	}), [T, v] = (0, import_react.useState)(false), [w, P] = (0, import_react.useState)({
		x: 0,
		y: 0
	}), [M, H] = (0, import_react.useState)({
		x: 0,
		y: 0
	}), S = (0, import_react.useCallback)((x) => {
		h((q) => Math.max(o, Math.min(n, q + x)));
	}, [o, n]), F = (0, import_react.useCallback)(() => {
		S(r);
	}, [S, r]), j = (0, import_react.useCallback)(() => {
		S(-r);
	}, [S, r]), z = (0, import_react.useCallback)(() => {
		h(a), g({
			x: 0,
			y: 0
		});
	}, [a]), B = (0, import_react.useCallback)((x) => {
		x.preventDefault();
		let q = x.deltaY > 0 ? -r : r;
		S(q);
	}, [S, r]), _ = (0, import_react.useCallback)((x) => {
		if (x.button !== 0 || x.isPrimary === false) return;
		v(true), P({
			x: x.clientX,
			y: x.clientY
		}), H(b);
		let q = x.currentTarget;
		q instanceof HTMLElement && q.setPointerCapture(x.pointerId);
	}, [b]), Q = (0, import_react.useCallback)((x) => {
		if (!T) return;
		x.preventDefault();
		let q = x.clientX - w.x, X = x.clientY - w.y;
		g({
			x: M.x + q,
			y: M.y + X
		});
	}, [
		T,
		w,
		M
	]), U = (0, import_react.useCallback)((x) => {
		v(false);
		let q = x.currentTarget;
		q instanceof HTMLElement && q.releasePointerCapture(x.pointerId);
	}, []);
	return (0, import_react.useEffect)(() => {
		let x = m.current;
		if (x) return x.addEventListener("wheel", B, { passive: false }), () => {
			x.removeEventListener("wheel", B);
		};
	}, [B]), (0, import_react.useEffect)(() => {
		let x = u.current;
		if (x && T) return document.body.style.userSelect = "none", x.addEventListener("pointermove", Q, { passive: false }), x.addEventListener("pointerup", U), x.addEventListener("pointercancel", U), () => {
			document.body.style.userSelect = "", x.removeEventListener("pointermove", Q), x.removeEventListener("pointerup", U), x.removeEventListener("pointercancel", U);
		};
	}, [
		T,
		Q,
		U
	]), (0, import_jsx_runtime.jsxs)("div", {
		className: p("relative flex flex-col", l ? "h-full w-full" : "min-h-28 w-full", t),
		ref: m,
		style: { cursor: T ? "grabbing" : "grab" },
		children: [s ? (0, import_jsx_runtime.jsxs)("div", {
			className: p("absolute z-10 flex flex-col gap-1 rounded-md border border-border bg-background/80 p-1 supports-[backdrop-filter]:bg-background/70 supports-[backdrop-filter]:backdrop-blur-sm", l ? "bottom-4 left-4" : "bottom-2 left-2"),
			children: [
				(0, import_jsx_runtime.jsx)("button", {
					className: p("flex items-center justify-center rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"),
					disabled: f >= n,
					onClick: F,
					title: "Zoom in",
					type: "button",
					children: (0, import_jsx_runtime.jsx)(d, { size: 16 })
				}),
				(0, import_jsx_runtime.jsx)("button", {
					className: p("flex items-center justify-center rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"),
					disabled: f <= o,
					onClick: j,
					title: "Zoom out",
					type: "button",
					children: (0, import_jsx_runtime.jsx)(c, { size: 16 })
				}),
				(0, import_jsx_runtime.jsx)("button", {
					className: p("flex items-center justify-center rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"),
					onClick: z,
					title: "Reset zoom and pan",
					type: "button",
					children: (0, import_jsx_runtime.jsx)(i, { size: 16 })
				})
			]
		}) : null, (0, import_jsx_runtime.jsx)("div", {
			className: p("flex-1 origin-center transition-transform duration-150 ease-out", l ? "flex h-full w-full items-center justify-center" : "flex w-full items-center justify-center"),
			onPointerDown: _,
			ref: u,
			role: "application",
			style: {
				transform: `translate(${b.x}px, ${b.y}px) scale(${f})`,
				transformOrigin: "center center",
				touchAction: "none",
				willChange: "transform"
			},
			children: e
		})]
	});
};
var po = ({ chart: e, className: t, config: o, fullscreen: n = false, showControls: r = true }) => {
	let s = y(), [a, l] = (0, import_react.useState)(null), [i, d] = (0, import_react.useState)(false), [c, p] = (0, import_react.useState)(""), [m, u] = (0, import_react.useState)(""), [f, h] = (0, import_react.useState)(0), { mermaid: b } = (0, import_react.useContext)(R$1), g = de(), T = b == null ? void 0 : b.errorComponent, { shouldRender: v, containerRef: w } = Rt({ immediate: n });
	if ((0, import_react.useEffect)(() => {
		if (!v) return;
		if (!g) {
			l("Mermaid plugin not available. Please add the mermaid plugin to enable diagram rendering.");
			return;
		}
		(async () => {
			try {
				l(null), d(!0);
				let H = g.getMermaid(o), S = e.split("").reduce((z, B) => (z << 5) - z + B.charCodeAt(0) | 0, 0), F = `mermaid-${Math.abs(S)}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, { svg: j } = await H.render(F, e);
				p(j), u(j);
			} catch (H) {
				if (!(m || c)) {
					let S = H instanceof Error ? H.message : "Failed to render Mermaid chart";
					l(S);
				}
			} finally {
				d(false);
			}
		})();
	}, [
		e,
		o,
		f,
		v,
		g
	]), !(v || c || m)) return (0, import_jsx_runtime.jsx)("div", {
		className: s("my-4 min-h-[200px]", t),
		ref: w
	});
	if (i && !c && !m) return (0, import_jsx_runtime.jsx)("div", {
		className: s("my-4 flex justify-center p-4", t),
		ref: w,
		children: (0, import_jsx_runtime.jsxs)("div", {
			className: s("flex items-center space-x-2 text-muted-foreground"),
			children: [(0, import_jsx_runtime.jsx)("div", { className: s("h-4 w-4 animate-spin rounded-full border-current border-b-2") }), (0, import_jsx_runtime.jsx)("span", {
				className: s("text-sm"),
				children: "Loading diagram..."
			})]
		})
	});
	if (a && !c && !m) {
		let M = () => h((H) => H + 1);
		return T ? (0, import_jsx_runtime.jsx)("div", {
			ref: w,
			children: (0, import_jsx_runtime.jsx)(T, {
				chart: e,
				error: a,
				retry: M
			})
		}) : (0, import_jsx_runtime.jsxs)("div", {
			className: s("rounded-md bg-red-50 p-4", t),
			ref: w,
			children: [(0, import_jsx_runtime.jsxs)("p", {
				className: s("font-mono text-red-700 text-sm"),
				children: ["Mermaid Error: ", a]
			}), (0, import_jsx_runtime.jsxs)("details", {
				className: s("mt-2"),
				children: [(0, import_jsx_runtime.jsx)("summary", {
					className: s("cursor-pointer text-red-600 text-xs"),
					children: "Show Code"
				}), (0, import_jsx_runtime.jsx)("pre", {
					className: s("mt-2 overflow-x-auto rounded bg-red-100 p-2 text-red-800 text-xs"),
					children: e
				})]
			})]
		});
	}
	let P = c || m;
	return (0, import_jsx_runtime.jsx)("div", {
		className: s("size-full", t),
		"data-streamdown": "mermaid",
		ref: w,
		children: (0, import_jsx_runtime.jsx)(Nn, {
			className: s(n ? "size-full overflow-hidden" : "overflow-hidden", t),
			fullscreen: n,
			maxZoom: 3,
			minZoom: .5,
			showControls: r,
			zoomStep: .1,
			children: (0, import_jsx_runtime.jsx)("div", {
				"aria-label": "Mermaid chart",
				className: s("flex justify-center", n ? "size-full items-center" : null),
				dangerouslySetInnerHTML: { __html: P },
				role: "img"
			})
		})
	});
};
//#endregion
//#region node_modules/streamdown/dist/highlighted-body-OFNGDK62.js
var highlighted_body_OFNGDK62_exports = /* @__PURE__ */ __exportAll({ HighlightedCodeBlockBody: () => R });
var R = ({ code: s, language: e, raw: t, className: h, startLine: d, lineNumbers: m, ...p }) => {
	let { shikiTheme: l } = (0, import_react.useContext)(R$1), o = Li(), [a, i] = (0, import_react.useState)(t);
	return (0, import_react.useEffect)(() => {
		if (!o) {
			i(t);
			return;
		}
		let r = o.highlight({
			code: s,
			language: e,
			themes: l
		}, (c) => {
			i(c);
		});
		r && i(r);
	}, [
		s,
		e,
		l,
		o,
		t
	]), (0, import_jsx_runtime.jsx)(At, {
		className: h,
		language: e,
		lineNumbers: m,
		result: a,
		startLine: d,
		...p
	});
};
//#endregion
//#region node_modules/streamdown/dist/mermaid-GHXKKRXX.js
var mermaid_GHXKKRXX_exports = /* @__PURE__ */ __exportAll({ Mermaid: () => po });
//#endregion
export { twMerge as n, Qs as t };
