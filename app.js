const routeContent = {
  address: {
    title: 'Primero: asegura una dirección que permita registro.',
    text: 'Antes de abrir otros frentes, confirma que tu alojamiento permite empadronamiento. Sin esa base, otros trámites pueden quedarse esperando.',
    link: 'https://www.primoeuropa.eu/como-conseguir-anmeldung-alemania/',
    label: 'Ver cómo funciona el Anmeldung →',
    event: 'need_housing_click'
  },
  health: {
    title: 'Primero: confirma que tu seguro está activo.',
    text: 'Pregunta a tu empleador o aseguradora qué cobertura tienes desde tu llegada y qué documento debes conservar antes de tu primer día.',
    link: 'https://www.primoeuropa.eu/mejor-seguro-de-salud-para-expats-en-alemania/',
    label: 'Ver la ruta de seguro médico →',
    event: 'need_health_insurance_click'
  },
  bank: {
    title: 'Primero: prepara lo necesario para cobrar tu nómina.',
    text: 'Una cuenta no sustituye el resto de trámites, pero debes saber qué documentación necesitarás y cuándo pedirá tu IBAN el equipo de recursos humanos.',
    link: 'https://www.primoeuropa.eu/mejor-cuenta-bancaria-para-extranjeros-en-alemania/',
    label: 'Ver opciones de cuenta para extranjeros →',
    event: 'need_bank_account_click'
  }
};

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
  notice.querySelector('p').textContent = `Has llegado desde ${displayName}, una organización que acompaña tu salida a Alemania. Esta ruta está pensada para ayudarte con lo que ocurre después: instalarte bien.`;
  emitEvent('partner_landing_view');
}

function initRouteSelector() {
  const choices = [...document.querySelectorAll('.choice-card')];
  const result = document.getElementById('route-result');
  const progress = document.getElementById('progress-bar');
  const count = document.getElementById('progress-count');
  let selectionCount = 0;

  choices.forEach((choice) => {
    choice.addEventListener('click', () => {
      const route = routeContent[choice.dataset.route];
      const wasActive = choice.classList.contains('active');

      choices.forEach((item) => item.classList.remove('active'));
      choice.classList.add('active');
      if (!wasActive) selectionCount = Math.min(selectionCount + 1, 3);
      progress.style.width = `${(selectionCount / 3) * 100}%`;
      count.textContent = `${selectionCount}/3`;

      result.innerHTML = `
        <p class="result-pretitle">TU SIGUIENTE PASO</p>
        <h3>${route.title}</h3>
        <p>${route.text}</p>
        <a class="result-link" href="${route.link}" target="_blank" rel="noopener" data-route-link="${choice.dataset.route}">${route.label}</a>
      `;
      emitEvent(route.event, { need: choice.dataset.route });

      const routeLink = result.querySelector('[data-route-link]');
      routeLink.addEventListener('click', () => {
        emitEvent('partner_cta_click', { need: choice.dataset.route, partner_destination: choice.dataset.route });
      });
    });
  });
}

function initCtaTracking() {
  document.querySelectorAll('[data-cta]').forEach((cta) => {
    cta.addEventListener('click', () => emitEvent('partner_cta_click', { cta: cta.dataset.cta }));
  });
}

updatePartnerNotice();
initRouteSelector();
initCtaTracking();
