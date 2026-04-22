import fs from 'fs';
import path from 'path';

const dirs = ['.', 'about', 'team', 'reviews', 'catalog', 'credit', 'admin', 'contacts'];

dirs.forEach(d => {
  const file = path.join('src/app', d, 'page.tsx');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Replace footer
    const target = /<p>© \{new Date\(\)\.getFullYear\(\)\} ООО «Автомиг»\. Все права защищены\.<\/p>\s*<p>ИНН: 9713601569 \| ОГРН: 1217700030514<\/p>/g;
    const replacement = `<p>© {new Date().getFullYear()} ООО «Автомиг». Все права защищены.</p>
            <p className="hidden md:block">|</p>
            <p>ИНН: 9713601569 | ОГРН: 1217700030514</p>
            <div className="flex flex-col text-center md:text-right w-full md:w-auto mt-4 md:mt-auto md:ml-auto">
              <p>443065, Самарская область, г. Самара, Долотный пер., д.7, 10</p>
            </div>`;
    
    // Ensure we don't duplicate
    if (!content.includes('Самарская область')) {
      // also replace the pt-8 flex wrapper to make it flow properly
      const startWrapper = `<div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">`;
      const wrapperReplacement = `<div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-start items-center md:items-start gap-4 text-sm text-gray-400">`;
      
      content = content.replace(startWrapper, wrapperReplacement);
      content = content.replace(target, replacement);
      fs.writeFileSync(file, content);
      console.log('Updated footer in', file);
    }
  }
});
