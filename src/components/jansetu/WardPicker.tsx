import { useMemo, useState } from "react";
import { Crosshair, Locate, MapPin } from "lucide-react";
import { GRID_COLS, GRID_ROWS, type Ward } from "@/lib/jansetu";

type Props = {
  wards: Ward[];
  pin: { x: number; y: number } | null;
  onPin: (value: { x: number; y: number; wardId: string; lat: number; lng: number }) => void;
};

const W = 400;
const H = 300;

/** Colour a ward tile by how strained its infrastructure is (vibrant = needs attention). */
function tintFor(infra: number) {
  if (infra >= 7.5) return "var(--cat-electricity)";
  if (infra >= 6) return "var(--cat-roads)";
  if (infra >= 4.5) return "var(--nav-report)";
  return "var(--cat-sanitation)";
}

/**
 * Map-first location picker: citizens tap (or drag) anywhere on the city map to
 * drop a pin at the exact spot. The pin resolves to a ward plus precise
 * latitude/longitude — no need to know or type any place name.
 */
export function WardPicker({ wards, pin, onPin }: Props) {
  const cellW = W / GRID_COLS;
  const cellH = H / GRID_ROWS;
  const [dragging, setDragging] = useState(false);

  const byCell = useMemo(() => {
    const map = new Map<string, Ward>();
    for (const ward of wards) map.set(`${ward.grid_x},${ward.grid_y}`, ward);
    return map;
  }, [wards]);

  const activeWard = pin
    ? byCell.get(
        `${Math.min(GRID_COLS - 1, Math.floor(pin.x / cellW))},${Math.min(GRID_ROWS - 1, Math.floor(pin.y / cellH))}`,
      )
    : undefined;

  const coords = pin && activeWard ? resolve(pin.x, pin.y) : null;

  function resolve(x: number, y: number) {
    const gx = Math.min(GRID_COLS - 1, Math.max(0, Math.floor(x / cellW)));
    const gy = Math.min(GRID_ROWS - 1, Math.max(0, Math.floor(y / cellH)));
    const ward = byCell.get(`${gx},${gy}`);
    if (!ward) return null;
    const offsetX = (x - (gx + 0.5) * cellW) / cellW;
    const offsetY = (y - (gy + 0.5) * cellH) / cellH;
    return {
      ward,
      lat: Number((ward.lat + offsetY * 0.008).toFixed(6)),
      lng: Number((ward.lng + offsetX * 0.008).toFixed(6)),
    };
  }

  function pinAt(x: number, y: number) {
    const clampedX = Math.min(W, Math.max(0, x));
    const clampedY = Math.min(H, Math.max(0, y));
    const hit = resolve(clampedX, clampedY);
    if (!hit) return;
    onPin({ x: clampedX, y: clampedY, wardId: hit.ward.id, lat: hit.lat, lng: hit.lng });
  }

  function fromEvent(event: React.PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    pinAt(((event.clientX - rect.left) / rect.width) * W, ((event.clientY - rect.top) / rect.height) * H);
  }

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-border-strong bg-surface-2/60 p-1.5">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          onPointerDown={(event) => {
            setDragging(true);
            event.currentTarget.setPointerCapture(event.pointerId);
            fromEvent(event);
          }}
          onPointerMove={(event) => {
            if (dragging) fromEvent(event);
          }}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
          className="w-full touch-none cursor-crosshair select-none"
          role="img"
          aria-label="City map. Tap or drag anywhere to drop a pin at the exact problem location."
        >
          {/* map base */}
          <rect x={0} y={0} width={W} height={H} fill="var(--surface)" />
          {Array.from({ length: Math.ceil(W / 20) }).map((_, i) => (
            <line
              key={`v${i}`}
              x1={i * 20}
              y1={0}
              x2={i * 20}
              y2={H}
              stroke="var(--border)"
              strokeOpacity={0.5}
            />
          ))}
          {Array.from({ length: Math.ceil(H / 20) }).map((_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={i * 20}
              x2={W}
              y2={i * 20}
              stroke="var(--border)"
              strokeOpacity={0.5}
            />
          ))}
          {/* arterial roads + river for map legibility */}
          <path d={`M0 ${H * 0.55} L${W} ${H * 0.42}`} stroke="var(--cat-roads)" strokeWidth={5} strokeOpacity={0.35} />
          <path d={`M${W * 0.34} 0 L${W * 0.44} ${H}`} stroke="var(--cat-roads)" strokeWidth={4} strokeOpacity={0.28} />
          <path
            d={`M0 ${H * 0.86} C ${W * 0.3} ${H * 0.7}, ${W * 0.6} ${H * 0.98}, ${W} ${H * 0.78}`}
            stroke="var(--cat-water)"
            strokeWidth={7}
            strokeOpacity={0.35}
            fill="none"
          />

          {/* ward zones */}
          {Array.from({ length: GRID_ROWS }).map((_, gy) =>
            Array.from({ length: GRID_COLS }).map((_, gx) => {
              const ward = byCell.get(`${gx},${gy}`);
              const isActive = !!ward && activeWard?.id === ward.id;
              const tint = ward ? tintFor(ward.infra_score) : "var(--border)";
              return (
                <g key={`${gx}-${gy}`}>
                  <rect
                    x={gx * cellW + 3}
                    y={gy * cellH + 3}
                    width={cellW - 6}
                    height={cellH - 6}
                    rx={12}
                    fill={tint}
                    fillOpacity={isActive ? 0.24 : 0.08}
                    stroke={tint}
                    strokeOpacity={isActive ? 1 : 0.4}
                    strokeWidth={isActive ? 2.4 : 1}
                    strokeDasharray={isActive ? undefined : "4 3"}
                  />
                  <text
                    x={gx * cellW + 12}
                    y={gy * cellH + 22}
                    fontSize="10.5"
                    fontWeight={isActive ? 700 : 500}
                    fill="var(--foreground)"
                    opacity={isActive ? 1 : 0.72}
                  >
                    {ward?.name ?? ""}
                  </text>
                </g>
              );
            }),
          )}

          {pin && (
            <g>
              <circle cx={pin.x} cy={pin.y} r={16} fill="var(--nav-report)" fillOpacity={0.18} />
              <circle cx={pin.x} cy={pin.y} r={9} fill="var(--nav-report)" fillOpacity={0.35} />
              <circle cx={pin.x} cy={pin.y} r={4} fill="var(--nav-report)" />
              <line x1={pin.x} y1={0} x2={pin.x} y2={H} stroke="var(--nav-report)" strokeOpacity={0.25} />
              <line x1={0} y1={pin.y} x2={W} y2={pin.y} stroke="var(--nav-report)" strokeOpacity={0.25} />
            </g>
          )}
        </svg>

        <span className="label-mono absolute right-3 bottom-3 rounded-md bg-surface/90 px-2 py-1">
          tap or drag to move the pin
        </span>
      </div>

      <div
        className="tint-surface flex items-start gap-3 rounded-xl p-3 text-sm"
        style={{ ["--tint" as string]: activeWard ? tintFor(activeWard.infra_score) : "var(--nav-track)" }}
      >
        {pin ? <Crosshair className="mt-0.5 size-4 shrink-0" strokeWidth={2.3} /> : <Locate className="mt-0.5 size-4 shrink-0" strokeWidth={2.2} />}
        {activeWard && coords ? (
          <div>
            <p className="flex flex-wrap items-center gap-x-2">
              <MapPin className="size-3.5" strokeWidth={2.5} />
              <span className="font-semibold">{activeWard.name}</span>
              <span className="text-muted-foreground">
                · {activeWard.population.toLocaleString("en-IN")} residents · infra{" "}
                {Number(activeWard.infra_score).toFixed(1)}/10
              </span>
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              pinned at {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Tap the exact spot on the map — the road, the corner, the block. We work out the ward and
            coordinates for you.
          </p>
        )}
      </div>
    </div>
  );
}
