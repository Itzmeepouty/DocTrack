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

async function getCountbyStatus() {
    const sql = `
        SELECT
            SUM(CASE WHEN status = 'Released(Approved)' THEN 1 ELSE 0 END) AS completed,
            SUM(CASE WHEN status = 'Released(Rejected)' THEN 1 ELSE 0 END) AS rejected,
            SUM(CASE WHEN status IN ('Pending', 'Incoming', 'Signed') THEN 1 ELSE 0 END) AS processing,
            COUNT(*) AS total,
            SUM(
                CASE 
                    WHEN CAST(time_arrived AS DATE) >= DATEADD(DAY, -DATEDIFF(DAY, 0, GETDATE()) % 7, CAST(GETDATE() AS DATE))
                    THEN 1 ELSE 0
                END
            ) AS this_week,
            SUM(
                CASE 
                    WHEN CAST(time_arrived AS DATE) = CAST(GETDATE() AS DATE)
                    THEN 1 ELSE 0
                END
            ) AS today
        FROM (
            SELECT *,
                ROW_NUMBER() OVER (
                    PARTITION BY transactionId 
                    ORDER BY time_arrived DESC, time_performed DESC, ctr DESC
                ) AS rn
            FROM transactions
        ) t
        WHERE rn = 1;
    `;

    try {
        const result = await query(sql);
        return result;
    } catch (error) {
        console.error('Error Counting Transactions:', error);
        throw error;
    }
}

module.exports = {
    tableTransactions,
    getCountbyStatus
};