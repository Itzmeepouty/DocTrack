const { verify } = require('jsonwebtoken');
const { query } = require('../db/dbconn.js');
const bcrypt = require('bcryptjs');

async function getUsers() {
  const sql = `SELECT s.employee_id, 
    s.fname, 
    s.mname, 
    s.lname,
    o.office_abb as office,
    s.acc_status,
    s.is_active,
    s.acc_permission,
    s.email FROM staffs s join offices o on s.office = o.office_id 
    where employee_id != 'emp-20250001'`;
  try {
    const result = await query(sql);
    return result;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

async function getUserCount() {
  const sql = `SELECT 
    SUM(CASE WHEN acc_status = 'activated' then 1 else 0 end) AS active_accounts,
    SUM(CASE WHEN acc_status = 'unverified' then 1 else 0 end) AS unverified_users,
    COUNT(*) AS total FROM staffs
    where acc_permission != 'admin'`;

  try {
    const result= await query(sql);

    if(!result || result.length === 0) {
      throw new Error("No records returned from query");
    }

    return {
      activated: result[0].active_accounts,
      unverified: result[0].unverified_users,
      total: result[0].total
    };
  } catch(error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
}

async function loginUser(email) {
  const sql = 'SELECT * FROM staffs WHERE email = @email';

  const rows = await query(sql, { email });
  return rows.length ? rows[0] : null;
}

async function createuser(user) {
  const sql = 'INSERT INTO staffs (employee_id, fname, mname, lname, office, acc_status, is_active, acc_permission, email, passs, verification_code) VALUES (@employee_id, @fname, @mname, @lname, @office, @acc_status, @is_active, @acc_permission, @email, @passs, @verification_code)';
  
  try {
    const result = await query(sql, user);

    const officeQuery = 'SELECT office_name FROM offices WHERE office_id = @office';
    const officeResult = await query(officeQuery, user);
    
    let officeName = 'Unknown Office';
    
    if (officeResult && officeResult.recordset && officeResult.recordset[0]) {
      officeName = officeResult.recordset[0].office_name;
    } else if (officeResult && officeResult[0]) {
      officeName = officeResult[0].office_name;
    } else if (officeResult && officeResult.office_name) {
      officeName = officeResult.office_name;
    }
    
    const currentTime = new Date().toISOString();
    const log_sql = `INSERT INTO activity_log (log_title, log_desc, log_type, created_datetime) 
      VALUES ('New User Account Created', CONCAT(@fname, ' ', @mname, ' ',  @lname, ' (${officeName}) - ID : ', @employee_id), 'Created', @currentTime)`;
    
    await query(log_sql, user);
    
    return result;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function getUserByEmailOrEmployeeId(email, employee_id) {
  const sql = 'SELECT * FROM staffs WHERE email = @email OR employee_id = @employee_id';
  
  try {
    const result = await query(sql, { email, employee_id });
    return result.length ? result[0] : null;
  } catch (error) {
    console.error('Error checking existing user:', error);
    throw error;
  }
}

async function verifyUserAccountById(employee_id, inputCode) {
  const getSql = 'SELECT verification_code FROM staffs WHERE employee_id = @employee_id';

  try {
    const result = await query(getSql, { employee_id });

    if (!result.length) {
      return { success: false, message: 'User not found' };
    }

    const hashedCode = result[0].verification_code;

    const isMatch = await bcrypt.compare(inputCode, hashedCode);

    if (!isMatch) {
      return { success: false, message: 'Invalid verification code' };
    }

    const updateSql = `
      UPDATE staffs 
      SET acc_status = 'activated', verification_code = NULL 
      WHERE employee_id = @employee_id
    `;

    await query(updateSql, { employee_id });

    const currentTime = new Date().toISOString();
    const log_sql = `INSERT INTO activity_log (log_title, log_desc, log_type, created_datetime) 
                    VALUES ('User Account Verification', 'Account (${employee_id}) is Verified', 'Verified', @currentTime)`;
    
    await query(log_sql);

    return { success: true, message: 'Account verified successfully' };

  } catch (error) {
    console.error('Error verifying account:', error);
    throw error;
  }
}

async function updateUserStatus(employee_id, acc_status) {
  if(!acc_status || !employee_id) {
    throw new Error('Invalid data provided');
  }

  const sql =`update staffs set acc_status = @acc_status where employee_id = @employee_id`;

  try {
    const result = await query(sql, {
      employee_id: employee_id,
      acc_status: acc_status
    });

    const currentTime = new Date().toISOString();
    const log_sql = `
      insert into activity_log (log_title, log_desc, log_type, created_datetime)
      values ('Employee Status Updated', 'Employee ${employee_id} status has been updated', 'Updated', @currentTime)
    `;

    await query(log_sql, {currentTime});

    return result;
  } catch (error) {
    throw new Error('Error Updating Status: ', + error.message);
  }
}

async function deleteUser(employee_id) {
  if (!employee_id) {
    throw new Error(`Employee not found`);
  }

  const sql = `DELETE FROM staffs WHERE employee_id = @employee_id`;

  try {
    const result = await query(sql, { employee_id });

    const log_sql = `
      INSERT INTO activity_log (log_title, log_desc, log_type, created_datetime)
      VALUES (@log_title, @log_desc, @log_type, @currentTime)
    `;

    const currentTime = new Date().toISOString();
    await query(log_sql, {
      log_title: 'Employee Account Deleted',
      log_desc: `Account ${employee_id} has been deleted`,
      log_type: 'Deleted',
      currentTime
    });

    return {
      affectedRows: result?.affectedRows || 0,
      rowCount: result?.rowCount || 0,
      ...result
    };
  } catch (error) {
    console.error('Error deleting Employee account:', error);
    throw new Error('Error deleting Employee account: ' + error.message);
  }
}


module.exports = {
  getUsers, 
  loginUser, 
  createuser,
  getUserByEmailOrEmployeeId,
  verifyUserAccountById,
  getUserCount,
  updateUserStatus,
  deleteUser
};