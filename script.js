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


/* === EXERCISE HIGHLIGHTING === */
function initHighlighting() {
  const cards = document.querySelectorAll('.exercise-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.closest('button')) return;

      const container = card.closest('.exercises-container');
      if (!container) return;
      
      const allCards = Array.from(container.querySelectorAll('.exercise-card'));
      const targetIndex = allCards.indexOf(card);

      allCards.forEach((c, i) => {
        c.classList.remove('active-ex', 'done-ex', 'dimmed');
        if (i < targetIndex) c.classList.add('done-ex');
        else if (i === targetIndex) c.classList.add('active-ex');
        else c.classList.add('dimmed');
      });
      updateProgress(container);
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
    if (currentIndex === allCards.length - 1) {
      triggerCompletion(allCards.length, container);
      return;
    }
    targetCard = allCards[currentIndex + 1];
  } else if (deltaX < -50) { // Swipe Right -> Prev
    targetCard = allCards[currentIndex - 1];
  }

  if (targetCard) {
    const targetIndex = allCards.indexOf(targetCard);
    allCards.forEach((c, i) => {
      c.classList.remove('active-ex', 'done-ex', 'dimmed');
      if (i < targetIndex) c.classList.add('done-ex');
      else if (i === targetIndex) c.classList.add('active-ex');
      else c.classList.add('dimmed');
    });
    updateProgress(container);
    targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

/* === PROGRESS TRACKER === */
function updateProgress(container) {
  if (!container) return;
  const fill = container.querySelector('.day-progress-fill');
  if (!fill) return;
  
  const allCards = container.querySelectorAll('.exercise-card');
  const doneCount = container.querySelectorAll('.exercise-card.done-ex').length;
  const totalCount = allCards.length;
  
  const percentage = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;
  fill.style.width = percentage + '%';
}

document.addEventListener('DOMContentLoaded', () => {
  initHighlighting();
  initSwipeGestures();
});

if (document.readyState === "complete" || document.readyState === "interactive") {
  initHighlighting();
  initSwipeGestures();
}

/* === WORKOUT COMPLETION === */
function triggerCompletion(totalCards, container) {
  const allCards = Array.from(container.querySelectorAll('.exercise-card'));
  allCards.forEach(c => {
    c.classList.remove('active-ex', 'dimmed');
    c.classList.add('done-ex');
  });
  updateProgress(container);

  setTimeout(() => {
    const overlay = document.getElementById('workout-overlay');
    if (!overlay) return;

    const activeDayId = container.closest('.day-content').id;
    let accentColor = '#e8445a'; // Push defaults
    if (activeDayId === 'd2') accentColor = '#3ecfcf'; // Pull
    else if (activeDayId === 'd3') accentColor = '#f5a623'; // Legs

    const wcTitle = document.querySelector('.wc-title');
    const wcStat = document.getElementById('wc-stat');
    
    if (wcTitle) wcTitle.style.color = accentColor;
    if (wcStat) {
      wcStat.style.color = accentColor;
      wcStat.textContent = `${totalCards} EXERCISES COMPLETED`;
    }

    overlay.classList.add('visible');
    launchConfetti(accentColor);
    
    overlay.onclick = () => {
      overlay.classList.remove('visible');
      container.closest('.day-content').scrollIntoView({ behavior: "smooth", block: "start" });
    };

  }, 400);
}

function launchConfetti(accentColor) {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 120;
  
  const colors = [accentColor, '#ffffff', accentColor + '80'];
  
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 8;
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      w: 6,
      h: 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: angle,
      speed: speed,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      life: 90
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeParticles = 0;

    for (let i = 0; i < particleCount; i++) {
      const p = particles[i];
      if (p.life > 0) {
        activeParticles++;
        p.vy += 0.15;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        p.life--;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color;
        
        ctx.globalAlpha = p.life / 90;
        
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    }

    if (activeParticles > 0) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}
