"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/socialLinks";
import { SocialIcon } from "@/components/SocialIcon";

function SocialLinks() {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {SOCIAL_LINKS.map(({ label, href, platform }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition hover:border-[#8b5cf6]/50 hover:bg-[#8b5cf6]/10 hover:text-white"
        >
          <SocialIcon platform={platform} />
        </a>
      ))}
    </div>
  );
}

export default function Navbar() {
  const { user, isLoaded } = useUser();
  const isAdmin = isLoaded && user?.publicMetadata?.role === "admin";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(10,10,15,0.85)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-7 lg:px-11">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-base font-semibold text-zinc-50">
              ML Roadmap
            </span>
            <span className="text-xs text-zinc-400">Build your path</span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <SocialLinks />

          {isAdmin && (
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1.5 sm:px-3">
              <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 sm:inline">
                Admin
              </span>
              <UserButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
