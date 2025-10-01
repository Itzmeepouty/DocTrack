// Centralized API service for all HTTP requests
const ApiService = {
    // Offices endpoints
    fetchOfficesData: async function() {
        try {
            const response = await fetch(`/api/offices/count`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching offices data:', error);
            return {
                error: true,
                message: error.message
            };
        }
    },
    
    // Users endpoints
    fetchUserData: async function() {
        try {
            const response = await fetch('/api/users/count');

            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }   

            return await response.json();
        } catch (error) {
            console.error('Error fetching user data:', error);
            return {
                error: true,
                message: error.message
            };
        }
    },

    fetchTransactionData: async function() {
        try {
            const response = await fetch('/api/transaction/count');
            if(!response.ok) {
                throw new Error(`HTTP error :  ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching transactions: ', error);
            return {
                error: true,
                message: error.message
            };
        }
    },
    
    // Activity logs endpoints
    fetchLogs: async function() {
        try {
            const response = await fetch('/api/logs');

            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching logs:', error);
            return {
                error: true,
                message: error.message
            };
        }
    }
};

export default ApiService;