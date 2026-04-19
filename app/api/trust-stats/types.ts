export interface TrustStats {
  mercari_rating:       string;
  mercari_review_count: number;
  mercari_url:          string;
  rakuma_rating:        string;
  rakuma_review_count:  number;
  rakuma_url:           string;
  shipped_2025:         number;
  countries_shipped:    number;
  source:               'env' | 'cache' | 'fallback';
  cached_at?:           string;
}
