

import { handleCodeInput } from './modules/inputHandler.js';
import { handleKeyDown, handleFocus, handleBlur } from './modules/keyNav.js';
import { handleVerification } from './modules/verification.js';
import { hideError } from './modules/error-handler.js';
import { updateVerifyButton } from './modules/utils.js';

document.addEventListener('DOMContentLoaded', () => {
     AOS.init({
        duration: 1200,
        easing: 'ease-out',
        once: true
    });

    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email') || 'user@example.com';
    const employee_id = urlParams.get('employee_id') || localStorage.getItem('employee_id');

    document.getElementById('email-display').textContent = email;
    if (urlParams.has('employee_id')) {
        localStorage.setItem('employee_id', employee_id);
    }

    document.querySelectorAll('.code-input').forEach((input, index) => {
        const position = index + 1;
        
        input.addEventListener('input', (e) => handleCodeInput(e.target, position));
        input.addEventListener('keydown', (e) => handleKeyDown(e, position));
        input.addEventListener('focus', (e) => handleFocus(e.target));
        input.addEventListener('blur', (e) => handleBlur(e.target));
    });

    document.getElementById('verify-btn').addEventListener('click', handleVerification);

    document.addEventListener('paste', function (event) {
        const pasteData = event.clipboardData.getData('text').replace(/[^A-Za-z0-9]/g, '').toUpperCase();

        if (pasteData.length === 6) {
            event.preventDefault();
            const inputs = document.querySelectorAll('.code-input');
            pasteData.split('').forEach((digit, index) => {
                if (inputs[index]) {
                    inputs[index].value = digit;
                    inputs[index].classList.add('filled');
                    inputs[index].classList.remove('error');
                }
            });
            updateVerifyButton();
            hideError();
            inputs[5].focus();
        }
    });

    document.getElementById('code-1').focus();
});
