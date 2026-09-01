import Link from "next/link";

const steps = [
  {
    n: "1",
    title: "Upload",
    body: "Drop in a VOD, a Twitch export, or a long-form recording. We handle MP4, MOV, and WEBM.",
  },
  {
    n: "2",
    title: "AI finds the moments",
    body: "The pipeline transcribes the audio and scores every candidate moment for hook, emotion, and shareability.",
  },
  {
    n: "3",
    title: "Customize",
    body: "Trim the edges, swap the caption style, rewrite a hook — the clip is yours to adjust.",
  },
  {
    n: "4",
    title: "Export",
    body: "Download a 1080×1920 render, captioned and ready for TikTok, Shorts, or Reels.",
  },
];

const features = [
  { title: "AI clip detection", body: "Finds clutches, fails, and reactions in a full VOD without you scrubbing through it." },
  { title: "Word-synced captions", body: "Four caption presets, burned in and readable at arm's length on a phone." },
  { title: "Smart vertical framing", body: "Gameplay stays centered; a detected facecam is kept in frame instead of cropped out." },
  { title: "AI hooks & titles", body: "Every clip gets a hook, a title, a description, and hashtags generated from its own transcript." },
  { title: "Viral score breakdown", body: "A 0–100 estimate split into hook, entertainment, emotion, context, and shareability." },
  { title: "Batch generation", body: "Ask for 3, 5, 10, or 20 clips from one upload and review them as a set." },
];

const faqs = [
  {
    q: "Does this guarantee my clips go viral?",
    a: "No. The viral score is an AI estimate of a clip's structural quality — hook strength, pacing, context — not a prediction of performance.",
  },
  {
    q: "What video length works best?",
    a: "Anything from a 10-minute highlight reel to a multi-hour VOD. Longer sources just take longer to process.",
  },
  {
    q: "Can I edit a clip after it's generated?",
    a: "Yes — adjust the start and end points, caption style, hook, and title before the final render.",
  },
  {
    q: "Which games does it work with?",
    a: "The MVP is tuned for gaming commentary and reactions generally, not a specific title's UI.",
  },
];

export default function LandingPage() {
  return (
    <main className="bg-base-950 text-ink-100">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-lg tracking-tight">ClipForge AI</span>
        <div className="flex items-center gap-6 text-sm text-ink-500">
          <Link href="/pricing" className="hover:text-ink-100">Pricing</Link>
          <Link href="/login" className="hover:text-ink-100">Log in</Link>
          <Link
            href="/signup"
            className="rounded-md bg-bronze-500 px-4 py-2 text-sm font-medium text-base-950 hover:bg-bronze-400"
          >
            Start creating free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-[1.2fr,0.8fr] md:py-28">
        <div>
          <h1 className="max-w-lg font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">
            One gaming video in. Ten viral Shorts out.
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink-500">
            ClipForge finds your best gaming moments, cuts them vertical, captions them, and
            writes the hook — so the highlight reel you never had time to edit gets posted anyway.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="rounded-md bg-bronze-500 px-6 py-3 font-medium text-base-950 hover:bg-bronze-400"
            >
              Start creating free
            </Link>
            <a
              href="#how-it-works"
              className="rounded-md border border-base-600 px-6 py-3 font-medium text-ink-100 hover:border-ink-500"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Signature element: a mocked pipeline status card */}
        <div className="self-start rounded-lg border border-base-600 bg-base-900 p-6">
          <p className="text-sm text-ink-500">rust_solo_vod.mp4 · 1h 24m</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center justify-between">
              <span>Transcribing</span>
              <span className="text-signal-green">done</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Finding moments</span>
              <span className="text-signal-green">done</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Ranking clips</span>
              <span className="text-signal-green">done</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Rendering — clip 7 of 12</span>
              <span className="text-bronze-400">in progress</span>
            </li>
            <li className="flex items-center justify-between text-ink-700">
              <span>Finalizing</span>
              <span>queued</span>
            </li>
          </ul>
          <div className="mt-6 rounded-md bg-base-800 p-4">
            <p className="text-xs uppercase text-ink-700">Top clip so far</p>
            <p className="mt-1 text-sm">"I thought we were completely finished..."</p>
            <p className="mt-2 text-sm text-bronze-400">Viral score 91</p>
          </div>
        </div>
      </section>

      {/* How it works — a real sequence, so numbering earns its place */}
      <section id="how-it-works" className="border-t border-base-700 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="max-w-md font-display text-3xl">From upload to posted, in four steps</h2>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n}>
                <p className="font-display text-3xl text-bronze-500">{s.n}</p>
                <h3 className="mt-3 text-lg font-medium">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-base-700 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="max-w-md font-display text-3xl">Built for the parts editing actually takes time on</h2>
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title}>
                <h3 className="text-lg font-medium">{f.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-base-700 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-display text-3xl">Questions</h2>
          <div className="mt-10 divide-y divide-base-700">
            {faqs.map((f) => (
              <div key={f.q} className="py-6">
                <p className="font-medium">{f.q}</p>
                <p className="mt-2 text-sm text-ink-500">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-base-700 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl">
            Stop leaving great Shorts hidden inside your long videos.
          </h2>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-md bg-bronze-500 px-6 py-3 font-medium text-base-950 hover:bg-bronze-400"
          >
            Start creating free
          </Link>
        </div>
      </section>
    </main>
  );
}
