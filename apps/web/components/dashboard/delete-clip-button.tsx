"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteClipButton({ clipId }: { clipId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/clips/${clipId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to delete clip");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-md bg-signal-red px-2 py-1 text-xs font-medium text-base-950 hover:opacity-90 disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="rounded-md border border-base-600 px-2 py-1 text-xs hover:border-ink-500"
        >
          Cancel
        </button>
        {error && <span className="text-xs text-signal-red">{error}</span>}
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title="Delete clip"
      className="flex items-center gap-1 rounded-md border border-base-600 px-2 py-1 text-xs text-ink-500 hover:border-signal-red hover:text-signal-red"
    >
      <Trash2 size={12} />
      Delete
    </button>
  );
}
