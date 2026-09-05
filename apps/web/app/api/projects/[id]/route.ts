import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { listAllKeys, deleteKeys } from "@/lib/r2";

export async function DELETE(
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

  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("id, user_id")
    .eq("id", params.id)
    .single();

  if (fetchError || !project || project.user_id !== user.id) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const videoKeys = await listAllKeys(`videos/${user.id}/${project.id}/`);
  const clipKeys = await listAllKeys(`clips/${user.id}/${project.id}/`);
  await deleteKeys([...videoKeys, ...clipKeys]);

  const { error: deleteError } = await supabase
    .from("projects")
    .delete()
    .eq("id", project.id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
