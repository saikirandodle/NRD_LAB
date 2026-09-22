const http = require('http');
const os = require('os');
const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
const crypto = require('crypto');
const dns = require('dns');
const querystring = require('querystring');

// --------------------------------------------------
// 1. EVENTS MODULE
// --------------------------------------------------

const eventEmitter = new EventEmitter();

eventEmitter.on('serverStarted', () => {
    console.log('Event: Server started successfully!');
});

eventEmitter.on('studentLogin', (name) => {
    console.log(`Event: Student ${name} logged in.`);
});


// --------------------------------------------------
// 2. FILE SYSTEM MODULE
// --------------------------------------------------

const fileName = 'student.txt';

fs.writeFileSync(
    fileName,
    'Welcome to Node.js Core Modules'
);

fs.appendFileSync(
    fileName,
    '\nFull Stack Development Lab'
);

const fileData = fs.readFileSync(
    fileName,
    'utf8'
);

console.log('\n--- FILE SYSTEM MODULE ---');
console.log('File Content:', fileData);


// --------------------------------------------------
// 3. OS MODULE
// --------------------------------------------------

console.log('\n--- OS MODULE ---');

console.log('Platform:', os.platform());
console.log('OS Type:', os.type());
console.log('OS Release:', os.release());
console.log('Architecture:', os.arch());
console.log('CPU Cores:', os.cpus().length);
console.log('Total Memory:', os.totalmem());
console.log('Free Memory:', os.freemem());
console.log('Hostname:', os.hostname());
console.log('Home Directory:', os.homedir());


// --------------------------------------------------
// 4. PATH MODULE
// --------------------------------------------------

console.log('\n--- PATH MODULE ---');

const filePath = path.join(
    __dirname,
    'student',
    'details.txt'
);

console.log('File Path:', filePath);
console.log('Directory:', path.dirname(filePath));
console.log('File Name:', path.basename(filePath));
console.log('Extension:', path.extname(filePath));
console.log('Parsed Path:', path.parse(filePath));


// --------------------------------------------------
// 5. URL & QUERY STRING MODULE
// --------------------------------------------------

console.log('\n--- URL / QUERY STRING MODULE ---');

const query = 'name=Rahul&age=21&course=CSE';

const parsedQuery = querystring.parse(query);

console.log('Query String:', query);
console.log('Student Name:', parsedQuery.name);
console.log('Student Age:', parsedQuery.age);
console.log('Student Course:', parsedQuery.course);


// --------------------------------------------------
// 6. CRYPTO MODULE
// --------------------------------------------------

console.log('\n--- CRYPTO MODULE ---');

const password = 'student123';

const hash = crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');

console.log('Original Password:', password);
console.log('SHA-256 Hash:', hash);


// --------------------------------------------------
// 7. BUFFER MODULE
// --------------------------------------------------

console.log('\n--- BUFFER MODULE ---');

const buffer = Buffer.from('Hello Node.js');

console.log('Buffer:', buffer);
console.log('Buffer Length:', buffer.length);
console.log('Buffer Data:', buffer.toString());


// --------------------------------------------------
// 8. PROCESS MODULE
// --------------------------------------------------

console.log('\n--- PROCESS MODULE ---');

console.log('Node Version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
console.log('Process ID:', process.pid);
console.log('Current Directory:', process.cwd());


// --------------------------------------------------
// 9. DNS MODULE
// --------------------------------------------------

console.log('\n--- DNS MODULE ---');

dns.lookup('google.com', (err, address, family) => {

    if (err) {
        console.log('DNS Error:', err);
    } else {
        console.log('Google IP Address:', address);
        console.log('IP Version:', family);
    }
});


// --------------------------------------------------
// 10. HTTP MODULE
// --------------------------------------------------

const server = http.createServer((req, res) => {

    console.log('\n--- HTTP REQUEST ---');
    console.log('Request Method:', req.method);
    console.log('Request URL:', req.url);

    res.writeHead(200, {
        'Content-Type': 'text/html'
    });

    res.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Node.js Core Modules</title>
        </head>

        <body>

            <h1>Node.js Core Modules Demo</h1>

            <h2>HTTP Module</h2>
            <p>Custom HTTP server is running.</p>

            <h2>OS Module</h2>
            <p>Platform: ${os.platform()}</p>
            <p>Architecture: ${os.arch()}</p>
            <p>CPU Cores: ${os.cpus().length}</p>
            <p>Hostname: ${os.hostname()}</p>

            <h2>Path Module</h2>
            <p>File Name: ${path.basename(__filename)}</p>
            <p>Extension: ${path.extname(__filename)}</p>

            <h2>File System Module</h2>
            <p>${fileData}</p>

            <h2>Buffer Module</h2>
            <p>${buffer.toString()}</p>

            <h2>Process Module</h2>
            <p>Node Version: ${process.version}</p>
            <p>Process ID: ${process.pid}</p>

            <h2>Events Module</h2>
            <p>Custom events are implemented.</p>

        </body>
        </html>
    `);

    res.end();

});


// --------------------------------------------------
// 11. START SERVER
// --------------------------------------------------

server.listen(3000, () => {

    eventEmitter.emit('serverStarted');

    eventEmitter.emit(
        'studentLogin',
        'Rahul'
    );

    console.log(
        'Server running at http://localhost:3000'
    );
});


// --------------------------------------------------
// 12. TIMER MODULE
// --------------------------------------------------

setTimeout(() => {
    console.log('\nTimer: Executed after 3 seconds');
}, 3000);