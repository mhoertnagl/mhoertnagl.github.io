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
    this.documentHeight = document.body.scrollHeight - document.body.clientHeight;
    this.documentWidth = document.body.scrollWidth;
    console.log(`Height: ${this.documentHeight}, Width: ${this.documentWidth}`);
  }

  updateProgress(scrollPos) {
    const factor = Math.min(scrollPos / this.documentHeight, 1);
    const width = factor * this.documentWidth + 'px';
    this.progress.style.width = width;
    console.log(scrollPos);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ProgressBar('article-progess');
});
