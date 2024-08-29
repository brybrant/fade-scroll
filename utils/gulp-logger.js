import chalk from 'chalk';

/**
 * @param {number} time Number in range 0-59
 * @returns {string} Two digit number (if time is 5, returns 05)
 */
const zeroTime = (time) => (time < 10 ? `0${time}` : time);

/**
 * Get current time in "Gulp format" for printing to console
 * @returns {string} Time in format `[00:00:00]`
 */
function getTime() {
  const now = new Date();
  const hours = zeroTime(now.getHours());
  const minutes = zeroTime(now.getMinutes());
  const seconds = zeroTime(now.getSeconds());

  return `[${chalk.magenta(`${hours}:${minutes}:${seconds}`)}]`;
}

export default {
  /**
   * Log timestamp of processing start
   * @param {string} file - Path to file
   */
  processing(file) {
    return console.log(`${getTime()} Processing ${chalk.magenta(file)}...`);
  },
  /**
   * Log timestamp of processing finish
   * @param {string} file - Path to file
   */
  finish(file) {
    return console.log(
      `${getTime()} Finished processing ${chalk.magenta(file)}`,
    );
  },
};
