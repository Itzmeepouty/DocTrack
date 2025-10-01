import { OfficeAPI } from "../api/officeApi.js";
import { OfficeState } from "../state/officeState.js";
import { OfficeTable } from "../ui/table.js";
import { ModalManager } from "../ui/modal.js";
import { Toast } from "../../../../../../assets/javascript/toast.js";

export const OfficeManager = {
    async init() {
        try {
            const offices = await OfficeAPI.fetchAll();
            console.log("Fetched offices from API:", offices);

            const normalized = offices.map(o => {
                const id = o.office_id;
                return {
                    id,
                    formattedId: `OFF${String(id).padStart(3, '0')}`,
                    name: o.office_name,
                    abbreviation: o.office_abb,
                    status: o.is_active ? 'active' : 'inactive'
                };
            });

            OfficeState.init(normalized);
            this.table = new OfficeTable();
            this.modal = new ModalManager(this.table);

            this.bindEvents();
            this.table.render();
        } catch (err) {
            Toast.error('Failed to initialize office manager');
            console.error(err);
        }
    },

    applyFilters() {
        const status = document.getElementById('statusFilter')?.value || "";
        const search = document.getElementById('searchInput')?.value.trim().toLowerCase();

        OfficeState.filtered = OfficeState.offices.filter(o => {
            const matchesStatus = !status || o.status === status;
            const matchesSearch =
                !search ||
                o.name.toLowerCase().includes(search) ||
                o.abbreviation.toLowerCase().includes(search) ||
                o.formattedId.toLowerCase().includes(search);

            return matchesStatus && matchesSearch;
        });

        this.table.currentPage = 1;
        this.table.render();
    },

    bindEvents() {
        document.getElementById('openAddOfficeBtn')?.addEventListener('click', () => {
            this.modal.openAdd();
        });

        document.querySelectorAll('#addOfficeModal .modal-close-btn, #updateOfficeModal .modal-close-btn')
            .forEach(btn => btn.addEventListener('click', () => this.modal.closeAll()));

        document.getElementById('officeForm')?.addEventListener('submit', e => this.modal.handleAddSubmit(e));

        document.getElementById('updateOfficeForm')?.addEventListener('submit', e => this.modal.handleUpdateSubmit(e));

        document.querySelector('.overflow-x-auto table')?.addEventListener('dblclick', e => {
            const row = e.target.closest('tr');
            if (!row) return;
            const office = OfficeState.offices.find(o => o.id == row.dataset.officeId);
            if (office) this.modal.openUpdate(office);
        });

        document.getElementById('statusFilter')?.addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('searchInput')?.addEventListener('input', () => {
            this.applyFilters();
        });
    }

};

