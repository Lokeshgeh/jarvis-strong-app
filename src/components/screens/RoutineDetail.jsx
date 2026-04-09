import { useMemo, useState } from "react";

function bodySummary(exercises) {
  const muscles = [...new Set(exercises.map((exercise) => exercise.muscle_group ?? "General"))];
  return muscles.join(" - ") || "General strength";
}

export default function RoutineDetail({ routine, onBack, onStart, onSave }) {
  const [draftName, setDraftName] = useState(routine.name);
  const [draftExercises, setDraftExercises] = useState(routine.routine_exercises);
  const totalSets = useMemo(() => draftExercises.reduce((sum, exercise) => sum + Number(exercise.sets), 0), [draftExercises]);

  return (
    <div className="content-safe px-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <button type="button" onClick={onBack} className="rounded-full border border-white/10 px-4 py-2 text-sm text-text2">
          Back
        </button>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.28em] text-text3">Routine detail</p>
          <h2 className="text-2xl font-bold text-text">{draftName}</h2>
        </div>
      </div>

      <div className="rounded-[24px] border border-blue/20 bg-gradient-to-br from-blue/10 to-card p-5">
        <div className="grid gap-5 sm:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-text3">Targeted muscles</p>
            <h3 className="mt-2 text-xl font-bold text-text">{bodySummary(draftExercises)}</h3>
            <p className="mt-3 text-sm text-text2">{totalSets} total sets across {draftExercises.length} exercises with editable tables that save back to Supabase.</p>
            <label className="mt-4 block rounded-2xl border border-white/10 bg-white/5 p-3">
              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-text3">Routine Name</span>
              <input value={draftName} onChange={(event) => setDraftName(event.target.value)} className="w-full bg-transparent text-xl font-bold text-text outline-none" />
            </label>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button type="button" onClick={() => onStart({ ...routine, name: draftName, routine_exercises: draftExercises })} className="rounded-full bg-blue px-5 py-3 font-bold text-[#03131d]">
                Start Routine
              </button>
              <button type="button" onClick={() => onSave({ id: routine.id, name: draftName, exercises: draftExercises })} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-text2">
                Save Edit
              </button>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(`${window.location.origin}?routine=${routine.id}`);
                }}
                className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-text2"
              >
                Share Routine
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Front", "Back"].map((label) => (
              <div key={label} className="rounded-[20px] border border-white/8 bg-[#090912] p-4 text-center">
                <div className="mx-auto flex h-40 w-24 items-center justify-center rounded-[999px] border border-blue/20 bg-[radial-gradient(circle_at_center,rgba(0,191,255,0.18),transparent_70%)]">
                  <div className="h-28 w-12 rounded-[999px] border border-blue/35 bg-blue/10" />
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.24em] text-text3">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {draftExercises.map((exercise, index) => (
          <section key={exercise.id ?? `${exercise.exercise_name}-${index}`} className="rounded-[24px] border border-white/10 bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-text">{exercise.exercise_name}</h3>
                <p className="text-sm text-text3">{exercise.muscle_group}</p>
              </div>
              <span className="rounded-full bg-blue/10 px-3 py-1 text-xs font-semibold text-blue">{exercise.sets} planned sets</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-xs uppercase tracking-[0.24em] text-text3">
              <div>Set</div>
              <div>Prev</div>
              <div>KG</div>
              <div>Reps</div>
            </div>
            <div className="mt-3 space-y-2">
              {Array.from({ length: Number(exercise.sets) }).map((_, setIndex) => (
                <div key={setIndex + 1} className="grid grid-cols-4 gap-2 rounded-2xl border border-white/8 bg-[#090912] p-3 text-sm text-text">
                  <div className="flex items-center">{setIndex + 1}</div>
                  <div className="flex items-center text-text3">-</div>
                  <input
                    type="number"
                    value={exercise.kg}
                    onChange={(event) => setDraftExercises((current) => current.map((entry, rowIndex) => (rowIndex === index ? { ...entry, kg: Number(event.target.value) } : entry)))}
                    className="rounded-xl bg-white/5 px-3 py-2 text-text outline-none"
                  />
                  <input
                    type="number"
                    value={exercise.reps}
                    onChange={(event) => setDraftExercises((current) => current.map((entry, rowIndex) => (rowIndex === index ? { ...entry, reps: Number(event.target.value) } : entry)))}
                    className="rounded-xl bg-white/5 px-3 py-2 text-text outline-none"
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
