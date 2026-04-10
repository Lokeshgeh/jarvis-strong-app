import { useState } from "react";

export default function Login({ auth }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-10">
      <div className="mobile-frame px-2">
        <div className="mx-auto max-w-[430px] rounded-[40px] border border-white/70 bg-[#f4f1ec]/95 p-6 shadow-[0_28px_52px_rgba(110,94,74,0.12)] backdrop-blur-xl">
          <div className="rounded-[32px] border border-white/80 bg-white p-8 text-center shadow-[0_18px_28px_rgba(110,94,74,0.08)]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange text-3xl font-bold text-white shadow-[0_16px_28px_rgba(227,106,67,0.24)]">JS</div>
            <p className="mt-5 text-xs uppercase tracking-[0.32em] text-text3">Jarvis Strong</p>
            <h1 className="mt-3 text-5xl font-bold leading-[0.9] text-text">
              Let&apos;s start
              <br />
              strong!
            </h1>
            <p className="mt-4 text-sm leading-6 text-text2">
              Build discipline. Track progress. Dominate. Sign in to sync workouts, nutrition, ranks, and schedule completion worldwide.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <button
              type="button"
              onClick={async () => {
                try {
                  await auth.signInWithGoogle();
                } catch {}
              }}
              className="w-full rounded-full bg-[#1f1e1c] px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_28px_rgba(31,30,28,0.18)]"
            >
              Sign in with Google
            </button>

            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-text3">
              <span className="h-px flex-1 bg-black/8" />
              Or
              <span className="h-px flex-1 bg-black/8" />
            </div>

            <label className="block">
              <span className="mb-2 block text-sm text-text2">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-[24px] border border-black/6 bg-white px-4 py-4 text-text outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-text2">Password</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="........"
                className="w-full rounded-[24px] border border-black/6 bg-white px-4 py-4 text-text outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
              />
            </label>

            <button
              type="button"
              onClick={async () => {
                try {
                  if (mode === "signin") {
                    await auth.signIn({ email, password });
                    setMessage("");
                  } else {
                    await auth.signUp({ email, password });
                    setMessage("Account created. Check your email if confirmation is enabled.");
                  }
                } catch {
                  setMessage(auth.authError || "Auth request failed.");
                }
              }}
              className="w-full rounded-full bg-orange px-5 py-4 text-sm font-bold text-white shadow-[0_18px_28px_rgba(227,106,67,0.24)]"
            >
              {mode === "signin" ? "Sign In" : "Create Account"}
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
                  if (!email) {
                    setMessage("Enter your email first.");
                    return;
                  }
                  try {
                    await auth.resetPassword(email);
                    setMessage("Password reset email sent.");
                  } catch {
                    setMessage(auth.authError || "Could not send reset email.");
                  }
                }}
                className="underline underline-offset-4"
              >
                Forgot password?
              </button>
            </div>

            {(message || auth.authError) && (
              <div className="rounded-[22px] border border-[#efcfbf] bg-[#fff5ef] px-4 py-3 text-sm text-[#9f5a3f]">
                {message || auth.authError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
