import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Building server...');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'server', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy database.ts to server directory for compilation
const databaseSource = path.join(__dirname, 'src', 'lib', 'database.ts');
const databaseDest = path.join(__dirname, 'server', 'database.ts');

if (fs.existsSync(databaseSource)) {
  fs.copyFileSync(databaseSource, databaseDest);
  console.log('Copied database.ts to server directory');
}

// Copy compiled database.js to dist directory
const databaseJsSource = path.join(__dirname, 'server', 'database.js');
const databaseJsDest = path.join(__dirname, 'server', 'dist', 'database.js');

if (fs.existsSync(databaseJsSource)) {
  fs.copyFileSync(databaseJsSource, databaseJsDest);
  console.log('Copied compiled database.js to dist directory');
}

// TypeScript is already installed in root directory
console.log('✅ Using TypeScript from root directory');

// Compile TypeScript using root directory's tsc
try {
  execSync('./node_modules/.bin/tsc -p server/tsconfig.json', { stdio: 'inherit' });
  console.log('✅ Server built successfully');
} catch (error) {
  console.error('❌ Server build failed:', error.message);
  process.exit(1);
} 