export type PlayerPhotoOverride = {
  src: string;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  objectPosition?: string;
  credit?: string;
  sourceUrl?: string;
};

export const PLAYER_PHOTO_OVERRIDES: Record<string, PlayerPhotoOverride> = {
  Butss: {
    src: "/player-photos/butss.png",
    scale: 1.15,
    offsetX: 0,
    offsetY: 0,
    objectPosition: "center 20%",
    credit: "Local asset",
  },
};

export function getPlayerPhoto(nickname?: string | null): PlayerPhotoOverride | null {
  if (!nickname) return null;
  return PLAYER_PHOTO_OVERRIDES[nickname] ?? PLAYER_PHOTO_OVERRIDES[nickname.trim()] ?? null;
}
