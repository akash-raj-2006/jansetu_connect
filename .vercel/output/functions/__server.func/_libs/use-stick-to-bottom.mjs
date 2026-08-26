import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "./@floating-ui/react-dom+[...].mjs";
//#region node_modules/use-stick-to-bottom/dist/useStickToBottom.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/*!---------------------------------------------------------------------------------------------
*  Copyright (c) StackBlitz. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
var DEFAULT_SPRING_ANIMATION = {
	/**
	* A value from 0 to 1, on how much to damp the animation.
	* 0 means no damping, 1 means full damping.
	*
	* @default 0.7
	*/
	damping: .7,
	/**
	* The stiffness of how fast/slow the animation gets up to speed.
	*
	* @default 0.05
	*/
	stiffness: .05,
	/**
	* The inertial mass associated with the animation.
	* Higher numbers make the animation slower.
	*
	* @default 1.25
	*/
	mass: 1.25
};
var STICK_TO_BOTTOM_OFFSET_PX = 70;
var SIXTY_FPS_INTERVAL_MS = 1e3 / 60;
var RETAIN_ANIMATION_DURATION_MS = 350;
var mouseDown = false;
globalThis.document?.addEventListener("mousedown", () => {
	mouseDown = true;
});
globalThis.document?.addEventListener("mouseup", () => {
	mouseDown = false;
});
globalThis.document?.addEventListener("click", () => {
	mouseDown = false;
});
var useStickToBottom = (options = {}) => {
	const [escapedFromLock, updateEscapedFromLock] = (0, import_react.useState)(false);
	const [isAtBottom, updateIsAtBottom] = (0, import_react.useState)(options.initial !== false);
	const [isNearBottom, setIsNearBottom] = (0, import_react.useState)(false);
	const optionsRef = (0, import_react.useRef)(null);
	optionsRef.current = options;
	const isSelecting = (0, import_react.useCallback)(() => {
		if (!mouseDown) return false;
		const selection = window.getSelection();
		if (!selection || !selection.rangeCount) return false;
		const range = selection.getRangeAt(0);
		return range.commonAncestorContainer.contains(scrollRef.current) || scrollRef.current?.contains(range.commonAncestorContainer);
	}, []);
	const setIsAtBottom = (0, import_react.useCallback)((isAtBottom) => {
		state.isAtBottom = isAtBottom;
		updateIsAtBottom(isAtBottom);
	}, []);
	const setEscapedFromLock = (0, import_react.useCallback)((escapedFromLock) => {
		state.escapedFromLock = escapedFromLock;
		updateEscapedFromLock(escapedFromLock);
	}, []);
	const state = (0, import_react.useMemo)(() => {
		let lastCalculation;
		return {
			escapedFromLock,
			isAtBottom,
			resizeDifference: 0,
			accumulated: 0,
			velocity: 0,
			listeners: /* @__PURE__ */ new Set(),
			get scrollTop() {
				return scrollRef.current?.scrollTop ?? 0;
			},
			set scrollTop(scrollTop) {
				if (scrollRef.current) {
					const { scrollBehavior } = getComputedStyle(scrollRef.current);
					if (scrollBehavior !== "auto") scrollRef.current.style.scrollBehavior = "auto";
					scrollRef.current.scrollTop = scrollTop;
					state.ignoreScrollToTop = scrollRef.current.scrollTop;
					if (scrollBehavior !== "auto") scrollRef.current.style.scrollBehavior = scrollBehavior;
				}
			},
			get targetScrollTop() {
				if (!scrollRef.current || !contentRef.current) return 0;
				return scrollRef.current.scrollHeight - 1 - scrollRef.current.clientHeight;
			},
			get calculatedTargetScrollTop() {
				if (!scrollRef.current || !contentRef.current) return 0;
				const { targetScrollTop } = this;
				if (!options.targetScrollTop) return targetScrollTop;
				if (lastCalculation?.targetScrollTop === targetScrollTop) return lastCalculation.calculatedScrollTop;
				const calculatedScrollTop = Math.max(Math.min(options.targetScrollTop(targetScrollTop, {
					scrollElement: scrollRef.current,
					contentElement: contentRef.current
				}), targetScrollTop), 0);
				lastCalculation = {
					targetScrollTop,
					calculatedScrollTop
				};
				requestAnimationFrame(() => {
					lastCalculation = void 0;
				});
				return calculatedScrollTop;
			},
			get scrollDifference() {
				return this.calculatedTargetScrollTop - this.scrollTop;
			},
			get isNearBottom() {
				return this.scrollDifference <= STICK_TO_BOTTOM_OFFSET_PX;
			}
		};
	}, []);
	const scrollToBottom = (0, import_react.useCallback)((scrollOptions = {}) => {
		if (typeof scrollOptions === "string") scrollOptions = { animation: scrollOptions };
		if (!scrollOptions.preserveScrollPosition) setIsAtBottom(true);
		const waitElapsed = Date.now() + (Number(scrollOptions.wait) || 0);
		const behavior = mergeAnimations(optionsRef.current, scrollOptions.animation);
		const { ignoreEscapes = false } = scrollOptions;
		let durationElapsed;
		let startTarget = state.calculatedTargetScrollTop;
		if (scrollOptions.duration instanceof Promise) scrollOptions.duration.finally(() => {
			durationElapsed = Date.now();
		});
		else durationElapsed = waitElapsed + (scrollOptions.duration ?? 0);
		const next = async () => {
			const promise = new Promise(requestAnimationFrame).then(() => {
				if (!state.isAtBottom) {
					state.animation = void 0;
					return false;
				}
				const { scrollTop } = state;
				const tick = performance.now();
				const tickDelta = (tick - (state.lastTick ?? tick)) / SIXTY_FPS_INTERVAL_MS;
				state.animation || (state.animation = {
					behavior,
					promise,
					ignoreEscapes
				});
				if (state.animation.behavior === behavior) state.lastTick = tick;
				if (isSelecting()) return next();
				if (waitElapsed > Date.now()) return next();
				if (scrollTop < Math.min(startTarget, state.calculatedTargetScrollTop)) {
					if (state.animation?.behavior === behavior) {
						if (behavior === "instant") {
							state.scrollTop = state.calculatedTargetScrollTop;
							return next();
						}
						state.velocity = (behavior.damping * state.velocity + behavior.stiffness * state.scrollDifference) / behavior.mass;
						state.accumulated += state.velocity * tickDelta;
						state.scrollTop += state.accumulated;
						if (state.scrollTop !== scrollTop) state.accumulated = 0;
					}
					return next();
				}
				if (durationElapsed > Date.now()) {
					startTarget = state.calculatedTargetScrollTop;
					return next();
				}
				state.animation = void 0;
				/**
				* If we're still below the target, then queue
				* up another scroll to the bottom with the last
				* requested animation.
				*/
				if (state.scrollTop < state.calculatedTargetScrollTop) return scrollToBottom({
					animation: mergeAnimations(optionsRef.current, optionsRef.current.resize),
					ignoreEscapes,
					duration: Math.max(0, durationElapsed - Date.now()) || void 0
				});
				return state.isAtBottom;
			});
			return promise.then((isAtBottom) => {
				requestAnimationFrame(() => {
					if (!state.animation) {
						state.lastTick = void 0;
						state.velocity = 0;
					}
				});
				return isAtBottom;
			});
		};
		if (scrollOptions.wait !== true) state.animation = void 0;
		if (state.animation?.behavior === behavior) return state.animation.promise;
		return next();
	}, [
		setIsAtBottom,
		isSelecting,
		state
	]);
	const stopScroll = (0, import_react.useCallback)(() => {
		setEscapedFromLock(true);
		setIsAtBottom(false);
	}, [setEscapedFromLock, setIsAtBottom]);
	const handleScroll = (0, import_react.useCallback)(({ target }) => {
		if (target !== scrollRef.current) return;
		const { scrollTop, ignoreScrollToTop } = state;
		let { lastScrollTop = scrollTop } = state;
		state.lastScrollTop = scrollTop;
		state.ignoreScrollToTop = void 0;
		if (ignoreScrollToTop && ignoreScrollToTop > scrollTop)
 /**
		* When the user scrolls up while the animation plays, the `scrollTop` may
		* not come in separate events; if this happens, to make sure `isScrollingUp`
		* is correct, set the lastScrollTop to the ignored event.
		*/
		lastScrollTop = ignoreScrollToTop;
		setIsNearBottom(state.isNearBottom);
		/**
		* Scroll events may come before a ResizeObserver event,
		* so in order to ignore resize events correctly we use a
		* timeout.
		*
		* @see https://github.com/WICG/resize-observer/issues/25#issuecomment-248757228
		*/
		setTimeout(() => {
			/**
			* When theres a resize difference ignore the resize event.
			*/
			if (state.resizeDifference || scrollTop === ignoreScrollToTop) return;
			if (isSelecting()) {
				setEscapedFromLock(true);
				setIsAtBottom(false);
				return;
			}
			const isScrollingDown = scrollTop > lastScrollTop;
			const isScrollingUp = scrollTop < lastScrollTop;
			if (state.animation?.ignoreEscapes) {
				state.scrollTop = lastScrollTop;
				return;
			}
			if (isScrollingUp) {
				setEscapedFromLock(true);
				setIsAtBottom(false);
			}
			if (isScrollingDown) setEscapedFromLock(false);
			if (!state.escapedFromLock && state.isNearBottom) setIsAtBottom(true);
		}, 1);
	}, [
		setEscapedFromLock,
		setIsAtBottom,
		isSelecting,
		state
	]);
	const handleWheel = (0, import_react.useCallback)(({ target, deltaY }) => {
		let element = target;
		while (!["scroll", "auto"].includes(getComputedStyle(element).overflow)) {
			if (!element.parentElement) return;
			element = element.parentElement;
		}
		/**
		* The browser may cancel the scrolling from the mouse wheel
		* if we update it from the animation in meantime.
		* To prevent this, always escape when the wheel is scrolled up.
		*/
		if (element === scrollRef.current && deltaY < 0 && scrollRef.current.scrollHeight > scrollRef.current.clientHeight && !state.animation?.ignoreEscapes) {
			setEscapedFromLock(true);
			setIsAtBottom(false);
		}
	}, [
		setEscapedFromLock,
		setIsAtBottom,
		state
	]);
	const scrollRef = useRefCallback((scroll) => {
		scrollRef.current?.removeEventListener("scroll", handleScroll);
		scrollRef.current?.removeEventListener("wheel", handleWheel);
		scroll?.addEventListener("scroll", handleScroll, { passive: true });
		scroll?.addEventListener("wheel", handleWheel, { passive: true });
	}, []);
	const contentRef = useRefCallback((content) => {
		state.resizeObserver?.disconnect();
		state.resizeObserver = void 0;
		if (!content) return;
		let previousHeight;
		state.resizeObserver = new ResizeObserver(([entry]) => {
			const { height } = entry.contentRect;
			const difference = height - (previousHeight ?? height);
			state.resizeDifference = difference;
			/**
			* Sometimes the browser can overscroll past the target,
			* so check for this and adjust appropriately.
			*/
			if (state.scrollTop > state.targetScrollTop) state.scrollTop = state.targetScrollTop;
			setIsNearBottom(state.isNearBottom);
			if (difference >= 0) {
				/**
				* If it's a positive resize, scroll to the bottom when
				* we're already at the bottom.
				*/
				const animation = mergeAnimations(optionsRef.current, previousHeight ? optionsRef.current.resize : optionsRef.current.initial);
				scrollToBottom({
					animation,
					wait: true,
					preserveScrollPosition: true,
					duration: animation === "instant" ? void 0 : RETAIN_ANIMATION_DURATION_MS
				});
			} else if (state.isNearBottom) {
				setEscapedFromLock(false);
				setIsAtBottom(true);
			}
			previousHeight = height;
			/**
			* Reset the resize difference after the scroll event
			* has fired. Requires a rAF to wait for the scroll event,
			* and a setTimeout to wait for the other timeout we have in
			* resizeObserver in case the scroll event happens after the
			* resize event.
			*/
			requestAnimationFrame(() => {
				setTimeout(() => {
					if (state.resizeDifference === difference) state.resizeDifference = 0;
				}, 1);
			});
		});
		state.resizeObserver?.observe(content);
	}, []);
	return {
		contentRef,
		scrollRef,
		scrollToBottom,
		stopScroll,
		isAtBottom: isAtBottom || isNearBottom,
		isNearBottom,
		escapedFromLock,
		state
	};
};
function useRefCallback(callback, deps) {
	const result = (0, import_react.useCallback)((ref) => {
		result.current = ref;
		return callback(ref);
	}, deps);
	return result;
}
var animationCache = /* @__PURE__ */ new Map();
function mergeAnimations(...animations) {
	const result = { ...DEFAULT_SPRING_ANIMATION };
	let instant = false;
	for (const animation of animations) {
		if (animation === "instant") {
			instant = true;
			continue;
		}
		if (typeof animation !== "object") continue;
		instant = false;
		result.damping = animation.damping ?? result.damping;
		result.stiffness = animation.stiffness ?? result.stiffness;
		result.mass = animation.mass ?? result.mass;
	}
	const key = JSON.stringify(result);
	if (!animationCache.has(key)) animationCache.set(key, Object.freeze(result));
	return instant ? "instant" : animationCache.get(key);
}
//#endregion
//#region node_modules/use-stick-to-bottom/dist/StickToBottom.js
/*!---------------------------------------------------------------------------------------------
*  Copyright (c) StackBlitz. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
var StickToBottomContext = (0, import_react.createContext)(null);
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? import_react.useLayoutEffect : import_react.useEffect;
function StickToBottom({ instance, children, resize, initial, mass, damping, stiffness, targetScrollTop: currentTargetScrollTop, contextRef, ...props }) {
	const customTargetScrollTop = (0, import_react.useRef)(null);
	const defaultInstance = useStickToBottom({
		mass,
		damping,
		stiffness,
		resize,
		initial,
		targetScrollTop: import_react.useCallback((target, elements) => {
			return (context?.targetScrollTop ?? currentTargetScrollTop)?.(target, elements) ?? target;
		}, [currentTargetScrollTop])
	});
	const { scrollRef, contentRef, scrollToBottom, stopScroll, isAtBottom, escapedFromLock, state } = instance ?? defaultInstance;
	const context = (0, import_react.useMemo)(() => ({
		scrollToBottom,
		stopScroll,
		scrollRef,
		isAtBottom,
		escapedFromLock,
		contentRef,
		state,
		get targetScrollTop() {
			return customTargetScrollTop.current;
		},
		set targetScrollTop(targetScrollTop) {
			customTargetScrollTop.current = targetScrollTop;
		}
	}), [
		scrollToBottom,
		isAtBottom,
		contentRef,
		scrollRef,
		stopScroll,
		escapedFromLock,
		state
	]);
	(0, import_react.useImperativeHandle)(contextRef, () => context, [context]);
	useIsomorphicLayoutEffect(() => {
		if (!scrollRef.current) return;
		if (getComputedStyle(scrollRef.current).overflow === "visible") scrollRef.current.style.overflow = "auto";
	}, []);
	return import_react.createElement(StickToBottomContext.Provider, { value: context }, import_react.createElement("div", { ...props }, typeof children === "function" ? children(context) : children));
}
(function(StickToBottom) {
	function Content({ children, scrollClassName, ...props }) {
		const context = useStickToBottomContext();
		return import_react.createElement("div", {
			ref: context.scrollRef,
			style: {
				height: "100%",
				width: "100%",
				scrollbarGutter: "stable both-edges"
			},
			className: scrollClassName
		}, import_react.createElement("div", {
			...props,
			ref: context.contentRef
		}, typeof children === "function" ? children(context) : children));
	}
	StickToBottom.Content = Content;
})(StickToBottom || (StickToBottom = {}));
/**
* Use this hook inside a <StickToBottom> component to gain access to whether the component is at the bottom of the scrollable area.
*/
function useStickToBottomContext() {
	const context = (0, import_react.useContext)(StickToBottomContext);
	if (!context) throw new Error("use-stick-to-bottom component context must be used within a StickToBottom component");
	return context;
}
//#endregion
export { useStickToBottomContext as n, StickToBottom as t };
