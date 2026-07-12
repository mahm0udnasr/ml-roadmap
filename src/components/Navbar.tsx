"use client";

import { Show, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/roadmap", label: "Roadmap" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();

  const isAdmin = isLoaded && user?.publicMetadata?.role === "admin";

  const handleNavigate = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(10,10,15,0.85)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-7 lg:px-11">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={handleNavigate}
        >
          <div className="flex flex-col">
            <span className="text-base font-semibold text-zinc-50">
              ML Roadmap
            </span>
            <span className="text-xs text-zinc-400">Build your path</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const active = isActivePath(pathname ?? "/", item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavigate}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-[#8b5cf6] text-white"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAdmin && (
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Admin
              </span>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="rounded-full bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-700">
                    تسجيل الدخول
                  </button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-200 transition hover:bg-white/10 md:hidden"
          onClick={() => setIsMenuOpen((value) => !value)}
          aria-label="Open navigation menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-white/10 bg-[#0f1018] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const active = isActivePath(pathname ?? "/", item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavigate}
                  className={`rounded-2xl px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-[#8b5cf6] text-white"
                      : "text-zinc-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {isAdmin && (
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
              <span className="text-sm font-semibold text-zinc-200">
                Admin access
              </span>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="rounded-full bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-700">
                    تسجيل الدخول
                  </button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
