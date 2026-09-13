module.exports = async function handler(req, res) {
  try {
    const source = 'https://raw.githubusercontent.com/daksh-07/Whatever/20ffa75d22ebe23684f49c11100f973088d2a69f/index.html';
    const response = await fetch(source);
    if (!response.ok) throw new Error('Unable to load game source');
    let html = await response.text();

    const fix = `
      // Mobile/start-screen boot fix: the original build exposed the button but did not bind it.
      const bootSydney = () => {
        if (play) return;
        play = true;
        paused = false;
        last = performance.now();
        const start = document.getElementById('start');
        if (start) start.classList.add('hide');
        hud();
        objective('Investigate the first lead in Rooty Hill.', 'Explore freely. Press E near contacts.');
        toast('Welcome to Sydney. The city is yours to explore.');
      };
      const enterButton = document.getElementById('enter');
      if (enterButton) enterButton.addEventListener('click', bootSydney, { once: true });
      window.addEventListener('keydown', (event) => {
        if (event.code === 'Enter' && !play) bootSydney();
      });
    `;

    const marker = '})();</script>';
    const at = html.lastIndexOf(marker);
    if (at === -1) throw new Error('Game script marker not found');
    html = html.slice(0, at) + fix + html.slice(at);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(html);
  } catch (error) {
    res.status(500).setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Sydney: Underworld failed to load: ' + error.message);
  }
};
