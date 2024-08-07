const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');
const client = new textToSpeech.TextToSpeechClient();

class TTS {
    async convertTextToSpeech(text, outputFilePath) {
        const request = {
            input: { text: text },
            voice: { languageCode: 'de-DE', ssmlGender: 'FEMALE' },
            audioConfig: { audioEncoding: 'MP3' },
        };

        try {
            const [response] = await client.synthesizeSpeech(request);
            fs.writeFileSync(outputFilePath, response.audioContent, 'binary');
            console.log(`Audio content written to file: ${outputFilePath}`);
        } catch (error) {
            console.error('Error converting text to speech:', error);
        }
    }
}

module.exports = new TTS();