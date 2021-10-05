const { Account } = require("./Account.js")

module.exports = class User {
    constructor(uuid, intra_mail, account = null) {
        this.uuid = uuid;
        this.intra_mail = intra_mail;
        this.account = account;
    }
    getUUID() {
        return this.uuid;
    }
    getIntraMail() {
        return this.intra_mail;
    }
    getAccount() {
        return this.account;
    }
}