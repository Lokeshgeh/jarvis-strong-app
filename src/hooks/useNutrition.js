import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabase, isSupabaseReady } from "../lib/supabase";

export function useNutrition(user) {
  const [nutritionEntries, setNutritionEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!user?.id || !isSupabaseReady) {
      setLoading(false);
      return;
    }

    const client = getSupabase();
    setLoading(true);
    const { data, error: queryError } = await client
      .from("nutrition_log")
      .select("*")
      .eq("user_id", user.id)
      .order("log_date", { ascending: false });

    if (queryError) {
      setError(queryError.message);
    }

    setNutritionEntries(data ?? []);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addFood = useCallback(
    async (entry) => {
      const client = getSupabase();
      const { error: insertError } = await client.from("nutrition_log").insert({ user_id: user.id, ...entry });
      if (insertError) throw insertError;
      await refresh();
    },
    [refresh, user?.id],
  );

  const updateFood = useCallback(
    async (entry) => {
      const client = getSupabase();
      const { error: updateError } = await client.from("nutrition_log").update(entry).eq("id", entry.id).eq("user_id", user.id);
      if (updateError) throw updateError;
      await refresh();
    },
    [refresh, user?.id],
  );

  const deleteFood = useCallback(
    async (entryId) => {
      const client = getSupabase();
      const { error: deleteError } = await client.from("nutrition_log").delete().eq("id", entryId).eq("user_id", user.id);
      if (deleteError) throw deleteError;
      setNutritionEntries((current) => current.filter((entry) => entry.id !== entryId));
    },
    [user?.id],
  );

  return useMemo(
    () => ({
      nutritionEntries,
      loading,
      error,
      refresh,
      addFood,
      updateFood,
      deleteFood,
    }),
    [addFood, deleteFood, error, loading, nutritionEntries, refresh, updateFood],
  );
}

