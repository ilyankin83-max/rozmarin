(() => {
  'use strict';
  if (window.rmKitchenBound) return;
  window.rmKitchenBound = true;
  const openers = new WeakMap();
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-kitchen-open]');
    if (button) {
      const id = button.dataset.kitchenOpen;
      // Integration may preventDefault() and open the existing calculator.
      const request = new CustomEvent('rm:kitchen-open', {
        bubbles: true, cancelable: true, detail: { id, trigger: button }
      });
      if (!button.dispatchEvent(request)) return;
      const dialog = document.getElementById(id);
      if (!(dialog instanceof HTMLDialogElement)) {
        console.warn('Kitchen calculator: add the dialog or handle rm:kitchen-open.');
        return;
      }
      if (!dialog.open) {
        openers.set(dialog, button);
        dialog.showModal();
      }
      return;
    }
    const close = event.target.closest('[data-kitchen-close]');
    if (close) close.closest('dialog')?.close();
    if (event.target instanceof HTMLDialogElement && event.target.classList.contains('rm-kitchen-dialog')) {
      const rect = event.target.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.target.close();
    }
  });
  // Native dialog handles focus containment and Escape; restore the opener on close.
  document.addEventListener('close', (event) => {
    const trigger = openers.get(event.target);
    if (trigger?.isConnected) trigger.focus();
  }, true);
})();
