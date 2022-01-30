// actions
const SET_DISCUSSIONS = '/discussions/SET_DISCUSSIONS'
const CREATE_DISCUSSIONS = '/discussions/CREATE_DISCUSSIONS'
const DELETE_DISCUSSION = '/discussions/DELETE_DISCUSSION'

// action creators
const setDiscussions = discussions => {
    return {
        type: SET_DISCUSSIONS,
        discussions
    }
}

const createDiscussion = data => {
    return {
        type: CREATE_DISCUSSIONS,
        data
    }
}

const deleteDiscussion = forumId => {
    return {
        type: DELETE_DISCUSSION,
        forumId
    }
}



// thunks
export const setDiscussionState = () => async dispatch => {
    let res = await fetch('/api/forums')

    if(res.ok) {
        let result = await res.json()
        

        dispatch(setDiscussions(result.discussions))
    }
}

export const setFilteredDiscussionState = val => async dispatch => {
    let res = await fetch('/api/forums/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'value': val
        })
    })

    if(res.ok) {
        let result = await res.json()
        

        dispatch(setDiscussions(result.discussions))
    }
}

export const createNewDiscussion = data => async dispatch => {
    let res = await fetch('/api/forums', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'forum_title': data.forumTitle,
            'admin': data.userId
        })
    })

    if(res.ok) {
        let result = await res.json()

        dispatch(createDiscussion(result.discussion))
    }
}

export const deleteADiscussion = forumId => async dispatch => {
    let res = await fetch('/api/forums', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'forum_id': forumId
        })
    })

    if(res.ok) {
        await dispatch(setDiscussionState())
    }
}

//reducer

export default function forumReducer(state = {'discussions': []}, action) {
    let newState = {}
    switch(action.type) {
        case SET_DISCUSSIONS:
            return {'discussions': [...action.discussions]}
        case CREATE_DISCUSSIONS:
            newState = {...state}
            let discussions = newState['discussions']
            discussions.push(action.data)
            return {'discussions': [...discussions]}
        default:
            return state
    }
}