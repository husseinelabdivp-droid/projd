"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Failed to delete project");

      router.push("/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-ink-500">Delete this project?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-md bg-signal-red px-3 py-1.5 text-sm font-medium text-base-950 hover:opacity-90 disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Yes, delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="rounded-md border border-base-600 px-3 py-1.5 text-sm hover:border-ink-500"
        >
          Cancel
        </button>
        {error && <span className="text-sm text-signal-red">{error}</span>}
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-2 rounded-md border border-base-600 px-3 py-1.5 text-sm text-ink-500 hover:border-signal-red hover:text-signal-red"
    >
      <Trash2 size={14} />
      Delete project
    </button>
  );
}
