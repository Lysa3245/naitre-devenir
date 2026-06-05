/* ============================================================
   app.js — Naître & Devenir
   ============================================================ */

// ── Nav hamburger ───────────────────────────────────────
(function () {
  const burger = document.querySelector('.js-burger');
  const nav    = document.getElementById('navMobile');
  if (!burger || !nav) return;

  const open = () => {
    burger.classList.add('open');
    nav.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    burger.classList.remove('open');
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () =>
    nav.classList.contains('open') ? close() : open()
  );

  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();


// ── FAQ accordion ───────────────────────────────────────
function toggle(btn) {
  const item    = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}


// ── Contact modal ───────────────────────────────────────
(function () {
  const modal   = document.getElementById('contactModal');
  const overlay = modal?.querySelector('.contact-modal-overlay');
  const closeBtn = modal?.querySelector('.contact-modal-close');
  const form    = document.getElementById('contactForm');
  if (!modal) return;

  const openModal = () => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Ouvrir sur clic de tous les .js-contact
  document.querySelectorAll('.js-contact').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      closeModal(); // ferme le nav mobile si ouvert
      openModal();
    });
  });

  // Fermer sur overlay, bouton close ou Escape
  overlay?.addEventListener('click', closeModal);
  closeBtn?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Validation email
  const emailInput = form?.querySelector('#email');
  const getOrCreateError = () => {
    let err = emailInput.parentElement.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      emailInput.parentElement.appendChild(err);
    }
    return err;
  };
  emailInput?.addEventListener('blur', () => {
    const err = getOrCreateError();
    if (emailInput.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      err.textContent = 'Adresse email incorrecte';
      emailInput.classList.add('field-invalid');
    } else {
      err.textContent = '';
      emailInput.classList.remove('field-invalid');
    }
  });
  emailInput?.addEventListener('input', () => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      const err = getOrCreateError();
      err.textContent = '';
      emailInput.classList.remove('field-invalid');
    }
  });

  // Soumission du formulaire
  form?.addEventListener('submit', async e => {
    e.preventDefault();

    // Bloquer si email invalide
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      const err = getOrCreateError();
      err.textContent = 'Adresse email incorrecte';
      emailInput.classList.add('field-invalid');
      emailInput.focus();
      return;
    }

    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Envoi en cours…';
    btn.disabled = true;

    try {
      const res = await fetch('https://formspree.io/f/xzdwnjld', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });

      if (res.ok) {
        form.innerHTML = `
          <div class="form-success">
            <p>Message envoyé !</p>
            <p>Je vous répondrai dans les plus brefs délais.</p>
          </div>
        `;
      } else {
        btn.textContent = 'Envoyer';
        btn.disabled = false;
        alert('Une erreur est survenue, veuillez réessayer.');
      }
    } catch {
      btn.textContent = 'Envoyer';
      btn.disabled = false;
      alert('Une erreur est survenue, veuillez réessayer.');
    }
  });
})();