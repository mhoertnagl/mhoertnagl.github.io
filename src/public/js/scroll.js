let progress = document.getElementById('article-progess');
let documentHeight = document.body.scrollHeight;
let documentWidth = document.body.scrollWidth;
let lastKnownScrollPosition = 0;
let ticking = false;

function updateProgress(scrollPos) {
  const factor = Math.min(scrollPos / documentHeight, 1);
  const width = factor * documentWidth + 'px';
  progress.style.width = width;
}

document.addEventListener('scroll', function(e) {
  lastKnownScrollPosition = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(function() {
      updateProgress(lastKnownScrollPosition);
      ticking = false;
    });

    ticking = true;
  }
});

window.addEventListener('resize', function () {
  documentWidth = document.body.scrollWidth;
  updateProgress(lastKnownScrollPosition);
});