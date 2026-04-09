const colors = ["#00BFFF", "#FF6B35", "#FFD700", "#A78BFA", "#22C55E"];

export default function WorkoutSummary({ summary, onBackHome }) {
  return (
    <div className="content-safe px-4">
      <div className="relative overflow-hidden rounded-[28px] border border-gold/20 bg-gradient-to-br from-[#171126] to-card p-6">
        <div className="confetti-layer" aria-hidden>
          {Array.from({ length: 18 }).map((_, index) => (
            <span
              key={index}
              style={{ left: `${5 + index * 5}%`, backgroundColor: colors[index % colors.length], animationDelay: `${index * 0.14}s` }}
            />
          ))}
        </div>
        <p className="text-sm uppercase tracking-[0.28em] text-gold">Workout Complete</p>
        <h2 className="mt-2 text-4xl font-bold text-text">?? Session sealed</h2>
        <p className="mt-3 max-w-[24rem] text-sm text-text2">High-quality reps banked. XP is up, streak is alive, and the next session now has a stronger base.</p>
        <div className="mt-4 inline-flex rounded-full bg-blue/15 px-4 py-2 text-lg font-bold text-blue">+{summary.xpGained} XP</div>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{[["Duration", `${Math.round(summary.duration_seconds / 60)} min`],["Volume", `${Math.round(summary.volume_kg)} kg`],["Sets", `${summary.sets_completed}`],["Records", `${summary.records_broken}`]].map(([label, value]) => (<div key={label} className="rounded-[24px] border border-white/10 bg-card p-5"><p className="text-xs uppercase tracking-[0.24em] text-text3">{label}</p><p className="mt-2 text-3xl font-bold text-text">{value}</p></div>))}</div>
      <div className="mt-5 rounded-[24px] border border-blue/20 bg-card p-5"><div className="flex items-center justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.24em] text-text3">Muscles trained</p><h3 className="mt-2 text-xl font-bold text-text">{summary.muscles.join(" • ")}</h3></div><button type="button" onClick={async () => { await navigator.clipboard.writeText(`${summary.routine_name} • ${summary.sets_completed} sets • ${summary.xpGained} XP`); window.alert("Workout card copied. You can paste it anywhere."); }} className="rounded-full border border-white/10 px-4 py-2 text-sm text-text2">Share Workout</button></div><div className="mt-4 grid grid-cols-2 gap-3">{["Front", "Back"].map((label) => (<div key={label} className="rounded-[20px] border border-white/8 bg-[#090912] p-4 text-center"><div className="mx-auto h-36 w-24 rounded-[999px] border border-blue/25 bg-[radial-gradient(circle_at_center,rgba(0,191,255,0.2),transparent_70%)]" /><p className="mt-3 text-xs uppercase tracking-[0.24em] text-text3">{label}</p></div>))}</div></div>
      <button type="button" onClick={onBackHome} className="mt-5 w-full rounded-full bg-blue px-5 py-4 text-sm font-bold text-[#03131d]">Back to Home</button>
    </div>
  );
}

