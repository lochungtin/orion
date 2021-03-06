import { combineReducers } from 'redux';
import { DEV_SET, FS_BACK, FS_SET_CONTENT, FS_SET_DETAIL, FS_SET_DIR, FS_SET_FOCUS, FS_SET_HIDDEN, FS_SET_SEARCH, FS_SET_SELECTION, FS_SET_STATS, SET_CLIENT, SET_LOGIN, SET_LOGOUT, } from './action';

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

const bkupInit = {
    status: '--/--'
}
const bkup = (bkup = bkupInit, action) => {
    var update = { ...bkup };
    return update;
}

const fsInit = {
    details: {},
    dir: '',
    content: {
        dirs: [],
        files: [],
    },
    focus: false,
    hidden: false,
    stack: [],
    search: '',
    select: '',
    stats: {
        free: 'calculating ...',
        size: 'calculating ...',
    }
}
const fs = (fs = fsInit, action) => {
    var update = { ...fs };
    switch (action.type) {
        case FS_BACK:
            if (update.stack.length > 1) {
                update.stack.pop();
                update.dir = update.stack[update.stack.length - 1];
            }
            return update;

        case FS_SET_CONTENT:
            update.content = action.payload;
            return update;

        case FS_SET_DETAIL:
            update.details = action.payload;
            return update;

        case FS_SET_DIR:
            update.dir = action.payload;
            update.stack.push(action.payload);
            return update;

        case FS_SET_FOCUS:
            update.focus = action.payload;
            return update;

        case FS_SET_HIDDEN:
            update.hidden = action.payload;
            return update;

        case FS_SET_SEARCH:
            update.search = action.payload;
            return update;

        case FS_SET_SELECTION:
            update.select = action.payload;
            return update;

        case FS_SET_STATS:
            update.stats = action.payload;
            return update;
    }
    return fs;
}

const dev = (dev = [], action) => {
    switch (action.type) {
        case DEV_SET:
            return action.payload;
    }
    return dev;
}

export default combineReducers({
    acc: acc,
    bkup: bkup,
    clt: clt,
    dev: dev,
    fs: fs,
});