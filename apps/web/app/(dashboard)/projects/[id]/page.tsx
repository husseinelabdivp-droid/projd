import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DeleteProjectButton } from "@/components/dashboard/delete-project-button";

const PIPELINE_STAGES = [
  { key: "uploading", label: "Uploading" },
  { key: "processing", label: "Extracting & transcribing" },
  { key: "analyzing", label: "Finding moments" },
  { key: "generating_clips", label: "Generating clips" },
  { key: "completed", label: "Completed" },
] as const;

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!project) notFound();

  const { data: clips } = await supabase
    .from("clips")
    .select("*")
    .eq("project_id", project.id)
    .order("created_at", { ascending: false });

  const currentStageIndex = PIPELINE_STAGES.findIndex((s) => s.key === project.status);

  return (
    <div className="px-8 py-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl">{project.name}</h1>
          <p className="mt-1 text-sm text-ink-500">
            {project.content_type} · requested {project.requested_clip_count} clips
          </p>
        </div>
        <DeleteProjectButton projectId={project.id} />
      </div>

      <div className="mt-8 rounded-lg border border-base-700 bg-base-900 p-6">
        <p className="text-sm font-medium">Pipeline status</p>
        <ul className="mt-4 space-y-2 text-sm">
          {PIPELINE_STAGES.map((stage, i) => {
            const done = currentStageIndex > i || project.status === "completed";
            const active = stage.key === project.status;
            return (
              <li key={stage.key} className="flex items-center justify-between">
                <span className={active ? "text-ink-100" : "text-ink-500"}>{stage.label}</span>
                <span
                  className={
                    done
                      ? "text-signal-green"
                      : active
                      ? "text-bronze-400"
                      : "text-ink-700"
                  }
                >
                  {done ? "done" : active ? "in progress" : "queued"}
                </span>
              </li>
            );
          })}
        </ul>

        {project.status === "processing" && (
          <p className="mt-4 rounded-md bg-base-800 p-3 text-xs text-ink-500">
            Your video has been uploaded and a processing job has been queued.
            The AI pipeline that turns this into clips is still being built
            (Phase 4/5) — this project will stay in "processing" until that
            worker is live.
          </p>
        )}

        {project.status === "failed" && project.error && (
          <p className="mt-4 rounded-md bg-signal-red/10 p-3 text-xs text-signal-red">
            {project.error}
          </p>
        )}
      </div>

      <h2 className="mt-10 font-display text-lg">Generated Shorts</h2>

      {!clips || clips.length === 0 ? (
        <p className="mt-3 text-sm text-ink-500">
          No clips yet — they'll appear here once processing completes.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {clips.map((clip) => (
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
              {clip.score != null && (
                <p className="mt-1 text-xs text-bronze-400">Viral score {Math.round(clip.score)}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
