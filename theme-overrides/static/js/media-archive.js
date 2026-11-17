/* Filter the independent catalogue without loading original artwork or movies. */
(() => {
  const form = document.querySelector('.archive-filters');
  if (!form) return;
  const cards = [...document.querySelectorAll('[data-archive-search]')];
  const count = document.querySelector('[data-archive-count]');
  const empty = document.querySelector('[data-archive-empty]');
  const pager = document.querySelector('.archive-pagination');
  const previous = document.querySelector('[data-archive-previous]');
  const next = document.querySelector('[data-archive-next]');
  const position = document.querySelector('[data-archive-page]');
  const pageSize = pager ? 48 : Infinity;
  let page = 0;
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr').trim();
  function filter(reset = true) {
    if (reset) page = 0;
    const terms = normalize(form.elements.query.value).split(/\s+/).filter(Boolean);
    const matches = cards.filter(card => {
      const data = card.dataset;
      return terms.every(term => normalize(data.archiveSearch).includes(term)) &&
        (!form.elements.kind.value || form.elements.kind.value === data.archiveKind) &&
        (!form.elements.collection.value || form.elements.collection.value === data.archiveCollection);
    });
    const visible = matches.length;
    const pages = pager ? Math.max(1, Math.ceil(visible / pageSize)) : 1;
    page = Math.max(0, Math.min(page, pages - 1));
    const selected = new Set(pager ? matches.slice(page * pageSize, (page + 1) * pageSize) : matches);
    for (const card of cards) card.hidden = !selected.has(card);
    count.textContent = `${visible} notice${visible === 1 ? '' : 's'} sur ${cards.length}`;
    empty.hidden = visible !== 0;
    if (pager) {
      pager.hidden = pages < 2;
      previous.disabled = page === 0;
      next.disabled = page === pages - 1;
      position.textContent = `Page ${page + 1} sur ${pages}`;
    }
  }
  form.addEventListener('input', () => filter());
  form.addEventListener('change', () => filter());
  form.addEventListener('submit', event => { event.preventDefault(); filter(); });
  form.addEventListener('reset', () => queueMicrotask(filter));
  previous?.addEventListener('click', () => { page--; filter(false); });
  next?.addEventListener('click', () => { page++; filter(false); });
  filter();
})();
