export const TransactionState = {
    transactions: [],
    filtered: [],

    init(transactions = []) {
        this.transactions = transactions;
        this.filtered = [...transactions];
    },

    update(updatedTransaction) {
        this.transactions = this.transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t);
        this.filtered = [...this.transactions];
    },

    add(transaction) {
        this.transactions.push(transaction);
        this.filtered.push(transaction);
    },

    remove(transactionId) {
        this.transactions = this.transactions.filter(t => t.id !== transactionId);
        this.filtered = this.filtered.filter(t => t.id !== transactionId);
    },

    getById(id) {
        return this.transactions.find(t => t.id === id);
    }
};