import { Toast } from "./toast.js";
import { UserAPi } from "../api/userApi.js";
import { UserState } from "../state/userState.js";

export class ModalManager {
    constructor(table) {
        this.table = table;
        this.updateModal = document.getElementById('updateStatusModal');

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
    }

    async handleUpdateStatus(e) {
        e.preventDefault();

        const id = document.getElementById('employeeIdDisplay').textContent;
        const newStatus = document.getElementById('updateEmployeeStatus').value;

        try {
            const updated = await UserAPi.update(id, { id, status: newStatus });

            // Update state with normalized object
            UserState.update({
                id: updated.employee_id,
                name: `${updated.fname} ${updated.mname ? updated.mname + ' ' : ''}${updated.lname}`,
                email: updated.email,
                office: updated.office,
                role: updated.acc_permission,
                status: updated.acc_status
            });

            this.table.render();
            Toast.success("User status updated successfully!");
            this.closeAll();
        } catch (err) {
            Toast.error("Failed to update user status");
            console.error(err);
        }
    }

    closeAll() {
        if (this.updateModal) {
            this.updateModal.classList.add('hidden');
            this.updateModal.querySelector('form')?.reset();
        }
    }
}
