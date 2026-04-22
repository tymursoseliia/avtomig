-- Migration: Add engine_volume and drive_type fields to cars table
-- Date: 2026-02-13

-- Add engine_volume column (объем двигателя в литрах, например: 2.0, 3.5)
ALTER TABLE cars
ADD COLUMN IF NOT EXISTS engine_volume NUMERIC(3,1);

-- Add drive_type column (тип привода)
ALTER TABLE cars
ADD COLUMN IF NOT EXISTS drive_type TEXT;

-- Add comment to describe fields
COMMENT ON COLUMN cars.engine_volume IS 'Объем двигателя в литрах (например: 2.0, 3.5)';
COMMENT ON COLUMN cars.drive_type IS 'Тип привода (Передний, Задний, Полный)';

-- Optional: Update existing records with default values
-- UPDATE cars SET engine_volume = 2.0 WHERE engine_volume IS NULL;
-- UPDATE cars SET drive_type = 'Не указан' WHERE drive_type IS NULL;
