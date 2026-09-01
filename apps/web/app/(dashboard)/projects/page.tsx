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

export default async function ProjectsPage() {
  const supabase = createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, thumbnail_url, duration, status, content_type, created_at, clips(count)")
    .order("created_at", { ascending: false });

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Projects</h1>
        <Link
          href="/upload"
          className="rounded-md bg-bronze-500 px-4 py-2 text-sm font-medium text-base-950 hover:bg-bronze-400"
        >
          Upload video
        </Link>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-base-600 px-6 py-16 text-center">
          <p className="text-ink-500">No projects yet.</p>
          <Link href="/upload" className="mt-2 inline-block text-sm text-bronze-400 hover:text-bronze-300">
            Upload your first video
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
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
