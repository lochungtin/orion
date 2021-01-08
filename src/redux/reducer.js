import { combineReducers } from 'redux';
import { FS_SET_CONTENT, FS_SET_DIR, SET_LOGIN, SET_LOGOUT, } from './action';

const acc = (acc = null, action) => {
    switch (action.type) {
        case SET_LOGIN:
            return action.payload;
        case SET_LOGOUT:
            return null;
    }
    return acc;
}

const fs = (data = {}, action) => {
    var update = {...data};
    switch (action.type) {
        case FS_SET_DIR:
            update.dir = action.payload;
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