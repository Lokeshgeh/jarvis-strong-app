import { useEffect, useMemo, useState } from "react";

function secondsToClock(totalSeconds) {
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function buildSessionExercises(routine, getPreviousPerformance) {
  if (!routine.routine_exercises?.length) {
    return [{ exercise_name: "Add your first exercise", muscle_group: "General", sets: [{ kg: 0, reps: 0, completed: false, previous: null }] }];
  }
  return routine.routine_exercises.map((exercise) => ({
    exercise_name: exercise.exercise_name,
    muscle_group: exercise.muscle_group ?? "General",
    sets: Array.from({ length: Number(exercise.sets ?? 3) }).map(() => ({ kg: Number(exercise.kg ?? 0), reps: Number(exercise.reps ?? 8), completed: false, previous: getPreviousPerformance(exercise.exercise_name) })),
  }));
}

export default function ActiveWorkout({ routine, getPreviousPerformance, onBack, onComplete }) {
  const [elapsed, setElapsed] = useState(0);
  const [notes, setNotes] = useState("");
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [restTimer, setRestTimer] = useState(90);
  const [sessionExercises, setSessionExercises] = useState(() => buildSessionExercises(routine, getPreviousPerformance));

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed((current) => current + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setRestTimer((current) => (current <= 0 ? 90 : current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const activeExercise = sessionExercises[exerciseIndex];
  const completedSets = useMemo(() => sessionExercises.flatMap((exercise) => exercise.sets).filter((set) => set.completed).length, [sessionExercises]);

  return (
    <div className="content-safe px-4">
      <div className="mb-4 flex items-center justify-between gap-3"><button type="button" onClick={onBack} className="rounded-full border border-white/10 px-4 py-2 text-sm text-text2">? Exit</button><div className="text-right"><p className="text-xs uppercase tracking-[0.28em] text-text3">Active session</p><h2 className="text-2xl font-bold text-text">{routine.name}</h2><p className="font-mono text-sm text-blue">{secondsToClock(elapsed)}</p></div></div>
      <div className="rounded-[24px] border border-white/10 bg-card p-5">
        <div className="mb-4 flex items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-[0.24em] text-text3">Exercise {exerciseIndex + 1} of {sessionExercises.length}</p><h3 className="mt-2 text-xl font-bold text-text">{activeExercise.exercise_name}</h3><p className="mt-1 text-sm text-text2">{activeExercise.muscle_group}</p></div><div className="rounded-full bg-orange/20 px-4 py-2 text-sm font-semibold text-orange">Rest {restTimer}s</div></div>
        <div className="mb-4 rounded-[24px] border border-blue/20 bg-gradient-to-br from-blue/12 to-[#090912] p-5 text-sm text-text2"><p className="font-semibold text-text">Move with intent</p><p className="mt-2">Log every set, mark it green, then roll into the next one without losing the pace.</p></div>
        <div className="grid grid-cols-5 gap-2 text-xs uppercase tracking-[0.24em] text-text3"><div>Set</div><div>Previous</div><div>Weight</div><div>Reps</div><div>Done</div></div>
        <div className="mt-3 space-y-2">{activeExercise.sets.map((set, setIndex) => (<div key={setIndex + 1} className={`grid grid-cols-5 gap-2 rounded-2xl border p-3 ${set.completed ? "border-green/30 bg-green/10" : "border-white/8 bg-[#090912]"}`}><div className="flex items-center text-text">{setIndex + 1}</div><div className="flex items-center text-xs text-text3">{set.previous ? `${set.previous.weight_kg}kg x ${set.previous.reps}` : "-"}</div><input type="number" value={set.kg} onChange={(event) => setSessionExercises((current) => current.map((exercise, rowIndex) => rowIndex === exerciseIndex ? { ...exercise, sets: exercise.sets.map((entry, rowSetIndex) => rowSetIndex === setIndex ? { ...entry, kg: Number(event.target.value) } : entry) } : exercise))} className="rounded-xl bg-white/5 px-3 py-2 text-text outline-none" /><input type="number" value={set.reps} onChange={(event) => setSessionExercises((current) => current.map((exercise, rowIndex) => rowIndex === exerciseIndex ? { ...exercise, sets: exercise.sets.map((entry, rowSetIndex) => rowSetIndex === setIndex ? { ...entry, reps: Number(event.target.value) } : entry) } : exercise))} className="rounded-xl bg-white/5 px-3 py-2 text-text outline-none" /><button type="button" onClick={() => { setRestTimer(90); setSessionExercises((current) => current.map((exercise, rowIndex) => rowIndex === exerciseIndex ? { ...exercise, sets: exercise.sets.map((entry, rowSetIndex) => rowSetIndex === setIndex ? { ...entry, completed: !entry.completed } : entry) } : exercise)); }} className={`rounded-xl px-3 py-2 text-sm font-semibold ${set.completed ? "bg-green text-[#07140d]" : "bg-white/5 text-text2"}`}>?</button></div>))}</div>
        <div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={() => setSessionExercises((current) => current.map((exercise, rowIndex) => rowIndex === exerciseIndex ? { ...exercise, sets: [...exercise.sets, { kg: 0, reps: 0, completed: false, previous: null }] } : exercise))} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-text2">+ Add Set</button><button type="button" onClick={() => setRestTimer(0)} className="rounded-2xl border border-orange/30 px-4 py-3 text-sm text-orange">Skip Rest</button><button type="button" onClick={() => setExerciseIndex((current) => Math.min(sessionExercises.length - 1, current + 1))} className="rounded-2xl border border-blue/20 px-4 py-3 text-sm text-blue">Next Exercise ?</button></div>
      </div>
      <label className="mt-5 block rounded-[24px] border border-white/10 bg-card p-5"><span className="mb-2 block text-sm text-text2">Session notes</span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What felt strong today?" className="min-h-[100px] w-full bg-transparent text-text outline-none" /></label>
      <div className="mt-5 flex items-center justify-between gap-4 rounded-[24px] border border-red/20 bg-red/10 p-5"><div><p className="text-xs uppercase tracking-[0.24em] text-text3">Live progress</p><p className="mt-2 text-xl font-bold text-text">{completedSets} completed sets</p></div><button type="button" onClick={() => onComplete({ routine_name: routine.name, duration_seconds: elapsed, exercises: sessionExercises, notes })} className="rounded-full bg-red px-5 py-3 text-sm font-bold text-white">FINISH WORKOUT</button></div>
    </div>
  );
}

