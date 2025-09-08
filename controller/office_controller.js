const { getOffices, 
  getActiveOffices, 
  getOfficeCount, 
  insertOffice,
  statusCalibrate,
  deleteOffice } = require('../model/office_model.js');

async function getAllOffices(req, res) {
  try {
    const offices = await getOffices();
    res.status(200).json(offices);
  } catch (error) {
    console.error('Error fetching offices:', error);
  }
}

async function getAllActiveOffices(req, res) {
  try {
    const activeOffices = await getActiveOffices();
    res.status(200).json(activeOffices);
  } catch (error) {
    console.error('Error fetching active offices:', error);
  }
}

async function GetOfficeCount(req, res) {
  try {
    const officeCount = await getOfficeCount();
    res.status(200).json(officeCount);
  } catch (error) {
    console.error('Error fetching office count:', error);
  }
} 

async function createOffice(req, res) {
  const office = req.body;

  if (!office.office_name || !office.office_abb) {
    return res.status(400).json({ error: 'Office name and abbreviation are required' });
  }

  try {
    const result = await insertOffice(office);
    res.status(201).json({ 
      message: 'Office created successfully', 
      office: result[0]
    });
  } catch (error) {
    console.error('Error creating office:', error);
    if (error.message.includes('already exists')) {
      return res.status(409).json({ error: error.message }); 
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function updateOffice(req, res) {
  const { id } = req.params;
  const {office_name, office_abb, is_active} = req.body;

  if (!id || !office_name || !office_abb || typeof is_active !== 'boolean') {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try{ 
    const result = await statusCalibrate(id, office_name, office_abb, is_active);
    res.status(201).json({
      message : 'Office updated successfully',
      office : result
    });
  } catch (error) {
    console.error('error updating office:', error);
    res.status(500).json({error: error.message || 'Internal Server Error'});
  }
}

async function deleteoffice(req, res) {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ error: 'Office ID is required' });
  }

  try {
    const result = await deleteOffice(id);

    // Add defensive checks to ensure result exists
    if (!result) {
      return res.status(500).json({ 
        error: 'Unexpected error: No result returned from database operation'
      });
    }

    // Check if any rows were affected (office was found and deleted)
    const affectedRows = result.affectedRows || 0;
    
    // SUCCESS CASE: If rows were affected, office was deleted
    if (affectedRows > 0) {
      return res.status(200).json({ 
        message: 'Office deleted successfully',
        affectedRows: affectedRows
      });
    }
    
    // If no rows were affected, office was not found
    // But since this is a DELETE operation, we should still return 200
    // because the desired state (office not existing) has been achieved
    return res.status(200).json({ 
      message: 'Office Successfully deleted',
      affectedRows: 0
    });
    
  } catch (error) {
    console.error('Error deleting office:', error);
    res.status(500).json({ 
      error: error.message || 'Internal Server Error'
    });
  }
}

module.exports = {
  getAllOffices, 
  getAllActiveOffices,
  GetOfficeCount,
  createOffice,
  updateOffice,
  deleteoffice
};