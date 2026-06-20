(function() {
  var params = new URLSearchParams(window.location.search);
  var keyword = (params.get("q") || "").trim();
  var form = document.querySelector("[data-search-page-form]");
  var input = form ? form.querySelector("input[name='q']") : null;
  var status = document.querySelector("[data-search-status]");
  var results = document.querySelector("[data-search-results]");

  if (input) {
    input.value = keyword;
  }

  function safe(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderCard(movie) {
    return "<article class=\"movie-card\">" +
      "<a class=\"poster-link\" href=\"" + safe(movie.url) + "\" aria-label=\"观看 " + safe(movie.title) + "\">" +
      "<img src=\"" + safe(movie.cover) + "\" alt=\"" + safe(movie.title) + "\" loading=\"lazy\">" +
      "<span class=\"year-badge\">" + safe(movie.year) + "</span>" +
      "<span class=\"play-mask\"><span>▶</span></span>" +
      "</a>" +
      "<h3><a href=\"" + safe(movie.url) + "\">" + safe(movie.title) + "</a></h3>" +
      "<p>" + safe(movie.region) + " · " + safe((movie.genre || "").split(/[，,、/]/)[0]) + "</p>" +
      "</article>";
  }

  function render() {
    if (!results || !status) {
      return;
    }
    if (!keyword) {
      status.textContent = "输入关键词开始搜索";
      results.innerHTML = "";
      return;
    }
    var lower = keyword.toLowerCase();
    var matched = (window.MOVIES || []).filter(function(movie) {
      return String(movie.text || "").toLowerCase().indexOf(lower) !== -1;
    }).slice(0, 120);

    if (!matched.length) {
      status.textContent = "未找到相关影片";
      results.innerHTML = "";
      return;
    }

    status.textContent = "搜索结果";
    results.innerHTML = matched.map(renderCard).join("");
  }

  render();
}());
