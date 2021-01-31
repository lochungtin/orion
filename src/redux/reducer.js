import { combineReducers } from 'redux';
import { FS_BACK, FS_SET_CONTENT, FS_SET_DETAIL, FS_SET_DIR, FS_SET_SEARCH, SET_CLIENT, SET_LOGIN, SET_LOGOUT, } from './action';

const acc = (acc = null, action) => {
    switch (action.type) {
        case SET_LOGIN:
            return action.payload;
        case SET_LOGOUT:
            return null;
    }
    return acc;
}

const clt = (clt = {}, action) => {
    switch (action.type) {
        case SET_CLIENT:
            return action.payload;
    }
    return clt;
}

const fsInit = {
    details: {},
    dir: '',
    content: {
        dirs: [],
        files: [],
    },
    search: false,
    stack: [],
}
const fs = (data = fsInit, action) => {
    var update = { ...data };
    switch (action.type) {
        case FS_BACK:
            if (update.stack.length > 1) {
                update.stack.pop();
                update.dir = update.stack[update.stack.length - 1];
            }
            return update;
        case FS_SET_CONTENT:
            update.content = action.payload;
            update.search = false;
            return update;
        case FS_SET_DETAIL:
            update.details = action.payload;
            return update;
        case FS_SET_DIR:
            update.dir = action.payload;
            update.stack.push(action.payload);
            return update;
        case FS_SET_SEARCH:
            update.content.files = action.payload;
            update.search = true;
            return update;
    }
    return data;
}

export default combineReducers({
    acc: acc,
    clt: clt,
    fs: fs,
});