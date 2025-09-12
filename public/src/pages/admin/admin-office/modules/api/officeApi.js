export const OfficeAPI = {
    async request(endpoint, method, data = null) {
        const config = {
            method,
            headers: { 'Content-Type': 'application/json' },
            ...(data && { body: JSON.stringify(data) })
        };
        const response = await fetch(endpoint, config);
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || `Failed to ${method} office`);
        }
        return await response.json();
    },

    fetchAll() {
        return this.request('/api/offices', 'GET');
    },

    create(data) {
        return this.request('/api/office/create', 'POST', {
            office_name: data.name,
            office_abb: data.abbreviation,
            is_active: data.status === 'active'
        });
    },

    update(id, data) {
        return this.request(`/api/office/update/${id}`, 'PUT', {
            office_name: data.name,
            office_abb: data.abbreviation,
            is_active: data.status === 'active'
        });
    },

    delete(id) {
        return this.request(`/api/office/delete/${id}`, 'DELETE');
    }
};
