const sizeR = bytes => bytes / Math.pow(1024, Math.floor((Math.log(bytes) / Math.log(1024))));

export const size = bytes => Math.round(sizeR(bytes) * 100) / 100 + '' + ['B', 'KB', 'MB', 'GB'][Math.floor(Math.log(bytes) / Math.log(1024))];