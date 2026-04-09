import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabase, isSupabaseReady } from "../lib/supabase";
import { starterProfile } from "../data/defaultRoutines";

export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  const ensureProfile = useCallback(async (user) => {
    if (!user || !isSupabaseReady) {
      return;
    }

    const client = getSupabase();
    await client.from("profiles").upsert({ id: user.id, ...starterProfile }, { onConflict: "id" });
  }, []);

  useEffect(() => {
    if (!isSupabaseReady) {
      setLoading(false);
      return undefined;
    }

    const client = getSupabase();

    client.auth.getSession().then(async ({ data, error }) => {
      if (error) {
        setAuthError(error.message);
      }

      setSession(data.session ?? null);
      if (data.session?.user) {
        await ensureProfile(data.session.user);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        await ensureProfile(nextSession.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [ensureProfile]);

  const signIn = useCallback(async ({ email, password }) => {
    const client = getSupabase();
    setAuthError("");
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
  }, []);

  const signUp = useCallback(async ({ email, password }) => {
    const client = getSupabase();
    setAuthError("");
    const { error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setAuthError(error.message);
      throw error;
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const client = getSupabase();
    setAuthError("");
    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setAuthError(error.message);
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (email) => {
    const client = getSupabase();
    setAuthError("");
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

    if (error) {
      setAuthError(error.message);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    const client = getSupabase();
    await client.auth.signOut();
    setSession(null);
  }, []);

  return useMemo(
    () => ({
      loading,
      session,
      user: session?.user ?? null,
      authError,
      signIn,
      signUp,
      signOut,
      signInWithGoogle,
      resetPassword,
      isSupabaseReady,
    }),
    [authError, loading, resetPassword, session, signIn, signInWithGoogle, signOut, signUp],
  );
}

