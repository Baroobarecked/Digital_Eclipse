import {useState} from 'react';
import { useNavigate, useParams } from 'react-router';

export default function SongForm() {
    // const dispatch = useDispatch();
    const [audioUrl, setAudioUrl] = useState(null);
    const [imageLoading, setImageLoading] = useState(false)
    const { albumId } = useParams();
    const navigate = useNavigate();
    // const [songsArray, setSongsArray] = useState({});
    const [songs, setSongs] = useState({})
    const [songToAdd, setSongToAdd] = useState('')

    const [side, setSide] = useState(0);
    const [minimize, setMinimize] = useState(false)
    // const [songs, setSongs] = useState(0);
    // const [songList, setSongList] = useState({})
    // const [components, setComponents] = useState([])
    // const [songComponents, setSongComponents] = useState([])

    // const songComponent = (e) => {
    //     console.log('hi')
    //     e.preventDefault()
    //     setSongs(songs + 1)
    //     const i = songs
    //     let component = (
    //         <>
    //             <input type={'text'} onBlur={e => setSongList(songList[i] = e.target.value)}/>
    //         </>
    //     )
    //     console.log(component)
    //     setSongComponents(songComponents.push(component))
    //     console.log(songComponents)
    // }

    // const sideComponent = (url) => {
    //     // e.preventDefault()
    //     let songToAdd;
    //     // let songs = [];
    //     let i = side
    //     let component = (
    //         <li>
    //             {/* <button onClick={songComponent}>Add Song</button> */}
    //             <label /> Side {i}
    //             {/* <ul>
    //                 {songs && songs.map(song => {
    //                     console.log(song)
    //                     return (
    //                         <li>
    //                             {song}
    //                         </li>
    //                     )
    //                 })}
    //             </ul> */}
    //             <input type={'text'} onChange={e => {
    //                 songToAdd = e.target.value
    //             }} value={songToAdd}/>
    //             <input type={'number'} onChange={e => setSide(e.target.value)} />
    //             <button onClick={e => {
    //                 e.preventDefault()
    //                 let key = `Side ${i}`;
    //                 if(songs[key]){
    //                     console.log(songs[key])
    //                     songs[key] = [...songs[key], songToAdd]
    //                     setSongs(songs)
    //                 } else {
    //                     songs[key] = [songToAdd]
    //                     setSongs(songs)
    //                 }
    //                 navigate(`/albums/${albumId}/songs`, {replace: false})
    //                 // console.log(songToAdd)
    //                 console.log(songs)
    //                 // console.log('hello')
    //             }}>Add Song</button>
    //         </li>
    //     )
    //     setComponents([...components, component])
    //     console.log(components)
    //     setSongsArray(songsArray[`Side ${i}`] = {'url': url})
    // }

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
            console.log(data)
        }
        else alert('Could not get signed URL')
    }

    async function uploadFile(file, s3Data, url) {

        let postData = new FormData();
        for(let key in s3Data.fields){
            postData.append(key, s3Data.fields[key]);
        }
        postData.append('file', file);

        console.log(file.type)

        const res = await fetch(s3Data.url, {
            method: 'post',
            body: postData
        })
        if(res.ok) {
            if(file.type.includes('audio/')) {
                console.log('audio')
                songs[`Side ${side + 1}`] = [url]
                setSongs(songs)
                setSide(side + 1)
                setAudioUrl(url)
            }
            console.log('ok')
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

        let data = [songs, albumId, audioUrl];
        console.log(data);
    }

    
    let i = side

    return (
        <>
            {!minimize && (

                <div className='form_modal' onClick={() => {
                    setMinimize(true)
                }}>
                    <form id='add_song_form' onClick={e => e.stopPropagation()}>
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
                        
                        {audioUrl && 
                            <>
                                {/* <button onClick={songComponent}>Add Song</button> */}
                                <label /> Side {i}
                                {/* <ul>
                                    {songs && songs.map(song => {
                                        console.log(song)
                                        return (
                                            <li>
                                                {song}
                                            </li>
                                        )
                                    })}
                                </ul> */}
                                <label /> Song Title
                                <input type={'text'} onChange={e => {
                                    setSongToAdd(e.target.value)
                                }} value={songToAdd}/>
                                <label /> Record Side
                                <input type={'number'} onChange={e => setSide(e.target.value)} value={side} />
                                <button onClick={e => {
                                    e.preventDefault()
                                    let key = `Side ${i}`;
                                    if(songs[key]){
                                        console.log(songs[key])
                                        songs[key] = [...songs[key], songToAdd]
                                        setSongs(songs)
                                    } else {
                                        songs[key] = [audioUrl, songToAdd]
                                        setSongs(songs)
                                    }
                                    navigate(`/albums/${albumId}/songs`, {replace: false})
                                    
                                }}>Add Song</button>
                                

                                <ul>
                                    {Object.keys(songs) && Object.keys(songs).map(key => {
                                        console.log(key)
                                        console.log(songs[key])
                                        return (
                                            <>
                                                <h3>{key}</h3>
                                                {songs[key].map(song => {
                                                    if(song && !song.includes('-c8e3fd63-1c26-4660')) {
                                                        return (
                                                            <li>
                                                                {song}
                                                            </li>
                                                        )
                                                    }
                                                })}
                                            </>
                                        )
                                    })}
                                </ul> 
                                <button onClick={submitSongs}>Add Side</button>
                            </>
                        }            
                        
                    </form>
                </div>
                )
            }
            {minimize && imageLoading && <p onClick={() => setMinimize(false)} style={{'color':'white'}}>Uploading</p>}
            {minimize && !imageLoading && <p onClick={() => setMinimize(false)} style={{'color':'white'}}>Uploading Complete</p>}
        </>
    )
}