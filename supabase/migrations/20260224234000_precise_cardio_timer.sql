-- Adiciona suporte para cronômetro stateless autoritativo
ALTER TABLE cardio_logs 
ADD COLUMN IF NOT EXISTS last_resumed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS last_paused_at timestamp with time zone;

COMMENT ON COLUMN cardio_logs.last_resumed_at IS 'Momento exato em que o cronômetro foi iniciado ou retomado';
COMMENT ON COLUMN cardio_logs.last_paused_at IS 'Momento em que o cronômetro foi pausado';
