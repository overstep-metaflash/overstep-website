/* Static-host compatibility for the original WordPress ?p=ID links. */
(() => {
  const settings = document.currentScript.dataset;
  const id = new URL(location.href).searchParams.get('p');
  if (!id || !/^\d+$/.test(id)) return;
  fetch(settings.postMap).then((response) => {
    if (!response.ok) throw new Error('Post mapping is unavailable');
    return response.json();
  }).then((posts) => {
    const path = posts[id];
    if (!path || !path.startsWith('/') || path.startsWith('//')) return;
    const target = new URL(settings.siteRoot + path.replace(/^\/+/, ''), location.origin);
    if (target.origin !== location.origin) return;
    target.hash = location.hash;
    location.replace(target.href);
  }).catch((error) => console.error('Unable to resolve legacy post URL', error));
})();
