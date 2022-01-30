import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as sessionActions from '../../store/session'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import * as discussionActions from '../../store/discussion'
// import useHistory from 'react-router-dom'

function CreateForum() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currentUser = useSelector(state => state.session.User)

    const [forumTitle, setForumTitle] = useState('');
    const [errors, setErrors] = useState([]);

    const submitForum = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        let userId = currentUser.id
        if(forumTitle.length > 0) {
            dispatch(discussionActions.createNewDiscussion({forumTitle, userId}))
            navigate('/community', {replace: true})
        } else {
            setErrors(['Forum Title cannot be empty'])
        }
    }

    return (
        <div className='form_modal' id='community_form' onClick={() => {
            navigate('/community')
        }}>
            <form id='create_forum' onClick={e => e.stopPropagation()}>
                {errors && errors.map(error => {
                    return (
                        <pre>{error}</pre>
                    )
                })}
                <label /> Discussion Title {forumTitle.length}/100
                <input type={'text'} onChange={e => {
                    if(e.target.value.length <= 100) {
                        setErrors([])
                        setForumTitle(e.target.value)
                    }
                }} required={true} value={forumTitle}/>
                <button onClick={submitForum}>Submit</button>
            </form>
        </div>
    )
}

export default CreateForum;