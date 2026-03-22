document.fonts.ready.then(function() {
  var sk = document.getElementById('skeleton');
  if (sk) {
    sk.style.opacity = '0';
    setTimeout(function() { sk.style.display = 'none'; }, 400);
  }
});

function switchTab(tab, el) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-tab, .mobile-nav-btn').forEach(t => t.classList.remove('active'));
    
    document.getElementById(tab).classList.add('active');
    
    // Sync all nav buttons (top and bottom) that target this tab
    document.querySelectorAll(`[onclick*="switchTab('${tab}'"]`).forEach(btn => {
      btn.classList.add('active');
    });
  }
  function switchDay(dayId, btn) {
    document.querySelectorAll('.day-content').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active-day'));
    document.getElementById(dayId).classList.add('active');
    btn.classList.add('active-day');
  }

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.exercise-card, .day-card, .principle-card').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

window.addEventListener('scroll', () => {
  const btn = document.getElementById('back-to-top');
  if (btn) btn.classList.toggle('visible', window.scrollY > 300);
});

/* === EXERCISE HIGHLIGHTING === */
function initHighlighting() {
  const cards = document.querySelectorAll('.exercise-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.closest('button')) return;

      const isActive = card.classList.contains('active-ex');
      
      cards.forEach(c => c.classList.remove('active-ex', 'dimmed'));

      if (!isActive) {
        card.classList.add('active-ex');
        cards.forEach(c => {
          if (c !== card) c.classList.add('dimmed');
        });
      }
    });
  });
}

/* === SWIPE GESTURES === */
let touchStartX = 0;
let touchEndX = 0;

function initSwipeGestures() {
  const cards = document.querySelectorAll('.exercise-card');
  cards.forEach(card => {
    card.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    card.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe(card);
    }, { passive: true });
  });
}

function handleSwipe(card) {
  const deltaX = touchStartX - touchEndX;
  if (Math.abs(deltaX) < 50) return;

  const container = card.closest('.exercises-container');
  if (!container) return;
  
  const allCards = Array.from(container.querySelectorAll('.exercise-card'));
  const currentIndex = allCards.indexOf(card);
  let targetCard = null;

  if (deltaX > 50) { // Swipe Left -> Next
    targetCard = allCards[currentIndex + 1];
  } else if (deltaX < -50) { // Swipe Right -> Prev
    targetCard = allCards[currentIndex - 1];
  }

  if (targetCard) {
    document.querySelectorAll('.exercise-card').forEach(c => {
      c.classList.remove('active-ex', 'dimmed');
    });
    targetCard.classList.add('active-ex');
    document.querySelectorAll('.exercise-card').forEach(c => {
      if (c !== targetCard) c.classList.add('dimmed');
    });
    targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initHighlighting();
  initSwipeGestures();
});

if (document.readyState === "complete" || document.readyState === "interactive") {
  initHighlighting();
  initSwipeGestures();
}
