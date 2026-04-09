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
    const { error } = await client.from("profiles").upsert({ id: user.id, ...starterProfile }, { onConflict: "id" });
    if (error) {
      throw error;
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseReady) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    const client = getSupabase();
    const finishLoading = () => {
      if (!cancelled) {
        setLoading(false);
      }
    };

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(async (event, nextSession) => {
      if (cancelled) return;

      if (event === "SIGNED_OUT") {
        setSession(null);
        finishLoading();
        return;
      }

      if (!nextSession) {
        return;
      }

      setSession(nextSession);
      finishLoading();

      if (nextSession.user) {
        try {
          await ensureProfile(nextSession.user);
        } catch (profileError) {
          if (!cancelled) {
            setAuthError(profileError.message || "Could not sync your profile yet.");
          }
        }
      }
    });

    // Supabase emits INITIAL_SESSION after storage is loaded, but we keep a soft
    // fallback so the shell never hangs forever if the event is delayed.
    const loadingTimeout = window.setTimeout(() => {
      finishLoading();
    }, 4000);

    return () => {
      cancelled = true;
      window.clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
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

