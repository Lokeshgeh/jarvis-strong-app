import { useState } from "react";

export default function Login({ auth }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-10">
      <div className="mobile-frame glass-card rounded-[32px] border border-white/10 bg-card p-6 shadow-glow">
        <div className="rounded-[28px] border border-blue/20 bg-gradient-to-br from-blue/15 to-card p-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue text-3xl font-bold text-[#03131d]">JS</div>
          <p className="mt-4 text-xs uppercase tracking-[0.28em] text-text3">Jarvis Strong</p>
          <h1 className="mt-2 text-3xl font-bold text-text">Gamified Fitness Tracker</h1>
          <p className="mt-3 text-sm text-text2">Build discipline. Track progress. Dominate. Sign in to sync workouts, nutrition, ranks, and schedule completion worldwide.</p>
        </div>

        <div className="mt-5 space-y-4">
          <button type="button" onClick={async () => { try { await auth.signInWithGoogle(); } catch {} }} className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-text">Sign in with Google</button>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-text3"><span className="h-px flex-1 bg-white/10" />Or<span className="h-px flex-1 bg-white/10" /></div>
          <label className="block"><span className="mb-2 block text-sm text-text2">Email</span><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="you@example.com" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-text outline-none" /></label>
          <label className="block"><span className="mb-2 block text-sm text-text2">Password</span><input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="••••••••" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-text outline-none" /></label>
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
            className="w-full rounded-full bg-blue px-5 py-4 text-sm font-bold text-[#03131d]"
          >
            {mode === "signin" ? "Sign In" : "Create Account"}
          </button>
          <div className="flex items-center justify-between text-sm text-text2"><button type="button" onClick={() => setMode((current) => (current === "signin" ? "signup" : "signin"))} className="underline underline-offset-4">{mode === "signin" ? "Need an account? Create one" : "Already have an account? Sign in"}</button><button type="button" onClick={async () => { if (!email) { setMessage("Enter your email first."); return; } try { await auth.resetPassword(email); setMessage("Password reset email sent."); } catch { setMessage(auth.authError || "Could not send reset email."); } }} className="underline underline-offset-4">Forgot password?</button></div>
          {(message || auth.authError) && <div className="rounded-2xl border border-white/10 bg-[#090912] px-4 py-3 text-sm text-text2">{message || auth.authError}</div>}
        </div>
      </div>
    </div>
  );
}

