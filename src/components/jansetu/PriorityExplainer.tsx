import { useState } from "react";
import { Calculator, RotateCcw } from "lucide-react";
import { URGENCY_WEIGHT, priorityScore, severityLabel } from "@/lib/jansetu";

const URGENCY_LABEL: Record<number, string> = {
  1: "Minor",
  2: "Low",
  3: "Moderate",
  4: "High",
  5: "Critical",
};

const DEFAULTS = { volume: 6, urgency: 4, population: 42000, infra: 5.4 };

function Slider({
  label,
  value,
  min,
  max,
  step,
  hint,
  tint,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  hint: string;
  tint: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block" style={{ ["--tint" as string]: tint }}>
      <span className="flex items-baseline justify-between">
        <span className="label-mono">{label}</span>
        <span className="font-mono text-sm font-semibold tabular-nums text-[var(--tint)]">{hint}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-2 accent-[var(--tint)]"
      />
    </label>
  );
}

/**
 * Interactive walk-through of the Priority Score formula so citizens and
 * officials can see exactly how a ward earns its ranking.
 */
export function PriorityExplainer() {
  const [volume, setVolume] = useState(DEFAULTS.volume);
  const [urgency, setUrgency] = useState(DEFAULTS.urgency);
  const [population, setPopulation] = useState(DEFAULTS.population);
  const [infra, setInfra] = useState(DEFAULTS.infra);

  const weight = URGENCY_WEIGHT[urgency] ?? 1;
  const demandTerm = Math.round(volume * weight * 10) / 10;
  const strainTerm = Math.round((population / 1000 / infra) * 10) / 10;
  const score = priorityScore({ volume, avgUrgency: urgency, peopleAffected: population, infraScore: infra });
  const demandShare = Math.round((demandTerm / Math.max(demandTerm + strainTerm, 0.1)) * 100);

  return (
    <section className="sheet-ruled overflow-hidden rounded-2xl">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <p className="label-mono flex items-center gap-2">
            <Calculator className="size-3.5" /> Priority Score — try it yourself
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Move the sliders to see how a ward climbs the queue.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setVolume(DEFAULTS.volume);
            setUrgency(DEFAULTS.urgency);
            setPopulation(DEFAULTS.population);
            setInfra(DEFAULTS.infra);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-2"
        >
          <RotateCcw className="size-3" /> Reset example
        </button>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-5">
          <Slider
            label="Reports from this ward"
            value={volume}
            min={1}
            max={40}
            step={1}
            hint={`${volume} reports`}
            tint="var(--nav-report)"
            onChange={setVolume}
          />
          <Slider
            label="Average urgency"
            value={urgency}
            min={1}
            max={5}
            step={1}
            hint={`${URGENCY_LABEL[urgency]} · weight ${weight}`}
            tint="var(--cat-roads)"
            onChange={setUrgency}
          />
          <Slider
            label="Residents affected"
            value={population}
            min={2000}
            max={200000}
            step={1000}
            hint={population.toLocaleString("en-IN")}
            tint="var(--cat-water)"
            onChange={setPopulation}
          />
          <Slider
            label="Infrastructure score (10 = strong)"
            value={infra}
            min={1}
            max={10}
            step={0.1}
            hint={`${infra.toFixed(1)} / 10`}
            tint="var(--nav-track)"
            onChange={setInfra}
          />
        </div>

        <div className="space-y-3">
          <div
            className="tint-surface rounded-xl p-4"
            style={{ ["--tint" as string]: "var(--nav-data)" }}
          >
            <p className="label-mono text-[var(--tint)]">Priority score</p>
            <p className="font-display text-5xl font-semibold tabular-nums text-[var(--tint)]">
              {score.toFixed(1)}
            </p>
            <p className="mt-1 text-sm font-medium">{severityLabel(score)} priority</p>
          </div>

          <div className="sheet rounded-xl p-4 font-mono text-xs leading-relaxed">
            <p className="text-muted-foreground">score = (reports × urgency weight) + (residents ÷ 1000 ÷ infra)</p>
            <p className="mt-2">
              = ({volume} × {weight}) + ({population.toLocaleString("en-IN")} ÷ 1000 ÷ {infra.toFixed(1)})
            </p>
            <p>
              = <span style={{ color: "var(--nav-report)" }}>{demandTerm}</span> +{" "}
              <span style={{ color: "var(--cat-water)" }}>{strainTerm}</span> ={" "}
              <span className="font-bold">{score.toFixed(1)}</span>
            </p>
          </div>

          <div className="sheet rounded-xl p-4">
            <p className="label-mono">What is driving the score</p>
            <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-surface-2">
              <div style={{ width: `${demandShare}%`, background: "var(--nav-report)" }} />
              <div style={{ width: `${100 - demandShare}%`, background: "var(--cat-water)" }} />
            </div>
            <div className="mt-2 flex justify-between text-xs">
              <span style={{ color: "var(--nav-report)" }}>Citizen demand {demandShare}%</span>
              <span style={{ color: "var(--cat-water)" }}>Infrastructure strain {100 - demandShare}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
