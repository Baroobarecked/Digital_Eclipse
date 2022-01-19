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
    const [firstName, lastName, username, email, password, defualtImage] = user.user

    let res = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'user': [firstName,
            lastName,
            username,
            email,
            password,
            defualtImage]
        })
    })

    if(res.ok) {
        const confirmeduser = await res.json()

        if(!confirmeduser['errors']) {
            dispatch(setUser(confirmeduser));
        } else {
            console.log(confirmeduser)
        }
    }

}
export const loginSessionUser = user => async dispatch => {
    const [username, password] = user.user

    let res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'user': [
            username,
            password
            ]
        })
    })

    if(res.ok) {
        const confirmeduser = await res.json()

        if(!confirmeduser['errors']) {
            dispatch(setUser(confirmeduser));
        } else {
            console.log(confirmeduser)
        }
    }

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