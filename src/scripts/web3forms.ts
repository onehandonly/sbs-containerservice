/**
 * Web3Forms submission handler.
 *
 * Sends every form marked with `data-web3forms` to the Web3Forms API
 * (which forwards the submission to info@sbs-container.de) and then
 * redirects to the local /danke thank-you page on success.
 *
 * Native submission (action="https://api.web3forms.com/submit") still works
 * as a no-JS fallback via the hidden `redirect` field.
 */
function bind(form: HTMLFormElement): void {
  if (form.dataset.w3bound) return;
  form.dataset.w3bound = '1';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const originalHTML = button?.innerHTML ?? '';
    if (button) {
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        window.location.assign('/danke?submitted=1');
        return;
      }
      throw new Error(data?.message || 'submit_failed');
    } catch {
      if (button) {
        button.disabled = false;
        button.removeAttribute('aria-busy');
        button.innerHTML = originalHTML;
      }
      window.alert(
        'Es gab ein Problem beim Senden Ihrer Anfrage. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.'
      );
    }
  });
}

function init(): void {
  document
    .querySelectorAll<HTMLFormElement>('form[data-web3forms]')
    .forEach(bind);
}

init();
document.addEventListener('astro:after-swap', init);
