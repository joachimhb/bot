'use strict';

const path = require('path');

const fs = require('fs-extra');
const {promisify} = require('util');
// const check = require('check-types-2');
const bump = require('bump-regex');

const asyncBump = promisify(bump);

const ui = require('../ui');
const git = require('../git');

module.exports = {
  description: 'Release',
  options: [
    {
      name: 'type',
      alias: 't',
      type: String,
      defaultValue: 'patch',
      description: 'patch, minor or major',
    },
  ],
  execute: async function({type}) {
    ui.taskStart('release');

    const cwd = process.cwd();

    await git.checkUncommitted(cwd);
    await git.checkForMasterBranch(cwd);
    await git.checkIfMasterIsUpToDate(cwd);

    const packagePath = path.join(cwd, 'package.json');

    ui.debug(`Reading package ${packagePath}`);

    const str = await fs.readFile(packagePath, 'utf8');

    ui.debug(`Read package`);

    const result = await asyncBump({
      str,
      type,
    });

    ui.debug(`Bumped package`);

    await fs.writeFile(packagePath, result.str, 'utf8');

    ui.debug(`Wrote package`);

    const newVersion = result.new;

    await git.commit(cwd, `release: ${newVersion}`);
    await git.push(cwd);
    await git.tag(cwd, newVersion, `release tag: ${newVersion}`);
    await git.push(cwd, true);

    ui.taskSuccess('release');
  },
};
