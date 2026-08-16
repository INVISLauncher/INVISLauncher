const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const targetStr = `    (function() {
      var currentVer = "3.1.2_v5";
      var savedVer = localStorage.getItem("invis_app_version");
      if (savedVer !== currentVer) {
        localStorage.clear();
        localStorage.setItem("invis_app_version", currentVer);
      }
    })();`;

const newPurger = `    (function() {
      var currentVer = "3.1.2_v7_final";
      var savedVer = localStorage.getItem("invis_app_version");
      if (savedVer !== currentVer) {
        localStorage.clear();
        localStorage.setItem("invis_app_version", currentVer);
      }
      // Force kill any lingering ServiceWorker & CacheStorage
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(regs) {
          for (var i = 0; i < regs.length; i++) regs[i].unregister();
        });
      }
      if ('caches' in window) {
        caches.keys().then(function(keys) {
          for (var j = 0; j < keys.length; j++) caches.delete(keys[j]);
        });
      }
    })();`;

if (html.includes(targetStr)) {
  html = html.replace(targetStr, newPurger);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('✓ index.html cache/serviceWorker killer injected OK');
} else {
  console.log('❌ targetStr not found in index.html');
}
