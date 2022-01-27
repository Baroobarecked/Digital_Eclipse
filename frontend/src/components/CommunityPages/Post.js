import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router"
import { io } from 'socket.io-client';

import * as postActions from '../../store/post'

let socket;

export default function Posts() {
    const data = useParams();
    let discussionId = data['forumid']
    let discussionTitle = data['forumtitle']
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.session.User)
    const posts = useSelector(state => state.posts.posts)
    const [content, setContent] = useState('');
    const [editContent, setEditContent] = useState('')
    const [editId, setEditId] = useState(null)

    useEffect(() => {
        dispatch(postActions.setPostState(discussionId))
    }, [discussionTitle, discussionId])

    // useEffect(() => {
    //     if(socket) {
    //         socket.disconnect()
    //     }
    // }, [])

    useEffect(() => {

        socket = io();

        socket.on('connect', () => {
            socket.emit('join_discussion', {
                'discussion': discussionId
            })
        })
        
        socket.on('post', async (post) => {
            if(post['0'].user_id !== currentUser.id) {
                await dispatch(postActions.updatePosts(post));
            }
        })

        socket.on('post_delete', async (postId) => {
            
            await dispatch(postActions.directDelete(postId));
        })

        socket.on('post_edit', async (post) => {
            if(post.user_id !== currentUser.id) {
                await dispatch(postActions.directEdit(post));
            }
        })

        return (() => {
            socket.disconnect()
        })

    }, [discussionId])

    const submitEdit = () => {
        let post = {'post': {'id': editId, 'content': editContent, 'forum_id': discussionId, 'user_id': currentUser.id}}
        dispatch(postActions.editAPost(post))
        socket.emit('post_edit', { ...post  })
    }


    return (
        <>
            <Outlet  />
            <div id='posts'>
                <h1>{discussionTitle}</h1>
                <div id='post_container'>
                    {posts && posts.map(post => {
                        return(
                            <div className="post_content">
                                <img className="profile_image" src={`${post[2]}`}></img>
                                <p className="username">{post[1]}</p>
                                {!(post[0].id === editId) && <p className="content">{post[0].content}</p>}
                                {post[0].id === editId && <textarea className='content' type='text' value={editContent} onChange={e => setEditContent(e.target.value)}></textarea>}
                                {post[0].user_id === currentUser.id && 
                                    <div className="edit_buttons">
                                        {post[0].id !== editId && <button onClick={() => {
                                            setEditContent(post[0].content)
                                            setEditId(post[0].id)
                                        }}>Edit</button>}
                                        {(post[0].id === editId) && <button onClick={() => {
                                            submitEdit()
                                            setEditId(null)
                                        }}>Close Edit</button>}
                                        <button onClick={() => {
                                            dispatch(postActions.deleteAPost(post[0].id))
                                            socket.emit('post_delete', {'postId': post[0].id, discussionId})
                                        }}>Delete</button>
                                    </div>
                                }
                            </div>
                        )
                    })}
                </div>
                <div>
                    <input type='text' value={content} onChange={e => setContent(e.target.value)}></input>
                    <button onClick={async e => {
                        let user = currentUser;
                        let res = await dispatch(postActions.createNewPost({user, content, discussionId}))
                        socket.emit('post', { ...res,  })
                        setContent('')
                    }}>Submit</button>
                </div>
            </div>
        </>
    )
}