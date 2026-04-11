import { useState } from "react";

export default function Login({ auth }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-10">
      <div className="mobile-frame px-2">
        <div className="mx-auto max-w-[430px] rounded-[32px] border border-white/10 bg-card p-6 shadow-[0_30px_60px_rgba(2,6,23,0.45)]">
          <div className="rounded-[26px] border border-white/10 bg-[#0f172a] p-7 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue text-3xl font-bold text-[#03131d]">
              JS
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.32em] text-text3">Jarvis Strong</p>
            <h1 className="mt-3 text-4xl font-bold leading-[1] text-text">Build discipline. Rank up.</h1>
            <p className="mt-4 text-sm leading-6 text-text2">
              Complete today&apos;s workout mission, hit your nutrition target, and grow your level with real actions.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <button
              type="button"
              onClick={async () => {
                try {
                  await auth.signInWithGoogle();
                } catch {
                  // Error state is surfaced through auth.authError.
                }
              }}
              className="w-full rounded-full border border-white/10 bg-[#0f172a] px-5 py-4 text-sm font-semibold text-text"
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
              className="w-full rounded-full bg-green px-5 py-4 text-sm font-bold text-[#05200f]"
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
              <div className="rounded-2xl border border-red/30 bg-red/10 px-4 py-3 text-sm text-red">
                {message || auth.authError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
