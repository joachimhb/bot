import {execa}      from 'execa';
import check        from 'check-types-2';
import {processenv} from 'processenv';

export default async(cmd, options = {}) => {
  check.assert.string(cmd, 'cmd is not a string');

  const cwd = options.cwd || process.cwd();
  const env = options.env || processenv();

  let bin;
  let args;

  if(options.args) {
    ({args} = options);
    bin = cmd;
  } else {
    [bin, ...args] = cmd.split(' ');
  }

  const childProcess = execa(bin, args, {cwd, env, maxBuffer: 1024 * 500});

  if(options.silent !== true) {
    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);
  }

  return await childProcess;
};
