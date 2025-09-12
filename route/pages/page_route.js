const express = require('express');
const router = express.Router();
const path = require('path');


/*SPECIAL PAGES (PAGES FOR BOTH CLIENT AND USER)*/

  //System Settings
  router.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/src/pages/settings/settings.html'));
  });

/*LANDING PAGES*/

  //login page 
  router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/src/pages/landing/login/login.html'));
  });

  //signup page
  router.get('/signup', (req, res) =>
    res.sendFile(path.join(__dirname, '../../public/src/pages/landing/register/register.html'))
  );

  //verify page
  router.get('/verify', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/src/pages/landing/verify/verify.html'));
  });

/*CLIENT PAGES*/

  //dashboard page
  router.get('/client/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/src/pages/client/dashboard/dashboard.html'));
  });

/*ADMIN PAGES*/

  //admin dashboard page 
  router.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/src/pages/admin/admin-dashboard/admin-dashboard.html'));
  });

  //accounts managemenet page 
  router.get('/accounts/management', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/src/pages/admin/admin-accounts/accounts-management.html'));
  });

  //office management page
  router.get('/office/management', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/src/pages/admin/admin-office/office-management.html'));
  });

module.exports = router;