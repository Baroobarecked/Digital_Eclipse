import {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import * as songsActions from '../../store/song';

export default function SongForm() {
    const dispatch = useDispatch();
    const [audioUrl, setAudioUrl] = useState(null);
    const [imageLoading, setImageLoading] = useState(false)
    const { albumId } = useParams();
    const navigate = useNavigate();
    const [songs, setSongs] = useState({})
    const [songToAdd, setSongToAdd] = useState('')
    const albumSongs = useSelector(state => state.songs)
    const [side, setSide] = useState(0);
    const [minimize, setMinimize] = useState(false)
    const [displayForm, setDisplayForm] = useState(false);
    const [errors, setErrors] = useState([])

    
    function resetAlbumSongs() {
        let tempSong = {};
        Object.values(songs).forEach((song, index) => {
            tempSong[`Side ${index + 1}`] = song
        })
        setSongs(tempSong)
    }
    
    useEffect(() => {
        if(albumSongs) {
            let url
            albumSongs.forEach(side => {
                let songSplit = side.songs.split(/\['|',\s'|'\]|\["|",\s"|"\]|',\s"|",\s'/)
                const test = /.*[a-zA-Z0-9]+.*/;
                let songData = songSplit.filter(item => item.match(test));
                url = songData.shift();
                songs[`Side ${side.side}`] = [url, ...songData]
                setSongs(songs)
                setSide(side.side)
            })
            setDisplayForm(true)
        }
    }, [albumSongs, audioUrl])

    async function getSignedRequest(file) {
        const res = await fetch(`/api/uploads`, {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'file': [file.name, file.type]
            })
        })
        if(res.ok) {
            const data = await res.json()
            uploadFile(file, data.data, data.url)
            
        }
        else alert('Could not get signed URL')
    }

    async function uploadFile(file, s3Data, url) {

        let postData = new FormData();
        for(let key in s3Data.fields){
            postData.append(key, s3Data.fields[key]);
        }
        postData.append('file', file);

        

        const res = await fetch(s3Data.url, {
            method: 'post',
            body: postData
        })
        if(res.ok) {
            if(file.type.includes('audio/')) {
                
                songs[`Side ${side + 1}`] = [url]
                setSongs(songs)
                setSide(side + 1)
                setAudioUrl(url)
                setDisplayForm(true)
            }
            setImageLoading(false)
        }
        else alert('Could not upload file.')
    }
    
    const dropHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let data = e.dataTransfer.files;
        
        // setImage(data['0']);
        setImageLoading(true);
        getSignedRequest(data['0']);
        e.target.style.backgroundColor = 'green'
        e.target.innerHTML = 'Image Selected'
    }

    function allowDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        e.target.style.backgroundColor = 'blue';

    }

    function revertDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        e.target.style.backgroundColor = 'maroon';
    }

    function submitSongs(e) {
        e.preventDefault();
        let data = [songs, albumId];
        
        dispatch(songsActions.addNewSongs(data));
        navigate('/albums')
    }

    function editSongs(e) {
        e.preventDefault();
        let data = [songs, albumId];
        
        dispatch(songsActions.editAlbumSongs(data));
        navigate('/albums')
    }

    function deleteSong(e, key, index) {
        e.preventDefault()
        e.stopPropagation()
        songs[key].splice(index, 1)
        setSongs(songs)
        navigate(`/albums/${albumId}/songs`)
    }
    
    function deleteSide(e, key) {
        e.preventDefault()
        e.stopPropagation()
        delete songs[key]
        setSide(side - 1)
        
        
        resetAlbumSongs()
        navigate(`/albums/${albumId}/songs`)
    }

    
    let i = side

    return (
        <>
            {!minimize && (

                <div className='form_modal absolute_form' onClick={() => {
                    setMinimize(true)
                }}>
                    <form id='add_song_form' onClick={e => e.stopPropagation()}>
                        {errors && errors.map(error => {
                            return (
                                <pre>{error}</pre>
                            )
                        })}
                        <h1>Add Side</h1>
                        {!imageLoading && 
                            <div className='drop_zone'
                                className='drop_zone' 
                                accept="audio/*" 
                                onDrop={e => {
                                    dropHandler(e)
                                }} 
                                onDragOver={allowDrop}
                                onDragLeave={revertDrop}
                                >
                                Drag and Drop Audio Here
                            </div>
                        }
                        {imageLoading && <p>Uploading...</p>}
                        
                        {displayForm && (side > 0) && 
                            <>
                                <h3>Editing Side {i}</h3>
                                
                                <label /> Change Record Side
                                <input type={'number'} onChange={e => setSide(e.target.value)} value={side} max={Object.keys(songs).length} min='1' />
                                <label /> Song Title
                                <input type={'text'} onChange={e => {
                                    if(e.target.value) {
                                        setSongToAdd(e.target.value)
                                    } else {
                                        setErrors(['Song title cannot be empty'])
                                    }
                                }} value={songToAdd}/>
                                <button onClick={e => {
                                    e.preventDefault()
                                    let key = `Side ${i}`;

                                    if(songs[key]){
                                        
                                        songs[key] = [...songs[key], songToAdd]
                                        setSongs(songs)
                                    } else {
                                        songs[key] = [audioUrl, songToAdd]
                                        setSongs(songs)
                                    }
                                    setSongToAdd('')
                                    navigate(`/albums/${albumId}/songs`, {replace: false})
                                    
                                }}>Add Song</button>
                                

                                <ul>
                                    {Object.keys(songs) && Object.keys(songs).map(key => {
                                        return (
                                            <>
                                                <div className='sideDisplay'>
                                                    <h3>{key}</h3>
                                                    <button onClick={e => deleteSide(e, key)}>Remove Side</button>
                                                </div>
                                                {songs[key].map((song, index)=> {
                                                    if(song && !song.includes('-c8e3fd63-1c26-4660')) {
                                                        return (
                                                            <li className='songComponent'>
                                                                {song}
                                                                <button onClick={e => {
                                                                    deleteSong(e, key, index)
                                                                }}>Remove Song</button>
                                                            </li>
                                                        )
                                                    }
                                                })}
                                            </>
                                        )
                                    })}
                                </ul>
                                {!albumSongs && 
                                    <button onClick={submitSongs}>Add to Album</button>
                                } 
                            </>
                        }            
                        {albumSongs && 
                            <button onClick={editSongs}>Edit Album Songs</button>
                        } 
                    </form>
                </div>
                )
            }
            {minimize && imageLoading && <p className='uploading' onClick={() => setMinimize(false)} style={{'color':'white'}}>Uploading</p>}
            {minimize && !imageLoading && !audioUrl && <p className='uploading' onClick={() => setMinimize(false)} style={{'color':'white'}}>Return to Edit Form</p>}
            {minimize && !imageLoading && audioUrl && <p className='uploading' onClick={() => setMinimize(false)} style={{'color':'white'}}>Upload Complete</p>}
        </>
    )
}