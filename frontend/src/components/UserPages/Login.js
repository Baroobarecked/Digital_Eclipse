import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as sessionActions from '../../store/session'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
// import useHistory from 'react-router-dom'

function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currentUser = useSelector(state => state.session.User)

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    const submitUser = async (e) => {
        e.preventDefault();
        let res = await dispatch(sessionActions.loginSessionUser({'user': [username, password]}))
        if(res) {
            setErrors(res['errors'])
        } else {
            navigate('/albums')
            navigate('/albums', {replace: true})
        }
    }
    const loginDemo = async (e) => {
        e.preventDefault();
        await dispatch(sessionActions.loginSessionUser({'user': ['demo', 'password']}))
        navigate('/albums', {replace: true})
    }

    useEffect(() => {
        if(currentUser) {
            navigate('/albums')
        }
    }, [])

    return (

        <form id='loginform'>
            {errors && errors.map(error => {
                return (
                    <pre>{error}</pre>
                )
            })}
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