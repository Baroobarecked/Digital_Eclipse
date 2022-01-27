// actions
const SET_POSTS = '/posts/SET_POSTS'
const CREATE_POSTS = '/posts/CREATE_POSTS'
const DELETE_POST = '/posts/DELETE_POST'
const RESET_POSTS = '/posts/RESET_POSTS'
const EDIT_POST = 'posts/EDIT_POST'

// action creators
const setPosts = posts => {
    return {
        type: SET_POSTS,
        posts
    }
}

const createPost = data => {
    return {
        type: CREATE_POSTS,
        data
    }
}

const deletePost = postId => {
    return {
        type: DELETE_POST,
        postId
    }
}

const resetPosts = () => {
    return {
        type: RESET_POSTS
    }
}

const editPost = post => {
    return {
        type: EDIT_POST,
        post
    }
}



// thunks
export const setPostState = discussionId => async dispatch => {
    let res = await fetch(`/api/forums/${discussionId}`)

    if(res.ok) {
        let result = await res.json()
        console.log(result)
        if(result.posts) {
            dispatch(setPosts(result.posts))
        } else {
            dispatch(resetPosts())
        }
    }
}

export const createNewPost = data => async dispatch => {
    let res = await fetch(`/api/forums/${data.discussionId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'user': data.user,
            'content': data.content
        })
    })

    if(res.ok) {
        let result = await res.json()
        let post = [result, data.user.username, data.user.profile_image]
        dispatch(createPost(post))
        return post
    }
}

export const updatePosts = data => async dispatch => {
    dispatch(createPost(data));
}

export const deleteAPost = postId => async dispatch => {
    let res = await fetch('/api/posts', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'post_id': postId
        })
    })

    if(res.ok) {
        dispatch(deletePost(postId))
    }
}

export const directDelete = postId => dispatch => {
    dispatch(deletePost(postId))
}

export const editAPost = post => async dispatch => {
    let res = await fetch('/api/posts', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            post
        })
    })

    if(res.ok) {
        let result = await res.json()
        console.log(result)
        dispatch(editPost(result.post))
    }
}

export const directEdit = post => dispatch => {
    console.log(post)
    dispatch(editPost(post))
}

//reducer

export default function postReducer(state = {'posts': []}, action) {
    let newState = {}
    switch(action.type) {
        case SET_POSTS:
            return {'posts': [...action.posts]}
        case CREATE_POSTS:
            console.log(action)
            newState = {...state}
            newState['posts'].push(action.data)
            console.log(newState)
            let postArray = newState['posts']
            return {'posts': [...postArray]}
        case DELETE_POST:
            newState = {...state}
            let posts = newState.posts
            newState.posts.forEach((post, index) => {
                if(post[0].id == action.postId) {
                    posts.splice(index, 1)
                }
            })
            return {'posts': [...posts]};
        case RESET_POSTS:
            return {'posts': []}
        case EDIT_POST:
            newState = {...state};
            let editPosts = newState.posts
            newState['posts'].forEach((post, index) => {
                if(post[0].id === action.post.id) {
                    editPosts[index].splice(0, 1, action.post)
                }
            });
            return {'posts': [...editPosts]};
        default:
            return state
    }
}