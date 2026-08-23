import { createFileRoute, redirect } from "@tanstack/react-router";

// Official sign-in lives at /admin/login (no self-signup). Keep the old URL working.
export const Route = createFileRoute("/auth")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/login" });
  },
});
