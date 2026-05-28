export const THROTTLER_CONFIG = {
  auth: { limit: 5, ttl: 60_000 },
  public: { limit: 30, ttl: 60_000 },
  internal: { limit: 300, ttl: 60_000 },
};
