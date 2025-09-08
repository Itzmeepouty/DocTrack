export function showError(message = 'Invalid verification code. Please try again.') {
    const errorDiv = document.getElementById('error-message');
    errorDiv.querySelector('span').textContent = message;
    errorDiv.classList.remove('hidden');

    document.querySelectorAll('.code-input').forEach(input => {
        input.classList.add('error');
        input.classList.remove('filled');
    });
}

export function hideError() {
    document.getElementById('error-message').classList.add('hidden');
    document.querySelectorAll('.code-input').forEach(input => {
        input.classList.remove('error');
    });
}
