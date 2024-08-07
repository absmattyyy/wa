const { ImageAnnotatorClient } = require('@google-cloud/vision');
const client = new ImageAnnotatorClient();

class GoogleVision {
    async detectLabels(imageBuffer) {
        try {
            const [result] = await client.labelDetection(imageBuffer);
            const labels = result.labelAnnotations.map(label => label.description);
            return labels;
        } catch (error) {
            console.error('Error detecting labels:', error);
            return [];
        }
    }

    async detectText(imageBuffer) {
        try {
            const [result] = await client.textDetection(imageBuffer);
            const text = result.textAnnotations[0] ? result.textAnnotations[0].description : '';
            return text;
        } catch (error) {
            console.error('Error detecting text:', error);
            return '';
        }
    }
}

module.exports = new GoogleVision();