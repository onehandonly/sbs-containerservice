/**
 * Analytics event bridge — pushes interactions to GTM dataLayer.
 *
 * GTM picks these up via custom event triggers and routes them to
 * GA4 and Google Ads conversion tags configured in the GTM container.
 *
 * Instrumented elements:
 *   - [data-gtm-event]          → any named GTM event (cta_click, etc.)
 *   - [data-gtm-form]           → form submissions
 *
 * No GTM ID is needed here; this script only writes to window.dataLayer.
 * If GTM has not loaded (dev/no ID), the pushes are no-ops unless you
 * inspect dataLayer manually.
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

type DataLayerEvent = {
  event: string;
  [key: string]: unknown;
};

function push(payload: DataLayerEvent): void {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
}

/** Delegated click listener for all [data-gtm-event] elements. */
function onDocumentClick(e: MouseEvent): void {
  const target = (e.target as Element).closest<HTMLElement>('[data-gtm-event]');
  if (!target) return;

  const eventName = target.dataset.gtmEvent;
  if (!eventName) return;

  push({
    event: eventName,
    gtm_label: target.dataset.gtmLabel ?? undefined,
    gtm_category: target.dataset.gtmCategory ?? undefined,
    element_text: target.textContent?.trim() ?? undefined,
    element_href:
      target instanceof HTMLAnchorElement ? target.href : undefined,
  });
}

/** Delegated submit listener for [data-gtm-form] forms. */
function onDocumentSubmit(e: SubmitEvent): void {
  const form = (e.target as Element).closest<HTMLFormElement>('[data-gtm-form]');
  if (!form) return;

  push({
    event: 'form_submit',
    form_id: form.id || undefined,
    form_name: form.dataset.gtmForm || undefined,
  });
}

document.addEventListener('click', onDocumentClick, { passive: true });
document.addEventListener('submit', onDocumentSubmit);
