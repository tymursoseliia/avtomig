import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Отзывы клиентов - АВТОМИГ",
  description: "Отзывы более 1000 довольных клиентов АВТОМИГ. Видео и текстовые отзывы о покупке автомобилей из Европы. Рейтинг 4.9 на Яндекс и 2ГИС.",
  openGraph: {
    title: "Отзывы клиентов - АВТОМИГ",
    description: "Отзывы более 1000 довольных клиентов АВТОМИГ. Видео и текстовые отзывы о покупке автомобилей из Европы. Рейтинг 4.9 на Яндекс и 2ГИС.",
  },
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
