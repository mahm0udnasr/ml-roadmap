"use client";

import { useReactFlow } from "@xyflow/react";

export function CustomControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const buttonClasses =
    "p-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-200 backdrop-blur";

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
      <button
        onClick={() => zoomIn()}
        className={buttonClasses}
        title="Zoom in"
        aria-label="Zoom in"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
          />
        </svg>
      </button>

      <button
        onClick={() => zoomOut()}
        className={buttonClasses}
        title="Zoom out"
        aria-label="Zoom out"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
          />
        </svg>
      </button>

      <button
        onClick={() => fitView()}
        className={buttonClasses}
        title="Fit to view"
        aria-label="Fit to view"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5"
          />
        </svg>
      </button>
    </div>
  );
}
