const fs = require('fs');
let js = fs.readFileSync('src/main.js', 'utf8');

// FIX: Remove the self-calling line inside setCaptchaMode
// Line 167: window.setCaptchaMode('text'); // Initialize default mode  <-- BUG
const buggyLine = `  window.generateVisualCaptcha();\n  window.setCaptchaMode('text'); // Initialize default mode\n};`;
const fixedLine = `  window.generateVisualCaptcha();\n};`;

if (js.includes(buggyLine)) {
  js = js.replace(buggyLine, fixedLine);
  console.log('✅ Infinite recursion bug FIXED in setCaptchaMode');
} else {
  // Try to find the exact buggy text
  const idx = js.indexOf("window.setCaptchaMode('text'); // Initialize default mode");
  if (idx >= 0) {
    // Remove just that line
    const lineStart = js.lastIndexOf('\n', idx);
    const lineEnd = js.indexOf('\n', idx);
    js = js.slice(0, lineStart) + js.slice(lineEnd);
    console.log('✅ Found and removed infinite recursion line (fallback method)');
  } else {
    console.log('❌ Pattern not found - may already be fixed or pattern differs');
    // Print surrounding context
    const ctxIdx = js.indexOf('window.setCaptchaMode');
    console.log('Context around setCaptchaMode:', js.slice(ctxIdx, ctxIdx + 300));
  }
}

fs.writeFileSync('src/main.js', js, 'utf8');
console.log('Done. Size:', js.length);
