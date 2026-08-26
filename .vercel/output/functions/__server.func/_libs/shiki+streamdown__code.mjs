import { n as createSingletonShorthands, r as guessEmbeddedLanguages, t as createBundledHighlighter } from "./@shikijs/core+[...].mjs";
import { t as createOnigurumaEngine } from "./shikijs__engine-oniguruma.mjs";
import { t as createJavaScriptRegexEngine } from "./@shikijs/engine-javascript+[...].mjs";
//#region node_modules/shiki/dist/langs.mjs
var bundledLanguagesInfo = [
	{
		"id": "abap",
		"name": "ABAP",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.yi))
	},
	{
		"id": "actionscript-3",
		"name": "ActionScript",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.vi))
	},
	{
		"id": "ada",
		"name": "Ada",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n._i))
	},
	{
		"id": "angular-html",
		"name": "Angular HTML",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.pi))
	},
	{
		"id": "angular-ts",
		"name": "Angular TypeScript",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.di))
	},
	{
		"id": "apache",
		"name": "Apache Conf",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.ui))
	},
	{
		"id": "apex",
		"name": "Apex",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.li))
	},
	{
		"id": "apl",
		"name": "APL",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.ai))
	},
	{
		"id": "applescript",
		"name": "AppleScript",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.ii))
	},
	{
		"id": "ara",
		"name": "Ara",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.ri))
	},
	{
		"id": "asciidoc",
		"name": "AsciiDoc",
		"aliases": ["adoc"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.ni))
	},
	{
		"id": "asm",
		"name": "Assembly",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.ti))
	},
	{
		"id": "astro",
		"name": "Astro",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Zr))
	},
	{
		"id": "awk",
		"name": "AWK",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Xr))
	},
	{
		"id": "ballerina",
		"name": "Ballerina",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Yr))
	},
	{
		"id": "bat",
		"name": "Batch File",
		"aliases": ["batch"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Jr))
	},
	{
		"id": "beancount",
		"name": "Beancount",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.qr))
	},
	{
		"id": "berry",
		"name": "Berry",
		"aliases": ["be"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Kr))
	},
	{
		"id": "bibtex",
		"name": "BibTeX",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Gr))
	},
	{
		"id": "bicep",
		"name": "Bicep",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Wr))
	},
	{
		"id": "bird2",
		"name": "BIRD2 Configuration",
		"aliases": ["bird"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Ur))
	},
	{
		"id": "blade",
		"name": "Blade",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Br))
	},
	{
		"id": "bsl",
		"name": "1C (Enterprise)",
		"aliases": ["1c"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Rr))
	},
	{
		"id": "c",
		"name": "C",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Lr))
	},
	{
		"id": "c3",
		"name": "C3",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Ir))
	},
	{
		"id": "cadence",
		"name": "Cadence",
		"aliases": ["cdc"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Fr))
	},
	{
		"id": "cairo",
		"name": "Cairo",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Nr))
	},
	{
		"id": "clarity",
		"name": "Clarity",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Mr))
	},
	{
		"id": "clojure",
		"name": "Clojure",
		"aliases": ["clj"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.jr))
	},
	{
		"id": "cmake",
		"name": "CMake",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Ar))
	},
	{
		"id": "cobol",
		"name": "COBOL",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.kr))
	},
	{
		"id": "codeowners",
		"name": "CODEOWNERS",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Or))
	},
	{
		"id": "codeql",
		"name": "CodeQL",
		"aliases": ["ql"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Dr))
	},
	{
		"id": "coffee",
		"name": "CoffeeScript",
		"aliases": ["coffeescript"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Er))
	},
	{
		"id": "common-lisp",
		"name": "Common Lisp",
		"aliases": ["lisp"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Tr))
	},
	{
		"id": "coq",
		"name": "Coq",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.wr))
	},
	{
		"id": "cpp",
		"name": "C++",
		"aliases": ["c++"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.xr))
	},
	{
		"id": "crystal",
		"name": "Crystal",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.yr))
	},
	{
		"id": "csharp",
		"name": "C#",
		"aliases": ["c#", "cs"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.vr))
	},
	{
		"id": "css",
		"name": "CSS",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.hi))
	},
	{
		"id": "csv",
		"name": "CSV",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n._r))
	},
	{
		"id": "cue",
		"name": "CUE",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.gr))
	},
	{
		"id": "cypher",
		"name": "Cypher",
		"aliases": ["cql"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.hr))
	},
	{
		"id": "d",
		"name": "D",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.mr))
	},
	{
		"id": "dart",
		"name": "Dart",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.pr))
	},
	{
		"id": "dax",
		"name": "DAX",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.fr))
	},
	{
		"id": "desktop",
		"name": "Desktop",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.dr))
	},
	{
		"id": "diff",
		"name": "Diff",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.ur))
	},
	{
		"id": "docker",
		"name": "Dockerfile",
		"aliases": ["dockerfile"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.lr))
	},
	{
		"id": "dotenv",
		"name": "dotEnv",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.cr))
	},
	{
		"id": "dream-maker",
		"name": "Dream Maker",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.sr))
	},
	{
		"id": "edge",
		"name": "Edge",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.or))
	},
	{
		"id": "elixir",
		"name": "Elixir",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.ar))
	},
	{
		"id": "elm",
		"name": "Elm",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.ir))
	},
	{
		"id": "emacs-lisp",
		"name": "Emacs Lisp",
		"aliases": ["elisp"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.rr))
	},
	{
		"id": "erb",
		"name": "ERB",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Xn))
	},
	{
		"id": "erlang",
		"name": "Erlang",
		"aliases": ["erl"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Jn))
	},
	{
		"id": "fennel",
		"name": "Fennel",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.qn))
	},
	{
		"id": "fish",
		"name": "Fish",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Kn))
	},
	{
		"id": "fluent",
		"name": "Fluent",
		"aliases": ["ftl"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Gn))
	},
	{
		"id": "fortran-fixed-form",
		"name": "Fortran (Fixed Form)",
		"aliases": [
			"f",
			"for",
			"f77"
		],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Un))
	},
	{
		"id": "fortran-free-form",
		"name": "Fortran (Free Form)",
		"aliases": [
			"f90",
			"f95",
			"f03",
			"f08",
			"f18"
		],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Wn))
	},
	{
		"id": "fsharp",
		"name": "F#",
		"aliases": ["f#", "fs"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Hn))
	},
	{
		"id": "gdresource",
		"name": "GDResource",
		"aliases": ["tscn", "tres"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.zn))
	},
	{
		"id": "gdscript",
		"name": "GDScript",
		"aliases": ["gd"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Bn))
	},
	{
		"id": "gdshader",
		"name": "GDShader",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Vn))
	},
	{
		"id": "genie",
		"name": "Genie",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Rn))
	},
	{
		"id": "gherkin",
		"name": "Gherkin",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Ln))
	},
	{
		"id": "git-commit",
		"name": "Git Commit Message",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.In))
	},
	{
		"id": "git-rebase",
		"name": "Git Rebase Message",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Fn))
	},
	{
		"id": "gleam",
		"name": "Gleam",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Pn))
	},
	{
		"id": "glimmer-js",
		"name": "Glimmer JS",
		"aliases": ["gjs"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Nn))
	},
	{
		"id": "glimmer-ts",
		"name": "Glimmer TS",
		"aliases": ["gts"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Mn))
	},
	{
		"id": "glsl",
		"name": "GLSL",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Sr))
	},
	{
		"id": "gn",
		"name": "GN",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.jn))
	},
	{
		"id": "gnuplot",
		"name": "Gnuplot",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.An))
	},
	{
		"id": "go",
		"name": "Go",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.kn))
	},
	{
		"id": "graphql",
		"name": "GraphQL",
		"aliases": ["gql"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.er))
	},
	{
		"id": "groovy",
		"name": "Groovy",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.On))
	},
	{
		"id": "hack",
		"name": "Hack",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Dn))
	},
	{
		"id": "haml",
		"name": "Ruby Haml",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.nr))
	},
	{
		"id": "handlebars",
		"name": "Handlebars",
		"aliases": ["hbs"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.En))
	},
	{
		"id": "haskell",
		"name": "Haskell",
		"aliases": ["hs"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Tn))
	},
	{
		"id": "haxe",
		"name": "Haxe",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.wn))
	},
	{
		"id": "hcl",
		"name": "HashiCorp HCL",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Cn))
	},
	{
		"id": "hjson",
		"name": "Hjson",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Sn))
	},
	{
		"id": "hlsl",
		"name": "HLSL",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.xn))
	},
	{
		"id": "html",
		"name": "HTML",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.mi))
	},
	{
		"id": "html-derivative",
		"name": "HTML (Derivative)",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Hr))
	},
	{
		"id": "http",
		"name": "HTTP",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.bn))
	},
	{
		"id": "hurl",
		"name": "Hurl",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.yn))
	},
	{
		"id": "hxml",
		"name": "HXML",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.vn))
	},
	{
		"id": "hy",
		"name": "Hy",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n._n))
	},
	{
		"id": "imba",
		"name": "Imba",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.gn))
	},
	{
		"id": "ini",
		"name": "INI",
		"aliases": ["properties"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.hn))
	},
	{
		"id": "java",
		"name": "Java",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.ci))
	},
	{
		"id": "javascript",
		"name": "JavaScript",
		"aliases": [
			"js",
			"cjs",
			"mjs"
		],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.gi))
	},
	{
		"id": "jinja",
		"name": "Jinja",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.mn))
	},
	{
		"id": "jison",
		"name": "Jison",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.pn))
	},
	{
		"id": "json",
		"name": "JSON",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.oi))
	},
	{
		"id": "json5",
		"name": "JSON5",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.fn))
	},
	{
		"id": "jsonc",
		"name": "JSON with Comments",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.dn))
	},
	{
		"id": "jsonl",
		"name": "JSON Lines",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.un))
	},
	{
		"id": "jsonnet",
		"name": "Jsonnet",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.ln))
	},
	{
		"id": "jssm",
		"name": "JSSM",
		"aliases": ["fsl"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.cn))
	},
	{
		"id": "jsx",
		"name": "JSX",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.tr))
	},
	{
		"id": "julia",
		"name": "Julia",
		"aliases": ["jl"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.on))
	},
	{
		"id": "just",
		"name": "Just",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.in))
	},
	{
		"id": "kdl",
		"name": "KDL",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.rn))
	},
	{
		"id": "kotlin",
		"name": "Kotlin",
		"aliases": ["kt", "kts"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.nn))
	},
	{
		"id": "kusto",
		"name": "Kusto",
		"aliases": ["kql"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.tn))
	},
	{
		"id": "latex",
		"name": "LaTeX",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.$t))
	},
	{
		"id": "lean",
		"name": "Lean 4",
		"aliases": ["lean4"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Qt))
	},
	{
		"id": "less",
		"name": "Less",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Zt))
	},
	{
		"id": "liquid",
		"name": "Liquid",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Xt))
	},
	{
		"id": "llvm",
		"name": "LLVM IR",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Yt))
	},
	{
		"id": "log",
		"name": "Log file",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Jt))
	},
	{
		"id": "logo",
		"name": "Logo",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.qt))
	},
	{
		"id": "lua",
		"name": "Lua",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.$n))
	},
	{
		"id": "luau",
		"name": "Luau",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Kt))
	},
	{
		"id": "make",
		"name": "Makefile",
		"aliases": ["makefile"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Gt))
	},
	{
		"id": "markdown",
		"name": "Markdown",
		"aliases": ["md"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Yn))
	},
	{
		"id": "marko",
		"name": "Marko",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Wt))
	},
	{
		"id": "matlab",
		"name": "MATLAB",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Ut))
	},
	{
		"id": "mdc",
		"name": "MDC",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Ht))
	},
	{
		"id": "mdx",
		"name": "MDX",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Vt))
	},
	{
		"id": "mermaid",
		"name": "Mermaid",
		"aliases": ["mmd"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Bt))
	},
	{
		"id": "mipsasm",
		"name": "MIPS Assembly",
		"aliases": ["mips"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.zt))
	},
	{
		"id": "mojo",
		"name": "Mojo",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Rt))
	},
	{
		"id": "moonbit",
		"name": "MoonBit",
		"aliases": ["mbt", "mbti"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Lt))
	},
	{
		"id": "move",
		"name": "Move",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.It))
	},
	{
		"id": "narrat",
		"name": "Narrat Language",
		"aliases": ["nar"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Ft))
	},
	{
		"id": "nextflow",
		"name": "Nextflow",
		"aliases": ["nf"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Nt))
	},
	{
		"id": "nextflow-groovy",
		"name": "nextflow-groovy",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Pt))
	},
	{
		"id": "nginx",
		"name": "Nginx",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Mt))
	},
	{
		"id": "nim",
		"name": "Nim",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.jt))
	},
	{
		"id": "nix",
		"name": "Nix",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.At))
	},
	{
		"id": "nushell",
		"name": "nushell",
		"aliases": ["nu"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.kt))
	},
	{
		"id": "objective-c",
		"name": "Objective-C",
		"aliases": ["objc"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Ot))
	},
	{
		"id": "objective-cpp",
		"name": "Objective-C++",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Dt))
	},
	{
		"id": "ocaml",
		"name": "OCaml",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Et))
	},
	{
		"id": "odin",
		"name": "Odin",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Tt))
	},
	{
		"id": "openscad",
		"name": "OpenSCAD",
		"aliases": ["scad"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.wt))
	},
	{
		"id": "pascal",
		"name": "Pascal",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Ct))
	},
	{
		"id": "perl",
		"name": "Perl",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.an))
	},
	{
		"id": "php",
		"name": "PHP",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.St))
	},
	{
		"id": "pkl",
		"name": "Pkl",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.xt))
	},
	{
		"id": "plsql",
		"name": "PL/SQL",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.bt))
	},
	{
		"id": "po",
		"name": "Gettext PO",
		"aliases": ["pot", "potx"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.yt))
	},
	{
		"id": "polar",
		"name": "Polar",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.vt))
	},
	{
		"id": "postcss",
		"name": "PostCSS",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.$r))
	},
	{
		"id": "powerquery",
		"name": "PowerQuery",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n._t))
	},
	{
		"id": "powershell",
		"name": "PowerShell",
		"aliases": ["ps", "ps1"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.gt))
	},
	{
		"id": "prisma",
		"name": "Prisma",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.ht))
	},
	{
		"id": "prolog",
		"name": "Prolog",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.mt))
	},
	{
		"id": "proto",
		"name": "Protocol Buffer 3",
		"aliases": ["protobuf"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.pt))
	},
	{
		"id": "pug",
		"name": "Pug",
		"aliases": ["jade"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.ft))
	},
	{
		"id": "puppet",
		"name": "Puppet",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.dt))
	},
	{
		"id": "purescript",
		"name": "PureScript",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.ut))
	},
	{
		"id": "python",
		"name": "Python",
		"aliases": ["py"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Pr))
	},
	{
		"id": "qml",
		"name": "QML",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.lt))
	},
	{
		"id": "qmldir",
		"name": "QML Directory",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.ct))
	},
	{
		"id": "qss",
		"name": "Qt Style Sheets",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.st))
	},
	{
		"id": "r",
		"name": "R",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.sn))
	},
	{
		"id": "racket",
		"name": "Racket",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.ot))
	},
	{
		"id": "raku",
		"name": "Raku",
		"aliases": ["perl6"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.at))
	},
	{
		"id": "razor",
		"name": "ASP.NET Razor",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.it))
	},
	{
		"id": "reg",
		"name": "Windows Registry Script",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.rt))
	},
	{
		"id": "regexp",
		"name": "RegExp",
		"aliases": ["regex"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Cr))
	},
	{
		"id": "rel",
		"name": "Rel",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.nt))
	},
	{
		"id": "riscv",
		"name": "RISC-V",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.tt))
	},
	{
		"id": "ron",
		"name": "RON",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.et))
	},
	{
		"id": "rosmsg",
		"name": "ROS Interface",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.$))
	},
	{
		"id": "rst",
		"name": "reStructuredText",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Q))
	},
	{
		"id": "ruby",
		"name": "Ruby",
		"aliases": ["rb"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Zn))
	},
	{
		"id": "rust",
		"name": "Rust",
		"aliases": ["rs"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Z))
	},
	{
		"id": "sas",
		"name": "SAS",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.X))
	},
	{
		"id": "sass",
		"name": "Sass",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Y))
	},
	{
		"id": "scala",
		"name": "Scala",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.J))
	},
	{
		"id": "scheme",
		"name": "Scheme",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.q))
	},
	{
		"id": "scss",
		"name": "SCSS",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.fi))
	},
	{
		"id": "sdbl",
		"name": "1C (Query)",
		"aliases": ["1c-query"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.zr))
	},
	{
		"id": "shaderlab",
		"name": "ShaderLab",
		"aliases": ["shader"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.K))
	},
	{
		"id": "shellscript",
		"name": "Shell",
		"aliases": [
			"bash",
			"sh",
			"shell",
			"zsh"
		],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.br))
	},
	{
		"id": "shellsession",
		"name": "Shell Session",
		"aliases": ["console"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.G))
	},
	{
		"id": "smalltalk",
		"name": "Smalltalk",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.W))
	},
	{
		"id": "solidity",
		"name": "Solidity",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.U))
	},
	{
		"id": "soy",
		"name": "Closure Templates",
		"aliases": ["closure-templates"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.H))
	},
	{
		"id": "sparql",
		"name": "SPARQL",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.B))
	},
	{
		"id": "splunk",
		"name": "Splunk Query Language",
		"aliases": ["spl"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.z))
	},
	{
		"id": "sql",
		"name": "SQL",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Vr))
	},
	{
		"id": "ssh-config",
		"name": "SSH Config",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.R))
	},
	{
		"id": "stata",
		"name": "Stata",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.L))
	},
	{
		"id": "stylus",
		"name": "Stylus",
		"aliases": ["styl"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.I))
	},
	{
		"id": "surrealql",
		"name": "SurrealQL",
		"aliases": ["surql"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.F))
	},
	{
		"id": "svelte",
		"name": "Svelte",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.P))
	},
	{
		"id": "swift",
		"name": "Swift",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.N))
	},
	{
		"id": "system-verilog",
		"name": "SystemVerilog",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.M))
	},
	{
		"id": "systemd",
		"name": "Systemd Units",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.j))
	},
	{
		"id": "talonscript",
		"name": "TalonScript",
		"aliases": ["talon"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.A))
	},
	{
		"id": "tasl",
		"name": "Tasl",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.k))
	},
	{
		"id": "tcl",
		"name": "Tcl",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.O))
	},
	{
		"id": "templ",
		"name": "Templ",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.D))
	},
	{
		"id": "terraform",
		"name": "Terraform",
		"aliases": ["tf", "tfvars"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.E))
	},
	{
		"id": "tex",
		"name": "TeX",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.en))
	},
	{
		"id": "toml",
		"name": "TOML",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.T))
	},
	{
		"id": "ts-tags",
		"name": "TypeScript with Tags",
		"aliases": ["lit"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.w))
	},
	{
		"id": "tsv",
		"name": "TSV",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.C))
	},
	{
		"id": "tsx",
		"name": "TSX",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Qr))
	},
	{
		"id": "turtle",
		"name": "Turtle",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.V))
	},
	{
		"id": "twig",
		"name": "Twig",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.S))
	},
	{
		"id": "typescript",
		"name": "TypeScript",
		"aliases": [
			"ts",
			"cts",
			"mts"
		],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.ei))
	},
	{
		"id": "typespec",
		"name": "TypeSpec",
		"aliases": ["tsp"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.x))
	},
	{
		"id": "typst",
		"name": "Typst",
		"aliases": ["typ"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.b))
	},
	{
		"id": "v",
		"name": "V",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.y))
	},
	{
		"id": "vala",
		"name": "Vala",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.v))
	},
	{
		"id": "vb",
		"name": "Visual Basic",
		"aliases": ["cmd"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n._))
	},
	{
		"id": "verilog",
		"name": "Verilog",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.g))
	},
	{
		"id": "vhdl",
		"name": "VHDL",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.h))
	},
	{
		"id": "viml",
		"name": "Vim Script",
		"aliases": ["vim", "vimscript"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.m))
	},
	{
		"id": "vue",
		"name": "Vue",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.d))
	},
	{
		"id": "vue-html",
		"name": "Vue HTML",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.p))
	},
	{
		"id": "vue-vine",
		"name": "Vue Vine",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.f))
	},
	{
		"id": "vyper",
		"name": "Vyper",
		"aliases": ["vy"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.u))
	},
	{
		"id": "wasm",
		"name": "WebAssembly",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.l))
	},
	{
		"id": "wenyan",
		"name": "Wenyan",
		"aliases": ["文言"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.c))
	},
	{
		"id": "wgsl",
		"name": "WGSL",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.s))
	},
	{
		"id": "wikitext",
		"name": "Wikitext",
		"aliases": ["mediawiki", "wiki"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.o))
	},
	{
		"id": "wit",
		"name": "WebAssembly Interface Types",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.a))
	},
	{
		"id": "wolfram",
		"name": "Wolfram",
		"aliases": ["wl"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.i))
	},
	{
		"id": "xml",
		"name": "XML",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.si))
	},
	{
		"id": "xsl",
		"name": "XSL",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.r))
	},
	{
		"id": "yaml",
		"name": "YAML",
		"aliases": ["yml"],
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.Qn))
	},
	{
		"id": "zenscript",
		"name": "ZenScript",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.n))
	},
	{
		"id": "zig",
		"name": "Zig",
		"import": (() => import("./shikijs__langs.mjs").then((n) => n.t))
	}
];
var bundledLanguagesBase = Object.fromEntries(bundledLanguagesInfo.map((i) => [i.id, i.import]));
var bundledLanguagesAlias = Object.fromEntries(bundledLanguagesInfo.flatMap((i) => i.aliases?.map((a) => [a, i.import]) || []));
var bundledLanguages = {
	...bundledLanguagesBase,
	...bundledLanguagesAlias
};
var bundledThemes = Object.fromEntries([
	{
		"id": "andromeeda",
		"displayName": "Andromeeda",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.dt))
	},
	{
		"id": "aurora-x",
		"displayName": "Aurora X",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.ut))
	},
	{
		"id": "ayu-dark",
		"displayName": "Ayu Dark",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.lt))
	},
	{
		"id": "ayu-light",
		"displayName": "Ayu Light",
		"type": "light",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.ct))
	},
	{
		"id": "ayu-mirage",
		"displayName": "Ayu Mirage",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.st))
	},
	{
		"id": "catppuccin-frappe",
		"displayName": "Catppuccin Frappé",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.ot))
	},
	{
		"id": "catppuccin-latte",
		"displayName": "Catppuccin Latte",
		"type": "light",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.at))
	},
	{
		"id": "catppuccin-macchiato",
		"displayName": "Catppuccin Macchiato",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.it))
	},
	{
		"id": "catppuccin-mocha",
		"displayName": "Catppuccin Mocha",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.rt))
	},
	{
		"id": "dark-plus",
		"displayName": "Dark Plus",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.nt))
	},
	{
		"id": "dracula",
		"displayName": "Dracula Theme",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.et))
	},
	{
		"id": "dracula-soft",
		"displayName": "Dracula Theme Soft",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.tt))
	},
	{
		"id": "everforest-dark",
		"displayName": "Everforest Dark",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.$))
	},
	{
		"id": "everforest-light",
		"displayName": "Everforest Light",
		"type": "light",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.Q))
	},
	{
		"id": "github-dark",
		"displayName": "GitHub Dark",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.J))
	},
	{
		"id": "github-dark-default",
		"displayName": "GitHub Dark Default",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.Z))
	},
	{
		"id": "github-dark-dimmed",
		"displayName": "GitHub Dark Dimmed",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.X))
	},
	{
		"id": "github-dark-high-contrast",
		"displayName": "GitHub Dark High Contrast",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.Y))
	},
	{
		"id": "github-light",
		"displayName": "GitHub Light",
		"type": "light",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.G))
	},
	{
		"id": "github-light-default",
		"displayName": "GitHub Light Default",
		"type": "light",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.q))
	},
	{
		"id": "github-light-high-contrast",
		"displayName": "GitHub Light High Contrast",
		"type": "light",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.K))
	},
	{
		"id": "gruvbox-dark-hard",
		"displayName": "Gruvbox Dark Hard",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.W))
	},
	{
		"id": "gruvbox-dark-medium",
		"displayName": "Gruvbox Dark Medium",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.U))
	},
	{
		"id": "gruvbox-dark-soft",
		"displayName": "Gruvbox Dark Soft",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.H))
	},
	{
		"id": "gruvbox-light-hard",
		"displayName": "Gruvbox Light Hard",
		"type": "light",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.V))
	},
	{
		"id": "gruvbox-light-medium",
		"displayName": "Gruvbox Light Medium",
		"type": "light",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.B))
	},
	{
		"id": "gruvbox-light-soft",
		"displayName": "Gruvbox Light Soft",
		"type": "light",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.z))
	},
	{
		"id": "horizon",
		"displayName": "Horizon",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.L))
	},
	{
		"id": "horizon-bright",
		"displayName": "Horizon Bright",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.R))
	},
	{
		"id": "houston",
		"displayName": "Houston",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.I))
	},
	{
		"id": "kanagawa-dragon",
		"displayName": "Kanagawa Dragon",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.F))
	},
	{
		"id": "kanagawa-lotus",
		"displayName": "Kanagawa Lotus",
		"type": "light",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.P))
	},
	{
		"id": "kanagawa-wave",
		"displayName": "Kanagawa Wave",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.N))
	},
	{
		"id": "laserwave",
		"displayName": "LaserWave",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.M))
	},
	{
		"id": "light-plus",
		"displayName": "Light Plus",
		"type": "light",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.j))
	},
	{
		"id": "material-theme",
		"displayName": "Material Theme",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.E))
	},
	{
		"id": "material-theme-darker",
		"displayName": "Material Theme Darker",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.A))
	},
	{
		"id": "material-theme-lighter",
		"displayName": "Material Theme Lighter",
		"type": "light",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.k))
	},
	{
		"id": "material-theme-ocean",
		"displayName": "Material Theme Ocean",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.O))
	},
	{
		"id": "material-theme-palenight",
		"displayName": "Material Theme Palenight",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.D))
	},
	{
		"id": "min-dark",
		"displayName": "Min Dark",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.T))
	},
	{
		"id": "min-light",
		"displayName": "Min Light",
		"type": "light",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.w))
	},
	{
		"id": "monokai",
		"displayName": "Monokai",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.C))
	},
	{
		"id": "night-owl",
		"displayName": "Night Owl",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.x))
	},
	{
		"id": "night-owl-light",
		"displayName": "Night Owl Light",
		"type": "light",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.S))
	},
	{
		"id": "nord",
		"displayName": "Nord",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.b))
	},
	{
		"id": "one-dark-pro",
		"displayName": "One Dark Pro",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.y))
	},
	{
		"id": "one-light",
		"displayName": "One Light",
		"type": "light",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.v))
	},
	{
		"id": "plastic",
		"displayName": "Plastic",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n._))
	},
	{
		"id": "poimandres",
		"displayName": "Poimandres",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.g))
	},
	{
		"id": "red",
		"displayName": "Red",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.h))
	},
	{
		"id": "rose-pine",
		"displayName": "Rosé Pine",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.f))
	},
	{
		"id": "rose-pine-dawn",
		"displayName": "Rosé Pine Dawn",
		"type": "light",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.m))
	},
	{
		"id": "rose-pine-moon",
		"displayName": "Rosé Pine Moon",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.p))
	},
	{
		"id": "slack-dark",
		"displayName": "Slack Dark",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.d))
	},
	{
		"id": "slack-ochin",
		"displayName": "Slack Ochin",
		"type": "light",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.u))
	},
	{
		"id": "snazzy-light",
		"displayName": "Snazzy Light",
		"type": "light",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.l))
	},
	{
		"id": "solarized-dark",
		"displayName": "Solarized Dark",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.c))
	},
	{
		"id": "solarized-light",
		"displayName": "Solarized Light",
		"type": "light",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.s))
	},
	{
		"id": "synthwave-84",
		"displayName": "Synthwave '84",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.o))
	},
	{
		"id": "tokyo-night",
		"displayName": "Tokyo Night",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.a))
	},
	{
		"id": "vesper",
		"displayName": "Vesper",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.i))
	},
	{
		"id": "vitesse-black",
		"displayName": "Vitesse Black",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.r))
	},
	{
		"id": "vitesse-dark",
		"displayName": "Vitesse Dark",
		"type": "dark",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.n))
	},
	{
		"id": "vitesse-light",
		"displayName": "Vitesse Light",
		"type": "light",
		"import": (() => import("./shikijs__themes.mjs").then((n) => n.t))
	}
].map((i) => [i.id, i.import]));
//#endregion
//#region node_modules/shiki/dist/bundle-full.mjs
var createHighlighter = /* @__PURE__ */ createBundledHighlighter({
	langs: bundledLanguages,
	themes: bundledThemes,
	engine: () => createOnigurumaEngine(import("./shiki.mjs").then((n) => n.t))
});
var { codeToHtml, codeToHast, codeToTokens, codeToTokensBase, codeToTokensWithThemes, getSingletonHighlighter, getLastGrammarState } = /* @__PURE__ */ createSingletonShorthands(createHighlighter, { guessEmbeddedLanguages });
//#endregion
//#region node_modules/@streamdown/code/dist/index.js
var S = createJavaScriptRegexEngine({ forgiving: true });
var C = Object.fromEntries(bundledLanguagesInfo.flatMap((e) => {
	var n;
	return ((n = e.aliases) != null ? n : []).map((t) => [t, e.id]);
}));
var r = new Set(Object.keys(bundledLanguages));
var B = (e) => {
	let t = e.trim().toLowerCase();
	return C[t] || (r.has(t), t);
};
var c = /* @__PURE__ */ new Map();
var p = /* @__PURE__ */ new Map();
var s = /* @__PURE__ */ new Map();
var o = (e) => {
	var n;
	return typeof e == "string" ? e : (n = e.name) != null ? n : "custom";
};
var v = (e, n) => `${e}-${o(n[0])}-${o(n[1])}`;
var x = (e, n, t) => {
	let g = e.slice(0, 100), u = e.length > 100 ? e.slice(-100) : "";
	return `${n}:${t[0]}:${t[1]}:${e.length}:${g}:${u}`;
};
var P = (e, n) => {
	let t = v(e, n);
	if (c.has(t)) return c.get(t);
	let g = createHighlighter({
		themes: n,
		langs: [e],
		engine: S
	});
	return c.set(t, g), g;
};
function $(e = {}) {
	var t;
	let n = (t = e.themes) != null ? t : ["github-light", "github-dark"];
	return {
		name: "shiki",
		type: "code-highlighter",
		supportsLanguage(g) {
			let u = B(g);
			return r.has(u);
		},
		getSupportedLanguages() {
			return Array.from(r);
		},
		getThemes() {
			return n;
		},
		highlight({ code: g, language: u, themes: h }, m) {
			let i = B(u), d = [o(h[0]), o(h[1])], a = x(g, i, d);
			if (p.has(a)) return p.get(a);
			m && (s.has(a) || s.set(a, /* @__PURE__ */ new Set()), s.get(a).add(m));
			return P(r.has(i) ? i : "text", h).then((l) => {
				let y = l.getLoadedLanguages().includes(i) ? i : "text", L = l.codeToTokens(g, {
					lang: y,
					themes: {
						light: d[0],
						dark: d[1]
					}
				});
				p.set(a, L);
				let T = s.get(a);
				if (T) {
					for (let H of T) H(L);
					s.delete(a);
				}
			}).catch((l) => {
				console.error("[Streamdown Code] Failed to highlight code:", l), s.delete(a);
			}), null;
		}
	};
}
var G = $();
//#endregion
export { G as t };
