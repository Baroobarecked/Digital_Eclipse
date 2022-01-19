import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import * as sessionActions from '../../store/session'

function Login() {

    const dispatch = useDispatch();

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const submitUser = async (e) => {
        e.preventDefault();
        dispatch(sessionActions.loginSessionUser({'user': [username, password]}))
    }

    return (
        <div>
            <form>
                <input type={'text'} onChange={e => setUsername(e.target.value)} value={username}/>
                <input type={'text'} onChange={e => setPassword(e.target.value)} value={password}/>
                <button onClick={submitUser}>Submit</button>
            </form>
        </div>
    )
}

export default Login;