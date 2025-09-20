// Smooth scroll handled by CSS (scroll-behavior: smooth)

// Section reveal on scroll
const cards = document.querySelectorAll('.card');
window.addEventListener('scroll', () => {
  const triggerBottom = window.innerHeight * 0.85;
  cards.forEach(card => {
    const cardTop = card.getBoundingClientRect().top;
    if (cardTop < triggerBottom) {
      card.classList.add('visible');
    }
  });
});


