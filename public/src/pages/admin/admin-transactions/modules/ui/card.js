import { transactionApi } from "../api/transactionApi.js";

const Card ={
    init: function(){
        this.updateCard();
    },

    updateCard: async function() {
        const totalTransaction = document.getElementById('totalTransactions');
        const completedTransaction = document.getElementById('completedTransactions');
        const rejectedTransaction = document.getElementById('cancelledTransactions');
        const processingTransaction = document.getElementById('processingTransactions');
    
        this.setLoadingState(totalTransaction, completedTransaction, rejectedTransaction, processingTransaction);

        try {
            const data = await transactionApi.fetchTransactionCount();
            console.log("Transaction count response:", data);

            const counts = Array.isArray(data) && data.length > 0 ? data[0] : null;

            if (!counts) {
                this.setErrorState(totalTransaction, completedTransaction, rejectedTransaction, processingTransaction);
                return;
            }

            totalTransaction.textContent = counts.total ?? 0;
            completedTransaction.textContent = counts.completed ?? 0;
            rejectedTransaction.textContent = counts.rejected ?? 0;
            processingTransaction.textContent = counts.processing ?? 0;
        } catch (error) {
            console.error(error);
            this.setErrorState(totalTransaction, completedTransaction, rejectedTransaction, processingTransaction);
        }
    },

    setLoadingState: function(totalElement, completedElement, rejectedElement, processingElement) {
        const loadingTxt = 'Loading...';
        totalElement.textContent = loadingTxt;
        completedElement.textContent = loadingTxt;
        rejectedElement.textContent = loadingTxt;
        processingElement.textContent = loadingTxt;
    },

    setErrorState: function(totalElement, completedElement, rejectedElement, processingElement) {
        const errorTxt = 'Error...';
        totalElement.textContent = errorTxt;
        completedElement.textContent = errorTxt;
        rejectedElement.textContent = errorTxt;
        processingElement.textContent = errorTxt;
    },
};

export default Card;