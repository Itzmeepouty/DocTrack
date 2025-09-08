import ApiService from "../constants/api.js";

const UsersCard = {
    init: function() {
        this.updateCard();
    },
    
    updateCard: async function() {
        const totalUserElement = document.getElementById('accounts-total');
        const activeUserElement = document.getElementById('accounts-active');
        const inactiveUserElement = document.getElementById('accounts-inactive');

        // Set loading state
        this.setLoadingState(totalUserElement, activeUserElement, inactiveUserElement);

        const userData = await ApiService.fetchUserData();

        if (userData.error) {
            this.setErrorState(totalUserElement, activeUserElement, inactiveUserElement);
            return;
        }

        // Update UI with data
        totalUserElement.textContent = userData.total;
        activeUserElement.textContent = `Activated: ${userData.activated}`;
        inactiveUserElement.textContent = `Unverified: ${userData.unverified}`;
    },
    
    setLoadingState: function(totalEl, activeEl, inactiveEl) {
        totalEl.textContent = 'Loading...';
        activeEl.textContent = 'Activated: Loading...';
        inactiveEl.textContent = 'Unverified: Loading...';
    },
    
    setErrorState: function(totalEl, activeEl, inactiveEl) {
        totalEl.textContent = "0";
        activeEl.textContent = "Activated: 0";
        inactiveEl.textContent = "Unverified: 0";
    }
};

export default UsersCard;