"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavbarClient() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d) => setUser(d.user))
      .catch(() => setUser(null));
  }, [pathname]);

  async function handleSignOut() {
    await fetch("/api/auth", { method: "DELETE" });
    setUser(null);
    router.push("/signin");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 bg-cream-100/95 backdrop-blur border-b border-cream-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-cocoa-900 focus:ring-2 focus:ring-cocoa-600 rounded px-1">
          Can I <span className="text-cocoa-600 italic font-normal">Afford</span>
        </Link>
        <nav aria-label="Main Navigation" className="flex items-center gap-5 text-sm font-medium text-cocoa-700">
          <Link href="/" className="hover:text-cocoa-900">Home</Link>
          <Link href="/compare" className="hover:text-cocoa-900">Compare</Link>
          <Link href="/about" className="hover:text-cocoa-900">About</Link>
          <Link href="/dashboard" className="hover:text-cocoa-900">Sanctuary</Link>
          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-cream-300">
              <span className="hidden sm:inline text-xs text-cocoa-700 bg-cream-200 px-2.5 py-1 rounded-full">{user.name}</span>
              <button type="button" onClick={handleSignOut} className="text-xs font-semibold text-cocoa-800 border border-cocoa-400 px-3 py-1.5 rounded-lg hover:bg-cream-200">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/signin" className="text-cocoa-800 px-3 py-1.5 rounded-lg hover:bg-cream-200">Sign In</Link>
              <Link href="/signup" className="bg-cocoa-800 text-cream-50 px-4 py-2 rounded-lg hover:bg-cocoa-900">Settle In</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}