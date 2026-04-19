export interface MercariAccount {
  name:        string;
  rating:      number;
  reviewCount: number;
  url:         string;
}

export interface TrustStats {
  mercari: {
    combined: {
      rating:       number;   // weighted average, 1 decimal
      reviewCount:  number;   // sum of all accounts
      accountCount: number;
    };
    accounts: MercariAccount[];
  };
  level: {
    seller:  number; // 1–10; 0 = opt-out → show identity-verified fallback
    account: string; // name of the account that holds the level badge
    url:     string; // profile URL of that account
  };
  shipped2025: number;
  countries:   number;
  updatedAt:   string; // ISO 8601
  source:      'env' | 'cache' | 'fallback';
  cached_at?:  string;
}
