import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  defaultAchievements,
  defaultExerciseRanks,
  defaultGoals,
  defaultMealPlan,
  defaultNutritionSeed,
  defaultRoutines,
  starterProfile,
} from "../data/defaultRoutines";
import { getSupabase, isSupabaseReady } from "../lib/supabase";
import { rankFromLift } from "../lib/rankEngine";

const WEEK_DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const WEEKLY_ROUTINE = ["Push", "Pull", "Legs", "Rest", "Push", "Pull", "Active Recovery"];
const LEGACY_DEMO_PROFILE = { level: 27, xp: 410, streak: 46 };
const LEGACY_DEMO_WORKOUTS = ["Legs", "Push", "Pull", "Full Body", "Push", "Legs", "Pull"];

function toDayString(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function computeNextLevel(xp) {
  return Math.max(1, Math.floor(xp / 100) + 1);
}

function dayDiff(fromDay, toDay) {
  const start = new Date(`${fromDay}T00:00:00Z`);
  const end = new Date(`${toDay}T00:00:00Z`);
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

function latestBodyweightValue(log = []) {
  const latest = [...log]
    .sort((a, b) => String(a.logged_at ?? "").localeCompare(String(b.logged_at ?? "")))
    .at(-1);
  const weight = Number(latest?.weight_kg ?? 70);
  return Number.isFinite(weight) && weight > 0 ? weight : 70;
}

function computeNextStreak(workouts, currentStreak, completedAt) {
  const completionDay = toDayString(new Date(completedAt));
  const existingDays = [...new Set((workouts ?? []).map((workout) => toDayString(new Date(workout.completed_at))))];

  if (!existingDays.length) return 1;
  if (existingDays.includes(completionDay)) return Math.max(1, Number(currentStreak ?? 0));

  const lastDay = existingDays.sort((a, b) => b.localeCompare(a))[0];
  return dayDiff(lastDay, completionDay) === 1 ? Math.max(1, Number(currentStreak ?? 0)) + 1 : 1;
}

function isLegacyProfileSeeded(profileRow) {
  if (!profileRow) return false;

  return (
    Number(profileRow.level) === LEGACY_DEMO_PROFILE.level &&
    Number(profileRow.xp) === LEGACY_DEMO_PROFILE.xp &&
    Number(profileRow.streak) === LEGACY_DEMO_PROFILE.streak
  );
}

function isLikelyLegacyDemoData(workouts, achievements, bodyweightLog) {
  const workoutNames = (workouts ?? []).map((workout) => workout.routine_name);
  const hasOnlyLegacyWorkoutNames =
    workoutNames.length > 0 &&
    workoutNames.every((name) => LEGACY_DEMO_WORKOUTS.includes(name));

  const unlockedCount = (achievements ?? []).filter((achievement) => achievement.unlocked).length;
  const isLikelyLegacyAchievements = unlockedCount >= 3;
  const isLikelyLegacyBodyweight = (bodyweightLog ?? []).length <= 3;
  const noWorkoutHistory = workoutNames.length === 0;

  return hasOnlyLegacyWorkoutNames || isLikelyLegacyAchievements || isLikelyLegacyBodyweight || noWorkoutHistory;
}

function shouldResetProgressToStarter(profileRow, workouts) {
  if (!profileRow) return false;
  if ((workouts ?? []).length > 0) return false;

  return (
    Number(profileRow.level ?? starterProfile.level) !== starterProfile.level ||
    Number(profileRow.xp ?? starterProfile.xp) !== starterProfile.xp ||
    Number(profileRow.streak ?? starterProfile.streak) !== starterProfile.streak
  );
}

export function useWorkouts(user) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [routines, setRoutines] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [workoutSets, setWorkoutSets] = useState([]);
  const [bodyweightLog, setBodyweightLog] = useState([]);
  const [goals, setGoals] = useState([]);
  const [scheduleCompletions, setScheduleCompletions] = useState([]);
  const [friends, setFriends] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [galleryEntries, setGalleryEntries] = useState([]);
  const [syncStamp, setSyncStamp] = useState(null);
  const seedAttempted = useRef(false);
  const legacyCleanupAttempted = useRef(false);

  const fetchFriends = useCallback(async (client, userId) => {
    const { data: friendRows, error: friendError } = await client
      .from("friends")
      .select("id, friend_id, status, created_at")
      .eq("user_id", userId)
      .eq("status", "accepted");

    if (friendError || !friendRows?.length) {
      return [];
    }

    const friendIds = friendRows.map((row) => row.friend_id);
    const [{ data: profiles }, { data: recentWorkouts }] = await Promise.all([
      client.from("profiles").select("id, username, bio, avatar_color, level, xp, streak").in("id", friendIds),
      client
        .from("workouts")
        .select("id, user_id, routine_name, duration_seconds, volume_kg, sets_completed, records_broken, notes, completed_at")
        .in("user_id", friendIds)
        .order("completed_at", { ascending: false }),
    ]);

    return friendRows.map((row) => ({
      ...row,
      profile: profiles?.find((profileItem) => profileItem.id === row.friend_id) ?? null,
      workout: recentWorkouts?.find((workout) => workout.user_id === row.friend_id) ?? null,
    }));
  }, []);

  const seedDefaults = useCallback(
    async (client, userId) => {
      await client.from("profiles").upsert({ id: userId, ...starterProfile }, { onConflict: "id" });

      const { data: existingRoutines } = await client.from("routines").select("id").eq("user_id", userId).limit(1);
      if (!existingRoutines?.length) {
        const routineRows = defaultRoutines.map((routine) => ({ user_id: userId, name: routine.name }));
        const { data: insertedRoutines } = await client.from("routines").insert(routineRows).select("id, name");

        if (insertedRoutines?.length) {
          const exerciseRows = insertedRoutines.flatMap((routine) => {
            const source = defaultRoutines.find((entry) => entry.name === routine.name);
            return source.exercises.map((exercise) => ({
              routine_id: routine.id,
              ...exercise,
            }));
          });
          await client.from("routine_exercises").insert(exerciseRows);
        }
      }

      const { data: goalsExist } = await client.from("goals").select("id").eq("user_id", userId).limit(1);
      if (!goalsExist?.length) {
        await client.from("goals").insert(defaultGoals.map((goal) => ({ user_id: userId, ...goal })));
      }

      const { data: achievementsExist } = await client.from("achievements").select("id").eq("user_id", userId).limit(1);
      if (!achievementsExist?.length && defaultAchievements.length) {
        await client.from("achievements").insert(defaultAchievements.map((achievement) => ({ user_id: userId, ...achievement })));
      }

      const { data: mealPlansExist } = await client.from("meal_plan_entries").select("id").eq("user_id", userId).limit(1);
      if (!mealPlansExist?.length && defaultMealPlan.length) {
        await client.from("meal_plan_entries").insert(defaultMealPlan.map((entry) => ({ user_id: userId, ...entry })));
      }

      const { data: galleryExists } = await client.from("exercise_rank_entries").select("id").eq("user_id", userId).limit(1);
      if (!galleryExists?.length && defaultExerciseRanks.length) {
        await client.from("exercise_rank_entries").insert(defaultExerciseRanks.map((entry) => ({ user_id: userId, ...entry })));
      }

      const { data: nutritionExists } = await client.from("nutrition_log").select("id").eq("user_id", userId).limit(1);
      if (!nutritionExists?.length && defaultNutritionSeed.length) {
        await client.from("nutrition_log").insert(defaultNutritionSeed.map((entry) => ({ user_id: userId, log_date: toDayString(), ...entry })));
      }

      const { data: friendExists } = await client.from("friends").select("id").eq("user_id", userId).limit(1);
      if (!friendExists?.length) {
        const { data: publicProfiles } = await client
          .from("profiles")
          .select("id")
          .neq("id", userId)
          .eq("is_public", true)
          .limit(3);

        if (publicProfiles?.length) {
          await client.from("friends").insert(publicProfiles.map((profileItem) => ({ user_id: userId, friend_id: profileItem.id, status: "accepted" })));
        }
      }
    },
    [],
  );

  const cleanupLegacyDemoData = useCallback(
    async (client, userId, routineIds = []) => {
      await Promise.all([
        client.from("nutrition_log").delete().eq("user_id", userId),
        client.from("workout_sets").delete().eq("user_id", userId),
        client.from("workouts").delete().eq("user_id", userId),
        client.from("goals").delete().eq("user_id", userId),
        client.from("bodyweight_log").delete().eq("user_id", userId),
        client.from("schedule_completions").delete().eq("user_id", userId),
        client.from("achievements").delete().eq("user_id", userId),
        client.from("meal_plan_entries").delete().eq("user_id", userId),
        client.from("exercise_rank_entries").delete().eq("user_id", userId),
        client.from("profiles").update(starterProfile).eq("id", userId),
      ]);

      if (routineIds.length) {
        await client.from("routines").delete().in("id", routineIds);
      }

      seedAttempted.current = false;
      await seedDefaults(client, userId);
    },
    [seedDefaults],
  );

  const normalizeLegacyProfileStats = useCallback(async (client, userId) => {
    await client
      .from("profiles")
      .update({
        level: starterProfile.level,
        xp: starterProfile.xp,
        streak: starterProfile.streak,
        bio: starterProfile.bio,
      })
      .eq("id", userId);
  }, []);

  const refresh = useCallback(async () => {
    if (!user?.id || !isSupabaseReady) {
      setLoading(false);
      return;
    }

    const client = getSupabase();
    setLoading(true);
    setError("");

    const responses = await Promise.all([
      client.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      client.from("routines").select("id, user_id, name, created_at, routine_exercises(*)").eq("user_id", user.id).order("created_at", { ascending: true }),
      client.from("workouts").select("*").eq("user_id", user.id).order("completed_at", { ascending: false }),
      client.from("workout_sets").select("*").eq("user_id", user.id).order("completed_at", { ascending: false }),
      client.from("bodyweight_log").select("*").eq("user_id", user.id).order("logged_at", { ascending: true }),
      client.from("goals").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      client.from("schedule_completions").select("*").eq("user_id", user.id).order("completed_date", { ascending: false }),
      client.from("achievements").select("*").eq("user_id", user.id).order("created_at", { ascending: true }),
      client.from("meal_plan_entries").select("*").eq("user_id", user.id).order("day_key", { ascending: true }),
      client.from("exercise_rank_entries").select("*").eq("user_id", user.id).order("lp", { ascending: false }),
    ]);

    const [profileRes, routinesRes, workoutsRes, workoutSetsRes, weightRes, goalsRes, scheduleRes, achievementsRes, mealPlansRes, galleryRes] = responses;
    const queryError = responses.find((response) => response.error)?.error;

    if (queryError) {
      setError(queryError.message);
    }

    if (!legacyCleanupAttempted.current && isLegacyProfileSeeded(profileRes.data)) {
      legacyCleanupAttempted.current = true;

      if (isLikelyLegacyDemoData(workoutsRes.data, achievementsRes.data, weightRes.data)) {
        await cleanupLegacyDemoData(
          client,
          user.id,
          (routinesRes.data ?? []).map((routine) => routine.id),
        );
      } else {
        await normalizeLegacyProfileStats(client, user.id);
      }

      await refresh();
      return;
    }

    if (!seedAttempted.current) {
      const shouldSeed =
        !routinesRes.data?.length &&
        !workoutsRes.data?.length &&
        !weightRes.data?.length &&
        !goalsRes.data?.length &&
        !achievementsRes.data?.length &&
        !mealPlansRes.data?.length &&
        !galleryRes.data?.length;

      if (shouldSeed) {
        seedAttempted.current = true;
        await seedDefaults(client, user.id);
        await refresh();
        return;
      }
    }

    if (shouldResetProgressToStarter(profileRes.data, workoutsRes.data)) {
      await normalizeLegacyProfileStats(client, user.id);
      profileRes.data = {
        ...profileRes.data,
        level: starterProfile.level,
        xp: starterProfile.xp,
        streak: starterProfile.streak,
        bio: profileRes.data?.bio || starterProfile.bio,
      };
    }

    setProfile(profileRes.data);
    setRoutines((routinesRes.data ?? []).map((routine) => ({ ...routine, routine_exercises: (routine.routine_exercises ?? []).sort((a, b) => a.sort_order - b.sort_order) })));
    setWorkouts(workoutsRes.data ?? []);
    setWorkoutSets(workoutSetsRes.data ?? []);
    setBodyweightLog(weightRes.data ?? []);
    setGoals(goalsRes.data ?? []);
    setScheduleCompletions(scheduleRes.data ?? []);
    setAchievements(achievementsRes.data ?? []);
    setMealPlans(mealPlansRes.data ?? []);
    setGalleryEntries(galleryRes.data ?? []);
    setFriends(await fetchFriends(client, user.id));
    setLoading(false);
    setSyncStamp(new Date().toISOString());
  }, [cleanupLegacyDemoData, fetchFriends, normalizeLegacyProfileStats, seedDefaults, user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveProfile = useCallback(
    async (updates) => {
      const client = getSupabase();
      const payload = { id: user.id, ...updates };
      const { data, error: updateError } = await client.from("profiles").upsert(payload, { onConflict: "id" }).select("*").single();
      if (updateError) throw updateError;
      setProfile(data);
      return data;
    },
    [user?.id],
  );

  const saveRoutine = useCallback(
    async (routine) => {
      const client = getSupabase();
      let routineId = routine.id;

      if (routineId) {
        const { error: routineError } = await client.from("routines").update({ name: routine.name }).eq("id", routineId).eq("user_id", user.id);
        if (routineError) throw routineError;
        await client.from("routine_exercises").delete().eq("routine_id", routineId);
      } else {
        const { data, error: insertError } = await client.from("routines").insert({ user_id: user.id, name: routine.name }).select("id").single();
        if (insertError) throw insertError;
        routineId = data.id;
      }

      if (routine.exercises?.length) {
        const { error: exercisesError } = await client.from("routine_exercises").insert(
          routine.exercises.map((exercise, index) => ({
            routine_id: routineId,
            exercise_name: exercise.exercise_name,
            sets: Number(exercise.sets ?? 3),
            kg: Number(exercise.kg ?? 0),
            reps: Number(exercise.reps ?? 8),
            sort_order: Number(exercise.sort_order ?? index + 1),
            muscle_group: exercise.muscle_group ?? "General",
          })),
        );
        if (exercisesError) throw exercisesError;
      }

      await refresh();
    },
    [refresh, user?.id],
  );

  const duplicateRoutine = useCallback(
    async (routine) => {
      await saveRoutine({
        name: `${routine.name} Copy`,
        exercises: routine.routine_exercises.map((exercise, index) => ({ ...exercise, sort_order: index + 1 })),
      });
    },
    [saveRoutine],
  );

  const deleteRoutine = useCallback(
    async (routineId) => {
      const client = getSupabase();
      await client.from("routines").delete().eq("id", routineId).eq("user_id", user.id);
      await refresh();
    },
    [refresh, user?.id],
  );

  const saveGoal = useCallback(
    async (goal) => {
      const client = getSupabase();
      if (goal.id) {
        await client.from("goals").update(goal).eq("id", goal.id).eq("user_id", user.id);
      } else {
        await client.from("goals").insert({ user_id: user.id, ...goal });
      }
      await refresh();
    },
    [refresh, user?.id],
  );

  const deleteGoal = useCallback(
    async (goalId) => {
      const client = getSupabase();
      await client.from("goals").delete().eq("id", goalId).eq("user_id", user.id);
      setGoals((current) => current.filter((goal) => goal.id !== goalId));
    },
    [user?.id],
  );

  const logBodyweight = useCallback(
    async (weightKg) => {
      const client = getSupabase();
      await client.from("bodyweight_log").insert({ user_id: user.id, weight_kg: Number(weightKg), logged_at: toDayString() });
      await refresh();
    },
    [refresh, user?.id],
  );

  const toggleScheduleBlock = useCallback(
    async (blockId, completedDate = toDayString()) => {
      const client = getSupabase();
      const existing = scheduleCompletions.find((entry) => entry.block_id === blockId && entry.completed_date === completedDate);
      if (existing) {
        await client.from("schedule_completions").delete().eq("id", existing.id);
      } else {
        await client.from("schedule_completions").insert({ user_id: user.id, block_id: blockId, completed_date: completedDate });
      }
      await refresh();
    },
    [refresh, scheduleCompletions, user?.id],
  );

  const saveMealPlanEntry = useCallback(
    async (entry) => {
      const client = getSupabase();
      const existing = mealPlans.find((item) => item.day_key === entry.day_key && item.meal_type === entry.meal_type);
      if (existing) {
        await client.from("meal_plan_entries").update({ meal_text: entry.meal_text }).eq("id", existing.id).eq("user_id", user.id);
      } else {
        await client.from("meal_plan_entries").insert({ user_id: user.id, ...entry });
      }
      await refresh();
    },
    [mealPlans, refresh, user?.id],
  );

  const resetMealPlan = useCallback(async () => {
    const client = getSupabase();
    await client.from("meal_plan_entries").delete().eq("user_id", user.id);
    await client.from("meal_plan_entries").insert(defaultMealPlan.map((entry) => ({ user_id: user.id, ...entry })));
    await refresh();
  }, [refresh, user?.id]);

  const saveExerciseRank = useCallback(
    async (entry) => {
      const client = getSupabase();
      const bodyweightKg = latestBodyweightValue(bodyweightLog);
      const ranking = rankFromLift({
        weightKg: Number(entry.weight_kg ?? 0),
        reps: Number(entry.reps ?? 1),
        bodyweightKg,
      });
      const payload = {
        ...entry,
        lp: ranking.lp,
        tier: ranking.tier,
      };

      if (entry.id) {
        await client.from("exercise_rank_entries").update(payload).eq("id", entry.id).eq("user_id", user.id);
      } else {
        await client.from("exercise_rank_entries").insert({ user_id: user.id, ...payload });
      }
      await refresh();
    },
    [bodyweightLog, refresh, user?.id],
  );

  const syncAchievements = useCallback(
    async ({ nextStreak, allWorkoutSets }) => {
      const client = getSupabase();
      const nextAchievements = achievements.map((achievement) => {
        if (achievement.slug === "first-workout") {
          return { ...achievement, unlocked: true, progress: 100 };
        }
        if (achievement.slug === "10-day-streak") {
          return { ...achievement, unlocked: nextStreak >= 10, progress: Math.min(100, nextStreak * 10) };
        }
        if (achievement.slug === "30-day-discipline") {
          return { ...achievement, unlocked: nextStreak >= 30, progress: Math.min(100, Math.round((nextStreak / 30) * 100)) };
        }
        if (achievement.slug === "100kg-bench") {
          const benchHit = allWorkoutSets.some((set) => set.exercise_name === "Bench Press" && Number(set.weight_kg) >= 100);
          return { ...achievement, unlocked: benchHit, progress: benchHit ? 100 : 80 };
        }
        return achievement;
      });

      await Promise.all(
        nextAchievements.map((achievement) =>
          client
            .from("achievements")
            .update({ unlocked: achievement.unlocked, progress: achievement.progress })
            .eq("id", achievement.id)
            .eq("user_id", user.id),
        ),
      );
    },
    [achievements, user?.id],
  );

  const finishWorkout = useCallback(
    async (session) => {
      const client = getSupabase();
      const bodyweightKg = latestBodyweightValue(bodyweightLog);
      const allSets = session.exercises.flatMap((exercise) =>
        exercise.sets
          .filter((set) => set.completed && Number(set.kg) > 0 && Number(set.reps) > 0)
          .map((set, index) => ({
            exercise_name: exercise.exercise_name,
            muscle_group: exercise.muscle_group,
            set_number: index + 1,
            weight_kg: Number(set.kg),
            reps: Number(set.reps),
          })),
      );
      const volumeKg = allSets.reduce((sum, set) => sum + set.weight_kg * set.reps, 0);
      const setsCompleted = allSets.length;
      const recordsBroken = allSets.filter((set) => set.weight_kg >= 100 || set.reps >= 12).length;

      const { data: insertedWorkout, error: workoutError } = await client
        .from("workouts")
        .insert({
          user_id: user.id,
          routine_name: session.routine_name,
          duration_seconds: session.duration_seconds,
          volume_kg: volumeKg,
          sets_completed: setsCompleted,
          records_broken: recordsBroken,
          notes: session.notes || "Session complete.",
          completed_at: new Date().toISOString(),
        })
        .select("*")
        .single();
      if (workoutError) throw workoutError;

      const setRows = allSets.map((set) => ({ ...set, workout_id: insertedWorkout.id, user_id: user.id, completed_at: insertedWorkout.completed_at }));
      if (setRows.length) {
        await client.from("workout_sets").insert(setRows);
      }

      const bestSetsByExercise = allSets.reduce((accumulator, set) => {
        const ranking = rankFromLift({ weightKg: set.weight_kg, reps: set.reps, bodyweightKg });
        const current = accumulator[set.exercise_name];
        if (!current || ranking.lp > current.lp) {
          accumulator[set.exercise_name] = {
            exercise_name: set.exercise_name,
            category: set.muscle_group ?? "General",
            weight_kg: set.weight_kg,
            reps: set.reps,
            lp: ranking.lp,
            tier: ranking.tier,
          };
        }
        return accumulator;
      }, {});
      const rankPayload = Object.values(bestSetsByExercise);

      if (rankPayload.length) {
        const exerciseNames = rankPayload.map((entry) => entry.exercise_name);
        const { data: existingRankRows } = await client
          .from("exercise_rank_entries")
          .select("id, exercise_name")
          .eq("user_id", user.id)
          .in("exercise_name", exerciseNames);

        const existingByName = new Map((existingRankRows ?? []).map((entry) => [entry.exercise_name, entry]));
        const updates = [];
        const inserts = [];

        rankPayload.forEach((entry) => {
          const existing = existingByName.get(entry.exercise_name);
          if (existing) {
            updates.push(
              client
                .from("exercise_rank_entries")
                .update(entry)
                .eq("id", existing.id)
                .eq("user_id", user.id),
            );
          } else {
            inserts.push({ user_id: user.id, ...entry });
          }
        });

        if (updates.length) {
          await Promise.all(updates);
        }
        if (inserts.length) {
          await client.from("exercise_rank_entries").insert(inserts);
        }
      }

      const nextXp = Number(profile?.xp ?? starterProfile.xp) + setsCompleted * 3;
      const nextStreak = computeNextStreak(workouts, profile?.streak ?? starterProfile.streak, insertedWorkout.completed_at);
      const nextLevel = computeNextLevel(nextXp);
      const { data: updatedProfile } = await client
        .from("profiles")
        .update({ xp: nextXp, streak: nextStreak, level: nextLevel })
        .eq("id", user.id)
        .select("*")
        .single();

      await syncAchievements({ nextStreak, allWorkoutSets: [...workoutSets, ...setRows] });
      setProfile(updatedProfile);
      await refresh();

      return {
        ...insertedWorkout,
        xpGained: setsCompleted * 3,
        level: nextLevel,
        muscles: [...new Set(session.exercises.map((exercise) => exercise.muscle_group))],
        rankHighlights: rankPayload.sort((a, b) => b.lp - a.lp).slice(0, 3),
      };
    },
    [bodyweightLog, profile, refresh, syncAchievements, user?.id, workoutSets, workouts],
  );

  const addFriend = useCallback(
    async (friendId) => {
      const client = getSupabase();
      await client.from("friends").insert({ user_id: user.id, friend_id: friendId, status: "accepted" });
      await refresh();
    },
    [refresh, user?.id],
  );

  const removeFriend = useCallback(
    async (friendId) => {
      const client = getSupabase();
      await client.from("friends").delete().eq("user_id", user.id).eq("friend_id", friendId);
      await refresh();
    },
    [refresh, user?.id],
  );

  const exportUserData = useCallback(() => ({ profile, routines, workouts, workoutSets, bodyweightLog, goals, scheduleCompletions, achievements, mealPlans, galleryEntries }), [achievements, bodyweightLog, galleryEntries, goals, mealPlans, profile, routines, scheduleCompletions, workoutSets, workouts]);

  const resetAllData = useCallback(async () => {
    const client = getSupabase();
    await Promise.all([
      client.from("nutrition_log").delete().eq("user_id", user.id),
      client.from("workout_sets").delete().eq("user_id", user.id),
      client.from("workouts").delete().eq("user_id", user.id),
      client.from("goals").delete().eq("user_id", user.id),
      client.from("bodyweight_log").delete().eq("user_id", user.id),
      client.from("schedule_completions").delete().eq("user_id", user.id),
      client.from("friends").delete().eq("user_id", user.id),
      client.from("achievements").delete().eq("user_id", user.id),
      client.from("meal_plan_entries").delete().eq("user_id", user.id),
      client.from("exercise_rank_entries").delete().eq("user_id", user.id),
    ]);
    const routineIds = routines.map((routine) => routine.id);
    if (routineIds.length) {
      await client.from("routines").delete().in("id", routineIds);
    }
    seedAttempted.current = false;
    await seedDefaults(client, user.id);
    await refresh();
  }, [refresh, routines, seedDefaults, user?.id]);

  const weeklyPlan = useMemo(
    () => WEEK_DAYS.map((day, index) => ({ day, routine: WEEKLY_ROUTINE[index], sets: index === 3 ? 0 : 15 - (index % 3), duration: index === 3 ? "Recovery" : `${55 + index * 5} min` })),
    [],
  );

  const getPreviousPerformance = useCallback(
    (exerciseName) => workoutSets.find((set) => set.exercise_name === exerciseName) ?? null,
    [workoutSets],
  );

  return useMemo(
    () => ({
      loading,
      error,
      profile,
      routines,
      workouts,
      workoutSets,
      bodyweightLog,
      goals,
      scheduleCompletions,
      achievements,
      mealPlans,
      galleryEntries,
      friends,
      weeklyPlan,
      syncStamp,
      refresh,
      saveProfile,
      saveRoutine,
      duplicateRoutine,
      deleteRoutine,
      saveGoal,
      deleteGoal,
      logBodyweight,
      toggleScheduleBlock,
      saveMealPlanEntry,
      resetMealPlan,
      saveExerciseRank,
      finishWorkout,
      addFriend,
      removeFriend,
      getPreviousPerformance,
      exportUserData,
      resetAllData,
    }),
    [
      achievements,
      addFriend,
      bodyweightLog,
      deleteGoal,
      deleteRoutine,
      error,
      exportUserData,
      resetAllData,
      finishWorkout,
      friends,
      galleryEntries,
      getPreviousPerformance,
      goals,
      loading,
      logBodyweight,
      mealPlans,
      profile,
      refresh,
      removeFriend,
      routines,
      saveExerciseRank,
      saveGoal,
      saveMealPlanEntry,
      saveProfile,
      saveRoutine,
      scheduleCompletions,
      syncStamp,
      toggleScheduleBlock,
      weeklyPlan,
      workoutSets,
      workouts,
      duplicateRoutine,
      resetMealPlan,
    ],
  );
}

