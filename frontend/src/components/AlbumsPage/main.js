import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import * as albumActions from '../../store/album';
import * as songActions from '../../store/song';
import { Outlet, useNavigate, useMatch } from 'react-router-dom';
import ForumPage from '../CommunityPages/Forum';
import Navbar from '../Navbar';

function Albums() {
    const albums = useSelector(state => state.albums)
    const currentUser = useSelector(state => state.session.User)
    const dispatch = useDispatch()
    const [albumData, setAlbumData] = useState(null)
    const [albumIndex, setAlbumIndex] = useState(null)
    const [displayScroll, setDisplayScroll] = useState(true)
    const songs = useSelector(state => state.songs)
    const navigator = useNavigate()
    const [playUrl, setPlayUrl] = useState(null)
    const [recordPlaying, setRecordPlaying] = useState(false)
    const [pause, setPause] = useState(false)
    const [barHeights, setBarHeights] = useState([])
    const [bars, setBars] = useState([])
    const [bufferInterval, setBufferInterval] = useState()
    const [analyserNode, setAnalyserNode] = useState()
    const [Nirvana, setNirvana] = useState(false)
    const [displayButtons, setDisplayButtons] = useState(false)
    const [audioCtx, setAudioCtx] = useState(null)
    const editOpen = useMatch('/albums/:albumId/songs')
    const communityOpen = useMatch('/community/*')

    useEffect(() => {
        if(!currentUser) {
            navigator('/login')
        }
    }, [])

    useEffect(() => {
        if(communityOpen) {
            resumeMonitoring()
        }
    }, [communityOpen])
    

    useEffect(() => {
        if(albumIndex) {
            setAlbumData(albums.albums[albumIndex])
        }
    }, [albums])

    useEffect(() => {
        const client = document.getElementById('soundDisplay');
        
        if(client) {
            const displayWidth = client.clientWidth;
            
            barHeights.forEach((val, index) => {
                bars[index] = ((
                    <div className='soundBar' style={{
                        width: `${displayWidth / barHeights.length}px`,
                        height: `${val / 3}%`,
                        backgroundAttachment: 'fixed',
                        backgroundSize: '100vw 100vh',
                    }}></div>
                ))
                setBars(bars);
            })
        }



    }, [barHeights])

    useEffect(() => {
        if(currentUser) {
            dispatch(albumActions.getUserAlbums(currentUser.id));
        }
    }, [currentUser])

    const connectAudio = () => {
        
        
        if(!audioCtx) {
            let AudioContext = window.AudioContext || window.webkitAudioContext;
            let context = new AudioContext({
                latencyHint: 'playback',
                sampleRate: 96000,
            })
            setAudioCtx(context)
        }
    }
    
    useEffect(() => {
        let analyser;
        if(audioCtx) {
            let aud = document.getElementById('audio_player')
    
            let audSource = audioCtx.createMediaElementSource(aud)
        
            analyser = new AnalyserNode(audioCtx, {
                fftSize: 1024,
            })

            
            audSource.connect(analyser).connect(audioCtx.destination);
            setAnalyserNode(analyser)
            resumeMonitoring()
        }
    }, [audioCtx])

    function resumeMonitoring() {
        if(analyserNode) {
            let dataArray = new Uint8Array(analyserNode.frequencyBinCount);
            
    
            let bufferInt = setInterval(() => {
                void analyserNode.getByteFrequencyData(dataArray);
                setBarHeights([...dataArray])
                setBars([])
    
            }, 100)
            setBufferInterval(bufferInt)
            clearInterval(bufferInterval)

        }

    }
    
    let timeout;
    let changeSize;
    let averageSpeed;

    const scrollAlbums = (e) => {
        e.stopPropagation()

        clearTimeout(timeout);

        let multiplier = e.deltaY

        if(averageSpeed <= 0 && e.deltaY < 0) {
            averageSpeed = (averageSpeed + multiplier ) / 2
        } else if (averageSpeed >= 0 && e.deltaY > 0) {
            averageSpeed = (averageSpeed + multiplier ) / 2
        } else averageSpeed = 0

        if(e.target.className === 'album_display') {
            e.target.scrollLeft += averageSpeed
        }
        else if(e.target.className === 'album' || e.target.className === 'scrollBuffer') {
            e.target.parentElement.scrollLeft += averageSpeed
        }
        else if(e.target.className === 'album_wrapper') {
            e.target.parentElement.parentElement.scrollLeft += averageSpeed
        } else {
            e.target.parentElement.parentElement.parentElement.scrollLeft += averageSpeed
        }
       
        
        
        
        changeSize = setInterval(sizeAlbums, 10)
        
        timeout = setTimeout(() => {
            clearInterval(changeSize)
        }, 2000)
        
        
    }


    const sizeAlbums = () => {
        const albumDisplay = document.getElementsByClassName('album_display')[0]
        const albumWrappers = Array.from(document.getElementsByClassName('album_wrapper'))
        if(albumDisplay) {
            const albumDisplayLocation = albumDisplay.getBoundingClientRect()
            const halfWidth = albumDisplayLocation.width / 2;
            for(let i = 0; i < albumWrappers.length; i++) {
                let albumWrapper = albumWrappers[i];
                let albumWrapperLocation = albumWrapper.getBoundingClientRect();
                let middle = (albumWrapperLocation.right + albumWrapperLocation.x) /2;
                if(middle <= halfWidth && middle > 0){
                    albumWrapper.style.width = `${10 + 25 * middle / halfWidth}vh`
                    albumWrapper.style.height = `${10 + 25 * middle / halfWidth}vh`
                    albumWrapper.style.top = `${15000 * middle**(1/6) / halfWidth}%`
                    albumWrapper.style.opacity = `${100 * middle**(1/3) / halfWidth**(1/3)}%`
                    albumWrapper.style.fontSize = `${3 * middle / halfWidth}vh`
                } else if (middle > halfWidth && middle <= albumDisplayLocation.width){
                    albumWrapper.style.width = `${10 + 25 * (albumDisplayLocation.width - middle) / halfWidth}vh`
                    albumWrapper.style.height = `${10 + 25 * (albumDisplayLocation.width - middle) / halfWidth}vh`
                    albumWrapper.style.top = `${15000 * (albumDisplayLocation.width - middle)**(1/6) / halfWidth}%`
                    albumWrapper.style.opacity = `${100 * (albumDisplayLocation.width - middle)**(1/3) / halfWidth**(1/3)}%`
                    albumWrapper.style.fontSize = `${3 * (albumDisplayLocation.width - middle) / halfWidth}vh`
                } else {
                    albumWrapper.style.width = `10vh`
                    albumWrapper.style.height = `10vh`
                    albumWrapper.style.opacity = '0%'
                }
            }
        }
    }

    useEffect(() => {
        if(!communityOpen) {
            sizeAlbums()
        }
    }, [albums, communityOpen])

    const albumClick = (album) => {
        setDisplayScroll(false)
        dispatch(songActions.getAlbumsSongs(album.id))
        connectAudio()
    }

    const dropHandler = (e) => {
        e.preventDefault();
        let player = document.getElementById('audio_player')
        player.src = '';
        player.src = playUrl;
        player.play();
        setPause(false)
        resumeMonitoring()
        setRecordPlaying(true);
        let record = document.getElementById('record_image')
        if(record) {
            record.style.animationPlayState = 'running';
        }
    }

    function allowDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        // connectAudio()
    }

    function revertDrop(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    function deleteAlbum(albumId) {
        dispatch(albumActions.deleteTheAlbum(albumId))
    }

    function playAudio(e) {
        resumeMonitoring();
        document.getElementById('audio_player').play();
        document.getElementById('record_image').style.animationPlayState = 'running';
    }

    function pauseAudio(e) {
        clearInterval(bufferInterval);
        document.getElementById('audio_player').pause();
        document.getElementById('record_image').style.animationPlayState = 'paused';
    }

    function stopAudio(e) {
        e.preventDefault()
        e.stopPropagation()
        let player = document.getElementById('audio_player')
        player.src = '';
        console.log(bufferInterval)
        clearInterval(bufferInterval)
        document.getElementById('audio_player').pause()
        setRecordPlaying(false)
    }

    return (
        <div className='album_main'>
            {(!displayScroll || communityOpen) && 
                <>
                    <div id='soundDisplay'>
                        {bars}   
                    </div>
                    <div id='soundDisplay2'>
                        {bars}   
                    </div>
                </>
            }
            {displayScroll && !communityOpen &&
                (<div className='album_display' onWheel={scrollAlbums}>
                    <div className='scrollBuffer'></div>
                    {albums && albums.albums.map((album, index) => {
                        sizeAlbums()
                        return (
                            <div className='album'>
                                <div className='album_wrapper' value={album} onClick={e => {
                                    setAlbumData(album);
                                    setAlbumIndex(index)
                                    albumClick(album);
                                    resumeMonitoring();
                                }} style={{backgroundImage:`url(${album.album_cover})`}}>
                                    <h1><span>{album.album_title}</span></h1>
                                </div>
                            </div>
                        )
                    })}
                    <div className='scrollBuffer'></div>
                </div>)
            }
            {/* {communityOpen && <ForumPage />} */}
            {!displayScroll && !Nirvana && !communityOpen &&
                <div className='album_display' style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}> 
                <div className='shadow'>
                    <div className='song_list'>
                        {songs && songs.map(side => {
                            let songSplit = side.songs.split(/\['|',\s'|'\]|\["|",\s"|"\]|',\s"|",\s'/)
                            const test = /.*[a-zA-Z0-9]+.*/;
                            let songData = songSplit.filter(item => item.match(test));
                            let url = songData.shift();
                            return (
                                <div className='list'>
                                    <h3 value={`${url}`}>{`Side ${side.side}`}</h3>
                                    {songData && songData.map(song => {
                                        return (
                                            <p>{song}</p>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                    <div className='album_single'>
                        <div className='album_wrapper_single' value={albumData} style={{backgroundImage:`url(${albumData.album_cover})`}}
                        onMouseOver={() => 
                            setDisplayButtons(true)
                        }
                        onMouseLeave={() => 
                            setDisplayButtons(false)
                        }>
                            {displayButtons && 
                                <>
                                    <h1><span>{albumData.album_title}</span></h1>
                                    <div id='album_buttons'>
                                        {!editOpen &&
                                            <>
                                                <button onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDisplayScroll(true)
                                                    navigator(`/albums/${albumData.id}`)
                                                    setDisplayScroll(false)
                                                }}>Edit Album</button>
                                                <button onClick={e => {
                                                    e.stopPropagation()
                                                    navigator(`/albums/${albumData.id}/songs`)
                                                }}>Edit Songs</button>
                                                <button onClick={(e) => {
                                                    e.stopPropagation()
                                                    setDisplayScroll(true)
                                                    setTimeout(sizeAlbums, 10)
                                                    dispatch(songActions.resetTheSongs())
                                                    clearInterval(bufferInterval)
                                                }}>Back</button>
                                            </>
                                        }
                                        {editOpen && 
                                            <>
                                                <button onClick={() => {
                                                    setDisplayScroll(true)
                                                    setTimeout(sizeAlbums, 10)
                                                    // dispatch(songActions.resetTheSongs())
                                                    setDisplayScroll(false)
                                                    // clearInterval(bufferInterval)
                                                    navigator('/albums')
                                                }}>Cancel Edit</button>
                                            </>
                                        }
                                        <button onClick={() => {
                                            setNirvana(true)
                                        }}>Nirvana</button>
                                        <button onClick={() => {
                                            deleteAlbum(albumData.id)
                                            setDisplayScroll(true)
                                            setTimeout(sizeAlbums, 10)
                                            clearInterval(bufferInterval)
                                        }}>Delete</button>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    <div className='record_list'>
                        {songs && songs.map(side => {
                            let songSplit = side.songs.split("'")
                            const test = /.*[a-zA-Z0-9]+.*/;
                            let songData = songSplit.filter(item => item.match(test));
                            let url = songData.shift();
                            return (
                                <div className='record' value={url} draggable='true' onDrag={e => {
                                    e.preventDefault()
                                    setPlayUrl(e.target.attributes.value.nodeValue)
                                    }}>
                                    <h3>{`Side ${side.side}`}</h3>
                                </div>
                            )
                        })}
                    </div>
                </div>
                </div>
            }
            {!displayScroll && Nirvana && 
                <div className='album_display'  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'none'
                }}
                onClick={() => {
                    setNirvana(false)
                }}
                onMouseMove={() => {
                    let message = document.getElementById('nirvana');
                    message.style.visibility = 'visible';
                    setTimeout(() => {
                        message.style.visibility = 'hidden';
                    }, 5000)
                }}
                > 
                <h1 id='nirvana' style={{
                    visibility: 'hidden',
                    color: 'white',
                }}>Click Here to Exit Nirvana</h1>
                </div>
            }
           
            
                <div className='record_player'

                    draggable='true'

                    onDragStart={e => {
                        stopAudio(e)
                    }}

                    onDrop={e => {
                        dropHandler(e)
                    }} 

                    onDragOver={allowDrop}
                    onDragLeave={revertDrop}
                    onDragEnter={resumeMonitoring}
                    >
                    <audio id='audio_player' crossOrigin='anonymous' onEnded={e => stopAudio(e)}></audio>
                    <div
                        draggable='true'
                        onClick={e => {
                            setPause(!pause)
                            if(e.target.parentElement.parentElement.firstChild) {
                                if(pause) {
                                    playAudio(e)
                                } else {
                                    pauseAudio(e)
                                }
                            }
                        }}
                        onDragEnd={e => {
                            stopAudio(e)
                        }}>

                        {!recordPlaying && !displayScroll && <h3 style={{
                            color: 'white'
                        }}>Drag record here to begin playing</h3>}
                        
                        {recordPlaying && 
                            <img onDrop={e => {
                                e.stopPropagation()
                                dropHandler(e)
                            }} 
                            id='record_image'
                            onDragOver={allowDrop}
                            onDragLeave={revertDrop}
                            src='https://bucketeer-c8e3fd63-1c26-4660-8f22-707352f21248.s3.amazonaws.com/a19cbc8c-d211-413f-9d39-97a7ae6fefca720record.png'></img>
                        }
                    </div>
                </div>
            {!Nirvana && <Navbar />}
            <Outlet />
        </div>
    )
}

export default Albums;