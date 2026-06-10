-- 1. Garantir que colunas adicionais existam (segurança e idempotência)
-- O Postgres permite adicionar se não existir.
ALTER TABLE plan_features_dynamic 
ADD COLUMN IF NOT EXISTS pdf_import_limit INT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS prestige_points INT DEFAULT 0;

-- 2. Inserção / Atualização dos planos via CTEs

-- Plano 1: Starter
WITH upsert_starter AS (
  INSERT INTO plans (
    slug, name, description, billing_type, base_price_cents, sort_order, card_theme, is_active
  )
  VALUES (
    'starter', 
    'Starter', 
    'Ideal para quem está começando e quer sair do Excel.', 
    'monthly', 
    2990, 
    10, 
    'default', 
    true
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    billing_type = EXCLUDED.billing_type,
    base_price_cents = EXCLUDED.base_price_cents,
    sort_order = EXCLUDED.sort_order,
    card_theme = EXCLUDED.card_theme,
    is_active = EXCLUDED.is_active
  RETURNING id
)
INSERT INTO plan_features_dynamic (
  plan_id, student_limit, free_students_limit, price_per_student_cents, 
  photo_updates_limit, pdf_import_limit, prestige_points, has_workouts, 
  has_diets, has_cardio, has_ergogenics, has_import_pdf_ai, 
  has_public_profile, has_public_feed, has_store, has_ranking, has_elite_badge
)
SELECT 
  id, 10, null, null, 
  2, 3, 10, true, 
  true, true, false, true, 
  true, false, false, true, false
FROM upsert_starter
ON CONFLICT (plan_id) DO UPDATE SET
  student_limit = EXCLUDED.student_limit,
  free_students_limit = EXCLUDED.free_students_limit,
  price_per_student_cents = EXCLUDED.price_per_student_cents,
  photo_updates_limit = EXCLUDED.photo_updates_limit,
  pdf_import_limit = EXCLUDED.pdf_import_limit,
  prestige_points = EXCLUDED.prestige_points,
  has_workouts = EXCLUDED.has_workouts,
  has_diets = EXCLUDED.has_diets,
  has_cardio = EXCLUDED.has_cardio,
  has_ergogenics = EXCLUDED.has_ergogenics,
  has_import_pdf_ai = EXCLUDED.has_import_pdf_ai,
  has_public_profile = EXCLUDED.has_public_profile,
  has_public_feed = EXCLUDED.has_public_feed,
  has_store = EXCLUDED.has_store,
  has_ranking = EXCLUDED.has_ranking,
  has_elite_badge = EXCLUDED.has_elite_badge;

-- Plano 2: Pro
WITH upsert_pro AS (
  INSERT INTO plans (
    slug, name, description, billing_type, base_price_cents, sort_order, card_theme, is_active
  )
  VALUES (
    'pro', 
    'Pro', 
    'Escale sua consultoria online com acompanhamento completo.', 
    'monthly', 
    9990, 
    20, 
    'highlighted', 
    true
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    billing_type = EXCLUDED.billing_type,
    base_price_cents = EXCLUDED.base_price_cents,
    sort_order = EXCLUDED.sort_order,
    card_theme = EXCLUDED.card_theme,
    is_active = EXCLUDED.is_active
  RETURNING id
)
INSERT INTO plan_features_dynamic (
  plan_id, student_limit, free_students_limit, price_per_student_cents, 
  photo_updates_limit, pdf_import_limit, prestige_points, has_workouts, 
  has_diets, has_cardio, has_ergogenics, has_import_pdf_ai, 
  has_public_profile, has_public_feed, has_store, has_ranking, has_elite_badge
)
SELECT 
  id, 50, null, null, 
  4, 10, 50, true, 
  true, true, true, true, 
  true, false, false, true, false
FROM upsert_pro
ON CONFLICT (plan_id) DO UPDATE SET
  student_limit = EXCLUDED.student_limit,
  free_students_limit = EXCLUDED.free_students_limit,
  price_per_student_cents = EXCLUDED.price_per_student_cents,
  photo_updates_limit = EXCLUDED.photo_updates_limit,
  pdf_import_limit = EXCLUDED.pdf_import_limit,
  prestige_points = EXCLUDED.prestige_points,
  has_workouts = EXCLUDED.has_workouts,
  has_diets = EXCLUDED.has_diets,
  has_cardio = EXCLUDED.has_cardio,
  has_ergogenics = EXCLUDED.has_ergogenics,
  has_import_pdf_ai = EXCLUDED.has_import_pdf_ai,
  has_public_profile = EXCLUDED.has_public_profile,
  has_public_feed = EXCLUDED.has_public_feed,
  has_store = EXCLUDED.has_store,
  has_ranking = EXCLUDED.has_ranking,
  has_elite_badge = EXCLUDED.has_elite_badge;

-- Plano 3: Elite
WITH upsert_elite AS (
  INSERT INTO plans (
    slug, name, description, billing_type, base_price_cents, sort_order, card_theme, is_active
  )
  VALUES (
    'elite', 
    'Elite', 
    'Consultoria sem limites. Automação via IA e recursos completos.', 
    'monthly', 
    19990, 
    30, 
    'premium', 
    true
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    billing_type = EXCLUDED.billing_type,
    base_price_cents = EXCLUDED.base_price_cents,
    sort_order = EXCLUDED.sort_order,
    card_theme = EXCLUDED.card_theme,
    is_active = EXCLUDED.is_active
  RETURNING id
)
INSERT INTO plan_features_dynamic (
  plan_id, student_limit, free_students_limit, price_per_student_cents, 
  photo_updates_limit, pdf_import_limit, prestige_points, has_workouts, 
  has_diets, has_cardio, has_ergogenics, has_import_pdf_ai, 
  has_public_profile, has_public_feed, has_store, has_ranking, has_elite_badge
)
SELECT 
  id, null, null, null, 
  null, null, 150, true, 
  true, true, true, true, 
  true, false, false, true, true
FROM upsert_elite
ON CONFLICT (plan_id) DO UPDATE SET
  student_limit = EXCLUDED.student_limit,
  free_students_limit = EXCLUDED.free_students_limit,
  price_per_student_cents = EXCLUDED.price_per_student_cents,
  photo_updates_limit = EXCLUDED.photo_updates_limit,
  pdf_import_limit = EXCLUDED.pdf_import_limit,
  prestige_points = EXCLUDED.prestige_points,
  has_workouts = EXCLUDED.has_workouts,
  has_diets = EXCLUDED.has_diets,
  has_cardio = EXCLUDED.has_cardio,
  has_ergogenics = EXCLUDED.has_ergogenics,
  has_import_pdf_ai = EXCLUDED.has_import_pdf_ai,
  has_public_profile = EXCLUDED.has_public_profile,
  has_public_feed = EXCLUDED.has_public_feed,
  has_store = EXCLUDED.has_store,
  has_ranking = EXCLUDED.has_ranking,
  has_elite_badge = EXCLUDED.has_elite_badge;

-- 3. Verificação
SELECT p.slug, p.name, p.base_price_cents, pf.student_limit, 
       pf.pdf_import_limit, pf.has_import_pdf_ai, pf.has_elite_badge
FROM plans p
JOIN plan_features_dynamic pf ON pf.plan_id = p.id
WHERE p.slug IN ('starter', 'pro', 'elite')
ORDER BY p.sort_order;
