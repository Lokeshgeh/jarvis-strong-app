export const starterProfile = {
  username: "Jarvis Strong",
  bio: "Discipline-first builder",
  avatar_color: "#00BFFF",
  level: 1,
  xp: 0,
  streak: 0,
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
    current_value: "0kg",
    target_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString().slice(0, 10),
  },
  {
    goal_type: "Consistency",
    target_value: "30 workouts",
    current_value: "0 workouts",
    target_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
  },
];

export const defaultAchievements = [
  { slug: "first-workout", name: "First Workout", description: "Finish your first session.", unlocked: false, progress: 0, unlock_rule: "Complete one workout" },
  { slug: "10-day-streak", name: "10-Day Streak", description: "Hit double-digit consistency.", unlocked: false, progress: 0, unlock_rule: "Reach a 10 day streak" },
  { slug: "100kg-bench", name: "100kg Bench", description: "Press triple digits with control.", unlocked: false, progress: 0, unlock_rule: "Log a 100kg bench press" },
  { slug: "titan-entry", name: "Titan Entry", description: "Enter the Titan tier on any lift.", unlocked: false, progress: 0, unlock_rule: "Reach Titan rank" },
  { slug: "meal-prep-hero", name: "Meal Prep Hero", description: "Log all meals for the day.", unlocked: false, progress: 0, unlock_rule: "Log breakfast, lunch, dinner and snacks" },
  { slug: "30-day-discipline", name: "30-Day Discipline", description: "Stay locked in for 30 days.", unlocked: false, progress: 0, unlock_rule: "Maintain a 30 day streak" },
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

export const defaultExerciseRanks = [];

export const sampleWorkoutSeeds = [];

export const defaultNutritionSeed = [];

export const sampleFriends = [
  { username: "AaravLift", bio: "Titan II - Legs and leverage", avatar_color: "#00BFFF", level: 29, xp: 612, streak: 51 },
  { username: "MiaMoves", bio: "Diamond I - Precision builder", avatar_color: "#F472B6", level: 21, xp: 355, streak: 29 },
  { username: "NoahForge", bio: "Olympian - Quiet work, loud results", avatar_color: "#FFD700", level: 34, xp: 840, streak: 73 },
];
