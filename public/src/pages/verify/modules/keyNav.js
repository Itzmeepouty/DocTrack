import { updateVerifyButton } from './utils.js';

export function handleKeyDown(event, position) {
    if (event.key === 'Backspace' && !event.target.value && position > 1) {
        const prevInput = document.getElementById(`code-${position - 1}`);
        prevInput.focus();
        prevInput.value = '';
        prevInput.classList.remove('filled');
        updateVerifyButton();
    }

    if (event.key === 'ArrowLeft' && position > 1) {
        document.getElementById(`code-${position - 1}`).focus();
    }

    if (event.key === 'ArrowRight' && position < 6) {
        document.getElementById(`code-${position + 1}`).focus();
    }
}

export function handleBlur(input) {
    input.classList.remove('highlight');
}

export function handleFocus(input) {
    input.select();
}
