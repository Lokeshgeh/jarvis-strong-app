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
    let loadingWatchdog;
    const finishLoading = () => {
      if (!cancelled) {
        setLoading(false);
      }
    };

    const queueProfileSync = (user) => {
      if (!user) return;

      window.setTimeout(() => {
        ensureProfile(user).catch((profileError) => {
          if (!cancelled) {
            setAuthError(profileError.message || "Could not sync your profile yet.");
          }
        });
      }, 0);
    };

    const getSessionWithRecovery = async () => {
      const firstAttempt = await client.auth.getSession();
      if (!firstAttempt.error || firstAttempt.data?.session) {
        return firstAttempt;
      }

      const message = (firstAttempt.error.message || "").toLowerCase();
      if (!message.includes("timeout") && !message.includes("timed out")) {
        return firstAttempt;
      }

      const refreshAttempt = await client.auth.refreshSession();
      if (!refreshAttempt.error || refreshAttempt.data?.session) {
        return { data: { session: refreshAttempt.data?.session ?? null }, error: null };
      }

      return client.auth.getSession();
    };

    const bootstrap = async () => {
      try {
        const { data, error } = await getSessionWithRecovery();
        if (cancelled) return;

        if (error && !data?.session) {
          setAuthError(error.message);
        } else {
          setAuthError("");
        }

        setSession(data?.session ?? null);
        if (data?.session?.user) {
          queueProfileSync(data.session.user);
        }
      } catch (error) {
        if (!cancelled) {
          setAuthError(error.message || "Could not restore session.");
        }
      } finally {
        finishLoading();
      }
    };

    loadingWatchdog = window.setTimeout(() => {
      finishLoading();
    }, 9000);

    bootstrap();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, nextSession) => {
      if (cancelled) return;

      if (event === "SIGNED_OUT") {
        setAuthError("");
        setSession(null);
        finishLoading();
        return;
      }

      if (!nextSession) {
        return;
      }

      setAuthError("");
      setSession(nextSession);
      finishLoading();
      queueProfileSync(nextSession.user);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(loadingWatchdog);
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

