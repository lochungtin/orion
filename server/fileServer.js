const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');


const createFileServer = (logger) => {
    http.createServer((req, res) => {
        logger('HTTP Request Received - Method: * | URL: *', req.method, req.url);

        const parseURL = url.parse(req.url);
        const pathname = decodeURI(parseURL.pathname);
        const ext = path.parse(pathname).ext.toLowerCase();

        const map = {
            '.ico': 'image/x-icon',
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.css': 'text/css',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.wav': 'audio/wav',
            '.mp3': 'audio/mpeg',
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.docx': 'application/msword'
        };

        fs.readFile(pathname, (err, data) => {
            res.setHeader('Content-type', map[ext] || 'text/plain');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(data);
        });
    }).listen(42072);
}

module.exports = { createFileServer }