(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector(".menu-toggle");
    var panel = document.getElementById("mobilePanel");
    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        var open = panel.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    var slider = document.getElementById("heroSlider");
    if (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
      var prev = slider.querySelector(".hero-prev");
      var next = slider.querySelector(".hero-next");
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("is-active", i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === index);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-slide")) || 0);
          start();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          start();
        });
      }

      slider.addEventListener("mouseenter", stop);
      slider.addEventListener("mouseleave", start);
      show(0);
      start();
    }

    var grid = document.getElementById("movieGrid");
    if (grid) {
      var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card, .rank-item"));
      var queryInput = document.getElementById("pageSearch") || document.getElementById("globalSearchInput");
      var regionFilter = document.getElementById("regionFilter");
      var typeFilter = document.getElementById("typeFilter");
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q") || "";
      if (queryInput && query) {
        queryInput.value = query;
      }

      function normalize(value) {
        return String(value || "").trim().toLowerCase();
      }

      function applyFilter() {
        var text = normalize(queryInput ? queryInput.value : "");
        var region = normalize(regionFilter ? regionFilter.value : "");
        var type = normalize(typeFilter ? typeFilter.value : "");
        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-year"),
            card.getAttribute("data-tags"),
            card.textContent
          ].join(" "));
          var regionText = normalize(card.getAttribute("data-region") || haystack);
          var tagText = normalize(card.getAttribute("data-tags") || haystack);
          var okText = !text || haystack.indexOf(text) !== -1;
          var okRegion = !region || regionText.indexOf(region) !== -1 || haystack.indexOf(region) !== -1;
          var okType = !type || tagText.indexOf(type) !== -1 || haystack.indexOf(type) !== -1;
          card.classList.toggle("is-filter-hidden", !(okText && okRegion && okType));
        });
      }

      [queryInput, regionFilter, typeFilter].forEach(function (control) {
        if (control) {
          control.addEventListener("input", applyFilter);
          control.addEventListener("change", applyFilter);
        }
      });
      applyFilter();
    }
  });
})();
