export const FREE_LEVELS = ['hsk1', 'hsk2'];

export function isFreeLevel(levelId: string): boolean {
  return FREE_LEVELS.includes(levelId);
}

export function canAccessLevel(
  levelId: string,
  isMember: boolean
): boolean {
  if (isFreeLevel(levelId)) {
    return true;
  }
  return isMember;
}

export function getRemainingDays(expiryDate: Date | string): number {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function getMembershipStatus(membershipData?: {
  active: boolean;
  expires_at: string;
}): {
  isMember: boolean;
  expiresAt: Date | null;
  remainingDays: number;
} {
  if (!membershipData || !membershipData.active) {
    return {
      isMember: false,
      expiresAt: null,
      remainingDays: 0,
    };
  }

  const expiresAt = new Date(membershipData.expires_at);
  const now = new Date();

  if (expiresAt < now) {
    return {
      isMember: false,
      expiresAt,
      remainingDays: 0,
    };
  }

  return {
    isMember: true,
    expiresAt,
    remainingDays: getRemainingDays(expiresAt),
  };
}
