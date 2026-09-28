const { spawn } = require('child_process');
const children = [];

function run(name, scriptName) {
  // ensure port 4000 is free before starting the service
  const prep = spawn(`npx kill-port 4000`, { stdio: 'inherit', shell: true, env: process.env });
  prep.on('exit', () => {
    const child = spawn(`npm run ${scriptName}`, {
      stdio: 'inherit',
      shell: true,
      env: process.env,
    });

    child.on('exit', (code, signal) => {
      if (signal) {
        console.log(`[${name}] exited with signal ${signal}`);
      } else if (code !== 0) {
        console.log(`[${name}] exited with code ${code}`);
      }
      shutdown(code || 0);
    });

    child.on('error', (error) => {
      console.error(`[${name}] failed to start:`, error.message);
      shutdown(1);
    });

    children.push(child);
  });
  return; // early return because child will be added after prep

  child.on('exit', (code, signal) => {
    if (signal) {
      console.log(`[${name}] exited with signal ${signal}`);
    } else if (code !== 0) {
      console.log(`[${name}] exited with code ${code}`);
    }
    shutdown(code || 0);
  });

  child.on('error', (error) => {
    console.error(`[${name}] failed to start:`, error.message);
    shutdown(1);
  });

  children.push(child);
}

function shutdown(code) {
  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }
  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

run('api', 'dev:server');
run('client', 'dev:client');
