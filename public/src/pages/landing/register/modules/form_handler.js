/**
 * Form Handler Module
 * 
 * Handles all form-related functionality including:
 * - Form submission and validation
 * - Field-specific validation logic
 * - Password visibility toggling
 * - Form state management
 */

import { offices } from './office_module.js';
import { Toast } from '../../../../../assets/javascript/toast.js';

async function handleRegister(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    let isFormValid = true;
    const requiredFields = ['employeeId', 'firstName', 'lastName', 'contactNumber', 'email', 'office', 'password', 'confirmPassword'];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const value = field.value.trim();
        
        if (!value) {
            updateValidationState(field, false);
            isFormValid = false;
            return;
        }
        
        switch(fieldId) {
            case 'employeeId': if (value.length < 3) isFormValid = false; break;
            case 'firstName':
            case 'middleName':
            case 'lastName': if (!/^[a-zA-Z\s]{2,}$/.test(value)) isFormValid = false; break;
            case 'contactNumber': if (!/^[\+]?[\d\-#]{7,15}$/.test(value)) isFormValid = false; break;
            case 'email': if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) isFormValid = false; break;
            case 'password': {
                const hasUppercase = /[A-Z]/.test(value);
                const hasLowercase = /[a-z]/.test(value);
                const hasNumber = /\d/.test(value);
                const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
                const hasMinLength = value.length >= 8;
                if (!(hasUppercase && hasLowercase && hasNumber && hasSpecialChar && hasMinLength)) isFormValid = false;
                break;
            }
            case 'confirmPassword': if (value !== document.getElementById('password').value) isFormValid = false; break;
        }
    });
    
    // const selectedOffice = data.office;
    const selectedOfficeId = document.getElementById('office').getAttribute('data-office-id');

    const isValidOffice = offices.some(office => {
        return office.office_id == selectedOfficeId;
    });

    
    if (!isValidOffice) {
        isFormValid = false;
        updateValidationState(document.getElementById('office'), false);
    }
    
    if (!document.getElementById('consent').checked) isFormValid = false;
    if (isFormValid) console.log('Form Data:', data);

    if (isFormValid) {
        try {
            const registerBtn = document.getElementById('registerBtn');
            registerBtn.disabled = true;
            registerBtn.textContent = 'Registering...';

            const userData = {
                employee_id : data.employeeId,
                fname: data.firstName,
                mname: data.middleName,
                lname: data.lastName,
                office: document.getElementById('office').getAttribute('data-office-id'),
                email: data.email,
                passs: data.password,
                //others are defined in the controller
            };

            const response = await fetch('/api/signup',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (response.ok) {
                //successful registration
                Toast.success('Account Registered. Please verify');
            } else {
                throw new Error(result.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            Toast.error(`Error Registering Account : ${error}`);
        } finally {
            const registerBtn = document.getElementById('registerBtn');
            registerBtn.disabled = false;
            registerBtn.textContent = 'Sign Up';
        }
    } else {
        Toast.error('An error occured. Please try again.');
    }
}

function showFormMessage(message, isError = true) {
    const messageDiv = document.getElementById('form-message');
    messageDiv.textContent = message;
    messageDiv.classList.remove('hidden', 'bg-green-100', 'text-green-700', 'bg-red-100', 'text-red-700');
    messageDiv.classList.add(isError ? 'bg-red-100' : 'bg-green-100', isError ? 'text-red-700' : 'text-green-700');
}

function toggleLoading(isLoading) {
    const btn = document.getElementById('registerBtn');
    const btnText = document.getElementById('registerBtnText');
    const spinner = document.getElementById('registerBtnSpinner');
    
    btn.disabled = isLoading;
    spinner.classList.toggle('hidden', !isLoading);
    btnText.textContent = isLoading ? 'Processing...' : 'Sign Up';
}

function validateEmployeeId(input) {
    updateValidationState(input, input.value.trim().length >= 3);
}

function validateName(input) {
    updateValidationState(input, /^[a-zA-Z\s]{2,}$/.test(input.value.trim()));
}

function validateContactNumber(input) {
    input.value = input.value.replace(/[^0-9+\-#]/g, '');
    updateValidationState(input, /^[\+]?[\d\-#]{7,15}$/.test(input.value));
}

function validateEmail(input) {
    updateValidationState(input, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()));
}

function validatePassword(input) {
    const value = input.value;
    const isValid = /[A-Z]/.test(value) && 
                   /[a-z]/.test(value) && 
                   /\d/.test(value) && 
                   /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value) && 
                   value.length >= 8;
    updateValidationState(input, isValid);
    
    const confirmPassword = document.getElementById('confirmPassword');
    if (confirmPassword.value) validateConfirmPassword(confirmPassword);
}

function validateConfirmPassword(input) {
    updateValidationState(input, input.value === document.getElementById('password').value && input.value.length > 0);
}

function updateValidationState(input, isValid) {
    const validIcon = document.getElementById(input.id + '-valid');
    const invalidIcon = document.getElementById(input.id + '-invalid');

    if (!validIcon || !invalidIcon) {
        console.warn(`Validation icons missing for input: ${input.id}`);
        return;
    }

    if (input.value.trim() === '') {
        validIcon.classList.add('hidden');
        invalidIcon.classList.add('hidden');
        input.classList.remove('input-valid', 'input-invalid');
        return;
    }

    validIcon.classList.toggle('hidden', !isValid);
    invalidIcon.classList.toggle('hidden', isValid);
    input.classList.toggle('input-valid', isValid);
    input.classList.toggle('input-invalid', !isValid);
}

function togglePassword(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const eyeOpen = document.getElementById(fieldId + '-eye-open');
    const eyeClosed = document.getElementById(fieldId + '-eye-closed');
    
    passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
    eyeOpen.classList.toggle('hidden');
    eyeClosed.classList.toggle('hidden');
}

export {
    handleRegister,
    validateEmployeeId,
    validateName,
    validateContactNumber,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    togglePassword
};

window.handleRegister = handleRegister;
window.validateEmployeeId = validateEmployeeId;
window.validateName = validateName;
window.validateContactNumber = validateContactNumber;
window.validateEmail = validateEmail;
window.validatePassword = validatePassword;
window.validateConfirmPassword = validateConfirmPassword;
window.togglePassword = togglePassword;
