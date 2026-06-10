export type Profile = {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    role: 'trainer' | 'student';
    trainer_code?: string | null;
    bio?: string | null;
    specialties?: string[] | null;
    rating?: number;
    is_verified?: boolean;
    created_at: string;
    plan_tier?: string;
    elite_until: string | null;
    trial_activated_at: string | null;
    ai_pdfs_imported_this_month: number;
    pdf_import_limit: number;
};

export type StudentDetails = {
    id: string; // references profile id
    birth_date: string | null;
    height: number | null;
    starting_weight: number | null;
    activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete' | null;
    goal: string | null;
    steroid_use: boolean;
    observations: string | null;
};

export type TrainerStudent = {
    id: string;
    trainer_id: string;
    student_id: string;
    monthly_fee: number;
    active: boolean;
    billing_source: 'marketplace' | 'external' | 'manual';
    plan_tier?: string;
    student?: Profile;
};


export type Workout = {
    id: string;
    trainer_id: string;
    name: string;
    description: string | null;
    created_at: string;
    exercises?: WorkoutExercise[];
};

export type Exercise = {
    id: string;
    trainer_id: string | null;
    name: string;
    video_url: string | null;
    muscle_group: string | null;
    description: string | null;
    is_system_default: boolean;
};

export type WorkoutExercise = {
    id: string;
    workout_id: string;
    exercise_id: string;
    order_index: number;
    sets: number;
    reps: string;
    rest_seconds: number;
    notes: string | null;
    exercise?: Exercise;
};

export type Diet = {
    id: string;
    trainer_id: string;
    name: string;
    created_at: string;
    meals?: Meal[];
};

export type Meal = {
    id: string;
    diet_id: string;
    name: string;
    time_of_day: string | null;
    order_index: number;
    items?: MealItem[];
};

export type MealItem = {
    id: string;
    meal_id: string;
    food_name: string;
    quantity: string;
    approx_measure: string | null;
    calories: number | null;
    macros: any | null;
};

export type LoadHistory = {
    id: string;
    student_id: string;
    exercise_id: string;
    weight_kg: number;
    reps_performed: number | null;
    recorded_at: string;
};

export type Plan = {
  id: string
  slug: string
  name: string
  description: string | null
  billing_type: 'monthly' | 'annual' | 'on_demand'
  base_price_cents: number
  sort_order: number
  card_theme: 'default' | 'highlighted' | 'premium'
  is_active: boolean
  is_public?: boolean
  created_at: string
}

export type PlanFeatures = {
  plan_id: string
  student_limit: number | null
  free_students_limit: number | null
  price_per_student_cents: number | null
  photo_updates_limit: number | null
  pdf_import_limit: number | null
  prestige_points: number
  has_workouts: boolean
  has_diets: boolean
  has_cardio: boolean
  has_ergogenics: boolean
  has_import_pdf_ai: boolean
  has_public_profile: boolean
  has_public_feed: boolean
  has_store: boolean
  has_ranking: boolean
  has_elite_badge: boolean
}

export type PlanWithFeatures = Plan & { plan_features_dynamic: PlanFeatures }
export type PlanWithStats = PlanWithFeatures & { subscriber_count: number }
