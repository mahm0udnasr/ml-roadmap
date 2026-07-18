const PRESET_BADGES = ["Playlist", "Book", "Video", "Article"] as const;

export const LIMITS = {
  itemTitle: 200,
  itemDescription: 5000,
  labelTitle: 100,
  refTitle: 200,
  refLink: 2048,
  customBadge: 50,
  maxRefs: 30,
  maxLabelsPerItem: 30,
} as const;

export type ValidatedRef = {
  title: string;
  link: string;
  badge?: string;
};

type RefInput = {
  title: string;
  link: string;
  badge?: string;
};

function assertNonEmpty(value: string, field: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${field} is required`);
  }
  return trimmed;
}

function assertMaxLength(value: string, max: number, field: string): string {
  if (value.length > max) {
    throw new Error(`${field} must be at most ${max} characters`);
  }
  return value;
}

export function validateHttpUrl(link: string): string {
  const trimmed = link.trim();
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error("Reference link must be a valid URL");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Reference link must use http or https");
  }

  return assertMaxLength(trimmed, LIMITS.refLink, "Reference link");
}

export function validateBadge(badge?: string): string | undefined {
  if (badge === undefined) {
    return undefined;
  }

  const trimmed = badge.trim();
  if (!trimmed) {
    return undefined;
  }

  if ((PRESET_BADGES as readonly string[]).includes(trimmed)) {
    return trimmed;
  }

  return assertMaxLength(trimmed, LIMITS.customBadge, "Custom badge");
}

export function validateRef(ref: RefInput): ValidatedRef {
  const title = assertMaxLength(
    assertNonEmpty(ref.title, "Reference title"),
    LIMITS.refTitle,
    "Reference title",
  );
  const link = validateHttpUrl(ref.link);
  const badge = validateBadge(ref.badge);

  return badge ? { title, link, badge } : { title, link };
}

export function validateRefs(refs: RefInput[]): ValidatedRef[] {
  if (refs.length > LIMITS.maxRefs) {
    throw new Error(`At most ${LIMITS.maxRefs} references are allowed`);
  }

  return refs.map((ref) => validateRef(ref));
}

export function validateItemTitle(title: string): string {
  return assertMaxLength(
    assertNonEmpty(title, "Title"),
    LIMITS.itemTitle,
    "Title",
  );
}

export function validateItemDescription(description: string): string {
  return assertMaxLength(
    assertNonEmpty(description, "Description"),
    LIMITS.itemDescription,
    "Description",
  );
}

export function validateLabelTitle(title: string): string {
  return assertMaxLength(
    assertNonEmpty(title, "Label title"),
    LIMITS.labelTitle,
    "Label title",
  );
}
