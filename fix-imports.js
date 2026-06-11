const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      content = content.replace(/import (.*?) from '(\.\.\/)+store\/(.*?)'/g, "import $1 from '@/store/$3'");
      content = content.replace(/import (.*?) from '(\.\.\/)+components\/(.*?)'/g, "import $1 from '@/components/$3'");
      content = content.replace(/import (.*?) from '(\.\.\/)+lib\/(.*?)'/g, "import $1 from '@/lib/$3'");
      fs.writeFileSync(fullPath, content);
    }
  }
}

replaceInDir('./client/app');
replaceInDir('./client/components');
replaceInDir('./client/store');
console.log('Fixed imports!');
