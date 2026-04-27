'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Send, MessageCircle, Menu, X } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#7AA899] shadow-md px-6 py-3">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 relative z-50">
          <div className="flex flex-col items-start">
            <div className="text-2xl font-bold text-white leading-none">АВТОМИГ</div>
            <div className="text-[8px] font-semibold text-white tracking-[0.15em] uppercase mt-0.5">
              Авто из Европы
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-5 text-white text-sm">
          <Link href="/" className="hover:text-yellow-300 transition-colors font-medium">Главная</Link>
          <Link href="/about" className="hover:text-yellow-300 transition-colors font-medium">О нас</Link>
          <Link href="/team" className="hover:text-yellow-300 transition-colors font-medium">Команда</Link>
          <Link href="/reviews" className="hover:text-yellow-300 transition-colors font-medium">Отзывы</Link>
          <Link href="/catalog" className="hover:text-yellow-300 transition-colors font-medium">Каталог</Link>
          <Link href="/contacts" className="hover:text-yellow-300 transition-colors font-medium">Контакты</Link>
          <Link href="/credit" className="bg-[#E63946] hover:bg-red-700 text-white px-4 py-1.5 rounded-full transition-colors font-bold shadow-sm border border-red-500/20">Автокредит</Link>
        </nav>

        {/* Desktop Contact Buttons & Mobile Toggle */}
        <div className="flex items-center gap-3 relative z-50">
          <a
            href="https://t.me/Automigsup"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex w-10 h-10 bg-[#0088cc] rounded-full items-center justify-center hover:bg-[#0077b3] transition-colors"
            title="Наш Telegram канал"
          >
            <Send className="w-5 h-5 text-white" />
          </a>
          <a
            href="tel:+79809751463"
            className="hidden sm:flex items-center gap-2 bg-white text-[#7AA899] hover:bg-gray-100 px-4 py-2 rounded-full font-medium shadow-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">+7 (980) 975-14-63</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="lg:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Иконка меню"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={`fixed inset-0 bg-[#7AA899] z-40 transition-transform duration-300 ease-in-out flex flex-col lg:hidden pt-24 pb-8 px-6 overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col gap-6 text-white text-lg flex-1">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-300 transition-colors font-medium border-b border-white/10 pb-2">Главная</Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-300 transition-colors font-medium border-b border-white/10 pb-2">О нас</Link>
          <Link href="/team" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-300 transition-colors font-medium border-b border-white/10 pb-2">Команда</Link>
          <Link href="/reviews" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-300 transition-colors font-medium border-b border-white/10 pb-2">Отзывы</Link>
          <Link href="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-300 transition-colors font-medium border-b border-white/10 pb-2">Каталог</Link>
          <Link href="/contacts" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-300 transition-colors font-medium border-b border-white/10 pb-2">Контакты</Link>
          <Link href="/credit" onClick={() => setIsMobileMenuOpen(false)} className="bg-[#E63946] hover:bg-red-700 text-white px-4 py-3 rounded-xl transition-colors font-bold shadow-sm text-center mt-2">Автокредит</Link>
        </nav>
        
        <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-white/20">
          <a
            href="tel:+79809751463"
            className="flex items-center justify-center gap-2 bg-white text-[#7AA899] px-4 py-3 rounded-full font-medium shadow-sm"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-base font-bold">+7 (980) 975-14-63</span>
          </a>
          <a
            href="https://t.me/Automigsup"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#0088cc] text-white px-4 py-3 rounded-full font-medium shadow-sm transition-colors"
          >
            <Send className="w-5 h-5" />
            <span className="text-base font-bold">Написать в Telegram</span>
          </a>
        </div>
      </div>
    </header>
  );
}
