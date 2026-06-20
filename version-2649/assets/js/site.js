(function() {
  var toggle = document.querySelector("[data-menu-toggle]");
  var panel = document.querySelector("[data-mobile-panel]");

  if (toggle && panel) {
    toggle.addEventListener("click", function() {
      panel.classList.toggle("open");
    });
  }

  document.querySelectorAll("[data-search-form]").forEach(function(form) {
    form.addEventListener("submit", function(event) {
      var input = form.querySelector("input[name='q']");
      if (!input || !input.value.trim()) {
        event.preventDefault();
      }
    });
  });

  var hero = document.querySelector("[data-hero-slider]");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var index = 0;

    function show(next) {
      if (!slides.length) {
        return;
      }
      index = (next + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }

    dots.forEach(function(dot) {
      dot.addEventListener("click", function() {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
      });
    });

    window.setInterval(function() {
      show(index + 1);
    }, 5600);
  }

  document.querySelectorAll("[data-filter-section]").forEach(function(section) {
    var textInput = section.querySelector("[data-filter-text]");
    var yearSelect = section.querySelector("[data-filter-year]");
    var typeSelect = section.querySelector("[data-filter-type]");
    var cards = Array.prototype.slice.call(section.querySelectorAll(".movie-card"));

    function applyFilter() {
      var keyword = textInput ? textInput.value.trim().toLowerCase() : "";
      var year = yearSelect ? yearSelect.value : "";
      var type = typeSelect ? typeSelect.value : "";

      cards.forEach(function(card) {
        var text = [
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-keywords")
        ].join(" ").toLowerCase();
        var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchYear = !year || card.getAttribute("data-year") === year;
        var matchType = !type || card.getAttribute("data-type") === type;
        card.classList.toggle("is-filter-hidden", !(matchKeyword && matchYear && matchType));
      });
    }

    [textInput, yearSelect, typeSelect].forEach(function(item) {
      if (item) {
        item.addEventListener("input", applyFilter);
        item.addEventListener("change", applyFilter);
      }
    });
  });
}());
