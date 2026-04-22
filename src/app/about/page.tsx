'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Send, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useState } from 'react';

export default function AboutPage() {
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    budget: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('Пожалуйста, согласитесь с условиями пользовательского соглашения');
      return;
    }

    setSubmitting(true);

    try {
      // Отправка в Telegram
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          budget: formData.budget,
          type: 'about_consultation'
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка отправки');
      }

      alert(`Спасибо, ${formData.name}! Мы свяжемся с вами в ближайшее время.`);

      // Reset form
      setFormData({ name: '', phone: '', budget: '' });
      setAgreed(false);
    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section with Diagonal Stripes */}
      <section className="relative bg-[#7AA899] overflow-hidden pt-[100px] lg:pt-[120px]">
        {/* Diagonal Stripes Pattern */}
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
            <h1 className="text-5xl font-bold text-white 2xl:my-[47px] 2xl:px-[14px] 2xl:py-[0px]">О НАС</h1>
          </div>
        </div>
      </section>

      {/* Company Description Section */}
      <section className="bg-[#7AA899] pb-8">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Text */}
            <div className="text-white space-y-4">
              <p className="text-base leading-relaxed">
                <strong>«АВТОМИГ»</strong> — команда специалистов с опытом в подборе и импорте автомобилей более 13 лет.
              </p>
              <p className="text-base leading-relaxed">
                Мы работаем напрямую с европейскими дилерами, аукционами и проверенными продавцами, чтобы вы получали честный, прозрачный и выгодный вариант без переплат перекупам.
              </p>
              <p className="text-base leading-relaxed">
                Для нас важно, чтобы клиент понимал каждый этап сделки и был уверен в своём выборе — именно поэтому мы предлагаем полную прозрачность на каждом этапе работы.
              </p>
            </div>

            {/* Right side - Video */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
              <iframe
                src="https://rutube.ru/play/embed/1d1ce1c0e01297dfc5de75219470a824/"
                title="О компании АВТОМИГ"
                className="w-full h-full"
                frameBorder="0"
                allow="clipboard-write; autoplay"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-8 px-8 bg-white">
        <div className="max-w-screen-2xl mx-auto">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-[#7AA899] mb-6">ЧЕМ МЫ ЗАНИМАЕМСЯ</h2>

            <div className="space-y-4">
              <p className="text-base text-gray-800">
                Мы сопровождаем покупку автомобиля из-за границы <strong>от идеи до постановки на учёт в РФ:</strong>
              </p>

              <ul className="space-y-2 text-gray-800 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#0A7ABF] mt-0.5">•</span>
                  <span>Подбор авто под ваш бюджет и запросы</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0A7ABF] mt-0.5">•</span>
                  <span>Проверка истории по базам и по VIN</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0A7ABF] mt-0.5">•</span>
                  <span>Организация осмотра и диагностики</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0A7ABF] mt-0.5">•</span>
                  <span>Переговоры с продавцом и выкуп</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0A7ABF] mt-0.5">•</span>
                  <span>Доставка авто в Россию</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0A7ABF] mt-0.5">•</span>
                  <span>Растаможка и оформление всех документов</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0A7ABF] mt-0.5">•</span>
                  <span>Постановка на учёт и передача автомобиля вам</span>
                </li>
              </ul>

              <p className="text-base text-gray-800 pt-3">
                Вы получаете готовый к эксплуатации автомобиль, который уже прошел все юридические и технические этапы.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Principles Section */}
      <section className="py-8 px-8 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Principle Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-[#7AA899] mb-4">
                НАШ ПРИНЦИП — ЧЕСТНОСТЬ И ПРОЗРАЧНОСТЬ
              </h2>

              <p className="text-gray-800 mb-4 text-sm">Мы открыто показываем:</p>

              <ul className="space-y-2 text-gray-800 text-sm mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-[#0A7ABF] mt-0.5">•</span>
                  <span>из каких стран и по каким каналам берём автомобили;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0A7ABF] mt-0.5">•</span>
                  <span>как формируется итоговая стоимость;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0A7ABF] mt-0.5">•</span>
                  <span>какие платежи вы оплачиваете и на каком этапе.</span>
                </li>
              </ul>

              <p className="text-gray-800">
                Никаких скрытых комиссий и «сюрпризов» по цене. Все условия закрепляем в договоре.
              </p>
            </div>

            {/* Why Choose Us Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-[#7AA899] mb-4">
                ПОЧЕМУ «АВТОМИГ»
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">Экономия до 20–30%</h3>
                  <p className="text-gray-700 text-sm">
                    по сравнению с покупкой аналогичного авто на внутреннем рынке
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">Честная диагностика и реальные данные</h3>
                  <p className="text-gray-700 text-sm">
                    по пробегу и состоянию
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">Полное сопровождение</h3>
                  <p className="text-gray-700 text-sm">
                    — вы не занимаетесь бюрократией и логистикой
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">Ответственность за результат</h3>
                  <p className="text-gray-700 text-sm">
                    — мы заинтересованы, чтобы вы остались довольны и рекомендовали нас дальше
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why >1000 People Section */}
      <section className="py-8 px-8 bg-white">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-3xl font-bold text-[#7AA899] mb-6">
            ПОЧЕМУ &gt;1000 ЧЕЛОВЕК РЕШИЛИ<br />
            РАБОТАТЬ С НАМИ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Card 1 - Triple Check */}
            <div className="bg-gray-50 rounded-lg p-5 relative overflow-hidden">
              <h3 className="text-lg font-bold text-[#7AA899] mb-3">
                АВТО ПРОХОДИТ<br />
                ТРОЙНУЮ ПРОВЕРКУ
              </h3>
              <ul className="space-y-1.5 text-xs text-gray-700 mb-3">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Юридическая чистота (запреты, залоги, ДТП)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Подлинность пробега (история ТО, сервисные книжки)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Техсостояние ДВС)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Комплексная диагностика у независимого эксперта</span>
                </li>
              </ul>
              <p className="text-xs text-gray-600 italic">
                Риски исключены — вы получаете только прозрачный, безопасный автомобиль.
              </p>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10">
                <svg viewBox="0 0 100 100" fill="currentColor" className="text-green-600">
                  <circle cx="50" cy="50" r="40" />
                  <path d="M30 50 L45 65 L70 35" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Card 2 - Fixed Price */}
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="text-lg font-bold text-[#7AA899] mb-3">
                СТОИМОСТЬ В ДОГОВОРЕ<br />
                НЕ МЕНЯЕТСЯ
              </h3>
              <p className="text-xs text-gray-700 mb-3">
                Вы сразу получаете смету перед подписанием договора и она не меняется — <strong>все расходы фиксируем в договоре.</strong>
              </p>
              <p className="text-xs text-gray-600 italic">
                Никаких сюрпризов на этапе растаможки или доставки.
              </p>
            </div>

            {/* Card 3 - Turnkey */}
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="text-lg font-bold text-[#7AA899] mb-3">
                ОФОРМЛЕНИЕ<br />
                ПОД КЛЮЧ
              </h3>
              <p className="text-xs text-gray-700 mb-3">
                <strong>Таможенное оформление,</strong> постановка на учёт, оформление на физическое или юридич.
              </p>
              <p className="text-xs text-gray-600 italic">
                Огромный опыт работ, позволяет нам, сделать всё качественно и быстро.
              </p>
            </div>

            {/* Card 4 - 2 Weeks Delivery */}
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="text-lg font-bold text-[#7AA899] mb-3">
                ДОСТАВКА АВТО<br />
                ЗА 2 НЕДЕЛИ
              </h3>
              <p className="text-xs text-gray-700 mb-3">
                Это <strong>быстрее рынка на 25%,</strong> благодаря налаженным цепочкам и экспресс-таможне.
              </p>
              <p className="text-xs text-gray-600 italic">
                Мы не обещаем лишнего, мы строго соблюдаем график.
              </p>
            </div>

            {/* Card 5 - 24/7 Support */}
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="text-lg font-bold text-[#7AA899] mb-3">
                24/7 ПОДДЕРЖКА<br />
                ЛИЧНОГО МЕНЕДЖЕРА
              </h3>
              <p className="text-xs text-gray-700 mb-3">
                Закрепляем за Вами личного менеджера, который ведёт Вас от первого звонка до получения авто.
              </p>
              <p className="text-xs text-gray-600 italic">
                Вы получаете регулярные отчёты о ходе доставки, помощь с документами и 24/7 поддержку по любым вопросам.
              </p>
            </div>

            {/* Card 6 - 20% Savings */}
            <div className="bg-gradient-to-br from-[#0A7ABF] to-[#095A8F] rounded-lg p-5 text-white">
              <h3 className="text-2xl font-bold mb-3">
                30% ЭКОНОМИИ
              </h3>
              <p className="text-sm">
                <strong>Вы получите авто за счет прямых поставок,</strong> без посредников.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Form Section */}
      <section className="py-8 px-8 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto">
          <div className="bg-[#7AA899] rounded-2xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left side - Text */}
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-6">
                  ПОЛУЧИТЕ БЕСПЛАТНУЮ КОНСУЛЬТАЦИЮ<br />
                  ПО ПОДБОРУ АВТОМОБИЛЯ
                </h2>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-lg flex-shrink-0">•</span>
                    <span className="text-sm">Объясним, как проходит процесс покупки и доставки авто</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-lg flex-shrink-0">•</span>
                    <span className="text-sm">Подберём подходящие модели под ваш бюджет и задачи</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-lg flex-shrink-0">•</span>
                    <span className="text-sm">Рассчитаем стоимость авто с учётом всех расходов</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-lg flex-shrink-0">•</span>
                    <span className="text-sm">Расскажем об актуальных акциях и возможных скидках</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-lg flex-shrink-0">•</span>
                    <span className="text-sm">Ответим на все вопросы по покупке, доставке и растаможке</span>
                  </li>
                </ul>
              </div>

              {/* Right side - Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  type="text"
                  placeholder="Ваше имя"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-11 bg-white text-gray-900 placeholder:text-gray-500"
                />

                <div className="flex gap-2">
                  <div className="flex items-center gap-2 h-11 px-3 bg-white border border-gray-200 rounded-md">
                    <span className="text-xl">🇷🇺</span>
                    <span className="text-gray-500 text-sm">+7</span>
                  </div>
                  <Input
                    type="tel"
                    placeholder="(000) 000-00-00"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="h-11 bg-white text-gray-900 placeholder:text-gray-500 flex-1"
                  />
                </div>

                <Select
                  value={formData.budget}
                  onValueChange={(value) => setFormData({ ...formData, budget: value })}
                  required
                >
                  <SelectTrigger className="h-11 bg-white text-gray-900">
                    <SelectValue placeholder="Выберите бюджет" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="500k">До 500 000 ₽</SelectItem>
                    <SelectItem value="1m">500 000 - 1 000 000 ₽</SelectItem>
                    <SelectItem value="2m">1 000 000 - 2 000 000 ₽</SelectItem>
                    <SelectItem value="3m">2 000 000 - 3 000 000 ₽</SelectItem>
                    <SelectItem value="more">Более 3 000 000 ₽</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  type="submit"
                  disabled={!agreed || submitting}
                  className="w-full h-11 bg-[#0088cc] hover:bg-[#0077b3] text-white text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Отправка...' : 'Оставить заявку'}
                </Button>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="consultation-terms-about"
                    checked={agreed}
                    onCheckedChange={(checked: boolean) => setAgreed(checked)}
                    className="mt-1 border-white data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <label
                    htmlFor="consultation-terms-about"
                    className="text-xs text-white leading-tight cursor-pointer"
                  >
                    <span className="text-green-400">✓</span> Я согласился с условиями пользовательского соглашения
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
