/* Filter the independent catalogue without loading original artwork or movies. */
(() => {
  const form = document.querySelector('.archive-filters');
  if (!form) return;
  const cards = [...document.querySelectorAll('[data-archive-search]')];
  const count = document.querySelector('[data-archive-count]');
  const empty = document.querySelector('[data-archive-empty]');
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr').trim();
  function filter() {
    const terms = normalize(form.elements.query.value).split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const card of cards) {
      const data = card.dataset;
      card.hidden = !terms.every(term => normalize(data.archiveSearch).includes(term)) ||
        Boolean(form.elements.kind.value && form.elements.kind.value !== data.archiveKind) ||
        Boolean(form.elements.collection.value && form.elements.collection.value !== data.archiveCollection);
      if (!card.hidden) visible++;
    }
    count.textContent = `${visible} notice${visible === 1 ? '' : 's'} sur ${cards.length}`;
    empty.hidden = visible !== 0;
  }
  form.addEventListener('input', filter);
  form.addEventListener('change', filter);
  form.addEventListener('submit', event => { event.preventDefault(); filter(); });
  form.addEventListener('reset', () => queueMicrotask(filter));
  filter();
})();
