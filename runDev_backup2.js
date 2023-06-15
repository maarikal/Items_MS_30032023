const { spawn, execSync } = require('child_process');
const { readFileSync } = require('fs');

const runCommand = (command) => execSync(command).toString();

const killProcessesByPort = (port) => {
    try {
        const pidRegex = /(\d+)\s*$/;
        const netstatCommand = process.platform === 'win32'
            ? `netstat -ano | findstr :${port}`
            : `lsof -i tcp:${port}`;
        const pids = new Set(runCommand(netstatCommand)
            .split('\n')
            .map(line => pidRegex.exec(line)?.[1])
            .filter(pid => pid && /^\d+$/.test(pid))
            .map(pid => parseInt(pid)));
        pids.forEach(pid => {
            try {
                process.kill(pid);
                console.log(`Killed previous process with PID: ${pid}`);
            } catch (error) {
                console.error(`Error killing previous process with PID ${pid}: ${error.message}`);
            }
        });
    } catch (e) {
        console.error(`No previous process found on port ${port}`);
    }
};

const startProcess = (directory) => {
    const options = {cwd: directory, shell: true};
    const prefix = directory === './backend' ? 'Backend' : 'Frontend';
    const process = spawn('npm', ['run', 'dev'], options);
    process.stdout.on('data', (data) => {
        console.log(`${prefix}:\n${data.toString().trim()}\n`);
    });
    process.stderr.on('data', (data) => {
        console.log(`${prefix}:\n${data.toString().trim()}\n`);
    });
    process.on('error', (error) => {
        console.error(`Error starting ${prefix} process:`, error);
    });
    process.on('close', (code) => {
        console.log(`${prefix} process exited with code ${code}`);
    });
};

const runApp = () => {
    try {
        const env = readFileSync('./backend/.env', 'utf8');
        const backendPort = env.match(/PORT=(\d+)/)?.[1];
        if (!backendPort) throw new Error('PORT not found in .env');
        [backendPort, 5173].forEach(killProcessesByPort);
        ['./backend', './frontend'].forEach(startProcess);
    } catch (error) {
        console.error('Error starting application:', error);
    }
};

runApp();
