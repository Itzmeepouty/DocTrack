import { TransactionState } from "../state/transactionState.js";

export class TransactionTable {
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
        tbody.id = 'transactionTableBody';
        table.appendChild(tbody);

        const paginated = this.getPaginatedData();

        if (paginated.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-sm text-gray-500">No transactions found</td></tr>`;
        } else {
            paginated.forEach(transaction => {
                tbody.appendChild(this.createRow(transaction));
            });
        }
        this.updatePagination();
    }

    createHeader() {
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr class="bg-gray-50">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Created</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Desired Action</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email to Notify</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
            </tr>
        `;
        return thead;
    }

    createRow(transaction) {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 cursor-pointer';
        row.dataset.transactionId = transaction.id;

        let statusClass, statusText;
        switch (transaction.status) {
            case 'Processing':
                statusClass = 'bg-yellow-100 text-yellow-800';
                statusText = 'Processing';
                break;
            case 'Released(Approved)':
                statusClass = 'bg-green-100 text-green-800';
                statusText = 'Approved';
                break;
            case 'Released(Rejected)':
                statusClass = 'bg-red-100 text-red-800';
                statusText = 'Rejected';
                break;
        }

        const mask = val => '*****';
        const isConfidential = transaction.confidential === true;
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${transaction.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${isConfidential ? mask(transaction.date): transaction.date}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${isConfidential ? mask(transaction.description): transaction.description}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${isConfidential ? mask(transaction.primaryAction):transaction.primaryAction}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}">${statusText}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${isConfidential ? mask(transaction.email_to_notify):transaction.email_to_notify}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${isConfidential ? mask(transaction.remark):transaction.remark}</td>
        `;

        return row;
    }

    getPaginatedData() {
        const start = (this.currentPage - 1) * this.rowsPerPage;
        return TransactionState.filtered.slice(start, start + this.rowsPerPage);
    }

    updatePagination() {
        const totalPages = Math.ceil(TransactionState.filtered.length / this.rowsPerPage);
        const totalItems = TransactionState.filtered.length;

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