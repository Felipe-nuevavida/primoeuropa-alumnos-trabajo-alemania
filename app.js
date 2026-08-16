const params = new URLSearchParams(window.location.search);
const partnerSource = params.get('utm_source') || params.get('ref');
const partnerMedium = params.get('utm_medium') || 'direct';
const campaign = params.get('utm_campaign') || 'organic_landing';
const guideId = params.get('guide') || 'general';
let analyticsVisitTracked = false;

const guides = {
  general: {
    kicker: 'RECURSO GRATUITO · PDF',
    title: 'Checklist de llegada a Alemania <em>con empleo.</em>',
    description: 'Una guía visual, fácil de seguir y basada en fuentes oficiales: qué revisar antes de viajar, durante los primeros 14 días y al empezar a trabajar.',
    download: 'downloads/checklist-llegada-alemania-primo-europa.pdf',
    cta: 'Descargar PDF',
  },
  documentos: {
    kicker: 'RECURSO GRATUITO · DOCUMENTACIÓN',
    title: 'Guía de documentos <em>para Alemania.</em>',
    description: 'Organiza traducciones, apostillas, copias y reconocimiento sin asumir requisitos que tu autoridad no ha confirmado.',
    download: 'downloads/guia-documentos-alemania-primo-europa.pdf',
    cta: 'Descargar guía documental',
  },
  movilidad: {
    kicker: 'RECURSO GRATUITO · MOVILIDAD LABORAL',
    title: 'Guía para trabajar <em>en Alemania.</em>',
    description: 'Aclara contrato, reconocimiento, documentación y primeros pasos antes de organizar tu llegada profesional.',
    download: 'downloads/guia-movilidad-laboral-alemania-primo-europa.pdf',
    cta: 'Descargar guía laboral',
  },
};

function currentGuideId() {
  return guideId in guides ? guideId : 'general';
}

function persistLandingAttribution() {
  // Comparte solo metadatos de campaña entre subdominios de Primo Europa; no guarda datos personales.
  if (!partnerSource || !window.PrimoConsent || !window.PrimoConsent.has('analytics')) return;
  const attribution = {
    landing: 'alumnos-trabajo-alemania',
    guide: currentGuideId(),
    partner_source: partnerSource,
    partner_medium: partnerMedium,
    campaign,
  };
  const value = encodeURIComponent(JSON.stringify(attribution));
  document.cookie = `primo_landing_attribution=${value}; Max-Age=2592000; Path=/; Domain=.primoeuropa.eu; SameSite=Lax; Secure`;
}

function emitEvent(name, details = {}) {
  const payload = {
    event: name,
    partner_source: partnerSource || 'direct',
    partner_medium: partnerMedium,
    campaign,
    guide: currentGuideId(),
    ...details,
  };

  // Mantiene las integraciones locales existentes.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent('primoLandingEvent', { detail: payload }));
  console.info('[Primo Europa landing event]', payload);

  // Envía el mismo evento a GA4 únicamente mientras existe consentimiento analítico.
  if (window.PrimoConsent && window.PrimoConsent.has('analytics') && typeof window.gtag === 'function') {
    const { event, ...eventParams } = payload;
    window.gtag('event', name, eventParams);
  }
}

function updateGuide() {
  const guide = guides[currentGuideId()];
  const kicker = document.getElementById('guide-kicker');
  const title = document.getElementById('guide-title');
  const description = document.getElementById('guide-description');
  const download = document.getElementById('guide-download');
  if (!kicker || !title || !description || !download) return;

  kicker.textContent = guide.kicker;
  title.innerHTML = guide.title;
  description.textContent = guide.description;
  download.href = guide.download;
  download.innerHTML = `${guide.cta} <span aria-hidden="true">↓</span>`;
}

function updatePartnerNotice() {
  const notice = document.getElementById('partner-note');
  if (!partnerSource || !notice) return;

  const displayName = partnerSource.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  notice.hidden = false;
  notice.querySelector('p').textContent = `Has llegado desde ${displayName}, una organización que acompaña tu salida a Alemania. Esta guía está pensada para ayudarte a ordenar el siguiente paso.`;
}

function trackAnalyticsVisit() {
  if (analyticsVisitTracked || !window.PrimoConsent || !window.PrimoConsent.has('analytics')) return;
  persistLandingAttribution();
  emitEvent('guide_landing_view');
  if (partnerSource) emitEvent('partner_landing_view');
  analyticsVisitTracked = true;
}

function initCtaTracking() {
  document.querySelectorAll('[data-cta]').forEach((cta) => {
    cta.addEventListener('click', () => {
      if (cta.id === 'guide-download') {
        emitEvent('guide_download', {
          cta: cta.dataset.cta || 'guide_download',
          guide_file: new URL(cta.href, window.location.origin).pathname,
        });
        return;
      }

      emitEvent('partner_cta_click', {
        cta: cta.dataset.cta || 'unknown',
      });
    });
  });
}

updateGuide();
updatePartnerNotice();
initCtaTracking();
trackAnalyticsVisit();
window.addEventListener('primoConsentChanged', (event) => {
  if (event.detail && event.detail.analytics) trackAnalyticsVisit();
});
