import { useMemo, useState } from "react";
import { defaultRoutines } from "../../data/defaultRoutines";
import { scheduleBlocks, scheduleMeta } from "../../data/scheduleBlocks";
import { useAppState } from "../../store/globalState";
import { Icon } from "../icons";

const focusTemplates = {
  Chest: ["Bench Press", "Incline Press", "Cable Fly", "Push Ups"],
  Back: ["Lat Pulldown", "Chest Supported Row", "Face Pull", "Pull Ups"],
  Legs: ["Back Squat", "Romanian Deadlift", "Walking Lunges", "Calf Raise"],
  Shoulders: ["Shoulder Press", "Lateral Raise", "Rear Delt Fly", "Upright Row"],
};

function SegmentTabs({ items, active, onChange }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto rounded-full border border-white/10 bg-[#111827] p-1">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active === item.id ? "bg-white text-[#0b1020] shadow-[0_10px_18px_rgba(2,6,23,0.45)]" : "text-text2"}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function BodyDiagramCard() {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white p-5 shadow-[0_14px_28px_rgba(110,94,74,0.08)]">
      <div className="grid grid-cols-2 gap-4">
        {["Front", "Back"].map((label) => (
          <div key={label} className="rounded-[20px] border border-white/10 bg-[#0f172a] p-4 text-center">
            <div className="mx-auto flex h-40 w-20 items-center justify-center rounded-[999px] bg-[radial-gradient(circle_at_center,rgba(227,106,67,0.14),transparent_65%)]">
              <div className="relative h-32 w-12 rounded-[999px] border border-[#e9d8cf]">
                <span className="absolute left-1/2 top-4 h-10 w-6 -translate-x-1/2 rounded-full bg-[#f0b8a5]" />
                <span className="absolute inset-x-1 top-16 h-8 rounded-xl bg-[#f4d8cb]" />
                <span className="absolute bottom-6 left-1.5 h-14 w-3 rounded-full bg-[#efc3b4]" />
                <span className="absolute bottom-6 right-1.5 h-14 w-3 rounded-full bg-[#efc3b4]" />
              </div>
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.28em] text-text3">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WorkoutTab({
  routines,
  weeklyPlan,
  scheduleCompletions,
  onToggleSchedule,
  onOpenRoutine,
  onStartWorkout,
  onOpenRoutineModal,
  onDuplicateRoutine,
  onDeleteRoutine,
}) {
  const { subTabs, setSubTab } = useAppState();
  const activeTab = subTabs.workout;
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [planBuilderOpen, setPlanBuilderOpen] = useState(false);
  const [energy, setEnergy] = useState(3);
  const [focus, setFocus] = useState("Chest");
  const [duration, setDuration] = useState(60);

  const todayString = new Date().toISOString().slice(0, 10);
  const completedToday = scheduleCompletions.filter((entry) => entry.completed_date === todayString).map((entry) => entry.block_id);
  const scheduleProgress = Math.round((completedToday.length / scheduleBlocks.length) * 100);

  const generatedRoutine = useMemo(() => {
    const exercises = focusTemplates[focus] ?? focusTemplates.Chest;
    const setTarget = energy >= 4 ? 4 : 3;
    return {
      name: `${focus} Focus`,
      routine_exercises: exercises.map((exerciseName, index) => ({
        exercise_name: exerciseName,
        muscle_group: focus,
        sets: setTarget,
        reps: duration >= 75 ? 12 : 8 + energy,
        kg: focus === "Chest" ? 40 + index * 5 : 30 + index * 4,
        sort_order: index + 1,
      })),
    };
  }, [duration, energy, focus]);

  const todayRoutine = routines[0] ?? generatedRoutine;
  const todaySets = todayRoutine.routine_exercises?.reduce((sum, exercise) => sum + Number(exercise.sets), 0) ?? 15;

  const weeklyExercisePlan = useMemo(() => {
    const fallbackMap = Object.fromEntries(defaultRoutines.map((routine) => [routine.name.toLowerCase(), routine]));

    return weeklyPlan.map((entry) => {
      const routineName = entry.routine ?? "Rest";
      const matchedRoutine =
        routines.find((routine) => routine.name.toLowerCase() === routineName.toLowerCase()) ??
        fallbackMap[routineName.toLowerCase()] ??
        null;

      const exercises = matchedRoutine
        ? (matchedRoutine.routine_exercises ?? matchedRoutine.exercises ?? []).map((exercise, index) => ({
            exercise_name: exercise.exercise_name,
            muscle_group: exercise.muscle_group ?? "General",
            sets: Number(exercise.sets ?? 3),
            reps: Number(exercise.reps ?? 8),
            kg: Number(exercise.kg ?? 0),
            sort_order: Number(exercise.sort_order ?? index + 1),
          }))
        : [];

      return {
        ...entry,
        id: `${entry.day}-${routineName}`,
        routine: routineName,
        exercises,
        isRecoveryDay: routineName === "Rest" || routineName === "Active Recovery",
      };
    });
  }, [routines, weeklyPlan]);

  return (
    <div className="space-y-5">
      <SegmentTabs items={[{ id: "tracker", label: "Tracker" }, { id: "myPlan", label: "My Plan" }, { id: "schedule", label: "Schedule" }]} active={activeTab} onChange={(next) => setSubTab("workout", next)} />

      {activeTab === "tracker" && (
        <div className="space-y-5">
          <section className="rounded-[26px] border border-[#efcfbf] bg-[linear-gradient(135deg,#f7b39a_0%,#e36a43_100%)] p-5 text-white shadow-[0_18px_34px_rgba(227,106,67,0.22)]">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-white/72">Programmed</p>
                <h2 className="text-2xl font-bold text-white">{todayRoutine.name || "Full Body"}</h2>
                <p className="mt-1 text-sm text-white/80">{todaySets} sets - {Math.max(45, todaySets * 4)} min</p>
              </div>
              <button type="button" onClick={() => onStartWorkout(todayRoutine)} className="rounded-full bg-white px-4 py-3 text-sm font-bold text-blue">
                Start
              </button>
            </div>
            <p className="text-sm text-white/88">Tap into today&apos;s high-value session and earn live XP for every completed set.</p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text">New Workout</h3>
              <span className="text-sm text-text3">Zero dead clicks</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => onStartWorkout({ name: "Empty Workout", routine_exercises: [] })} className="rounded-[24px] border border-white/10 bg-card p-5 text-left transition hover:border-[#efcfbf] hover:bg-card-hover">
                <p className="text-sm uppercase tracking-[0.24em] text-text3">Start Empty Workout</p>
                <p className="mt-3 text-xl font-bold text-text">Log a blank live session</p>
                <p className="mt-2 text-sm text-text2">Build the workout as you go, one exercise at a time.</p>
              </button>
              <button type="button" onClick={() => setGeneratorOpen((current) => !current)} className="rounded-[24px] border border-white/10 bg-card p-5 text-left transition hover:border-[#efcfbf] hover:bg-card-hover">
                <p className="text-sm uppercase tracking-[0.24em] text-text3">Generate Workout</p>
                <p className="mt-3 text-xl font-bold text-text">Adaptive energy-based builder</p>
                <p className="mt-2 text-sm text-text2">Tune focus, duration, and energy before you launch.</p>
              </button>
            </div>
            {generatorOpen && (
              <div className="rounded-[24px] border border-white/10 bg-card p-5 shadow-[0_14px_28px_rgba(110,94,74,0.08)]">
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="rounded-2xl border border-white/10 bg-[#0f172a] p-4">
                    <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-text3">Energy</span>
                    <input type="range" min="1" max="5" value={energy} onChange={(event) => setEnergy(Number(event.target.value))} className="w-full accent-blue" />
                    <p className="mt-2 text-sm font-semibold text-text">{energy}/5</p>
                  </label>
                  <label className="rounded-2xl border border-white/10 bg-[#0f172a] p-4">
                    <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-text3">Focus</span>
                    <select value={focus} onChange={(event) => setFocus(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#020617] px-3 py-3 text-text outline-none">
                      {Object.keys(focusTemplates).map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="rounded-2xl border border-white/10 bg-[#0f172a] p-4">
                    <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-text3">Duration</span>
                    <input type="number" min="30" max="120" value={duration} onChange={(event) => setDuration(Number(event.target.value))} className="w-full rounded-xl border border-white/10 bg-[#020617] px-3 py-3 text-text outline-none" />
                  </label>
                </div>
                <div className="mt-4 rounded-[24px] border border-[#efcfbf] bg-[#0f172a] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-blue">Generated</p>
                      <h4 className="mt-2 text-xl font-bold text-text">{generatedRoutine.name}</h4>
                    </div>
                    <button type="button" onClick={() => onStartWorkout(generatedRoutine)} className="rounded-full bg-orange px-4 py-3 text-sm font-bold text-white">
                      Launch Workout
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-text2">{generatedRoutine.routine_exercises.map((exercise) => exercise.exercise_name).join(" - ")}</p>
                </div>
              </div>
            )}
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text">Routines</h3>
                <p className="text-sm text-text3">{routines.length} saved in Supabase</p>
              </div>
              <button type="button" onClick={() => onOpenRoutineModal()} className="rounded-full bg-[#020617] px-4 py-2 text-sm font-semibold text-white">
                + Add Routine
              </button>
            </div>
            <div className="space-y-3">
              {routines.map((routine) => (
                <article key={routine.id} className="rounded-[24px] border border-white/10 bg-card p-5 shadow-[0_14px_28px_rgba(110,94,74,0.08)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-xl font-semibold text-text">{routine.name}</h4>
                      <p className="mt-1 text-sm text-text2">{routine.routine_exercises.reduce((sum, exercise) => sum + Number(exercise.sets), 0)} total sets</p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      <button type="button" onClick={() => onOpenRoutine(routine)} className="rounded-full border border-white/10 bg-[#0f172a] px-3 py-2 text-sm text-text">Open</button>
                      <button type="button" onClick={() => onOpenRoutineModal(routine)} className="rounded-full border border-white/10 bg-transparent px-3 py-2 text-sm text-text2">Edit</button>
                      <button type="button" onClick={() => onDuplicateRoutine(routine)} className="rounded-full border border-white/10 bg-transparent px-3 py-2 text-sm text-text2">Duplicate</button>
                      <button type="button" onClick={() => onDeleteRoutine(routine.id)} className="rounded-full border border-[#efcfbf] bg-red/10 px-3 py-2 text-sm text-red">Delete</button>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2">
                    {routine.routine_exercises.map((exercise) => (
                      <div key={`${routine.id}-${exercise.id}`} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0f172a] px-4 py-3">
                        <div>
                          <p className="font-medium text-text">{exercise.exercise_name}</p>
                          <p className="text-xs text-text3">{exercise.muscle_group}</p>
                        </div>
                        <p className="font-mono text-sm text-blue">{exercise.sets} x {exercise.reps}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === "myPlan" && (
        <div className="space-y-5">
          <div className="rounded-[28px] border border-[#efcfbf] bg-gradient-to-br from-[#fff4ed] to-card p-6 text-center shadow-[0_14px_28px_rgba(110,94,74,0.08)]">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-[#efcfbf] bg-white text-blue">
              <Icon name="spark" className="h-12 w-12" />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-text">Plan Builder</h3>
            <p className="mt-2 text-sm text-text2">Create entire workout weeks that map directly to your goals, recovery, and current output. Tap below to reveal the full exercise plan for every day.</p>
            <button
              type="button"
              onClick={() => setPlanBuilderOpen((current) => !current)}
              className="mt-5 rounded-full bg-orange px-5 py-3 text-sm font-bold text-white"
            >
              {planBuilderOpen ? "HIDE EXERCISE PLAN" : "CREATE MY PLAN"}
            </button>
          </div>
          <BodyDiagramCard />
          {planBuilderOpen && (
            <div className="rounded-[24px] border border-white/10 bg-card p-5 shadow-[0_14px_28px_rgba(110,94,74,0.08)]">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-blue">Exercise planner</p>
                  <h3 className="mt-2 text-xl font-bold text-text">Your weekly exercise breakdown</h3>
                  <p className="mt-2 text-sm text-text2">Each day now shows the actual exercises, set targets, and launch actions instead of a placeholder planner.</p>
                </div>
                <button type="button" onClick={() => setSubTab("workout", "schedule")} className="rounded-full border border-white/10 bg-[#0f172a] px-4 py-2 text-sm text-text2">
                  View Schedule
                </button>
              </div>
              <div className="space-y-4">
                {weeklyExercisePlan.map((entry) => (
                  <article
                    key={entry.id}
                    className={`rounded-[24px] border p-5 ${entry.isRecoveryDay ? "border-white/10 bg-[#0f172a]" : "border-[#efcfbf] bg-[#0f172a]"}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-text3">{entry.day}</p>
                        <h4 className="mt-2 text-xl font-bold text-text">{entry.routine}</h4>
                        <p className="mt-1 text-sm text-text2">{entry.sets} sets - {entry.duration}</p>
                      </div>
                      {!entry.isRecoveryDay && (
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              onStartWorkout({
                                name: entry.routine,
                                routine_exercises: entry.exercises,
                              })
                            }
                            className="rounded-full bg-orange px-4 py-2 text-sm font-bold text-white"
                          >
                            Start Day
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onOpenRoutine({
                                id: entry.id,
                                name: entry.routine,
                                routine_exercises: entry.exercises,
                              })
                            }
                            className="rounded-full border border-white/10 bg-white px-4 py-2 text-sm text-text2"
                          >
                            Open Plan
                          </button>
                        </div>
                      )}
                    </div>

                    {entry.isRecoveryDay ? (
                      <div className="mt-4 rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm text-text2">
                        Recovery focus day. Keep mobility, walking, and light activation work here.
                      </div>
                    ) : (
                      <div className="mt-4 grid gap-3">
                        {entry.exercises.map((exercise) => (
                          <div key={`${entry.id}-${exercise.exercise_name}`} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white px-4 py-3">
                            <div>
                              <p className="font-semibold text-text">{exercise.exercise_name}</p>
                              <p className="text-xs text-text3">{exercise.muscle_group}</p>
                            </div>
                            <p className="text-sm font-mono text-blue">
                              {exercise.sets} x {exercise.reps}
                              {exercise.kg > 0 ? ` @ ${exercise.kg}kg` : ""}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}
          <div className="rounded-[24px] border border-white/10 bg-card p-5 shadow-[0_14px_28px_rgba(110,94,74,0.08)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-text">Weekly Planner</h3>
                <p className="text-sm text-text3">Editable via routines and plan assignments</p>
              </div>
              <button type="button" onClick={() => onOpenRoutineModal()} className="rounded-full border border-white/10 bg-[#0f172a] px-4 py-2 text-sm text-text2">
                + Assign Workout
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {weeklyPlan.map((entry) => (
                <div key={entry.day} className={`rounded-[22px] border p-4 ${entry.routine === "Rest" ? "border-white/10 bg-[#0f172a]" : "border-[#efcfbf] bg-[#0f172a]"}`}>
                  <p className="text-xs uppercase tracking-[0.28em] text-text3">{entry.day}</p>
                  <p className="mt-2 text-lg font-semibold text-text">{entry.routine}</p>
                  <p className="mt-1 text-sm text-text2">{entry.sets} sets - {entry.duration}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "schedule" && (
        <div className="space-y-5">
          <div className="rounded-[24px] border border-white/10 bg-card p-5 shadow-[0_14px_28px_rgba(110,94,74,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-text3">Read only daily schedule</p>
                <h3 className="mt-2 text-2xl font-bold text-text">Locked 4 AM to 10 PM operating system</h3>
              </div>
              <div className="rounded-full bg-green/20 px-4 py-2 text-sm font-bold text-green">{scheduleProgress}% done</div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[["Active hours", scheduleMeta.activeHours], ["Pure work", scheduleMeta.pureWork], ["Gym", scheduleMeta.gym], ["Recovery", scheduleMeta.recovery], ["Sleep", scheduleMeta.sleepWindow]].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-[#0f172a] p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.24em] text-text3">{label}</p>
                  <p className="mt-2 text-xl font-bold text-blue">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {scheduleBlocks.map((block) => {
              const complete = completedToday.includes(block.id);
              return (
                <button
                  key={block.id}
                  type="button"
                  onClick={() => onToggleSchedule(block.id, todayString)}
                  className={`w-full rounded-[24px] border p-5 text-left transition ${complete ? "border-green/30 bg-green/10" : "border-white/10 bg-card hover:border-[#efcfbf]"}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#0f172a] px-3 py-1 text-xs uppercase tracking-[0.24em] text-text3">{block.time}</span>
                        <span className="rounded-full bg-[#0f172a] px-3 py-1 text-xs font-semibold text-blue">{block.tag}</span>
                      </div>
                      <h4 className="mt-3 text-lg font-semibold text-text">{block.title}</h4>
                      <p className="mt-2 text-sm text-text2">{block.output}</p>
                      <p className="mt-3 text-sm leading-6 text-text3">{block.description}</p>
                    </div>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${complete ? "border-green/30 bg-green text-[#07140d]" : "border-white/10 bg-[#0f172a] text-text3"}`}>
                      <Icon name={complete ? "check" : "spark"} className="h-5 w-5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-[24px] border border-white/10 bg-card p-5 shadow-[0_14px_28px_rgba(110,94,74,0.08)]">
            <h3 className="text-lg font-semibold text-text">Laws of this schedule</h3>
            <ul className="mt-4 space-y-2 text-sm text-text2">
              {scheduleMeta.laws.map((law) => (
                <li key={law} className="rounded-2xl border border-white/10 bg-[#0f172a] px-4 py-3">
                  {law}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

