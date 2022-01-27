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
    console.log(posts)

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
            console.log(socket)
        })
        
        socket.on('post', async (post) => {
            if(post['0'].user_id !== currentUser.id) {
                await dispatch(postActions.updatePosts(post));
            }
        })

        socket.on('post_delete', async (postId) => {
            console.log(postId)
            await dispatch(postActions.directDelete(postId));
        })

        socket.on('post_edit', async (post) => {
            if(post['0'].user_id !== currentUser.id) {
                await dispatch(postActions.updatePosts(post));
            }
        })

        return (() => {
            console.log('in disconnect')
            socket.disconnect()
            console.log(socket)
        })

    }, [discussionId])


    return (
        <>
            <Outlet  />
            <div id='posts'>
                <h1>{discussionTitle}</h1>
                <div id='post_container'>
                    {posts && posts.map(post => {

                        return(
                            <div className="post_content">
                                <p>{post[1]}</p>
                                <p>{post[0].content}</p>
                                <button onClick={() => {
                                    dispatch(postActions.deleteAPost(post[0].id))
                                    socket.emit('post_delete', {'postId': post[0].id, discussionId})
                                }}>Delete</button>
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
                    }}>Submit</button>
                </div>
            </div>
        </>
    )
}