if (window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches) {
  document.addEventListener('dblclick', function(event) {
    if (event.target.closest('.conversation') !== null) {
      const content = event.target.closest('.conversation');
      const currentScale = window.getComputedStyle(content).transform;
      const scaleMatrix = new WebKitCSSMatrix(currentScale);
      const scaleX = scaleMatrix.a;
      const scaleY = scaleMatrix.d;

      if (scaleX === 1 && scaleY === 1) {
        content.style.transform = "scaleX(1.2) scaleY(1.2)";
        content.classList.add("enlarged");
      } else {
        content.style.transform = "scaleX(1) scaleY(1)";
        content.classList.remove("enlarged");
      }
    }
  });
}