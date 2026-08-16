(function () {
    'use strict';

    var COOKIE_NAME = 'primo_cookie_consent';
    var COOKIE_MAX_AGE = 60 * 60 * 24 * 180;
    var GA_ID = 'G-M613Q4L4KL';
    var state = readConsent();
    var analyticsLoaded = false;

    function readCookie(name) {
        var prefix = name + '=';
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        for (var i = 0; i < cookies.length; i += 1) {
            if (cookies[i].indexOf(prefix) === 0) {
                return cookies[i].slice(prefix.length);
            }
        }
        return null;
    }

    function readConsent() {
        var raw = readCookie(COOKIE_NAME);
        if (!raw) return null;
        try {
            var parsed = JSON.parse(decodeURIComponent(raw));
            if (typeof parsed.analytics !== 'boolean' || typeof parsed.affiliate !== 'boolean') return null;
            return parsed;
        } catch (error) {
            return null;
        }
    }

    function clearCookie(name) {
        document.cookie = name + '=; Max-Age=0; Path=/; Domain=.primoeuropa.eu; SameSite=Lax; Secure';
        document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax; Secure';
    }

    function clearOptionalCookies() {
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        cookies.forEach(function (item) {
            var name = item.split('=')[0];
            if (name === 'primo_landing_attribution' || name === '_ga' || name.indexOf('_ga_') === 0) clearCookie(name);
        });
    }

    function saveConsent(nextState) {
        state = {
            analytics: Boolean(nextState.analytics),
            affiliate: Boolean(nextState.affiliate),
            version: '2026-08',
            updated_at: new Date().toISOString()
        };
        document.cookie = COOKIE_NAME + '=' + encodeURIComponent(JSON.stringify(state)) + '; Max-Age=' + COOKIE_MAX_AGE + '; Path=/; Domain=.primoeuropa.eu; SameSite=Lax; Secure';
        if (state.analytics) loadAnalytics();
        else clearOptionalCookies();
        window.dispatchEvent(new CustomEvent('primoConsentChanged', { detail: state }));
        closePanel();
        render();
    }

    function loadAnalytics() {
        if (analyticsLoaded || !state || !state.analytics) return;
        analyticsLoaded = true;
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', GA_ID);

        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(script);
    }

    function has(category) {
        return Boolean(state && state[category]);
    }

    function getBanner() {
        return document.getElementById('primo-consent-banner');
    }

    function getPanel() {
        return document.getElementById('primo-consent-panel');
    }

    function openPanel() {
        var panel = getPanel();
        if (panel) {
            panel.hidden = false;
            panel.style.display = 'grid';
            panel.querySelector('[data-consent-focus]') && panel.querySelector('[data-consent-focus]').focus();
        }
    }

    function closePanel() {
        var panel = getPanel();
        if (panel) {
            panel.hidden = true;
            panel.style.display = 'none';
        }
    }

    function render() {
        var banner = getBanner();
        if (banner) {
            banner.hidden = Boolean(state);
            banner.style.display = state ? 'none' : 'block';
        }
        var analytics = document.querySelector('[data-consent-category="analytics"]');
        var affiliate = document.querySelector('[data-consent-category="affiliate"]');
        if (analytics) analytics.checked = has('analytics');
        if (affiliate) affiliate.checked = has('affiliate');
    }

    function initUi() {
        document.addEventListener('click', function (event) {
            var actionElement = event.target.closest('[data-consent-action]');
            if (!actionElement) return;
            var action = actionElement.getAttribute('data-consent-action');
            if (action === 'accept-all') saveConsent({ analytics: true, affiliate: true });
            if (action === 'reject-all') saveConsent({ analytics: false, affiliate: false });
            if (action === 'open-settings') openPanel();
            if (action === 'close-settings') closePanel();
            if (action === 'save-settings') {
                saveConsent({
                    analytics: Boolean(document.querySelector('[data-consent-category="analytics"]:checked')),
                    affiliate: Boolean(document.querySelector('[data-consent-category="affiliate"]:checked'))
                });
            }
        });
        closePanel();
        render();
    }

    window.PrimoConsent = {
        has: has,
        getState: function () { return state; },
        openSettings: openPanel,
        loadAnalytics: loadAnalytics
    };

    document.addEventListener('DOMContentLoaded', initUi);
    if (state && state.analytics) loadAnalytics();
}());
