const webSocketServer = require('websocket').server;
const http = require('http');
const fs = require('fs');
const checkDiskSpace = require('check-disk-space')
const fsvr = require('./fileServer');

const server = http.createServer();
server.listen(42071);

const logger = (text, ...args) => {
    const splt = text.split('*');
    let builder = '';
    for (let i = 0; i < args.length; ++i)
        builder += (splt[i] + args[i]);    
    console.log(`[${new Date().toLocaleString()}] ${builder || text}`);
}

const wsServer = new webSocketServer({
    httpServer: server
});
fsvr.createFileServer(logger);
logger('Socket Server is running on port: 42071');
logger('File Server is running on port: 42072');

const clients = {};
const srcClients = {};

const make = () => Math.floor((1 + Math.random() * 0x10000)).toString(16);
const getUniqueID = () => make() + make() + "-" + make();

wsServer.on('request', req => {
    const userID = getUniqueID();
    const client = req.accept(null, req.origin);
    clients[userID] = client;
    client.on('message', msg => messageHandler(msg, client, userID));
    client.on('close', () => endConnection(userID));

    logger('New client connection - UID: *@*', userID, req.origin);
    logger('General Connections No.: *', Object.keys(clients).length);
});

const messageHandler = (data, client, userID) => {
    const msg = data.utf8Data;
    const cmd = msg.slice(0, 3);
    const payload = msg.substring(3);
    logger('Message received: *', (msg.substring(0, 80) + (msg.length > 80 ? '...' : '')));
    switch (cmd) {
        case 'get':
            // request content of RPI directory
            client.send('cnt' + JSON.stringify(getDir(payload)));
            break;
        case 'dtl':
            // request details of file on RPI
            client.send('dtl' + JSON.stringify(getDetails(payload)));
            break;
        case 'src':
            // establish source client connection
            srcClients[userID] = { client, root: payload };
            client.send('tvl' + payload);
            logger('Source Connections No.: *', Object.keys(clients).length);
            break;
        case 'cfs':
            // receive directory content from source client
            // console.log(JSON.parse(payload));
            break;
        case 'srq':
            // receive search request of dir
            const obj = JSON.parse(payload);
            client.send('sre' + JSON.stringify(getDir(obj.dir, n => n.toLowerCase().includes(obj.text.toLowerCase()))));
            break;
        case 'dsk':
            // get disk info
            checkDiskSpace(payload).then((obj) => {
                const res = JSON.stringify(obj);
                client.send('dsk' + res);
                logger('Disk Scan Complete - Returned: ', res);
            });
            break;
    }
}

const getDir = (dir, fn = n => true) => {
    const content = {
        dirs: [],
        files: [],
    };

    fs.readdirSync(dir)
        .filter(fn)
        .forEach(n => content[fs.statSync(dir + '/' + n).isDirectory() ? 'dirs' : 'files'].push(n));

    return content;
}

const getDetails = path => {
    const f = fs.statSync(path);
    return {
        path: path,
        mTime: f.mtime,
        size: f.size
    };
}

const endConnection = userID => {
    delete clients[userID];
    delete srcClients[userID];
    logger('Client disconnected - UID: ', userID);
    logger('General Connections No.: *', Object.keys(clients).length);
    logger('Source Connections No.: *', Object.keys(clients).length);
}