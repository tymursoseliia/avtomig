const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const srcDir = path.join(__dirname, 'src');
const files = walkSync(srcDir);

const replacements = {
  '#0A2540': '#7AA899', 
  '#1a365d': '#6D9688', 
  '#1E3A4C': '#6D9688', 
};

let filesChangedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  for (const [oldValue, newValue] of Object.entries(replacements)) {
    newContent = newContent.split(oldValue).join(newValue);
  }

  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    filesChangedCount++;
  }
});

console.log('Replaced colors in ' + filesChangedCount + ' files.');
