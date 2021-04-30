'use strict';

const check = require('check-types-2');

const ui = require('../ui');
const exec = require('../exec');

module.exports = {
  async commit(cwd, message) {
    check.assert.string(cwd, 'cwd is not a string');
    check.assert.string(message, 'message is not a string');

    ui.debug(`Adding . in '${cwd}'`);

    const add = await exec('git', {args: ['add', '.'], cwd});

    if(add.exitCode !== 0) {
      throw new Error('Failed to add');
    }

    ui.debug(`Commiting . in '${cwd}' with '${message}'`);

    const commit = await exec('git', {args: ['commit', `-m "${message}"`], cwd});

    if(commit.exitCode !== 0) {
      throw new Error('Failed to commit');
    }
  },

  async tag(cwd, message, name) {
    check.assert.string(cwd, 'cwd is not a string');
    check.assert.string(message, 'message is not a string');

    ui.debug(`Tagging in '${cwd}' with '${name}' and '${message}'`);

    const tag = await exec('git', {args: ['commit', `-m "${message}"`, name], cwd});

    if(tag.exitCode !== 0) {
      throw new Error('Failed to add tag');
    }
  },

  async checkUncommitted(cwd) {
    check.assert.string(cwd, 'cwd is not a string');

    ui.debug(`Checking uncommited changes in '${cwd}'`);

    const status = await exec('git', {args: ['status', '-s'], cwd});

    if(status.exitCode !== 0) {
      throw new Error('Failed to check status');
    }

    if(status.stdout.trim()) {
      throw new Error('Uncommitted changes');
    }
  },

  async checkForMasterBranch(cwd) {
    check.assert.string(cwd, 'cwd is not a string');

    ui.debug(`Checking for master branch in '${cwd}'`);

    const masterBranch = await exec('git', {args: ['rev-parse', '--abbrev-ref', 'HEAD'], cwd});

    if(masterBranch.exitCode !== 0) {
      throw new Error('Failed to check status');
    }

    if(masterBranch.stdout.trim() !== 'master') {
      throw new Error('Not on master branch');
    }
  },

  async checkIfMasterIsUpToDate(cwd) {
    check.assert.string(cwd, 'cwd is not a string');

    ui.debug(`Checking if master branch is up to date in '${cwd}'`);

    await exec('git', {args: ['fetch'], cwd});

    const status = await exec('git', {args: ['rev-list', '--right-only', '--count', 'master...origin/master'], cwd});

    if(status.exitCode !== 0) {
      throw new Error('Failed to check if masyer is up to date');
    }

    if(status.stdout.trim() !== '0') {
      throw new Error('Behind master');
    }
  },

  async push(cwd) {
    check.assert.string(cwd, 'cwd is not a string');

    ui.debug(`Pushing ${cwd}`);

    const push = await exec('git', {args: ['push', '--tags'], cwd});

    if(push.exitCode !== 0) {
      throw new Error('Failed to push');
    }
  },
};
