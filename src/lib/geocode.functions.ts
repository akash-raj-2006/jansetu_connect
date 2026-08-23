import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ReverseInput = z.object({ lat: z.number(), lng: z.number() });
const SearchInput = z.object({ query: z.string().min(2).max(160) });

const UA = "JanSetu civic reporting prototype (https://lovable.dev)";

/** Turn coordinates into a human-readable Indian street address. */
export const reverseGeocode = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ReverseInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&addressdetails=1&lat=${data.lat}&lon=${data.lng}`;
      const response = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
      if (!response.ok) return { ok: false as const, error: `Lookup failed (${response.status})` };
      const body = (await response.json()) as { display_name?: string };
      return { ok: true as const, address: body.display_name ?? "" };
    } catch (error) {
      console.error("reverse geocode failed", error);
      return { ok: false as const, error: "Address lookup is unavailable right now." };
    }
  });

/** Address / area autocomplete restricted to India. */
export const searchPlaces = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SearchInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=in&limit=6&q=${encodeURIComponent(
        data.query,
      )}`;
      const response = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
      if (!response.ok) return { ok: false as const, error: `Search failed (${response.status})` };
      const body = (await response.json()) as { display_name: string; lat: string; lon: string }[];
      return {
        ok: true as const,
        results: body.map((item) => ({
          address: item.display_name,
          lat: Number(item.lat),
          lng: Number(item.lon),
        })),
      };
    } catch (error) {
      console.error("place search failed", error);
      return { ok: false as const, error: "Address search is unavailable right now." };
    }
  });
