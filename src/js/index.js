// ===== GENERATE STARS =====
const starsEl = document.getElementById('stars');

for (let i = 0; i < 160; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  const size = Math.random() * 2.2 + 0.6;
  s.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    top: ${Math.random() * 100}%;
    left: ${Math.random() * 100}%;
    animation-duration: ${2 + Math.random() * 4}s;
    animation-delay: ${Math.random() * 5}s;
  `;
  starsEl.appendChild(s);
}

// ===== ENTER KEY SHORTCUT =====
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') window.location.href = 'index1.html';
});