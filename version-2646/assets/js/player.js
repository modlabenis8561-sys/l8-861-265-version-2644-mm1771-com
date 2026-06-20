import { H as Hls } from './video-vendor-dru42stk.js';

var shell = document.querySelector('[data-player]');

if (shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('[data-play-button]');
    var source = shell.getAttribute('data-source');
    var hls = null;

    var start = function () {
        if (!video || !source) {
            return;
        }

        if (button) {
            button.classList.add('hidden');
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            if (!video.getAttribute('src')) {
                video.src = source;
            }
            video.play().catch(function () {});
            return;
        }

        if (Hls && Hls.isSupported()) {
            if (!hls) {
                hls = new Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(source);
                hls.attachMedia(video);
            }
            video.play().catch(function () {});
            return;
        }

        if (!video.getAttribute('src')) {
            video.src = source;
        }
        video.play().catch(function () {});
    };

    if (button) {
        button.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            start();
        }
    });
}
