"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, MessageCircle, PlayCircle, Percent, Clock, SimpleLineChart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "@/components/ContactDialog";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function CreditPage() {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
      {/* Header */}
      <Header />

      <main className="flex-1 pt-[100px] lg:pt-[120px]">
        {/* Hero Section */}
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 border border-gray-100">
            <div className="p-8 md:p-12 lg:p-16">
              <div className="max-w-3xl mb-10">
                <span className="inline-block py-1.5 px-3 rounded-md bg-green-100 text-green-700 text-sm font-semibold tracking-wider mb-4">
                  ПРОГРАММА ФИНАНСИРОВАНИЯ
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#7AA899] mb-6 leading-tight">
                  АВТОКРЕДИТ <br/><span className="text-[#7AA899]">НА АВТО ИЗ ЕВРОПЫ</span>
                </h1>
                <p className="text-gray-600 text-lg sm:text-xl leading-relaxed mb-8">
                  Мы сотрудничаем с ведущими банками РФ, чтобы вы могли приобрести автомобиль мечты комфортно и без финансовых перегрузок. Прозрачные условия, никаких скрытых страховок.
                </p>
                <Button 
                  onClick={() => setContactDialogOpen(true)}
                  className="bg-[#7AA899] hover:bg-[#061a2e] text-white px-8 py-6 text-lg rounded-full shadow-lg transition-transform hover:scale-105"
                >
                  Оставить заявку на расчет
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Block Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#7AA899] mb-4">
                ПОДРОБНЕЕ ОБ УСЛОВИЯХ В НАШЕМ ВИДЕО
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Посмотрите короткий разбор от наших экспертов об особенностях автокредитования при привозе авто из-за рубежа.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-4xl bg-black rounded-2xl aspect-video relative overflow-hidden shadow-2xl border-4 border-gray-800">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://rutube.ru/play/embed/91b05432d439bf460f205a47fc5c0cce/" 
                  title="Автокредит" 
                  frameBorder="0" 
                  allow="clipboard-write; autoplay" 
                  allowFullScreen>
                </iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Terms, Rates, Timeframes */}
        <section className="py-16 bg-white border-t border-gray-200">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
            <h2 className="text-3xl font-bold text-[#7AA899] text-center mb-16">
              УСЛОВИЯ, СРОКИ И СТАВКИ
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Ставки */}
              <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600">
                  <Percent className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#7AA899] mb-4">Выгодные Ставки</h3>
                <p className="text-gray-600 leading-relaxed">
                  Процентная ставка рассматривается индивидуально и начинается <strong>от минимальных банковских значений</strong>. Мы подаем заявку сразу в несколько банков-партнеров, чтобы выбрать для вас предложение с самой низкой переплатой.
                </p>
              </div>

              {/* Сроки */}
              <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#7AA899] mb-4">Удобные Сроки</h3>
                <p className="text-gray-600 leading-relaxed">
                  Выбирайте комфортный срок кредитования <strong>до 7 лет</strong>. Вы всегда можете погасить автокредит досрочно без штрафов и дополнительных комиссий, снизив итоговую переплату.
                </p>
              </div>

              {/* Условия */}
              <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 text-[#7AA899]">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#7AA899] mb-4">Лояльные Условия</h3>
                <p className="text-gray-600 leading-relaxed">
                  Легкое оформление. Во многих случаях <strong>первоначальный взнос от 0%</strong>. Одобрение по минимальному пакету документов (паспорт и водительское удостоверение). Без навязанных дорогостоящих страховок «КАСКО на 5 лет».
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-[#7AA899] to-[#123860]">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ХОТИТЕ УЗНАТЬ ШАНС НА ОДОБРЕНИЕ И РАССЧИТАТЬ ПЛАТЕЖ?
            </h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
              Оставьте заявку. Наш кредитный специалист свяжется с вами, бесплатно проконсультирует и сделает точный расчет графиков платежей в 3-х лучших банках за 15 минут.
            </p>
            <Button 
                onClick={() => setContactDialogOpen(true)}
                className="bg-white text-[#7AA899] hover:bg-gray-100 px-10 py-7 text-xl rounded-full shadow-2xl transition-transform hover:scale-105"
            >
              Получить бесплатный расчет
            </Button>
          </div>
        </section>
      </main>

      <ContactDialog open={contactDialogOpen} onOpenChange={setContactDialogOpen} />
      <Footer />
    </div>
  );
}
