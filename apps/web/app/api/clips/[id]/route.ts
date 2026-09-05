import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteKeys, R2_PUBLIC_URL } from "@/lib/r2";

function keyFromPublicUrl(url: string | null): string | null {
  if (!url) return null;
  const prefix = `${R2_PUBLIC_URL}/`;
  return url.startsWith(prefix) ? url.slice(prefix.length) : null;
}

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
  const { data: clip, error: fetchError } = await supabase
    .from("clips")
    .select("id, output_url, thumbnail_url, projects(user_id)")
    .eq("id", params.id)
    .single();
  const ownerId = (clip as any)?.projects?.user_id;
  if (fetchError || !clip || ownerId !== user.id) {
    return NextResponse.json({ error: "Clip not found" }, { status: 404 });
  }
  const keys = [keyFromPublicUrl(clip.output_url), keyFromPublicUrl(clip.thumbnail_url)].filter(
    (k): k is string => Boolean(k)
  );
  if (keys.length > 0) {
    await deleteKeys(keys);
  }
  const { error: deleteError } = await supabase.from("clips").delete().eq("id", clip.id);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
