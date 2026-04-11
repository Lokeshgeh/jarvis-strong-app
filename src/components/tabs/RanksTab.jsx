import { useMemo, useState } from "react";
import VolumeBarChart from "../charts/VolumeBarChart";
import WeightLineChart from "../charts/WeightLineChart";
import { Icon } from "../icons";
import { useAppState } from "../../store/globalState";

function SegmentTabs({ items, active, onChange }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto rounded-full border border-white/10 bg-[#111827] p-1">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            active === item.id ? "bg-white text-[#0b1020]" : "text-text2"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function getRankFromLevel(level) {
  if (level >= 35) return "OLYMPIAN";
  if (level >= 25) return "DIAMOND II";
  if (level >= 16) return "TITAN II";
  if (level >= 10) return "TITAN I";
  if (level >= 5) return "PIONEER";
  return "ROOKIE";
}

export default function RanksTab({ profile, workouts, galleryEntries, onSaveExerciseRank, onOpenInfo }) {
  const { subTabs, setSubTab } = useAppState();
  const activeTab = subTabs.ranks;
  const [calculator, setCalculator] = useState({ exercise: "Bench Press", weight: 80, reps: 8 });
  const profileLevel = Number(profile?.level ?? 1);
  const profileXp = Number(profile?.xp ?? 0);
  const rankName = getRankFromLevel(profileLevel);
  const nextLevelXp = profileLevel * 100;
  const xpProgress = Math.min(100, Math.round(((profileXp % 100) / 100) * 100));
  const rankSeries = workouts.slice(0, 8).reverse().map((_, index) => Math.max(1, profileLevel - 7 + index));
  const labels = workouts
    .slice(0, 8)
    .reverse()
    .map((workout) => new Date(workout.completed_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }));
  const calculatedLp = Math.round(Number(calculator.weight) * 2.6 + Number(calculator.reps) * 15);
  const calculatedTier =
    calculatedLp > 620 ? "OLYMPIAN" : calculatedLp > 520 ? "DIAMOND II" : calculatedLp > 420 ? "TITAN II" : "PIONEER";
  const groupedMuscles = useMemo(
    () => [
      ["Arms", "3/3 Complete"],
      ["Legs", "4/6 Complete"],
      ["Core", "0/2 Complete"],
      ["Shoulders", "2/3 Complete"],
      ["Chest", "2/2 Complete"],
      ["Back", "4/4 Complete"],
    ],
    [],
  );

  return (
    <div className="space-y-5">
      <SegmentTabs
        items={[
          { id: "yourRank", label: "Your Rank" },
          { id: "bodygraph", label: "Bodygraph" },
          { id: "leagues", label: "Leagues" },
          { id: "gallery", label: "Gallery" },
          { id: "calculator", label: "Calculator" },
          { id: "analysis", label: "Analysis" },
        ]}
        active={activeTab}
        onChange={(next) => setSubTab("ranks", next)}
      />

      {activeTab === "yourRank" && (
        <div className="space-y-4">
          <section className="rounded-[24px] border border-purple/35 bg-[linear-gradient(135deg,#1f1b3a_0%,#0b1020_100%)] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-purple">Your current rank</p>
                <h2 className="mt-2 text-3xl font-bold text-text">
                  {rankName} • LV {profileLevel}
                </h2>
                <p className="mt-2 text-sm text-text2">XP {profileXp} / {nextLevelXp} to next level</p>
              </div>
              <button
                type="button"
                onClick={() => onOpenInfo("Share rank card", "Rank card sharing will export your current rank and XP progress as a social image.")}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-text2"
              >
                Share
              </button>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full border border-white/10 bg-[#0b1020]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#3b82f6,#22c55e)]"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </section>

          <section className="rounded-[24px] border border-white/10 bg-card p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-blue">How XP works</p>
            <div className="mt-3 space-y-2 text-sm text-text2">
              <p>+120 XP for completing a scheduled workout.</p>
              <p>+30 XP for closing your daily nutrition target.</p>
              <p className="text-text3">No XP is awarded for just browsing screens.</p>
            </div>
            <button
              type="button"
              onClick={() => onOpenInfo("XP economy", "XP comes from completed actions only. Finish workouts and nutrition targets to rank up.")}
              className="mt-4 rounded-full border border-white/10 bg-[#0f172a] px-4 py-2 text-sm font-semibold text-text"
            >
              View full XP rules
            </button>
          </section>

          <section className="rounded-[24px] border border-white/10 bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-text3">Rank overtime</p>
                <h3 className="mt-2 text-xl font-bold text-text">One month climb</h3>
              </div>
              <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-text2">1M</div>
            </div>
            <div className="chart-shell rounded-2xl border border-white/10 bg-[#0f172a] p-3">
              <WeightLineChart labels={labels} values={rankSeries} />
            </div>
          </section>
        </div>
      )}

      {activeTab === "bodygraph" && (
        <div className="space-y-5">
          <section className="rounded-[24px] border border-blue/20 bg-card p-5">
            <div className="grid grid-cols-2 gap-3">
              {["Front", "Back"].map((label) => (
                <div key={label} className="rounded-[22px] border border-white/10 bg-[#090912] p-4 text-center">
                  <div className="mx-auto h-44 w-28 rounded-[999px] border border-blue/25 bg-[radial-gradient(circle_at_center,rgba(0,191,255,0.25),transparent_70%)]" />
                  <p className="mt-3 text-xs uppercase tracking-[0.24em] text-text3">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-[24px] border border-blue/20 bg-blue/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-blue">Last workout</p>
              <h3 className="mt-2 text-xl font-bold text-text">You improved 15 muscle groups!</h3>
              <button
                type="button"
                onClick={() =>
                  onOpenInfo(
                    "Improvement breakdown",
                    "This section breaks down which muscle groups moved the most from your latest logged workout."
                  )
                }
                className="mt-3 rounded-full bg-blue px-4 py-2 text-sm font-bold text-[#03131d]"
              >
                See Improvements
              </button>
            </div>
          </section>

          <section className="space-y-3">
            {groupedMuscles.map(([group, completion]) => (
              <div key={group} className="rounded-[22px] border border-white/10 bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue/10 text-blue">
                      <Icon name="spark" className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-text">{group}</p>
                      <p className="text-sm text-text3">{completion}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenInfo(
                        `${group} detail`,
                        `${group} ranking detail will list the exercises and sessions currently contributing to this bodygraph score.`
                      )
                    }
                    className="rounded-full border border-white/10 px-3 py-2 text-xs text-text2"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
      )}

      {activeTab === "leagues" && (
        <section className="rounded-[24px] border border-white/10 bg-card p-6 text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[28px] border border-white/10 bg-[conic-gradient(from_180deg,#00BFFF,#A78BFA,#FFD700,#00BFFF)] text-white">
            <Icon name="ranks" className="h-10 w-10" />
          </div>
          <h3 className="mt-4 text-2xl font-bold text-text">You&apos;re in queue</h3>
          <p className="mt-2 text-sm text-text2">
            Wait for the next league reset to get in with your Jarvis rank.
          </p>
          <button
            type="button"
            onClick={() =>
              onOpenInfo(
                "League reset",
                "Your league slot refreshes on the next reset window. Keep logging sessions to improve seeding."
              )
            }
            className="mt-5 rounded-full bg-blue px-5 py-3 text-sm font-bold text-[#03131d]"
          >
            3 Days
          </button>
        </section>
      )}

      {activeTab === "gallery" && (
        <div className="space-y-4">
          {galleryEntries.map((entry) => (
            <article
              key={entry.id}
              className={`rounded-[24px] border p-5 ${
                entry.tier.includes("OLYMPIAN")
                  ? "border-gold/25 bg-gradient-to-br from-gold/20 to-card"
                  : "border-red/20 bg-gradient-to-br from-red/15 to-card"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-text3">{entry.tier}</p>
                  <h3 className="mt-2 text-xl font-bold text-text">{entry.exercise_name}</h3>
                  <p className="mt-1 text-sm text-text2">{entry.lp} LP</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#090912] px-3 py-2 text-gold">
                  <Icon name="spark" className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <label className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-text3">KG</span>
                  <input
                    type="number"
                    value={entry.weight_kg}
                    onChange={(event) => onSaveExerciseRank({ ...entry, weight_kg: Number(event.target.value) })}
                    className="w-full bg-transparent text-xl font-bold text-text outline-none"
                  />
                </label>
                <label className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-text3">Reps</span>
                  <input
                    type="number"
                    value={entry.reps}
                    onChange={(event) => onSaveExerciseRank({ ...entry, reps: Number(event.target.value) })}
                    className="w-full bg-transparent text-xl font-bold text-text outline-none"
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
      )}

      {activeTab === "calculator" && (
        <section className="rounded-[24px] border border-white/10 bg-card p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-text3">Exercise</span>
              <input
                value={calculator.exercise}
                onChange={(event) => setCalculator((current) => ({ ...current, exercise: event.target.value }))}
                className="w-full bg-transparent text-text outline-none"
              />
            </label>
            <label className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-text3">Weight</span>
              <input
                type="number"
                value={calculator.weight}
                onChange={(event) => setCalculator((current) => ({ ...current, weight: Number(event.target.value) }))}
                className="w-full bg-transparent text-text outline-none"
              />
            </label>
            <label className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-text3">Reps</span>
              <input
                type="number"
                value={calculator.reps}
                onChange={(event) => setCalculator((current) => ({ ...current, reps: Number(event.target.value) }))}
                className="w-full bg-transparent text-text outline-none"
              />
            </label>
          </div>
          <div className="mt-5 rounded-[24px] border border-blue/20 bg-blue/10 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-blue">Calculated Rank</p>
            <h3 className="mt-2 text-2xl font-bold text-text">{calculatedTier}</h3>
            <p className="mt-2 text-sm text-text2">
              {calculator.exercise} - {calculatedLp} LP
            </p>
          </div>
        </section>
      )}

      {activeTab === "analysis" && (
        <div className="space-y-5">
          <section className="rounded-[24px] border border-white/10 bg-card p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-text3">Workout heatmap</p>
            <h3 className="mt-2 text-xl font-bold text-text">Last 12 weeks</h3>
            <div className="mt-4 grid grid-cols-7 gap-2">
              {Array.from({ length: 84 }).map((_, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-md ${
                    index % 4 === 0 ? "bg-blue/30" : index % 6 === 0 ? "bg-orange/25" : "bg-white/5"
                  }`}
                />
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-white/10 bg-card p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-text3">Volume trend</p>
            <div className="chart-shell mt-4 rounded-2xl border border-white/10 bg-[#0f172a] p-3">
              <VolumeBarChart
                labels={labels}
                values={workouts.slice(0, 8).reverse().map((entry) => Number(entry.volume_kg ?? 0))}
                color="#3B82F6"
              />
            </div>
          </section>

          <section className="rounded-[24px] border border-white/10 bg-card p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-text3">Top improvements</p>
            <div className="mt-4 space-y-3">
              {galleryEntries.slice(0, 3).map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-white/10 bg-[#0f172a] p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-text">{entry.exercise_name}</p>
                    <p className="font-mono text-blue">{entry.lp} LP</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
