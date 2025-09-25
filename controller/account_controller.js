const { getUsers, 
  loginUser, 
  createuser, 
  getUserByEmailOrEmployeeId, 
  verifyUserAccountById,
  getUserCount,
  updateUserStatus,
  deleteUser } = require('../model/account_model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { addToBlacklist } = require('../middleware/blacklist.js');

// Import utility functions
const { emailSender, generators } = require('../utils');

//function to get all users
async function getAllUsers(req, res) {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function GetUserCount(req, res) {
  try {
    const count = await getUserCount();
    res.status(200).json(count);
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

//login controller
async function loginUsercontroller(req, res) {
  const { email, password } = req.body;

  try {
    const user = await loginUser(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passs);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const accessToken = jwt.sign(
      {
        jti: uuidv4(),
        id: user.employee_id,
        fname: user.fname,
        mname: user.mname,
        lname: user.lname,
        email: user.email,
        office: user.office,
        role: user.acc_permission,
        acc_status: user.acc_status
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { id: user.employee_id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTPOnly cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    console.log(`✅ Login successful for user: ${email}`);

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.employee_id,
        email: user.email,
        name: `${user.fname} ${user.lname}`,
        role: user.acc_permission,
        acc_status: user.acc_status
      }
    });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

//logout controller
async function logoutUser(req, res) {
  try {
    const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
    if(token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      addToBlacklist(decoded.jti, decoded.exp);
    }

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function createUser(req, res) {
  const { employee_id, fname, mname, lname, office, email, passs } = req.body;
  
  try {
    const existingUser = await getUserByEmailOrEmployeeId(email, employee_id);
    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email ? 
          'Email already registered' : 
          'Employee ID already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(passs, 10);
    const verification_code = generators.generateVerificationCode();
    const hashedCode = await bcrypt.hash(verification_code, 10);

    const user = {
      employee_id,
      fname,
      mname,
      lname,
      office,
      acc_status: 'unverified',
      is_active: 1,
      acc_permission: 'user',
      email,
      passs: hashedPassword,
      verification_code: hashedCode
    };

    const result = await createuser(user);
    await emailSender.sendVerificationEmail(email, verification_code);
    
    res.status(201).json({ 
      message: 'User created successfully. Please check your email for verification.',
      user: {
        id: user.employee_id,
        email: user.email,
        name: `${user.fname} ${user.lname}`
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

//verify user account controller
async function verifyuser(req, res) {
  const {employee_id, verification_code } = req.body;

  try {
    const result = await verifyUserAccountById(employee_id, verification_code);

    if(!result.success){
      return res.status(400).json({ error: result.message });
    }

    const user = await getUserByEmailOrEmployeeId(null, employee_id);

    return res.status(200).json({
      success: true,
      message: result.message,
      user: user
    });

  } catch (error) {
    console.error('Error verifying account:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

//change User Status
async function updateStatus(req,res) {
  const {id} = req.params;
  const {acc_status} = req.body;

  if(!id || !acc_status) {
    return res.status(400).json ({
      error: 'Missing required field'
    });
  }

  try {
    const result = await updateUserStatus(id, acc_status);
    res.status(201).json({
      message: 'Employee Status Updated',
      status: {
        employee_id: id,
        acc_status: acc_status
      }
    });

  } catch (error) {
    console.error('Error updating employee status:', error);
    res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
}

//delete user account
async function deleteAccount(req, res) {
  const { employee_id } = req.params;

  if (!employee_id) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }

  try {
    const result = await deleteUser(employee_id);

    if (!result) {
      return res.status(500).json({
        error: 'Unexpected error: No result returned from database operation'
      });
    }

    const affectedRows = result.affectedRows || 0;

    return res.status(200).json({
      message: 'Employee deleted successfully',
      affectedRows
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
}

module.exports = {
  getAllUsers,
  loginUsercontroller,
  createUser,
  verifyuser,
  GetUserCount,
  logoutUser,
  updateStatus,
  deleteAccount
};