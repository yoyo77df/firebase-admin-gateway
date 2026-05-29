import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/site/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Upload } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Panel — RED EYES" }] }),
  component: AdminPage,
});

async function uploadMedia(file: File): Promise<string> {
  const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

function FileUpload({ value, onChange, label }: { value?: string | null; onChange: (url: string) => void; label?: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-3">
        {value && <img src={value} alt="" className="w-14 h-14 object-cover rounded-md glow-ring" />}
        <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-md glass hover:border-[var(--neon)] text-sm">
          <Upload className="w-4 h-4" /> {busy ? "Uploading…" : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0]; if (!f) return;
              setBusy(true);
              try { onChange(await uploadMedia(f)); toast.success("Uploaded"); }
              catch (err) { toast.error((err as Error).message); }
              finally { setBusy(false); }
            }}
          />
        </label>
        {value && <Input value={value} onChange={(e) => onChange(e.target.value)} className="flex-1" />}
      </div>
    </div>
  );
}

function AdminPage() {
  const { user, isModerator, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) nav({ to: "/auth/login" });
    else if (!isModerator) nav({ to: "/" });
  }, [user, isModerator, loading, nav]);

  if (loading || !user || !isModerator) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Checking access…</div>;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="font-display font-black text-4xl text-gradient">Admin Control</h1>
            <p className="text-sm text-muted-foreground">Manage everything that appears on the site.</p>
          </div>
          <Link to="/" className="text-sm text-[var(--neon)] hover:underline">← Back to site</Link>
        </div>

        <Tabs defaultValue="site" className="w-full">
          <TabsList className="flex flex-wrap h-auto glass p-1.5">
            {["site","players","management","matches","achievements","highlights","gallery","news","socials","users"].map(t => (
              <TabsTrigger key={t} value={t} className="capitalize">{t === "socials" ? "Team Socials" : t}</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="site"><SiteEditor /></TabsContent>
          <TabsContent value="players"><CrudTable table="players" titleField="ign" fields={playerFields} /></TabsContent>
          <TabsContent value="management"><CrudTable table="management" titleField="name" fields={managementFields} /></TabsContent>
          <TabsContent value="matches"><CrudTable table="matches" titleField="tournament" fields={matchFields} /></TabsContent>
          <TabsContent value="achievements"><CrudTable table="achievements" titleField="title" fields={achievementFields} /></TabsContent>
          <TabsContent value="highlights"><CrudTable table="highlights" titleField="title" fields={highlightFields} /></TabsContent>
          <TabsContent value="gallery"><CrudTable table="gallery_items" titleField="title" fields={galleryFields} /></TabsContent>
          <TabsContent value="news"><CrudTable table="news_posts" titleField="title" fields={newsFields} /></TabsContent>
          <TabsContent value="socials"><CrudTable table="social_links" titleField="platform" fields={socialFields} /></TabsContent>
          <TabsContent value="users"><UsersEditor /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}




function SocialsEditor({ value, onChange }: { value: Record<string, string>; onChange: (v: Record<string, string>) => void }) {
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const entries = Object.entries(value || {});
  const add = () => {
    const p = platform.trim().toLowerCase();
    if (!p || !url.trim()) return;
    onChange({ ...(value || {}), [p]: url.trim() });
    setPlatform(""); setUrl("");
  };
  const remove = (k: string) => {
    const next = { ...(value || {}) };
    delete next[k];
    onChange(next);
  };
  return (
    <div className="space-y-2">
      <div className="space-y-1.5">
        {entries.length === 0 && <p className="text-xs text-muted-foreground">No social links yet.</p>}
        {entries.map(([k, v]) => (
          <div key={k} className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[var(--neon)] w-24 truncate">{k}</span>
            <Input value={v} onChange={(e) => onChange({ ...value, [k]: e.target.value })} className="flex-1" />
            <Button type="button" size="sm" variant="ghost" onClick={() => remove(k)}><Trash2 className="w-4 h-4" /></Button>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 pt-2 border-t border-border/40">
        <Input placeholder="Platform (facebook, instagram, …)" value={platform} onChange={(e) => setPlatform(e.target.value)} className="flex-1 min-w-[180px]" />
        <Input placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} className="flex-[2] min-w-[220px]" />
        <Button type="button" onClick={add}>Add</Button>
      </div>
    </div>
  );
}

function SiteEditor() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin_site"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("key", "main").maybeSingle();
      return data;
    },
  });
  const [form, setForm] = useState<Record<string, unknown>>({});
  useEffect(() => { if (data) setForm(data); }, [data]);
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    const { error } = await supabase.from("site_settings").update({
      site_title: form.site_title, tagline: form.tagline, hero_subtitle: form.hero_subtitle,
      hero_cta_label: form.hero_cta_label, hero_cta_url: form.hero_cta_url,
      logo_url: form.logo_url, hero_bg_url: form.hero_bg_url,
      dashboard_bg_url: form.dashboard_bg_url,
      next_match_team_a: form.next_match_team_a,
      next_match_tournament: form.next_match_tournament,
      next_match_at: form.next_match_at || null,
      theme_accent: form.theme_accent,
    } as any).eq("key", "main");

    if (error) toast.error(error.message);
    else { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["site_settings"] }); }
  };

  if (!data) return <div className="py-10 text-muted-foreground">Loading…</div>;
  return (
    <div className="glass rounded-xl p-6 mt-6 space-y-5 max-w-3xl">
      <div className="grid md:grid-cols-2 gap-4">
        <div><Label>Site title</Label><Input value={(form.site_title as string) ?? ""} onChange={(e) => set("site_title", e.target.value)} /></div>
        <div><Label>Theme accent (hex)</Label><Input value={(form.theme_accent as string) ?? ""} onChange={(e) => set("theme_accent", e.target.value)} /></div>
      </div>
      <div><Label>Tagline</Label><Input value={(form.tagline as string) ?? ""} onChange={(e) => set("tagline", e.target.value)} /></div>
      <div><Label>Hero subtitle</Label><Textarea value={(form.hero_subtitle as string) ?? ""} onChange={(e) => set("hero_subtitle", e.target.value)} /></div>
      <div className="grid md:grid-cols-2 gap-4">
        <div><Label>CTA label</Label><Input value={(form.hero_cta_label as string) ?? ""} onChange={(e) => set("hero_cta_label", e.target.value)} /></div>
        <div><Label>CTA URL</Label><Input value={(form.hero_cta_url as string) ?? ""} onChange={(e) => set("hero_cta_url", e.target.value)} /></div>
      </div>
      <FileUpload label="Logo" value={form.logo_url as string} onChange={(v) => set("logo_url", v)} />
      <FileUpload label="Hero background (legacy)" value={form.hero_bg_url as string} onChange={(v) => set("hero_bg_url", v)} />
      <div>
        <FileUpload label="Dashboard background (PNG / JPEG / GIF — animated gifs will animate)" value={form.dashboard_bg_url as string} onChange={(v) => set("dashboard_bg_url", v)} />
        <p className="text-xs text-muted-foreground mt-1">Upload an animated GIF for a moving background.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div><Label>Next match — Team</Label><Input value={(form.next_match_team_a as string) ?? ""} onChange={(e) => set("next_match_team_a", e.target.value)} /></div>
        <div><Label>Tournament</Label><Input value={(form.next_match_tournament as string) ?? ""} onChange={(e) => set("next_match_tournament", e.target.value)} /></div>
      </div>
      <div><Label>Match date/time</Label><Input type="datetime-local" value={form.next_match_at ? new Date(form.next_match_at as string).toISOString().slice(0,16) : ""} onChange={(e) => set("next_match_at", e.target.value ? new Date(e.target.value).toISOString() : null)} /></div>
      <Button onClick={save} className="bg-gradient-to-r from-[var(--blood)] to-[var(--neon)]">Save settings</Button>
    </div>
  );
}

