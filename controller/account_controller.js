const { getUsers, 
  loginUser, 
  createuser, 
  getUserByEmailOrEmployeeId, 
  verifyUserAccountById,
  getUserCount } = require('../model/account_model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const emailTemplates = require('../templates/email_template.js');

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
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ 
        id: user.employee_id, 
        fname: user.fname, 
        mname: user.name, 
        lname: user.lname,  
        email: user.email,
        office: user.office,
        acc_status: user.acc_status,
        role: user.acc_permission
      },
    process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log(`✅ Login successful for user: ${email}`);
    res.status(200).json({ token, user });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Function to generate a random verification code
function generateVerfication(length = 6) {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let verificationCode = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    verificationCode += characters[randomIndex];
  }
  return verificationCode;
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
    const verification_code = generateVerfication();
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
    await sendVerificationEmail(email, verification_code);
    
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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendVerificationEmail(email, verificationCode) {
  const mailOptions = {
    from: `"DocuTrack" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your DocuTrack Account',
    html: emailTemplates.verificationEmail(email, verificationCode)
  };

  return transporter.sendMail(mailOptions);
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

module.exports = {
  getAllUsers, loginUsercontroller, createUser, verifyuser, GetUserCount
};