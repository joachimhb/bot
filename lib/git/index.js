import check from 'check-types-2';

import exec from '../exec.js';
import ui   from '../ui.js';

export const commit = async (cwd, message) => {
  check.assert.string(cwd, 'cwd is not a string');
  check.assert.string(message, 'message is not a string');

  ui.debug(`Adding . in '${cwd}'`);

  const add = await exec('git', {args: ['add', '.'], cwd});

  if(add.exitCode !== 0) {
    throw new Error('Failed to add');
  }

  ui.debug(`Commiting . in '${cwd}' with '${message}'`);

  const commitRes = await exec('git', {args: ['commit', `-m "${message}"`], cwd});

  if(commitRes.exitCode !== 0) {
    throw new Error('Failed to commit');
  }
};

export const tag = async (cwd, name, message) => {
  check.assert.string(cwd, 'cwd is not a string');
  check.assert.string(message, 'message is not a string');
  check.assert.string(name, 'name is not a string');

  ui.debug(`Tagging in '${cwd}' with '${name}' and '${message}'`);

  const tagRes = await exec('git', {args: ['tag', '-a', `-m "${message}"`, name], cwd});

  if(tagRes.exitCode !== 0) {
    throw new Error('Failed to add tag');
  }
};

export const push = async cwd => {
  check.assert.string(cwd, 'cwd is not a string');

  ui.debug(`Pushing ${cwd}`);

  const pushRes = await exec('git', {args: ['push', 'origin', 'master', '--tags'], cwd});

  if(pushRes.exitCode !== 0) {
    throw new Error('Failed to push');
  }
};

export const checkUncommitted = async cwd => {
  check.assert.string(cwd, 'cwd is not a string');

  ui.debug(`Checking uncommited changes in '${cwd}'`);

  const status = await exec('git', {args: ['status', '-s'], cwd});

  if(status.exitCode !== 0) {
    throw new Error('Failed to check status');
  }

  if(status.stdout.trim()) {
    throw new Error('Uncommitted changes');
  }
};

export const checkForMasterBranch = async cwd => {
  check.assert.string(cwd, 'cwd is not a string');

  ui.debug(`Checking for master branch in '${cwd}'`);

  const masterBranch = await exec('git', {args: ['rev-parse', '--abbrev-ref', 'HEAD'], cwd});

  if(masterBranch.exitCode !== 0) {
    throw new Error('Failed to check status');
  }

  if(masterBranch.stdout.trim() !== 'master') {
    throw new Error('Not on master branch');
  }
};

export const checkIfMasterIsUpToDate = async cwd => {
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
};
