"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Circle, LoaderCircle, ChartNoAxesColumnIncreasing } from "lucide-react";
import {
  getProgressLabel,
  type ProgressStatus,
} from "@/lib/progressStorage";
const STATUS_STYLES: Record<
  ProgressStatus,
  { button: string; icon: string; label: string }
> = {
  todo: {
    button:
      "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10 hover:text-white",
    icon: "text-zinc-400",
    label: "text-zinc-300",
  },
  "in-progress": {
    button:
      "border-[#8b5cf6]/40 bg-[#8b5cf6]/15 text-[#c4b5fd] hover:border-[#8b5cf6]/60 hover:bg-[#8b5cf6]/25",
    icon: "text-[#c4b5fd]",
    label: "text-[#c4b5fd]",
  },
  done: {
    button:
      "border-[#8b5cf6]/60 bg-[#8b5cf6]/25 text-white hover:border-[#8b5cf6]/80 hover:bg-[#8b5cf6]/35",
    icon: "text-white",
    label: "text-white",
  },
};

function ProgressIcon({
  status,
  className,
}: {
  status: ProgressStatus;
  className?: string;
}) {
  switch (status) {
    case "todo":
      return <Circle size={14} className={className} />;
    case "in-progress":
      return <LoaderCircle size={14} className={`${className} animate-spin`} />;
    case "done":
      return <Check size={14} className={className} />;
  }
}

type ProgressControlProps = {
  status: ProgressStatus;
  onCycle: () => void;
  compact?: boolean;
};

export function ProgressControl({
  status,
  onCycle,
  compact = false,
}: ProgressControlProps) {
  const styles = STATUS_STYLES[status];

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onCycle();
      }}
      title={`Status: ${getProgressLabel(status)}. Click to change.`}
      aria-label={`Status: ${getProgressLabel(status)}. Click to change.`}
      className={`inline-flex shrink-0 items-center rounded-full border transition-colors ${
        compact
          ? `h-7 w-7 justify-center ${styles.button}`
          : `gap-1.5 px-2.5 py-1 text-xs font-medium ${styles.button}`
      }`}
    >
      <ProgressIcon status={status} className={styles.icon} />
      {!compact && (
        <span className={styles.label}>{getProgressLabel(status)}</span>
      )}
    </button>
  );
}

export function RoadmapProgressButton({
  counts,
  totalCount,
}: {
  counts: Record<ProgressStatus, number>;
  totalCount: number;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (totalCount === 0) return null;

  const percent = Math.round((counts.done / totalCount) * 100);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-200 transition-colors hover:border-[#8b5cf6]/40 hover:bg-[#8b5cf6]/10 hover:text-white sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
      >
        <ChartNoAxesColumnIncreasing size={16} className="sm:h-[18px] sm:w-[18px]" />
        <span className="whitespace-nowrap">
          <span className="hidden sm:inline">Progress </span>
          {percent}%
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Progress summary"
          className="absolute top-full right-0 z-50 mt-2 w-52 rounded-xl border border-white/10 bg-[#12121b] p-3 shadow-2xl backdrop-blur-xl"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
            Your progress
          </p>
          <div className="space-y-2">
            {(["done", "in-progress", "todo"] as ProgressStatus[]).map(
              (status) => {
              const styles = STATUS_STYLES[status];
              return (
                <div
                  key={status}
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/5 px-3 py-2"
                >
                  <span className="inline-flex items-center gap-2 text-sm text-zinc-200">
                    <ProgressIcon
                      status={status}
                      className={styles.icon}
                    />
                    {getProgressLabel(status)}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {counts[status]}
                  </span>
                </div>
              );
            },
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function getItemCardBorderClass(status: ProgressStatus) {  switch (status) {
    case "in-progress":
      return "border-[#8b5cf6]/50 bg-slate-800/60 shadow-[#8b5cf6]/10 hover:border-[#8b5cf6]/70 hover:bg-slate-800/70";
    case "done":
      return "border-[#8b5cf6]/35 bg-slate-800/40 opacity-90";
    default:
      return "border-slate-700 bg-slate-800/50 hover:border-[#8b5cf6]/40 hover:bg-slate-700/50 hover:shadow-[#8b5cf6]/10";
  }
}

export function getTimelineDotClass(status: ProgressStatus) {
  switch (status) {
    case "in-progress":
      return "bg-[#8b5cf6] shadow-[0_0_10px_rgba(139,92,246,0.55)]";
    case "done":
      return "bg-[#a78bfa] shadow-[0_0_10px_rgba(167,139,250,0.5)]";
    default:
      return "bg-[#6366f1] shadow-[0_0_10px_rgba(99,102,241,0.5)]";
  }
}
