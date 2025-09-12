import { updateVerifyButton } from './utils.js';
import { hideError } from './error-handler.js';

export function handleCodeInput(input, position) {
    const value = input.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    input.value = value;

    if (value) {
        input.classList.add('filled');
        input.classList.remove('error');

        if (position < 6) {
            document.getElementById(`code-${position + 1}`).focus();
        }
    } else {
        input.classList.remove('filled');
    }

    updateVerifyButton();
    hideError();
}
