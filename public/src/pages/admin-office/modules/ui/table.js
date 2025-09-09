import { OfficeState } from "../state/officeState.js";

export class OfficeTable {
    constructor() {
        this.currentPage = 1;
        this.rowsPerPage = 5;
    }

    render() {
        const table = document.querySelector('.overflow-x-auto table');
        if (!table) return;

        table.innerHTML = '';
        table.appendChild(this.createHeader());

        const tbody = document.createElement('tbody');
        tbody.id = 'officeTableBody';
        table.appendChild(tbody);

        if (OfficeState.filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center text-sm text-gray-500">No offices found</td></tr>`;
            return;
        }

        this.getPaginatedData().forEach(o => tbody.appendChild(this.createRow(o)));
        this.updatePagination();
    }

    createHeader() {
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr class="bg-gray-50">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Office Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Abbreviation</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>`;
        return thead;
    }

    createRow(office) {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 cursor-pointer';
        row.dataset.officeId = office.id;

        const statusClass = office.status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';

        row.innerHTML = `
            <td class="px-6 py-4">${office.formattedId}</td>
            <td class="px-6 py-4">${office.name}</td>
            <td class="px-6 py-4">${office.abbreviation}</td>
            <td class="px-6 py-4">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}">
                    ${office.status}
                </span>
            </td>`;
        return row;
    }

    getPaginatedData() {
        const start = (this.currentPage - 1) * this.rowsPerPage;
        return OfficeState.filtered.slice(start, start + this.rowsPerPage);
    }

    updatePagination() {
        const totalPages = Math.ceil(OfficeState.filtered.length / this.rowsPerPage);
        const totalItems = OfficeState.filtered.length;

        document.getElementById('totalItems').textContent = totalItems;
        document.getElementById('startItem').textContent = totalItems === 0 ? 0 : (this.currentPage - 1) * this.rowsPerPage + 1;
        document.getElementById('endItem').textContent = Math.min(this.currentPage * this.rowsPerPage, totalItems);

        const pageButtons = document.getElementById('pageButtons');
        pageButtons.innerHTML = '';

        if (totalPages <= 4) {
            for (let i = 1; i <= totalPages; i++) {
                pageButtons.appendChild(this.createPageButton(i));
            }
        } else {
            pageButtons.appendChild(this.createPageButton(1));

            if (this.currentPage > 3) {
                pageButtons.appendChild(this.createEllipsis());
            }

            const start = Math.max(2, this.currentPage - 1);
            const end = Math.min(totalPages - 1, this.currentPage + 1);
            for (let i = start; i <= end; i++) {
                pageButtons.appendChild(this.createPageButton(i));
            }

            if (this.currentPage < totalPages - 2) {
                pageButtons.appendChild(this.createEllipsis());
            }

            pageButtons.appendChild(this.createPageButton(totalPages));
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

    createPageButton(page) {
        const btn = document.createElement('button');
        btn.textContent = page;
        btn.className = `px-3 py-2 rounded ${page === this.currentPage ? 'bg-blue-600 text-white' : 'border'}`;
        btn.onclick = () => {
            this.currentPage = page;
            this.render();
        };
        return btn;
    }

    createEllipsis() {
        const span = document.createElement('span');
        span.textContent = '...';
        span.className = 'px-3 py-2 text-gray-500';
        return span;
    }

}
