import { z } from 'zod';

export const MercariAccountSchema = z.object({
  name:        z.string().min(1),
  rating:      z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  url:         z.string().url(),
});

export const TrustStatsDataSchema = z.object({
  mercari: z.object({
    combined: z.object({
      rating:       z.number().min(0).max(5),
      reviewCount:  z.number().int().min(0),
      accountCount: z.number().int().min(0),
    }),
    accounts: z.array(MercariAccountSchema).min(1),
  }),
  level: z.object({
    seller:  z.number().int().min(0),
    account: z.string(),
    url:     z.string(),
  }),
  shipped2025: z.number().int().min(0),
  countries:   z.number().int().min(0),
  updatedAt:   z.string(),
});

export type TrustStatsData = z.infer<typeof TrustStatsDataSchema>;
