import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createProjectSchema } from "@/lib/validation/project";
import { getSignedUploadUrl } from "@/lib/r2";

export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createProjectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const { name, fileName, fileType, contentType, requestedClipCount } = parsed.data;

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  if (!profile || profile.credits < requestedClipCount) {
    return NextResponse.json(
      { error: "Not enough credits for the requested number of clips" },
      { status: 402 }
    );
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name,
      content_type: contentType,
      requested_clip_count: requestedClipCount,
      status: "uploading",
    })
    .select()
    .single();

  if (projectError || !project) {
    return NextResponse.json(
      { error: projectError?.message ?? "Failed to create project" },
      { status: 500 }
    );
  }

  const extension = fileName.split(".").pop() ?? "mp4";
  const storagePath = `videos/${user.id}/${project.id}/original.${extension}`;

  let signedUrl: string;
  try {
    signedUrl = await getSignedUploadUrl(storagePath, fileType);
  } catch (err) {
    await supabase.from("projects").delete().eq("id", project.id);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create upload URL" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    projectId: project.id,
    storagePath,
    signedUrl,
  });
}

export async function GET() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, name, thumbnail_url, duration, status, content_type, created_at, clips(count)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ projects });
}
