import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const STATUS_LABEL: Record<string, string> = {
  uploading: "Uploading",
  processing: "Processing",
  analyzing: "Analyzing",
  generating_clips: "Generating clips",
  completed: "Completed",
  failed: "Failed",
};

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, credits")
    .eq("id", user?.id)
    .single();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, thumbnail_url, duration, status, created_at, clips(count)")
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <div className="px-8 py-8">
      <p className="text-ink-500">Good morning, {profile?.name ?? "there"}</p>
      <h1 className="mt-1 font-display text-2xl">Turn your gaming videos into Shorts.</h1>

      <Link
        href="/upload"
        className="mt-6 inline-block rounded-md bg-bronze-500 px-5 py-2.5 text-sm font-medium text-base-950 hover:bg-bronze-400"
      >
        Upload video
      </Link>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Videos processed" value={String(projects?.length ?? 0)} />
        <StatCard label="Shorts generated" value="—" />
        <StatCard label="Total processing time" value="—" />
        <StatCard label="Credits remaining" value={String(profile?.credits ?? 0)} />
      </div>

      <h2 className="mt-12 font-display text-lg">Recent projects</h2>

      {!projects || projects.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-base-600 px-6 py-12 text-center">
          <p className="text-ink-500">No projects yet.</p>
          <Link href="/upload" className="mt-2 inline-block text-sm text-bronze-400 hover:text-bronze-300">
            Upload your first video
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="rounded-lg border border-base-700 bg-base-900 p-4 hover:border-base-600"
            >
              <div className="aspect-video rounded-md bg-base-800" />
              <p className="mt-3 truncate font-medium">{p.name}</p>
              <p className="mt-1 text-xs text-ink-500">
                {STATUS_LABEL[p.status] ?? p.status}
                {p.duration ? ` · ${Math.round(p.duration / 60)} min` : ""}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-base-700 bg-base-900 p-4">
      <p className="font-display text-2xl">{value}</p>
      <p className="mt-1 text-xs text-ink-500">{label}</p>
    </div>
  );
}
