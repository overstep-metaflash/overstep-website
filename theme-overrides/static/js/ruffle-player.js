/* Load each animation once on opening the page, sharing the self-hosted runtime. */
(() => {
  const siteRoot = new URL("../", document.currentScript.src);
  const runtimeUrl = new URL("../vendor/ruffle/0.7.1/ruffle.js", document.currentScript.src);
  let runtimePromise;
  const routePromises = new Map();
  const instances = new WeakMap();
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
  function navigationRoutes(path, install) {
    if (!routePromises.has(path)) {
      const promise = fetch(new URL(path, siteRoot))
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
          if (install) installMenuNavigation(routes);
          return routes;
        });
      routePromises.set(path, promise);
    }
    return routePromises.get(path);
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
    const instance = {};
    instances.set(container, instance);
    container.dataset.loaded = "true";
    const status = container.querySelector(".flash-status");
    try {
      const ruffle = await runtime();
      const navigation = container.dataset.kind === "navigation";
      const map = navigation ? "theme/step/menu-links.json" : container.dataset.rewriteMap;
      const routes = map ? await navigationRoutes(map, navigation) : null;
      if (instances.get(container) !== instance) return;
      const player = ruffle.createPlayer();
      instance.player = player;
      container.querySelector(".flash-player").appendChild(player);
      const api = player.ruffle();
      await api.load({
        url: container.dataset.swf,
        ...(container.dataset.base ? { base: container.dataset.base } : {}),
        autoplay: "on",
        splashScreen: false,
        unmuteOverlay: "visible",
        allowScriptAccess: false,
        urlRewriteRules: routes ? [...routes] : [],
        showSwfDownload: false,
        wmode: container.dataset.kind === "navigation" ? "transparent" : "window",
        allowFullscreen: container.dataset.fullscreen === "true",
      });
      if (instances.get(container) !== instance) return;
      container.dataset.ready = "true";
      status.hidden = true;
    } catch (error) {
      if (instances.get(container) !== instance) return;
      status.textContent = "L’animation n’a pas pu être chargée.";
      console.error("Unable to load animation", container.dataset.swf, error);
    }
  }
  function unload(container) {
    const instance = instances.get(container);
    instances.delete(container);
    instance?.player?.remove();
    delete container.dataset.loaded;
    delete container.dataset.ready;
  }
  window.StepFlash = { load, unload };
  const containers = document.querySelectorAll(".flash-animation");
  containers.forEach(load);
})();
