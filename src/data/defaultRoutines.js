export const starterProfile = {
  username: "Jarvis Strong",
  bio: "Diamond II • Discipline-first builder",
  avatar_color: "#00BFFF",
  level: 27,
  xp: 410,
  streak: 46,
  units: "kg",
  notification_time: "04:00",
  is_public: true,
};

export const defaultRoutines = [
  {
    name: "Legs",
    exercises: [
      { exercise_name: "Back Squat", sets: 3, kg: 45, reps: 8, sort_order: 1, muscle_group: "Legs" },
      { exercise_name: "Romanian Deadlift", sets: 3, kg: 40, reps: 8, sort_order: 2, muscle_group: "Hamstrings" },
      { exercise_name: "Walking Lunges", sets: 3, kg: 14, reps: 12, sort_order: 3, muscle_group: "Glutes" },
      { exercise_name: "Standing Calf Raise", sets: 3, kg: 30, reps: 15, sort_order: 4, muscle_group: "Calves" },
    ],
  },
  {
    name: "Push",
    exercises: [
      { exercise_name: "Bench Press", sets: 3, kg: 80, reps: 8, sort_order: 1, muscle_group: "Chest" },
      { exercise_name: "Incline Dumbbell Press", sets: 3, kg: 30, reps: 10, sort_order: 2, muscle_group: "Chest" },
      { exercise_name: "Cable Fly", sets: 3, kg: 15, reps: 12, sort_order: 3, muscle_group: "Chest" },
      { exercise_name: "Seated Shoulder Press", sets: 3, kg: 26, reps: 10, sort_order: 4, muscle_group: "Shoulders" },
    ],
  },
  {
    name: "Pull",
    exercises: [
      { exercise_name: "Lat Pulldown", sets: 3, kg: 60, reps: 10, sort_order: 1, muscle_group: "Back" },
      { exercise_name: "Chest Supported Row", sets: 3, kg: 50, reps: 10, sort_order: 2, muscle_group: "Back" },
      { exercise_name: "Hammer Curl", sets: 3, kg: 20, reps: 12, sort_order: 3, muscle_group: "Arms" },
      { exercise_name: "Face Pull", sets: 3, kg: 17, reps: 15, sort_order: 4, muscle_group: "Rear Delts" },
    ],
  },
];

export const defaultGoals = [
  {
    goal_type: "Strength",
    target_value: "100kg Bench",
    current_value: "80kg",
    target_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString().slice(0, 10),
  },
  {
    goal_type: "Consistency",
    target_value: "30 workouts",
    current_value: "14 workouts",
    target_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
  },
];

export const defaultAchievements = [
  { slug: "first-workout", name: "First Workout", description: "Finish your first session.", unlocked: true, progress: 100, unlock_rule: "Complete one workout" },
  { slug: "10-day-streak", name: "10-Day Streak", description: "Hit double-digit consistency.", unlocked: true, progress: 100, unlock_rule: "Reach a 10 day streak" },
  { slug: "100kg-bench", name: "100kg Bench", description: "Press triple digits with control.", unlocked: false, progress: 80, unlock_rule: "Log a 100kg bench press" },
  { slug: "titan-entry", name: "Titan Entry", description: "Enter the Titan tier on any lift.", unlocked: true, progress: 100, unlock_rule: "Reach Titan rank" },
  { slug: "meal-prep-hero", name: "Meal Prep Hero", description: "Log all meals for the day.", unlocked: true, progress: 100, unlock_rule: "Log breakfast, lunch, dinner and snacks" },
  { slug: "30-day-discipline", name: "30-Day Discipline", description: "Stay locked in for 30 days.", unlocked: false, progress: 53, unlock_rule: "Maintain a 30 day streak" },
];

