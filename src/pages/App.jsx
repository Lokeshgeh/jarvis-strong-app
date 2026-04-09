import { useMemo } from "react";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import AddFoodModal from "../components/modals/AddFoodModal";
import AddRoutineModal from "../components/modals/AddRoutineModal";
import LogWeightModal from "../components/modals/LogWeightModal";
import SettingsModal from "../components/modals/SettingsModal";
import FriendsTab from "../components/tabs/FriendsTab";
import HomeTab from "../components/tabs/HomeTab";
import NutritionTab from "../components/tabs/NutritionTab";
import ProfileTab from "../components/tabs/ProfileTab";
import RanksTab from "../components/tabs/RanksTab";
import WorkoutTab from "../components/tabs/WorkoutTab";
import ActiveWorkout from "../components/screens/ActiveWorkout";
import RoutineDetail from "../components/screens/RoutineDetail";
import WorkoutSummary from "../components/screens/WorkoutSummary";
import { useAuth } from "../hooks/useAuth";
import { useNutrition } from "../hooks/useNutrition";
import { useWorkouts } from "../hooks/useWorkouts";
import Login from "./Login";
import { useAppState } from "../store/globalState";

function LoadingScreen({ label }) {
  return <div className="app-shell flex min-h-screen items-center justify-center text-lg font-semibold text-text2">{label}</div>;
}

function ConfigScreen() {
  return <div className="app-shell flex min-h-screen items-center justify-center px-4"><div className="mobile-frame rounded-[32px] border border-white/10 bg-card p-6"><h1 className="text-3xl font-bold text-text">Supabase setup required</h1><p className="mt-4 text-sm text-text2">Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file, then restart Vite. The app is built to use cloud storage only.</p></div></div>;
}

