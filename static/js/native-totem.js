/* Original animated sidebar navigation, independent of the article Flash player. */
(() => {
  const desktop = window.matchMedia('(min-width: 761px)');
  const instances = new WeakMap();

  function initialize(container) {
    if (instances.has(container) || !desktop.matches) return;
    const canvas = container.querySelector('canvas');
    const button = container.querySelector('.totem-sound');
    const status = container.querySelector('[data-totem-status]');
    let renderer;
    try {
      const scale = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      canvas.width = Math.round(303 * scale);
      canvas.height = Math.round(2280 * scale);
      renderer = window.StepTotemRenderer(canvas);
      container.dataset.ready = 'true';
    } catch (error) {
      status.textContent = 'L’animation du menu n’a pas pu être chargée.';
      console.error('Unable to initialize native totem', error);
      return;
    }
    const instance = {renderer, audio: null, disposed: false};
    const events = new AbortController();
    const on = (target, type, listener, options = {}) => target.addEventListener(type, listener, {...options, signal: events.signal});
    instances.set(container, instance);
    let active = null, pressed = null;
    let audioPromise;
    const effect = (id, event) => {
      instance.audio?.trigger(id, event).catch(error => console.warn('Unable to play totem effect', error));
    };
    renderer.setSoundHandler(event => {
      instance.audio?.triggerSound(event.soundId).catch(error => console.warn('Unable to play totem timeline effect', error));
    });
    function over(id) {
      if (active === id) return;
      active = id;
      renderer.setButton(id, 1);
      effect(id, 'pointerenter');
    }
    function leave(id) {
      renderer.clearButton(id);
      if (active === id) active = null;
      effect(id, 'pointerleave');
    }
    function down(id) {
      pressed = id;
      renderer.setButton(id, 2);
      effect(id, 'pointerdown');
    }
    function up(id) {
      pressed = null;
      renderer.setButton(id, 1);
      effect(id, 'pointerup');
    }
    for (const control of container.querySelectorAll('[data-totem-button]')) {
      const id = control.dataset.totemButton;
      on(control, 'pointerenter', () => over(id));
      on(control, 'pointerleave', () => leave(id));
      on(control, 'pointerdown', () => down(id));
      on(control, 'pointerup', () => up(id));
      on(control, 'pointercancel', () => {pressed = null; leave(id);});
      on(control, 'focus', () => {if (pressed !== id) over(id);});
      on(control, 'blur', () => {if (!control.matches(':hover')) leave(id);});
      if (control.getAttribute('role') === 'button') {
        on(control, 'keydown', event => {
          if (event.key === ' ' || event.key === 'Enter') {event.preventDefault(); down(id);}
        });
        on(control, 'keyup', event => {
          if (event.key === ' ' || event.key === 'Enter') {event.preventDefault(); up(id);}
        });
      }
    }
    if (window.StepTotemAudio && (window.AudioContext || window.webkitAudioContext)) {
      audioPromise = window.StepTotemAudio.create({manifestUrl: container.dataset.audioManifest, prefetchOnEnable: true});
      audioPromise.then(audio => {
        if (instance.disposed) audio.dispose();
        else {instance.audio = audio; button.hidden = false;}
      }).catch(error => {
        button.hidden = true;
        console.warn('Unable to prepare native totem audio', error);
      });
      on(button, 'click', async () => {
        if (!instance.audio) {
          status.textContent = 'Les sons du totem sont en cours de chargement.';
          return;
        }
        const enabled = button.getAttribute('aria-pressed') !== 'true';
        try {
          if (enabled) await instance.audio.enable();
          else instance.audio.setMuted(true);
          button.setAttribute('aria-pressed', String(enabled));
          button.textContent = enabled ? 'Son ✓' : 'Son';
          const label = enabled ? 'Couper les sons du totem' : 'Activer les sons du totem';
          button.setAttribute('aria-label', label);
          button.title = label;
          status.textContent = enabled ? 'Sons du totem activés.' : 'Sons du totem coupés.';
        } catch (error) {
          status.textContent = 'Les sons du totem n’ont pas pu être activés.';
          console.warn('Unable to enable native totem audio', error);
        }
      });
    }
    const visibility = () => {
      renderer.setPaused(document.hidden || !desktop.matches);
      if (document.hidden || !desktop.matches) instance.audio?.stopAll();
    };
    on(document, 'visibilitychange', visibility);
    on(desktop, 'change', visibility);
    visibility();
    on(window, 'pagehide', () => {
      instance.disposed = true;
      events.abort();
      renderer.destroy();
      instance.audio?.dispose();
      document.removeEventListener('visibilitychange', visibility);
      desktop.removeEventListener('change', visibility);
      instances.delete(container);
      delete container.dataset.ready;
    }, {once: true});
  }
  function start() {
    document.querySelectorAll('[data-totem]').forEach(initialize);
  }
  start();
  desktop.addEventListener('change', start);
  window.addEventListener('pageshow', start);
})();