type FieldDef = { key: string; label: string; type?: "text" | "textarea" | "number" | "image" | "datetime" | "bool" | "json" | "socials" };

const playerFields: FieldDef[] = [
  { key: "slug", label: "Slug" }, { key: "name", label: "Name" }, { key: "ign", label: "In-game name" },
  { key: "role", label: "Role" }, { key: "game", label: "Game" }, { key: "country", label: "Country" },
  { key: "avatar_url", label: "Profile picture", type: "image" }, { key: "banner_url", label: "Banner image", type: "image" },
  { key: "bio", label: "Bio", type: "textarea" },
  { key: "stats_text", label: "Stats (plain text)", type: "textarea" },
  { key: "socials", label: "Social media links", type: "socials" },
  { key: "sort_order", label: "Sort order", type: "number" }, { key: "active", label: "Active", type: "bool" },
];
const managementFields: FieldDef[] = [
  { key: "name", label: "Name" }, { key: "role", label: "Role" },
  { key: "avatar_url", label: "Avatar", type: "image" }, { key: "bio", label: "Bio", type: "textarea" },
  { key: "socials", label: "Social media links", type: "socials" },
  { key: "sort_order", label: "Sort order", type: "number" },
];
const matchFields: FieldDef[] = [
  { key: "stage_label", label: "Stage label (e.g. K.O. STAGE DAY-4)" },
  { key: "tournament", label: "Tournament title" },
  { key: "team_a", label: "Team A" },
  { key: "game", label: "Game" }, { key: "scheduled_at", label: "Scheduled at", type: "datetime" },
  { key: "status", label: "Status (upcoming / live / ended)" },
  { key: "score_a", label: "Score A", type: "number" },
  { key: "stream_url", label: "Live stream URL" },
  { key: "vod_url", label: "VOD URL (after the match)" },
];
const achievementFields: FieldDef[] = [
  { key: "title", label: "Title" }, { key: "description", label: "Description", type: "textarea" },
  { key: "event_date", label: "Event date" }, { key: "placement", label: "Placement" },
  { key: "game", label: "Game" }, { key: "image_url", label: "Image", type: "image" },
];
const highlightFields: FieldDef[] = [
  { key: "title", label: "Title" }, { key: "youtube_id", label: "YouTube video ID" },
  { key: "description", label: "Description", type: "textarea" },
];
const galleryFields: FieldDef[] = [
  { key: "title", label: "Title" }, { key: "image_url", label: "Image", type: "image" },
  { key: "category", label: "Category" }, { key: "sort_order", label: "Sort order", type: "number" },
];
const newsFields: FieldDef[] = [
  { key: "slug", label: "Slug" }, { key: "title", label: "Title" },
  { key: "excerpt", label: "Excerpt", type: "textarea" }, { key: "content", label: "Content", type: "textarea" },
  { key: "cover_url", label: "Cover image", type: "image" }, { key: "author", label: "Author" },
  { key: "published", label: "Published", type: "bool" },
];
const socialFields: FieldDef[] = [
  { key: "platform", label: "Platform name (e.g. Facebook, Instagram, YouTube, TikTok, Discord)" },
  { key: "url", label: "Link URL" },
  { key: "sort_order", label: "Sort order", type: "number" },
];

