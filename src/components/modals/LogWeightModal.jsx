import { useEffect, useState } from "react";

export default function LogWeightModal({ open, onClose, onSave }) {
  const [weight, setWeight] = useState(49);
  useEffect(() => { setWeight(49); }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm"><div className="glass-card w-full max-w-[480px] rounded-[24px] border border-white/10 bg-card p-5"><div className="mb-4 flex items-center justify-between"><div><p className="text-sm uppercase tracking-[0.3em] text-text3">Bodyweight</p><h3 className="text-xl font-bold text-text">Log today&apos;s weight</h3></div><button type="button" onClick={onClose} className="rounded-full bg-white/5 px-3 py-2 text-sm text-text2">Close</button></div><label className="block rounded-2xl border border-white/10 bg-[#090912] p-4"><span className="mb-2 block text-xs uppercase tracking-[0.25em] text-text3">Weight (kg)</span><input type="number" min="20" step="0.1" value={weight} onChange={(event) => setWeight(event.target.value)} className="w-full bg-transparent text-4xl font-bold text-text outline-none" /></label><div className="mt-5 flex gap-3"><button type="button" onClick={onClose} className="flex-1 rounded-2xl border border-white/10 px-4 py-3 text-text2">Cancel</button><button type="button" onClick={() => onSave(weight)} className="flex-1 rounded-2xl bg-blue px-4 py-3 font-semibold text-[#03131d]">Save Weight</button></div></div></div>
  );
}
