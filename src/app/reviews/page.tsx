'use client';

import { Button } from '@/components/ui/button';
import { Send, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { supabase, type VideoReview, type PhotoReview } from '@/lib/supabase';
import { ContactDialog } from '@/components/ContactDialog';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ReviewsPage() {
  const [videoReviews, setVideoReviews] = useState<VideoReview[]>([]);
  const [photoReviews, setPhotoReviews] = useState<PhotoReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  useEffect(() => {
    fetchVideoReviews();
    fetchPhotoReviews();
  }, []);

  async function fetchPhotoReviews() {
    try {
      const { data, error } = await supabase
        .from('photo_reviews')
        .select('*')
        .order('created_at', { ascending: true }); // Maintain original import order

      if (error) throw error;
      setPhotoReviews(data || []);
    } catch (error) {
      console.error('Error fetching photo reviews:', error);
    }
  }

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
    } finally {
      setLoading(false);
    }
  }

  // Функция для получения embed URL
  const getEmbedUrl = (videoUrl: string, platform: 'rutube' | 'youtube') => {
    if (!videoUrl) return '';

    if (platform === 'rutube') {
      if (videoUrl.includes('/play/embed/')) return videoUrl;

      // Extract ID from /video/ID/ or /shorts/ID/
      let videoId = '';
      if (videoUrl.includes('/video/')) {
        videoId = videoUrl.split('/video/')[1]?.split('/')[0];
      } else if (videoUrl.includes('/shorts/')) {
        videoId = videoUrl.split('/shorts/')[1]?.split('/')[0];
      }
      
      if (!videoId) {
        return '';
      }
      return `https://rutube.ru/play/embed/${videoId}`;
    } else {
      if (videoUrl.includes('/embed/')) return videoUrl;

      let videoId = '';
      
      if (videoUrl.includes('youtu.be/')) {
        videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
      } else if (videoUrl.includes('/shorts/')) {
        videoId = videoUrl.split('/shorts/')[1]?.split('?')[0];
      } else if (videoUrl.includes('v=')) {
         videoId = videoUrl.split('v=')[1]?.split('&')[0];
      }

      if (!videoId) {
        return '';
      }
      return `https://www.youtube.com/embed/${videoId}`;
    }
  };

  const textReviews = [
    {
      name: "Павел Д.",

      text: "Все прошло на высшем уровне. Доставили быстро, авто в идеальном состоянии, документы оформлены без задержек. Приятно, когда люди следуют выполненным сроках!",
      carImage: "https://i.ibb.co/yB7vDp2c/photo-2026-01-14-12-40-23.jpg",
      platform: "2gis",
      rating: 5.0
    },
    {
      name: "Екатерина Л.",

      text: "Приехала на свою новую машину, как только планировала! Довольна качеством и состоянием авто, а также отличным сервисом и четкостью на всех этапах. Все организовано быстро и удобно.",
      carImage: "https://i.ibb.co/qMSXBdFL/photo-2026-01-14-12-40-43.jpg",
      platform: "2gis",
      rating: 4.9
    },
    {
      name: "Максим Р.",

      text: "Решил купить авто из Европы и не ошибся. Все расходы и этапы были прозрачны, заранее, и автомобиль доставили вовремя. Очень рад, что выбрал вас!",
      carImage: "https://i.ibb.co/4GYrgJb/photo-2026-01-14-12-40-55.jpg",
      platform: "yandex",
      rating: 5.0
    },
    {
      name: "Виктор С.",

      text: "Очень рекомендую этот способ покупки! Автомобиль пригнали в отличном виде, документы в порядке. Профессиональная команда, с которой приятно работать.",
      carImage: "https://i.ibb.co/j9jbH9vJ/photo-2026-01-19-12-55-04.jpg",
      platform: "yandex",
      rating: 5.0
    },
    {
      name: "Лариса Д.",

      text: "Автомобиль приехал в отличном состоянии. Как и обещали, проверка была быстрой. Весь процесс прошел гладко и без каких-либо сюрпризов.",
      carImage: "https://i.ibb.co/SDSkFmCB/photo-2026-01-19-13-00-11.jpg",
      platform: "2gis",
      rating: 5.0
    },
    {
      name: "Федор П.",

      text: "Спасибо за честность и профессионализм! Машина соответствует всем заявленным характеристикам. Процесс был прозрачным от начала до конца.",
      carImage: "https://i.ibb.co/dJfRt4YZ/photo-2026-01-26-17-10-30.jpg",
      platform: "yandex",
      rating: 5.0
    },
    {
      name: "Дмитрий В.",

      text: "Очень доволен качеством подбора и скоростью доставки. Цена действительно выгоднее, чем у дилеров. Получил именно то, что хотел!",
      carImage: "https://i.ibb.co/GLyBZ69/photo-2026-01-26-17-33-52.jpg",
      platform: "2gis",
      rating: 5.0
    },
    {
      name: "Сергей М.",

      text: "Отличный сервис! Помогли с выбором, организовали доставку, оформили все документы. Рекомендую всем, кто хочет купить авто из Европы.",
      carImage: "https://i.ibb.co/sJssx8HP/photo-2026-01-27-15-36-53.jpg",
      platform: "yandex",
      rating: 4.9
    },
    {
      name: "Алексей Т.",

      text: "Машина пришла в идеальном состоянии! Все как в описании. Спасибо за профессиональную работу и внимание к деталям.",
      carImage: "https://i.ibb.co/HLsdvDM2/photo-2026-01-30-13-27-51.jpg",
      platform: "2gis",
      rating: 5.0
    },
    {
      name: "Игорь П.",

      text: "Весь процесс занял меньше месяца. Отличная поддержка на всех этапах. Автомобиль полностью соответствует ожиданиям!",
      carImage: "https://i.ibb.co/TxzYwpTG/photo-2026-01-30-13-27-52.jpg",
      platform: "yandex",
      rating: 5.0
    },
    {
      name: "Анна В.",

      text: "Качество подбора на высоте, все документы в порядке. Очень довольна сотрудничеством! Автомобиль мечты получен.",
      carImage: "https://i.ibb.co/JWkRjMk2/photo-2026-02-05-13-08-15-2.jpg",
      platform: "2gis",
      rating: 5.0
    },
    {
      name: "Андрей Л.",

      text: "Профессиональный подход, честные цены, быстрая доставка. Всё на высшем уровне! Буду рекомендовать друзьям.",
      carImage: "https://i.ibb.co/Q3qS7MMH/photo-2026-02-05-13-08-15.jpg",
      platform: "yandex",
      rating: 4.9
    },
    {
      name: "Ельвира К.",

      text: "Получила автомобиль точно в срок. Вся информация была предоставлена заранее. Никаких скрытых платежей. Отличная работа!",
      carImage: "https://i.ibb.co/h1wMxhr0/photo-2026-02-12-13-08-08.jpg",
      platform: "2gis",
      rating: 5.0
    },
    {
      name: "Владимир Б.",

      text: "Очень доволен покупкой! Автомобиль в отличном состоянии, все документы оформлены правильно. Спасибо за качественную работу!",
      carImage: "https://i.ibb.co/213tpzZq/photo-2026-02-12-13-08-12.jpg",
      platform: "yandex",
      rating: 5.0
    },
    {
      name: "Константин Д.",

      text: "Приятно удивлен качеством сервиса. Весь процесс был прозрачным и понятным. Автомобиль соответствует всем ожиданиям!",
      carImage: "https://i.ibb.co/4BKx44M/photo-2026-02-03-13-15-49.jpg",
      platform: "2gis",
      rating: 5.0
    },
    {
      name: "Николай П.",

      text: "Превосходный опыт покупки! Команда профессионалов сделала всё быстро и качественно. Автомобиль мечты теперь у меня!",
      carImage: "https://i.ibb.co/DDf4dP2V/photo-2026-02-12-13-10-04.jpg",
      platform: "2gis",
      rating: 5.0
    }
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section with Diagonal Stripes */}
      <section className="relative bg-[#7AA899] overflow-hidden pt-[100px] lg:pt-[120px]">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-full flex">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 h-full bg-[#6D9688] transform skew-x-[-20deg] origin-top-left"
                style={{
                  width: '80px',
                  marginLeft: i % 2 === 0 ? '40px' : '0px',
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 px-8 py-8">
          <div className="max-w-screen-2xl mx-auto">
            <h1 className="text-5xl font-bold text-white">ОТЗЫВЫ КЛИЕНТОВ</h1>
          </div>
        </div>
      </section>

      {/* Video Reviews Grid */}
      <section className="py-12 px-8 bg-white">
        <div className="max-w-screen-2xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-xl text-gray-600">Загрузка видео-отзывов...</div>
            </div>
          ) : videoReviews.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-6xl mb-4">🎥</div>
              <p className="text-gray-800 text-xl font-semibold mb-2">Пока нет видео-отзывов</p>
              <p className="text-gray-600 mb-6">
                Добавьте первое видео через админ панель
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {videoReviews.map((video) => (
                <div
                  key={video.id}
                  className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden"
                >
                  <iframe
                    src={getEmbedUrl(video.video_url, video.platform)}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Text Reviews Section */}
      <section className="py-12 px-8 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#7AA899]">
              ТЕКСТОВЫЕ ОТЗЫВЫ КЛИЕНТОВ
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-12 h-12 bg-[#7AA899] hover:bg-[#6D9688] text-white rounded-full flex items-center justify-center transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-12 h-12 bg-[#7AA899] hover:bg-[#6D9688] text-white rounded-full flex items-center justify-center transition-colors"
              >
                →
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {photoReviews.length === 0 && !loading ? (
              <div className="w-full text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm">
                Пока нет текстовых отзывов
              </div>
            ) : null}
            {photoReviews.map((review) => (
              <div
                key={review.id}
                className="flex-shrink-0 w-80 bg-white rounded-lg shadow-sm overflow-hidden"
              >
                {/* Header with name */}
                <div className="p-5">
                  <h4 className="font-bold text-[#7AA899]">{review.name}</h4>
                </div>

                {/* Review text */}
                <div className="px-5 pb-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {review.text}
                  </p>
                </div>

                {/* Car image */}
                <div className="px-5">
                  <img
                    src={review.car_image_url}
                    alt="Автомобиль"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>

                {/* Footer with platform and rating */}
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {review.platform === '2gis' ? (
                      <div className="bg-green-500 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
                        <span>2ГИС</span>
                      </div>
                    ) : (
                      <div className="bg-yellow-400 text-[#7AA899] px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
                        <span>Яндекс</span>
                      </div>
                    )}
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-sm">★</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[#7AA899]">
                    {Number(review.rating).toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Contact Dialog */}
      <ContactDialog open={contactDialogOpen} onOpenChange={setContactDialogOpen} />
    </div>
  );
}
