(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    function setupNavigation() {
        var button = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-main-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("open");
        });
    }

    function setupSearchForms() {
        var forms = document.querySelectorAll(".site-search");
        forms.forEach(function (form) {
            form.addEventListener("submit", function (event) {
                var input = form.querySelector("input[name='q']");
                if (!input) {
                    return;
                }
                var value = input.value.trim();
                if (value.length === 0) {
                    event.preventDefault();
                    input.focus();
                    return;
                }
                event.preventDefault();
                window.location.href = "search.html?q=" + encodeURIComponent(value);
            });
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        var previous = document.querySelector("[data-hero-prev]");
        var next = document.querySelector("[data-hero-next]");
        if (slides.length === 0) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === index);
            });
        }
        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5600);
        }
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
                restart();
            });
        });
        if (previous) {
            previous.addEventListener("click", function () {
                show(index - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                restart();
            });
        }
        show(0);
        restart();
    }

    function setupFilters() {
        var filter = document.querySelector("[data-filter]");
        if (!filter) {
            return;
        }
        var keyword = filter.querySelector("[data-filter-keyword]");
        var year = filter.querySelector("[data-filter-year]");
        var type = filter.querySelector("[data-filter-type]");
        var clear = filter.querySelector("[data-filter-clear]");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
        var empty = document.querySelector("[data-filter-empty]");
        function apply() {
            var q = keyword ? keyword.value.trim().toLowerCase() : "";
            var selectedYear = year ? year.value : "";
            var selectedType = type ? type.value : "";
            var shown = 0;
            cards.forEach(function (card) {
                var text = [
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-tags")
                ].join(" ").toLowerCase();
                var passKeyword = q === "" || text.indexOf(q) !== -1;
                var passYear = selectedYear === "" || card.getAttribute("data-year") === selectedYear;
                var cardType = card.getAttribute("data-type") || "";
                var passType = selectedType === "" || cardType.indexOf(selectedType) !== -1;
                var visible = passKeyword && passYear && passType;
                card.style.display = visible ? "" : "none";
                if (visible) {
                    shown += 1;
                }
            });
            if (empty) {
                empty.style.display = shown === 0 ? "block" : "none";
            }
        }
        [keyword, year, type].forEach(function (control) {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });
        if (clear) {
            clear.addEventListener("click", function () {
                if (keyword) {
                    keyword.value = "";
                }
                if (year) {
                    year.value = "";
                }
                if (type) {
                    type.value = "";
                }
                apply();
            });
        }
    }

    function renderSearchResults() {
        var container = document.querySelector("[data-search-results]");
        if (!container || !window.SEARCH_MOVIES) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var q = (params.get("q") || "").trim();
        var count = document.querySelector("[data-search-count]");
        var input = document.querySelector(".search-box input[name='q']");
        if (input) {
            input.value = q;
        }
        if (q.length === 0) {
            if (count) {
                count.textContent = "输入关键词后可搜索影片标题、类型、地区和标签。";
            }
            return;
        }
        var lower = q.toLowerCase();
        var results = window.SEARCH_MOVIES.filter(function (movie) {
            return [movie.title, movie.description, movie.genre, movie.region, movie.category, movie.tags].join(" ").toLowerCase().indexOf(lower) !== -1;
        }).slice(0, 120);
        if (count) {
            count.textContent = "搜索“" + q + "”找到 " + results.length + " 个相关视频";
        }
        if (results.length === 0) {
            container.innerHTML = '<div class="filter-empty" style="display:block">未找到相关视频，请尝试其他关键词。</div>';
            return;
        }
        container.innerHTML = results.map(function (movie) {
            return '' +
                '<article class="movie-card">' +
                '<a href="' + movie.url + '" class="movie-poster movie-poster-medium" aria-label="观看 ' + escapeHtml(movie.title) + '">' +
                '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
                '<span class="poster-shade"></span>' +
                '<span class="poster-play">▶</span>' +
                '<span class="poster-duration">' + escapeHtml(movie.duration) + '</span>' +
                '</a>' +
                '<div class="movie-card-body">' +
                '<h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>' +
                '<div class="movie-meta-row"><span class="pill">' + escapeHtml(movie.category) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.year) + '年</span></div>' +
                '<p class="movie-card-desc">' + escapeHtml(movie.description) + '</p>' +
                '</div>' +
                '</article>';
        }).join("");
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function setupPlayer() {
        var source = window.currentVideoSource;
        var video = document.querySelector("#movie-player");
        var overlay = document.querySelector("[data-play-overlay]");
        var status = document.querySelector("[data-player-status]");
        if (!source || !video) {
            return;
        }
        var initialized = false;
        function setStatus(text) {
            if (status) {
                status.textContent = text || "";
            }
        }
        function initialize() {
            if (initialized) {
                return;
            }
            initialized = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({ enableWorker: true });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        setStatus("视频加载失败，请稍后重试");
                    }
                });
            } else {
                video.src = source;
            }
        }
        function start() {
            initialize();
            video.controls = true;
            var playPromise = video.play();
            if (playPromise && playPromise.catch) {
                playPromise.catch(function () {
                    setStatus("点击视频区域继续播放");
                });
            }
            if (overlay) {
                overlay.classList.add("hidden");
            }
        }
        if (overlay) {
            overlay.addEventListener("click", start);
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            } else {
                video.pause();
            }
        });
        video.addEventListener("play", function () {
            setStatus("");
            if (overlay) {
                overlay.classList.add("hidden");
            }
        });
        video.addEventListener("error", function () {
            setStatus("视频加载失败，请稍后重试");
        });
    }

    ready(function () {
        setupNavigation();
        setupSearchForms();
        setupHero();
        setupFilters();
        renderSearchResults();
        setupPlayer();
    });
}());
