import type { SocialPlatform } from "@/components/SocialIcon";

export type SocialLink = {
  label: string;
  href: string;
  platform: SocialPlatform;
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/mahm0udnasr",
    platform: "github",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mahm0udnasr",
    platform: "linkedin",
  },
  {
    label: "Telegram",
    href: "https://t.me/mahm0udnasr",
    platform: "telegram",
  },
];
