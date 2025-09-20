const cards = document.querySelectorAll('.card');
const highlightCards = document.querySelectorAll('.highlight-item');

function revealOnScroll() {
  const triggerBottom = window.innerHeight * 0.85;

  cards.forEach(card => {
    const cardTop = card.getBoundingClientRect().top;
    if (cardTop < triggerBottom) card.classList.add('visible');
  });

  highlightCards.forEach(card => {
    const cardTop = card.getBoundingClientRect().top;
    if (cardTop < triggerBottom) card.classList.add('visible');
  });
}

// Trigger on scroll
window.addEventListener('scroll', revealOnScroll);

// Trigger on page load
window.addEventListener('load', revealOnScroll);








