'use strict';

const log4js     = require('log4js');

const logger = log4js.getLogger();

logger.level = 'info';
logger.level = 'debug';

Object.assign(logger, {
  start: () => {
    logger.debug(`bot start`);
  },
  finish: () => {
    logger.debug(`bot finished`);
  },
  taskStart: name => {
    logger.info(`> ${name}`);
  },
  taskError: (name, err) => {
    logger.info(`> ${name} failed`, err);
  },
  taskSuccess: (name, err) => {
    logger.info(`> ${name} succeeded`);
  }
});

module.exports = logger;
