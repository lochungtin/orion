// DEVICE RELATED ACTIONS

export const DEV_ADD = 'DEV_ADD';
export const devAdd = payload => ({
    type: DEV_ADD,
    payload,
});

export const DEV_RM = 'DEV_RM';
export const devRm = payload => ({
    type: DEV_RM,
    payload,
});

// FILE SYSTEM RELATED ACTIONS

export const FS_BACK = 'FS_BACK';
export const fsBack = () => ({
    type: FS_BACK,
});

export const FS_SET_CONTENT = 'FS_SET_CONTENT';
export const fsSetContent = payload => ({
    type: FS_SET_CONTENT,
    payload,
});

export const FS_SET_DETAIL = 'FS_SET_DETAIL';
export const fsSetDetail = payload => ({
    type: FS_SET_DETAIL,
    payload,
});

export const FS_SET_DIR = 'FS_SET_DIR';
export const fsSetDir = payload => ({
    type: FS_SET_DIR,
    payload,
});

export const FS_SET_FOCUS = 'FS_SET_FOCUS';
export const fsSetFocus = payload => ({
    type: FS_SET_FOCUS,
    payload,
});

export const FS_SET_HIDDEN = 'FS_SET_HIDDEN';
export const fsSetHidden = payload => ({
    type: FS_SET_HIDDEN,
    payload,
});

export const FS_SET_SEARCH = 'FS_SET_SEARCH';
export const fsSetSearch = payload => ({
    type: FS_SET_SEARCH,
    payload,
});

export const FS_SET_SELECTION = 'FS_SET_SELECTION';
export const fsSetSelection = payload => ({
    type: FS_SET_SELECTION,
    payload,
});

export const FS_SET_STATS = 'FS_SET_STATS';
export const fsSetStats = payload => ({
    type: FS_SET_STATS,
    payload,
});

// LOGIN / SOCKET CLIENT RELATED ACTIONS

export const SET_CLIENT = 'SET_CLIENT';
export const setClient = payload => ({
    type: SET_CLIENT,
    payload,
});

export const SET_LOGIN = 'LOGIN';
export const setLogin = payload => ({
    type: SET_LOGIN,
    payload,
});

export const SET_LOGOUT = 'SET_LOGOUT';
export const setLogout = () => ({
    type: SET_LOGOUT,
});
