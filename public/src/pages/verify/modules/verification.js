import { showError } from './error-handler.js';
import { updateVerifyButton, showSuccessModal } from './utils.js';

export async function handleVerification(event) {
    event.preventDefault();

    const inputs = document.querySelectorAll('.code-input');
    const verification_code = Array.from(inputs).map(input => input.value).join('');

    if (verification_code.length !== 6) {
        showError('Please enter all 6 characters.');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const employee_id = urlParams.get('employee_id') || localStorage.getItem('employee_id');

    if (!employee_id) {
        showError('User session expired. Please try logging in again.');
        return;
    }

    const verifyBtn = document.getElementById('verify-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');

    verifyBtn.disabled = true;
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');

    try {
        const response = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employee_id, verification_code })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Verification failed');
        }

        // Store user data if needed
        if (result.user) {
            localStorage.setItem('user', JSON.stringify(result.user));
        }
        
        window.location.href = '/dashboard';
        
    } catch (error) {
        showError(error.message);

        verifyBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');

        inputs.forEach(input => {
            input.value = '';
            input.classList.remove('filled');
        });

        document.getElementById('code-1').focus();
        updateVerifyButton();
    }
}
