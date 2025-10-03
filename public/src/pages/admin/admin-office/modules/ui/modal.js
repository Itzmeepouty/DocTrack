import { Toast } from '../../../../../../assets/javascript/toast.js';
import { OfficeAPI } from "../api/officeApi.js";
import { OfficeState } from "../state/officeState.js";

export class ModalManager {
    constructor(table) {
        this.table = table;
        this.addModal = document.getElementById('addOfficeModal');
        this.updateModal = document.getElementById('updateOfficeModal');
        this.deleteModal = document.getElementById('deleteConfirmModal');
    }

    openAdd() {
        this.addModal.classList.remove('hidden');
    }

    async handleAddSubmit(e) {
        e.preventDefault();
        const data = {
            name: document.getElementById('officeName').value.trim(),
            abbreviation: document.getElementById('officeAbbr').value.trim().toUpperCase(),
            status: document.getElementById('officeStatus').value
        };

        try {
            const res = await OfficeAPI.create(data);

            const created = res.office;
            const id = created.office_id;

            OfficeState.add({
                id,
                formattedId: `OFF${String(id).padStart(3, '0')}`,
                name: created.office_name ?? data.name,
                abbreviation: created.office_abb ?? data.abbreviation,
                status: created.is_active ? 'active' : data.status
            });

            this.closeAll();
            Toast.success('Office created successfully');
            this.table.render();
        } catch (err) {
            Toast.error(err.message);
        }
    }

    openUpdate(office) {
        this.updateModal.classList.remove('hidden');
        document.getElementById('OfficeId').textContent = office.formattedId;
        document.getElementById('updateOfficeName').value = office.name;
        document.getElementById('updateOfficeAbbr').value = office.abbreviation;
        document.getElementById('updateOfficeStatus').value = office.status;

        document.getElementById('deleteOfficeBtn').onclick = () => {
            this.confirmDelete(office.id);
        };
    }

    async handleUpdateSubmit(e) {
        e.preventDefault();
        const id = parseInt(document.getElementById('OfficeId').textContent.replace(/\D/g,''), 10);
        const data = {
            name: document.getElementById('updateOfficeName').value.trim(),
            abbreviation: document.getElementById('updateOfficeAbbr').value.trim().toUpperCase(),
            status: document.getElementById('updateOfficeStatus').value
        };
        try {
            await OfficeAPI.update(id, data);
            OfficeState.update({ id, formattedId: `OFF${String(id).padStart(3,'0')}`, ...data });
            this.closeAll();
            Toast.success('Office updated successfully');
            this.table.render();
        } catch (err) {
            Toast.error(err.message);
        }
    }

    async confirmDelete(id) {
        const modal = document.getElementById('deleteConfirmModal');
        modal.classList.remove('hidden');

        document.getElementById('cancelDeleteBtn').onclick = () => {
            modal.classList.add('hidden');
        };

        document.getElementById('confirmDeleteBtn').onclick = async () => {
            try {
                await OfficeAPI.delete(id);
                OfficeState.remove(id);
                this.table.render();
                Toast.success('Office deleted successfully');
            } catch (err) {
                Toast.error('Failed to delete office');
                console.error(err);
            } finally {
                modal.classList.add('hidden');
                this.closeAll();
            }
        };
    }

    closeAll() {
        [this.addModal, this.updateModal, this.deleteModal].forEach(m => m?.classList.add('hidden'));
        if (this.addModal) this.addModal.querySelector('form')?.reset();
        if (this.updateModal) this.updateModal.querySelector('form')?.reset();
    }
}
