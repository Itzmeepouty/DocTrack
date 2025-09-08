/**
 * User Table Manager
 * Handles fetching, displaying, and managing user data
 */
export class UserTableManager {
    constructor() {
        this.users = [];
        this.filteredUsers = [];
        this.currentPage = 1;
        this.rowsPerPage = 5;
        
        // Store references to DOM elements
        this.elements = {
            table: null,
            tableContainer: null,
            searchInput: null,
            statusFilter: null,
            startItem: null,
            endItem: null,
            totalItems: null,
            prevBtn: null,
            nextBtn: null,
            pageButtons: null
        };
        
        this.initializeTable();
    }

    async initializeTable() {
        try {
            // Get all DOM element references
            this.getElementReferences();
            
            await this.fetchUsers();
            this.renderTable();
            this.setupEventListeners();
            this.setupGlobalFunctions();
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize table. Please refresh the page.');
        }
    }
    
    getElementReferences() {
        this.elements.table = document.getElementById('userTable');
        this.elements.tableContainer = document.getElementById('tableContainer');
        this.elements.searchInput = document.getElementById('searchInput');
        this.elements.statusFilter = document.getElementById('statusFilter');
        this.elements.startItem = document.getElementById('startItem');
        this.elements.endItem = document.getElementById('endItem');
        this.elements.totalItems = document.getElementById('totalItems');
        this.elements.prevBtn = document.getElementById('prevBtn');
        this.elements.nextBtn = document.getElementById('nextBtn');
        this.elements.pageButtons = document.getElementById('pageButtons');
        
        // Create table if it doesn't exist
        if (!this.elements.table && this.elements.tableContainer) {
            this.elements.table = document.createElement('table');
            this.elements.table.id = 'userTable';
            this.elements.table.className = 'w-full';
            this.elements.tableContainer.appendChild(this.elements.table);
        }
    }

    async fetchUsers() {
        try {
            const response = await fetch('/api/users');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            this.users = data.map(item => ({
                id: item.employee_id,
                fname: item.fname,
                mname: item.mname,
                lname: item.lname,
                office: item.office,
                email: item.email,
                acc_status: item.acc_status,
                is_active: item.is_active,
                acc_permission: item.acc_permission
            }));
            
            this.filteredUsers = [...this.users];
        } catch (error) {
            console.error('Failed to fetch users:', error);
            throw error;
        }
    }

    renderTable() {
        if (!this.elements.table) return;

        this.elements.table.innerHTML = '';
        this.elements.table.appendChild(this.createTableHeader());
        
        const tbody = document.createElement('tbody');
        tbody.id = 'userTableBody';
        this.elements.table.appendChild(tbody);

        if (this.filteredUsers.length === 0) {
            tbody.innerHTML = this.createEmptyState();
            this.updatePaginationControls();
            return;
        }

        this.getPaginatedData().forEach(user => {
            tbody.appendChild(this.createTableRow(user));
        });

        this.updatePaginationControls();
    }

    createTableHeader() {
        const thead = document.createElement('thead');
        thead.innerHTML = `
        <tr class="bg-gray-50">
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Office</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        </tr>
        `;
        return thead;
    }

