(function () {
    var movies = window.SITE_MOVIES || [];
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    var searchInput = document.getElementById('search-input');
    var liveSearch = document.getElementById('live-search');
    var typeFilter = document.getElementById('type-filter');
    var regionFilter = document.getElementById('region-filter');
    var results = document.getElementById('search-results');
    var title = document.getElementById('search-title');
    var hint = document.getElementById('search-hint');

    if (!results) {
        return;
    }

    var unique = function (name) {
        var map = {};
        movies.forEach(function (movie) {
            if (movie[name]) {
                map[movie[name]] = true;
            }
        });
        return Object.keys(map).sort();
    };

    unique('type').forEach(function (value) {
        var option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        typeFilter.appendChild(option);
    });

    unique('region').forEach(function (value) {
        var option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        regionFilter.appendChild(option);
    });

    var card = function (movie) {
        return [
            '<article class="movie-card">',
            '    <a class="poster-link" href="' + movie.url + '" aria-label="观看 ' + escapeHtml(movie.title) + '">',
            '        <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '        <span class="card-year">' + escapeHtml(movie.year) + '</span>',
            '        <span class="play-hover">▶</span>',
            '    </a>',
            '    <div class="card-body">',
            '        <h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>',
            '        <p class="card-line">' + escapeHtml(movie.oneLine) + '</p>',
            '        <div class="meta-row"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
            '    </div>',
            '</article>'
        ].join('\n');
    };

    var escapeHtml = function (value) {
        return String(value).replace(/[&<>"']/g, function (character) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[character];
        });
    };

    var render = function () {
        var keyword = ((liveSearch && liveSearch.value) || query || '').trim().toLowerCase();
        var selectedType = typeFilter.value;
        var selectedRegion = regionFilter.value;
        var filtered = movies.filter(function (movie) {
            var text = [movie.title, movie.year, movie.region, movie.type, movie.genre, movie.tags, movie.oneLine].join(' ').toLowerCase();
            if (keyword && text.indexOf(keyword) === -1) {
                return false;
            }
            if (selectedType && movie.type !== selectedType) {
                return false;
            }
            if (selectedRegion && movie.region !== selectedRegion) {
                return false;
            }
            return true;
        });
        results.innerHTML = filtered.slice(0, 180).map(card).join('\n');
        if (query) {
            title.textContent = '搜索：' + query;
            hint.textContent = '可继续用类型、地区和关键词缩小范围。';
        }
    };

    if (query && searchInput) {
        searchInput.value = query;
    }
    if (query && liveSearch) {
        liveSearch.value = query;
    }

    [liveSearch, typeFilter, regionFilter].forEach(function (element) {
        if (element) {
            element.addEventListener('input', render);
            element.addEventListener('change', render);
        }
    });

    render();
})();
