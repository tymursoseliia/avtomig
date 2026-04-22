import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Каталог автомобилей из Европы - АВТОМИГ",
  description: "Каталог автомобилей из Европы с доставкой в РФ. Большой выбор Mercedes-Benz, BMW, Audi, Volkswagen и других премиум марок. Экономия до 30%.",
  openGraph: {
    title: "Каталог автомобилей из Европы - АВТОМИГ",
    description: "Каталог автомобилей из Европы с доставкой в РФ. Большой выбор Mercedes-Benz, BMW, Audi, Volkswagen и других премиум марок. Экономия до 30%.",
  },
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
