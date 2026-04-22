'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase, type VideoReview, type PhotoReview, type Car } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { X, Upload, LogOut, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cars');
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    fuel_type: 'Бензин',
    transmission: 'Автомат',
    engine_volume: '',
    drive_type: 'Полный',
    description: '',
    location: 'Европа',
    status: 'available'
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cars management state
  const [cars, setCars] = useState<Car[]>([]);
  const [loadingCars, setLoadingCars] = useState(false);

  // Video reviews state
  const [videoReviews, setVideoReviews] = useState<VideoReview[]>([]);
  const [videoFormData, setVideoFormData] = useState({
    title: '',
    video_url: '',
    platform: 'rutube' as 'rutube' | 'youtube',
    thumbnail_url: ''
  });
  const [addingVideo, setAddingVideo] = useState(false);

  // Photo reviews state
  const [photoReviews, setPhotoReviews] = useState<PhotoReview[]>([]);
  const [photoFormData, setPhotoFormData] = useState({
    name: '',
    text: '',
    platform: '2gis' as '2gis' | 'yandex',
    rating: 5.0
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [addingPhoto, setAddingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkAuth();
    if (activeTab === 'videos') {
      fetchVideoReviews();
    }
    if (activeTab === 'photos') {
      fetchPhotoReviews();
    }
    if (activeTab === 'manage') {
      fetchCars();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push('/login');
      return;
    }

    setIsAuthenticated(true);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  // Video reviews functions
  async function fetchVideoReviews() {
    try {
      const { data, error } = await supabase
        .from('video_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideoReviews(data || []);
    } catch (error) {
      console.error('Error fetching video reviews:', error);
    }
  }

  async function handleVideoSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAddingVideo(true);

    try {
      const { error } = await supabase
        .from('video_reviews')
        .insert([videoFormData]);

      if (error) throw error;

      alert('Видео-отзыв успешно добавлен!');

      // Reset form
      setVideoFormData({
        title: '',
        video_url: '',
        platform: 'rutube',
        thumbnail_url: ''
      });

      // Refresh list
      fetchVideoReviews();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      alert('Ошибка: ' + errorMessage);
      console.error('Error:', error);
    } finally {
      setAddingVideo(false);
    }
  }

  async function handleDeleteVideo(id: string) {
    if (!confirm('Вы уверены, что хотите удалить это видео?')) return;

    try {
      const { error } = await supabase
        .from('video_reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Видео-отзыв удален!');
      fetchVideoReviews();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      alert('Ошибка: ' + errorMessage);
      console.error('Error:', error);
    }
  }

  // Photo reviews functions
  async function fetchPhotoReviews() {
    try {
      const { data, error } = await supabase
        .from('photo_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotoReviews(data || []);
    } catch (error) {
      console.error('Error fetching photo reviews:', error);
    }
  }

  async function handlePhotoSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!photoFile) {
      alert('Пожалуйста, выберите фото автомобиля');
      return;
    }

    setAddingPhoto(true);

    try {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `review-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filePath, photoFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('car-images')
        .getPublicUrl(filePath);

      const reviewData = {
        ...photoFormData,
        car_image_url: publicUrl
      };

      const { error: insertError } = await supabase
        .from('photo_reviews')
        .insert([reviewData]);

      if (insertError) throw insertError;

      alert('Фото-отзыв успешно добавлен!');

      setPhotoFormData({
        name: '',
        text: '',
        platform: '2gis',
        rating: 5.0
      });
      setPhotoFile(null);
      if (photoInputRef.current) photoInputRef.current.value = '';

      fetchPhotoReviews();
    } catch (error: any) {
      const errProps = error?.message || error?.error || JSON.stringify(error);
      const errorMessage = typeof errProps === 'string' ? errProps : 'Неизвестная ошибка';
      alert('Ошибка: ' + errorMessage);
      console.error('Error:', error);
    } finally {
      setAddingPhoto(false);
    }
  }

  async function handleDeletePhotoReview(id: string) {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) return;

    try {
      const { error } = await supabase
        .from('photo_reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Отзыв удален!');
      fetchPhotoReviews();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      alert('Ошибка: ' + errorMessage);
      console.error('Error:', error);
    }
  }

  // Cars management functions
  async function fetchCars() {
    setLoadingCars(true);
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
      alert('Ошибка при загрузке автомобилей');
    } finally {
      setLoadingCars(false);
    }
  }

  async function handleUpdateCarStatus(carId: string, newStatus: 'available' | 'reserved' | 'sold') {
    try {
      const { error } = await supabase
        .from('cars')
        .update({ status: newStatus })
        .eq('id', carId);

      if (error) throw error;

      alert('Статус обновлен!');
      fetchCars();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      alert('Ошибка: ' + errorMessage);
      console.error('Error:', error);
    }
  }

  async function handleDeleteCar(carId: string) {
    if (!confirm('Вы уверены, что хотите удалить этот автомобиль?')) return;

    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId);

      if (error) throw error;

      alert('Автомобиль удален!');
      fetchCars();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      alert('Ошибка: ' + errorMessage);
      console.error('Error:', error);
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Валидация файлов
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    const validFiles = files.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`Файл ${file.name} слишком большой. Максимум 5MB.`);
        return false;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert(`Файл ${file.name} недопустимого формата. Разрешены: JPG, PNG, WebP.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setImages(prev => [...prev, ...validFiles]);

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Upload images
      const imageUrls: string[] = [];

      console.log('Начинаем загрузку изображений...', images.length);

      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        console.log('Загружаем файл:', fileName);

        const { error: uploadError } = await supabase.storage
          .from('car-images')
          .upload(filePath, image);

        if (uploadError) {
          console.error('Ошибка загрузки файла:', uploadError);
          throw new Error(`Ошибка загрузки файла ${image.name}: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('car-images')
          .getPublicUrl(filePath);

        console.log('Файл загружен:', publicUrl);
        imageUrls.push(publicUrl);
      }

      console.log('Все изображения загружены:', imageUrls);

      // Insert car data
      const carData = {
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        price: parseFloat(formData.price),
        mileage: parseInt(formData.mileage),
        fuel_type: formData.fuel_type,
        transmission: formData.transmission,
        engine_volume: formData.engine_volume ? parseFloat(formData.engine_volume) : null,
        drive_type: formData.drive_type,
        description: formData.description,
        location: formData.location,
        status: formData.status,
        images: imageUrls
      };

      console.log('Данные для вставки:', carData);

      const { error: insertError } = await supabase
        .from('cars')
        .insert([carData]);

      if (insertError) {
        console.error('Ошибка вставки данных:', insertError);
        throw new Error(`Ошибка добавления в базу данных: ${insertError.message}`);
      }

      alert('Автомобиль успешно добавлен!');

      // Reset form
      setFormData({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        mileage: '',
        fuel_type: 'Бензин',
        transmission: 'Автомат',
        engine_volume: '',
        drive_type: 'Полный',
        description: '',
        location: 'Европа',
        status: 'available'
      });
      setImages([]);
      setImagePreviews([]);
    } catch (error: unknown) {
      let errorMessage = 'Неизвестная ошибка';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      console.error('Полная ошибка:', error);
      alert('❌ ОШИБКА:\n\n' + errorMessage + '\n\nПроверьте консоль для деталей.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Проверка доступа...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-screen-2xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex flex-col items-start">
              <div className="text-3xl font-bold text-[#7AA899] leading-none">АВТОМИГ</div>
              <div className="text-[9px] font-semibold text-[#7AA899] tracking-[0.15em] uppercase mt-0.5">
                Авто из Европы
              </div>
            </div>
          </Link>
          <nav className="flex items-center gap-8 text-[#7AA899]">
            <Link href="/" className="hover:text-blue-600 transition-colors font-medium">
              Главная
            </Link>
            <Link href="/catalog" className="hover:text-blue-600 transition-colors font-medium">
              Каталог
            </Link>
            <Link href="/credit" className="hover:text-blue-600 transition-colors font-medium">
              Автокредит
            </Link>
            <Link href="/admin" className="text-blue-600 font-medium">
              Админ
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </Button>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-5xl font-bold text-[#7AA899] mb-8">Панель управления</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="cars">Добавить авто</TabsTrigger>
            <TabsTrigger value="manage">Управление авто</TabsTrigger>
            <TabsTrigger value="videos">Видео-отзывы</TabsTrigger>
            <TabsTrigger value="photos">Фото-отзывы</TabsTrigger>
          </TabsList>

          {/* Cars Tab */}
          <TabsContent value="cars">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Марка *
              </label>
              <Input
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Mercedes-Benz"
                className="h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Модель *
              </label>
              <Input
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="E-Class"
                className="h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Год *
              </label>
              <Input
                required
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Цена (₽) *
              </label>
              <Input
                required
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="2500000"
                className="h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пробег (км) *
              </label>
              <Input
                required
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                placeholder="50000"
                className="h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип топлива
              </label>
              <Select value={formData.fuel_type} onValueChange={(value) => setFormData({ ...formData, fuel_type: value })}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Бензин">Бензин</SelectItem>
                  <SelectItem value="Дизель">Дизель</SelectItem>
                  <SelectItem value="Гибрид">Гибрид</SelectItem>
                  <SelectItem value="Электро">Электро</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Коробка передач
              </label>
              <Select value={formData.transmission} onValueChange={(value) => setFormData({ ...formData, transmission: value })}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Автомат">Автомат</SelectItem>
                  <SelectItem value="Механика">Механика</SelectItem>
                  <SelectItem value="Робот">Робот</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Объем двигателя (л)
              </label>
              <Input
                type="number"
                step="0.1"
                value={formData.engine_volume}
                onChange={(e) => setFormData({ ...formData, engine_volume: e.target.value })}
                placeholder="2.0"
                className="h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип привода
              </label>
              <Select value={formData.drive_type} onValueChange={(value) => setFormData({ ...formData, drive_type: value })}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Передний">Передний</SelectItem>
                  <SelectItem value="Задний">Задний</SelectItem>
                  <SelectItem value="Полный">Полный</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус
              </label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Доступно</SelectItem>
                  <SelectItem value="reserved">Забронировано</SelectItem>
                  <SelectItem value="sold">Продано</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Подробное описание автомобиля..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A7ABF]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Фотографии
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mb-4"
              >
                <Upload className="w-4 h-4 mr-2" />
                Выбрать фото
              </Button>
              <p className="text-sm text-gray-500">Можно загрузить несколько фотографий</p>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={uploading}
            className="w-full h-12 bg-[#0A7ABF] hover:bg-[#095A8F] text-lg"
          >
            {uploading ? 'Загрузка...' : 'Добавить автомобиль'}
          </Button>
        </form>
          </TabsContent>

          {/* Manage Cars Tab */}
          <TabsContent value="manage">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#7AA899] mb-6">Управление автомобилями</h2>

              {loadingCars ? (
                <div className="text-center py-8 text-gray-600">Загрузка...</div>
              ) : cars.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Пока нет добавленных автомобилей
                </div>
              ) : (
                <div className="space-y-4">
                  {cars.map((car) => (
                    <div key={car.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex gap-4">
                        {/* Car Image */}
                        <div className="w-32 h-32 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                          {car.images && car.images.length > 0 ? (
                            <img
                              src={car.images[0]}
                              alt={`${car.brand} ${car.model}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              Нет фото
                            </div>
                          )}
                        </div>

                        {/* Car Info */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-[#7AA899] mb-2">
                            {car.brand} {car.model}
                          </h3>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                            <div>Год: <span className="font-medium">{car.year}</span></div>
                            <div>Пробег: <span className="font-medium">{car.mileage.toLocaleString()} км</span></div>
                            <div>Цена: <span className="font-medium text-green-600">{car.price.toLocaleString()} ₽</span></div>
                            <div>Топливо: <span className="font-medium">{car.fuel_type}</span></div>
                            <div>КПП: <span className="font-medium">{car.transmission}</span></div>
                            {car.engine_volume && (
                              <div>Объем: <span className="font-medium">{car.engine_volume} л</span></div>
                            )}
                            {car.drive_type && (
                              <div>Привод: <span className="font-medium">{car.drive_type}</span></div>
                            )}
                          </div>

                          {/* Status Management */}
                          <div className="flex items-center gap-3 mt-4">
                            <span className="text-sm font-medium text-gray-700">Статус:</span>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleUpdateCarStatus(car.id, 'available')}
                                size="sm"
                                variant={car.status === 'available' ? 'default' : 'outline'}
                                className={car.status === 'available' ? 'bg-green-600 hover:bg-green-700' : ''}
                              >
                                Доступно
                              </Button>
                              <Button
                                onClick={() => handleUpdateCarStatus(car.id, 'reserved')}
                                size="sm"
                                variant={car.status === 'reserved' ? 'default' : 'outline'}
                                className={car.status === 'reserved' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                              >
                                Забронировано
                              </Button>
                              <Button
                                onClick={() => handleUpdateCarStatus(car.id, 'sold')}
                                size="sm"
                                variant={car.status === 'sold' ? 'default' : 'outline'}
                                className={car.status === 'sold' ? 'bg-red-600 hover:bg-red-700' : ''}
                              >
                                Продано
                              </Button>
                            </div>

                            <Button
                              onClick={() => handleDeleteCar(car.id)}
                              size="sm"
                              variant="destructive"
                              className="ml-auto"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Удалить
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos">
            <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-bold text-[#7AA899] mb-6">Добавить видео-отзыв</h2>

              <form onSubmit={handleVideoSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название *
                  </label>
                  <Input
                    required
                    value={videoFormData.title}
                    onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                    placeholder="Отзыв клиента о Mercedes-Benz"
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Платформа *
                  </label>
                  <Select
                    value={videoFormData.platform}
                    onValueChange={(value: 'rutube' | 'youtube') => setVideoFormData({ ...videoFormData, platform: value })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rutube">Rutube</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL видео *
                  </label>
                  <Input
                    required
                    type="url"
                    value={videoFormData.video_url}
                    onChange={(e) => setVideoFormData({ ...videoFormData, video_url: e.target.value })}
                    placeholder="https://rutube.ru/video/1234567890abcdef/ или https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className="h-12"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Для Rutube: https://rutube.ru/video/ID/<br />
                    Для YouTube: https://www.youtube.com/watch?v=ID
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL превью (необязательно)
                  </label>
                  <Input
                    type="url"
                    value={videoFormData.thumbnail_url}
                    onChange={(e) => setVideoFormData({ ...videoFormData, thumbnail_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="h-12"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={addingVideo}
                  className="w-full h-12 bg-[#0A7ABF] hover:bg-[#095A8F] text-lg"
                >
                  {addingVideo ? 'Добавление...' : 'Добавить видео-отзыв'}
                </Button>
              </form>
            </div>

            {/* List of existing videos */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#7AA899] mb-6">Существующие видео-отзывы</h2>

              {videoReviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Пока нет добавленных видео-отзывов
                </div>
              ) : (
                <div className="space-y-4">
                  {videoReviews.map((video) => (
                    <div key={video.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#7AA899] mb-1">{video.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">
                          Платформа: <span className="font-medium">{video.platform === 'rutube' ? 'Rutube' : 'YouTube'}</span>
                        </p>
                        <a
                          href={video.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline break-all"
                        >
                          {video.video_url}
                        </a>
                      </div>
                      <Button
                        onClick={() => handleDeleteVideo(video.id)}
                        variant="destructive"
                        size="sm"
                        className="ml-4"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Photo Reviews Tab */}
          <TabsContent value="photos">
            <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-bold text-[#7AA899] mb-6">Добавить фото-отзыв</h2>

              <form onSubmit={handlePhotoSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Имя клиента *
                    </label>
                    <Input
                      required
                      value={photoFormData.name}
                      onChange={(e) => setPhotoFormData({ ...photoFormData, name: e.target.value })}
                      placeholder="Иван И."
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Платформа *
                    </label>
                    <Select
                      value={photoFormData.platform}
                      onValueChange={(value: '2gis' | 'yandex') => setPhotoFormData({ ...photoFormData, platform: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2gis">2ГИС</SelectItem>
                        <SelectItem value="yandex">Яндекс</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Оценка (от 1 до 5) *
                    </label>
                    <Input
                      required
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={photoFormData.rating}
                      onChange={(e) => setPhotoFormData({ ...photoFormData, rating: parseFloat(e.target.value) })}
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Фотография (авто или клиент) *
                    </label>
                    <div className="border border-gray-300 rounded-md p-2 h-12 flex items-center">
                      <input
                        required
                        type="file"
                        accept="image/*"
                        ref={photoInputRef}
                        onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                        className="w-full text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Текст отзыва *
                  </label>
                  <textarea
                    required
                    value={photoFormData.text}
                    onChange={(e) => setPhotoFormData({ ...photoFormData, text: e.target.value })}
                    placeholder="Напишите текст отзыва..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A7ABF]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={addingPhoto}
                  className="w-full h-12 bg-[#0A7ABF] hover:bg-[#095A8F] text-lg"
                >
                  {addingPhoto ? 'Загрузка...' : 'Опубликовать отзыв'}
                </Button>
              </form>
            </div>

            {/* List of photo reviews */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#7AA899] mb-6">Существующие фото-отзывы</h2>

              {photoReviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Пока нет добавленных фото-отзывов
                </div>
              ) : (
                <div className="space-y-4">
                  {photoReviews.map((review) => (
                    <div key={review.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        <img src={review.car_image_url} alt="Review" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-[#7AA899]">{review.name}</h3>
                          <Button
                            onClick={() => handleDeletePhotoReview(review.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-xs mb-2">
                          {review.platform === '2gis' ? (
                            <span className="px-2 py-0.5 rounded text-white font-bold bg-green-500">2ГИС</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[#7AA899] font-bold bg-yellow-400">Яндекс</span>
                          )}
                          <span className="text-yellow-500 font-bold">★ {review.rating}</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2" title={review.text}>
                          {review.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
