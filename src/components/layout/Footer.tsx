'use client';

import Link from 'next/link';
import { MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { ContactDialog } from '@/components/ContactDialog';

export default function Footer() {
  const [open, setOpen] = useState(false);

  return (
    <footer className="bg-[#EBEBEB] border-t border-gray-300 text-[#333]">
      <div className="max-w-screen-2xl mx-auto px-6 py-12 md:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20">
          
          {/* Left Column - Contacts */}
          <div className="flex flex-col items-start gap-1 w-full lg:w-[350px] shrink-0">
            {/* Logo */}
            <div className="mb-6">
              <img src="/images/logo.png" alt="АВТОМИГ" className="h-[65px] w-auto object-contain mix-blend-multiply" />
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-[#14532D] shrink-0 mt-0.5" fill="currentColor" strokeWidth={1} />
              <span className="font-bold text-[17px] text-[#14532D] leading-snug">
                443065, Самарская область,<br />
                г. Самара, Долотный пер., д.7, 10
              </span>
            </div>

            <div className="pl-10 text-[16px] text-[#222] font-medium mt-1">
              08:00 — 22:00 без выходных
            </div>

            <div className="flex items-center gap-4 mt-3">
              <Phone className="w-6 h-6 text-[#14532D] shrink-0" fill="currentColor" strokeWidth={1} />
              <a href="tel:+79809751463" className="font-bold text-[19px] tracking-tight text-[#14532D] hover:opacity-80 transition-opacity">
                +7 (980) 975-14-63
              </a>
            </div>

            <div className="pl-10 mt-2">
              <button
                onClick={() => setOpen(true)}
                className="text-[#111] text-[16px] font-medium underline decoration-[1.5px] underline-offset-[5px] hover:text-gray-600 transition-colors"
              >
                Заказать обратный звонок
              </button>
            </div>
          </div>

          {/* Right Column - Legal & Menu */}
          <div className="flex flex-col w-full text-[13px] md:text-[14px] leading-relaxed text-[#555]">
            {/* Horizontal Menu */}
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6 font-medium text-[16px] text-[#111]">
              <Link href="/" className="hover:text-[#14532D] transition-colors">Главная</Link>
              <Link href="/about" className="hover:text-[#14532D] transition-colors">О нас</Link>
              <Link href="/team" className="hover:text-[#14532D] transition-colors">Команда</Link>
              <Link href="/reviews" className="hover:text-[#14532D] transition-colors">Отзывы</Link>
              <Link href="/catalog" className="hover:text-[#14532D] transition-colors">Каталог</Link>
              <Link href="/credit" className="hover:text-[#14532D] transition-colors">Автокредит</Link>
              <Link href="/contacts" className="hover:text-[#14532D] transition-colors">Контакты</Link>
            </nav>

            <p className="mb-4">
              Обращаем Ваше внимание на то, что данный сайт носит исключительно информационный характер и ни при каких условиях не является публичной офертой, определяемой положениями статьи 437 Гражданского кодекса Российской Федерации. Все цены указаны с учетом максимальной скидки на авто и при условии покупки в кредит и включают в себя обязательные страховые продукты, которые согласовываются и оплачиваются отдельно.
            </p>

            <p className="mb-4">
              ООО «АВТОМИГ» 443065, Самарская область, г. Самара, Долотный пер., д.7, 10
            </p>

            <div className="flex flex-wrap gap-4 mb-4">
              <Link href="/privacy" className="hover:text-black underline underline-offset-2">Политика конфиденциальности</Link>
              <Link href="/terms" className="hover:text-black underline underline-offset-2">Пользовательское соглашение</Link>
            </div>

            <p>
              Для получения более подробной информации об указанных акциях, а также о стоимости автомобилей обращайтесь к менеджерам по продажам.
            </p>
          </div>

        </div>
      </div>

      <ContactDialog open={open} onOpenChange={setOpen} />
    </footer>
  );
}
