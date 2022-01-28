//Actions
const GET_ALBUMS = '/albums/GET_ALBUMS';
const ADD_ALBUM = '/albums/ADD_ALBUM';
const EDIT_ALBUM = '/albums/EDIT_ALBUM';
const DELETE_ALBUM = '/albums/DELETE_ALBUM';
const FILTER_ALBUMS = '/albums/FILTER_ALBUMS';

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
function editAlbum(album) {
    return {
        type: EDIT_ALBUM,
        album
    }
}
function deleteAlbum(albumId) {
    return {
        type: DELETE_ALBUM,
        albumId
    }
}
function filterAlbums(searchVal) {
    return {
        type: FILTER_ALBUMS,
        searchVal
    }
}

//Thunks
export const getUserAlbums = userId => async dispatch => {
    let res = await fetch(`/api/albums/${userId}`)

    if(res.ok) {
        let albums = await res.json()
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
        // 
        dispatch(addAlbum(album.album))
        return album;
    }
}
export const editOldAlbum = album => async dispatch => {
    let res = await fetch(`/api/albums`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            album
        })
    })

    if(res.ok) {
        let album = await res.json()
        // 
        dispatch(editAlbum(album.album))
        return album;
    }
}

export const deleteTheAlbum = albumId => async dispatch => {
    let res = await fetch(`/api/albums`, {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'album_id': albumId
        })
    })

    if(res.ok) {
        let message = await res.json()
        dispatch(deleteAlbum(albumId))
        // return album;
    }
}

export const filterTheAlbums = searchVal => async dispatch => {
    dispatch(filterAlbums(searchVal))
}
let storeState;
//Reducer
export default function albumsReducer(state = null, action) {
    let newState = {};
    switch(action.type) {
        case GET_ALBUMS:
            storeState = {'albums': [...action.albums]}
            return {'albums': [...action.albums]}
        case ADD_ALBUM:
            newState = {...state};
            newState['albums'].push(action.album);
            return newState;
        case EDIT_ALBUM:
            newState = {...state};
            newState['albums'].forEach((album, index) => {
                if(album.id === action.album.id) {
                    newState.albums[index] = action.album
                }
            });
            return newState;
        case DELETE_ALBUM:
            newState = {...storeState};
            let albums = newState['albums']
            newState['albums'].forEach((album, index) => {
                if(album.id == action.albumId) {
                    albums.splice(index, 1)
                }
            });
            newState['albums'] = albums
            return newState
        case FILTER_ALBUMS:
            newState = {...storeState}
            newState = {'albums': newState['albums'].filter(album => {
                if( album.album_title.toLowerCase().includes(action.searchVal.toLowerCase())) {
                    return album
                }
            })}
            return newState;
        default:
            return state;
    }
}