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

const getUniqueID = () => {
    const make = () => Math.floor((1 + Math.random() * 0x10000)).toString(16);
    return make() + make() + "-" + make();
};

wsServer.on('request', function (request) {
    const userID = getUniqueID();
    const client = request.accept(null, request.origin);
    clients[userID] = client;
    console.log(`Client: ${userID} connected at [${new Date().toLocaleString()}] | Origin: ${request.origin}`);

    client.on('message', msg => messageHandler(msg, client));
});

const messageHandler = (data, client) => {
    const cmd = data.utf8Data.slice(0, 3);
    const payload = data.utf8Data.substring(3);
    console.log(data.utf8Data);
    switch(cmd) {
        case 'get':
            client.send('cnt' + JSON.stringify(getDir(payload)));
            break;
        case 'dtl':
            client.send('dtl' + JSON.stringify(getDetails(payload)));
    }    
}

const getDir = dir => {
    var content = {
        dirs: [],
        files: [],
    };
    const dirArr = fs.readdirSync(dir);

    dirArr.forEach(n => {
        var tag = fs.statSync(dir + n).isDirectory() ? 'dirs' : 'files';
        content[tag].push(n);
    })
     
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