const fs = require('fs');
const path = require('path');

class Logging {
    constructor() {
        this.logPath = path.join(__dirname, '../logs');
        if (!fs.existsSync(this.logPath)) {
            fs.mkdirSync(this.logPath, { recursive: true });
        }
    }

    log(message) {
        const logFilePath = path.join(this.logPath, `${new Date().toISOString().split('T')[0]}.log`);
        const logMessage = `${new Date().toISOString()} - ${message}\n`;
        fs.appendFileSync(logFilePath, logMessage);
    }
}

module.exports = new Logging();