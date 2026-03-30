document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const heroWrapper = document.querySelector('.hero-wrapper');
  const mainTitle = document.getElementById('main-title');
  const toggleBtn = document.getElementById('toggle-gravity');
  
  let isZeroG = false;

  // Mouse Parallax for Hero Background
  window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const xPos = (clientX - window.innerWidth / 2) / 50;
    const yPos = (clientY - window.innerHeight / 2) / 50;

    heroWrapper.style.transform = `scale(1.1) translate(${xPos}px, ${yPos}px)`;
    
    // Slight shift to title
    mainTitle.style.transform = `translate(${xPos * 0.5}px, ${yPos * 0.5}px)`;
  });

  // Antigravity Toggle
  toggleBtn.addEventListener('click', () => {
    isZeroG = !isZeroG;
    
    if (isZeroG) {
        toggleBtn.textContent = 'RESTORE GRAVITY';
        toggleBtn.style.background = 'linear-gradient(135deg, #ef4444, #f59e0b)';
        
        cards.forEach((card, i) => {
           // Cards start floating randomly
           card.style.transition = 'all 4s ease-in-out';
           const randX = (Math.random() - 0.5) * 100;
           const randY = -150 - (Math.random() * 100);
           const randRot = (Math.random() - 0.5) * 30;
           
           card.style.transform = `translate(${randX}px, ${randY}px) rotate(${randRot}deg)`;
           card.classList.remove('animate-float'); // Stop default float
        });
        
        document.body.style.backgroundColor = '#020617';
    } else {
        toggleBtn.textContent = 'DEFY GRAVITY';
        toggleBtn.style.background = 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))';
        
        cards.forEach((card) => {
           card.style.transform = `translate(0, 0) rotate(0deg)`;
           card.classList.add('animate-float');
        });
        
        document.body.style.backgroundColor = 'var(--bg-dark)';
    }
  });

  // Card Hover Tilt
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if (isZeroG) return; // Disable tilt in zero-G for now or adjust it
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (centerY - y) / 10;
        const rotateY = (x - centerX) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        if (isZeroG) return;
        card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
    });
  });

  console.log("%c Antigravity Status: ACTIVE ", "background: #8b5cf6; color: white; padding: 4px; border-radius: 4px; font-weight: bold;");
});
