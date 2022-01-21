//Actions
const GET_ALBUMS = '/albums/GET_ALBUMS';
const ADD_ALBUM = '/albums/ADD_ALBUM';
const DELETE_ALBUM = '/albums/DELETE_ALBUM';

//Action Creators
function getAlbums(albums) {
    return {
        type: GET_ALBUMS,
        albums
    }
}
function addAlbum(album) {
    return {
        type: ADD_ALBUM,
        album
    }
}
function deleteAlbum(albumId) {
    return {
        type: DELETE_ALBUM,
        albumId
    }
}

//Thunks
export const getUserAlbums = userId => async dispatch => {
    let res = await fetch(`/albums/${userId}`)

    if(res.ok) {
        let albums = res.json()
        dispatch(getAlbums(albums['albums']))
    }
}

export const addNewAlbum = album => async dispatch => {
    let res = await fetch(`/api/albums`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            album
        })
    })

    if(res.ok) {
        let album = await res.json()
        // console.log(album)
        dispatch(addAlbum(album.album))
    }
}

//Reducer
export default function albumsReducer(state = null, action) {
    let newState = {};
    switch(action.type) {
        case GET_ALBUMS:
            return {...action.albums}
        case ADD_ALBUM:
            console.log(action)
            newState = {...state};
            newState[action.album.id] = action.album;
            return newState;
        case DELETE_ALBUM:

        default:
            return state;
    }
}