(function () {
  var toggles = document.querySelectorAll('[data-menu-toggle]');
  toggles.forEach(function (button) {
    button.addEventListener('click', function () {
      var menu = document.querySelector('[data-menu]');
      if (menu) {
        menu.classList.toggle('open');
      }
    });
  });

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var current = 0;
    var show = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    };
    var next = function () {
      show(current + 1);
    };
    var timer = window.setInterval(next, 5000);
    hero.querySelectorAll('[data-hero-next]').forEach(function (button) {
      button.addEventListener('click', function () {
        window.clearInterval(timer);
        next();
        timer = window.setInterval(next, 5000);
      });
    });
    hero.querySelectorAll('[data-hero-prev]').forEach(function (button) {
      button.addEventListener('click', function () {
        window.clearInterval(timer);
        show(current - 1);
        timer = window.setInterval(next, 5000);
      });
    });
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        window.clearInterval(timer);
        show(index);
        timer = window.setInterval(next, 5000);
      });
    });
    show(0);
  }

  var filterInput = document.querySelector('.page-filter');
  if (filterInput) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card, .rank-item'));
    var empty = document.querySelector('[data-empty]');
    filterInput.addEventListener('input', function () {
      var value = filterInput.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var match = !value || text.indexOf(value) !== -1;
        card.classList.toggle('hidden-by-filter', !match);
        if (match) {
          visible += 1;
        }
      });
      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    });
  }

  if (document.querySelector('[data-search-results]') && window.SEARCH_INDEX) {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();
    var input = document.querySelector('[data-search-input]');
    var results = document.querySelector('[data-search-results]');
    var title = document.querySelector('[data-search-title]');
    if (input) {
      input.value = query;
    }
    var render = function (items) {
      if (!results) {
        return;
      }
      if (!items.length) {
        results.innerHTML = '<div class="empty-results">未找到相关影片，请尝试其他关键词。</div>';
        return;
      }
      results.innerHTML = items.map(function (item) {
        var tags = item.tags.slice(0, 3).map(function (tag) {
          return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');
        return '<a class="movie-card" href="' + item.href + '" data-search="">' +
          '<div class="poster-wrap">' +
          '<img src="./' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
          '<div class="poster-shade"></div><div class="play-badge">▶</div>' +
          '<span class="year-badge">' + item.year + '</span></div>' +
          '<div class="card-info"><h3>' + escapeHtml(item.title) + '</h3>' +
          '<p>' + escapeHtml(item.oneLine) + '</p>' +
          '<div class="card-meta"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.type) + '</span></div>' +
          '<div class="tag-row">' + tags + '</div></div></a>';
      }).join('');
    };
    var runSearch = function () {
      var q = (input ? input.value : query).trim().toLowerCase();
      var items = window.SEARCH_INDEX.filter(function (item) {
        return !q || item.text.indexOf(q) !== -1;
      }).slice(0, 200);
      if (title) {
        title.textContent = q ? '搜索：' + q : '全站搜索';
      }
      render(items);
    };
    var form = document.querySelector('[data-search-form]');
    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        runSearch();
      });
    }
    runSearch();
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  window.setupMoviePlayer = function (source) {
    var video = document.querySelector('[data-player-video]');
    var cover = document.querySelector('[data-player-cover]');
    var loaded = false;
    var hls = null;
    var start = function () {
      if (cover) {
        cover.style.display = 'none';
      }
      if (!loaded) {
        loaded = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls();
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }
      }
      var play = video.play();
      if (play && typeof play.catch === 'function') {
        play.catch(function () {});
      }
    };
    if (cover && video) {
      cover.addEventListener('click', start);
      video.addEventListener('click', function () {
        if (video.paused) {
          start();
        }
      });
    }
    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
