// Test script to verify data reveal functionality
// This script temporarily changes the date to test the reveal component

const fs = require('fs');
const path = require('path');

// Read the Index.tsx file
const indexPath = path.join(__dirname, 'src/pages/Index.tsx');
let content = fs.readFileSync(indexPath, 'utf8');

// Temporarily change the date to test reveal functionality
const testDate = '2025-01-01T00:00:00'; // Use a past date for testing
content = content.replace(
  /new Date\('2025-08-02T00:00:00'\)/g,
  `new Date('${testDate}')`
);

// Write the modified content back
fs.writeFileSync(indexPath, content);

console.log('✅ Date temporarily changed to test reveal functionality');
console.log('📅 Changed countdown end date to:', testDate);
console.log('🔄 Restart the development server to see the changes');
console.log('⚠️  Remember to revert this change before production!'); 