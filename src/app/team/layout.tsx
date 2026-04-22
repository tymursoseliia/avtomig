import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Наша команда - АВТОМИГ",
  description: "Команда профессионалов АВТОМИГ. 13 специалистов по подбору и доставке автомобилей из Европы. Опыт работы более 13 лет.",
  openGraph: {
    title: "Наша команда - АВТОМИГ",
    description: "Команда профессионалов АВТОМИГ. 13 специалистов по подбору и доставке автомобилей из Европы. Опыт работы более 13 лет.",
  },
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
