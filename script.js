// script.js
document.addEventListener("DOMContentLoaded", () => {

  // ======================
  // HERO SLIDER + PARALLAX
  // ======================
  const heroImages = document.querySelectorAll('.hero-right img');
  let currentSlide = 0;
  const slideInterval = 4000;
  heroImages.forEach(img => { img.style.transition = 'all 1s ease-in-out'; img.style.position='absolute'; img.style.top=0; img.style.left=0; img.style.width='100%'; img.style.opacity=0; });
  if(heroImages.length>0){ heroImages[0].style.opacity=1; }

  setInterval(() => {
    heroImages.forEach((img,i)=>img.style.opacity=i===currentSlide?1:0);
    currentSlide = (currentSlide+1)%heroImages.length;
  }, slideInterval);

  // Parallax bei Scroll
  const heroLeft = document.querySelector('.hero-left');
  window.addEventListener('scroll', () => {
    const offset = window.scrollY;
    if(heroLeft){
      heroLeft.style.transform = `translateY(${offset*0.2}px)`; 
    }
  });

  // ======================
  // MODALS (Login + Sell)
  // ======================
  const btnLogin = document.querySelector('.nav-buttons button:nth-child(2)');
  const btnSell = document.querySelector('.nav-buttons button:nth-child(1)');

  function createModal(id, title){
    const modal = document.createElement('div');
    modal.id = id;
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:none;align-items:center;justify-content:center;z-index:2000;';
    modal.innerHTML = `<div style="background:#fff;padding:20px;border-radius:12px;max-width:500px;width:90%;text-align:center;transform:scale(0.8);transition:all 0.3s ease;">
        <h3>${title}</h3>
        <input placeholder="Email/Shopname" style="width:90%;margin:8px 0;padding:8px;"><br>
        <input placeholder="Passwort/Produktname" style="width:90%;margin:8px 0;padding:8px;"><br>
        <textarea placeholder="Beschreibung" style="width:90%;margin:8px 0;padding:8px;"></textarea><br>
        <input type="number" placeholder="Preis €" style="width:90%;margin:8px 0;padding:8px;"><br>
        <button data-close style="margin-top:12px;padding:8px 16px;">Schließen</button>
    </div>`;
    document.body.appendChild(modal);
    const content = modal.querySelector('div');
    modal.querySelector('[data-close]').addEventListener('click', () => {
      content.style.transform = 'scale(0.8)';
      setTimeout(()=> modal.style.display='none', 300);
    });
    return modal;
  }

  const loginModal = createModal('loginModal','Login / Account erstellen');
  const sellModal = createModal('sellModal','Produkt hochladen');

  if(btnLogin) btnLogin.addEventListener('click', () => { loginModal.style.display='flex'; loginModal.querySelector('div').style.transform='scale(1)'; });
  if(btnSell) btnSell.addEventListener('click', () => { sellModal.style.display='flex'; sellModal.querySelector('div').style.transform='scale(1)'; });

  // ======================
  // FADE-IN PRODUKTKARTEN BEIM SCROLL
  // ======================
  const cards = document.querySelectorAll('.card');
  const fadeInCards = () => {
    const triggerBottom = window.innerHeight * 0.9;
    cards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;
      if(cardTop < triggerBottom){
        card.style.transition = 'all 0.6s ease-out';
        card.style.opacity = 1;
        card.style.transform = 'translateY(0)';
      }
    });
  };

  cards.forEach(card => { card.style.opacity=0; card.style.transform='translateY(40px)'; });
  window.addEventListener('scroll', fadeInCards);
  fadeInCards();

  // ======================
  // BUTTON HOVER EFFECTS
  // ======================
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.style.transition='all 0.2s ease';
    btn.addEventListener('mouseenter', ()=> btn.style.transform='scale(1.08)');
    btn.addEventListener('mouseleave', ()=> btn.style.transform='scale(1)');
  });

  // ======================
  // ADD-TO-CART ANIMATION (FLY EFFECT)
  // ======================
  const cartIcon = document.createElement('div');
  cartIcon.style.cssText = 'position:fixed;top:16px;right:16px;width:40px;height:40px;border-radius:50%;background:red;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:bold;z-index:3000;';
  cartIcon.textContent = '0';
  document.body.appendChild(cartIcon);
  let cartCount = 0;

  const addCartButtons = document.querySelectorAll('.products .btn');
  addCartButtons.forEach(btn=>{
    btn.addEventListener('click', e=>{
      cartCount++;
      cartIcon.textContent = cartCount;

      // FLIEGENDE MINI-KARTE
      const productCard = e.target.closest('.card');
      if(productCard){
        const clone = productCard.cloneNode(true);
        const rect = productCard.getBoundingClientRect();
        clone.style.position='fixed';
        clone.style.left=rect.left+'px';
        clone.style.top=rect.top+'px';
        clone.style.width=rect.width+'px';
        clone.style.height=rect.height+'px';
        clone.style.transition='all 0.8s ease-in-out';
        clone.style.zIndex=4000;
        document.body.appendChild(clone);
        setTimeout(()=>{
          clone.style.left = (cartIcon.getBoundingClientRect().left)+'px';
          clone.style.top = (cartIcon.getBoundingClientRect().top)+'px';
          clone.style.width='0px';
          clone.style.height='0px';
          clone.style.opacity=0;
        },50);
        setTimeout(()=> document.body.removeChild(clone),900);
      }
    });
  });

  // ======================
  // READY FOR MORE HIGH-END FEATURES
  // ======================
  console.log("DelivZone High-End JS loaded ✅");
});