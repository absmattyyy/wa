const personality = require('./personality');
const OpenAI = require('../services/openai');
const { getUserProfile, updateUserProfile } = require('../data/contacts');
const { 
    analyzeEmotion, 
    detectIrony, 
    detectHumor, 
    detectInterests, 
    detectWritingStyle, 
    detectContextChange, 
    detectMood, 
    detectSpontaneousIdeas, 
    detectRepetitions, 
    detectConversationTopics, 
    detectConversationTrends, 
    detectPersonalWishes, 
    detectPersonalExperiences 
} = require('../utils/nlp');
const moment = require('moment');
const localInfoService = require('../services/localInfo');

class Bot {
    constructor() {
        this.personality = personality;
        this.openai = OpenAI; // Verwenden Sie die Singleton-Instanz
        this.conversationContext = {};
        this.personalAnecdotes = []; // Liste für persönliche Anekdoten
    }

    async respond(message, userId) {
        // Emotionserkennung
        const emotion = analyzeEmotion(message);
        // Erkennung von Ironie und Sarkasmus
        const isIronic = detectIrony(message);
        // Erkennung von Witze und Humor
        const hasHumor = detectHumor(message);
        // Kontextbezogene Antworten
        const context = this.conversationContext[userId] || {};
        // Persönliche Erinnerungen
        const userProfile = getUserProfile(userId) || {};
        // Anpassung an die Uhrzeit
        const currentTime = moment().format('HH:mm');
        const timeGreeting = this.getTimeGreeting(currentTime);
        // Persönliche Interessen und Hobbys
        const interests = detectInterests(message);
        // Anpassung an den Schreibstil
        const writingStyle = detectWritingStyle(message);
        // Integration von lokalen Informationen
        const localInfo = await localInfoService.getInfo(userProfile.location);
        // Erkennung von Kontextwechsel
        const contextChange = detectContextChange(message, context.lastMessage);
        // Anpassung an die Stimmung des Users
        const mood = detectMood(message);
        // Integration von spontanen Ideen
        const spontaneousIdeas = detectSpontaneousIdeas(message);
        // Erkennung von Wiederholungen
        const repetitions = detectRepetitions(message, context.lastMessage);
        // Erkennung von Konversationsthemen
        const conversationTopics = detectConversationTopics(message);
        // Erkennung von Konversationstrends
        const conversationTrends = detectConversationTrends(message, context.lastMessage);
        // Integration von persönlichen Anekdoten
        const personalAnecdote = this.getRandomAnecdote();
        // Erkennung von persönlichen Wünschen und Träumen
        const personalWishes = detectPersonalWishes(message);
        // Erkennung von persönlichen Erfahrungen
        const personalExperiences = detectPersonalExperiences(message);

        // KI-Modell zur Generierung der Antwort verwenden
        const prompt = `Als ${this.personality.name}, ${this.personality.profession}, antworte auf die Nachricht: "${message}" im Kontext: "${context.lastMessage}" mit den Informationen: "${JSON.stringify(userProfile)}" unter Berücksichtigung der Emotion: "${emotion}", Ironie: "${isIronic}", Humor: "${hasHumor}", Uhrzeit: "${timeGreeting}", Interessen: "${interests}", Schreibstil: "${writingStyle}", lokalen Informationen: "${JSON.stringify(localInfo)}", Kontextwechsel: "${contextChange}", Stimmung: "${mood}", spontane Ideen: "${spontaneousIdeas}", Wiederholungen: "${repetitions}", Konversationsthemen: "${conversationTopics}", Konversationstrends: "${conversationTrends}", persönliche Anekdote: "${personalAnecdote}", persönliche Wünsche: "${personalWishes}", persönliche Erfahrungen: "${personalExperiences}"`;
        const response = await this.openai.generateResponse(prompt);

        // Aktualisieren des Kontexts und des User-Profils
        this.conversationContext[userId] = { lastMessage: message };
        updateUserProfile(userId, { lastInteraction: new Date(), lastEmotion: emotion, interests, writingStyle, mood, spontaneousIdeas, repetitions, conversationTopics, conversationTrends, personalWishes, personalExperiences });

        // Zeitliche Anpassung der Antworten
        const delay = this.getRandomDelay();
        await this.sleep(delay);

        return response;
    }

    getRandomDelay() {
        // Zufällige Verzögerung zwischen 1 und 5 Sekunden
        return Math.floor(Math.random() * 4000) + 1000;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getTimeGreeting(time) {
        const hour = parseInt(time.split(':')[0]);
        if (hour >= 5 && hour < 12) return 'Guten Morgen';
        if (hour >= 12 && hour < 18) return 'Guten Tag';
        if (hour >= 18 && hour < 22) return 'Guten Abend';
        return 'Gute Nacht';
    }

    getRandomAnecdote() {
        // Hier würde die tatsächliche Auswahl einer zufälligen Anekdote implementiert werden
        return this.personalAnecdotes[Math.floor(Math.random() * this.personalAnecdotes.length)];
    }
}

module.exports = Bot;