// script.js – erweitert mit Unternehmensanzeige + schöneren Effekten
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('authForm');
  const msg = document.getElementById('msg');
  const rememberChk = document.getElementById('remember');
  const typeBtns = document.querySelectorAll('.type-btn');
  const groupPrivat = document.querySelector('.group-privat');
  const groupFirma = document.querySelector('.group-unternehmen');
  const navRight = document.createElement('div');
  navRight.className = 'nav-right';
  document.querySelector('.nav-inner').appendChild(navRight);

  let currentType = 'privat';

  // Typ-Umschaltung
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentType = btn.dataset.type;
      updateView();
    });
  });

  function updateView() {
    if (currentType === 'privat') {
      groupPrivat.classList.remove('hidden');
      groupFirma.classList.add('hidden');
    } else {
      groupFirma.classList.remove('hidden');
      groupPrivat.classList.add('hidden');
    }
    clearMessage();
  }

  function showMessage(t, ok = true) {
    msg.textContent = t;
    msg.style.color = ok ? 'var(--primary)' : 'crimson';
  }
  function clearMessage() { msg.textContent = ''; }

  // Formular absenden
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const fd = new FormData(form);
    const remember = rememberChk.checked;

    if (currentType === 'unternehmen') {
      const data = {
        type: 'unternehmen',
        company_name: fd.get('company_name'),
        company_email: fd.get('company_email'),
        company_password: fd.get('company_password'),
        company_license: fd.get('company_license')
      };
      if (!data.company_name || !data.company_email || !data.company_password) {
        showMessage('Bitte alle Pflichtfelder ausfüllen', false);
        return;
      }
      const acc = await DS.saveAccount(data, { remember });
      showMessage('Unternehmen angemeldet ✅');
      showCompanyInNav(acc.meta.company_name);
      showExampleArticle(acc.meta.company_name);
    } else {
      const data = {
        type: 'privat',
        name: fd.get('name'),
        email: fd.get('email'),
        password: fd.get('password')
      };
      const acc = await DS.saveAccount(data, { remember });
      showMessage('Privat-Konto gespeichert ✅');
    }
  });

  function showCompanyInNav(name) {
    navRight.innerHTML = `
      <div class="avatar">${name.charAt(0).toUpperCase()}</div>
      <div class="acc-name">${name}</div>
    `;
  }

  // Artikel-Demo anzeigen (oben rechts Unternehmensname sichtbar)
  function showExampleArticle(companyName) {
    const page = document.querySelector('.page');
    const demo = document.createElement('div');
    demo.className = 'item-card';
    demo.innerHTML = `
      <img src="https://via.placeholder.com/120x120.png?text=Artikel" alt="Artikel">
      <div class="item-info">
        <h3>Beispiel-Produkt von ${companyName}</h3>
        <p>Dieses Produkt wurde von ${companyName} eingestellt und ist nun auf DelivZone sichtbar.</p>
      </div>
    `;
    page.appendChild(demo);
  }

  // kleine Fade-Animation beim Laden
  document.body.style.opacity = 0;
  window.setTimeout(() => {
    document.body.style.transition = 'opacity 0.6s ease';
    document.body.style.opacity = 1;
  }, 100);

  function clearMessage() { msg.textContent = ''; }
});
