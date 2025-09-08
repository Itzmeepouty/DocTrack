export const OfficeState = {
    offices: [],
    filtered: [],

    init(offices = []) {
        this.offices = offices;
        this.filtered = [...offices];
    },

    add(office) {
        this.offices.push(office);
        this.filtered.push(office);
    },

    update(updated) {
        this.offices = this.offices.map(o => o.id === updated.id ? updated : o);
        this.filtered = [...this.offices];
    },

    remove(id) {
        this.offices = this.offices.filter(o => o.id !== id);
        this.filtered = this.filtered.filter(o => o.id !== id);
    }
};
