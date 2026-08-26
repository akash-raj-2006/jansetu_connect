import { Br as atan2, Fr as array_default, Gr as min, Ir as withPath, Jr as sqrt, Kr as pi, Lr as abs, Mr as x, Nr as y, Pr as linear_default, Rr as acos, Ur as halfPi, Vr as cos, Wr as max, Xr as constant_default, Yr as tau, jr as line_default, qr as sin, zr as asin } from "./@streamdown/mermaid+[...].mjs";
//#region node_modules/d3-shape/src/arc.js
function arcInnerRadius(d) {
	return d.innerRadius;
}
function arcOuterRadius(d) {
	return d.outerRadius;
}
function arcStartAngle(d) {
	return d.startAngle;
}
function arcEndAngle(d) {
	return d.endAngle;
}
function arcPadAngle(d) {
	return d && d.padAngle;
}
function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
	var x10 = x1 - x0, y10 = y1 - y0, x32 = x3 - x2, y32 = y3 - y2, t = y32 * x10 - x32 * y10;
	if (t * t < 1e-12) return;
	t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / t;
	return [x0 + t * x10, y0 + t * y10];
}
function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
	var x01 = x0 - x1, y01 = y0 - y1, lo = (cw ? rc : -rc) / sqrt(x01 * x01 + y01 * y01), ox = lo * y01, oy = -lo * x01, x11 = x0 + ox, y11 = y0 + oy, x10 = x1 + ox, y10 = y1 + oy, x00 = (x11 + x10) / 2, y00 = (y11 + y10) / 2, dx = x10 - x11, dy = y10 - y11, d2 = dx * dx + dy * dy, r = r1 - rc, D = x11 * y10 - x10 * y11, d = (dy < 0 ? -1 : 1) * sqrt(max(0, r * r * d2 - D * D)), cx0 = (D * dy - dx * d) / d2, cy0 = (-D * dx - dy * d) / d2, cx1 = (D * dy + dx * d) / d2, cy1 = (-D * dx + dy * d) / d2, dx0 = cx0 - x00, dy0 = cy0 - y00, dx1 = cx1 - x00, dy1 = cy1 - y00;
	if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;
	return {
		cx: cx0,
		cy: cy0,
		x01: -ox,
		y01: -oy,
		x11: cx0 * (r1 / r - 1),
		y11: cy0 * (r1 / r - 1)
	};
}
function arc_default() {
	var innerRadius = arcInnerRadius, outerRadius = arcOuterRadius, cornerRadius = constant_default(0), padRadius = null, startAngle = arcStartAngle, endAngle = arcEndAngle, padAngle = arcPadAngle, context = null, path = withPath(arc);
	function arc() {
		var buffer, r, r0 = +innerRadius.apply(this, arguments), r1 = +outerRadius.apply(this, arguments), a0 = startAngle.apply(this, arguments) - halfPi, a1 = endAngle.apply(this, arguments) - halfPi, da = abs(a1 - a0), cw = a1 > a0;
		if (!context) context = buffer = path();
		if (r1 < r0) r = r1, r1 = r0, r0 = r;
		if (!(r1 > 1e-12)) context.moveTo(0, 0);
		else if (da > tau - 1e-12) {
			context.moveTo(r1 * cos(a0), r1 * sin(a0));
			context.arc(0, 0, r1, a0, a1, !cw);
			if (r0 > 1e-12) {
				context.moveTo(r0 * cos(a1), r0 * sin(a1));
				context.arc(0, 0, r0, a1, a0, cw);
			}
		} else {
			var a01 = a0, a11 = a1, a00 = a0, a10 = a1, da0 = da, da1 = da, ap = padAngle.apply(this, arguments) / 2, rp = ap > 1e-12 && (padRadius ? +padRadius.apply(this, arguments) : sqrt(r0 * r0 + r1 * r1)), rc = min(abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments)), rc0 = rc, rc1 = rc, t0, t1;
			if (rp > 1e-12) {
				var p0 = asin(rp / r0 * sin(ap)), p1 = asin(rp / r1 * sin(ap));
				if ((da0 -= p0 * 2) > 1e-12) p0 *= cw ? 1 : -1, a00 += p0, a10 -= p0;
				else da0 = 0, a00 = a10 = (a0 + a1) / 2;
				if ((da1 -= p1 * 2) > 1e-12) p1 *= cw ? 1 : -1, a01 += p1, a11 -= p1;
				else da1 = 0, a01 = a11 = (a0 + a1) / 2;
			}
			var x01 = r1 * cos(a01), y01 = r1 * sin(a01), x10 = r0 * cos(a10), y10 = r0 * sin(a10);
			if (rc > 1e-12) {
				var x11 = r1 * cos(a11), y11 = r1 * sin(a11), x00 = r0 * cos(a00), y00 = r0 * sin(a00), oc;
				if (da < pi) if (oc = intersect(x01, y01, x00, y00, x11, y11, x10, y10)) {
					var ax = x01 - oc[0], ay = y01 - oc[1], bx = x11 - oc[0], by = y11 - oc[1], kc = 1 / sin(acos((ax * bx + ay * by) / (sqrt(ax * ax + ay * ay) * sqrt(bx * bx + by * by))) / 2), lc = sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
					rc0 = min(rc, (r0 - lc) / (kc - 1));
					rc1 = min(rc, (r1 - lc) / (kc + 1));
				} else rc0 = rc1 = 0;
			}
			if (!(da1 > 1e-12)) context.moveTo(x01, y01);
			else if (rc1 > 1e-12) {
				t0 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
				t1 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);
				context.moveTo(t0.cx + t0.x01, t0.cy + t0.y01);
				if (rc1 < rc) context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);
				else {
					context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
					context.arc(0, 0, r1, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), !cw);
					context.arc(t1.cx, t1.cy, rc1, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
				}
			} else context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw);
			if (!(r0 > 1e-12) || !(da0 > 1e-12)) context.lineTo(x10, y10);
			else if (rc0 > 1e-12) {
				t0 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
				t1 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);
				context.lineTo(t0.cx + t0.x01, t0.cy + t0.y01);
				if (rc0 < rc) context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);
				else {
					context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
					context.arc(0, 0, r0, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), cw);
					context.arc(t1.cx, t1.cy, rc0, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
				}
			} else context.arc(0, 0, r0, a10, a00, cw);
		}
		context.closePath();
		if (buffer) return context = null, buffer + "" || null;
	}
	arc.centroid = function() {
		var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2, a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi / 2;
		return [cos(a) * r, sin(a) * r];
	};
	arc.innerRadius = function(_) {
		return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant_default(+_), arc) : innerRadius;
	};
	arc.outerRadius = function(_) {
		return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant_default(+_), arc) : outerRadius;
	};
	arc.cornerRadius = function(_) {
		return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant_default(+_), arc) : cornerRadius;
	};
	arc.padRadius = function(_) {
		return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant_default(+_), arc) : padRadius;
	};
	arc.startAngle = function(_) {
		return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant_default(+_), arc) : startAngle;
	};
	arc.endAngle = function(_) {
		return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant_default(+_), arc) : endAngle;
	};
	arc.padAngle = function(_) {
		return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant_default(+_), arc) : padAngle;
	};
	arc.context = function(_) {
		return arguments.length ? (context = _ == null ? null : _, arc) : context;
	};
	return arc;
}
//#endregion
//#region node_modules/d3-shape/src/area.js
function area_default(x0, y0, y1) {
	var x1 = null, defined = constant_default(true), context = null, curve = linear_default, output = null, path = withPath(area);
	x0 = typeof x0 === "function" ? x0 : x0 === void 0 ? x : constant_default(+x0);
	y0 = typeof y0 === "function" ? y0 : y0 === void 0 ? constant_default(0) : constant_default(+y0);
	y1 = typeof y1 === "function" ? y1 : y1 === void 0 ? y : constant_default(+y1);
	function area(data) {
		var i, j, k, n = (data = array_default(data)).length, d, defined0 = false, buffer, x0z = new Array(n), y0z = new Array(n);
		if (context == null) output = curve(buffer = path());
		for (i = 0; i <= n; ++i) {
			if (!(i < n && defined(d = data[i], i, data)) === defined0) if (defined0 = !defined0) {
				j = i;
				output.areaStart();
				output.lineStart();
			} else {
				output.lineEnd();
				output.lineStart();
				for (k = i - 1; k >= j; --k) output.point(x0z[k], y0z[k]);
				output.lineEnd();
				output.areaEnd();
			}
			if (defined0) {
				x0z[i] = +x0(d, i, data), y0z[i] = +y0(d, i, data);
				output.point(x1 ? +x1(d, i, data) : x0z[i], y1 ? +y1(d, i, data) : y0z[i]);
			}
		}
		if (buffer) return output = null, buffer + "" || null;
	}
	function arealine() {
		return line_default().defined(defined).curve(curve).context(context);
	}
	area.x = function(_) {
		return arguments.length ? (x0 = typeof _ === "function" ? _ : constant_default(+_), x1 = null, area) : x0;
	};
	area.x0 = function(_) {
		return arguments.length ? (x0 = typeof _ === "function" ? _ : constant_default(+_), area) : x0;
	};
	area.x1 = function(_) {
		return arguments.length ? (x1 = _ == null ? null : typeof _ === "function" ? _ : constant_default(+_), area) : x1;
	};
	area.y = function(_) {
		return arguments.length ? (y0 = typeof _ === "function" ? _ : constant_default(+_), y1 = null, area) : y0;
	};
	area.y0 = function(_) {
		return arguments.length ? (y0 = typeof _ === "function" ? _ : constant_default(+_), area) : y0;
	};
	area.y1 = function(_) {
		return arguments.length ? (y1 = _ == null ? null : typeof _ === "function" ? _ : constant_default(+_), area) : y1;
	};
	area.lineX0 = area.lineY0 = function() {
		return arealine().x(x0).y(y0);
	};
	area.lineY1 = function() {
		return arealine().x(x0).y(y1);
	};
	area.lineX1 = function() {
		return arealine().x(x1).y(y0);
	};
	area.defined = function(_) {
		return arguments.length ? (defined = typeof _ === "function" ? _ : constant_default(!!_), area) : defined;
	};
	area.curve = function(_) {
		return arguments.length ? (curve = _, context != null && (output = curve(context)), area) : curve;
	};
	area.context = function(_) {
		return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), area) : context;
	};
	return area;
}
//#endregion
//#region node_modules/d3-shape/src/descending.js
function descending_default(a, b) {
	return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}
