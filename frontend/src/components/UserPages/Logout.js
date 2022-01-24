import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router';
import * as sessionActions from '../../store/session'
import * as songsActions from '../../store/song'

function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const userLogout = () => {
        dispatch(sessionActions.removeSessionUser())
        navigate('/login')
    }

    return (
        <div className={'logout'}>
            <button  onClick={userLogout}>Log out</button>
            <button onClick={() => {
                navigate('/albums/addalbum')
                dispatch(songsActions.resetTheSongs())
            }}>Add Album</button>
        </div>
    )
}

export default Logout;