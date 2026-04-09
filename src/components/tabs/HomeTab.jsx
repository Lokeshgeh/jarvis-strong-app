import { useMemo } from "react";
import VolumeBarChart from "../charts/VolumeBarChart";
import WeightLineChart from "../charts/WeightLineChart";
import { Icon } from "../icons";
import { useAppState } from "../../store/globalState";

function SegmentTabs({ items, active, onChange }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto rounded-full border border-white/10 bg-white/5 p-1">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${active === item.id ? "bg-blue text-[#03131d]" : "text-text2"}`}
        >
          {item.label}
        </button>
      ))}
    </div>
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
  const { subTabs, setSubTab } = useAppState();
  const activeTab = subTabs.home;

  const lastSevenWorkouts = workouts.slice(0, 7).reverse();
  const totalVolume14 = workouts.slice(0, 14).reduce((sum, workout) => sum + Number(workout.volume_kg ?? 0), 0);
  const totalDuration14 = workouts.slice(0, 14).reduce((sum, workout) => sum + Number(workout.duration_seconds ?? 0), 0);
  const totalRecords14 = workouts.slice(0, 14).reduce((sum, workout) => sum + Number(workout.records_broken ?? 0), 0);
  const caloriesBurned = Math.round(totalVolume14 / 150);
  const bodyweightLabels = bodyweightLog.map((entry) => entry.logged_at?.slice(5));
  const bodyweightValues = bodyweightLog.map((entry) => Number(entry.weight_kg));

  const discoveryCards = useMemo(
    () => [
      {
        key: "leaderboards",
        icon: "ranks",
        title: "Leaderboards",
        subtitle: "How do you stack up?",
        body: "This panel will show your global and regional standing once more community activity is logged into your account.",
      },
      {
        key: "feeds",
        icon: "friends",
        title: "Social Feeds",
        subtitle: "Lifting with the world",
        body: "The discovery feed highlights recent training sessions from your network and public athletes using the same app shell.",
      },
      {
        key: "calendar",
        icon: "spark",
        title: "Streak Calendar",
        subtitle: "Track your consistency",
        body: "Your streak calendar ties workouts and completed schedule blocks together so you can see consistency at a glance.",
      },
      {
        key: "calculator",
        icon: "help",
        title: "Rank Calculator",
        subtitle: "Quickly check your exercise ranks",
        body: "The rank calculator estimates LP and tier based on the weight and reps you enter for each exercise.",
      },
    ],
    []
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
    <div className="space-y-5">
      <SegmentTabs
        items={[
          { id: "forYou", label: "For You" },
          { id: "friends", label: "Friends" },
          { id: "discovery", label: "Discovery" },
        ]}
        active={activeTab}
        onChange={(next) => setSubTab("home", next)}
      />

      <button
        type="button"
        onClick={onGoToRanks}
        className="w-full rounded-[28px] border border-purple/30 bg-gradient-to-br from-[#1d1638] via-card to-[#10102A] p-5 text-left shadow-glow"
      >
        <p className="text-xs uppercase tracking-[0.28em] text-purple">Rank booster</p>
        <div className="mt-3 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-text">Press to see your body&apos;s rank</h2>
            <p className="mt-2 text-sm text-text2">Crystalline bodygraph insights with your next LP jump mapped visually.</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple/25 bg-white/5 text-purple">
            <Icon name="ranks" className="h-8 w-8" />
          </div>
        </div>
      </button>

      {activeTab === "forYou" && (
        <div className="space-y-5">
          <section className="rounded-[24px] border border-gold/20 bg-gradient-to-br from-gold/20 to-card p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-gold">Getting Started</p>
                <h3 className="mt-2 text-xl font-bold text-text">First Week Challenge</h3>
                <p className="mt-2 text-sm text-text2">Keep working out for a week to earn even more rewards.</p>
              </div>
              <div className="text-right">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 bg-[#0d0d1a] text-xl font-bold text-gold">
                  60%
                </div>
                <button
                  type="button"
                  onClick={() => onOpenInfo("First Week Challenge", "Complete one full week of logged training sessions to unlock bonus XP, a consistency badge, and rank momentum." )}
                  className="mt-3 rounded-full bg-gold px-4 py-2 text-sm font-bold text-[#221700]"
                >
                  Continue
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-white/10 bg-card p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-text3">Your Goal</p>
                <h3 className="mt-2 text-xl font-bold text-text">Challenge yourself</h3>
              </div>
              <button type="button" onClick={promptForGoal} className="rounded-full bg-blue px-4 py-2 text-sm font-bold text-[#03131d]">
                + Add Goal
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {goals.map((goal) => (
                <div key={goal.id} className="rounded-2xl border border-white/8 bg-[#090912] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-text">{goal.target_value}</p>
                      <p className="text-sm text-text3">{goal.goal_type}</p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.24em] text-blue">{goal.current_value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-white/10 bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-text3">Last 14 Workouts</p>
                <h3 className="mt-2 text-xl font-bold text-text">{totalVolume14.toFixed(1)} kg</h3>
                <p className="text-sm text-blue">Progressive overload trend</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-right text-sm">
                <div>
                  <p className="text-text3">Duration</p>
                  <p className="font-semibold text-text">{Math.round(totalDuration14 / 3600)}h</p>
                </div>
                <div>
                  <p className="text-text3">Records</p>
                  <p className="font-semibold text-text">{totalRecords14}</p>
                </div>
                <div>
                  <p className="text-text3">Burned</p>
                  <p className="font-semibold text-text">{caloriesBurned} cal</p>
                </div>
              </div>
            </div>
            <div className="chart-shell mt-4">
              <VolumeBarChart
                labels={lastSevenWorkouts.map((_, index) => `S${index + 1}`)}
                values={lastSevenWorkouts.map((workout) => Number(workout.volume_kg ?? 0))}
              />
            </div>
          </section>

          <section className="rounded-[24px] border border-white/10 bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-text3">Bodyweight</p>
                <h3 className="mt-2 text-xl font-bold text-text">{bodyweightValues.at(-1) ?? 49} kg</h3>
                <p className="text-sm text-blue">Weight gain trend</p>
              </div>
              <button type="button" onClick={onOpenWeightModal} className="rounded-full bg-blue px-4 py-2 text-sm font-bold text-[#03131d]">
                + Log
              </button>
            </div>
            <div className="chart-shell">
              <WeightLineChart labels={bodyweightLabels} values={bodyweightValues} />
            </div>
          </section>
        </div>
      )}

      {activeTab === "friends" && (
        <div className="space-y-4">
          {friends.map((friend) => (
            <article key={friend.id} className="rounded-[24px] border border-white/10 bg-card p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold"
                    style={{ backgroundColor: friend.profile?.avatar_color ?? "#00BFFF" }}
                  >
                    {friend.profile?.username?.slice(0, 2).toUpperCase() ?? "JS"}
                  </div>
                  <div>
                    <p className="font-semibold text-text">{friend.profile?.username ?? "Friend"}</p>
                    <p className="text-sm text-text3">
                      {friend.workout?.completed_at ? new Date(friend.workout.completed_at).toLocaleString() : "No workout yet"}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-orange/10 px-3 py-1 text-sm font-semibold text-orange">Lv.{friend.profile?.level ?? 1}</span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 rounded-2xl border border-white/8 bg-[#090912] p-4 text-sm">
                <div>
                  <p className="text-text3">Streak</p>
                  <p className="mt-1 flex items-center gap-2 font-semibold text-text">
                    <Icon name="fire" className="h-4 w-4 text-orange" />
                    {friend.profile?.streak ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-text3">Duration</p>
                  <p className="font-semibold text-text">{friend.workout ? `${Math.round(friend.workout.duration_seconds / 60)}m` : "--"}</p>
                </div>
                <div>
                  <p className="text-text3">Record</p>
                  <p className="mt-1 flex items-center gap-2 font-semibold text-text">
                    <Icon name="spark" className="h-4 w-4 text-gold" />
                    {friend.workout?.records_broken ?? 0}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => onOpenInfo("Comment tools", `Comment reactions for ${friend.profile?.username ?? "this athlete"} will plug into the social feed layer next.`)}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-text2"
                >
                  Comment
                </button>
                <button
                  type="button"
                  onClick={() => onOpenInfo("Quick reactions", `Quick reactions help you encourage ${friend.profile?.username ?? "your friend"} without leaving the feed.`)}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-text2"
                >
                  React
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {activeTab === "discovery" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            {discoveryCards.map((card) => (
              <button
                key={card.key}
                type="button"
                onClick={() => onOpenInfo(card.title, card.body)}
                className="rounded-[24px] border border-white/10 bg-card p-5 text-left"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-blue">
                  <Icon name={card.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-text">{card.title}</h3>
                <p className="mt-2 text-sm text-text2">{card.subtitle}</p>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {workouts.slice(0, 4).map((workout) => (
              <article key={workout.id} className="rounded-[24px] border border-white/10 bg-card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-text">{workout.routine_name}</p>
                    <p className="text-sm text-text3">{new Date(workout.completed_at).toLocaleDateString()}</p>
                  </div>
                  <div className="rounded-full bg-blue/10 px-3 py-1 text-sm font-semibold text-blue">{workout.sets_completed} sets</div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl border border-white/8 bg-[#090912] p-4">Volume {Math.round(workout.volume_kg)} kg</div>
                  <div className="rounded-2xl border border-white/8 bg-[#090912] p-4">Records {workout.records_broken}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
