const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

class OpenAI {
    async generateResponse(prompt) {
        try {
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 150,
                temperature: 0.7,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
            return response.data.choices[0].text.trim();
        } catch (error) {
            console.error('Error generating response:', error);
            return "Entschuldigung, ich konnte keine Antwort generieren.";
        }
    }
}

module.exports = new OpenAI();