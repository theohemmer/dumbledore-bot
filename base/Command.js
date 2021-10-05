module.exports = class Command {
    constructor(client, {
        name = null,
        need_intra_mail = true,
        need_user_linked = true,
        help_message = "No help specified"
    })
    {
        this.client = client;
        this.config = { name, need_intra_mail, need_user_linked, help_message };
    }
}