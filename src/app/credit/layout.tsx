import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Автокредит на авто из Европы - АВТОМИГ",
  description: "Выгодный автокредит на автомобили из Европы. Быстрое одобрение, низкие процентные ставки, удобные сроки кредитования от компании АВТОМИГ.",
  openGraph: {
    title: "Автокредит на авто из Европы - АВТОМИГ",
    description: "Выгодный автокредит на автомобили из Европы. Быстрое одобрение, низкие процентные ставки, удобные сроки кредитования от компании АВТОМИГ.",
  },
};

export default function CreditLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
