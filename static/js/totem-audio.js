/* Native totem audio controller using the original reviewed SWF event manifest. */
(function (root) {
  'use strict';

  function playbackPlan(sound, info, bufferDuration) {
    const rate = Number(sound.sample_rate);
    const sourceOffset = Math.max(0, Number(sound.seek_samples || 0)) / rate;
    const startSample = Number(info.in_sample || 0);
    const endSample = Math.min(Number(info.out_sample ?? sound.sample_count), Number(sound.sample_count));
    const offset = sourceOffset + startSample / rate;
    const requested = Math.max(0, (endSample - startSample) / rate);
    const duration = Math.max(0, Math.min(requested, bufferDuration - offset));
    const loops = Math.max(1, Math.min(1000, Number(info.loops || 1)));
    return { offset, duration, loops, totalDuration: duration * loops,
      shortfallSeconds: Math.max(0, requested - duration), requestedDuration: requested };
  }

  async function create(options) {
    const request = options.fetch || root.fetch.bind(root);
    const manifestUrl = new URL(options.manifestUrl, root.location?.href || 'http://localhost/');
    let manifest = options.manifest;
    if (!manifest) {
      const response = await request(manifestUrl.href);
      if (!response.ok) throw new Error('Unable to load the original sound manifest');
      manifest = await response.json();
    }
    const sounds = new Map(manifest.sounds.map(sound => [Number(sound.sound_id), sound]));
    const buffers = new Map(), active = new Map(), epochs = new Map(), diagnostics = [];
    let context, enabled = false, muted = false, disposed = false;
    const fadeSeconds = Math.max(0, Number(options.stopFadeSeconds ?? 0.005));

    function nextEpoch(id) {
      epochs.set(id, (epochs.get(id) || 0) + 1);
    }

    function stopSound(id) {
      nextEpoch(id);
      const voices = active.get(id);
      if (!voices) return;
      for (const voice of voices) {
        const now = context.currentTime;
        const gain = voice.gain.gain;
        if (typeof gain.cancelAndHoldAtTime === 'function') gain.cancelAndHoldAtTime(now);
        else {
          gain.cancelScheduledValues(now);
          gain.setValueAtTime(gain.value, now);
        }
        gain.linearRampToValueAtTime(0, now + fadeSeconds);
        try { voice.source.stop(now + fadeSeconds); } catch (_) { /* Already ended. */ }
      }
      active.delete(id);
    }

    function stopAll() {
      for (const id of sounds.keys()) stopSound(id);
    }

    async function loadSound(sound) {
      if (!buffers.has(sound.sound_id)) {
        const loading = (async () => {
          const response = await request(new URL(sound.file, manifestUrl).href);
          if (!response.ok) throw new Error('Unable to fetch original MP3 ' + sound.sound_id);
          const bytes = await response.arrayBuffer();
          if (sound.mp3_sha256 && root.crypto?.subtle) {
            const digest = new Uint8Array(await root.crypto.subtle.digest('SHA-256', bytes));
            const actual = Array.from(digest, value => value.toString(16).padStart(2, '0')).join('');
            if (actual !== sound.mp3_sha256) throw new Error('Original sound hash mismatch');
          }
          return context.decodeAudioData(bytes);
        })();
        buffers.set(sound.sound_id, loading);
        loading.catch(() => buffers.delete(sound.sound_id));
      }
      return buffers.get(sound.sound_id);
    }

    function scheduleEnvelope(gain, info, plan, now) {
      const envelope = info.envelope;
      if (!envelope?.length) { gain.setValueAtTime(1, now); return; }
      for (const point of envelope) {
        if (point.left_volume !== point.right_volume) {
          throw new Error('Asymmetric channel envelope requires a stereo controller');
        }
      }
      for (let loop = 0; loop < plan.loops; loop++) {
        const start = now + loop * plan.duration;
        gain.setValueAtTime(envelope[0].left_volume, start);
        for (const point of envelope.slice(1)) {
          const relative = Math.min(plan.duration, point.sample / 44100);
          gain.linearRampToValueAtTime(point.left_volume, start + relative);
        }
      }
    }

    async function triggerSound(soundId, event = { event: 'start', loops: 1 }) {
      const info = { event: 'start', loops: 1, ...event };
      if (disposed) return false;
      const id = Number(soundId);
      if (info.event === 'stop') { stopSound(id); return true; }
      if (!enabled || muted || context?.state !== 'running') return false;
      if (info.event === 'start_if_not_playing' && active.get(id)?.size) return false;
      const sound = sounds.get(id);
      if (!sound) throw new Error('Unknown original sound ' + id);
      const epoch = epochs.get(id) || 0;
      const buffer = await loadSound(sound);
      if (disposed || muted || !enabled || (epochs.get(id) || 0) !== epoch) return false;
      if (info.event === 'start_if_not_playing' && active.get(id)?.size) return false;
      const plan = playbackPlan(sound, info, buffer.duration);
      if (plan.duration <= 0) return false;
      if (plan.shortfallSeconds > 0.0001) diagnostics.push({ soundId: id, shortfallSeconds: plan.shortfallSeconds });
      const source = context.createBufferSource(), gain = context.createGain();
      source.buffer = buffer;
      source.loop = plan.loops > 1;
      source.loopStart = plan.offset;
      source.loopEnd = plan.offset + plan.duration;
      const now = context.currentTime;
      scheduleEnvelope(gain.gain, info, plan, now);
      source.connect(gain); gain.connect(context.destination);
      const voice = { source, gain };
      if (!active.has(id)) active.set(id, new Set());
      active.get(id).add(voice);
      source.onended = () => {
        active.get(id)?.delete(voice);
        if (active.get(id)?.size === 0) active.delete(id);
        source.disconnect(); gain.disconnect();
      };
      source.start(now, plan.offset);
      source.stop(now + plan.totalDuration);
      return true;
    }

    async function trigger(buttonId, eventName) {
      const info = manifest.buttons[String(buttonId)]?.sound_events?.[eventName];
      if (!info) return false;
      return triggerSound(info.sound_id, info);
    }

    return {
      async enable() {
        if (disposed) throw new Error('Audio controller was disposed');
        if (!context) {
          const factory = options.contextFactory || (() => new (root.AudioContext || root.webkitAudioContext)());
          context = factory();
        }
        await context.resume(); enabled = true; muted = false;
        if (options.prefetchOnEnable) await Promise.all(Array.from(sounds.values(), loadSound));
        return context.state === 'running';
      },
      trigger,
      triggerSound,
      setMuted(value) { muted = Boolean(value); if (muted) stopAll(); },
      stopAll,
      getState() {
        return { enabled, muted, disposed, contextState: context?.state || 'uncreated',
          voices: Array.from(active.values()).reduce((total, set) => total + set.size, 0),
          diagnostics: diagnostics.slice() };
      },
      async dispose() {
        if (disposed) return;
        stopAll(); disposed = true; enabled = false;
        if (context) await context.close();
      }
    };
  }

  const api = { create, playbackPlan };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.StepTotemAudio = api;
})(typeof globalThis === 'undefined' ? this : globalThis);
