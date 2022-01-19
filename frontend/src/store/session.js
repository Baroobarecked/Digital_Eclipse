// Actions
const SET_USER = '/session/SET_USER'
const REMOVE_USER = '/session/REMOVE_USER'

// Action Creators
const setUser = (user) => {
    return {
        type: SET_USER,
        user
    }
}

const removeUser = () => {
    return {
        type: REMOVE_USER
    }
}

// Thunks
export const setSessionUser = user => async dispatch => {
    dispatch(setUser(user));
}

export const removeSessionUser = () => async dispatch => {
    dispatch(removeUser());
}

// Reducer
export default function sessionReducer(state = {}, action) {
    switch (action.type) {
        case SET_USER:
            return {'User': action.user}
        case REMOVE_USER:
            return {}
        default:
            return state
    }
}