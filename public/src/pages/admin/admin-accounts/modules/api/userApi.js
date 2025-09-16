export const UserAPi = {
    async request(endpoint, method, data = null) {
        const config = {
            method,
            headers: {'Content-Type': 'application/json'},
            ...(data && { body: JSON.stringify(data) })
        };
        const response = await fetch(endpoint, config);
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || `Failed to ${method} employee`);
        }
        return await response.json();
    },

    fetchAll() {
        return this.request('/api/users', 'GET');
    },

    update(id, data) {
        return this.request(`/api/update-status/${id}`, 'PUT', {
            employee_id: data.id,
            acc_status : data.status
        });
    }
}