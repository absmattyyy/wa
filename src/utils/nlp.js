const natural = require('natural');
const Sentiment = require('sentiment');

class NLP {
    constructor() {
        this.tokenizer = new natural.WordTokenizer();
        this.sentimentAnalyzer = new Sentiment();
    }

    analyzeEmotion(text) {
        const result = this.sentimentAnalyzer.analyze(text);
        return result.score > 0 ? 'positive' : result.score < 0 ? 'negative' : 'neutral';
    }

    detectIrony(text) {
        return text.includes('aber') || text.includes('doch');
    }

    detectHumor(text) {
        return text.includes('haha') || text.includes('lol');
    }

    detectInterests(text) {
        const interests = ['Mode', 'Videospiele', 'Rap', 'Essen'];
        const tokens = this.tokenizer.tokenize(text);
        return tokens.filter(token => interests.includes(token));
    }

    detectWritingStyle(text) {
        const style = {
            emojis: /[\u{1F600}-\u{1F64F}]/u.test(text),
            caps: /[A-Z]{2,}/.test(text),
            slang: /krass|geil|nice/.test(text)
        };
        return style;
    }

    detectContextChange(text, lastMessage) {
        const tokens = this.tokenizer.tokenize(text);
        const lastTokens = this.tokenizer.tokenize(lastMessage);
        return tokens.some(token => !lastTokens.includes(token));
    }

    detectMood(text) {
        return this.analyzeEmotion(text);
    }

    detectSpontaneousIdeas(text) {
        const ideas = ['Idee', 'Vorschlag', 'Meinung'];
        const tokens = this.tokenizer.tokenize(text);
        return tokens.filter(token => ideas.includes(token));
    }

    detectRepetitions(text, lastMessage) {
        const tokens = this.tokenizer.tokenize(text);
        const lastTokens = this.tokenizer.tokenize(lastMessage);
        return tokens.some(token => lastTokens.includes(token));
    }

    detectConversationTopics(text) {
        const topics = ['Wetter', 'Politik', 'Sport', 'Technologie'];
        const tokens = this.tokenizer.tokenize(text);
        return tokens.filter(token => topics.includes(token));
    }

    detectConversationTrends(text, lastMessage) {
        const tokens = this.tokenizer.tokenize(text);
        const lastTokens = this.tokenizer.tokenize(lastMessage);
        return tokens.filter(token => lastTokens.includes(token));
    }

    detectPersonalWishes(text) {
        const wishes = ['Wunsch', 'Traum', 'Ziel'];
        const tokens = this.tokenizer.tokenize(text);
        return tokens.filter(token => wishes.includes(token));
    }

    detectPersonalExperiences(text) {
        const experiences = ['Erfahrung', 'Geschichte', 'Erlebnis'];
        const tokens = this.tokenizer.tokenize(text);
        return tokens.filter(token => experiences.includes(token));
    }
}

module.exports = new NLP();