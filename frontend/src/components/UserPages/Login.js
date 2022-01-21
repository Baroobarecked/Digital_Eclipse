import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import * as sessionActions from '../../store/session'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
// import useHistory from 'react-router-dom'

function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const submitUser = async (e) => {
        e.preventDefault();
        dispatch(sessionActions.loginSessionUser({'user': [username, password]}))
        navigate('/albums', {replace: false})
    }

    return (

        <form id='loginform'>
            <label /> Username
            <input type={'text'} onChange={e => setUsername(e.target.value)} value={username}/>
            <label /> Password
            <input type={'text'} onChange={e => setPassword(e.target.value)} value={password}/>
            <button onClick={submitUser}>Submit</button>
            <p>Need an account? <NavLink to='/signup'>Sign Up</NavLink></p>
        </form>

    )
}

export default Login;