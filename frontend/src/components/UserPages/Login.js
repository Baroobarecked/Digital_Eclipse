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
        await dispatch(sessionActions.loginSessionUser({'user': [username, password]}))
        navigate('/albums', {replace: true})
    }
    const loginDemo = async (e) => {
        e.preventDefault();
        await dispatch(sessionActions.loginSessionUser({'user': ['demo', 'password']}))
        navigate('/albums', {replace: true})
    }

    return (

        <form id='loginform'>
            <label /> Username
            <input type={'text'} onChange={e => setUsername(e.target.value)} value={username}/>
            <label /> Password
            <input type={'password'} onChange={e => setPassword(e.target.value)} value={password}/>
            <button onClick={submitUser}>Submit</button>
            <button onClick={loginDemo}>Demo</button>
            <p>Need an account? <NavLink to='/signup'>Sign Up</NavLink></p>
        </form>

    )
}

export default Login;