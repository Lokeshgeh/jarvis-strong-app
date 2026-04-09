import { useEffect, useMemo, useState } from "react";

const muscleMap = {
  squat: "Legs",
  deadlift: "Back",
  bench: "Chest",
  press: "Shoulders",
  row: "Back",
  curl: "Arms",
  pull: "Back",
  fly: "Chest",
  lunge: "Glutes",
};

function inferMuscleGroup(exerciseName) {
  const match = Object.keys(muscleMap).find((keyword) => exerciseName.toLowerCase().includes(keyword));
  return match ? muscleMap[match] : "General";
}

export default function AddRoutineModal({ open, onClose, onSave, initialRoutine }) {
  const [name, setName] = useState(initialRoutine?.name ?? "");
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseRows, setExerciseRows] = useState(initialRoutine?.routine_exercises?.map((exercise, index) => ({ ...exercise, sort_order: index + 1 })) ?? []);

  useEffect(() => {
    setName(initialRoutine?.name ?? "");
    setExerciseName("");
    setExerciseRows(initialRoutine?.routine_exercises?.map((exercise, index) => ({ ...exercise, sort_order: index + 1 })) ?? []);
  }, [initialRoutine, open]);

  const canSave = useMemo(() => name.trim() && exerciseRows.length > 0, [exerciseRows.length, name]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="glass-card w-full max-w-[480px] rounded-[24px] border border-white/10 bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-text3">Routine Builder</p>
            <h3 className="text-xl font-bold text-text">{initialRoutine ? "Edit Routine" : "Add Routine"}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-white/5 px-3 py-2 text-sm text-text2">Close</button>
        </div>
        <label className="mb-4 block"><span className="mb-2 block text-sm text-text2">Routine name</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Legs" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-text outline-none" /></label>
        <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4"><div className="flex gap-2"><input value={exerciseName} onChange={(event) => setExerciseName(event.target.value)} placeholder="Add exercise" className="flex-1 rounded-2xl border border-white/10 bg-[#090912] px-4 py-3 text-text outline-none" /><button type="button" onClick={() => { if (!exerciseName.trim()) return; setExerciseRows((current) => [...current, { exercise_name: exerciseName.trim(), sets: 3, kg: 0, reps: 8, sort_order: current.length + 1, muscle_group: inferMuscleGroup(exerciseName) }]); setExerciseName(""); }} className="rounded-2xl bg-blue px-4 py-3 text-sm font-semibold text-[#03131d]">Add</button></div></div>
        <div className="max-h-[44vh] space-y-3 overflow-y-auto pr-1">{exerciseRows.map((exercise, index) => (<div key={`${exercise.exercise_name}-${index}`} className="rounded-2xl border border-white/10 bg-[#090912] p-4"><div className="mb-3 flex items-center justify-between gap-2"><div><p className="font-semibold text-text">{exercise.exercise_name}</p><p className="text-xs text-text3">{exercise.muscle_group}</p></div><button type="button" onClick={() => setExerciseRows((current) => current.filter((_, rowIndex) => rowIndex !== index))} className="rounded-full bg-red/20 px-3 py-1 text-xs font-semibold text-red">Delete</button></div><div className="grid grid-cols-3 gap-2">{[["sets", "Sets"],["kg", "KG"],["reps", "Reps"]].map(([field, label]) => (<label key={field} className="rounded-2xl border border-white/10 bg-white/5 p-3"><span className="mb-2 block text-xs uppercase tracking-[0.25em] text-text3">{label}</span><input type="number" min="0" value={exercise[field]} onChange={(event) => { const value = Number(event.target.value); setExerciseRows((current) => current.map((entry, rowIndex) => (rowIndex === index ? { ...entry, [field]: value } : entry))); }} className="w-full bg-transparent text-lg font-semibold text-text outline-none" /></label>))}</div></div>))}</div>
        <div className="mt-5 flex gap-3"><button type="button" onClick={onClose} className="flex-1 rounded-2xl border border-white/10 px-4 py-3 text-text2">Cancel</button><button type="button" disabled={!canSave} onClick={() => onSave({ id: initialRoutine?.id, name, exercises: exerciseRows })} className="flex-1 rounded-2xl bg-blue px-4 py-3 font-semibold text-[#03131d] disabled:opacity-40">Save Routine</button></div>
      </div>
    </div>
  );
}
