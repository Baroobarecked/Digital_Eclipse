import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import * as sessionActions from '../../store/session'

function SignUp() {
    const dispatch = useDispatch();

    const defualtImage = 'https://bl3302files.storage.live.com/y4mxB3XcxesiCtNVukzEyo-Yw1PBr9X-wsmQ9yXGDWBg8gjxG1alKrQCXsAS5Srr7JMZlgtN7zD17XhiUVitUhBHwuI1wdljs64c5lqA1MpQYz6BUzeobLoBet7notP3YNmPKlZE3ruYmleY149HTM-Far7HEP7I9CNNgtaGCz-2QinInLrmyuVKpogRmiFF3zK?width=3024&height=4032&cropmode=none'
    
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);

    const submitUser = async () => {
        dispatch(sessionActions.setSessionUser({'user': [firstName, lastName, username, email, password, defualtImage]}))
    }

    return (
        <div>
            <input type={'text'} onChange={e => setFirstName(e.target.value)} value={firstName}/>
            <input type={'text'} onChange={e => setLastName(e.target.value)} value={lastName}/>
            <input type={'text'} onChange={e => setUsername(e.target.value)} value={username}/>
            <input type={'text'} onChange={e => setEmail(e.target.value)} value={email}/>
            <input type={'text'} onChange={e => setPassword(e.target.value)} value={password}/>
            <input type={'text'} onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword}/>
            <div value={defualtImage}>Drop Zone</div>
            <button onClick={submitUser}>Submit</button>
        </div>
        // <p>Hello World</p>
    )
}

export default SignUp;