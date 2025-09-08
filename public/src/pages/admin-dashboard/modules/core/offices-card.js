import ApiService from "../constants/api.js";

const OfficesCard = {
    init: function() {
        this.updateCard();
    },
    
    updateCard: async function() {
        const totalOfficesElement = document.getElementById('offices-total');
        const activeOfficesElement = document.getElementById('offices-active');
        const inactiveOfficesElement = document.getElementById('offices-inactive');

        // Set loading state
        this.setLoadingState(totalOfficesElement, activeOfficesElement, inactiveOfficesElement);
        
        const officesData = await ApiService.fetchOfficesData();
        
        if (officesData.error) {
            this.setErrorState(totalOfficesElement, activeOfficesElement, inactiveOfficesElement);
            return;
        }
        
        // Update UI with data
        totalOfficesElement.textContent = officesData.total;
        activeOfficesElement.textContent = `Active: ${officesData.active}`;
        inactiveOfficesElement.textContent = `Inactive: ${officesData.inactive}`;
    },
    
    setLoadingState: function(totalEl, activeEl, inactiveEl) {
        totalEl.textContent = 'Loading...';
        activeEl.textContent = 'Active: Loading...';
        inactiveEl.textContent = 'Inactive: Loading...';
    },
    
    setErrorState: function(totalEl, activeEl, inactiveEl) {
        totalEl.textContent = 'Error';
        activeEl.textContent = 'Active: Error';
        inactiveEl.textContent = 'Inactive: Error';
    }
};

export default OfficesCard;