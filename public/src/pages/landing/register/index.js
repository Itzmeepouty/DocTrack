/**
 * Main Entry Point
 * 
 * Initializes all modules and sets up:
 * - AOS animations
 * - Office module functionality
 * - Form submission handling
 */

import { initOfficeModule, fetchOffices } from './modules/office_module.js';
import { handleRegister } from './modules/form_handler.js';

// Initialize AOS
AOS.init({
    duration: 1200,
    easing: 'ease-out',
    once: true,
    mirror: false,
    offset: 50
});

document.addEventListener('DOMContentLoaded', async () => {
  initOfficeModule();

  const loadedOffices = await fetchOffices();

  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', (e) => {handleRegister(e, loadedOffices)});
  }
});
