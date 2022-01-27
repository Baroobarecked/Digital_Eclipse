//Actions
const GET_SONGS = '/songs/GET_SONGS'
const EDIT_SONGS = '/songs/EDIT_SONGS';
const DELETE_SONGS = '/songs/DELETE_SONGS';
const RESET_SONGS = 'songs/RESET_SONGS'
// const ADD_SONG = '/songs/ADD_SONG';
// const DELETE_SONG = '/songs/DELETE_SONG';

//Action Creators

function setSongs(songs) {
    return {
        type: GET_SONGS,
        songs
    }
}

function editSongs(songs) {
    return {
        type: EDIT_SONGS,
        songs
    }
}

function deleteSongs(songId) {
    return {
        type: DELETE_SONGS,
        songId
    }
}

function resetSongs() {
    return {
        type: RESET_SONGS
    }
}

// function addSong(song) {
//     return {
//         type: ADD_SONGS,
//         song
//     }
// }

// function deleteSong(songId, songIndex) {
//     return {
//         type: DELETE_SONGS,
//         songId,
//         songIndex
//     }
// }

//Thunks
export const getAlbumsSongs = albumId => async dispatch => {
    let res = await fetch(`/api/albums/${albumId}/songs`)
    if(res.ok) {
        let songs = await res.json()
        dispatch(setSongs(songs))
    }
}


export const addNewSongs = songs => async dispatch => {
    let res = await fetch(`/api/songs`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            songs
        })
    })

    if(res.ok) {
        let songs = await res.json()
        // 
        dispatch(setSongs(songs))
        // return album;
    }
}

export const editAlbumSongs = songs => async dispatch => {
    let res = await fetch(`/api/songs`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            songs
        })
    })

    if(res.ok) {
        let songs = await res.json()
        // 
        dispatch(setSongs(songs))
        // return album;
    }
}

export const resetTheSongs = () => async dispatch => {
    dispatch(resetSongs())
}

//Reducer
export default function songsReducer(state = null, action) {
    switch(action.type) {
        case GET_SONGS:
            return [...action.songs.songs];
        case RESET_SONGS:
            return null
        default:
            return state;
    }
}