export interface Member {
  id: string;
  name: string;
  handle: string;
  rank: number;
  joinedAt: string;
  lastActive?: string;
  change: string;
  followers: string;
  engaged: string;
  percentage: string;
  balance: string;
  balanceUsd: string;
  profileImage: string;
  twitterUrl: string;
}

export interface MemberChange {
  type: 'added' | 'removed' | 'rank_changed';
  member: Member;
  previousRank?: number;
  timestamp: Date;
}

export interface ChangesSummary {
  newMembers: Member[];
  removedMembers: Member[];
  rankChanges: Array<{
    member: Member;
    previousRank: number;
    newRank: number;
  }>;
  timeRange: {
    from: Date;
    to: Date;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
} 