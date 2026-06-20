(function () {
  function getQuery() {
    var params = new URLSearchParams(window.location.search);
    return (params.get("q") || "").trim();
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderCard(movie) {
    var tags = movie.tags.slice(0, 3).map(function (tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("");

    return "" +
      "<article class=\"movie-card\" data-search=\"" + escapeHtml(movie.searchText) + "\">" +
      "<a class=\"poster-link\" href=\"" + escapeHtml(movie.url) + "\" aria-label=\"观看 " + escapeHtml(movie.title) + "\">" +
      "<img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">" +
      "<span class=\"poster-play\">▶</span>" +
      "<span class=\"poster-year\">" + escapeHtml(movie.year) + "</span>" +
      "</a>" +
      "<div class=\"card-body\">" +
      "<h3><a href=\"" + escapeHtml(movie.url) + "\">" + escapeHtml(movie.title) + "</a></h3>" +
      "<p class=\"card-meta\">" + escapeHtml(movie.region) + " · " + escapeHtml(movie.type) + " · " + escapeHtml(movie.genre) + "</p>" +
      "<p class=\"card-summary\">" + escapeHtml(movie.oneLine) + "</p>" +
      "<div class=\"tag-row\">" + tags + "</div>" +
      "</div>" +
      "</article>";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var input = document.querySelector("[data-search-input]");
    var results = document.querySelector("[data-search-results]");
    var title = document.querySelector("[data-search-title]");
    var keyword = getQuery();

    if (input) {
      input.value = keyword;
    }

    if (!results || !keyword || !window.MOVIES) {
      return;
    }

    var lowered = keyword.toLowerCase();
    var matched = window.MOVIES.filter(function (movie) {
      return movie.searchText.toLowerCase().indexOf(lowered) !== -1;
    }).slice(0, 120);

    if (title) {
      title.textContent = "搜索结果：" + keyword;
    }

    if (!matched.length) {
      results.innerHTML = "<div class=\"empty-state\">没有找到匹配影片，请尝试其他关键词。</div>";
      return;
    }

    results.innerHTML = matched.map(renderCard).join("");
  });
})();
