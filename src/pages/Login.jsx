import { useState } from "react";

export default function Login({ auth }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const featureCards = [
    {
      title: "Rank-first engine",
      body: "Every set updates exercise rank using 1RM + bodyweight. Progress is explainable, not random.",
      badge: "LP + XP",
    },
    {
      title: "Private by default social",
      body: "Post to friends first, then choose Discovery only when you want visibility.",
      badge: "Safe Social",
    },
    {
      title: "Consistency loop",
      body: "Finish today’s scheduled mission, protect streak momentum, and climb weekly leaderboards.",
      badge: "Daily Mission",
    },
  ];

  const handleGoogleSignIn = async () => {
    setMessage("");
    setSubmitting(true);
    try {
      await auth.signInWithGoogle();
    } catch {
      setMessage(auth.authError || "Google sign-in could not start.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailAuth = async () => {
    setMessage("");
    setSubmitting(true);

    try {
      if (mode === "signin") {
        await auth.signIn({ email, password });
      } else {
        await auth.signUp({ email, password });
        setMessage("Account created. Check your email if confirmation is enabled.");
      }
    } catch {
      setMessage(auth.authError || "Auth request failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setMessage("Enter your email first.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      await auth.resetPassword(email);
      setMessage("Password reset email sent.");
    } catch {
      setMessage(auth.authError || "Could not send reset email.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell min-h-screen px-4 py-8 md:py-12">
      <div className="mx-auto grid w-full max-w-[1080px] gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="rounded-[32px] border border-white/10 bg-card p-6 shadow-[0_30px_60px_rgba(2,6,23,0.45)]">
          <div className="rounded-[26px] border border-white/10 bg-[#0f172a] p-6 sm:p-7">
            <p className="text-xs uppercase tracking-[0.32em] text-blue">Jarvis Strong</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.05] text-text sm:text-5xl">
              Rank-first training.
              <br />
              Lift, score, repeat.
            </h1>
            <p className="mt-4 max-w-[55ch] text-sm leading-6 text-text2 sm:text-base">
              Stop generic tracking. Complete scheduled missions, earn lift points, and grow rank with clear rules tied to real work.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <article className="rounded-2xl border border-white/10 bg-[#020617] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-text3">Today</p>
                <p className="mt-2 text-lg font-bold text-text">Day 1 Lower</p>
                <p className="mt-1 text-sm text-text2">45 min • +120 XP</p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-[#020617] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-text3">Current</p>
                <p className="mt-2 text-lg font-bold text-text">Pioneer I</p>
                <p className="mt-1 text-sm text-text2">LP 380 / 500</p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-[#020617] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-text3">Streak</p>
                <p className="mt-2 text-lg font-bold text-text">3 days</p>
                <p className="mt-1 text-sm text-text2">Momentum live</p>
              </article>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {featureCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-white/10 bg-[#0f172a] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-text">{card.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-text2">{card.body}</p>
                  </div>
                  <span className="rounded-full border border-blue/35 bg-blue/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue">
                    {card.badge}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="rounded-[32px] border border-white/10 bg-card p-6 shadow-[0_30px_60px_rgba(2,6,23,0.45)]">
          <div className="rounded-[26px] border border-white/10 bg-[#0f172a] p-7 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue text-3xl font-bold text-[#03131d]">
              JS
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.32em] text-text3">Jarvis Strong</p>
            <h2 className="mt-3 text-4xl font-bold leading-[1] text-text">Start Day 1</h2>
            <p className="mt-4 text-sm leading-6 text-text2">
              Complete your mission today, sync progress to cloud, and begin climbing the rank ladder.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={submitting}
              className="w-full rounded-full border border-white/10 bg-[#0f172a] px-5 py-4 text-sm font-semibold text-text disabled:opacity-40"
            >
              Sign in with Google
            </button>

            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-text3">
              <span className="h-px flex-1 bg-white/10" />
              Or
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <label className="block">
              <span className="mb-2 block text-sm text-text2">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-white/10 bg-[#0f172a] px-4 py-4 text-text outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-text2">Password</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="........"
                className="w-full rounded-2xl border border-white/10 bg-[#0f172a] px-4 py-4 text-text outline-none"
              />
            </label>

            <button
              type="button"
              onClick={handleEmailAuth}
              disabled={submitting}
              className="w-full rounded-full bg-green px-5 py-4 text-sm font-bold text-[#05200f] disabled:opacity-40"
            >
              {mode === "signin" ? "Start Day 1 (Sign In)" : "Create Account"}
            </button>

            <div className="flex items-center justify-between text-sm text-text2">
              <button
                type="button"
                onClick={() => setMode((current) => (current === "signin" ? "signup" : "signin"))}
                className="underline underline-offset-4"
              >
                {mode === "signin" ? "Need an account? Create one" : "Already have an account? Sign in"}
              </button>
              <button
                type="button"
                onClick={async () => {
                  await handleResetPassword();
                }}
                className="underline underline-offset-4"
              >
                Forgot password?
              </button>
            </div>

            {(message || auth.authError) && (
              <div className="rounded-2xl border border-red/30 bg-red/10 px-4 py-3 text-sm text-red">
                {message || auth.authError}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
