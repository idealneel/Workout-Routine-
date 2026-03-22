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
