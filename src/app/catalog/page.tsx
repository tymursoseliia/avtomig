'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase, type Car } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function CatalogPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBudget, setFilterBudget] = useState('all');

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      setError('Не удалось загрузить автомобили. Пожалуйста, попробуйте обновить страницу.');
    } finally {
      setLoading(false);
    }
  }

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesSearch = car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           car.model.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesBudget = true;
      if (filterBudget !== 'all') {
        const price = car.price;
        if (filterBudget === '500k') matchesBudget = price <= 500000;
        else if (filterBudget === '1m') matchesBudget = price > 500000 && price <= 1000000;
        else if (filterBudget === '2m') matchesBudget = price > 1000000 && price <= 2000000;
        else if (filterBudget === '3m') matchesBudget = price > 2000000 && price <= 3000000;
        else if (filterBudget === 'more') matchesBudget = price > 3000000;
      }

      return matchesSearch && matchesBudget;
    });
  }, [cars, searchQuery, filterBudget]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="max-w-screen-2xl mx-auto px-8 py-12 pt-[100px] lg:pt-[120px]">
        <h1 className="text-5xl font-bold text-[#7AA899] mb-8">Каталог автомобилей</h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchCars}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Повторить
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Поиск по марке или модели..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12"
            />
            <Select value={filterBudget} onValueChange={setFilterBudget}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Все бюджеты" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все бюджеты</SelectItem>
                <SelectItem value="500k">До 500 000 ₽</SelectItem>
                <SelectItem value="1m">500 000 - 1 000 000 ₽</SelectItem>
                <SelectItem value="2m">1 000 000 - 2 000 000 ₽</SelectItem>
                <SelectItem value="3m">2 000 000 - 3 000 000 ₽</SelectItem>
                <SelectItem value="more">Более 3 000 000 ₽</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                setSearchQuery('');
                setFilterBudget('all');
              }}
              variant="outline"
              className="h-12"
            >
              Сбросить фильтры
            </Button>
          </div>
        </div>

        {/* Cars Grid */}
        {filteredCars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600">Автомобили не найдены</p>
            <p className="text-gray-500 mt-2">Попробуйте изменить параметры поиска</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <div key={car.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="relative h-64 bg-gray-200">
                  {car.images && car.images.length > 0 ? (
                    <img
                      src={car.images[0]}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Нет фото
                    </div>
                  )}
                  {car.status === 'sold' && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Продано
                    </div>
                  )}
                  {car.status === 'reserved' && (
                    <div className="absolute top-4 right-4 bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Забронировано
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#7AA899] mb-2">
                    {car.brand} {car.model}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <span>{car.year} г.</span>
                    <span>•</span>
                    <span>{car.mileage.toLocaleString()} км</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 flex-wrap">
                    <span>{car.fuel_type}</span>
                    <span>•</span>
                    <span>{car.transmission}</span>
                    {car.engine_volume && (
                      <>
                        <span>•</span>
                        <span>{car.engine_volume} л</span>
                      </>
                    )}
                    {car.drive_type && (
                      <>
                        <span>•</span>
                        <span>{car.drive_type} привод</span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-2">{car.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-[#0A7ABF]">
                      {car.price.toLocaleString()} ₽
                    </div>
                    <a
                      href="https://t.me/automigsupport"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="bg-[#0A7ABF] hover:bg-[#095A8F]">
                        Подробнее
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
