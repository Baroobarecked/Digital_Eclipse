import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import * as sessionActions from '../../store/session'
import { NavLink } from 'react-router-dom'

function SignUp() {
    const dispatch = useDispatch();

    const defualtImage = 'https://bl3302files.storage.live.com/y4mxB3XcxesiCtNVukzEyo-Yw1PBr9X-wsmQ9yXGDWBg8gjxG1alKrQCXsAS5Srr7JMZlgtN7zD17XhiUVitUhBHwuI1wdljs64c5lqA1MpQYz6BUzeobLoBet7notP3YNmPKlZE3ruYmleY149HTM-Far7HEP7I9CNNgtaGCz-2QinInLrmyuVKpogRmiFF3zK?width=3024&height=4032&cropmode=none'
    
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [errors, setErrors] = useState([])

    const submitUser = async (e) => {
        e.preventDefault();
        let res = await dispatch(sessionActions.setSessionUser({'user': [firstName, lastName, username, email, password, defualtImage]}))
        if(res['errors']) {
            setErrors(res['errors'])
        }
    }

    return (
        <form id='signupform'>
            {errors && errors.map(error => {
                return (
                    <pre>{error}</pre>
                )
            })}
            <label>
                First Name
            </label>
            <input type={'text'} onChange={e => setFirstName(e.target.value)} value={firstName}/>
            <label>
                Last Name
            </label>
            <input type={'text'} onChange={e => setLastName(e.target.value)} value={lastName}/>
            <label>
                Username
            </label>
            <input type={'text'} onChange={e => setUsername(e.target.value)} value={username}/>
            <label>
                Email
            </label>
            <input type={'text'} onChange={e => setEmail(e.target.value)} value={email}/>
            {password !== confirmPassword && <p>Passwords must match</p>}
            <label>
                Password
            </label>
            <input type={'password'} onChange={e => setPassword(e.target.value)} value={password}/>
            <label>
                Confirm Password
            </label>
            <input type={'password'} onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword}/>
            <div value={defualtImage}>Drop Zone</div>
            <button onClick={submitUser}>Join Eclipse</button>
            <p>Have an account? <NavLink to='/login'>Login</NavLink></p>
        </form>
    )
}

export default SignUp;