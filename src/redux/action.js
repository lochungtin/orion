export const SET_LOGIN = 'LOGIN';
export const setLogin = payload => ({
    type: SET_LOGIN,
    payload: payload,
});

export const SET_LOGOUT = 'SET_LOGOUT';
export const setLogout = () => ({
    type: SET_LOGOUT,
});

export const FS_BACK = 'FS_BACK';
export const fsBack = () => ({
    type: FS_BACK,
});

export const FS_SET_CONTENT = 'FS_SET_CONTENT';
export const fsSetContent = payload => ({
    type: FS_SET_CONTENT,
    payload: payload,
});

export const FS_SET_DIR = 'FS_SET_DIR';
export const fsSetDir = payload => ({
    type: FS_SET_DIR,
    payload: payload,
});