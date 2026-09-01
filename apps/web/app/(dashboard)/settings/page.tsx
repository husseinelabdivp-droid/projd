import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email, plan, credits")
    .eq("id", user?.id)
    .single();

  return (
    <div className="max-w-2xl px-8 py-8">
      <h1 className="font-display text-2xl">Settings</h1>

      <section className="mt-8">
        <h2 className="font-medium">Account</h2>
        <div className="mt-4 space-y-4 rounded-lg border border-base-700 bg-base-900 p-6">
          <Field label="Name" value={profile?.name ?? ""} />
          <Field label="Email" value={profile?.email ?? user?.email ?? ""} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-medium">Preferences</h2>
        <div className="mt-4 space-y-4 rounded-lg border border-base-700 bg-base-900 p-6">
          <Field label="Default caption style" value="Classic" />
          <Field label="Default aspect ratio" value="9:16" />
          <Field label="Default number of clips" value="5" />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-medium">Billing</h2>
        <div className="mt-4 space-y-2 rounded-lg border border-base-700 bg-base-900 p-6 text-sm">
          <p>Plan: <span className="text-ink-100">{profile?.plan ?? "free"}</span></p>
          <p>Credits: <span className="text-ink-100">{profile?.credits ?? 0}</span></p>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-xs text-ink-500">{label}</label>
      <input
        defaultValue={value}
        className="mt-1 w-full rounded-md border border-base-600 bg-base-800 px-3 py-2 text-sm outline-none focus:border-bronze-500"
      />
    </div>
  );
}
