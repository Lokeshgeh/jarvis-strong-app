import { Icon } from "../icons";

export default function ProfileTab({ profile, workouts, achievements, routines, goals, onSaveProfile, onOpenSettings, onOpenRoutine, onOpenInfo }) {
  const stats = {
    workouts: workouts.length,
    streak: profile?.streak ?? 0,
    records: workouts.reduce((sum, workout) => sum + Number(workout.records_broken ?? 0), 0),
  };

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] border border-white/10 bg-card p-6 shadow-[0_14px_28px_rgba(2,6,23,0.45)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-[#03131d]" style={{ backgroundColor: profile?.avatar_color ?? "#00BFFF" }}>
              {(profile?.username ?? "Jarvis Strong")
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.24em] text-text3">Username</span>
                <input value={profile?.username ?? "Jarvis Strong"} onChange={(event) => onSaveProfile({ username: event.target.value })} className="w-full bg-transparent text-2xl font-bold text-text outline-none" />
              </label>
              <label className="mt-2 block">
                <span className="text-xs uppercase tracking-[0.24em] text-text3">Bio</span>
                <input value={profile?.bio ?? "Diamond II - Discipline-first builder"} onChange={(event) => onSaveProfile({ bio: event.target.value })} className="w-full bg-transparent text-sm text-text2 outline-none" />
              </label>
            </div>
          </div>
          <button type="button" onClick={onOpenSettings} className="rounded-full border border-white/10 bg-[#0f172a] p-3 text-text2">
            <Icon name="settings" className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-text3">
            <span>XP Progress</span>
            <span>{profile?.xp ?? 0} XP</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full border border-white/10 bg-[#0f172a]">
            <div className="h-full rounded-full bg-blue" style={{ width: `${Math.min(100, (profile?.xp ?? 0) % 100)}%` }} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[["Workouts", stats.workouts], ["Streak", stats.streak], ["Records", stats.records]].map(([label, value]) => (
            <div key={label} className="rounded-[22px] border border-white/10 bg-[#0f172a] p-4 text-center">
              <p className="text-xs uppercase tracking-[0.24em] text-text3">{label}</p>
              <p className="mt-2 text-2xl font-bold text-text">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-white/10 bg-card p-5 shadow-[0_14px_28px_rgba(2,6,23,0.45)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-text3">Achievements</p>
            <h3 className="mt-2 text-xl font-bold text-text">Badge wall</h3>
          </div>
          <button
            type="button"
            onClick={() => onOpenInfo("Achievements", "Achievements unlock automatically from your workout history, streaks, nutrition consistency, and performance milestones.")}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-text2"
          >
            View all
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {achievements.map((achievement) => (
            <button
              key={achievement.id}
              type="button"
              onClick={() => onOpenInfo(achievement.name, `${achievement.description}\nUnlock rule: ${achievement.unlock_rule}`)}
              className={`rounded-[22px] border p-4 text-left ${achievement.unlocked ? "border-gold/20 bg-gold/10" : "border-white/10 bg-[#0f172a]"}`}
            >
              <p className="text-sm font-semibold text-text">{achievement.name}</p>
              <p className="mt-2 text-xs text-text3">{achievement.unlocked ? "Unlocked" : `${achievement.progress}% progress`}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-white/10 bg-card p-5 shadow-[0_14px_28px_rgba(2,6,23,0.45)]">
        <p className="text-xs uppercase tracking-[0.24em] text-text3">Body stats</p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[["Height", "170 cm"], ["Weight", "49.8 kg"], ["BMI", "17.2"]].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-[#0f172a] p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-text3">{label}</p>
              <p className="mt-2 text-xl font-bold text-text">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-white/10 bg-card p-5 shadow-[0_14px_28px_rgba(2,6,23,0.45)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-text3">My Routines</p>
            <h3 className="mt-2 text-xl font-bold text-text">Quick launch</h3>
          </div>
          <span className="text-sm text-text3">{goals.length} active goals</span>
        </div>
        <div className="mt-4 space-y-3">
          {routines.map((routine) => (
            <button key={routine.id} type="button" onClick={() => onOpenRoutine(routine)} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-[#0f172a] p-4 text-left">
              <div>
                <p className="font-semibold text-text">{routine.name}</p>
                <p className="text-sm text-text3">{routine.routine_exercises.length} exercises</p>
              </div>
              <span className="text-blue">Open</span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-white/10 bg-gradient-to-br from-[#111827] to-card p-5 shadow-[0_14px_28px_rgba(2,6,23,0.45)]">
        <p className="text-xs uppercase tracking-[0.24em] text-text3">Subscription</p>
        <h3 className="mt-2 text-xl font-bold text-text">Jarvis Strong Premium</h3>
        <p className="mt-2 text-sm text-text2">Live cloud sync, workout history, nutrition analytics, and app-store packaging are already wired. Payments are the only missing production layer.</p>
      </section>
    </div>
  );
}
