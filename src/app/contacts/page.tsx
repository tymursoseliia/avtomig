'use client';

import { Send, MessageCircle, MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-32 pb-20 px-8">
        <div className="max-w-screen-xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#7AA899] mb-4">КОНТАКТЫ</h1>
            <p className="text-lg text-gray-600">Мы всегда на связи. Пишите, звоните или приезжайте к нам в офис.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Info Cards */}
            <div className="flex flex-col gap-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm flex flex-col justify-center gap-6 h-full border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#7AA899] text-lg mb-1">Номер горячей линии</h3>
                    <p className="text-gray-600 mb-1">+7 (980) 975-14-63</p>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-gray-100"></div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#7AA899] text-lg mb-1">Офис</h3>
                    <p className="text-gray-600 mb-1">443065, Самарская область, г. Самара</p>
                    <p className="text-sm text-gray-500">Долотный пер., д.7, 10</p>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-gray-100"></div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#7AA899] text-lg mb-1">Режим работы</h3>
                    <p className="text-gray-600 mb-1">Пн-Вс: 09:00 - 21:00</p>
                    <p className="text-sm text-gray-500">Без выходных</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Glowing Reputation Banner */}
            <div className="relative bg-[#7AA899] rounded-2xl p-8 overflow-hidden flex flex-col justify-center group shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-30 mix-blend-screen pointer-events-none transition-all duration-700 group-hover:scale-150 group-hover:bg-yellow-400"></div>
              
              <div className="relative z-10">
                <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-blue-300 text-xs font-bold tracking-wider mb-6">
                  НЕЗАВИСИМЫЙ ПОРТАЛ
                </div>
                <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                  Ваше доверие — <br/><span className="text-yellow-400">наш главный актив</span>
                </h2>
                <p className="text-blue-100/80 mb-8 max-w-sm leading-relaxed">
                  Мы гордимся прозрачностью сделок. Прочитайте сотни честных отзывов от реальных клиентов, которые уже купили авто вместе с нами.
                </p>
                
                <a 
                  href="https://yandex-maps.online/maps/240/samara/house/dolotnyy_per_7_10/YEAYdA5oTEQHQFtpfxlxcnhgbQ==?from=mapframe&ll=50.0811%2C53.1208&pt=50.0811%2C53.1208&source=mapframe&utm_source=mapframe&z=18.61"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-yellow-400 text-[#7AA899] px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition-all shadow-lg hover:shadow-yellow-400/20 transform hover:-translate-y-1"
                >
                  Смотреть отзывы о нас
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="w-full bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 h-[500px] relative group">
            {/* Yandex Map Iframe */}
            <iframe 
              src="https://yandex.ru/map-widget/v1/?mode=search&text=%D0%A1%D0%B0%D0%BC%D0%B0%D1%80%D0%B0%2C+%D0%94%D0%BE%D0%BB%D0%BE%D1%82%D0%BD%D1%8B%D0%B9+%D0%BF%D0%B5%D1%80%D0%B5%D1%83%D0%BB%D0%BE%D0%BA%2C+7" 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              allowFullScreen={true}
              className="absolute inset-0"
              title="Наш офис"
            ></iframe>
            
            {/* Оверлей для кнопки Яндекс Карт */}
            <a 
              href="https://yandex-maps.online/maps/240/samara/house/dolotnyy_per_7_10/YEAYdA5oTEQHQFtpfxlxcnhgbQ==?from=mapframe&ll=50.0811%2C53.1208&pt=50.0811%2C53.1208&source=mapframe&utm_source=mapframe&z=18.61"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute left-0 bottom-0 w-[220px] h-[60px] z-10"
              title="Открыть в Яндекс Картах"
            >
              <span className="sr-only">Открыть в Яндекс Картах</span>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
