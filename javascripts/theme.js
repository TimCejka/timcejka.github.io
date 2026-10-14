// Dark mode button. The page's <head> applies a saved choice before the page draws;
// this file wires up the button and remembers the choice for next time.
(function () {
  var root = document.documentElement;
  var button = document.getElementById("theme-toggle");
  if (!button) return;

  function label() {
    var dark = root.getAttribute("data-theme") === "dark";
    button.textContent = dark ? "☀ Light" : "☾ Dark";
    button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }

  button.addEventListener("click", function () {
    var dark = root.getAttribute("data-theme") === "dark";
    if (dark) {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", "dark");
    }
    try {
      localStorage.setItem("theme", dark ? "light" : "dark");
    } catch (e) {}
    label();
  });

  label();
})();
