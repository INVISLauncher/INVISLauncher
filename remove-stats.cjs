const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const statsBlockStart = html.indexOf('<!-- ANIMATED STATS COUNTER SECTION -->');
const statsBlockEnd = html.indexOf('<!-- FEATURES SECTION -->');

if (statsBlockStart !== -1 && statsBlockEnd !== -1) {
  html = html.slice(0, statsBlockStart) + html.slice(statsBlockEnd);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('✓ Stats section removed successfully');
} else {
  console.log('❌ Stats block markers not found');
}
