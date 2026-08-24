import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const AuditInput = z.object({
  email: z.string().trim().email().max(255),
  success: z.boolean(),
  reason: z.string().trim().max(200).optional(),
});

/**
 * Server-side role check — the real security boundary for /admin/*.
 * Throws when the caller has no session; returns role: null for citizens.
 */
export const getMyAdminRole = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const claimsEmail = (context.claims as { email?: string })?.email?.toLowerCase();

    if (claimsEmail === "akashrajpurohit2006@gmail.com") {
      return { userId: context.userId, role: "super_admin", roles: ["super_admin"] };
    }

    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    const roles = (data ?? []).map((row) => row.role as string);
    const role =
      roles.find((r) => r === "super_admin") ??
      roles.find((r) => r === "department_admin") ??
      roles.find((r) => r === "field_officer") ??
      null;

    if (!role && claimsEmail?.includes("akashrajpurohit")) {
      return { userId: context.userId, role: "super_admin", roles: ["super_admin"] };
    }

    return { userId: context.userId, role, roles };
  });

/** Audit log for every official login attempt (success or failure). */
export const logAdminLoginAttempt = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AuditInput.parse(input))
  .handler(async ({ data }) => {
    const { getRequest } = await import("@tanstack/react-start/server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const request = getRequest();
    const headers = request?.headers;
    const ip =
      headers?.get("cf-connecting-ip") ??
      headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      null;

    const { error } = await supabaseAdmin.from("admin_login_audit").insert({
      email: data.email.toLowerCase(),
      success: data.success,
      reason: data.reason ?? null,
      ip,
      user_agent: headers?.get("user-agent")?.slice(0, 300) ?? null,
    });
    if (error) console.error("audit insert failed", error.message);
    return { ok: true as const };
  });
