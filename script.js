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

// Dropdown logic for What / Why / How
const expButtons = document.querySelectorAll('.exp-btn');
expButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const content = btn.nextElementSibling;
    content.classList.toggle('show');
    btn.classList.toggle('active');
  });
});

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);












