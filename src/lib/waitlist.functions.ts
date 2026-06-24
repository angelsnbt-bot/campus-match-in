import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const LOOKING_FOR_OPTIONS = [
  "Friends",
  "Dating",
  "Study Partners",
  "Sports Partners",
  "Hackathon Team",
  "Competition Team",
  "Event Buddies",
] as const;

const submitSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(160),
  erp_number: z.string().trim().min(1).max(40),
  college: z.string().trim().min(2).max(160),
  branch: z.string().trim().min(1).max(80),
  year: z.string().trim().min(1).max(20),
  instagram: z.string().trim().max(60).optional().or(z.literal("")),
  looking_for: z.array(z.enum(LOOKING_FOR_OPTIONS)).min(1).max(7),
  confirm: z.literal(true),
});

export const submitWaitlist = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => submitSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("waitlist_users").insert({
      name: data.name,
      email: data.email,
      erp_number: data.erp_number,
      college: data.college,
      branch: data.branch,
      year: data.year,
      instagram: data.instagram || null,
      looking_for: data.looking_for,
    });
    if (error) {
      if (error.code === "23505") {
        const dupField = error.message.toLowerCase().includes("erp") ? "ERP Number" : "Email";
        throw new Error(`This ${dupField} is already on the waitlist.`);
      }
      throw new Error("Could not join waitlist. Please try again.");
    }
    return { ok: true as const };
  });

export const getWaitlistCount = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count, error } = await supabaseAdmin
    .from("waitlist_users")
    .select("*", { count: "exact", head: true });
  if (error) return { count: 0, colleges: 0 };
  const { data: colleges } = await supabaseAdmin
    .from("waitlist_users")
    .select("college");
  const uniqueColleges = new Set((colleges ?? []).map((r) => r.college.trim().toLowerCase())).size;
  return { count: count ?? 0, colleges: uniqueColleges };
});

const adminListSchema = z.object({ token: z.string().min(1) });

export const getWaitlistAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => adminListSchema.parse(input))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_TOKEN;
    if (!expected || data.token !== expected) {
      throw new Error("Invalid admin token");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("waitlist_users")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Failed to load waitlist");
    return { rows: rows ?? [] };
  });
