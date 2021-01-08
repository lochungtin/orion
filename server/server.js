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
    return Math.floor((1 + Math.random() * 0x10000)).toString(16);
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
    //console.log(data.utf8Data);
    switch(cmd) {
        case 'get':
            client.send('cnt' + JSON.stringify(getDir(payload)));
            break;
    }    
}

const getDir = (dir) => {
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