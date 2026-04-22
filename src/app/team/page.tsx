'use client';

import { Button } from '@/components/ui/button';
import { Send, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function TeamPage() {
  const teamMembers: { name: string, image: string, role?: string }[] = [
    {
      name: 'Николай Сурков',
      role: 'Старший менеджер',
      image: '/team/surkov.png'
    },
    {
      name: 'Александр Зайцев',
      role: 'Менеджер',
      image: '/team/zaitsev.png'
    },
    {
      name: 'Сергей Смирнов',
      role: 'Менеджер',
      image: '/team/smirnov.jpg'
    },
    {
      name: 'Юрий Минин',
      role: 'Менеджер',
      image: '/team/minin.jpg'
    },
    {
      name: 'Невьявцев Олег Алексеевич',
      role: 'Менеджер',
      image: '/team/oleg.png'
    },
    {
      name: 'Максим Кириенко',
      role: 'Менеджер',
      image: '/team/kirienko.png'
    },
    {
      name: 'Юрий Смирнов',
      role: 'Менеджер',
      image: '/team/ysmirnov.png'
    },
    {
      name: 'Виктор Ушаков',
      role: 'Менеджер',
      image: '/team/ushakov.png'
    },
    {
      name: 'Андрей Коваленко',
      role: 'Менеджер',
      image: '/team/kovalenko.jpg'
    }
  ];

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
            <h1 className="text-5xl font-bold text-white">КОМАНДА</h1>
          </div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="py-12 px-8 bg-white">
        <div className="max-w-screen-2xl mx-auto">
          {/* First member - centered */}
          <div className="flex justify-center mb-12">
            <div className="flex flex-col items-center">
              <div className="w-64 h-64 rounded-full overflow-hidden mb-4 border-4 border-[#7AA899]">
                <img
                  src={teamMembers[0].image}
                  alt={teamMembers[0].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#7AA899] text-center">
                {teamMembers[0].name}
              </h3>
              {teamMembers[0].role && (
                <p className="text-[#0088cc] font-medium mt-1 text-center">{teamMembers[0].role}</p>
              )}
            </div>
          </div>

          {/* Rest of the team - 4 columns grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {teamMembers.slice(1).map((member, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-gray-200">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-[#7AA899] text-center">
                  {member.name}
                </h3>
                {member.role && (
                  <p className="text-sm text-gray-500 mt-1 text-center">{member.role}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
