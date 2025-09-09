const { query } = require('../db/dbconn.js');

async function getLog(){
    const sql = `select top 5 * from activity_log order by log_id desc`;

    try {
        const result = await query(sql);
        return result;
    } catch (error) {
        console.error('Error fetching logs:', error);
        throw error;
    }
}

module.exports = {
    getLog 
};