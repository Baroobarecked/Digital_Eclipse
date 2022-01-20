import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import * as sessionActions from '../../store/session'

function Logout() {
    const dispatch = useDispatch();

    const userLogout = () => {
        dispatch(sessionActions.removeSessionUser())
    }

    return (
        <button onClick={userLogout}>Log out</button>
    )
}

export default Logout;