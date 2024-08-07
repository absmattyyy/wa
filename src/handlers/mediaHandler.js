const fs = require('fs');
const path = require('path');

class MediaHandler {
    constructor() {
        this.mediaPath = path.join(__dirname, '../data/media');
        if (!fs.existsSync(this.mediaPath)) {
            fs.mkdirSync(this.mediaPath, { recursive: true });
        }
    }

    async saveMedia(media, userId) {
        const mediaId = Date.now().toString();
        const mediaPath = path.join(this.mediaPath, `${userId}_${mediaId}`);
        await fs.promises.writeFile(mediaPath, media);
        return mediaId;
    }

    async getMedia(mediaId, userId) {
        const mediaPath = path.join(this.mediaPath, `${userId}_${mediaId}`);
        if (fs.existsSync(mediaPath)) {
            return await fs.promises.readFile(mediaPath);
        }
        return null;
    }

    async deleteMedia(mediaId, userId) {
        const mediaPath = path.join(this.mediaPath, `${userId}_${mediaId}`);
        if (fs.existsSync(mediaPath)) {
            await fs.promises.unlink(mediaPath);
            return true;
        }
        return false;
    }
}

module.exports = new MediaHandler();