const { query } = require('../db/dbconn.js');
const { insertLog } = require ('../model/log_model.js');

async function getOffices() {
  const sql = 'SELECT * FROM offices';
  try {
    const result = await query(sql);
    return result;
  } catch (error) {
    console.error('Error fetching offices:', error);
    throw error;
  }
}

async function getActiveOffices() {
  const sql = 'select * from offices where is_active = 1 ';
  try{
    const result = await query(sql);
    return result;
  } catch (error) {
    console.error('Error fetching active offices:', error);
    throw error;  
  }
}

async function getOfficeCount() {
  const sql = `
    SELECT 
      SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS active_offices,
      SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) AS inactive_offices,
      COUNT(*) AS total
    FROM offices
  `;

  try {
    const result = await query(sql);

    if (!result || result.length === 0) {
      throw new Error("No records returned from query");
    }

    return {
      active: result[0].active_offices,
      inactive: result[0].inactive_offices,
      total: result[0].total,
    };

  } catch (error) {
    console.error("Error fetching office count:", error);
    throw error;
  }
}

async function insertOffice(office) {
  const sql = `
    INSERT INTO offices (office_name, office_abb, is_active) 
    OUTPUT INSERTED.office_id, INSERTED.office_name, INSERTED.office_abb, INSERTED.is_active
    VALUES (@office_name, @office_abb, @is_active)
  `;

  if (!office) {
    throw new Error('Office data required');
  }

  try {
    const result = await query(sql, {
      office_name: office.office_name,
      office_abb: office.office_abb,
      is_active: office.is_active
    });

    await insertLog(
      'New Office Created',
      `Office ${office.office_name}(${office.office_abb}) has been created`,
      'Created'
    );

    return result;
  } catch (error) {
    if (error.message.includes('duplicate key')) {
      throw new Error('Office with this name or abbreviation already exists');
    }
    throw new Error('Error inserting office: ' + error.message);
  }
}


async function statusCalibrate(office_id, office_name, office_abb, is_active) {
  if (!office_id || !office_name || !office_abb || typeof is_active !== 'boolean') {
    throw new Error('Invalid office data provided');
  }

  const officeId = typeof office_id === 'string' && office_id.startsWith('OFF') ? 
                   parseInt(office_id.replace('OFF',''), 10) : office_id;

  const sql = `
    UPDATE offices 
    SET office_name = @office_name, 
        office_abb = @office_abb, 
        is_active = @is_active 
    WHERE office_id = @office_id
  `;

  try {
    const result = await query(sql, {
      office_name: office_name,
      office_abb: office_abb,
      is_active: is_active,
      office_id: officeId
    });

    await insertLog('Office Updated',
      `Office ${office_name}(${office_abb}) has been updated`,
      'Updated');

    return result;
  } catch (error) {
    throw new Error('Error Updating Office: ' + error.message);
  }
}

async function deleteOffice(office_id) {
  if (!office_id) {
    throw new Error(`Office ID is required for deletion`);
  }

  const sql = `
    DELETE FROM offices 
    WHERE office_id = @office_id
  `;

  try {
    const result = await query(sql, { office_id });

    await insertLog(
      'Office Deleted',
      `Office with ID ${office_id} has been deleted`,
      'Deleted');
      
    return {
      affectedRows: result?.affectedRows || 0,
      rowCount: result?.rowCount || 0,
      ...result
    };
  } catch (error) {
    console.error('Error deleting office:', error);
    throw new Error('Error deleting office: ' + error.message);
  }
}

module.exports = {
  getOffices,
  getActiveOffices,
  getOfficeCount,
  insertOffice,
  statusCalibrate,
  deleteOffice
};