import { Toast } from '../../../../assets/javascript/toast.js';

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    document.getElementById('eye-open').classList.toggle('hidden', isHidden);
    document.getElementById('eye-closed').classList.toggle('hidden', !isHidden);
}

async function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginbtn');
    const originalText = loginBtn.textContent;

    try {
        loginBtn.textContent = 'Logging in...';
        loginBtn.disabled = true;

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        const data = await res.json();
        
        if (res.ok) {
            // localStorage.setItem('user', JSON.stringify(data.user));
            
            const accStatus = data.user.acc_status?.toLowerCase();
            const accPermission = data.user.role?.toLowerCase();
            const email = data.user.email;
            const employee_id = data.user.id;

            if (accStatus === "unverified") {
                window.location.href = `/verify?email=${encodeURIComponent(email)}&employee_id=${employee_id}`;
            } else if (accStatus === "activated") {
                if (accPermission === "admin") {
                    window.location.href = '/admin/dashboard';
                } else if (accPermission === "user") {
                    window.location.href = '/client/dashboard';
                } else {
                    window.location.href = '/error';
                }
            } else {
                Toast.error('Unknown account status. Please contact support.');
                window.location.href = '/login';
            }
        } else {
            Toast.error(`Error: ${data.error || 'Login failed'}`);
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
        }
    } catch (err) {
        console.error('Error during login:', err);
        Toast.error('An error occurred while trying to log in. Please try again later.');
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
    } 
}

// Initialize AOS
AOS.init({
    duration: 1200,
    easing: 'ease-out',
    once: true,
    mirror: false,
    offset: 50
});


document.getElementById('loginbtn').addEventListener('click', loginUser);
document.getElementById('togglebtn').addEventListener('click', togglePassword);