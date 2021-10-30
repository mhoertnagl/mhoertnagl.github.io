class ProgressBar {

  constructor(id) {
    this.progress = document.getElementById(id);
    this.lastKnownScrollPosition = 0;
    this.ticking = false;

    document.addEventListener('scroll', () => this.onScroll());
    window.addEventListener('resize', () => this.onResize());

    this.getDocumentSize();
  }

  onScroll() {
    this.lastKnownScrollPosition = window.scrollY;

    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.updateProgress(this.lastKnownScrollPosition);
        this.ticking = false;
      });

      this.ticking = true;
    }
  }

  onResize() {
    this.getDocumentSize();
    this.updateProgress(this.lastKnownScrollPosition);
  }

  getDocumentSize() {
    this.documentHeight = document.body.scrollHeight;
    this.documentWidth = document.body.scrollWidth;
  }

  updateProgress(scrollPos) {
    const factor = Math.min(scrollPos / this.documentHeight, 1);
    // Some weird failsafe. Maybe obsolete when there is a footer.
    const width = ((factor > 0.97) ? 1 : factor) * this.documentWidth + 'px';
    this.progress.style.width = width;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  new ProgressBar('article-progess');
});
