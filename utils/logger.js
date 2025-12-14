const chalk = require('chalk');
const moment = require('moment-timezone');

class Logger {
    static getTimestamp() {
        return moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    }
    
    static info(message) {
        console.log(chalk.blue(`[${this.getTimestamp()}] ℹ️  INFO: ${message}`));
    }
    
    static success(message) {
        console.log(chalk.green(`[${this.getTimestamp()}] ✅ SUCCESS: ${message}`));
    }
    
    static warning(message) {
        console.log(chalk.yellow(`[${this.getTimestamp()}] ⚠️  WARNING: ${message}`));
    }
    
    static error(message) {
        console.log(chalk.red(`[${this.getTimestamp()}] ❌ ERROR: ${message}`));
    }
    
    static command(user, command) {
        console.log(chalk.magenta(`[${this.getTimestamp()}] 🎯 COMMAND: ${command} from ${user}`));
    }
}

module.exports = Logger;
