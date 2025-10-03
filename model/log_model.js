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

async function insertLog(title, description, type) {
    const sql = `
        insert into activity_log (log_title, log_desc, log_type, created_datetime)
        values (@title, @description, @type, @currentTime)
    `;

    const currentTime = new Date().toISOString();

    try {
        await query(sql,{
            title, 
            description,
            type,
            currentTime
        });
    } catch (error) {
        console.error('Error inserting log:', error);
        throw error;
    }
}

module.exports = {
    getLog,
    insertLog
};