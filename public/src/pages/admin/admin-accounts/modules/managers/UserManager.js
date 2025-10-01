import { UserAPi } from "../api/userApi.js";
import { UserState } from "../state/userState.js";
import { UserTable } from "../ui/table.js";
import { ModalManager } from "../ui/modal.js";
import { Toast } from "../../../../../../assets/javascript/toast.js";

export const UserManager = {
    async init() {
        try {
            const users = await UserAPi.fetchAll();
            console.log("Fetched users:", users);

            const normalized = users.map(u => ({
                id: u.employee_id,
                name: `${u.fname} ${u.mname ? u.mname + ' ' : ''}${u.lname}`,
                email: u.email,
                office: u.office,
                role: u.acc_permission,
                status: u.acc_status
            }));

            UserState.init(normalized);

            this.table = new UserTable();
            this.modal = new ModalManager(this.table);

            this.bindEvents();
            this.table.render();
        } catch (err) {
            Toast.error('Failed to initialize user manager');
            console.error(err);
        }
    },

    applyFilters() {
        const status = document.getElementById('statusFilter')?.value || "";
        const search = document.getElementById('searchInput')?.value.trim().toLowerCase();

        UserState.filtered = UserState.users.filter(u => {
            const matchesStatus = !status || u.status === status;
            const matchesSearch =
                !search ||
                u.name.toLowerCase().includes(search) ||
                u.email.toLowerCase().includes(search) ||
                u.office.toLowerCase().includes(search);

            return matchesStatus && matchesSearch;
        });

        this.table.currentPage = 1;
        this.table.render();
    },

    bindEvents() {

        document.getElementById('updateEmployeeForm')?.addEventListener('submit', e => this.modal.handleUpdateStatus(e));
        
        document.getElementById('statusFilter')?.addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('searchInput')?.addEventListener('input', () => {
            this.applyFilters();
        });

        document.querySelector('.overflow-x-auto table')?.addEventListener('dblclick', e => {
            const row = e.target.closest('tr');
            if (!row) return;
            const user = UserState.getById(row.dataset.userId);
            if (user) this.modal.openUpdate(user);
        });
    }
};
