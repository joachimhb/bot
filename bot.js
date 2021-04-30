#!/usr/bin/env node
'use strict';

const commandLineArgs = require('command-line-args');
const commandLineCommands = require('command-line-commands');

const commands = require('./lib/commands/');

const ui = require('./lib/ui');

const done = err => {
  if(err) {
    ui.error('Exit with error', err);
    process.exit(1);
  }

  ui.finish();
  process.exit(0);
};

(async function() {
  ui.start();

  const commandList = Object.keys(commands);

  const parsed = commandLineCommands([null, ...commandList]);

  if(!parsed.command) {
    done(new Error('No command'));
  }

  const command = commands[parsed.command];

  const args = commandLineArgs(command.options, {argv: parsed.argv, partial: true});

  await command.execute(args);

  done();
})();
