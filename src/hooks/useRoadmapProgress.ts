"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_PROGRESS_STATUS,
  cycleProgressStatus,
  loadProgress,
  saveProgress,
  type ProgressMap,
  type ProgressStatus,
} from "@/lib/progressStorage";

export function useRoadmapProgress() {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setIsReady(true);
  }, []);

  const getStatus = useCallback(
    (key: string) => progress[key] ?? DEFAULT_PROGRESS_STATUS,
    [progress],
  );

  const setStatus = useCallback((key: string, status: ProgressStatus) => {
    setProgress((current) => {
      const next = { ...current, [key]: status };
      saveProgress(next);
      return next;
    });
  }, []);

  const cycleStatus = useCallback((key: string) => {
    setProgress((current) => {
      const currentStatus = current[key] ?? DEFAULT_PROGRESS_STATUS;
      const next = {
        ...current,
        [key]: cycleProgressStatus(currentStatus),
      };
      saveProgress(next);
      return next;
    });
  }, []);

  return {
    progress,
    isReady,
    getStatus,
    setStatus,
    cycleStatus,
  };
}
