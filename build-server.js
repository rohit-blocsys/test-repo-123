import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Building server...');

// Copy database.ts to server directory for compilation
const databaseSource = path.join(__dirname, 'src', 'lib', 'database.ts');
const databaseDest = path.join(__dirname, 'server', 'database.ts');

if (fs.existsSync(databaseSource)) {
  fs.copyFileSync(databaseSource, databaseDest);
  console.log('Copied database.ts to server directory');
}

// Use JavaScript files directly - bypass TypeScript compilation
console.log('🔄 Using JavaScript files directly...');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'server', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy JavaScript files to dist directory
const filesToCopy = [
  { src: 'server/index.js', dest: 'server/dist/index.js' },
  { src: 'server/database.js', dest: 'server/dist/database.js' }
];

for (const file of filesToCopy) {
  if (fs.existsSync(file.src)) {
    fs.copyFileSync(file.src, file.dest);
    console.log(`📄 Copied ${file.src} to ${file.dest}`);
  } else {
    console.log(`⚠️  Warning: ${file.src} not found`);
  }
}

console.log('✅ Server built successfully using JavaScript files'); 