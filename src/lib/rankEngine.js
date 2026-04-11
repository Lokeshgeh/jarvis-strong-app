function safeNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

export function estimateOneRepMax(weightKg, reps) {
  const weight = Math.max(0, safeNumber(weightKg));
  const repCount = Math.max(1, safeNumber(reps, 1));
  const cappedReps = Math.min(repCount, 15);
  return weight * (1 + cappedReps / 30);
}

export function calculateLiftPointScore({ oneRepMaxKg, bodyweightKg }) {
  const oneRep = Math.max(0, safeNumber(oneRepMaxKg));
  const bodyweight = Math.max(35, safeNumber(bodyweightKg, 70));
  const ratio = oneRep / bodyweight;
  return Math.max(0, Math.round(ratio * 220));
}

export function tierFromLp(lp) {
  const value = Math.max(0, safeNumber(lp));
  if (value >= 500) return "OLYMPIAN";
  if (value >= 400) return "DIAMOND II";
  if (value >= 300) return "DIAMOND I";
  if (value >= 200) return "TITAN II";
  if (value >= 100) return "TITAN I";
  return "PIONEER";
}

export function rankFromLift({ weightKg, reps, bodyweightKg }) {
  const oneRepMax = estimateOneRepMax(weightKg, reps);
  const lp = calculateLiftPointScore({ oneRepMaxKg: oneRepMax, bodyweightKg });
  const tier = tierFromLp(lp);
  return {
    oneRepMaxKg: Number(oneRepMax.toFixed(1)),
    lp,
    tier,
  };
}
