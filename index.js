require('dotenv').config();
const express = require('express');
const WhatsApp = require('./src/services/whatsapp');
const MessageHandler = require('./src/handlers/messageHandler');
const OpenAI = require('./src/services/openai');
const TTS = require('./src/services/tts');
const LocalInfoService = require('./src/services/localInfo');
const GoogleVision = require('./src/services/google-vision');
const Encryption = require('./src/services/encryption');
const Logging = require('./src/services/logging');
const NLP = require('./src/services/nlp');
const personality = require('./src/core/personality');
const { getUserProfile, updateUserProfile } = require('./src/data/contacts');

const app = express();
const port = process.env.PORT || 3000;

// Initialize services
const whatsapp = WhatsApp; // Verwenden Sie die Singleton-Instanz
const messageHandler = MessageHandler; // Verwenden Sie die Singleton-Instanz
const openai = OpenAI; // Verwenden Sie die Singleton-Instanz
const tts = TTS; // Verwenden Sie die Singleton-Instanz
const localInfoService = LocalInfoService; // Verwenden Sie die Singleton-Instanz
const googleVision = GoogleVision; // Verwenden Sie die Singleton-Instanz
const encryption = Encryption; // Verwenden Sie die Singleton-Instanz
const logging = Logging; // Verwenden Sie die Singleton-Instanz
const nlp = NLP; // Verwenden Sie die Singleton-Instanz

// Middleware to log incoming messages
app.use((req, res, next) => {
    logging.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Route to handle incoming messages
app.post('/message', async (req, res) => {
    const { message, userId } = req.body;
    const response = await messageHandler.handleMessage(message, userId);
    res.send(response);
});

// Route to handle incoming images
app.post('/image', async (req, res) => {
    const { image, userId } = req.body;
    const imageBuffer = Buffer.from(image, 'base64');
    const labels = await googleVision.detectLabels(imageBuffer);
    const text = await googleVision.detectText(imageBuffer);
    const response = await messageHandler.handleMessage(`Bild mit Labels: ${labels.join(', ')} und Text: ${text}`, userId);
    res.send(response);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Initialize WhatsApp client
whatsapp.initialize();

// Export services for use in other modules
module.exports = {
    whatsapp,
    messageHandler,
    openai,
    tts,
    localInfoService,
    googleVision,
    encryption,
    logging,
    nlp,
    personality,
    getUserProfile,
    updateUserProfile
};