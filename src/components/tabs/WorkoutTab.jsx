import { useMemo, useState } from "react";
import { scheduleBlocks, scheduleMeta } from "../../data/scheduleBlocks";
import { useAppState } from "../../store/globalState";

const focusTemplates = {
  Chest: ["Bench Press", "Incline Press", "Cable Fly", "Push Ups"],
  Back: ["Lat Pulldown", "Chest Supported Row", "Face Pull", "Pull Ups"],
  Legs: ["Back Squat", "Romanian Deadlift", "Walking Lunges", "Calf Raise"],
  Shoulders: ["Shoulder Press", "Lateral Raise", "Rear Delt Fly", "Upright Row"],
};

function SegmentTabs({ items, active, onChange }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto rounded-full border border-white/10 bg-white/5 p-1">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active === item.id ? "bg-blue text-[#03131d]" : "text-text2"}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function BodyDiagramCard() {
  return (
    <div className="rounded-[24px] border border-blue/20 bg-gradient-to-br from-blue/15 via-purple/10 to-card p-5">
      <div className="grid grid-cols-2 gap-4">
        {["Front", "Back"].map((label) => (
          <div key={label} className="rounded-[20px] border border-white/8 bg-[#090912] p-4 text-center">
            <div className="mx-auto flex h-40 w-20 items-center justify-center rounded-[999px] bg-[radial-gradient(circle_at_center,rgba(0,191,255,0.25),transparent_65%)]">
              <div className="relative h-32 w-12 rounded-[999px] border border-blue/40">
                <span className="absolute left-1/2 top-4 h-10 w-6 -translate-x-1/2 rounded-full bg-blue/40" />
                <span className="absolute inset-x-1 top-16 h-8 rounded-xl bg-blue/20" />
                <span className="absolute bottom-6 left-1.5 h-14 w-3 rounded-full bg-blue/35" />
                <span className="absolute bottom-6 right-1.5 h-14 w-3 rounded-full bg-blue/35" />
              </div>
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.28em] text-text3">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WorkoutTab({ routines, weeklyPlan, scheduleCompletions, onToggleSchedule, onOpenRoutine, onStartWorkout, onOpenRoutineModal, onDuplicateRoutine, onDeleteRoutine }) {
  const { subTabs, setSubTab } = useAppState();
  const activeTab = subTabs.workout;
  const [generatorOpen, setGeneratorOpen] = useState(false);
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

  return (
    <div className="space-y-5">
      <SegmentTabs items={[{ id: "tracker", label: "Tracker" }, { id: "myPlan", label: "My Plan" }, { id: "schedule", label: "Schedule" }]} active={activeTab} onChange={(next) => setSubTab("workout", next)} />

      {activeTab === "tracker" && (
        <div className="space-y-5">
          <section className="rounded-[26px] border border-green/20 bg-[#0D2B1A] p-5 shadow-glow">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-blue">Programmed</p>
                <h2 className="text-2xl font-bold text-text">{todayRoutine.name || "Full Body"}</h2>
                <p className="mt-1 text-sm text-green/80">{todaySets} Sets • {Math.max(45, todaySets * 4)} min</p>
              </div>
              <button type="button" onClick={() => onStartWorkout(todayRoutine)} className="rounded-full bg-blue px-4 py-3 text-sm font-bold text-[#03131d]">Start ?</button>
            </div>
            <p className="text-sm text-text2">Tap into today&apos;s high-value session and earn live XP for every completed set.</p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text">New Workout</h3>
              <span className="text-sm text-text3">Zero dead clicks</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => onStartWorkout({ name: "Empty Workout", routine_exercises: [] })} className="rounded-[24px] border border-white/10 bg-card p-5 text-left transition hover:border-blue/40 hover:bg-card-hover">
                <p className="text-sm uppercase tracking-[0.24em] text-text3">Start Empty Workout</p>
                <p className="mt-3 text-xl font-bold text-text">Log a blank live session</p>
                <p className="mt-2 text-sm text-text2">Build the workout as you go, one exercise at a time.</p>
              </button>
              <button type="button" onClick={() => setGeneratorOpen((current) => !current)} className="rounded-[24px] border border-white/10 bg-card p-5 text-left transition hover:border-green/40 hover:bg-card-hover">
                <p className="text-sm uppercase tracking-[0.24em] text-text3">Generate Workout</p>
                <p className="mt-3 text-xl font-bold text-text">Adaptive energy-based builder</p>
                <p className="mt-2 text-sm text-text2">Tune focus, duration, and energy before you launch.</p>
              </button>
            </div>
            {generatorOpen && (
              <div className="rounded-[24px] border border-white/10 bg-[#090912] p-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="rounded-2xl border border-white/10 bg-white/5 p-4"><span className="mb-2 block text-xs uppercase tracking-[0.24em] text-text3">Energy</span><input type="range" min="1" max="5" value={energy} onChange={(event) => setEnergy(Number(event.target.value))} className="w-full accent-blue" /><p className="mt-2 text-sm font-semibold text-text">{energy}/5</p></label>
                  <label className="rounded-2xl border border-white/10 bg-white/5 p-4"><span className="mb-2 block text-xs uppercase tracking-[0.24em] text-text3">Focus</span><select value={focus} onChange={(event) => setFocus(event.target.value)} className="w-full rounded-xl bg-[#090912] px-3 py-3 text-text outline-none">{Object.keys(focusTemplates).map((item) => (<option key={item} value={item}>{item}</option>))}</select></label>
                  <label className="rounded-2xl border border-white/10 bg-white/5 p-4"><span className="mb-2 block text-xs uppercase tracking-[0.24em] text-text3">Duration</span><input type="number" min="30" max="120" value={duration} onChange={(event) => setDuration(Number(event.target.value))} className="w-full rounded-xl bg-[#090912] px-3 py-3 text-text outline-none" /></label>
                </div>
                <div className="mt-4 rounded-[24px] border border-blue/20 bg-blue/10 p-4">
                  <div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.24em] text-blue">Generated</p><h4 className="mt-2 text-xl font-bold text-text">{generatedRoutine.name}</h4></div><button type="button" onClick={() => onStartWorkout(generatedRoutine)} className="rounded-full bg-blue px-4 py-3 text-sm font-bold text-[#03131d]">Launch ?</button></div>
                  <p className="mt-3 text-sm text-text2">{generatedRoutine.routine_exercises.map((exercise) => exercise.exercise_name).join(" • ")}</p>
                </div>
              </div>
            )}
          </section>

          <section className="space-y-3"><div className="flex items-center justify-between"><div><h3 className="text-lg font-semibold text-text">Routines</h3><p className="text-sm text-text3">{routines.length} saved in Supabase</p></div><button type="button" onClick={() => onOpenRoutineModal()} className="rounded-full bg-blue px-4 py-2 text-sm font-semibold text-[#03131d]">+ Add Routine</button></div><div className="space-y-3">{routines.map((routine) => (<article key={routine.id} className="rounded-[24px] border border-white/10 bg-card p-5"><div className="flex items-start justify-between gap-3"><div><h4 className="text-xl font-semibold text-text">{routine.name}</h4><p className="mt-1 text-sm text-text2">{routine.routine_exercises.reduce((sum, exercise) => sum + Number(exercise.sets), 0)} total sets</p></div><div className="flex flex-wrap justify-end gap-2"><button type="button" onClick={() => onOpenRoutine(routine)} className="rounded-full border border-blue/30 px-3 py-2 text-sm text-blue">Open</button><button type="button" onClick={() => onOpenRoutineModal(routine)} className="rounded-full border border-white/10 px-3 py-2 text-sm text-text2">Edit</button><button type="button" onClick={() => onDuplicateRoutine(routine)} className="rounded-full border border-white/10 px-3 py-2 text-sm text-text2">Duplicate</button><button type="button" onClick={() => onDeleteRoutine(routine.id)} className="rounded-full border border-red/30 px-3 py-2 text-sm text-red">Delete</button></div></div><div className="mt-4 grid gap-2">{routine.routine_exercises.map((exercise) => (<div key={`${routine.id}-${exercise.id}`} className="flex items-center justify-between rounded-2xl border border-white/8 bg-[#090912] px-4 py-3"><div><p className="font-medium text-text">{exercise.exercise_name}</p><p className="text-xs text-text3">{exercise.muscle_group}</p></div><p className="font-mono text-sm text-blue">{exercise.sets} x {exercise.reps}</p></div>))}</div></article>))}</div></section>
        </div>
      )}

      {activeTab === "myPlan" && (
        <div className="space-y-5"><div className="rounded-[28px] border border-blue/20 bg-gradient-to-br from-blue/15 to-card p-6 text-center"><div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-blue/20 bg-[#090912] text-5xl">??</div><h3 className="mt-4 text-2xl font-bold text-text">Plan Builder</h3><p className="mt-2 text-sm text-text2">Create entire workout weeks that map directly to your goals, recovery, and current output.</p><button type="button" onClick={() => setSubTab("workout", "schedule")} className="mt-5 rounded-full bg-blue px-5 py-3 text-sm font-bold text-[#03131d]">CREATE MY PLAN</button></div><BodyDiagramCard /><div className="rounded-[24px] border border-white/10 bg-card p-5"><div className="mb-4 flex items-center justify-between"><div><h3 className="text-xl font-bold text-text">Weekly Planner</h3><p className="text-sm text-text3">Editable via routines and plan assignments</p></div><button type="button" onClick={() => onOpenRoutineModal()} className="rounded-full border border-white/10 px-4 py-2 text-sm text-text2">+ Assign Workout</button></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{weeklyPlan.map((entry) => (<div key={entry.day} className={`rounded-[22px] border p-4 ${entry.routine === "Rest" ? "border-white/10 bg-[#090912]" : "border-blue/20 bg-blue/10"}`}><p className="text-xs uppercase tracking-[0.28em] text-text3">{entry.day}</p><p className="mt-2 text-lg font-semibold text-text">{entry.routine}</p><p className="mt-1 text-sm text-text2">{entry.sets} sets • {entry.duration}</p></div>))}</div></div></div>
      )}

      {activeTab === "schedule" && (
        <div className="space-y-5"><div className="rounded-[24px] border border-white/10 bg-card p-5"><div className="flex items-center justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.28em] text-text3">Read only daily schedule</p><h3 className="mt-2 text-2xl font-bold text-text">Locked 4 AM to 10 PM operating system</h3></div><div className="rounded-full bg-green/20 px-4 py-2 text-sm font-bold text-green">{scheduleProgress}% done</div></div><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">{[["Active hours", scheduleMeta.activeHours],["Pure work", scheduleMeta.pureWork],["Gym", scheduleMeta.gym],["Recovery", scheduleMeta.recovery],["Sleep", scheduleMeta.sleepWindow]].map(([label, value]) => (<div key={label} className="rounded-2xl border border-white/10 bg-[#090912] p-4 text-center"><p className="text-xs uppercase tracking-[0.24em] text-text3">{label}</p><p className="mt-2 text-xl font-bold text-blue">{value}</p></div>))}</div></div><div className="space-y-3">{scheduleBlocks.map((block) => { const complete = completedToday.includes(block.id); return (<button key={block.id} type="button" onClick={() => onToggleSchedule(block.id, todayString)} className={`w-full rounded-[24px] border p-5 text-left transition ${complete ? "border-green/30 bg-green/10" : "border-white/10 bg-card hover:border-blue/30"}`}><div className="flex items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-text3">{block.time}</span><span className="rounded-full bg-blue/10 px-3 py-1 text-xs font-semibold text-blue">{block.tag}</span></div><h4 className="mt-3 text-lg font-semibold text-text">{block.title}</h4><p className="mt-2 text-sm text-text2">{block.output}</p><p className="mt-3 text-sm leading-6 text-text3">{block.description}</p></div><div className={`flex h-10 w-10 items-center justify-center rounded-full border ${complete ? "border-green/30 bg-green text-[#07140d]" : "border-white/10 bg-[#090912] text-text3"}`}>{complete ? "?" : "?"}</div></div></button>);})}</div><div className="rounded-[24px] border border-white/10 bg-card p-5"><h3 className="text-lg font-semibold text-text">Laws of this schedule</h3><ul className="mt-4 space-y-2 text-sm text-text2">{scheduleMeta.laws.map((law) => (<li key={law} className="rounded-2xl border border-white/8 bg-[#090912] px-4 py-3">{law}</li>))}</ul></div></div>
      )}
    </div>
  );
}

