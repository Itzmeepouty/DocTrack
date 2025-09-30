const { tableTransactions,
    getCountbyStatus
 } = require('../model/transaction_model.js');

async function getTableTransactions(req, res) {
    try {
        const transactions = await tableTransactions();
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error retrieving transactions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getTransactionCount(req, res){
    try {
        const count  = await getCountbyStatus();
        res.status(200).json(count);
    } catch (error) {
        console.error('Error retrieving transaction count:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

module.exports = {
    getTableTransactions,
    getTransactionCount
};