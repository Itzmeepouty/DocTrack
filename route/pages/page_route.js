const express = require('express');
const router = express.Router();
const path = require('path');

//login page 
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/src/pages/login/login.html'));
});

//dashboard page
router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/src/pages/dashboard/dashboard.html'));
});

//admin dashboard page 
router.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/src/pages/admin-dashboard/admin-dashboard.html'));
});

//signup page
router.get('/signup', (req, res) =>
  res.sendFile(path.join(__dirname, '../../public/src/pages/register/register.html'))
);

//verify page
router.get('/verify', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/src/pages/verify/verify.html'));
});

//office management page
router.get('/office/management', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/src/pages/admin-office/office-management.html'));
});

//accounts managemenet page 
router.get('/accounts/management', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/src/pages/admin-accounts/accounts-management.html'));
});


//sample for testing
router.get('/sample', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/src/pages/sample/sample.html'));
});

module.exports = router;