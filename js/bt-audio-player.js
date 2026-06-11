let currentAudio = null;
let currentIcon = null;

document.querySelectorAll(".bt-audioplayer").forEach(player => {
    
    let isDragging = false;

    player.innerHTML = `
    <audio class="bt-audio"></audio>

    <div class="bt-track-info">

        <div class="bt-time-row">

            <div class="bt-play-button">
                <span class="bt-icon"></span>
            </div>

            <div class="bt-progress-bar">
                <div class="bt-progress-fill"></div>
            </div>
            <span class="bt-time-display">
                <span class="bt-current-time">0:00</span>
                /
                <span class="bt-duration">0:00</span>
            </span>
            <div class="bt-volume-control">
                <span class="bt-volume-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" style="color: currentColor;" width="64" height="64" viewBox="0 0 24 24">
                        <g fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.08 9H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h.08a2 2 0 0 1 1.519.698l3.642 4.25c.604.704 1.759.277 1.759-.651V4.703c0-.928-1.155-1.355-1.76-.65L6.6 8.301A2 2 0 0 1 5.08 9zm13.556-4.725a1 1 0 1 0-1.377 1.45c3.655 3.472 3.655 9.078 0 12.55a1 1 0 1 0 1.377 1.45c4.485-4.26 4.485-11.19 0-15.45zm-2.947 2.8a1 1 0 1 0-1.378 1.45c2.027 1.925 2.027 5.025 0 6.95a1 1 0 1 0 1.378 1.45c2.857-2.714 2.857-7.136 0-9.85z"
                        fill="currentColor">
                            </path>
                        </g>
                    </svg>

                </span>

                <input
                    type="range"
                    class="bt-volume-slider"
                    min="0"
                    max="1"
                    step="0.01"
                    value="0.75">
            </div>
        </div>
        <div class="bt-track-text">
            <span class="bt-title"></span>
            <span class="bt-separator"> — </span>
            <span class="bt-artist"></span>
        </div>
    </div>
</div>
`;

    const audio = player.querySelector(".bt-audio");
    const icon = player.querySelector(".bt-icon");
    const title = player.querySelector(".bt-title");
    console.log("title =", title);
    const artist = player.querySelector(".bt-artist");
    console.log("artist =", artist);
    const trackText = player.querySelector(".bt-track-text");
    const button = player.querySelector(".bt-play-button");
    const progressFill = player.querySelector(".bt-progress-fill");
    const currentTimeElement = player.querySelector(".bt-current-time");
    const durationElement = player.querySelector(".bt-duration");
    const progressBar = player.querySelector(".bt-progress-bar");
    const volumeSlider = player.querySelector(".bt-volume-slider");
    const volumeControl = player.querySelector(".bt-volume-control");

title.textContent =
    player.dataset.title || "Titre";
artist.textContent =
    player.dataset.artist || "Artiste";

    if (
    player.dataset.showcredits === "false"
) {
    trackText.style.display = "none";
}
    audio.src = player.dataset.audio;
    audio.volume = volumeSlider.value;

const playSVG = `
<svg viewBox="0 0 24 24" width="100%" height="100%">
        <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M10 18a8 8 0 1 0 0-16a8 8 0 0 0 0 16M9.555 7.168A1 1 0 0 0 8 8v4a1 1 0 0 0 1.555.832l3-2a1 1 0 0 0 0-1.664z"/>
    </svg>`;

const pauseSVG = `
<svg viewBox="0 0 24 24" width="100%" height="100%">
    <path fill="currentColor"
        fill-rule="evenodd"
        d="M10 18a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1zm7 0a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1z"/>
</svg>`;
    icon.innerHTML = playSVG;

    function updateProgress(clientX) {
        if (!audio.duration) return;

            const rect = progressBar.getBoundingClientRect();

            let percentage =
            (clientX - rect.left) / rect.width;

            percentage = Math.max(0, Math.min(1, percentage));

            audio.currentTime =
            percentage * audio.duration;

            progressFill.style.width =
            (percentage * 100) + "%";
    
            currentTimeElement.textContent =
            formatTime(audio.currentTime);
        }
        
    button.addEventListener("click", function() {

        if (audio.paused) {

        if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();

            if (currentIcon) {
                currentIcon.innerHTML = playSVG;
            }
        }

    audio.play().then(() => {
        icon.innerHTML = pauseSVG;

        currentAudio = audio;
        currentIcon = icon;

    }).catch(error => {
        console.log(error);
    });

    } else {

    audio.pause();
    icon.innerHTML = playSVG;

    if (currentAudio === audio) {
        currentAudio = null;
        currentIcon = null;
    }
}
    });

audio.addEventListener("timeupdate", function() {
    if (isDragging) return;
    if (!audio.duration) return;

    const percentage =
        (audio.currentTime / audio.duration) * 100;

    progressFill.style.width = percentage + "%";
    currentTimeElement.textContent =
        formatTime(audio.currentTime);
});
    function formatTime(seconds) {
    const minutes =Math.floor(seconds / 60);
    const remainingSeconds =Math.floor(seconds % 60);
    return (minutes + ":" + remainingSeconds.toString().padStart(2, "0"));
}

volumeSlider.addEventListener("input", function() {
    audio.volume = volumeSlider.value;
});

volumeControl.addEventListener("click", (event) => {

    event.stopPropagation();

    document
        .querySelectorAll(".bt-volume-control")
        .forEach(el => el.classList.remove("open"));

    volumeControl.classList.add("open");
});

audio.addEventListener("loadedmetadata", function() {
    durationElement.textContent =formatTime(audio.duration);
        });

progressBar.addEventListener("click", function(event) {
    updateProgress(event.clientX);
});

progressBar.addEventListener("mousedown", function(event) {
    isDragging = true;
    progressBar.classList.add("dragging");
    updateProgress(event.clientX);
});

document.addEventListener("mousemove", function(event) {
    if (!isDragging) return;
    updateProgress(event.clientX);
});

document.addEventListener("mouseup", function() {
    isDragging = false;
    progressBar.classList.remove("dragging");
});
progressBar.addEventListener("touchstart", function(event) {
    isDragging = true;
    progressBar.classList.add("dragging");
    updateProgress(event.touches[0].clientX);
});

document.addEventListener("touchmove", function(event) {
    if (!isDragging) return;
    event.preventDefault();
    updateProgress(event.touches[0].clientX);
},{ passive: false });

document.addEventListener("touchend", function() {
    isDragging = false;
    progressBar.classList.remove("dragging");
});

audio.addEventListener("ended", function() {
    icon.innerHTML = playSVG;
    audio.currentTime = 0;
    progressFill.style.width = "0%";
    currentTimeElement.textContent = "0:00";

    if (currentAudio === audio) {
        currentAudio = null;
        currentIcon = null;
    }
        });
document.addEventListener("click", (event) => {

    const control =
        event.target.closest(".bt-volume-control");

    document
        .querySelectorAll(".bt-volume-control")
        .forEach(el =>
            el.classList.remove("open")
        );

    if (control) {
        control.classList.add("open");
    }
});
});
