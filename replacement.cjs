const fs = require('fs');
let c = fs.readFileSync('src/main.js', 'utf8');

// Update email validation error display section
const oldEmailCheck = `  // 1. Strict Real Email Verification & Anti-Temp-Mail Check
  const emailCheck = validateRealEmail(userEmailVal);
  if (!emailCheck.valid) {
    if (emailCheck.reason === 'disposable') {
      showFormAlert(currentLang === 'en' ? '⚠️ Temporary (Temp-Mail) email addresses are blocked! Please use a real email.' : '⚠️ Geçici (Temp-Mail) e-posta adresleri engellenmiştir! Lütfen gerçek e-posta adresinizi girin.', 'error');
    } else if (emailCheck.reason === 'fake_prefix') {
      showFormAlert(currentLang === 'en' ? '⚠️ Fake/Test email addresses (like test@, fake@, asdf@) are not allowed!' : '⚠️ Sahte/Test e-posta adresleri (test@, fake@, asdf@ gibi) kabul edilmemektedir!', 'error');
    } else {
      showFormAlert(currentLang === 'en' ? '⚠️ Please enter a valid real email address!' : '⚠️ Lütfen geçerli bir gerçek e-posta adresi girin.', 'error');
    }
    return false;
  }`;

const newEmailCheck = `  // 1. Advanced Email Verification
  const emailCheck = validateRealEmail(userEmailVal);
  if (!emailCheck.valid) {
    const reasonMsgs = {
      disposable:     currentLang==='en' ? '⚠️ Disposable/temp-mail blocked! Use a real email.' : '⚠️ Geçici e-posta adresleri engellenmiştir! Gerçek e-posta kullanın.',
      fake_prefix:    currentLang==='en' ? '⚠️ Fake/test email detected.' : '⚠️ Sahte/test e-posta tespit edildi!',
      repetitive:     currentLang==='en' ? '⚠️ Email contains repeated characters.' : '⚠️ E-postada tekrarlanan karakter deseni var.',
      sequential:     currentLang==='en' ? '⚠️ Sequential numbers detected in email.' : '⚠️ E-postada ardışık sayı deseni tespit edildi.',
      keyboard:       currentLang==='en' ? '⚠️ Keyboard pattern in email (e.g. qwerty/asdf).' : '⚠️ Klavye deseni tespit edildi (qwerty/asdf gibi).',
      low_entropy:    currentLang==='en' ? '⚠️ Email username is too simple.' : '⚠️ Kullanıcı adı çok basit ya da tekrarlı.',
      suspicious_tld: currentLang==='en' ? '⚠️ Suspicious domain extension detected.' : '⚠️ Şüpheli alan adı uzantısı (.xyz, .tk vb.).',
      no_vowels:      currentLang==='en' ? '⚠️ Email username looks randomly generated.' : '⚠️ Kullanıcı adı rastgele oluşturulmuş gibi görünüyor.',
      format:         currentLang==='en' ? '⚠️ Please enter a valid email address!' : '⚠️ Lütfen geçerli bir e-posta adresi girin!',
      domain:         currentLang==='en' ? '⚠️ Invalid domain.' : '⚠️ Geçersiz alan adı.',
    };
    showFormAlert(reasonMsgs[emailCheck.reason] || (currentLang==='en' ? '⚠️ Invalid email!' : '⚠️ Geçersiz e-posta!'), 'error');
    return false;
  }`;

if (c.includes('// 1. Strict Real Email Verification & Anti-Temp-Mail Check')) {
  c = c.replace(oldEmailCheck, newEmailCheck);
  console.log('Email error messages updated OK');
} else {
  console.log('WARNING: pattern not found, skipping');
}

fs.writeFileSync('src/main.js', c, 'utf8');
console.log('Done. Size:', c.length);
