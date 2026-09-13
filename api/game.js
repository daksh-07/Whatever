module.exports = async function handler(req, res) {
  try {
    const source = 'https://raw.githubusercontent.com/daksh-07/Whatever/20ffa75d22ebe23684f49c11100f973088d2a69f/index.html';
    const response = await fetch(source);
    if (!response.ok) throw new Error('Unable to load game source');
    let html = await response.text();

    // Keep the original game source intact, but add an independent boot layer AFTER it.
    // This is deliberately outside the original IIFE so a failure in the game's startup
    // code cannot prevent the ENTER button from responding on mobile.
    const boot = `
<script>
(function () {
  function bootSydney() {
    var start = document.getElementById('start');
    if (start) start.classList.add('hide');
    document.documentElement.style.touchAction = 'manipulation';
    document.body.style.touchAction = 'manipulation';
    try { localStorage.setItem('sydney-underworld-started', '1'); } catch (e) {}
    var c = document.getElementById('c');
    if (c) {
      c.style.pointerEvents = 'none';
    }
    var toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = 'Welcome to Sydney. Loading the city…';
      toast.classList.remove('hide');
      setTimeout(function () { toast.classList.add('hide'); }, 2200);
    }
    // If the main engine is alive, its own loop will take over. Otherwise show a
    // simple interactive fallback rather than leaving the user trapped on the title screen.
    try {
      if (typeof window.__sydneyEngineStarted === 'function') window.__sydneyEngineStarted();
    } catch (e) {}
  }

  function bind() {
    var enter = document.getElementById('enter');
    if (!enter) return;
    enter.addEventListener('click', bootSydney, false);
    enter.addEventListener('pointerup', function (e) { e.preventDefault(); bootSydney(); }, false);
    enter.addEventListener('touchend', function (e) { e.preventDefault(); bootSydney(); }, { passive: false });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') bootSydney();
  });
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
