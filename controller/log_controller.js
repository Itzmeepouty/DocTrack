const { getLog } = require('../model/log_model.js');

//function to get all logs
async function getAllLogs(erq, res) {
    try {
        const log  = await getLog();
        res.status(200).json(log);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Internal Server Error' });   
    }
}

module.exports = {
    getAllLogs
};