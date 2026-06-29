const { execSync } = require('child_process');

const port = Number(process.argv[2]);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('Usage: node scripts/kill-port.cjs <port>');
  process.exit(1);
}

function run(command) {
  return execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function killWindows() {
  let output = '';
  try {
    output = run(`netstat -ano | findstr :${port}`);
  } catch {
    console.log(`[dev] Port ${port} is free.`);
    return;
  }

  const pids = new Set();
  for (const line of output.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.includes('LISTENING')) continue;
    const parts = trimmed.split(/\s+/);
    const localAddress = parts[1] || '';
    const pid = parts[parts.length - 1];
    if (localAddress.endsWith(`:${port}`) && /^\d+$/.test(pid)) {
      pids.add(pid);
    }
  }

  if (pids.size === 0) {
    console.log(`[dev] Port ${port} is free.`);
    return;
  }

  for (const pid of pids) {
    try {
      console.log(`[dev] Killing PID ${pid} on port ${port}...`);
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'inherit' });
    } catch (error) {
      console.warn(`[dev] Could not kill PID ${pid}. It may already be stopped.`);
    }
  }
}

function killUnix() {
  let output = '';
  try {
    output = run(`lsof -ti tcp:${port}`);
  } catch {
    console.log(`[dev] Port ${port} is free.`);
    return;
  }

  const pids = [...new Set(output.split(/\s+/).filter(Boolean))];
  if (pids.length === 0) {
    console.log(`[dev] Port ${port} is free.`);
    return;
  }

  for (const pid of pids) {
    try {
      console.log(`[dev] Killing PID ${pid} on port ${port}...`);
      execSync(`kill -9 ${pid}`, { stdio: 'inherit' });
    } catch {
      console.warn(`[dev] Could not kill PID ${pid}. It may already be stopped.`);
    }
  }
}

if (process.platform === 'win32') {
  killWindows();
} else {
  killUnix();
}
