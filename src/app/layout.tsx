import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://xn--80aedttl1a.com"),
  title: "АВТОМИГ - Авто из Европы с доставкой по РФ",
  description: "Автомобили из Европы под ключ. Подбор, доставка, растаможка. Более 13 лет на рынке, 1000+ довольных клиентов. Экономия до 30%.",
  keywords: "авто из европы, автомобили из европы, пригон авто, растаможка авто, АВТОМИГ",
  authors: [{ name: "АВТОМИГ" }],
  icons: {
    icon: "/favicon.png?v=2",
    shortcut: "/favicon.png?v=2",
    apple: "/favicon.png?v=2",
  },
  openGraph: {
    title: "АВТОМИГ - Авто из Европы с доставкой по РФ",
    description: "Автомобили из Европы под ключ. Подбор, доставка, растаможка. Более 13 лет на рынке, 1000+ довольных клиентов. Экономия до 30%.",
    url: "https://xn--80aedttl1a.com",
    siteName: "АВТОМИГ - Авто из Европы",
    type: "website",
    locale: "ru_RU",
    images: [
      {
        url: "https://xn--80aedttl1a.com/images/Gemini_Generated_Image_pasezcpasezcpase.jpeg",
        width: 1200,
        height: 630,
        alt: "АВТОМИГ - Автомобили из Европы",
      },
      {
        url: "https://xn--80aedttl1a.com/images/logo.png",
        width: 800,
        height: 800,
        alt: "АВТОМИГ - Логотип",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "АВТОМИГ - Авто из Европы с доставкой по РФ",
    description: "Автомобили из Европы под ключ. Подбор, доставка, растаможка. Более 13 лет на рынке, 1000+ довольных клиентов.",
    images: ["https://xn--80aedttl1a.com/images/Gemini_Generated_Image_pasezcpasezcpase.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${montserrat.variable} ${inter.variable}`}>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
