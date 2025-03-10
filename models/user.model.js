const users = [
    {
        id: 1,
        username: 'demo',
        password: 'demo123',
        name: 'Demo User'
    }
];

module.exports = class User {
    constructor(username, password, name) {
        this.username = username;
        this.password = password;
        this.name = name;
    }

    save() {
        this.id = users.length + 1;
        users.push(this);
        return this;
    }

    static findByUsername(username) {
        return users.find(user => user.username === username);
    }

    static validateCredentials(username, password) {
        const user = this.findByUsername(username);
        if (user && user.password === password) {
            return user;
        }
        return null;
    }
};