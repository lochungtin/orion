import { combineReducers } from 'redux';
import { FS_BACK, FS_SET_CONTENT, FS_SET_DIR, SET_LOGIN, SET_LOGOUT, } from './action';

const acc = (acc = null, action) => {
    switch (action.type) {
        case SET_LOGIN:
            return action.payload;
        case SET_LOGOUT:
            return null;
    }
    return acc;
}

const fsInit = {
    dir: '',
    content: {
        dirs: [],
        files: [],
    },
    stack: []
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
        case FS_SET_DIR:
            update.dir = action.payload;
            update.stack.push(action.payload);
            return update;
        case FS_SET_CONTENT:
            update.content = action.payload;
            return update;
    }
    return data;
}

export default combineReducers({
    acc: acc,
    fs: fs,
});