export const defaultMealPlan = [
  ["mon", "breakfast", "Protein oats"],
  ["mon", "lunch", "Rice bowl"],
  ["mon", "dinner", "Lean plate"],
  ["tue", "breakfast", "Greek yogurt bowl"],
  ["tue", "lunch", "Chicken rice"],
  ["tue", "dinner", "Dal rice"],
  ["wed", "breakfast", "Egg wrap"],
  ["wed", "lunch", "Paneer bowl"],
  ["wed", "dinner", "Salmon salad"],
  ["thu", "breakfast", "Protein smoothie"],
  ["thu", "lunch", "Turkey sandwich"],
  ["thu", "dinner", "Chicken stir fry"],
  ["fri", "breakfast", "Overnight oats"],
  ["fri", "lunch", "Burrito bowl"],
  ["fri", "dinner", "Steak potatoes"],
  ["sat", "breakfast", "Banana pancakes"],
  ["sat", "lunch", "Pasta protein bowl"],
  ["sat", "dinner", "Grilled fish"],
  ["sun", "breakfast", "Recovery smoothie"],
  ["sun", "lunch", "Family meal"],
  ["sun", "dinner", "Soup and toast"],
].map(([day_key, meal_type, meal_text]) => ({ day_key, meal_type, meal_text }));

export const defaultExerciseRanks = [
  { exercise_name: "Pull Ups", lp: 678, tier: "OLYMPIAN", category: "Back", weight_kg: 20, reps: 8 },
  { exercise_name: "Dips", lp: 558, tier: "OLYMPIAN", category: "Chest", weight_kg: 35, reps: 10 },
  { exercise_name: "Bench Press", lp: 488, tier: "TITAN II", category: "Chest", weight_kg: 80, reps: 8 },
  { exercise_name: "Back Squat", lp: 503, tier: "TITAN I", category: "Legs", weight_kg: 120, reps: 5 },
];

export const sampleWorkoutSeeds = [
  { routine_name: "Legs", duration_seconds: 3600, volume_kg: 7120, sets_completed: 12, records_broken: 1, notes: "Moved with control.", completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString() },
  { routine_name: "Push", duration_seconds: 3300, volume_kg: 6240, sets_completed: 12, records_broken: 0, notes: "Bench felt crisp.", completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
  { routine_name: "Pull", duration_seconds: 3500, volume_kg: 5880, sets_completed: 12, records_broken: 2, notes: "Rows hit hard.", completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
  { routine_name: "Full Body", duration_seconds: 3700, volume_kg: 8010, sets_completed: 15, records_broken: 0, notes: "Solid tempo throughout.", completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() },
  { routine_name: "Push", duration_seconds: 3400, volume_kg: 6020, sets_completed: 11, records_broken: 1, notes: "Shoulders cooked.", completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString() },
  { routine_name: "Legs", duration_seconds: 3640, volume_kg: 7500, sets_completed: 14, records_broken: 1, notes: "Extra calf work.", completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11).toISOString() },
  { routine_name: "Pull", duration_seconds: 3280, volume_kg: 5950, sets_completed: 12, records_broken: 0, notes: "Grip stronger.", completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13).toISOString() },
];

export const defaultNutritionSeed = [
  ["breakfast", "Oats", "80g", 310, 13, 54, 5, 8],
  ["breakfast", "Banana", "1 medium", 110, 1, 27, 0, 3],
  ["breakfast", "Milk", "250ml", 130, 8, 12, 5, 0],
  ["lunch", "Rice", "220g", 290, 6, 64, 1, 1],
  ["lunch", "Dal", "1 bowl", 180, 11, 24, 4, 7],
  ["lunch", "Vegetables", "1 plate", 120, 4, 18, 4, 5],
  ["dinner", "Chicken", "180g", 330, 48, 0, 12, 0],
].map(([meal_type, food_name, quantity, calories, protein_g, carbs_g, fat_g, fiber_g]) => ({
  meal_type,
  food_name,
  quantity,
  calories,
  protein_g,
  carbs_g,
  fat_g,
  fiber_g,
}));

export const sampleFriends = [
  { username: "AaravLift", bio: "Titan II • Legs and leverage", avatar_color: "#00BFFF", level: 29, xp: 612, streak: 51 },
  { username: "MiaMoves", bio: "Diamond I • Precision builder", avatar_color: "#F472B6", level: 21, xp: 355, streak: 29 },
  { username: "NoahForge", bio: "Olympian • Quiet work, loud results", avatar_color: "#FFD700", level: 34, xp: 840, streak: 73 },
];

