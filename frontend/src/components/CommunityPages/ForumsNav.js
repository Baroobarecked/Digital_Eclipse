import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import * as discussionActions from '../../store/discussion'



export default function ForumsNavigation() {
    const currentUser = useSelector(state => state.session.User)
    const navigate = useNavigate()
    const discussions = useSelector(state => state.forum.discussions)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(discussionActions.setDiscussionState())
        console.log(discussions)
    }, [])



    return (
        <div id='forum_navigation'>
            <h1>Discussions</h1>
            <button onClick={() => {
                navigate('/community/addforumdisscussion')
            }}>Add Forum</button>
            {discussions && discussions.map(discussion => {
                console.log(discussion)
                return (
                    <div>
                        <p onClick={() => {
                            navigate(`/community/${discussion.id}/${discussion.forum_title}`)
                        }}>{discussion.forum_title}</p>
                        <button onClick={() => {
                            dispatch(discussionActions.deleteADiscussion(discussion.id))
                        }}>Remove</button>
                    </div>
                )
            })}
        </div>
    )
}