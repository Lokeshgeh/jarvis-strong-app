import { useMemo } from "react";
import VolumeBarChart from "../charts/VolumeBarChart";
import WeightLineChart from "../charts/WeightLineChart";
import { Icon } from "../icons";
import { useAppState } from "../../store/globalState";

function SegmentTabs({ items, active, onChange }) {
  return (
    <div className="mx-auto flex w-full max-w-[240px] rounded-full bg-[#e6e1da] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
            active === item.id ? "bg-white text-text shadow-[0_10px_18px_rgba(110,94,74,0.1)]" : "text-text2"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function SummaryMetric({ label, value, accent = "text-text" }) {
  return (
    <div className="rounded-[24px] bg-white p-4 shadow-[0_14px_28px_rgba(110,94,74,0.08)]">
      <p className="text-sm text-text2">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

function QuickAction({ icon, label }) {
  return (
    <button type="button" className="flex flex-col items-center gap-3">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-text shadow-[0_14px_28px_rgba(110,94,74,0.08)]">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <span className="text-xs font-medium text-text2">{label}</span>
    </button>
  );
}

export default function HomeTab({
  workouts,
  bodyweightLog,
  goals,
  friends,
  onSaveGoal,
  onOpenWeightModal,
  onGoToRanks,
  onOpenInfo,
}) {
  const { subTabs, setSubTab, setActiveTab } = useAppState();
  const activeTab = subTabs.home;

  const lastSevenWorkouts = workouts.slice(0, 7).reverse();
  const totalVolume14 = workouts.slice(0, 14).reduce((sum, workout) => sum + Number(workout.volume_kg ?? 0), 0);
  const totalDuration14 = workouts.slice(0, 14).reduce((sum, workout) => sum + Number(workout.duration_seconds ?? 0), 0);
  const totalRecords14 = workouts.slice(0, 14).reduce((sum, workout) => sum + Number(workout.records_broken ?? 0), 0);
  const caloriesBurned = Math.round(totalVolume14 / 150);
  const bodyweightLabels = bodyweightLog.map((entry) => entry.logged_at?.slice(5));
  const bodyweightValues = bodyweightLog.map((entry) => Number(entry.weight_kg));
  const latestWeight = bodyweightValues.at(-1) ?? 49;
  const stepsValue = workouts.length ? 2340 + workouts.length * 82 : 2340;
  const dailyGoalProgress = Math.min(100, Math.round((stepsValue / 8000) * 100));

  const discoveryCards = useMemo(
    () => [
      { key: "leaderboards", icon: "ranks", title: "Leaderboards", subtitle: "How do you stack up?" },
      { key: "feeds", icon: "friends", title: "Social Feeds", subtitle: "Lifting with the world" },
      { key: "calendar", icon: "spark", title: "Streak Calendar", subtitle: "Track your consistency" },
      { key: "calculator", icon: "help", title: "Rank Calculator", subtitle: "Quick rank checks" },
    ],
    [],
  );

  const promptForGoal = () => {
    const title = window.prompt("Goal type", "Strength");
    const target = window.prompt("Target value", "100kg Bench");
    const current = window.prompt("Current value", "80kg");

    if (title && target) {
      onSaveGoal({
        goal_type: title,
        target_value: target,
        current_value: current ?? "",
        target_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
      });
    }
  };

  return (
    <div className="space-y-6">
      <SegmentTabs
        items={[
          { id: "forYou", label: "Daily" },
          { id: "friends", label: "Weekly" },
          { id: "discovery", label: "Monthly" },
        ]}
        active={activeTab}
        onChange={(next) => setSubTab("home", next)}
      />

      {activeTab === "forYou" && (
        <div className="space-y-5">
          <section className="px-1 pt-1">
            <h1 className="text-center text-5xl font-bold leading-[0.9] text-text">
              Let&apos;s start
              <br />
              strong!
            </h1>
          </section>

          <section className="rounded-[30px] bg-[#e8e5e1] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="max-w-[170px] text-2xl font-semibold leading-tight text-text">
                  You&apos;re {dailyGoalProgress}% to your daily goal
                </p>
              </div>
              <button type="button" onClick={() => setActiveTab("workout")} className="flex h-12 w-12 items-center justify-center rounded-full bg-orange text-white shadow-[0_14px_24px_rgba(227,106,67,0.28)]">
                <span className="text-xl">⚡</span>
              </button>
            </div>
            <div className="mt-6">
              <div className="h-4 overflow-hidden rounded-full bg-white/80">
                <div className="h-full rounded-full bg-[linear-gradient(90deg,#1c1b19,#e36a43)]" style={{ width: `${dailyGoalProgress}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm font-medium text-text2">
                <span>{stepsValue.toLocaleString()}</span>
                <span>8,000</span>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-4 gap-3">
            <QuickAction icon="workout" label="Workout" />
            <QuickAction icon="nutrition" label="Meal" />
            <QuickAction icon="spark" label="Water" />
            <QuickAction icon="xp" label="Sync" />
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-text">Daily Summary</h2>
              <button type="button" onClick={promptForGoal} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-text shadow-[0_12px_22px_rgba(110,94,74,0.08)]">
                Add goal
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SummaryMetric label="Steps" value={stepsValue.toLocaleString()} />
              <SummaryMetric label="Calories Burned" value={`${caloriesBurned} kcal`} accent="text-orange" />
              <SummaryMetric label="Workout Hours" value={`${Math.max(1, Math.round(totalDuration14 / 3600))}h`} />
              <SummaryMetric label="Bodyweight" value={`${latestWeight}kg`} accent="text-orange" />
            </div>
          </section>

          <button
            type="button"
            onClick={() => onOpenInfo("Recovery routine", "Stretching after workouts improves your sleep quality, mobility, and recovery rhythm.")}
            className="w-full rounded-[30px] bg-orange p-5 text-left text-white shadow-[0_22px_36px_rgba(227,106,67,0.22)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="max-w-[230px] text-2xl font-semibold leading-tight">
                  Stretching after workouts improves your sleep quality.
                </p>
                <div className="mt-5 flex gap-3">
                  <span className="rounded-full border border-white/45 px-5 py-2 text-sm font-semibold text-white/92">Dismiss</span>
                  <span className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#c85c39]">Set Routine</span>
                </div>
              </div>
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/22 text-2xl">◔</span>
            </div>
          </button>

          <section className="grid grid-cols-2 gap-3">
            <div className="rounded-[28px] bg-white p-5 shadow-[0_14px_28px_rgba(110,94,74,0.08)]">
              <p className="text-sm text-text2">Steps</p>
              <p className="mt-2 text-4xl font-bold text-text">{stepsValue.toLocaleString()}</p>
              <div className="mt-6 flex h-14 items-end gap-2">
                {[18, 34, 22, 48, 56, 28, 44].map((height, index) => (
                  <span key={height + index} className={`w-2 rounded-full ${index === 4 ? "bg-text" : "bg-[#ece7df]"}`} style={{ height }} />
                ))}
              </div>
            </div>
            <div className="rounded-[28px] bg-white p-5 shadow-[0_14px_28px_rgba(110,94,74,0.08)]">
              <p className="text-sm text-text2">Distance</p>
              <p className="mt-2 text-4xl font-bold text-text">3.4km</p>
              <svg viewBox="0 0 140 60" className="mt-5 h-14 w-full text-orange">
                <path d="M10 45C28 20 34 18 48 32s20 20 36 7 22-14 46-4" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
              </svg>
            </div>
          </section>

          <section className="rounded-[30px] bg-white p-5 shadow-[0_14px_28px_rgba(110,94,74,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text2">Progressive overload</p>
                <h3 className="mt-1 text-2xl font-bold text-text">{totalVolume14.toFixed(0)} kg</h3>
              </div>
              <button type="button" onClick={onGoToRanks} className="rounded-full bg-[#f5efe8] px-4 py-2 text-sm font-semibold text-text">
                Open body rank
              </button>
            </div>
            <div className="chart-shell mt-4">
              <VolumeBarChart labels={lastSevenWorkouts.map((_, index) => `W${index + 1}`)} values={lastSevenWorkouts.map((workout) => Number(workout.volume_kg ?? 0))} color="#e36a43" />
            </div>
          </section>
        </div>
      )}

      {activeTab === "friends" && (
        <div className="space-y-5">
          <section className="rounded-[30px] bg-white p-5 shadow-[0_14px_28px_rgba(110,94,74,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text2">Weekly overview</p>
                <h3 className="mt-1 text-2xl font-bold text-text">You burned {caloriesBurned} kcal across {Math.max(1, workouts.slice(0, 3).length)} activities</h3>
              </div>
              <button type="button" onClick={onOpenWeightModal} className="rounded-full bg-[#f6efe8] px-4 py-2 text-sm font-semibold text-orange">
                Log weight
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[24px] bg-[#faf7f3] p-4">
                <p className="text-sm text-text2">Running</p>
                <p className="mt-1 text-2xl font-bold text-text">120 kcal</p>
              </div>
              <div className="rounded-[24px] bg-[#faf7f3] p-4">
                <p className="text-sm text-text2">Push Day</p>
                <p className="mt-1 text-2xl font-bold text-text">200 kcal</p>
              </div>
            </div>
          </section>

          {friends.map((friend) => (
            <article key={friend.id} className="rounded-[30px] bg-white p-5 shadow-[0_14px_28px_rgba(110,94,74,0.08)]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: friend.profile?.avatar_color ?? "#e36a43" }}>
                    {friend.profile?.username?.slice(0, 2).toUpperCase() ?? "JS"}
                  </div>
                  <div>
                    <p className="font-semibold text-text">{friend.profile?.username ?? "Friend"}</p>
                    <p className="text-sm text-text2">{friend.workout?.completed_at ? new Date(friend.workout.completed_at).toLocaleDateString() : "No workout logged yet"}</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#f6efe8] px-3 py-2 text-xs font-semibold text-orange">Lv.{friend.profile?.level ?? 1}</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <SummaryMetric label="Streak" value={`${friend.profile?.streak ?? 0}`} accent="text-orange" />
                <SummaryMetric label="Duration" value={friend.workout ? `${Math.round(friend.workout.duration_seconds / 60)}m` : "--"} />
                <SummaryMetric label="Records" value={`${friend.workout?.records_broken ?? 0}`} />
              </div>
            </article>
          ))}
        </div>
      )}

      {activeTab === "discovery" && (
        <div className="space-y-5">
          <section className="grid grid-cols-2 gap-3">
            {discoveryCards.map((card) => (
              <button
                key={card.key}
                type="button"
                onClick={() => onOpenInfo(card.title, card.subtitle)}
                className="rounded-[28px] bg-white p-5 text-left shadow-[0_14px_28px_rgba(110,94,74,0.08)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f6efe8] text-orange">
                  <Icon name={card.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-text">{card.title}</h3>
                <p className="mt-2 text-sm text-text2">{card.subtitle}</p>
              </button>
            ))}
          </section>

          <section className="rounded-[30px] bg-white p-5 shadow-[0_14px_28px_rgba(110,94,74,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text2">Weight trend</p>
                <h3 className="mt-1 text-2xl font-bold text-text">{latestWeight} kg</h3>
              </div>
              <button type="button" onClick={onOpenWeightModal} className="rounded-full bg-[#f6efe8] px-4 py-2 text-sm font-semibold text-orange">
                + Log
              </button>
            </div>
            <div className="chart-shell mt-4">
              <WeightLineChart labels={bodyweightLabels} values={bodyweightValues} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
