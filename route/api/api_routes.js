const express = require('express');
const router = express.Router();
const { getAllUsers,
    loginUsercontroller, 
    createUser, 
    verifyuser, 
    GetUserCount } = require('../../controller/account_controller.js');
const { getAllOffices, 
    getAllActiveOffices,
    GetOfficeCount, 
    createOffice, 
    updateOffice, 
    deleteoffice } = require('../../controller/office_controller.js');
const { getAllLogs } = require('../../controller/log_controller.js');

//account management
router.get('/users', getAllUsers);
router.post('/login', loginUsercontroller);
router.post('/signup', createUser);
router.post('/verify',verifyuser);
router.get('/users/count', GetUserCount);


//office management
router.get('/offices',  getAllOffices);
router.get('/offices/active', getAllActiveOffices);
router.get('/offices/count', GetOfficeCount);
router.post('/office/create', createOffice);
router.put('/office/update/:id', updateOffice);
router.delete('/office/delete/:id', deleteoffice);

//log management
router.get('/logs', getAllLogs);

module.exports = router;