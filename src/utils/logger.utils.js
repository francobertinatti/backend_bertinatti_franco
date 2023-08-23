const winston = require("winston");
const { dev_env } = require("../config/app.config");

const developmentLogger = winston.createLogger({
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      level: "debug",
    }),
  ],
});

const productionLogger = winston.createLogger({
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({ level: "info" }),
    new winston.transports.File({
      filename: "errors.log",
      level: "error",
    }),
  ],
});

let logger;
if (dev_env === "production") { 
  logger = productionLogger;
} else {
  logger = developmentLogger;
}

module.exports = logger;

