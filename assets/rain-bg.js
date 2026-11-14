(function () {
  var canvas = document.getElementById('rainBgCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var audioBtn = document.getElementById('rainAudioBtn');

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var w = 0;
  var h = 0;
  var dpr = 1;
  var rafId = null;
  var mouseX = 0.5;

  var drops = [];
  var ripples = [];
  var COLORS = ['56, 189, 248', '244, 114, 182', '148, 163, 184'];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initDrops() {
    drops = [];
    var count = w < 640 ? 34 : 58;
    for (var i = 0; i < count; i++) {
      drops.push({
        x: Math.random() * w,
        y: Math.random() * h,
        len: Math.random() * 14 + 8,
        vy: Math.random() * 4.5 + 4.0,
        alpha: Math.random() * 0.16 + 0.05,
        rgb: Math.random() > 0.8 ? '56, 189, 248' : '148, 163, 184'
      });
    }
  }

  // ===== Web Audio: Night Rain + Waterdrop Ping =====
  var ac = null;
  var master = null;
  var rainOn = true;

  function ensureAudio() {
    if (!ac) {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ac = new AudioCtx();
    }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }

  function playDropTone(freq) {
    var ctxA = ensureAudio();
    if (!ctxA) return;
    var now = ctxA.currentTime;
    var osc = ctxA.createOscillator();
    var g = ctxA.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + 0.09);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.045, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc.connect(g);
    g.connect(master || ctxA.destination);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  function syncRainAudio() {
    var ctxA = ensureAudio();
    if (!ctxA) return;
    if (!master) {
      master = ctxA.createGain();
      master.gain.value = 0;
      master.connect(ctxA.destination);

      var len = ctxA.sampleRate * 3;
      var buf = ctxA.createBuffer(1, len, ctxA.sampleRate);
      var ch = buf.getChannelData(0);
      var last = 0;
      for (var i = 0; i < len; i++) {
        var white = Math.random() * 2 - 1;
        last = (last + 0.04 * white) / 1.04;
        ch[i] = white * 0.38 + last * 1.25;
      }

      var src = ctxA.createBufferSource();
      src.buffer = buf;
      src.loop = true;

      var bp = ctxA.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 1500;
      bp.Q.value = 0.5;

      var lp = ctxA.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 3200;

      var rainGain = ctxA.createGain();
      rainGain.gain.value = 0.22;

      src.connect(bp);
      bp.connect(lp);
      lp.connect(rainGain);
      rainGain.connect(master);
      src.start();
    }
    master.gain.setTargetAtTime(rainOn ? 0.65 : 0, ctxA.currentTime, 0.25);
  }

  function toggleAudio() {
    rainOn = !rainOn;
    syncRainAudio();
    if (audioBtn) {
      audioBtn.classList.toggle('is-on', rainOn);
      audioBtn.textContent = rainOn ? '♪ RAIN: ON' : '♪ RAIN: OFF';
    }
  }

  function unlockDefaultAudio() {
    if (rainOn && !master) {
      syncRainAudio();
    }
    window.removeEventListener('pointerdown', unlockDefaultAudio);
    window.removeEventListener('keydown', unlockDefaultAudio);
  }
  window.addEventListener('pointerdown', unlockDefaultAudio, { passive: true });
  window.addEventListener('keydown', unlockDefaultAudio, { passive: true });

  // ===== Render Loop =====
  function spawnRipple(x, y, isUser) {
    var rgb = COLORS[Math.floor(Math.random() * COLORS.length)];
    ripples.push({
      x: x,
      y: y,
      r: isUser ? 4 : 2,
      alpha: isUser ? 0.65 : 0.28,
      rgb: rgb
    });
    if (ripples.length > 24) ripples.shift();
  }

  function drawFrame() {
    ctx.clearRect(0, 0, w, h);

    var wind = (mouseX - 0.5) * 1.6 - 0.8;

    // 1. Rain streaks
    ctx.lineWidth = 1;
    for (var i = 0; i < drops.length; i++) {
      var d = drops[i];
      if (!reducedMotion) {
        d.x += wind;
        d.y += d.vy;
        if (d.y > h + 20) {
          if (Math.random() < 0.08) {
            spawnRipple(d.x, h - 10 - Math.random() * 40, false);
          }
          d.y = -20;
          d.x = Math.random() * w;
        }
        if (d.x < -20) d.x = w + 20;
        if (d.x > w + 20) d.x = -20;
      }
      ctx.strokeStyle = 'rgba(' + d.rgb + ', ' + d.alpha + ')';
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + wind * 1.4, d.y + d.len);
      ctx.stroke();
    }

    // 2. Neon puddle ripples
    for (var r = ripples.length - 1; r >= 0; r--) {
      var rp = ripples[r];
      rp.r += 0.9;
      rp.alpha -= 0.016;
      if (rp.alpha <= 0) {
        ripples.splice(r, 1);
        continue;
      }
      ctx.strokeStyle = 'rgba(' + rp.rgb + ', ' + rp.alpha + ')';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(rp.x, rp.y, rp.r, rp.r * 0.42, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (!reducedMotion && !document.hidden) {
      rafId = requestAnimationFrame(drawFrame);
    } else {
      rafId = null;
    }
  }

  function startLoop() {
    if (!rafId && !document.hidden) {
      rafId = requestAnimationFrame(drawFrame);
    }
  }

  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX / (w || 1);
  }, { passive: true });

  document.addEventListener('pointerdown', function (e) {
    if (e.target.closest('a, button, input, select, .fiction-card, .tool-item, .rain-hud')) return;
    spawnRipple(e.clientX, e.clientY, true);
    var notes = [587.33, 659.25, 783.99, 987.77, 1174.66];
    playDropTone(notes[Math.floor(Math.random() * notes.length)]);
    if (reducedMotion) drawFrame();
  });

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) startLoop();
  });

  if (audioBtn) audioBtn.addEventListener('click', toggleAudio);

  window.addEventListener('resize', function () {
    resize();
    initDrops();
    if (reducedMotion) drawFrame();
  });

  resize();
  initDrops();
  drawFrame();
})();
