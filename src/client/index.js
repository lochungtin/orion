import { w3cwebsocket as W3CWebSocket } from "websocket";

import { fsBack, fsSetContent, fsSetDetail, fsSetDir } from '../redux/action';
import { store } from '../redux/store';

const makeClient = () => {
    const clt = new W3CWebSocket('ws://localhost:8000');

    clt.onmessage = message => {
        const cmd = message.data.slice(0, 3);
        const payload = message.data.substring(3);
        switch (cmd) {
            case 'cnt':
                store.dispatch(fsSetContent(JSON.parse(payload)));
                break;
            case 'dtl':
                store.dispatch(fsSetDetail(JSON.parse(payload)));
                break;
        }
    }

    return clt;
}

export default makeClient;