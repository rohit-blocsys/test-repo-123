// Script to revert the date back to August 2nd, 2025
const fs = require('fs');
const path = require('path');

// Read the Index.tsx file
const indexPath = path.join(__dirname, 'src/pages/Index.tsx');
let content = fs.readFileSync(indexPath, 'utf8');

// Revert to the original date
const originalDate = '2025-08-02T00:00:00';
content = content.replace(
  /new Date\('2025-01-01T00:00:00'\)/g,
  `new Date('${originalDate}')`
);

// Write the modified content back
fs.writeFileSync(indexPath, content);

console.log('✅ Date reverted to original countdown end date');
console.log('📅 Countdown end date set to:', originalDate);
console.log('🔄 Restart the development server to see the changes'); 