function initMoviePlayer(videoId, overlayId, mediaUrl) {
  var video = document.getElementById(videoId);
  var overlay = document.getElementById(overlayId);
  if (!video || !overlay || !mediaUrl) {
    return;
  }

  var loaded = false;

  function bind() {
    if (loaded) {
      return;
    }
    loaded = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = mediaUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true });
      hls.loadSource(mediaUrl);
      hls.attachMedia(video);
      video.hlsController = hls;
    } else {
      video.src = mediaUrl;
    }
    video.setAttribute("controls", "controls");
  }

  function play() {
    bind();
    overlay.classList.add("is-hidden");
    var result = video.play();
    if (result && typeof result.catch === "function") {
      result.catch(function () {
        overlay.classList.remove("is-hidden");
      });
    }
  }

  overlay.addEventListener("click", play);
  video.addEventListener("click", function () {
    if (video.paused) {
      play();
    }
  });
}
