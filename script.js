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

/* === TRACKER LOGIC === */
function initTracker() {
  const cards = document.querySelectorAll('.lift-card');
  
  cards.forEach(card => {
    const liftName = card.querySelector('.lift-name').innerText;
    const weightInput = card.querySelector('input[placeholder="0"]'); 
    const repsInput = card.querySelectorAll('input')[1]; 
    const logBtn = card.querySelector('.log-btn');
    const statusLine = card.querySelector('.status-line');
    const target = parseInt(card.getAttribute('data-target'));

    const savedData = JSON.parse(localStorage.getItem(`ppl_tracker_${liftName}`));
    if (savedData) {
      weightInput.value = savedData.weight || '';
      repsInput.value = savedData.reps || '';
      updateStatus(parseInt(savedData.reps) || 0, target, statusLine);
    }

    logBtn.addEventListener('click', () => {
      const weight = weightInput.value;
      const reps = parseInt(repsInput.value) || 0;
      localStorage.setItem(`ppl_tracker_${liftName}`, JSON.stringify({ weight, reps }));
      updateStatus(reps, target, statusLine);
    });
  });
}

function updateStatus(reps, target, el) {
  if (reps >= target) {
    el.innerText = "✓ Ready to progress — add 2.5 kg next session";
    el.classList.add('status-success');
  } else {
    el.innerText = "Keep this weight — hit all reps first";
    el.classList.remove('status-success');
  }
}

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

/* === NEXT EXERCISE BUTTONS === */
function initNextExButtons() {
  const cards = document.querySelectorAll('.exercise-card');
  cards.forEach(card => {
    // Inject button
    const btn = document.createElement('button');
    btn.className = 'next-ex-btn';
    btn.innerText = 'NEXT EXERCISE';
    card.appendChild(btn);

    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Don't trigger card highlight toggle
      
      const container = card.closest('.exercises-container');
      const allInContainer = Array.from(container.querySelectorAll('.exercise-card'));
      const currentIndex = allInContainer.indexOf(card);
      const nextCard = allInContainer[currentIndex + 1];

      // Deactivate all highlights
      document.querySelectorAll('.exercise-card').forEach(c => {
        c.classList.remove('active-ex', 'dimmed');
      });

      if (nextCard) {
        // Activate next
        nextCard.classList.add('active-ex');
        // Dim others
        document.querySelectorAll('.exercise-card').forEach(c => {
          if (c !== nextCard) c.classList.add('dimmed');
        });
        // Scroll to next
        nextCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTracker();
  initHighlighting();
  initNextExButtons();
});

if (document.readyState === "complete" || document.readyState === "interactive") {
  initTracker();
  initHighlighting();
  initNextExButtons();
}
