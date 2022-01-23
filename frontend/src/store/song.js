//Actions
const GET_SONGS = '/songs/GET_SONGS'
const ADD_SONGS = '/songs/ADD_SONGS';
const DELETE_SONGS = '/songs/DELETE_SONGS';
// const ADD_SONG = '/songs/ADD_SONG';
// const DELETE_SONG = '/songs/DELETE_SONG';

//Action Creators

function setSongs(songs) {
    return {
        type: GET_SONGS,
        songs
    }
}

function addSongs(songs) {
    return {
        type: ADD_SONGS,
        songs
    }
}

function deleteSongs(songId) {
    return {
        type: DELETE_SONGS,
        songId
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
        // console.log(album)
        dispatch(setSongs(songs))
        // return album;
    }
}

//Reducer
export default function songsReducer(state = null, action) {
    let newState = {};
    switch(action.type) {
        case GET_SONGS:
            return [...action.songs.songs];
        case ADD_SONGS:
            console.log(action)
            newState = {...state};
            newState[action.album.id] = action.album;
            return newState;
        case DELETE_SONGS:

        default:
            return state;
    }
}