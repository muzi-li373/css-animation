const container = document.getElementById('container');
const body = document.body;
const loader = document.getElementById('loader');
const DISTANCE_Y_MIN_LIMIT = 80;
const DISTANCE_Y_MAX_LIMIT = 150;
const DEG_LIMIT = 40;

let startY = 0,
  startX = 0,
  endY = 0,
  endX = 0,
  distanceY = 0,
  distanceX = 0,
  loadLock = false;

function start(e) {
  if (loadLock) return;
  startY = e.touches[0].clientY;
  startX = e.touches[0].clientX;
}

function move(e) {
  if (loadLock) return;

  endY = e.touches[0].clientY;
  endX = e.touches[0].clientX;

  if (endY - startY < 0) return;

  distanceY = endY - startY;
  distanceX = endX - startX;

  const deg = Math.atan2(distanceX, distanceY) * (180 / Math.PI);

  if (deg > DEG_LIMIT) return;

  distanceY *= Math.max(0.5, (100 - distanceY * 0.5) / 100);
  distanceY = Math.min(distanceY, DISTANCE_Y_MAX_LIMIT);

  container.style.setProperty('transform', `translateY(${distanceY}px)`);
  container.style.setProperty('transition', 'all 0.3s linear');
}

function end() {
  if (loadLock || endY - startY < 0) return;

  if (distanceY < DISTANCE_Y_MIN_LIMIT) {
    container.style.setProperty('transform', 'translateY(0px)');
    container.style.setProperty('transition', 'all 0.3s linear');
    body.className = '';
    return;
  }

  loadLock = true;

  container.style.setProperty('transform', 'translateY(80px)');
  container.style.setProperty('transition', 'all 0.3s linear');
  loader.className = 'loading';
  body.className = 'overflowHidden';

  setTimeout(() => {
    loadLock = false;
    container.style.setProperty('transform', 'translateY(0px)');
    container.style.setProperty('transition', 'all 0.3s linear');
    loader.className = '';
    body.className = '';
  }, 1000);
}

function addTouchEvent() {
  container.addEventListener('touchstart', start);
  container.addEventListener('touchmove', move);
  container.addEventListener('touchend', end);
}

addTouchEvent();
