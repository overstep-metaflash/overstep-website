/* Restore the portfolio navigation without changing the archived artwork. */
(() => {
  const siteRoot = new URL('../', document.currentScript.src);
  const root = new URL(document.currentScript.dataset?.mediaRoot || 'metaflash/', siteRoot);
  const rewriteMap = document.currentScript.dataset?.rewriteMap || 'metaflash/navigation.json';
  const dialog = document.querySelector('#metaflash-dialog');
  const viewer = document.querySelector('.metaflash-viewer');
  const title = document.querySelector('#metaflash-dialog-title');
  const imageControls = document.querySelector('.metaflash-image-controls');
  const previous = document.querySelector('[data-metaflash-previous]');
  const next = document.querySelector('[data-metaflash-next]');
  const position = document.querySelector('[data-metaflash-position]');
  let current, opener, currentImage, activeGallery, imageIndex;
  function clear() {
    if (current) window.StepFlash.unload(current);
    current = null;
    currentImage = null;
    activeGallery = null;
    imageControls.hidden = true;
    viewer.replaceChildren();
  }
  function player(movie) {
    const container = document.createElement('section');
    container.className = 'flash-animation';
    container.dataset.swf = new URL(movie.src, root).href;
    container.dataset.base = new URL('./', container.dataset.swf).href;
    container.dataset.rewriteMap = rewriteMap;
    container.dataset.fullscreen = 'true';
    container.style.maxWidth = movie.width + 'px';
    const frame = document.createElement('div');
    frame.className = 'flash-player';
    frame.style.aspectRatio = movie.width + ' / ' + movie.height;
    frame.setAttribute('aria-label', movie.title);
    container.appendChild(frame);
    const status = document.createElement('span');
    status.className = 'flash-status';
    status.setAttribute('role', 'status');
    status.textContent = 'Chargement de l’animation…';
    container.appendChild(status);
    return container;
  }
  async function json(name) {
    const response = await fetch(new URL(name, root), { cache: 'no-cache' });
    if (!response.ok) throw new Error('Unable to load portfolio ' + name);
    return response.json();
  }
  Promise.all([json('manifest.json'), json('navigation.json')]).then(([manifest, links]) => {
    function showContent(content, label, trigger) {
      clear();
      if (!dialog.open) opener = trigger || document.activeElement;
      title.textContent = label;
      viewer.appendChild(content);
      if (!dialog.open) dialog.showModal();
    }
    function show(id, trigger) {
      const movie = manifest.movies[id];
      if (!movie || typeof dialog.showModal !== 'function') return false;
      const container = player(movie);
      showContent(container, movie.title, trigger);
      current = container;
      window.StepFlash.load(current);
      return true;
    }
    function showImage(id, index = 0, trigger) {
      const gallery = manifest.galleries?.[id];
      const selected = Number(index);
      if (!gallery || !Number.isInteger(selected) || selected < 0 || selected >= gallery.images.length ||
          typeof dialog.showModal !== 'function') return false;
      const item = gallery.images[selected];
      const figure = document.createElement('figure');
      figure.className = 'metaflash-image-view';
      const image = document.createElement('img');
      image.alt = item.alt || item.caption || gallery.title;
      figure.appendChild(image);
      const status = document.createElement('p');
      status.className = 'flash-status';
      status.setAttribute('role', 'status');
      status.textContent = 'Chargement de l’image…';
      figure.appendChild(status);
      if (item.caption) {
        const caption = document.createElement('figcaption');
        caption.textContent = item.caption;
        figure.appendChild(caption);
      }
      showContent(figure, gallery.title, trigger);
      currentImage = image;
      activeGallery = id;
      imageIndex = selected;
      imageControls.hidden = gallery.images.length < 2;
      position.textContent = `${selected + 1} / ${gallery.images.length}`;
      previous.disabled = selected === 0;
      next.disabled = selected === gallery.images.length - 1;
      image.onload = () => {
        if (currentImage !== image) return;
        status.hidden = true;
        figure.dataset.ready = 'true';
      };
      image.onerror = () => {
        if (currentImage === image) status.textContent = 'L’image n’a pas pu être chargée.';
      };
      image.src = new URL(item.src, root).href;
      return true;
    }
    document.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[data-metaflash-movie], a[data-metaflash-gallery]');
      if (!link) return;
      const opened = link.dataset.metaflashGallery
        ? showImage(link.dataset.metaflashGallery, link.dataset.metaflashIndex || 0, link)
        : show(link.dataset.metaflashMovie, link);
      if (opened) event.preventDefault();
    });
    previous.addEventListener('click', () => { if (activeGallery) showImage(activeGallery, imageIndex - 1); });
    next.addEventListener('click', () => { if (activeGallery) showImage(activeGallery, imageIndex + 1); });
    document.addEventListener('keydown', event => {
      if (!dialog.open || !activeGallery || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        showImage(activeGallery, imageIndex + (event.key === 'ArrowLeft' ? -1 : 1));
      }
    });
    document.querySelector('[data-metaflash-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      clear();
      opener?.focus();
      opener = null;
    });
    const routes = new Map();
    for (const [path, page] of Object.entries(manifest.pages)) {
      const target = new URL(page.url.slice(1), siteRoot).href;
      routes.set(target, { target, page });
      routes.set(new URL(path, root).href, { target, page });
      for (const origin of ['http://metaflash.fr/', 'https://metaflash.fr/', 'http://www.metaflash.fr/', 'https://www.metaflash.fr/']) {
        routes.set(new URL(path, origin).href, { target, page });
      }
    }
    for (const link of links) {
      const target = link.destination.startsWith('/') ? new URL(link.destination.slice(1), siteRoot).href : link.destination;
      if (!routes.has(link.legacy)) routes.set(link.legacy, { target });
      if (!routes.has(target)) routes.set(target, { target });
    }
    const open = window.open;
    window.open = function (...args) {
      const [url, target] = args;
      const route = routes.get(String(url));
      if (target === '_blank' && route) {
        const opened = route.page?.kind === 'movie' ? show(route.page.movie_id)
          : route.page?.kind === 'image' ? showImage(route.page.gallery_id, route.page.image_index) : false;
        if (!opened) window.location.assign(route.target);
        return window;
      }
      return open.apply(window, args);
    };
    for (const placeholder of document.querySelectorAll('[data-metaflash-inline]')) {
      const movie = manifest.movies[placeholder.dataset.metaflashInline];
      if (!movie) throw new Error('Unreviewed portfolio movie');
      const container = player(movie);
      placeholder.appendChild(container);
      window.StepFlash.load(container);
    }
  }).catch(error => {
    const status = document.createElement('p');
    status.className = 'metaflash-unavailable';
    status.textContent = 'Le lecteur est indisponible. Réessayez en rechargeant la page.';
    document.querySelector('#metaflash-content').appendChild(status);
    console.error('Unable to initialize Metaflash', error);
  });
})();
