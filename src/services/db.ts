// Generic data access layer over Supabase.
// All operations respect RLS — they run as the signed-in user.
import { supabase } from "@/integrations/supabase/client";

// Whitelist of tables exposed to the admin UI (prevents typos / unsafe access)
export const MANAGED_TABLES = [
  "profiles",
  "startup_ideas",
  "generated_reports",
  "user_roles",
] as const;
export type ManagedTable = (typeof MANAGED_TABLES)[number];

export interface ListOptions {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  ascending?: boolean;
  search?: string;
  searchColumn?: string;
}

export interface ListResult<T = Record<string, unknown>> {
  rows: T[];
  count: number;
  page: number;
  pageSize: number;
}

const log = (op: string, table: string, extra?: unknown) =>
  console.debug(`[db] ${op} → ${table}`, extra ?? "");

export async function getAll<T = Record<string, unknown>>(
  table: ManagedTable,
  opts: ListOptions = {},
): Promise<ListResult<T>> {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(100, opts.pageSize ?? 20);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let q = supabase.from(table).select("*", { count: "exact" });
  if (opts.search && opts.searchColumn) {
    q = q.ilike(opts.searchColumn, `%${opts.search}%`);
  }
  if (opts.orderBy) {
    q = q.order(opts.orderBy, { ascending: opts.ascending ?? false });
  } else {
    q = q.order("created_at", { ascending: false });
  }
  q = q.range(from, to);

  const { data, error, count } = await q;
  log("getAll", table, { page, pageSize, count });
  if (error) throw error;
  return { rows: (data ?? []) as T[], count: count ?? 0, page, pageSize };
}

export async function getById<T = Record<string, unknown>>(
  table: ManagedTable,
  id: string,
): Promise<T | null> {
  const { data, error } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
  log("getById", table, id);
  if (error) throw error;
  return (data as T) ?? null;
}

export async function createRecord<T = Record<string, unknown>>(
  table: ManagedTable,
  values: Partial<T>,
): Promise<T> {
  const { data, error } = await supabase.from(table).insert(values as never).select().single();
  log("createRecord", table);
  if (error) throw error;
  return data as T;
}

export async function updateRecord<T = Record<string, unknown>>(
  table: ManagedTable,
  id: string,
  values: Partial<T>,
): Promise<T> {
  const { data, error } = await supabase
    .from(table)
    .update(values as never)
    .eq("id", id)
    .select()
    .single();
  log("updateRecord", table, id);
  if (error) throw error;
  return data as T;
}

export async function deleteRecord(table: ManagedTable, id: string): Promise<void> {
  const { error } = await supabase.from(table).delete().eq("id", id);
  log("deleteRecord", table, id);
  if (error) throw error;
}

// ---- Domain helpers ----

export async function saveIdeaWithReport(
  userId: string,
  idea: { raw_text_input: string; target_city_tier: string; b2b_or_b2c: string },
  report: Record<string, unknown>,
) {
  const { data: ideaRow, error: ideaErr } = await supabase
    .from("startup_ideas")
    .insert({ ...idea, user_id: userId })
    .select()
    .single();
  if (ideaErr) throw ideaErr;

  const { error: repErr } = await supabase.from("generated_reports").insert({
    idea_id: ideaRow.id,
    user_id: userId,
    market_data: report.market_data ?? {},
    competitors: report.competitors ?? [],
    swadeshi_stack: report.swadeshi_stack ?? [],
    product: report.product ?? {},
    brand: report.brand ?? {},
    data: report.data ?? {},
    content: report.content ?? {},
  });
  if (repErr) throw repErr;
  return ideaRow.id as string;
}
