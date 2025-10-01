import { transactionApi } from "../api/transactionApi.js";
import { TransactionState } from "../state/transactionState.js";
import { TransactionTable } from "../ui/table.js";


export const TransactionManager = {
    async init() {
        try {
            const transactions = await transactionApi.fetchTableData();
            console.log("Fetched transactions:", transactions);
            
            const normalized = transactions.map(t => ({
                id: t.transactionId,
                date: t.date_created,
                description: t.description,
                primaryAction: t.primaryAction,
                status: t.status,
                email_to_notify: t.email_to_notify,
                remark: t.remarks ?? "",
                confidential: t.is_confidential
            }));

            TransactionState.init(normalized);

            this.table = new TransactionTable();
            
            //for the modal

            this.bindEvents();
            this.table.render();
        } catch (err) {
            Toast.error('Failed to initialize transaction manager');
            console.error(err);
        }
    },

    applyFilters() {
        const status = document.getElementById('statusFilter')?.value || "";
        const search = document.getElementById('searchInput')?.value.trim().toLowerCase();
        const dateFrom = document.getElementById('dateFromInput')?.value;
        const dateTo = document.getElementById('dateToInput')?.value;

        TransactionState.filtered = TransactionState.transactions.filter(t => {
            const matchesStatus = !status || t.status === status;
            const matchesSearch =
                !search ||
                t.description.toLowerCase().includes(search) ||
                t.primaryAction.toLowerCase().includes(search) ||
                t.email_to_notify.toLowerCase().includes(search);

            const tDate = new Date(t.date);
            const matchesDate =
                (!dateFrom || tDate >= new Date(dateFrom)) &&
                (!dateTo || tDate <= new Date(dateTo));

            return matchesStatus && matchesSearch && matchesDate;
        });

        this.table.currentPage = 1;
        this.table.render();
    },

    bindEvents() {
        //modal

        document.getElementById('statusFilter')?.addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('searchInput')?.addEventListener('input', () => {
            this.applyFilters();
        });

        const dateFromEl = document.getElementById('dateFromInput');
        const dateToEl = document.getElementById('dateToInput');

        dateFromEl?.addEventListener('change', () => {
            dateToEl.min = dateFromEl.value; // Prevent picking before from date
            this.applyFilters();
        });

        dateToEl?.addEventListener('change', () => {
            dateFromEl.max = dateToEl.value; // Prevent picking after to date
            this.applyFilters();
        });

        //for the modal
   }
};