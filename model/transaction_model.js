const { query } = require('../db/dbconn.js');

async function tableTransactions() {
    const sql = `
    SELECT transactionId,
        FORMAT(date_created, 'MM-dd-yyyy') as date_created,
        description,
        primaryAction,
        case
            when status in ('Pending', 'Incoming', 'Signed') then 'Processing' else status
        end as status,
        email_to_notify,
        remarks,
        is_confidential
        FROM (
            SELECT *,
                ROW_NUMBER() OVER (PARTITION BY transactionId ORDER BY time_arrived DESC, time_performed DESC, ctr DESC) as rn
            FROM transactions
        ) t
        WHERE rn = 1;
    `;

    try {
        const result = await query(sql);
        return result;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
}

module.exports = {
    tableTransactions
};