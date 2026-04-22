-- Удаляем старые политики
DROP POLICY IF EXISTS "Все могут добавлять" ON cars;
DROP POLICY IF EXISTS "Все могут обновлять" ON cars;
DROP POLICY IF EXISTS "Все могут удалять" ON cars;

-- Новые политики: только авторизованные могут изменять данные
CREATE POLICY "Только авторизованные могут добавлять" ON cars
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Только авторизованные могут обновлять" ON cars
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Только авторизованные могут удалять" ON cars
  FOR DELETE USING (auth.role() = 'authenticated');
