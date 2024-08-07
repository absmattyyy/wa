const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const MessageHandler = require('../handlers/messageHandler');
const GoogleVision = require('./google-vision');
const fs = require('fs');
const path = require('path');

class WhatsApp {
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth()
        });

        this.client.on('qr', (qr) => {
            qrcode.generate(qr, { small: true });
        });

        this.client.on('ready', () => {
            console.log('WhatsApp Client is ready!');
        });

        this.client.on('message', async (message) => {
            const userId = message.from;
            if (message.hasMedia) {
                const media = await message.downloadMedia();
                const imageBuffer = Buffer.from(media.data, 'base64');
                const labels = await GoogleVision.detectLabels(imageBuffer);
                const text = await GoogleVision.detectText(imageBuffer);
                const response = await MessageHandler.handleMessage(`Bild mit Labels: ${labels.join(', ')} und Text: ${text}`, userId);
                await this.client.sendMessage(userId, response);
            } else {
                const response = await MessageHandler.handleMessage(message.body, userId);
                await this.client.sendMessage(userId, response);
            }
        });
    }

    initialize() {
        this.client.initialize();
    }
}

module.exports = new WhatsApp();