const TIER_LIMITS = {
  TIER_1: 1000,
  TIER_2: 10000,
  TIER_3: 100000,
  TIER_4: 'UNLIMITED'
};

function currentTierFromConversationVolume(uniqueConversationsLast30d) {
  const n = Number(uniqueConversationsLast30d || 0);
  if (n >= 100000) return 'TIER_4';
  if (n >= 10000) return 'TIER_3';
  if (n >= 1000) return 'TIER_2';
  return 'TIER_1';
}

function nextTier(tier) {
  if (tier === 'TIER_1') return 'TIER_2';
  if (tier === 'TIER_2') return 'TIER_3';
  if (tier === 'TIER_3') return 'TIER_4';
  return 'TIER_4';
}

function buildTierRampPlan({ tier = 'TIER_1', qualityRating = 'UNKNOWN', uniqueConversations = 0 }) {
  const normalizedTier = tier || currentTierFromConversationVolume(uniqueConversations);
  const target = nextTier(normalizedTier);

  const recommendations = [
    'Keep message quality high (low blocks/reports, high reply relevance).',
    'Prefer consent-first outbound and category-correct templates.',
    'Warm up daily conversation volume steadily; avoid sudden spikes.',
    'Track template quality/status webhooks and pause poor performers quickly.'
  ];

  const projectedDailyWarmup = normalizedTier === 'TIER_1'
    ? [100, 150, 200, 250, 300, 350, 400]
    : normalizedTier === 'TIER_2'
      ? [800, 1200, 1800, 2500, 3200, 4000, 5000]
      : [10000, 12000, 15000, 18000, 22000, 25000, 30000];

  return {
    currentTier: normalizedTier,
    currentLimit: TIER_LIMITS[normalizedTier],
    nextTargetTier: target,
    nextTargetLimit: TIER_LIMITS[target],
    qualityRating,
    recommendations,
    projectedDailyWarmup
  };
}

module.exports = {
  TIER_LIMITS,
  currentTierFromConversationVolume,
  buildTierRampPlan
};
