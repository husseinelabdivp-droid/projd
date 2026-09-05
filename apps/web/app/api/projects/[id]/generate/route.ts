import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { publicUrlFor } from "@/lib/r2";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, user_id, requested_clip_count, status")
    .eq("id", params.id)
    .single();

  if (projectError || !project || project.user_id !== user.id) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (project.status !== "uploading") {
    return NextResponse.json(
      { error: `Project is already in "${project.status}" state` },
      { status: 409 }
    );
  }

  const { storagePath } = await request.json().catch(() => ({ storagePath: null }));

  if (!storagePath) {
    return NextResponse.json({ error: "Missing storagePath" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  if (!profile || profile.credits < project.requested_clip_count) {
    return NextResponse.json({ error: "Not enough credits" }, { status: 402 });
  }

  const { error: updateError } = await supabase
    .from("projects")
    .update({
      original_video_url: publicUrlFor(storagePath),
      status: "processing",
    })
    .eq("id", project.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  await supabase
    .from("profiles")
    .update({ credits: profile.credits - project.requested_clip_count })
    .eq("id", user.id);

  const { error: jobError } = await supabase.from("processing_jobs").insert({
    project_id: project.id,
    type: "extract_audio",
    status: "queued",
    progress: 0,
  });

  if (jobError) {
    return NextResponse.json({ error: jobError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
