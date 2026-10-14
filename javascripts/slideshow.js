// Conferences page slideshow: cross-fades through the photos one at a time.
// Each photo is downloaded only just before it is shown, and the show pauses
// while the tab is hidden.
(function () {
  var photos = [];
  for (var n = 1; n <= 9; n++) photos.push("pictures/slides/cep" + n + ".jpg");

  var box = document.querySelector(".slideshow");
  if (!box) return;
  var shown = box.querySelector(".slide:not(.next)");
  var hidden = box.querySelector(".slide.next");
  var index = 0;
  var delay = 3500;
  var timer = null;

  function load(src) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = img.onerror = function () { resolve(src); };
      img.src = src;
    });
  }

  function advance() {
    var nextIndex = (index + 1) % photos.length;
    load(photos[nextIndex]).then(function (src) {
      hidden.src = src;
      // wait for the photo to be decoded so the fade is smooth, but never more than 400ms
      var decoded = hidden.decode ? hidden.decode().catch(function () {}) : Promise.resolve();
      var timeout = new Promise(function (resolve) { setTimeout(resolve, 400); });
      return Promise.race([decoded, timeout]);
    }).then(function () {
      // fade the new photo in on top, then swap roles
      hidden.classList.add("visible");
      setTimeout(function () {
        shown.src = hidden.src;
        hidden.classList.remove("visible");
        index = nextIndex;
        schedule();
      }, 900);
    });
  }

  function schedule() {
    clearTimeout(timer);
    if (!document.hidden) timer = setTimeout(advance, delay);
  }

  document.addEventListener("visibilitychange", schedule);

  // people who ask their system for reduced motion get no automatic slideshow
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  schedule();
})();
