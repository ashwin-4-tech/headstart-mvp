import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Loader2, Plus, Trash2, Pencil, Search, ChevronLeft, ChevronRight, ArrowLeft, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import {
  MANAGED_TABLES, type ManagedTable,
  getAll, createRecord, updateRecord, deleteRecord,
} from "@/services/db";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "My data — HeadStart" },
      { name: "description", content: "Browse, edit and delete your saved data." },
    ],
  }),
  component: AdminPage,
});

// Per-table editable column hints (everything else is shown read-only or hidden)
const COLUMN_CONFIG: Record<ManagedTable, {
  display: string[];           // columns shown in table
  editable: string[];          // columns editable in the form
  searchColumn?: string;       // column used for search
  label: string;
}> = {
  startup_ideas: {
    label: "Startup ideas",
    display: ["raw_text_input", "target_city_tier", "b2b_or_b2c", "created_at"],
    editable: ["raw_text_input", "target_city_tier", "b2b_or_b2c"],
    searchColumn: "raw_text_input",
  },
  generated_reports: {
    label: "Generated reports",
    display: ["idea_id", "generated_at", "created_at"],
    editable: [],
    searchColumn: "idea_id",
  },
  profiles: {
    label: "Profile",
    display: ["name", "email", "industry_focus", "preferred_language", "budget_range"],
    editable: ["name", "industry_focus", "preferred_language", "budget_range"],
    searchColumn: "name",
  },
  user_roles: {
    label: "Roles",
    display: ["role", "created_at"],
    editable: [],
  },
};

function AdminPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [user, authLoading, navigate]);

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-muted/20">
      <Toaster richColors />
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
              <Database className="h-7 w-7 text-teal" /> My data
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse, edit and delete records across your tables.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard"><ArrowLeft className="mr-1.5 h-4 w-4" /> Back to dashboard</Link>
          </Button>
        </div>

        <Tabs defaultValue={MANAGED_TABLES[0]}>
          <TabsList className="flex w-full flex-wrap">
            {MANAGED_TABLES.map((t) => (
              <TabsTrigger key={t} value={t} className="flex-1">
                {COLUMN_CONFIG[t].label}
              </TabsTrigger>
            ))}
          </TabsList>
          {MANAGED_TABLES.map((t) => (
            <TabsContent key={t} value={t} className="mt-6">
              <TableManager table={t} />
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}

type Row = Record<string, unknown> & { id: string };

function TableManager({ table }: { table: ManagedTable }) {
  const cfg = COLUMN_CONFIG[table];
  const [rows, setRows] = useState<Row[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAll<Row>(table, {
        page, pageSize,
        search: search || undefined,
        searchColumn: cfg.searchColumn,
      });
      setRows(res.rows);
      setCount(res.count);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [table, page, search, cfg.searchColumn]);

  useEffect(() => { refresh(); }, [refresh]);

  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const canCreate = cfg.editable.length > 0 && table === "startup_ideas";

  return (
    <Card className="shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-lg">{cfg.label} <span className="ml-2 text-sm font-normal text-muted-foreground">({count})</span></CardTitle>
        <div className="flex items-center gap-2">
          {cfg.searchColumn && (
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder={`Search ${cfg.searchColumn}…`}
                className="w-56 pl-8"
              />
            </div>
          )}
          {canCreate && (
            <Button size="sm" onClick={() => setCreating(true)}>
              <Plus className="mr-1.5 h-4 w-4" /> New
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">No records yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {cfg.display.map((c) => <TableHead key={c}>{c}</TableHead>)}
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {cfg.display.map((c) => (
                    <TableCell key={c} className="max-w-xs truncate">
                      {formatCell(row[c])}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    {cfg.editable.length > 0 && (
                      <Button variant="ghost" size="icon" onClick={() => setEditing(row)} aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(row.id)} aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Edit dialog */}
      <RecordFormDialog
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        title={`Edit ${cfg.label}`}
        editable={cfg.editable}
        initial={editing ?? undefined}
        onSubmit={async (values) => {
          if (!editing) return;
          await updateRecord(table, editing.id, values);
          toast.success("Updated");
          setEditing(null);
          refresh();
        }}
      />

      {/* Create dialog (only for startup_ideas) */}
      {canCreate && (
        <RecordFormDialog
          open={creating}
          onOpenChange={setCreating}
          title={`New ${cfg.label}`}
          editable={cfg.editable}
          onSubmit={async (values) => {
            // user_id is required by RLS — get it from session
            const { supabase } = await import("@/integrations/supabase/client");
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not signed in");
            await createRecord(table, { ...values, user_id: user.id });
            toast.success("Created");
            setCreating(false);
            refresh();
          }}
        />
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!deleteId) return;
                try {
                  await deleteRecord(table, deleteId);
                  toast.success("Deleted");
                  setDeleteId(null);
                  refresh();
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Delete failed");
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

function formatCell(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "string") {
    if (/^\d{4}-\d{2}-\d{2}T/.test(v)) return new Date(v).toLocaleString();
    return v.length > 80 ? v.slice(0, 80) + "…" : v;
  }
  if (typeof v === "object") return JSON.stringify(v).slice(0, 80);
  return String(v);
}

function RecordFormDialog({
  open, onOpenChange, title, editable, initial, onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  editable: string[];
  initial?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    const initVals: Record<string, string> = {};
    editable.forEach((k) => { initVals[k] = String(initial?.[k] ?? ""); });
    setValues(initVals);
  }, [open, initial, editable]);

  const fields = useMemo(() => editable, [editable]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Update the fields below and save.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f} className="space-y-1.5">
              <Label htmlFor={f}>{f}</Label>
              {f === "raw_text_input" ? (
                <Textarea
                  id={f} rows={4}
                  value={values[f] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f]: e.target.value }))}
                />
              ) : (
                <Input
                  id={f}
                  value={values[f] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f]: e.target.value }))}
                />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button>
          <Button
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await onSubmit(values);
              } catch (e) {
                toast.error(e instanceof Error ? e.message : "Save failed");
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