    createTableRow(user) {
        const row = document.createElement('tr');
        row.className = 'table-row hover:bg-gray-50';
        row.dataset.userId = user.id;
        
        // Status styling
        let statusClass, statusText;
        if (user.acc_status === 'activated') {
            statusClass = 'bg-green-100 text-green-800';
            statusText = 'Activated';
        } else if (user.acc_status === 'unverified') {
            statusClass = 'bg-yellow-100 text-yellow-800';
            statusText = 'Unverified';
        } else if (user.acc_status === 'blocked') {
            statusClass = 'bg-red-100 text-red-800';
            statusText = 'Blocked';
        } else {
            statusClass = 'bg-gray-100 text-gray-800';
            statusText = user.acc_status;
        }

        // Permission styling
        let permissionClass, permissionText;
        if (user.acc_permission === 'admin') {
            permissionClass = 'bg-purple-100 text-purple-800';
            permissionText = 'Admin';
        } else {
            permissionClass = 'bg-blue-100 text-blue-800';
            permissionText = 'User';
        }

        // Full name construction
        const fullName = `${user.fname} ${user.mname ? user.mname + ' ' : ''}${user.lname}`;

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${user.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${fullName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.email}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.office}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-medium ${permissionClass}">
                    ${permissionText}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}">
                    ${statusText}
                </span>
            </td>
        `;

        return row;
    }

    getPaginatedData() {
        const start = (this.currentPage - 1) * this.rowsPerPage;
        return this.filteredUsers.slice(start, start + this.rowsPerPage);
    }

    setupEventListeners() {
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('input', () => this.handleFilter());
        }
        
        if (this.elements.statusFilter) {
            this.elements.statusFilter.addEventListener('change', () => this.handleFilter());
        }
    }

    handleFilter() {
        const searchTerm = this.elements.searchInput?.value.toLowerCase() || '';
        const statusFilter = this.elements.statusFilter?.value || '';

        this.filteredUsers = this.users.filter(user => {
            const fullName = `${user.fname} ${user.mname || ''} ${user.lname}`.toLowerCase();
            const matchesSearch = 
                fullName.includes(searchTerm) || 
                user.id.toLowerCase().includes(searchTerm) || 
                user.email.toLowerCase().includes(searchTerm);
            
            const matchesStatus = !statusFilter || user.acc_status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });

        this.currentPage = 1;
        this.renderTable();
    }

    updatePaginationControls() {
        const totalPages = Math.ceil(this.filteredUsers.length / this.rowsPerPage);
        const startItem = (this.currentPage - 1) * this.rowsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.rowsPerPage, this.filteredUsers.length);

        // Update pagination info
        if (this.elements.startItem) this.elements.startItem.textContent = startItem;
        if (this.elements.endItem) this.elements.endItem.textContent = endItem;
        if (this.elements.totalItems) this.elements.totalItems.textContent = this.filteredUsers.length;

        // Update pagination buttons
        if (this.elements.prevBtn) this.elements.prevBtn.disabled = this.currentPage === 1;
        if (this.elements.nextBtn) this.elements.nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
        
        if (this.elements.pageButtons) {
            this.elements.pageButtons.innerHTML = '';
            
            if (totalPages > 0) {
                this.addPageButton(1, this.elements.pageButtons);

                if (this.currentPage > 3) {
                    const ellipsis = document.createElement('span');
                    ellipsis.className = 'px-3 py-2 text-sm text-gray-500';
                    ellipsis.textContent = '...';
                    this.elements.pageButtons.appendChild(ellipsis);
                }

                const startPage = Math.max(2, this.currentPage - 1);
                const endPage = Math.min(totalPages - 1, this.currentPage + 1);
                
                for (let i = startPage; i <= endPage; i++) {
                    this.addPageButton(i, this.elements.pageButtons);
                }

                if (this.currentPage < totalPages - 2) {
                    const ellipsis = document.createElement('span');
                    ellipsis.className = 'px-3 py-2 text-sm text-gray-500';
                    ellipsis.textContent = '...';
                    this.elements.pageButtons.appendChild(ellipsis);
                }

                if (totalPages > 1) {
                    this.addPageButton(totalPages, this.elements.pageButtons);
                }

                if (this.elements.prevBtn) this.elements.prevBtn.onclick = () => this.prevPage();
                if (this.elements.nextBtn) this.elements.nextBtn.onclick = () => this.nextPage();
            }
        }
    }

    addPageButton(pageNumber, container) {
        const button = document.createElement('button');
        button.className = `pagination-btn px-3 py-2 text-sm rounded-lg ${
            pageNumber === this.currentPage 
                ? 'bg-blue-600 text-white' 
                : 'bg-white bg-opacity-70 border border-gray-200 hover:bg-opacity-90'
        }`;
        button.textContent = pageNumber;
        button.onclick = () => this.goToPage(pageNumber);
        container.appendChild(button);
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredUsers.length / this.rowsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderTable();
        }
    }

    nextPage() {
        this.goToPage(this.currentPage + 1);
    }

    prevPage() {
        this.goToPage(this.currentPage - 1);
    }

    showError(message) {
        if (!this.elements.table) return;
        
        const tbody = document.createElement('tbody');
        tbody.id = 'userTableBody';
        tbody.innerHTML = `
        <tr>
            <td colspan="6" class="px-6 py-4 text-center text-sm text-red-600">
            ${message}
            </td>
        </tr>
        `;
        
        this.elements.table.innerHTML = '';
        this.elements.table.appendChild(this.createTableHeader());
        this.elements.table.appendChild(tbody);
        
        this.updatePaginationControls();
    }

    createEmptyState() {
        return `
        <tr>
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
            No users found
            </td>
        </tr>
        `;
    }

    setupGlobalFunctions() {
        window.UserTableManager = {
            goToPage: (page) => this.goToPage(page),
            nextPage: () => this.nextPage(),
            prevPage: () => this.prevPage()
        };
    }
}

export function initializeUserTable() {
    return new UserTableManager();
}

export default UserTableManager;