// src/lib/telegram-parser.ts

export interface ParsedCarDetails {
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  description: string;
}

const BRANDS = [
  'Toyota', 'BMW', 'Mercedes', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Porsche', 'Lexus', 'Honda',
  'Hyundai', 'Kia', 'Ford', 'Chevrolet', 'Nissan', 'Mazda', 'Subaru', 'Volvo',
  'Land Rover', 'Geely', 'Chery', 'Haval', 'Changan', 'Skoda', 'Renault', 'Peugeot', 'Mitsubishi', 'Suzuki'
];

export function parseCarPost(text: string): ParsedCarDetails | null {
  if (!text) return null;

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return null;

  // 1. Description is the entire text block
  const description = text;

  // 2. Year: find first 4 digits starting with 19 or 20
  const yearMatch = text.match(/\b(19\d{2}|20\d{2})\b/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();

  // 3. Price
  const cleanText = text.replace(/[\s,.'`_]/g, '');
  const priceMatch = cleanText.match(/(?:цена|price)?:?(\d{3,8})(?:\$|€|₽|р|руб|usd|eur|eur|дол|евр)/i);
  let price = 0;
  if (priceMatch) {
    price = parseInt(priceMatch[1], 10);
  } else {
    // Just looking for any large logical numbers that might be price
    const fallbackPriceMatch = text.replace(/\s/g, '').match(/\b(\d{5,8})\b/);
    if (fallbackPriceMatch) price = parseInt(fallbackPriceMatch[1], 10);
  }

  // 4. Mileage
  const mileageMatch = cleanText.match(/(?:пробег|mileage)?:?(\d{1,6})(?:км|km|тыс)/i);
  let mileage = 0;
  if (mileageMatch) {
    mileage = parseInt(mileageMatch[1], 10);
    if (cleanText.toLowerCase().includes('тыс') && mileage < 1000) {
      mileage = mileage * 1000;
    }
  }

  // 5. Brand
  let brand = "Неизвестно";
  const upperText = text.toUpperCase();
  for (const b of BRANDS) {
    if (upperText.includes(b.toUpperCase())) {
      brand = b;
      break;
    }
  }

  // 6. Model: attempt to extract from first line
  let model = lines[0];
  if (brand !== "Неизвестно") {
    model = model.replace(new RegExp(brand, 'ig'), '').trim();
  }
  // Cleanup artifacts, max 30 chars
  model = model.replace(/[^a-zA-Zа-яА-Я0-9- ]/g, '').trim();
  if (!model || model.length === 0) model = "Модель не указана";
  if (model.length > 30) model = model.substring(0, 30);

  // 7. Fuel & Transmission
  let transmission = 'Автомат';
  if (text.toLowerCase().includes('механик') || text.toLowerCase().includes('мкпп')) transmission = 'Механика';
  if (text.toLowerCase().includes('робот') || text.toLowerCase().includes('dsg') || text.toLowerCase().includes('дсг')) transmission = 'Робот';

  let fuel_type = 'Бензин';
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('дизель') || lowerText.includes('тди') || lowerText.includes('tdi')) {
    fuel_type = 'Дизель';
  }
  
  if (
    lowerText.includes('электромобиль') || 
    lowerText.includes('электрокар') || 
    (/(?:^|\s)ev(?:\s|$|,|\.)/).test(lowerText) ||
    (/(?:^|\s)электро(?:\s|$|,|\.)/).test(lowerText)
  ) {
    fuel_type = 'Электро';
  }
  
  if (lowerText.includes('гибрид') || lowerText.includes('hybrid')) {
    fuel_type = 'Гибрид';
  }

  return {
    brand,
    model: model || 'Автомобиль',
    year,
    price,
    mileage,
    fuel_type,
    transmission,
    description
  };
}