//#endregion
//#region node_modules/d3-shape/src/identity.js
function identity_default(d) {
	return d;
}
//#endregion
//#region node_modules/d3-shape/src/pie.js
function pie_default() {
	var value = identity_default, sortValues = descending_default, sort = null, startAngle = constant_default(0), endAngle = constant_default(tau), padAngle = constant_default(0);
	function pie(data) {
		var i, n = (data = array_default(data)).length, j, k, sum = 0, index = new Array(n), arcs = new Array(n), a0 = +startAngle.apply(this, arguments), da = Math.min(tau, Math.max(-tau, endAngle.apply(this, arguments) - a0)), a1, p = Math.min(Math.abs(da) / n, padAngle.apply(this, arguments)), pa = p * (da < 0 ? -1 : 1), v;
		for (i = 0; i < n; ++i) if ((v = arcs[index[i] = i] = +value(data[i], i, data)) > 0) sum += v;
		if (sortValues != null) index.sort(function(i, j) {
			return sortValues(arcs[i], arcs[j]);
		});
		else if (sort != null) index.sort(function(i, j) {
			return sort(data[i], data[j]);
		});
		for (i = 0, k = sum ? (da - n * pa) / sum : 0; i < n; ++i, a0 = a1) j = index[i], v = arcs[j], a1 = a0 + (v > 0 ? v * k : 0) + pa, arcs[j] = {
			data: data[j],
			index: i,
			value: v,
			startAngle: a0,
			endAngle: a1,
			padAngle: p
		};
		return arcs;
	}
	pie.value = function(_) {
		return arguments.length ? (value = typeof _ === "function" ? _ : constant_default(+_), pie) : value;
	};
	pie.sortValues = function(_) {
		return arguments.length ? (sortValues = _, sort = null, pie) : sortValues;
	};
	pie.sort = function(_) {
		return arguments.length ? (sort = _, sortValues = null, pie) : sort;
	};
	pie.startAngle = function(_) {
		return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant_default(+_), pie) : startAngle;
	};
	pie.endAngle = function(_) {
		return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant_default(+_), pie) : endAngle;
	};
	pie.padAngle = function(_) {
		return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant_default(+_), pie) : padAngle;
	};
	return pie;
}
//#endregion
//#region node_modules/d3-shape/src/symbol/circle.js
var circle_default = { draw(context, size) {
	const r = sqrt(size / pi);
	context.moveTo(r, 0);
	context.arc(0, 0, r, 0, tau);
} };
//#endregion
//#region node_modules/d3-shape/src/symbol/cross.js
var cross_default = { draw(context, size) {
	const r = sqrt(size / 5) / 2;
	context.moveTo(-3 * r, -r);
	context.lineTo(-r, -r);
	context.lineTo(-r, -3 * r);
	context.lineTo(r, -3 * r);
	context.lineTo(r, -r);
	context.lineTo(3 * r, -r);
	context.lineTo(3 * r, r);
	context.lineTo(r, r);
	context.lineTo(r, 3 * r);
	context.lineTo(-r, 3 * r);
	context.lineTo(-r, r);
	context.lineTo(-3 * r, r);
	context.closePath();
} };
//#endregion
//#region node_modules/d3-shape/src/symbol/diamond.js
var tan30 = sqrt(1 / 3);
var tan30_2 = tan30 * 2;
var diamond_default = { draw(context, size) {
	const y = sqrt(size / tan30_2);
	const x = y * tan30;
	context.moveTo(0, -y);
	context.lineTo(x, 0);
	context.lineTo(0, y);
	context.lineTo(-x, 0);
	context.closePath();
} };
//#endregion
//#region node_modules/d3-shape/src/symbol/square.js
var square_default = { draw(context, size) {
	const w = sqrt(size);
	const x = -w / 2;
	context.rect(x, x, w, w);
} };
//#endregion
//#region node_modules/d3-shape/src/symbol/star.js
var ka = .8908130915292852;
var kr = sin(pi / 10) / sin(7 * pi / 10);
var kx = sin(tau / 10) * kr;
var ky = -cos(tau / 10) * kr;
var star_default = { draw(context, size) {
	const r = sqrt(size * ka);
	const x = kx * r;
	const y = ky * r;
	context.moveTo(0, -r);
	context.lineTo(x, y);
	for (let i = 1; i < 5; ++i) {
		const a = tau * i / 5;
		const c = cos(a);
		const s = sin(a);
		context.lineTo(s * r, -c * r);
		context.lineTo(c * x - s * y, s * x + c * y);
	}
	context.closePath();
} };
//#endregion
//#region node_modules/d3-shape/src/symbol/triangle.js
var sqrt3 = sqrt(3);
var triangle_default = { draw(context, size) {
	const y = -sqrt(size / (sqrt3 * 3));
	context.moveTo(0, y * 2);
	context.lineTo(-sqrt3 * y, -y);
	context.lineTo(sqrt3 * y, -y);
	context.closePath();
} };
//#endregion
//#region node_modules/d3-shape/src/symbol/wye.js
var c = -.5;
var s = sqrt(3) / 2;
var k = 1 / sqrt(12);
var a = (k / 2 + 1) * 3;
var wye_default = { draw(context, size) {
	const r = sqrt(size / a);
	const x0 = r / 2, y0 = r * k;
	const x1 = x0, y1 = r * k + r;
	const x2 = -x1, y2 = y1;
	context.moveTo(x0, y0);
	context.lineTo(x1, y1);
	context.lineTo(x2, y2);
	context.lineTo(c * x0 - s * y0, s * x0 + c * y0);
	context.lineTo(c * x1 - s * y1, s * x1 + c * y1);
	context.lineTo(c * x2 - s * y2, s * x2 + c * y2);
	context.lineTo(c * x0 + s * y0, c * y0 - s * x0);
	context.lineTo(c * x1 + s * y1, c * y1 - s * x1);
	context.lineTo(c * x2 + s * y2, c * y2 - s * x2);
	context.closePath();
} };
//#endregion
//#region node_modules/d3-shape/src/symbol.js
function Symbol(type, size) {
	let context = null, path = withPath(symbol);
	type = typeof type === "function" ? type : constant_default(type || circle_default);
	size = typeof size === "function" ? size : constant_default(size === void 0 ? 64 : +size);
	function symbol() {
		let buffer;
		if (!context) context = buffer = path();
		type.apply(this, arguments).draw(context, +size.apply(this, arguments));
		if (buffer) return context = null, buffer + "" || null;
	}
	symbol.type = function(_) {
		return arguments.length ? (type = typeof _ === "function" ? _ : constant_default(_), symbol) : type;
	};
	symbol.size = function(_) {
		return arguments.length ? (size = typeof _ === "function" ? _ : constant_default(+_), symbol) : size;
	};
	symbol.context = function(_) {
		return arguments.length ? (context = _ == null ? null : _, symbol) : context;
	};
	return symbol;
}
//#endregion
//#region node_modules/d3-shape/src/offset/none.js
function none_default$1(series, order) {
	if (!((n = series.length) > 1)) return;
	for (var i = 1, j, s0, s1 = series[order[0]], n, m = s1.length; i < n; ++i) {
		s0 = s1, s1 = series[order[i]];
		for (j = 0; j < m; ++j) s1[j][1] += s1[j][0] = isNaN(s0[j][1]) ? s0[j][0] : s0[j][1];
	}
}
//#endregion
//#region node_modules/d3-shape/src/order/none.js
function none_default(series) {
	var n = series.length, o = new Array(n);
	while (--n >= 0) o[n] = n;
	return o;
}
//#endregion
//#region node_modules/d3-shape/src/stack.js
function stackValue(d, key) {
	return d[key];
}
function stackSeries(key) {
	const series = [];
	series.key = key;
	return series;
}
function stack_default() {
	var keys = constant_default([]), order = none_default, offset = none_default$1, value = stackValue;
	function stack(data) {
		var sz = Array.from(keys.apply(this, arguments), stackSeries), i, n = sz.length, j = -1, oz;
		for (const d of data) for (i = 0, ++j; i < n; ++i) (sz[i][j] = [0, +value(d, sz[i].key, j, data)]).data = d;
		for (i = 0, oz = array_default(order(sz)); i < n; ++i) sz[oz[i]].index = i;
		offset(sz, oz);
		return sz;
	}
	stack.keys = function(_) {
		return arguments.length ? (keys = typeof _ === "function" ? _ : constant_default(Array.from(_)), stack) : keys;
	};
	stack.value = function(_) {
		return arguments.length ? (value = typeof _ === "function" ? _ : constant_default(+_), stack) : value;
	};
	stack.order = function(_) {
		return arguments.length ? (order = _ == null ? none_default : typeof _ === "function" ? _ : constant_default(Array.from(_)), stack) : order;
	};
	stack.offset = function(_) {
		return arguments.length ? (offset = _ == null ? none_default$1 : _, stack) : offset;
	};
	return stack;
}
//#endregion
//#region node_modules/d3-shape/src/offset/expand.js
function expand_default(series, order) {
	if (!((n = series.length) > 0)) return;
	for (var i, n, j = 0, m = series[0].length, y; j < m; ++j) {
		for (y = i = 0; i < n; ++i) y += series[i][j][1] || 0;
		if (y) for (i = 0; i < n; ++i) series[i][j][1] /= y;
	}
	none_default$1(series, order);
}
//#endregion
//#region node_modules/d3-shape/src/offset/silhouette.js
function silhouette_default(series, order) {
	if (!((n = series.length) > 0)) return;
	for (var j = 0, s0 = series[order[0]], n, m = s0.length; j < m; ++j) {
		for (var i = 0, y = 0; i < n; ++i) y += series[i][j][1] || 0;
		s0[j][1] += s0[j][0] = -y / 2;
	}
	none_default$1(series, order);
}
//#endregion
//#region node_modules/d3-shape/src/offset/wiggle.js
function wiggle_default(series, order) {
	if (!((n = series.length) > 0) || !((m = (s0 = series[order[0]]).length) > 0)) return;
	for (var y = 0, j = 1, s0, m, n; j < m; ++j) {
		for (var i = 0, s1 = 0, s2 = 0; i < n; ++i) {
			var si = series[order[i]], sij0 = si[j][1] || 0, s3 = (sij0 - (si[j - 1][1] || 0)) / 2;
			for (var k = 0; k < i; ++k) {
				var sk = series[order[k]], skj0 = sk[j][1] || 0, skj1 = sk[j - 1][1] || 0;
				s3 += skj0 - skj1;
			}
			s1 += sij0, s2 += s3 * sij0;
		}
		s0[j - 1][1] += s0[j - 1][0] = y;
		if (s1) y -= s2 / s1;
	}
	s0[j - 1][1] += s0[j - 1][0] = y;
	none_default$1(series, order);
}
//#endregion
export { arc_default as _, none_default as a, wye_default as c, square_default as d, diamond_default as f, area_default as g, pie_default as h, stack_default as i, triangle_default as l, circle_default as m, silhouette_default as n, none_default$1 as o, cross_default as p, expand_default as r, Symbol as s, wiggle_default as t, star_default as u };
