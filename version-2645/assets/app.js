(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function initMenu() {
        var toggle = document.querySelector('.menu-toggle');
        var panel = document.querySelector('.mobile-panel');
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener('click', function () {
            panel.classList.toggle('open');
        });
    }

    function initHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        var prev = hero.querySelector('.hero-prev');
        var next = hero.querySelector('.hero-next');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        function play() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                play();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                play();
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-target') || '0'));
                play();
            });
        });
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', play);
        show(0);
        play();
    }

    function textOf(card) {
        return [
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-year'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-tags'),
            card.getAttribute('data-category')
        ].join(' ').toLowerCase();
    }

    function initFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
        panels.forEach(function (panel) {
            var list = panel.parentElement.querySelector('[data-card-list]');
            var empty = panel.parentElement.querySelector('[data-empty-state]');
            if (!list) {
                return;
            }
            var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card, .rank-row'));
            var keyword = panel.querySelector('.filter-keyword');
            var type = panel.querySelector('.filter-type');
            var region = panel.querySelector('.filter-region');
            var genre = panel.querySelector('.filter-genre');
            var reset = panel.querySelector('.filter-reset');

            function value(input) {
                return input ? input.value.trim().toLowerCase() : '';
            }

            function apply() {
                var q = value(keyword);
                var t = value(type);
                var r = value(region);
                var g = value(genre);
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = textOf(card);
                    var ok = true;
                    if (q && haystack.indexOf(q) === -1) {
                        ok = false;
                    }
                    if (t && String(card.getAttribute('data-type') || '').toLowerCase() !== t) {
                        ok = false;
                    }
                    if (r && String(card.getAttribute('data-region') || '').toLowerCase() !== r) {
                        ok = false;
                    }
                    if (g && String(card.getAttribute('data-genre') || '').toLowerCase().indexOf(g) === -1) {
                        ok = false;
                    }
                    card.classList.toggle('hidden-by-filter', !ok);
                    if (ok) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle('show', visible === 0);
                }
            }

            [keyword, type, region, genre].forEach(function (input) {
                if (!input) {
                    return;
                }
                input.addEventListener('input', apply);
                input.addEventListener('change', apply);
            });
            if (reset) {
                reset.addEventListener('click', function () {
                    [keyword, type, region, genre].forEach(function (input) {
                        if (input) {
                            input.value = '';
                        }
                    });
                    apply();
                });
            }
            apply();
        });
    }

    function initSearchPage() {
        var box = document.querySelector('[data-search-results]');
        if (!box || !window.movieSearchData) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var query = (params.get('q') || '').trim();
        var input = document.getElementById('searchInput');
        if (input) {
            input.value = query;
        }
        if (!query) {
            box.innerHTML = '<div class="empty-state show">输入关键词后开始搜索</div>';
            return;
        }
        var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
        var results = window.movieSearchData.filter(function (item) {
            var haystack = [item.title, item.year, item.region, item.type, item.genre, item.category, item.oneLine, (item.tags || []).join(' ')].join(' ').toLowerCase();
            return terms.every(function (term) {
                return haystack.indexOf(term) !== -1;
            });
        }).slice(0, 120);
        if (!results.length) {
            box.innerHTML = '<div class="empty-state show">没有找到匹配的影片</div>';
            return;
        }
        box.innerHTML = results.map(function (item) {
            return '<article class="search-item">' +
                '<a href="' + item.url + '"><img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy"></a>' +
                '<div class="search-item-content">' +
                '<div class="card-meta"><span>' + escapeHtml(item.type) + '</span><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.region) + '</span></div>' +
                '<h2><a href="' + item.url + '">' + escapeHtml(item.title) + '</a></h2>' +
                '<p>' + escapeHtml(item.oneLine) + '</p>' +
                '<a class="text-link" href="' + item.url + '">查看详情</a>' +
                '</div>' +
                '</article>';
        }).join('');
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"]/g, function (char) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;'
            }[char];
        });
    }

    function initPlayer() {
        var player = document.querySelector('[data-player]');
        if (!player) {
            return;
        }
        var video = player.querySelector('video');
        var button = player.querySelector('.player-start');
        if (!video || !button) {
            return;
        }
        var stream = video.getAttribute('data-stream');
        var hlsInstance = null;
        var prepared = false;

        function prepare() {
            if (prepared || !stream) {
                return;
            }
            prepared = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
            } else {
                video.src = stream;
            }
        }

        function start() {
            prepare();
            player.classList.add('playing');
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    player.classList.remove('playing');
                });
            }
        }

        button.addEventListener('click', start);
        video.addEventListener('play', function () {
            player.classList.add('playing');
        });
        video.addEventListener('pause', function () {
            if (video.currentTime === 0 || video.ended) {
                player.classList.remove('playing');
            }
        });
        video.addEventListener('click', function () {
            prepare();
        });
        prepare();

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    ready(function () {
        initMenu();
        initHero();
        initFilters();
        initSearchPage();
        initPlayer();
    });
}());
