export type ProgressStatus = "todo" | "in-progress" | "done";

export const PROGRESS_STATUSES: ProgressStatus[] = [
  "todo",
  "in-progress",
  "done",
];

export const DEFAULT_PROGRESS_STATUS: ProgressStatus = "todo";

const STORAGE_KEY = "ml-roadmap-progress-v1";

export type ProgressMap = Record<string, ProgressStatus>;

export function itemProgressKey(id: string) {
  return `item:${id}`;
}

export function cycleProgressStatus(status: ProgressStatus): ProgressStatus {
  const index = PROGRESS_STATUSES.indexOf(status);
  return PROGRESS_STATUSES[(index + 1) % PROGRESS_STATUSES.length];
}

export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};

    const result: ProgressMap = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (PROGRESS_STATUSES.includes(value as ProgressStatus)) {
        result[key] = value as ProgressStatus;
      }
    }
    return result;
  } catch {
    return {};
  }
}

export function saveProgress(progress: ProgressMap) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore quota or privacy mode errors.
  }
}

export function getProgressLabel(status: ProgressStatus) {
  switch (status) {
    case "todo":
      return "Todo";
    case "in-progress":
      return "In Progress";
    case "done":
      return "Done";
  }
}
