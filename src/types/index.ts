
export type Profile = {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    role: 'trainer' | 'student';
    trainer_code?: string | null;
    stripe_account_id?: string | null;
    bio?: string | null;
    specialties?: string[] | null;
    rating?: number;
    is_verified?: boolean;
    created_at: string;
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
    plan_tier: 'none' | 'on_demand' | 'start' | 'pro' | 'elite';
    student?: Profile;
};

export type PdfUpload = {
    id: string;
    uploader_id: string;
    file_url: string;
    original_filename: string | null;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    type: 'workout' | 'diet';
    created_at: string;
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
