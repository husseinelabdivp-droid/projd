"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  UploadCloud,
  Clapperboard,
  LayoutTemplate,
  BarChart3,
  CreditCard,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/upload", label: "Upload", icon: UploadCloud },
  { href: "/shorts", label: "Shorts", icon: Clapperboard },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  userName,
  plan,
  credits,
}: {
  userName: string;
  plan: string;
  credits: number;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-base-700 bg-base-900 px-4 py-6">
      <Link href="/" className="px-2 font-display text-lg">ClipForge AI</Link>

      <nav className="mt-8 flex-1 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                active
                  ? "bg-base-800 text-ink-100"
                  : "text-ink-500 hover:bg-base-800 hover:text-ink-100"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-md border border-base-700 px-3 py-3 text-sm">
        <p className="truncate font-medium">{userName}</p>
        <p className="mt-1 text-xs uppercase text-ink-700">{plan} plan</p>
        <p className="mt-2 text-xs text-ink-500">{credits} credits left</p>
      </div>
    </aside>
  );
}
