import { combineReducers } from 'redux';
import { SET_CLIENT, SET_DIRECTORY } from './action';


const connection = (config = {}, action) => {
    switch(action.type) {
        case SET_CLIENT:
            var newConfig = {...config}
            newConfig['client'] = action.payload;
            return newConfig;
    }
    return config;
}

const directories = (dir = {}, action) => {
    switch(action.type) {
        case SET_DIRECTORY:
            return action.payload;
    }
    return dir;
}

export default combineReducers({
    connection: connection,
    directories: directories,
})