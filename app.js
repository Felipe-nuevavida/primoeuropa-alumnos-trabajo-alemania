const params = new URLSearchParams(window.location.search);
const partnerSource = params.get('utm_source') || params.get('ref');
const partnerMedium = params.get('utm_medium') || 'direct';
const campaign = params.get('utm_campaign') || 'organic_landing';

function emitEvent(name, details = {}) {
  const payload = {
    event: name,
    partner_source: partnerSource || 'direct',
    partner_medium: partnerMedium,
    campaign,
    ...details
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent('primoLandingEvent', { detail: payload }));
  console.info('[Primo Europa landing event]', payload);
}

function updatePartnerNotice() {
  const notice = document.getElementById('partner-note');
  if (!partnerSource || !notice) return;

  const displayName = partnerSource.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  notice.hidden = false;
  notice.querySelector('p').textContent = `Has llegado desde ${displayName}, una organización que acompaña tu salida a Alemania. Esta guía está pensada para ayudarte con lo que ocurre después: instalarte bien.`;
  emitEvent('partner_landing_view');
}

function initCtaTracking() {
  document.querySelectorAll('[data-cta]').forEach((cta) => {
    cta.addEventListener('click', () => emitEvent('partner_cta_click', { cta: cta.dataset.cta }));
  });
}

updatePartnerNotice();
initCtaTracking();
