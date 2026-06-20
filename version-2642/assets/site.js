
(function () {
    function $(selector, root) {
        return (root || document).querySelector(selector);
    }

    function $all(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function text(value) {
        return String(value || '').replace(/[&<>"]/g, function (match) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;'
            }[match];
        });
    }

    function setupMenu() {
        var button = $('[data-menu-toggle]');
        var panel = $('[data-mobile-panel]');
        if (!button || !panel) {
            return;
        }
        button.addEventListener('click', function () {
            panel.classList.toggle('open');
            document.body.classList.toggle('menu-open', panel.classList.contains('open'));
        });
    }

    function setupHero() {
        var carousel = $('[data-hero-carousel]');
        if (!carousel) {
            return;
        }
        var slides = $all('[data-hero-slide]', carousel);
        var dots = $all('[data-hero-dot]', carousel);
        var prev = $('[data-hero-prev]', carousel);
        var next = $('[data-hero-next]', carousel);
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                restart();
            });
        });
        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                restart();
            });
        }
        if (slides.length > 1) {
            restart();
        }
    }

    function setupSearch() {
        var results = $('#searchResults');
        if (!results || !window.MOVIES) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var query = (params.get('q') || '').trim();
        var input = $('#searchInput');
        var title = $('#searchTitle');
        var info = $('#searchInfo');
        if (input) {
            input.value = query;
        }
        if (!query) {
            results.innerHTML = '';
            return;
        }
        var words = query.toLowerCase().split(/\s+/).filter(Boolean);
        var matched = window.MOVIES.filter(function (movie) {
            var haystack = [
                movie.title,
                movie.oneLine,
                movie.category,
                movie.region,
                movie.type,
                movie.year,
                movie.genre,
                (movie.tags || []).join(' ')
            ].join(' ').toLowerCase();
            return words.every(function (word) {
                return haystack.indexOf(word) !== -1;
            });
        });
        if (title) {
            title.textContent = '“' + query + '”的搜索结果';
        }
        if (info) {
            info.textContent = matched.length ? '找到 ' + matched.length + ' 部相关影片。' : '没有找到匹配影片。';
        }
        results.innerHTML = matched.slice(0, 120).map(function (movie) {
            return '<a class="movie-card" href="' + text(movie.url) + '">' +
                '<div class="movie-poster">' +
                '<img src="' + text(movie.cover) + '" alt="' + text(movie.title) + '" loading="lazy">' +
                '<span class="poster-badge">' + text(movie.category) + '</span>' +
                '<span class="poster-play">▶</span>' +
                '</div>' +
                '<div class="movie-card-body">' +
                '<h3>' + text(movie.title) + '</h3>' +
                '<p>' + text(movie.oneLine) + '</p>' +
                '<div class="movie-tags"><span>' + text(movie.type) + '</span><span>' + text(movie.genre) + '</span></div>' +
                '<div class="movie-meta"><span>' + text(movie.region) + '</span><span>' + text(movie.year) + '</span></div>' +
                '</div>' +
                '</a>';
        }).join('');
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMenu();
        setupHero();
        setupSearch();
    });
})();
