const WINSTON = require("winston");

// Define the log format
const LOG_FORMAT = (file) => {
  return WINSTON.format.combine(
    WINSTON.format.align(),
    WINSTON.format.timestamp({ format: "DD-MM-YYYY T hh:mm:ss.sss A" }),
    WINSTON.format.label({ label: file }),
    WINSTON.format.printf(({ timestamp, level, message, label }) => {
      return `[ ${timestamp} | ${level.toUpperCase()} | LOG: ${message} | ${label}]`;
    })
  );
};

// Create a logger function that accepts the file name as a parameter
const logger = (file) => {
  return WINSTON.createLogger({
    level: "debug", // Set the default log level
    format: LOG_FORMAT(file),
    transports: [new WINSTON.transports.Console()], // Log to the console
  });
};

module.exports = logger;
