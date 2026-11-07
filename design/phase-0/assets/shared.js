// Phase 0 — comportements communs aux maquettes.
(() => {
  const root = document.documentElement;

  // Changement de paire typographique (outil de maquette uniquement)
  // Chaque maquette s'ouvre avec sa paire par défaut ; ?pair=a|b force l'autre.
  const setPair = (p) => {
    root.dataset.pair = p;
    document.querySelectorAll('[data-set-pair]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setPair === p)));
  };
  const asked = new URLSearchParams(location.search).get('pair');
  setPair(asked === 'a' || asked === 'b' ? asked : root.dataset.pair || 'a');
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-set-pair]');
    if (b) setPair(b.dataset.setPair);
  });

  // Apparitions au défilement
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
  }

  // Léger parallaxe (éléments [data-parallax="0.15"])
  const px = [...document.querySelectorAll('[data-parallax]')];
  if (!reduce && px.length) {
    let ticking = false;
    const run = () => {
      const y = scrollY;
      px.forEach((el) => { el.style.transform = `translate3d(0, ${(y * parseFloat(el.dataset.parallax)).toFixed(1)}px, 0)`; });
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(run); ticking = true; } }, { passive: true });
  }

  // Lecteur YouTube « lite » : rien n'est chargé chez YouTube avant le clic
  document.querySelectorAll('.lite').forEach((box) => {
    const btn = box.querySelector('button');
    btn?.addEventListener('click', () => {
      const id = box.dataset.youtube;
      if (!id) {
        const note = box.querySelector('.lite-note');
        if (note) note.hidden = false;
        return;
      }
      box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1" title="${box.dataset.title || 'Vidéo'}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    });
  });
})();
