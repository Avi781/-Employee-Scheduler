"use strict";

require("winston-daily-rotate-file");
const path = require("path");
const winston = require("winston");

const PROJECT_ROOT = path.join(__dirname, "..");

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  winston.format.printf((info) => {
    return `${info.timestamp} ${info.level.toUpperCase()} - ${info.message}`;
  }),
  winston.format.colorize({ all: true })
);

const log = winston.createLogger({
  level: "debug",
  transports: [
    new winston.transports.Console({ level: "info", format: logFormat }),
    new winston.transports.DailyRotateFile({
      filename: "log/info/archived/employee-sheduler-service__%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      level: "info",
      format: logFormat,
    }),
    new winston.transports.DailyRotateFile({
      filename: "log/debug/archived/employee-scheduler-service__%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      level: "debug",
      format: logFormat,
    }),
  ],
});

function formatLogArguments(args) {
  args = Array.prototype.slice.call(args);
  const stackInfo = getStackInfo(1);

  if (stackInfo) {
    const calleeStr = stackInfo.relativePath + ":" + stackInfo.line;
    if (typeof args[0] === "string") {
      args[0] = calleeStr + " - " + args[0];
    } else {
      args.unshift(calleeStr);
    }
  }
  return args;
}

function getStackInfo(stackIndex) {
  const stacklist = new Error().stack.split("\n").slice(3);
  const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
  const stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;
  const s = stacklist[stackIndex] || stacklist[0];
  const sp = stackReg.exec(s) || stackReg2.exec(s);

  if (sp && sp.length === 5) {
    return {
      method: sp[1],
      relativePath: path.relative(PROJECT_ROOT, sp[2]),
      line: sp[3],
      pos: sp[4],
      file: path.basename(sp[2]),
      stack: stacklist.join("\n"),
    };
  }
}

module.exports = {
  debug: function () {
    log.debug.apply(log, formatLogArguments(arguments));
  },
  info: function () {
    log.info.apply(log, formatLogArguments(arguments));
  },
  warn: function () {
    log.warn.apply(log, formatLogArguments(arguments));
  },
  error: function () {
    log.error.apply(log, formatLogArguments(arguments));
  },
  stream: {
    write: function (message) {
      log.info(message);
    },
  },
};
