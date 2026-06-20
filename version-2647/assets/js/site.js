(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuToggle = document.querySelector("[data-menu-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuToggle && mobileNav) {
      menuToggle.addEventListener("click", function () {
        mobileNav.classList.toggle("open");
      });
    }

    var filterInput = document.querySelector("[data-filter-input]");
    var filterGrid = document.querySelector("[data-filter-grid]");
    var emptyState = document.querySelector("[data-empty-state]");

    if (filterInput && filterGrid) {
      filterInput.addEventListener("input", function () {
        var keyword = filterInput.value.trim().toLowerCase();
        var cards = Array.prototype.slice.call(filterGrid.querySelectorAll(".movie-card"));
        var visibleCount = 0;

        cards.forEach(function (card) {
          var haystack = (card.getAttribute("data-search") || "").toLowerCase();
          var visible = !keyword || haystack.indexOf(keyword) !== -1;
          card.hidden = !visible;
          if (visible) {
            visibleCount += 1;
          }
        });

        if (emptyState) {
          emptyState.hidden = visibleCount !== 0;
        }
      });
    }
  });
})();
