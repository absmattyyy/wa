const Conversation = require('../core/conversation');

class MessageHandler {
    constructor() {
        this.conversation = new Conversation();
    }

    async handleMessage(message, userId) {
        const response = await this.conversation.handleMessage(message, userId);
        return response;
    }
}

module.exports = new MessageHandler();