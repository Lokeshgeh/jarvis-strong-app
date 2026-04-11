import { useMemo } from "react";
import VolumeBarChart from "../charts/VolumeBarChart";
import WeightLineChart from "../charts/WeightLineChart";
import { Icon } from "../icons";
import { useAppState } from "../../store/globalState";

function SegmentTabs({ items, active, onChange }) {
  return (
    <div className="mx-auto flex w-full max-w-[300px] rounded-full border border-white/10 bg-[#111827] p-1">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
            active === item.id ? "bg-white text-[#0b1020]" : "text-text2"
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
    <div className="rounded-[20px] border border-white/10 bg-[#0f172a] p-4">
      <p className="text-sm text-text2">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

function QuickAction({ icon, label, onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-2">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#0f172a] text-blue">
        <Icon name={icon} className="h-4 w-4" />
      </span>
      <span className="text-xs font-medium text-text2">{label}</span>
    </button>
  );
}

function sameDay(value, dayString) {
  if (!value) return false;
  return new Date(value).toISOString().slice(0, 10) === dayString;
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
  const todayString = new Date().toISOString().slice(0, 10);

  const lastSevenWorkouts = workouts.slice(0, 7).reverse();
  const totalVolume14 = workouts.slice(0, 14).reduce((sum, workout) => sum + Number(workout.volume_kg ?? 0), 0);
  const totalDuration14 = workouts.slice(0, 14).reduce((sum, workout) => sum + Number(workout.duration_seconds ?? 0), 0);
  const totalRecords14 = workouts.slice(0, 14).reduce((sum, workout) => sum + Number(workout.records_broken ?? 0), 0);
  const bodyweightLabels = bodyweightLog.map((entry) => entry.logged_at?.slice(5));
  const bodyweightValues = bodyweightLog.map((entry) => Number(entry.weight_kg));
  const latestWeight = bodyweightValues.at(-1) ?? 49;
  const workedOutToday = workouts.some((workout) => sameDay(workout.completed_at, todayString));
  const hasGoal = goals.length > 0;
  const missionProgress = (workedOutToday ? 50 : 0) + (hasGoal ? 50 : 0);
  const weeklyCompletions = useMemo(() => {
    const today = new Date(`${todayString}T00:00:00Z`);
    return workouts.filter((workout) => {
      const date = new Date(workout.completed_at);
      const diff = (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }).length;
  }, [todayString, workouts]);

  const discoveryCards = useMemo(
    () => [
      { key: "leaderboards", icon: "ranks", title: "Leaderboards", subtitle: "How do you stack up?" },
      { key: "feeds", icon: "friends", title: "Social Feeds", subtitle: "Lifting with the world" },
      { key: "calendar", icon: "spark", title: "Streak Calendar", subtitle: "Track your consistency" },
      { key: "calculator", icon: "help", title: "Rank Calculator", subtitle: "Quickly check your rank" },
    ],
    [],
  );

  const promptForGoal = () => {
    const title = window.prompt("Goal type", "Strength");
    const target = window.prompt("Target value", "100kg Bench");
    const current = window.prompt("Current value", "0kg");

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
          { id: "forYou", label: "For You" },
          { id: "friends", label: "Friends" },
          { id: "discovery", label: "Discovery" },
        ]}
        active={activeTab}
        onChange={(next) => setSubTab("home", next)}
      />

      {activeTab === "forYou" && (
        <div className="space-y-5">
          <section className="rounded-[24px] border border-white/10 bg-[#111827] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-blue">Today Mission</p>
            <h1 className="mt-2 text-3xl font-bold text-text">Complete your scheduled workout</h1>
            <p className="mt-2 text-sm text-text2">
              You rank up from completed sessions, not browsing. Finish one workout and lock one goal.
            </p>

            <div className="mt-4 h-3 overflow-hidden rounded-full border border-white/10 bg-[#0b1020]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#22c55e,#3b82f6)] transition-all"
                style={{ width: `${missionProgress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-text2">{missionProgress}% of today&apos;s mission loop complete</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("workout");
                  setSubTab("workout", "tracker");
                }}
                className="rounded-2xl bg-green px-4 py-3 text-sm font-bold text-[#05200f]"
              >
                {workedOutToday ? "Workout Done" : "Start workout"}
              </button>
              <button
                type="button"
                onClick={hasGoal ? onGoToRanks : promptForGoal}
                className="rounded-2xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm font-semibold text-text"
              >
                {hasGoal ? "Open Ranks" : "Set 1 Goal"}
              </button>
            </div>
          </section>

          <section className="rounded-[24px] border border-white/10 bg-[#111827] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-text">Execution Loop</h2>
              <span className="rounded-full border border-blue/25 bg-blue/10 px-3 py-1 text-xs font-semibold text-blue">
                {weeklyCompletions} sessions this week
              </span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <QuickAction
                icon="workout"
                label="Workout"
                onClick={() => {
                  setActiveTab("workout");
                  setSubTab("workout", "tracker");
                }}
              />
              <QuickAction icon="nutrition" label="Protein" onClick={() => setActiveTab("nutrition")} />
              <QuickAction icon="ranks" label="Rank" onClick={onGoToRanks} />
              <QuickAction icon="xp" label="Sync" onClick={() => onOpenInfo("Cloud sync", "Your data is saved to Supabase and synced between your devices.")} />
            </div>
          </section>

          <section className="rounded-[24px] border border-white/10 bg-[#111827] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-text2">Last 14 Workouts</p>
                <h3 className="mt-1 text-2xl font-bold text-text">{totalVolume14.toFixed(0)} kg</h3>
              </div>
              <button type="button" onClick={promptForGoal} className="rounded-full border border-white/10 bg-[#0f172a] px-4 py-2 text-sm font-semibold text-text">
                + Add Goal
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <SummaryMetric label="Duration" value={`${Math.max(1, Math.round(totalDuration14 / 3600))}h`} />
              <SummaryMetric label="Records" value={`${totalRecords14}`} accent="text-gold" />
              <SummaryMetric label="Weight" value={`${latestWeight}kg`} accent="text-blue" />
            </div>
            <div className="chart-shell mt-4 rounded-2xl border border-white/10 bg-[#0f172a] p-3">
              <VolumeBarChart
                labels={lastSevenWorkouts.map((_, index) => `S${index + 1}`)}
                values={lastSevenWorkouts.map((workout) => Number(workout.volume_kg ?? 0))}
                color="#3B82F6"
              />
            </div>
          </section>
        </div>
      )}

      {activeTab === "friends" && (
        <div className="space-y-4">
          <section className="rounded-[24px] border border-white/10 bg-[#111827] p-5">
            <h3 className="text-xl font-bold text-text">Friends Feed</h3>
            <p className="mt-2 text-sm text-text2">Compare streaks, celebrate wins, and stay accountable.</p>
          </section>

          {friends.map((friend) => (
            <article key={friend.id} className="rounded-[24px] border border-white/10 bg-[#111827] p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: friend.profile?.avatar_color ?? "#3b82f6" }}
                  >
                    {friend.profile?.username?.slice(0, 2).toUpperCase() ?? "JS"}
                  </div>
                  <div>
                    <p className="font-semibold text-text">{friend.profile?.username ?? "Friend"}</p>
                    <p className="text-sm text-text2">
                      {friend.workout?.completed_at
                        ? new Date(friend.workout.completed_at).toLocaleDateString()
                        : "No workout logged yet"}
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-white/10 bg-[#0f172a] px-3 py-2 text-xs font-semibold text-blue">
                  Lv.{friend.profile?.level ?? 1}
                </span>
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
                className="rounded-[22px] border border-white/10 bg-[#111827] p-4 text-left"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#0f172a] text-blue">
                  <Icon name={card.icon} className="h-4 w-4" />
                </span>
                <h3 className="mt-3 text-base font-semibold text-text">{card.title}</h3>
                <p className="mt-1 text-xs text-text2">{card.subtitle}</p>
              </button>
            ))}
          </section>

          <section className="rounded-[24px] border border-white/10 bg-[#111827] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text2">Bodyweight trend</p>
                <h3 className="mt-1 text-2xl font-bold text-text">{latestWeight} kg</h3>
              </div>
              <button type="button" onClick={onOpenWeightModal} className="rounded-full border border-white/10 bg-[#0f172a] px-4 py-2 text-sm font-semibold text-blue">
                + Log
              </button>
            </div>
            <div className="chart-shell mt-4 rounded-2xl border border-white/10 bg-[#0f172a] p-3">
              <WeightLineChart labels={bodyweightLabels} values={bodyweightValues} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
