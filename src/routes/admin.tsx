import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2, Download, ShieldCheck, Users, GraduationCap, Sparkles } from "lucide-react";

import { getWaitlistAdmin } from "@/lib/waitlist.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "CampusMatch — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Row = {
  id: string; name: string; email: string; erp_number: string; college: string;
  branch: string; year: string; instagram: string | null;
  looking_for: string[]; account_created: boolean; created_at: string;
};

function AdminPage() {
  const fetchList = useServerFn(getWaitlistAdmin);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Row[] | null>(null);

  async function loadList(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await fetchList({ data: { token } });
      setRows(res.rows as Row[]);
      toast.success(`Loaded ${res.rows.length} waitlist users`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function exportCSV() {
    if (!rows) return;
    const headers = ["name","email","erp_number","college","branch","year","instagram","looking_for","account_created","created_at"];
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        headers.map((h) => {
          const v = (r as Record<string, unknown>)[h];
          const s = Array.isArray(v) ? v.join("; ") : v == null ? "" : String(v);
          return `"${s.replace(/"/g, '""')}"`;
        }).join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `waitlist-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  if (!rows) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <form onSubmit={loadList} className="glass w-full max-w-sm space-y-4 rounded-3xl p-8">
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <ShieldCheck className="h-5 w-5 text-pink" /> Admin Access
          </div>
          <Label>Admin token</Label>
          <Input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter ADMIN_TOKEN"
            autoFocus
          />
          <Button type="submit" disabled={loading || !token} className="h-11 w-full rounded-full bg-gradient-brand font-semibold shadow-glow">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Enter dashboard"}
          </Button>
          <p className="text-xs text-muted-foreground">Set in Lovable Cloud secrets as <code>ADMIN_TOKEN</code>.</p>
        </form>
      </div>
    );
  }

  const totals = rows.length;
  const byBranch = groupCount(rows.map((r) => r.branch));
  const byYear = groupCount(rows.map((r) => r.year));
  const byInterest = rows
    .flatMap((r) => r.looking_for)
    .reduce<Record<string, number>>((acc, k) => ((acc[k] = (acc[k] ?? 0) + 1), acc), {});

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Waitlist Dashboard</h1>
          <p className="text-sm text-muted-foreground">CampusMatch · pre-launch</p>
        </div>
        <Button onClick={exportCSV} className="rounded-full bg-gradient-brand font-semibold shadow-glow">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={Users} label="Total waitlist users" value={totals} />
        <Stat icon={GraduationCap} label="Unique colleges" value={new Set(rows.map((r) => r.college.toLowerCase().trim())).size} />
        <Stat icon={Sparkles} label="Dating interest" value={`${Math.round((byInterest["Dating"] ?? 0) / Math.max(totals, 1) * 100)}%`} />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Distribution title="By branch" data={byBranch} />
        <Distribution title="By year" data={byYear} />
        <Distribution title="Looking for" data={byInterest} />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border glass">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background/40 text-left text-xs uppercase text-muted-foreground">
              <tr>{["Name","Email","ERP","College","Branch","Year","Looking For","Joined"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.erp_number}</td>
                  <td className="px-4 py-3">{r.college}</td>
                  <td className="px-4 py-3">{r.branch}</td>
                  <td className="px-4 py-3">{r.year}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{r.looking_for.join(", ")}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        <Icon className="h-4 w-4 text-pink" /> {label}
      </div>
      <div className="mt-2 font-display text-3xl font-bold">{value}</div>
    </div>
  );
}

function Distribution({ title, data }: { title: string; data: Record<string, number> }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map(([, v]) => v), 1);
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="mb-3 font-semibold">{title}</h3>
      {entries.length === 0 && <p className="text-sm text-muted-foreground">No data yet.</p>}
      <ul className="space-y-2">
        {entries.map(([k, v]) => (
          <li key={k}>
            <div className="mb-1 flex justify-between text-xs"><span className="truncate pr-2">{k}</span><span className="text-muted-foreground">{v}</span></div>
            <div className="h-1.5 overflow-hidden rounded-full bg-background/60">
              <div className="h-full bg-gradient-brand" style={{ width: `${(v / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function groupCount(arr: string[]) {
  return arr.reduce<Record<string, number>>((acc, v) => ((acc[v] = (acc[v] ?? 0) + 1), acc), {});
}
