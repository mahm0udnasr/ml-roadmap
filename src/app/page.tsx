"use client";

import { AnimatedBackground } from "@/components/AnimatedBackground";

const features = [
  {
    title: "Clear milestones",
    description:
      "Move step by step through the core areas of machine learning with a simple structure.",
  },
  {
    title: "Practical learning path",
    description:
      "Blend theory, projects, and hands-on practice in one place to keep momentum high.",
  },
  {
    title: "Built for focus",
    description:
      "A calm interface that helps you stay centered on what matters most: learning.",
  },
];

const socials = [
  { label: "GitHub", href: "https://github.com/mahm0udnasr" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/mahm0udnasr" },
  { label: "Telegram", href: "https://t.me/mahm0udnasr" },
];

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <main className="flex flex-1 flex-col items-center relative z-10 bg-transparent px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <section className="card-surface w-full max-w-6xl overflow-hidden">
          <div className="grid gap-10 px-6 py-10 sm:px-8 sm:py-12 lg:grid-cols-[1.2fr_0.8fr] lg:px-12 lg:py-16">
            <div className="flex flex-col justify-center gap-6">
              <span className="w-fit rounded-full bg-[#8b5cf6]/15 px-3 py-1 text-sm font-semibold text-[#c4b5fd]">
                ML Roadmap
              </span>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Your structured path to mastering machine learning.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-zinc-300">
                Explore the roadmap, track the milestones, and build the skills
                that matter most for modern AI and data work.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/roadmap"
                  className="rounded-full bg-[#8b5cf6] px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#7c3aed]"
                >
                  Open roadmap
                </a>
                <a
                  href="#features"
                  className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-200 transition duration-200 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Learn more
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-lg">
              <div className="flex h-full flex-col justify-between gap-8">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-100">
                    What you will get
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
                    Learn faster with a guided roadmap.
                  </h2>
                </div>
                <div className="grid gap-4 text-sm text-indigo-50 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                    <p className="font-semibold">Stage-based learning</p>
                    <p className="mt-1 text-indigo-100">
                      From foundations to advanced topics.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                    <p className="font-semibold">Hands-on focus</p>
                    <p className="mt-1 text-indigo-100">
                      Projects and practice built in.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="card-surface mt-8 w-full max-w-6xl p-6 sm:p-8 lg:p-10"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">
                Why this platform
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                Everything designed to keep your learning path clear.
              </h2>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[1.25rem] border border-white/10 bg-white/5 p-5 transition duration-200 hover:-translate-y-1 hover:bg-white/10"
              >
                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-zinc-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 w-full max-w-6xl">
          <div className="w-full rounded-4xl border border-white/10 bg-[#11131b] p-6 text-white shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">
              Follow along
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-white/10"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
