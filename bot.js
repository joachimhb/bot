#!/usr/bin/env node

/* eslint-disable no-process-exit */

import commandLineArgs from 'command-line-args';
import commandLineCommands from 'command-line-commands';

import release from './lib/commands/release.js';
import ui from './lib/ui.js';

const commands = {
  release,
};

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
