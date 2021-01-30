const webSocketServer = require('websocket').server;
const http = require('http');
const fs = require('fs');

const webSocketsServerPort = 8000;
const server = http.createServer();
server.listen(webSocketsServerPort);

const wsServer = new webSocketServer({
    httpServer: server
});

const clients = {};
const srcClients = {};

const make = () => Math.floor((1 + Math.random() * 0x10000)).toString(16);
const getUniqueID = () => make() + make() + "-" + make();

wsServer.on('request', function (request) {
    const userID = getUniqueID();
    const client = request.accept(null, request.origin);
    clients[userID] = client;
    client.on('message', msg => messageHandler(msg, client, userID));
    client.on('close', () => endConnection(userID));

    logger('New client connection - UID: *', userID);
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
            
    }
}

const getDir = dir => {
    const content = {
        dirs: [],
        files: [],
    };

    fs.readdirSync(dir).forEach(n => content[fs.statSync(dir + n).isDirectory() ? 'dirs' : 'files'].push(n));

    return content;
}

const getDetails = path => {
    console.log(path);
    const f = fs.statSync(path);
    return {
        path: path,
        bTime: f.birthtime,
        mTime: f.mtime,
        size: f.size
    }
}

const endConnection = userID => {
    delete clients[userID];
    delete srcClients[userID];
    logger('Client disconnected - UID: ', userID);
    logger('General Connections No.: *', Object.keys(clients).length);
    logger('Source Connections No.: *', Object.keys(clients).length);
}

const logger = (text, ...args) => {
    const splt = text.split('*');
    let builder = '';
    for (let i = 0; i < args.length; ++i)
        builder += (splt[i] + args[i]);

    console.log(`[${new Date().toLocaleString()}] ${builder}`);
}