export default function App() {
  const auth = useAuth();
  const appState = useAppState();
  const workoutData = useWorkouts(auth.user);
  const nutrition = useNutrition(auth.user);

  const stats = useMemo(() => ({ workouts: workoutData.workouts.length, streak: workoutData.profile?.streak ?? 46, records: workoutData.workouts.reduce((sum, workout) => sum + Number(workout.records_broken ?? 0), 0) }), [workoutData.profile?.streak, workoutData.workouts]);

  if (!auth.isSupabaseReady) return <ConfigScreen />;
  if (auth.loading) return <LoadingScreen label="Restoring session..." />;
  if (!auth.user) return <Login auth={auth} />;
  if (workoutData.loading || nutrition.loading) return <LoadingScreen label="Syncing your cloud dashboard..." />;

  const { activeTab, setActiveTab, setSubTab, overlay, openOverlay, closeOverlay, modal, openModal, closeModal, selectedDate, setSelectedDate } = appState;

  const handleSaveFood = async (entry) => {
    if (entry.id) {
      await nutrition.updateFood(entry);
    } else {
      await nutrition.addFood(entry);
    }
    closeModal();
  };

  const handleSaveProfile = async (updates) => {
    await workoutData.saveProfile(updates);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(workoutData.exportUserData(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "jarvis-strong-export.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = async () => {
    if (!window.confirm("Reset your data and reseed defaults?")) return;
    await workoutData.resetAllData();
    await nutrition.refresh();
    closeModal();
  };

  const renderTab = () => {
    if (activeTab === "workout") {
      return <WorkoutTab routines={workoutData.routines} weeklyPlan={workoutData.weeklyPlan} scheduleCompletions={workoutData.scheduleCompletions} onToggleSchedule={workoutData.toggleScheduleBlock} onOpenRoutine={(routine) => openOverlay("routine", routine)} onStartWorkout={(routine) => openOverlay("workout", routine)} onOpenRoutineModal={(routine = null) => openModal("routine", routine)} onDuplicateRoutine={workoutData.duplicateRoutine} onDeleteRoutine={workoutData.deleteRoutine} />;
    }
    if (activeTab === "home") {
      return <HomeTab workouts={workoutData.workouts} bodyweightLog={workoutData.bodyweightLog} goals={workoutData.goals} friends={workoutData.friends} onSaveGoal={workoutData.saveGoal} onOpenWeightModal={() => openModal("weight")} onGoToRanks={() => { setActiveTab("ranks"); setSubTab("ranks", "bodygraph"); }} />;
    }
    if (activeTab === "ranks") {
      return <RanksTab profile={workoutData.profile} workouts={workoutData.workouts} galleryEntries={workoutData.galleryEntries} onSaveExerciseRank={workoutData.saveExerciseRank} />;
    }
    if (activeTab === "nutrition") {
      return <NutritionTab nutritionEntries={nutrition.nutritionEntries} bodyweightLog={workoutData.bodyweightLog} mealPlans={workoutData.mealPlans} selectedDate={selectedDate} setSelectedDate={setSelectedDate} onOpenFoodModal={(mealType, entry = null) => openModal("food", { mealType, entry })} onDeleteFood={nutrition.deleteFood} onSaveMealPlanEntry={workoutData.saveMealPlanEntry} onResetMealPlan={workoutData.resetMealPlan} onQuickAddRecipe={(recipe) => nutrition.addFood({ log_date: selectedDate, meal_type: recipe.mealType, food_name: recipe.name, quantity: "1 serving", calories: recipe.kcal, protein_g: Math.round(recipe.kcal * 0.08), carbs_g: Math.round(recipe.kcal * 0.11), fat_g: Math.round(recipe.kcal * 0.03), fiber_g: 4 })} />;
    }
    if (activeTab === "friends") {
      return <FriendsTab user={auth.user} friends={workoutData.friends} onAddFriend={workoutData.addFriend} onRemoveFriend={workoutData.removeFriend} />;
    }
    return <ProfileTab profile={workoutData.profile} workouts={workoutData.workouts} achievements={workoutData.achievements} routines={workoutData.routines} goals={workoutData.goals} onSaveProfile={handleSaveProfile} onOpenSettings={() => openModal("settings")} onOpenRoutine={(routine) => openOverlay("routine", routine)} />;
  };

  return (
    <div className="app-shell">
      <div className="mobile-frame">
        <Header profile={workoutData.profile} syncStamp={workoutData.syncStamp} />

        {overlay.type === "routine" && <RoutineDetail routine={overlay.payload} onBack={closeOverlay} onStart={(routine) => openOverlay("workout", routine)} onSave={async (routine) => { await workoutData.saveRoutine(routine); closeOverlay(); }} />}
        {overlay.type === "workout" && <ActiveWorkout routine={overlay.payload} getPreviousPerformance={workoutData.getPreviousPerformance} onBack={closeOverlay} onComplete={async (session) => { const summary = await workoutData.finishWorkout(session); await nutrition.refresh(); openOverlay("summary", summary); }} />}
        {overlay.type === "summary" && <WorkoutSummary summary={overlay.payload} onBackHome={() => { closeOverlay(); setActiveTab("home"); }} />}
        {!overlay.type && <main className="content-safe px-4 pb-28">{renderTab()}</main>}

        <BottomNav />

        <AddRoutineModal open={modal.type === "routine" || (modal.type === "quick-add" && activeTab === "workout")} initialRoutine={modal.payload} onClose={closeModal} onSave={async (routine) => { await workoutData.saveRoutine(routine); closeModal(); }} />
        <AddFoodModal open={modal.type === "food" || (modal.type === "quick-add" && activeTab === "nutrition")} mealType={modal.payload?.mealType ?? "breakfast"} initialEntry={modal.payload?.entry ?? null} selectedDate={selectedDate} onClose={closeModal} onSave={handleSaveFood} />
        <LogWeightModal open={modal.type === "weight"} onClose={closeModal} onSave={async (weightKg) => { await workoutData.logBodyweight(weightKg); closeModal(); }} />
        <SettingsModal open={modal.type === "settings"} profile={workoutData.profile} stats={stats} onClose={closeModal} onSave={async (draft) => { await workoutData.saveProfile(draft); closeModal(); }} onExport={handleExport} onReset={handleReset} onSignOut={auth.signOut} />
      </div>
    </div>
  );
}

