export const transactionApi = {
    async request(endpoint, method, data = null) {
        const config = {
            method,
            headers: {'Content-Type': 'application/json'},
            ...(data && { body: JSON.stringify(data) })
        };
        const response = await fetch(endpoint, config);
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || `Failed to ${method} transaction`);
        }
        return await response.json();
    },

    fetchTableData() {
        return this.request('/api/transactions', 'GET');
    }
}