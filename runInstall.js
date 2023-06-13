const { exec } = require('child_process');
const { Transform } = require('stream');

const prefixStream = (prefix) => {
    return new Transform({
        transform(chunk, encoding, callback) {
            this.push(`${prefix}: ${chunk}`);
            callback();
        },
        flush(callback) {
            this.push(null);
            callback();
        }
    });
};

const installDependencies = (name, path) => {
    return new Promise((resolve, reject) => {
        const install = exec(`npm i --prefix ${path}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error installing ${name}: ${error}`);
                reject(error);
            } else {
                console.log(stdout);
                resolve(stdout);
            }
        });

        install.stdout.pipe(prefixStream(name)).pipe(process.stdout);
        install.stderr.pipe(prefixStream(name)).pipe(process.stderr);
    });
};

Promise.all([
    installDependencies('frontend', 'frontend'),
    installDependencies('backend', 'backend')
])
    .then(() => console.log('Installed dependencies for both frontend and backend.'))
    .catch((error) => console.error(`Error: ${error}`));