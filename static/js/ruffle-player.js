/* Load each animation once on opening the page, sharing the self-hosted runtime. */
(() => {
  const runtimeUrl = new URL("../vendor/ruffle/0.7.1/ruffle.js", document.currentScript.src);
  let runtimePromise;
  function runtime() {
    if (!runtimePromise) {
      runtimePromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = runtimeUrl.href;
        script.onload = () => resolve(window.RufflePlayer.newest());
        script.onerror = () => reject(new Error("Unable to load the Ruffle runtime"));
        document.head.appendChild(script);
      });
    }
    return runtimePromise;
  }
  async function load(container) {
    if (container.dataset.loaded) return;
    container.dataset.loaded = "true";
    const status = container.querySelector(".flash-status");
    try {
      const ruffle = await runtime();
      const player = ruffle.createPlayer();
      container.querySelector(".flash-player").appendChild(player);
      await player.ruffle().load({
        url: container.dataset.swf,
        autoplay: "on",
        splashScreen: false,
        unmuteOverlay: "visible",
        allowScriptAccess: false,
        showSwfDownload: false,
        wmode: container.dataset.kind === "navigation" ? "transparent" : "window",
        allowFullscreen: container.dataset.fullscreen === "true",
      });
      container.dataset.ready = "true";
      status.hidden = true;
    } catch (error) {
      status.textContent = "L’animation n’a pas pu être chargée.";
      console.error("Unable to load animation", container.dataset.swf, error);
    }
  }
  const containers = document.querySelectorAll(".flash-animation");
  containers.forEach(load);
})();
