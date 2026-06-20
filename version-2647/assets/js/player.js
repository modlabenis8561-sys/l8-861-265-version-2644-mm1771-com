import { H as Hls } from "./video-vendor.js";

function setStatus(statusNode, message, hidden) {
  if (!statusNode) {
    return;
  }

  statusNode.textContent = message;
  statusNode.classList.toggle("is-hidden", Boolean(hidden));
}

function startPlayback(video, overlay, statusNode) {
  if (!video) {
    return;
  }

  if (overlay) {
    overlay.classList.add("is-hidden");
  }

  var playPromise = video.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(function () {
      if (overlay) {
        overlay.classList.remove("is-hidden");
      }
      setStatus(statusNode, "点击播放按钮开始播放", false);
    });
  }
}

function initPlayer(shell) {
  var video = shell.querySelector("video");
  var overlay = shell.querySelector("[data-play-button]");
  var statusNode = shell.querySelector("[data-video-status]");
  var source = shell.getAttribute("data-src");

  if (!video || !source) {
    setStatus(statusNode, "播放源暂不可用", false);
    return;
  }

  var hlsInstance = null;

  if (Hls && Hls.isSupported()) {
    hlsInstance = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });

    hlsInstance.loadSource(source);
    hlsInstance.attachMedia(video);

    hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
      setStatus(statusNode, "高清播放源已就绪", true);
    });

    hlsInstance.on(Hls.Events.ERROR, function (event, data) {
      if (!data || !data.fatal) {
        return;
      }

      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        setStatus(statusNode, "网络波动，正在重新加载", false);
        hlsInstance.startLoad();
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        setStatus(statusNode, "媒体异常，正在恢复播放", false);
        hlsInstance.recoverMediaError();
      } else {
        setStatus(statusNode, "播放源加载失败", false);
        hlsInstance.destroy();
      }
    });
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = source;
    video.addEventListener("loadedmetadata", function () {
      setStatus(statusNode, "高清播放源已就绪", true);
    });
  } else {
    setStatus(statusNode, "当前浏览器不支持 HLS 播放", false);
  }

  if (overlay) {
    overlay.addEventListener("click", function () {
      startPlayback(video, overlay, statusNode);
    });
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      startPlayback(video, overlay, statusNode);
    } else {
      video.pause();
    }
  });

  video.addEventListener("play", function () {
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
  });

  video.addEventListener("pause", function () {
    if (overlay && video.currentTime === 0) {
      overlay.classList.remove("is-hidden");
    }
  });

  window.addEventListener("pagehide", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-video-player]").forEach(initPlayer);
});
