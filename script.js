document.fonts.ready.then(function() {
  var sk = document.getElementById('skeleton');
  if (sk) {
    sk.style.opacity = '0';
    setTimeout(function() { sk.style.display = 'none'; }, 400);
  }
});

function switchTab(tab, el) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
    el.classList.add('active');
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
