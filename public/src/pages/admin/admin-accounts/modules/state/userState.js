export const UserState = {
    users: [],
    filtered: [],

    init(users = []) {
        this.users = users;
        this.filtered = [...users];
    },

    update(updatedUser) {
        this.users = this.users.map(u => u.id === updatedUser.id ? updatedUser : u);
        this.filtered = [...this.users];
    },

    add(user) {
        this.users.push(user);
        this.filtered.push(user);
    },

    remove(userId) {
        this.users = this.users.filter(u => u.id !== userId);
        this.filtered = this.filtered.filter(u => u.id !== userId);
    },

    getById(id) {
        return this.users.find(u => u.id === id);
    }
};