import { Toast } from "../../../../../../assets/javascript/toast.js";
import { UserAPi } from "../api/userApi.js";
import { UserState } from "../state/userState.js";

export class ModalManager {
    constructor(table) {
        this.table = table;
        this.updateModal = document.getElementById('updateStatusModal');
        this.deleteModal = document.getElementById('deleteConfirmModal');

        if(this.updateModal) {
            this.updateModal.querySelectorAll('.modal-close-btn').forEach(btn => {
                btn.addEventListener('click', () => this.closeAll());
            });
        }
    }

    openUpdate(user) {
        if (!this.updateModal) return;

        this.updateModal.classList.remove('hidden');

        document.getElementById('employeeIdDisplay').textContent = user.id;
        document.getElementById('employeeNameDisplay').textContent = user.name;
        document.getElementById('employeeEmailDisplay').textContent = user.email;
        document.getElementById('employeeOfficeDisplay').textContent = user.office;
        document.getElementById('employeeRoleDisplay').textContent = user.role;
        document.getElementById('updateEmployeeStatus').value = user.status;

        document.getElementById('deleteEmployeeBtn').onclick = () => {
            this.confirmDelete(user.id);
        }
    }

    async handleUpdateStatus(e) {
        e.preventDefault();

        const id = document.getElementById('employeeIdDisplay').textContent;
        const newStatus = document.getElementById('updateEmployeeStatus').value;

        try {
            const updated = await UserAPi.update(id, { id, status: newStatus });
            const existing = UserState.getById(id);

            UserState.update({
                ...existing,
                status: updated.status.acc_status
            });

            Toast.success("User status updated successfully!");
            this.table.render();
            this.closeAll();
        } catch (err) {
            Toast.error("Failed to update user status");
            console.error(err);
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
                await UserAPi.delete(id);
                UserState.remove(id);
                this.table.render();
                Toast.success('Account deleted successfully')
            } catch (error) {
                Toast.error('Failed to delete account');
                console.error(error);
            } finally {
                modal.classList.add('hidden');
                this.closeAll();
            }
        };
    }

    closeAll() {
        if (this.updateModal) {
            this.updateModal.classList.add('hidden');
            this.updateModal.querySelector('form')?.reset();
        }
    }
}
