import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as sessionActions from '../../store/session'
import { NavLink, useNavigate } from 'react-router-dom'

function SignUp() {
    const dispatch = useDispatch();

    const defualtImage = 'https://bl3302files.storage.live.com/y4mxB3XcxesiCtNVukzEyo-Yw1PBr9X-wsmQ9yXGDWBg8gjxG1alKrQCXsAS5Srr7JMZlgtN7zD17XhiUVitUhBHwuI1wdljs64c5lqA1MpQYz6BUzeobLoBet7notP3YNmPKlZE3ruYmleY149HTM-Far7HEP7I9CNNgtaGCz-2QinInLrmyuVKpogRmiFF3zK?width=3024&height=4032&cropmode=none'
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [imageLoading, setImageLoading] = useState(false)
    const currentUser = useSelector(state => state.session.User)
    const navigate = useNavigate();

    const submitUser = async (e) => {
        e.preventDefault();
        let res = await dispatch(sessionActions.setSessionUser({'user': [firstName, lastName, username, email, password, imageUrl ? imageUrl : defualtImage]}))
        console.log(res)
        if(res) {
            setErrors(res['errors'])
        } else {
            console.log('in here')
            navigate('/albums')
        }
    }

    useEffect(() => {
        if(currentUser) {
            navigate('/albums')
        }
    }, [])

    async function getSignedRequest(file) {
        const res = await fetch(`/api/uploads`, {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'file': [file.name, file.type]
            })
        })
        if(res.ok) {
            const data = await res.json()
            uploadFile(file, data.data, data.url)
            console.log(data)
        }
        else alert('Could not get signed URL')
    }

    async function uploadFile(file, s3Data, url) {

        let postData = new FormData();
        for(let key in s3Data.fields){
            postData.append(key, s3Data.fields[key]);
        }
        postData.append('file', file);

        console.log(file.type)

        const res = await fetch(s3Data.url, {
            method: 'post',
            body: postData
        })
        if(res.ok) {
            setImageUrl(url)
            console.log('ok')
            setImageLoading(false)
        }
        else alert('Could not upload file.')
    }
    
    const dropHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let data = e.dataTransfer.files;
        setImageLoading(true);
        getSignedRequest(data['0']);
        e.target.style.backgroundColor = 'green'
        e.target.innerHTML = 'Image Selected'
    }

    function allowDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        e.target.style.backgroundColor = 'blue';

    }

    function revertDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        e.target.style.backgroundColor = '#202225';
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
            <div className='drop_zone'
                accept="image/*" 
                onDrop={dropHandler} 
                onDragOver={allowDrop}
                onDragLeave={revertDrop}
                >
                Drag and Drop Profile Picture Here
            </div>
            {imageUrl && <p>To change image, upload another.</p>}
            {(imageLoading) && <p>Loading...</p>}
            <button onClick={submitUser}>Join Eclipse</button>
            <p>Have an account? <NavLink to='/login'>Login</NavLink></p>
        </form>
    )
}

export default SignUp;