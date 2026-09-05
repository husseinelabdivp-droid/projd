import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ShortsPage() {
  const supabase = createClient();

  const { data: clips, error } = await supabase
    .from("clips")
    .select("*, projects(id, name)")
    .order("created_at", { ascending: false });

  return (
    <div className="px-8 py-8">
      <h1 className="font-display text-2xl">Shorts</h1>
      <p className="mt-1 text-sm text-ink-500">
        Every clip generated across your projects.
      </p>

      {error && (
        <p className="mt-6 text-sm text-signal-red">{error.message}</p>
      )}

      {!clips || clips.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-base-600 px-6 py-16 text-center">
          <p className="text-ink-500">No Shorts yet.</p>
          <Link href="/upload" className="mt-2 inline-block text-sm text-bronze-400 hover:text-bronze-300">
            Upload a video to generate some
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {clips.map((clip: any) => (
            <div key={clip.id} className="rounded-lg border border-base-700 bg-base-900 p-4">
              <div className="aspect-[9/16] overflow-hidden rounded-md bg-base-800">
                {clip.output_url ? (
                  <video
                    src={clip.output_url}
                    poster={clip.thumbnail_url ?? undefined}
                    controls
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-ink-700">
                    {clip.status === "rendering" ? "Rendering…" : "No preview yet"}
                  </div>
                )}
              </div>
              <p className="mt-3 truncate font-medium">{clip.title ?? "Untitled clip"}</p>
              <p className="mt-1 truncate text-xs text-ink-500">
                {clip.projects?.name}
              </p>
              <div className="mt-2 flex items-center justify-between text-xs">
                {clip.score != null && (
                  <span className="text-bronze-400">Viral score {Math.round(clip.score)}</span>
                )}
                {clip.output_url && (
                  <a
                    href={clip.output_url}
                    download
                    className="text-ink-500 hover:text-ink-100"
                  >
                    Download
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
