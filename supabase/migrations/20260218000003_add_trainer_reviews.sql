
-- 1. Create trainer_reviews table
CREATE TABLE IF NOT EXISTS trainer_reviews (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    trainer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, trainer_id) -- Only one review per student/trainer pair
);

-- 2. Enable RLS
ALTER TABLE trainer_reviews ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
DROP POLICY IF EXISTS "Anyone can view trainer reviews" ON trainer_reviews;
CREATE POLICY "Anyone can view trainer reviews" 
ON trainer_reviews FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Students can create/update their own reviews" ON trainer_reviews;
CREATE POLICY "Students can create/update their own reviews" 
ON trainer_reviews FOR ALL 
USING (auth.uid() = student_id);

-- 4. Function and Trigger to Update Profiles (average_rating and total_reviews)
CREATE OR REPLACE FUNCTION update_trainer_stats() 
RETURNS trigger AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        UPDATE profiles 
        SET 
            average_rating = (
                SELECT COALESCE(AVG(rating)::numeric(3,2), 0) 
                FROM trainer_reviews 
                WHERE trainer_id = OLD.trainer_id
            ),
            total_reviews = (
                SELECT COUNT(*) 
                FROM trainer_reviews 
                WHERE trainer_id = OLD.trainer_id
            )
        WHERE id = OLD.trainer_id;
        RETURN OLD;
    ELSE
        UPDATE profiles 
        SET 
            average_rating = (
                SELECT COALESCE(AVG(rating)::numeric(3,2), 0) 
                FROM trainer_reviews 
                WHERE trainer_id = NEW.trainer_id
            ),
            total_reviews = (
                SELECT COUNT(*) 
                FROM trainer_reviews 
                WHERE trainer_id = NEW.trainer_id
            )
        WHERE id = NEW.trainer_id;
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create Trigger
DROP TRIGGER IF EXISTS tr_update_trainer_stats ON trainer_reviews;
CREATE TRIGGER tr_update_trainer_stats
AFTER INSERT OR UPDATE OR DELETE ON trainer_reviews
FOR EACH ROW EXECUTE FUNCTION update_trainer_stats();
