const { tableTransactions } = require('../model/transaction_model.js');

async function getTableTransactions(req, res) {
    try {
        const transactions = await tableTransactions();
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error retrieving transactions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getTableTransactions
};