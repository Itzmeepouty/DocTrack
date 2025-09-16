import { UserState } from "../state/userState.js";

export class UserTable {
    constructor() {
        this.currentPage = 1;
        this.rowsPerPage = 5;
    }

    render() {
        const table = document.querySelector('.overflow-x-auto table');
        if (!table) return;
        
        table.innerHTML = "";
        table.appendChild(this.createHeader());

        const tbody = document.createElement('tbody');
        tbody.id = 'userTableBody';
        table.appendChild(tbody);

        const paginated = this.getPaginatedData();

        if (paginated.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-sm text-gray-500">No users found</td></tr>`;
        } else {
            paginated.forEach(user => {
                tbody.appendChild(this.createRow(user));
            });
        }

        this.updatePagination();
    }

    createHeader() {
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr class="bg-gray-50">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Office</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
        `;
        return thead;
    }

    createRow(user) {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 cursor-pointer';
        row.dataset.userId = user.id;

        // Status badge
        let statusClass, statusText;
        switch (user.status) {
            case 'activated':
                statusClass = 'bg-green-100 text-green-800';
                statusText = 'Activated';
                break;
            case 'unverified':
                statusClass = 'bg-yellow-100 text-yellow-800';
                statusText = 'Unverified';
                break;
            case 'blocked':
                statusClass = 'bg-red-100 text-red-800';
                statusText = 'Blocked';
                break;
            default:
                statusClass = 'bg-gray-100 text-gray-800';
                statusText = user.status;
        }

        // Role badge
        let roleClass, roleText;
        if (user.role === 'admin') {
            roleClass = 'bg-purple-100 text-purple-800';
            roleText = 'Admin';
        } else {
            roleClass = 'bg-blue-100 text-blue-800';
            roleText = 'User';
        }

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${user.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.email}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.office}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-medium ${roleClass}">${roleText}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}">${statusText}</span>
            </td>
        `;

        return row;
    }

    getPaginatedData() {
        const start = (this.currentPage - 1) * this.rowsPerPage;
        return UserState.filtered.slice(start, start + this.rowsPerPage);
    }

    updatePagination() {
        const totalPages = Math.ceil(UserState.filtered.length / this.rowsPerPage);
        const totalItems = UserState.filtered.length;

        document.getElementById('startItem').textContent = totalItems === 0 ? 0 : (this.currentPage - 1) * this.rowsPerPage + 1;
        document.getElementById('endItem').textContent = Math.min(this.currentPage * this.rowsPerPage, totalItems);
        document.getElementById('totalItems').textContent = totalItems;

        const pageButtons = document.getElementById('pageButtons');
        if (!pageButtons) return;

        pageButtons.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.className = `px-3 py-2 rounded ${i === this.currentPage ? 'bg-blue-600 text-white' : 'border'}`;
            btn.onclick = () => {
                this.currentPage = i;
                this.render();
            };
            pageButtons.appendChild(btn);
        }

        document.getElementById('prevBtn').disabled = this.currentPage === 1;
        document.getElementById('nextBtn').disabled = this.currentPage === totalPages;

        document.getElementById('prevBtn').onclick = () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.render();
            }
        };
        document.getElementById('nextBtn').onclick = () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.render();
            }
        };
    }
}