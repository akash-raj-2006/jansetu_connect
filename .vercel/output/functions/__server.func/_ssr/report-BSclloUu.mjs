import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link, v as ClientOnly } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { CATEGORIES, LANGUAGES, LANGUAGE_LABELS, similarity } from "./jansetu-Wo0gHWAe.mjs";
import { t as Button } from "./button-DAOZKppQ.mjs";
import { t as Input } from "./input-COtCr2HY.mjs";
import { t as Textarea } from "./textarea-Dil9MIXY.mjs";
import { I as CircleCheck, L as CircleAlert, P as Copy, S as LoaderCircle, T as ImagePlus, W as Camera, _ as Mic, a as TriangleAlert, i as Upload, l as Square, n as X } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-UKJJwD3x.mjs";
import { t as AppShell } from "./AppShell-CYXJOvDL.mjs";
import { i as validateImageFile, n as compressImage, r as uploadImage } from "./report-images-BGUOyCjx.mjs";
import { t as Label } from "./label-DbtQc-0n.mjs";
import { t as useReports } from "./use-jansetu-data-DyLqof76.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as submitReport, r as useServerFn } from "./jansetu.functions-DixiE17k.mjs";
import { n as saveCode } from "./my-reports-FCHAQeFG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/report-BSclloUu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Photo evidence field: click-to-browse, drag-and-drop and direct camera capture.
* Images are validated, compressed and uploaded to cloud storage; the parent only
* receives the resulting storage paths.
*/
function ImageUploader({ paths, onChange }) {
	const [items, setItems] = (0, import_react.useState)([]);
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const [errors, setErrors] = (0, import_react.useState)([]);
	const browseRef = (0, import_react.useRef)(null);
	const cameraRef = (0, import_react.useRef)(null);
	const uploading = items.some((item) => !item.path && !item.error);
	const changeRef = (0, import_react.useRef)(onChange);
	changeRef.current = onChange;
	(0, import_react.useEffect)(() => {
		changeRef.current(items.filter((item) => item.path).map((item) => item.path));
	}, [items]);
	async function addFiles(files) {
		const messages = [];
		const room = 3 - items.filter((item) => !item.error).length;
		if (room <= 0) {
			setErrors([`You can attach up to 3 photos per report.`]);
			return;
		}
		const accepted = [];
		for (const file of files.slice(0, room)) {
			const problem = validateImageFile(file);
			if (problem) messages.push(problem);
			else accepted.push(file);
		}
		if (files.length > room) messages.push(`Only 3 photos per report — extras skipped.`);
		setErrors(messages);
		for (const file of accepted) {
			const key = crypto.randomUUID();
			const entry = {
				key,
				preview: URL.createObjectURL(file),
				name: file.name,
				progress: 0
			};
			setItems((prev) => [...prev, entry]);
			try {
				const blob = await compressImage(file);
				const path = await uploadImage(blob, (percent) => setItems((prev) => prev.map((i) => i.key === key ? {
					...i,
					progress: percent
				} : i)));
				setItems((prev) => prev.map((i) => i.key === key ? {
					...i,
					path,
					progress: 100
				} : i));
			} catch (error) {
				const message = error instanceof Error ? error.message : "Upload failed.";
				setItems((prev) => prev.map((i) => i.key === key ? {
					...i,
					error: message
				} : i));
			}
		}
	}
	function remove(key) {
		setItems((prev) => prev.filter((item) => item.key !== key));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onDragOver: (event) => {
					event.preventDefault();
					setDragging(true);
				},
				onDragLeave: () => setDragging(false),
				onDrop: (event) => {
					event.preventDefault();
					setDragging(false);
					addFiles(Array.from(event.dataTransfer.files));
				},
				className: `rounded-2xl border-2 border-dashed p-4 transition-colors ${dragging ? "border-accent bg-accent/10" : "border-border bg-surface-2/40"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => browseRef.current?.click(),
								className: "inline-flex items-center gap-2 rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm font-medium hover:bg-surface-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-4" }), " Add photos"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => cameraRef.current?.click(),
								className: "inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4" }), " Take a photo"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [
									"or drag & drop · up to ",
									3,
									" images · JPG/PNG/WebP · 5MB each"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: browseRef,
						type: "file",
						accept: "image/jpeg,image/png,image/webp",
						multiple: true,
						className: "hidden",
						onChange: (event) => {
							addFiles(Array.from(event.target.files ?? []));
							event.target.value = "";
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: cameraRef,
						type: "file",
						accept: "image/*",
						capture: "environment",
						className: "hidden",
						onChange: (event) => {
							addFiles(Array.from(event.target.files ?? []));
							event.target.value = "";
						}
					}),
					items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 grid grid-cols-3 gap-2",
						children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "relative overflow-hidden rounded-xl border border-border bg-surface",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: item.preview,
									alt: item.name,
									className: "aspect-square w-full object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => remove(item.key),
									"aria-label": `Remove ${item.name}`,
									className: "absolute top-1 right-1 inline-flex size-6 items-center justify-center rounded-full border border-border-strong bg-background/90 text-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
								}),
								!item.path && !item.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-x-0 bottom-0 bg-background/85 px-1.5 py-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 text-[10px] font-mono",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }),
											" ",
											item.progress,
											"%"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-0.5 h-1 w-full overflow-hidden rounded-full bg-muted",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full bg-accent transition-all",
											style: { width: `${item.progress}%` }
										})
									})]
								}),
								item.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "absolute inset-x-0 bottom-0 bg-destructive/90 px-1.5 py-1 text-[10px] text-destructive-foreground",
									children: "Failed"
								})
							]
						}, item.key))
					})
				]
			}),
			uploading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Uploading photos…"
			}),
			errors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1",
				children: errors.map((message) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-1.5 text-xs text-destructive",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mt-0.5 size-3.5 shrink-0" }),
						" ",
						message
					]
				}, message))
			}),
			paths.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					paths.length,
					" photo",
					paths.length > 1 ? "s" : "",
					" attached."
				]
			})
		]
	});
}
function ReportPage() {
	const { data: reports = [], refetch } = useReports();
	const submit = useServerFn(submitReport);
	const [language, setLanguage] = (0, import_react.useState)("auto");
	const [text, setText] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [pin, ,] = (0, import_react.useState)(null);
	const [audio, setAudio] = (0, import_react.useState)(null);
	const [imagePaths, setImagePaths] = (0, import_react.useState)([]);
	const [recording, setRecording] = (0, import_react.useState)(false);
	const [pending, setPending] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const recorderRef = (0, import_react.useRef)(null);
	const similar = (0, import_react.useMemo)(() => {
		if (!result) return [];
		return reports.filter((r) => r.id !== result.id && r.ward_id === result.ward_id && r.category === result.category).map((r) => ({
			report: r,
			score: similarity(result.translated_text, r.translated_text)
		})).filter((r) => r.score >= .3).sort((a, b) => b.score - a.score).slice(0, 3);
	}, [result, reports]);
	async function toBase64(blob) {
		const buffer = await blob.arrayBuffer();
		let binary = "";
		const bytes = new Uint8Array(buffer);
		for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
		return btoa(binary);
	}
	async function startRecording() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const recorder = new MediaRecorder(stream);
			const chunks = [];
			recorder.ondataavailable = (event) => chunks.push(event.data);
			recorder.onstop = async () => {
				stream.getTracks().forEach((track) => track.stop());
				const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
				setAudio({
					base64: await toBase64(blob),
					format: (recorder.mimeType || "audio/webm").includes("mp4") ? "mp4" : "webm",
					url: URL.createObjectURL(blob)
				});
			};
			recorder.start();
			recorderRef.current = recorder;
			setRecording(true);
		} catch {
			toast.error("Microphone unavailable. You can upload an audio file instead.");
		}
	}
	function stopRecording() {
		recorderRef.current?.stop();
		setRecording(false);
	}
	async function onUpload(file) {
		const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
		const format = [
			"wav",
			"mp3",
			"m4a",
			"mp4",
			"webm",
			"ogg",
			"aac",
			"flac"
		].includes(ext) ? ext : "wav";
		setAudio({
			base64: await toBase64(file),
			format,
			url: URL.createObjectURL(file)
		});
	}
	async function onSubmit() {
		if (!pin) {
			toast.error("Pin the location on the map first.");
			return;
		}
		if (!text.trim() && !audio) {
			toast.error("Describe the problem or add a voice note.");
			return;
		}
		if (imagePaths.length === 0) {
			toast.error("Attach at least one photo of the issue.");
			return;
		}
		setPending(true);
		setResult(null);
		try {
			const response = await submit({ data: {
				wardId: pin.wardId,
				lat: pin.lat,
				lng: pin.lng,
				text: text.trim() || void 0,
				audioBase64: audio?.base64,
				audioFormat: audio?.format,
				languageHint: language,
				channel: audio ? "voice" : "web",
				reporterName: name.trim() || void 0,
				address: pin.address,
				imagePaths
			} });
			if (!response.ok) {
				toast.error(response.error);
				return;
			}
			setResult(response.report);
			setText("");
			setAudio(null);
			setImagePaths([]);
			saveCode(response.report.tracking_code);
			toast.success(`Report filed · ${response.report.tracking_code}`);
			refetch();
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong sending the report.");
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "File a report",
		subtitle: "Speak or type in any language. JanSetu transcribes, translates, classifies category and urgency, and pins it to your ward.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-6xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[1.05fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "sheet space-y-5 rounded-md p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Language" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: language,
								onValueChange: setLanguage,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: LANGUAGES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: item.id,
									children: item.label
								}, item.id)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "complaint",
								children: "Describe the problem"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "complaint",
								rows: 5,
								value: text,
								onChange: (event) => setText(event.target.value),
								placeholder: "जैसे: हमारे इलाके में चार दिन से पानी नहीं आया है…"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border border-border/70 bg-surface-2/50 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-3",
									children: [
										recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "destructive",
											onClick: stopRecording,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-4" }), " Stop recording"]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "secondary",
											onClick: startRecording,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" }), " Record voice note"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }),
												" Upload audio",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "file",
													accept: "audio/*",
													className: "hidden",
													onChange: (event) => {
														const file = event.target.files?.[0];
														if (file) onUpload(file);
													}
												})
											]
										}),
										recording && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-2 text-sm text-destructive",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 animate-pulse rounded-full bg-destructive" }), " listening…"]
										})
									]
								}),
								audio && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
										controls: true,
										src: audio.url,
										className: "h-9 w-full max-w-xs"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "ghost",
										size: "sm",
										onClick: () => setAudio(null),
										children: "Remove"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: "Voice works in any language — Gemini transcribes and translates it for officials."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Photo evidence" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploader, {
								paths: imagePaths,
								onChange: setImagePaths
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "name",
								children: "Your name (optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "name",
								value: name,
								onChange: (event) => setName(event.target.value),
								placeholder: "Anonymous"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: onSubmit,
							disabled: pending || !pin || imagePaths.length === 0,
							className: "w-full",
							size: "lg",
							children: [pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, pending ? "Analysing with AI…" : "Submit report"]
						}),
						(!pin || imagePaths.length === 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Required before submitting:",
								" ",
								[imagePaths.length === 0 ? "at least one photo" : null, !pin ? "a map pin" : null].filter(Boolean).join(" and "),
								"."
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sheet rounded-md p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-semibold",
								children: "Pin the exact location"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-3 text-xs text-muted-foreground",
								children: "Search, tap or drag the pin on the live map. We confirm the street address and detect your ward automatically."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[340px] animate-pulse rounded-2xl border border-border bg-surface-2/60" }) })
						]
					}), result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sheet glow-primary space-y-4 rounded-md p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-lg font-semibold",
									children: "Report filed"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-lg font-semibold",
									children: result.tracking_code
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => {
										navigator.clipboard.writeText(result.tracking_code);
										toast.success("Tracking code copied");
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), " Copy"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "grid grid-cols-2 gap-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Category"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "capitalize",
										children: CATEGORIES.find((c) => c.id === result.category)?.label ?? result.category
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Urgency"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [result.urgency, "/5"] })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Detected language"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: LANGUAGE_LABELS[result.language] ?? result.language })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Sentiment"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "capitalize",
										children: result.sentiment
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "English translation for officials"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: result.translated_text })]
							}),
							similar.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-2 font-medium text-warning",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4" }),
											" ",
											similar.length,
											" similar report(s) already in this ward"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-2 space-y-1 text-xs text-muted-foreground",
										children: similar.map(({ report, score }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											report.tracking_code,
											" · ",
											Math.round(score * 100),
											"% match ·",
											" ",
											report.summary
										] }, report.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-muted-foreground",
										children: "Clustered together — repeat voices raise the ward's priority score instead of creating noise."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/track",
								search: { code: result.tracking_code },
								className: "inline-flex text-sm font-medium text-accent hover:underline",
								children: "Track this report →"
							})
						]
					})]
				})]
			})
		})
	});
}
//#endregion
export { ReportPage as component };
