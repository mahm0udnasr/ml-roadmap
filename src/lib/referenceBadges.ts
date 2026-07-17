import {
  BookOpen,
  FileText,
  ListMusic,
  Tag,
  Video,
  type LucideIcon,
} from "lucide-react";

export const PRESET_REFERENCE_BADGES = [
  "Playlist",
  "Book",
  "Video",
  "Article",
] as const;

export type PresetReferenceBadge = (typeof PRESET_REFERENCE_BADGES)[number];
export type ReferenceBadgeType = PresetReferenceBadge | "Custom";

export type StoredReference = {
  title: string;
  link: string;
  badge?: string;
};

export type ReferenceFormRef = {
  title: string;
  link: string;
  badgeType: ReferenceBadgeType;
  customBadge: string;
};

export const DEFAULT_REFERENCE_BADGE: PresetReferenceBadge = "Article";

const BADGE_ICONS: Record<PresetReferenceBadge, LucideIcon> = {
  Playlist: ListMusic,
  Book: BookOpen,
  Video: Video,
  Article: FileText,
};

const BADGE_COLORS: Record<PresetReferenceBadge, string> = {
  Playlist: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  Book: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  Video: "bg-red-500/20 text-red-300 border-red-500/40",
  Article: "bg-blue-500/20 text-blue-300 border-blue-500/40",
};

export function isPresetBadge(
  badge: string,
): badge is PresetReferenceBadge {
  return (PRESET_REFERENCE_BADGES as readonly string[]).includes(badge);
}

export function getBadgeLabel(badge?: string): string {
  return badge?.trim() || DEFAULT_REFERENCE_BADGE;
}

export function getBadgeIcon(badge?: string): LucideIcon {
  const label = getBadgeLabel(badge);
  if (isPresetBadge(label)) return BADGE_ICONS[label];
  return Tag;
}

export function getBadgeColorClass(badge?: string): string {
  const label = getBadgeLabel(badge);
  if (isPresetBadge(label)) return BADGE_COLORS[label];
  return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
}

export function toFormRef(ref: StoredReference): ReferenceFormRef {
  const badge = getBadgeLabel(ref.badge);
  if (isPresetBadge(badge)) {
    return {
      title: ref.title,
      link: ref.link,
      badgeType: badge,
      customBadge: "",
    };
  }
  return {
    title: ref.title,
    link: ref.link,
    badgeType: "Custom",
    customBadge: badge,
  };
}

export function toStoredRef(ref: ReferenceFormRef): StoredReference | null {
  if (!ref.title.trim() || !ref.link.trim()) return null;

  const badge =
    ref.badgeType === "Custom"
      ? ref.customBadge.trim() || "Custom"
      : ref.badgeType;

  return {
    title: ref.title.trim(),
    link: ref.link.trim(),
    badge,
  };
}

export function emptyReferenceFormRef(): ReferenceFormRef {
  return {
    title: "",
    link: "",
    badgeType: DEFAULT_REFERENCE_BADGE,
    customBadge: "",
  };
}
