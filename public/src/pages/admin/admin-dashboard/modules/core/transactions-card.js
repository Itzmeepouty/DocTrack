import ApiService from "../constants/api.js";

const TransactionCard = {
    init: function() {
        this.updateCard();
    },

    updateCard: async function() {
        const total = document.getElementById('transactions-total');
        const today =  document.getElementById('transactions-today');
        const this_week = document.getElementById('transactions-week');

        this.setLoadingScreen(total, today, this_week);

        try {
            const transData = await ApiService.fetchTransactionData();

            if(transData.error){
                this.setErrorState(total, today, this_week);
                return;
            }

            const count = Array.isArray(transData) && transData.length > 0 ? transData[0] : null;

            total.textContent = count.total ?? 0;
            today.textContent = count.today ?? 0;
            this_week.textContent = count.this_week ?? 0;
        } catch (error) {
            console.error(error);
            this.setErrorState(total, today, this_week);   
        }  
    },

    setLoadingScreen: function(totalElement, todayElement, weekElement){
        const loading = 'Loading...';

        totalElement.textContent = loading;
        todayElement.textContent = loading;
        weekElement.textContent = loading;
    },

    setErrorState: function(totalElement, todayElement, weekElement) {
        const error = 'Error...';

        totalElement.textContent = error;
        todayElement.textContent = error;
        weekElement.textContent = error;
    }
};

export default TransactionCard;