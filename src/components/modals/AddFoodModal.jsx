import { useEffect, useMemo, useState } from "react";
import { foodDatabase } from "../../data/foodDatabase";

export default function AddFoodModal({ open, onClose, onSave, mealType = "breakfast", initialEntry, selectedDate }) {
  const [query, setQuery] = useState(initialEntry?.food_name ?? "");
  const [quantity, setQuantity] = useState(initialEntry?.quantity ?? "1 serving");
  const [selectedFood, setSelectedFood] = useState(null);

  useEffect(() => {
    setQuery(initialEntry?.food_name ?? "");
    setQuantity(initialEntry?.quantity ?? "1 serving");
    setSelectedFood(null);
  }, [initialEntry, mealType, open]);

  const matches = useMemo(() => foodDatabase.filter((food) => food.name.toLowerCase().includes(query.toLowerCase())).slice(0, 10), [query]);
  if (!open) return null;
  const activeFood = selectedFood ?? matches[0] ?? null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm"><div className="glass-card w-full max-w-[480px] rounded-[24px] border border-white/10 bg-card p-5"><div className="mb-4 flex items-center justify-between"><div><p className="text-sm uppercase tracking-[0.3em] text-text3">Nutrition</p><h3 className="text-xl font-bold text-text">{initialEntry ? "Edit Food" : `Add to ${mealType}`}</h3></div><button type="button" onClick={onClose} className="rounded-full bg-white/5 px-3 py-2 text-sm text-text2">Close</button></div><div className="space-y-4"><label className="block"><span className="mb-2 block text-sm text-text2">Search foods</span><input value={query} onChange={(event) => { setQuery(event.target.value); setSelectedFood(null); }} placeholder="Chicken, oats, rice..." className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-text outline-none" /></label><div className="max-h-52 space-y-2 overflow-y-auto pr-1">{matches.map((food) => (<button type="button" key={food.id} onClick={() => { setSelectedFood(food); setQuery(food.name); setQuantity(food.defaultQuantity); }} className={`w-full rounded-2xl border px-4 py-3 text-left ${activeFood?.id === food.id ? "border-blue bg-blue/10" : "border-white/10 bg-[#090912]"}`}><div className="flex items-center justify-between gap-3"><div><p className="font-semibold text-text">{food.name}</p><p className="text-xs text-text3">Default {food.defaultQuantity}</p></div><p className="text-sm font-semibold text-orange">{food.calories} kcal</p></div></button>))}</div><label className="block"><span className="mb-2 block text-sm text-text2">Quantity</span><input value={quantity} onChange={(event) => setQuantity(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-text outline-none" /></label></div>{activeFood && <div className="mt-4 rounded-2xl border border-white/10 bg-[#090912] p-4 text-sm text-text2"><div className="mb-2 flex items-center justify-between"><span className="font-semibold text-text">Selected</span><span className="font-mono text-blue">{activeFood.calories} kcal</span></div><p>Protein {activeFood.protein}g • Carbs {activeFood.carbs}g • Fat {activeFood.fat}g • Fiber {activeFood.fiber}g</p></div>}<div className="mt-5 flex gap-3"><button type="button" onClick={onClose} className="flex-1 rounded-2xl border border-white/10 px-4 py-3 text-text2">Cancel</button><button type="button" disabled={!activeFood} onClick={() => onSave({ id: initialEntry?.id, log_date: selectedDate, meal_type: mealType, food_name: activeFood.name, quantity, calories: activeFood.calories, protein_g: activeFood.protein, carbs_g: activeFood.carbs, fat_g: activeFood.fat, fiber_g: activeFood.fiber })} className="flex-1 rounded-2xl bg-orange px-4 py-3 font-semibold text-white disabled:opacity-40">Save Food</button></div></div></div>
  );
}
