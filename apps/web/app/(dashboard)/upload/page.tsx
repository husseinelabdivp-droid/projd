"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ALLOWED_VIDEO_TYPES, MAX_UPLOAD_BYTES } from "@/lib/validation/project";

type Step = "select" | "options" | "uploading" | "error";

const CONTENT_TYPES = [
  { value: "gaming", label: "Gaming" },
  { value: "twitch", label: "Twitch stream" },
  { value: "youtube", label: "YouTube video" },
  { value: "podcast", label: "Podcast" },
  { value: "other", label: "Other" },
] as const;

const CLIP_COUNTS = [3, 5, 10, 20] as const;

export default function UploadPage() {
  const router = useRouter();
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("select");
  const [file, setFile] = useState<File | null>(null);
  const [contentType, setContentType] = useState<(typeof CONTENT_TYPES)[number]["value"]>("gaming");
  const [clipCount, setClipCount] = useState<(typeof CLIP_COUNTS)[number]>(5);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  function validateAndSetFile(f: File) {
    if (!ALLOWED_VIDEO_TYPES.includes(f.type as (typeof ALLOWED_VIDEO_TYPES)[number])) {
      setError("Only MP4, MOV, and WEBM files are supported.");
      return;
    }
    if (f.size > MAX_UPLOAD_BYTES) {
      setError("File exceeds the 5GB upload limit.");
      return;
    }
    setError(null);
    setFile(f);
    setStep("options");
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) validateAndSetFile(f);
  }, []);

  async function startUpload() {
    if (!file) return;
    setStep("uploading");
    setError(null);
    setProgress(0);

    try {
      const createRes = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name.replace(/\.[^/.]+$/, ""),
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          contentType,
          requestedClipCount: clipCount,
        }),
      });

      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.error ?? "Failed to start upload");

      const { projectId, storagePath, token } = createData;

      const { error: uploadError } = await supabase.storage
        .from("videos")
        .uploadToSignedUrl(storagePath, token, file);

      if (uploadError) throw new Error(uploadError.message);

      setProgress(100);

      const generateRes = await fetch(`/api/projects/${projectId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storagePath }),
      });

      const generateData = await generateRes.json();
      if (!generateRes.ok) throw new Error(generateData.error ?? "Failed to queue processing");

      router.push(`/projects/${projectId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("error");
    }
  }

  function reset() {
    setFile(null);
    setStep("select");
    setError(null);
    setProgress(0);
  }

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <h1 className="font-display text-2xl">Upload a video</h1>
      <p className="mt-1 text-sm text-ink-500">MP4, MOV, or WEBM — up to 5GB.</p>

      {step === "select" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`mt-8 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-16 text-center transition-colors ${
            dragActive ? "border-bronze-500 bg-base-900" : "border-base-600 hover:border-base-500"
          }`}
        >
          <UploadCloud className="text-ink-500" size={32} />
          <p className="mt-4 text-sm">Drag and drop your video, or click to browse</p>
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) validateAndSetFile(f);
            }}
          />
        </div>
      )}

      {error && step === "select" && (
        <p className="mt-3 text-sm text-signal-red">{error}</p>
      )}

      {step === "options" && file && (
        <div className="mt-8 space-y-8">
          <div className="flex items-center justify-between rounded-lg border border-base-700 bg-base-900 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm">{file.name}</p>
              <p className="text-xs text-ink-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
            <button onClick={reset} className="text-ink-500 hover:text-ink-100">
              <X size={16} />
            </button>
          </div>

          <div>
            <p className="text-sm font-medium">What type of content is this?</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CONTENT_TYPES.map((ct) => (
                <button
                  key={ct.value}
                  onClick={() => setContentType(ct.value)}
                  className={`rounded-md border px-3 py-2 text-sm ${
                    contentType === ct.value
                      ? "border-bronze-500 bg-base-900 text-ink-100"
                      : "border-base-600 text-ink-500 hover:border-base-500"
                  }`}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium">How many Shorts?</p>
            <div className="mt-3 flex gap-2">
              {CLIP_COUNTS.map((c) => (
                <button
                  key={c}
                  onClick={() => setClipCount(c)}
                  className={`rounded-md border px-4 py-2 text-sm ${
                    clipCount === c
                      ? "border-bronze-500 bg-base-900 text-ink-100"
                      : "border-base-600 text-ink-500 hover:border-base-500"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-ink-500">
              This will use {clipCount} credits from your account.
            </p>
          </div>

          {error && <p className="text-sm text-signal-red">{error}</p>}

          <button
            onClick={startUpload}
            className="w-full rounded-md bg-bronze-500 px-4 py-2.5 text-sm font-medium text-base-950 hover:bg-bronze-400"
          >
            Generate Shorts
          </button>
        </div>
      )}

      {step === "uploading" && (
        <div className="mt-8">
          <p className="text-sm">Uploading {file?.name}…</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-base-800">
            <div
              className="h-full bg-bronze-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {step === "error" && (
        <div className="mt-8 rounded-lg border border-signal-red/40 bg-signal-red/10 p-4">
          <p className="text-sm text-signal-red">{error}</p>
          <button
            onClick={reset}
            className="mt-3 text-sm text-bronze-400 hover:text-bronze-300"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
