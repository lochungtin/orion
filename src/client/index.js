import { w3cwebsocket as W3CWebSocket } from "websocket";

import { fsSetContent, fsSetDetail, fsSetStats, } from '../redux/action';
import { store } from '../redux/store';

const makeClient = (ip, acc) => {
    const clt = new W3CWebSocket(`ws://${ip}:42071`);

    clt.onopen = () => clt.send(`dsk${acc.rootDir}`);

    clt.onmessage = message => {
        const cmd = message.data.slice(0, 3);
        const payload = message.data.substring(3);
        console.log(cmd, payload);
        switch (cmd) {
            case 'cnt':
                store.dispatch(fsSetContent(JSON.parse(payload)));
                break;
            case 'dtl':
                store.dispatch(fsSetDetail(JSON.parse(payload)));
                break;
            case 'sre':
                store.dispatch(fsSetContent(JSON.parse(payload)));
                break;
            case 'dsk':
                store.dispatch(fsSetStats(JSON.parse(payload)));
                break;
        }
    }

    return clt;
}

export default makeClient;