module.exports = async function handler(req, res) {
  try {
    const source = 'https://raw.githubusercontent.com/daksh-07/Whatever/20ffa75d22ebe23684f49c11100f973088d2a69f/index.html';
    const response = await fetch(source);
    if (!response.ok) throw new Error('Unable to load game source');
    let html = await response.text();

    const boot = `
<script>
(function () {
  var starting = false;

  function bootSydney() {
    if (starting) return;
    starting = true;

    var enter = document.getElementById('enter');

    // First trigger the game's REAL handler. The previous hotfix only hid the
    // overlay, which could make the button look dead while leaving play=false.
    try {
      if (enter) enter.click();
    } catch (e) {}

    var start = document.getElementById('start');
    if (start) start.classList.add('hide');
    document.documentElement.style.touchAction = 'manipulation';
    document.body.style.touchAction = 'manipulation';

    try { localStorage.setItem('sydney-underworld-started', '1'); } catch (e) {}

    var toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = 'WELCOME TO SYDNEY — loading the city…';
      toast.classList.remove('hide');
      setTimeout(function () { toast.classList.add('hide'); }, 1800);
    }

    // Give the original game a moment to take over, then allow another tap if
    // the browser swallowed the first touch event.
    setTimeout(function () { starting = false; }, 500);
  }

  function bind() {
    var enter = document.getElementById('enter');
    if (!enter) return;

    // Make the button explicitly touch-safe on iPhone/iPad.
    enter.style.pointerEvents = 'auto';
    enter.style.touchAction = 'manipulation';
    enter.style.webkitUserSelect = 'none';
    enter.style.userSelect = 'none';

    enter.addEventListener('click', bootSydney, false);
    enter.addEventListener('pointerup', function (e) {
      e.preventDefault();
      bootSydney();
    }, false);
    enter.addEventListener('touchend', function (e) {
      e.preventDefault();
      bootSydney();
    }, { passive: false });

    // Capture at document level as a final mobile fallback. This still works
    // if another transparent element interferes with the normal click target.
    document.addEventListener('pointerup', function (e) {
      var target = e.target;
      if (target && target.closest && target.closest('#enter')) {
        e.preventDefault();
        bootSydney();
      }
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') bootSydney();
  }, true);
})();
</script>`;

    html = html.replace(/<\/body>/i, boot + '</body>');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.status(200).send(html);
  } catch (error) {
    res.status(500).setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Sydney: Underworld failed to load: ' + error.message);
  }
};
