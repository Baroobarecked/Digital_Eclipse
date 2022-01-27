import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useMatch, useNavigate } from 'react-router';
import * as sessionActions from '../../store/session'
import * as songsActions from '../../store/song'

function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const communityOpen = useMatch('/community/*')

    const userLogout = async (e) => {
        e.stopPropagation();
        await dispatch(sessionActions.removeSessionUser())
        navigate('/login')
    }

    return (
        <div className={'logout'}>
            {!communityOpen &&
                <>
                    <button onClick={() => {
                        navigate('/albums/addalbum')
                        dispatch(songsActions.resetTheSongs())
                    }}>Add Album</button>
                    <button onClick={() => {
                        navigate('/community')
                    }} className='communityButton'>Community Pages</button>
                </>
            }
            {communityOpen && 
                <>
                    <button onClick={() => {
                        navigate('/albums')
                    }} className='communityButton'>Back to music</button>
                </>
            }
            <button  onClick={userLogout}>Log out</button>
        </div>
    )
}

export default Logout;