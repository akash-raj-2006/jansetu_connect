import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, LocateFixed, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { reverseGeocode, searchPlaces } from "@/lib/geocode.functions";
import { nearestWard, type Ward } from "@/lib/jansetu";

export type PickedLocation = {
  lat: number;
  lng: number;
  address: string;
  wardId: string;
};

type Props = {
  wards: Ward[];
  value: PickedLocation | null;
  onChange: (value: PickedLocation) => void;
};

const pinIcon = L.divIcon({
  className: "",
  html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#e2492b;border:2px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,.35)"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
});

function ClickCatcher({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (event) => onPick(event.latlng.lat, event.latlng.lng) });
  return null;
}

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], Math.max(map.getZoom(), 15), { animate: true });
  }, [lat, lng, map]);
  return null;
}

/**
 * Real tile map (OpenStreetMap) with a draggable pin, address search and
 * browser geolocation. Every pin move is reverse-geocoded so the citizen can
 * confirm the exact street address before submitting.
 */
export function LocationMap({ wards, value, onChange }: Props) {
  const reverse = useServerFn(reverseGeocode);
  const search = useServerFn(searchPlaces);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ address: string; lat: number; lng: number }[]>([]);
  const [searching, setSearching] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [locating, setLocating] = useState(false);
  const seq = useRef(0);

  const center = useMemo<[number, number]>(() => {
    if (value) return [value.lat, value.lng];
    const first = wards[0];
    return first ? [first.lat, first.lng] : [18.5204, 73.8567];
  }, [value, wards]);

  async function place(lat: number, lng: number, knownAddress?: string) {
    const wardId = nearestWard(wards, lat, lng)?.id ?? wards[0]?.id ?? "";
    const rounded = { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
    onChange({ ...rounded, wardId, address: knownAddress ?? "" });
    if (knownAddress) return;
    const ticket = (seq.current += 1);
    setResolving(true);
    try {
      const response = await reverse({ data: rounded });
      if (ticket !== seq.current) return;
      if (response.ok) onChange({ ...rounded, wardId, address: response.address });
      else toast.error(response.error);
    } finally {
      if (ticket === seq.current) setResolving(false);
    }
  }

  async function onSearch() {
    if (query.trim().length < 3) {
      toast.error("Type at least 3 characters of an address or area.");
      return;
    }
    setSearching(true);
    try {
      const response = await search({ data: { query: query.trim() } });
      if (!response.ok) {
        toast.error(response.error);
        return;
      }
      setResults(response.results);
      if (response.results.length === 0) toast.error("No matching place in India.");
    } finally {
      setSearching(false);
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      toast.error("Your browser does not support location access.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        void place(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setLocating(false);
        toast.error("Location permission denied — tap the map instead.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void onSearch();
              }
            }}
            placeholder="Search address, area or landmark"
            className="pl-9"
          />
        </div>
        <Button type="button" variant="secondary" onClick={() => void onSearch()} disabled={searching}>
          {searching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          Search
        </Button>
        <Button type="button" variant="outline" onClick={useMyLocation} disabled={locating}>
          {locating ? <Loader2 className="size-4 animate-spin" /> : <LocateFixed className="size-4" />}
          Use my location
        </Button>
      </div>

      {results.length > 0 && (
        <ul className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-border bg-surface-2/60 p-2 text-sm">
          {results.map((item) => (
            <li key={`${item.lat},${item.lng}`}>
              <button
                type="button"
                className="w-full rounded-lg px-2 py-1.5 text-left hover:bg-secondary"
                onClick={() => {
                  setResults([]);
                  setQuery("");
                  void place(item.lat, item.lng, item.address);
                }}
              >
                {item.address}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="overflow-hidden rounded-2xl border border-border-strong">
        <MapContainer
          center={center}
          zoom={value ? 16 : 12}
          scrollWheelZoom
          style={{ height: 340, width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickCatcher onPick={(lat, lng) => void place(lat, lng)} />
          {value && (
            <>
              <Recenter lat={value.lat} lng={value.lng} />
              <Marker
                position={[value.lat, value.lng]}
                icon={pinIcon}
                draggable
                eventHandlers={{
                  dragend: (event) => {
                    const { lat, lng } = event.target.getLatLng();
                    void place(lat, lng);
                  },
                }}
              />
            </>
          )}
        </MapContainer>
      </div>

      <div className="tint-surface flex items-start gap-3 rounded-xl p-3 text-sm" style={{ ["--tint" as string]: "var(--nav-report)" }}>
        <MapPin className="mt-0.5 size-4 shrink-0" strokeWidth={2.4} />
        {value ? (
          <div>
            <p className="font-medium">
              {resolving ? "Confirming address…" : value.address || "Address not found — coordinates saved"}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {value.lat.toFixed(5)}, {value.lng.toFixed(5)} · ward{" "}
              {wards.find((w) => w.id === value.wardId)?.name ?? value.wardId}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Tap the map, drag the pin, search an address, or use your current location. We confirm the
            street address for you.
          </p>
        )}
      </div>
    </div>
  );
}

export default LocationMap;
