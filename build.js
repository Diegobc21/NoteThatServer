const fs = require('fs');
const path = require('path');

const sourceDir = './dist';

fs.readdirSync(sourceDir).forEach((file) => {
  if (file.endsWith('.js')) {
    const oldPath = path.join(sourceDir, file);
    const newPath = path.join(sourceDir, file.replace('.js', '.cjs'));
    fs.renameSync(oldPath, newPath);
  }
});