import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, plan, credits")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex bg-base-950 text-ink-100">
      <Sidebar
        userName={profile?.name ?? user.email ?? "Account"}
        plan={profile?.plan ?? "free"}
        credits={profile?.credits ?? 0}
      />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
