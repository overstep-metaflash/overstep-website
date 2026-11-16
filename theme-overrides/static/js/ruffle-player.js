/* Load each animation once on opening the page, sharing the self-hosted runtime. */
(() => {
  const siteRoot = new URL("../", document.currentScript.src);
  const runtimeUrl = new URL("../vendor/ruffle/0.7.1/ruffle.js", document.currentScript.src);
  let runtimePromise;
  let navigationPromise;
  function installMenuNavigation(routes) {
    const destinations = new Map(routes);
    for (const destination of routes.values()) destinations.set(destination, destination);
    const open = window.open;
    window.open = function (...args) {
      const [url, target] = args;
      const destination = destinations.get(String(url));
      if (target === "_blank" && destination) {
        window.location.assign(destination);
        return window;
      }
      return open.apply(window, args);
    };
  }
  function navigationRoutes() {
    if (!navigationPromise) {
      navigationPromise = fetch(new URL("theme/step/menu-links.json", siteRoot))
        .then(response => {
          if (!response.ok) throw new Error("Unable to load reviewed menu destinations");
          return response.json();
        })
        .then(links => new Map(links.flatMap(link => {
          const target = link.destination.startsWith("/")
            ? new URL(link.destination.slice(1), siteRoot).href : link.destination;
          return [...new Set([link.legacy, link.legacy.replace(/^http:/, "https:")])]
            .map(source => [source, target]);
        })))
        .then(routes => {
          installMenuNavigation(routes);
          return routes;
        });
    }
    return navigationPromise;
  }
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
      const api = player.ruffle();
      const routes = container.dataset.kind === "navigation" ? await navigationRoutes() : null;
      await api.load({
        url: container.dataset.swf,
        autoplay: "on",
        splashScreen: false,
        unmuteOverlay: "visible",
        allowScriptAccess: false,
        urlRewriteRules: routes ? [...routes] : [],
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
