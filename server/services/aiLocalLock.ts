/**
 * AI Local Lock - central guard that blocks all remote/paid AI providers
 * during localhost / development testing.
 *
 * When active: no Wafer, TokenPlan, MiMo, OpenAI, Gemini, Portkey, or
 * Fireworks calls are allowed. Only local-data fallback is returned.
 *
 * Detection priority (any true -> locked):
 *   1. AI_LOCAL_ONLY === "true"
 *   2. AI_DISABLE_REMOTE === "true"
 *   3. AI_PRIMARY_PROVIDER === "local"
 *   4. AI_ENV !== "production"   (default: locked if missing)
 */

export const LOCAL_LOCK_META = {
  provider: "local" as const,
  model: "local-data",
  aiLocked: true,
  costUsd: 0,
  tokensUsed: 0,
  recommendationSource: "local-data-lock",
};

export function isAiLocalOnly(): boolean {
  if (process.env.AI_LOCAL_ONLY === "true") return true;
  if (process.env.AI_DISABLE_REMOTE === "true") return true;
  if (process.env.AI_PRIMARY_PROVIDER === "local") return true;
  if ((process.env.AI_ENV || "development") !== "production") return true;
  return false;
}

export function logAiLock(endpoint: string): void {
  console.log(
    `[AI LOCK] Remote AI disabled. Using local-data recommendation. Endpoint=${endpoint} Cost=$0 Tokens=0`
  );
}

export function localLockResponse(analysis: string, endpoint: string) {
  logAiLock(endpoint);
  return {
    success: true,
    analysis: `Local Analysis Mode - using draft database, no paid AI token used.\n\n${analysis}`,
    provider: LOCAL_LOCK_META.provider,
    model: LOCAL_LOCK_META.model,
    aiLocked: true,
    costUsd: 0,
    tokensUsed: 0,
    recommendationSource: LOCAL_LOCK_META.recommendationSource,
    latencyMs: 0,
    cached: true,
    tier: "local",
  };
}

export function localLockExplanation(analysis: string, endpoint: string) {
  logAiLock(endpoint);
  return {
    success: true,
    explanation: `Local Analysis Mode - using draft database, no paid AI token used.\n\n${analysis}`,
    provider: LOCAL_LOCK_META.provider,
    model: LOCAL_LOCK_META.model,
    aiLocked: true,
    costUsd: 0,
    tokensUsed: 0,
    latencyMs: 0,
    cached: true,
  };
}

export function localLockRouterResponse(text: string, endpoint: string) {
  logAiLock(endpoint);
  return {
    success: true,
    text: `Local Analysis Mode - using draft database, no paid AI token used.\n\n${text}`,
    provider: "local" as const,
    model: "local-data",
    aiLocked: true,
    costUsd: 0,
    tokensUsed: 0,
    recommendationSource: "local-data-lock",
    latencyMs: 0,
    cached: false,
    localFallback: true,
  };
}
