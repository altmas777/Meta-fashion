const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace JSX literal $ before curly braces
      content = content.replace(/\$\{/g, '₹{');
      // Except where it's inside a template literal.
      // Actually, wait! `${` inside backticks is template interpolation. I can't replace `${` with `₹{` inside backticks!
    }
  }
}
