function togglePassword() {
    const passwordInput = document.getElementById('password');
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    document.getElementById('eye-open').classList.toggle('hidden', isHidden);
    document.getElementById('eye-closed').classList.toggle('hidden', !isHidden);
}

async function loginUser(event){
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try{
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        
        if (res.ok) {
            const token = data.accessToken;
            localStorage.setItem('token', token);

            const payload = JSON.parse(atob(token.split('.')[1]));
            const accStatus = payload.acc_status?.toLowerCase();
            const accPermission = payload.role?.toLowerCase();
            const email = payload.email;
            const employee_id = payload.id;

            localStorage.setItem('employee_id', employee_id);

            if(accStatus ==="unverified"){
                    window.location.href = `/verify?email=${encodeURIComponent(email)}&employee_id=${employee_id}`;
            } else if (accStatus === "activated"){
                if (accPermission === "admin"){
                    window.location.href = '/admin/dashboard';
                } else if (accPermission === "user") {
                    window.location.href = '/client/dashboard';
                } else {
                    window.location.href = '/error';
                }
            } else {
                alert ("Unknown account status. Please contact support.");
                window.location.href = '/login';
            }
        } else {
            alert(`Error: ${data.error || 'Login failed'}`);
        }
    } catch (err) {
        console.error('Error during login:', err);
        alert('An error occurred while trying to log in. Please try again later.');
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