function CrudTable({ table, fields, titleField }: { table: string; fields: FieldDef[]; titleField: string }) {
  const qc = useQueryClient();
  const { data, refetch } = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table as any).select("*").order("created_at" as any, { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);

  const blank = () => Object.fromEntries(fields.map((f) => [f.key, f.type === "bool" ? true : f.type === "number" ? 0 : f.type === "socials" ? {} : ""]));

  const save = async () => {
    if (!editing) return;
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      let v = editing[f.key];
      if (f.type === "json" && typeof v === "string") { try { v = JSON.parse(v || "{}"); } catch { toast.error(`Invalid JSON in ${f.label}`); return; } }
      if (f.type === "socials") {
        const obj = (v && typeof v === "object" ? (v as Record<string, string>) : {}) as Record<string, string>;
        v = Object.fromEntries(Object.entries(obj).filter(([, val]) => typeof val === "string" && val.trim()));
      }
      if (f.type === "datetime" && v) v = new Date(v as string).toISOString();
      if (v === "") v = null;
      payload[f.key] = v;
    }
    const id = editing.id as string | undefined;
    const { error } = id
      ? await supabase.from(table as any).update(payload).eq("id", id)
      : await supabase.from(table as any).insert(payload);
    if (error) toast.error(error.message);
    else {
      toast.success("Saved"); setEditing(null);
      qc.invalidateQueries({ queryKey: [table] });
      refetch();
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from(table as any).delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: [table] }); refetch(); }
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{data?.length ?? 0} item(s)</p>
        <Button onClick={() => setEditing(blank())} className="bg-gradient-to-r from-[var(--blood)] to-[var(--neon)]">+ New</Button>
      </div>
      <div className="glass rounded-xl divide-y divide-border/40">
        {(data ?? []).map((row: any) => (
          <div key={row.id} className="flex items-center justify-between p-3 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {row.image_url || row.avatar_url || row.cover_url ? (
                <img src={row.image_url || row.avatar_url || row.cover_url} alt="" className="w-10 h-10 object-cover rounded-md" />
              ) : null}
              <div className="font-display font-bold truncate">{row[titleField] || row.id?.slice(0, 8)}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => setEditing(row)}>Edit</Button>
              <Button size="sm" variant="ghost" onClick={() => del(row.id)} className="text-[var(--neon)] hover:text-[var(--neon)]"><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
        {(!data || data.length === 0) && <div className="p-8 text-center text-muted-foreground text-sm">No items yet.</div>}
      </div>

      {editing && (
        <div className="glass-strong rounded-xl p-6 space-y-4">
          <h3 className="font-display uppercase tracking-widest text-[var(--neon)]">{editing.id ? "Edit" : "New"}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key} className={f.type === "textarea" || f.type === "json" || f.type === "socials" ? "md:col-span-2" : ""}>
                <Label>{f.label}</Label>
                {f.type === "textarea" || f.type === "json" ? (
                  <Textarea
                    rows={f.type === "json" ? 4 : 6}
                    value={typeof editing[f.key] === "object" ? JSON.stringify(editing[f.key] ?? {}, null, 2) : (editing[f.key] as string) ?? ""}
                    onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                  />
                ) : f.type === "socials" ? (
                  <SocialsEditor
                    value={(editing[f.key] as Record<string, string>) ?? {}}
                    onChange={(v) => setEditing({ ...editing, [f.key]: v })}
                  />
                ) : f.type === "image" ? (
                  <FileUpload value={editing[f.key] as string} onChange={(v) => setEditing({ ...editing, [f.key]: v })} />
                ) : f.type === "bool" ? (
                  <select className="w-full bg-input rounded-md px-3 py-2 border border-border" value={String(editing[f.key] ?? true)} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value === "true" })}>
                    <option value="true">Yes</option><option value="false">No</option>
                  </select>
                ) : f.type === "datetime" ? (
                  <Input type="datetime-local" value={editing[f.key] ? new Date(editing[f.key] as string).toISOString().slice(0,16) : ""} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} />
                ) : (
                  <Input type={f.type === "number" ? "number" : "text"} value={(editing[f.key] as string | number) ?? ""} onChange={(e) => setEditing({ ...editing, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })} />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={save} className="bg-gradient-to-r from-[var(--blood)] to-[var(--neon)]">Save</Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}
