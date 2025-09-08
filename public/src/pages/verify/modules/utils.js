export function updateVerifyButton() {
    const inputs = document.querySelectorAll('.code-input');
    const allFilled = Array.from(inputs).every(input => input.value.length === 1);
    document.getElementById('verify-btn').disabled = !allFilled;
}

export function showSuccessModal() {
    document.getElementById('success-modal').classList.remove('hidden');
    document.getElementById('main-container').classList.add('hidden');
}

export function redirectToDashboard() {
    // Clear the verification code from localStorage if needed
    localStorage.removeItem('employee_id');
    
    // // Redirect to dashboard
    // window.location.href = '/dashboard';
}