import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import * as albumActions from '../../store/album'
import * as songActions from '../../store/song'
import { Outlet, useNavigate } from 'react-router-dom'

function Albums() {
    const albums = useSelector(state => state.albums)
    const currentUser = useSelector(state => state.session.User)
    const dispatch = useDispatch()
    const [albumData, setAlbumData] = useState(null)
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

    useEffect(() => {
        if(!currentUser) {
            navigator('/login')
        }

    }, [])

    // let bufferInterval;
    let audioCtx;

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
                        backgroundSize: '100vw 100vh'
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
        
        let dataArray;
        
        let analyser;
        
        if(!audioCtx) {
            let AudioContext = window.AudioContext || window.webkitAudioContext;

            audioCtx = new AudioContext({
                latencyHint: 'playback',
                sampleRate: 96000,
            })
    
            let aud = document.getElementById('audio_player')
    
            let audSource = audioCtx.createMediaElementSource(aud)
        
            analyser = new AnalyserNode(audioCtx, {
                fftSize: 1024,
            })

            setAnalyserNode(analyser)
    
            audSource.connect(analyser).connect(audioCtx.destination);
    
            dataArray = new Uint8Array(analyser.frequencyBinCount);
        }
    

        setBufferInterval(setInterval(() => {
            void analyser.getByteFrequencyData(dataArray);

            setBarHeights([...dataArray])
            setBars([])

        }, 100))

    }

    function resumeMonitoring() {

        if(analyserNode) {
            let dataArray = new Uint8Array(analyserNode.frequencyBinCount);
            
        
    
            setBufferInterval(setInterval(() => {
                void analyserNode.getByteFrequencyData(dataArray);
    
                setBarHeights([...dataArray])
                setBars([])
    
            }, 100))

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
                    if((10 + 40 * middle / halfWidth) < 28) {
                        albumWrapper.lastChild.style.visibility = 'hidden';
                    } else {
                        albumWrapper.lastChild.style.visibility = 'visible';
                    }
                } else if (middle > halfWidth && middle <= albumDisplayLocation.width){
                    albumWrapper.style.width = `${10 + 25 * (albumDisplayLocation.width - middle) / halfWidth}vh`
                    albumWrapper.style.height = `${10 + 25 * (albumDisplayLocation.width - middle) / halfWidth}vh`
                    albumWrapper.style.top = `${15000 * (albumDisplayLocation.width - middle)**(1/6) / halfWidth}%`
                    albumWrapper.style.opacity = `${100 * (albumDisplayLocation.width - middle)**(1/3) / halfWidth**(1/3)}%`
                    albumWrapper.style.fontSize = `${3 * (albumDisplayLocation.width - middle) / halfWidth}vh`
                    if((10 + 40 * (albumDisplayLocation.width - middle) / halfWidth) < 28) {
                        albumWrapper.lastChild.style.visibility = 'hidden';
                    } else {
                        albumWrapper.lastChild.style.visibility = 'visible';
                    }
                } else {
                    albumWrapper.style.width = `10vh`
                    albumWrapper.style.height = `10vh`
                    albumWrapper.style.opacity = '0%'
                }
            }
        }
    }

    useEffect(() => {
        sizeAlbums()
    }, [albums])

    const albumClick = (album) => {
        setDisplayScroll(false)
        dispatch(songActions.getAlbumsSongs(album.id))
    }

    const dropHandler = (e) => {
        e.preventDefault();
        let player = document.getElementById('audio_player')
        player.src = '';
        player.src = playUrl;
        player.play();
        setRecordPlaying(true);
        player.style.animationPlayState = 'running';
        setPause(false)
    }

    function allowDrop(e) {
        e.stopPropagation();
        e.preventDefault();

    }

    function revertDrop(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    function deleteAlbum(albumId) {
        dispatch(albumActions.deleteTheAlbum(albumId))
    }

    return (
        <div className='album_main'>
            {!displayScroll && 
                <>
                    <div id='soundDisplay'>
                        {bars}   
                    </div>
                    <div id='soundDisplay2'>
                        {bars}   
                    </div>
                </>
            }
            {displayScroll && 
                (<div className='album_display' onWheel={scrollAlbums}>
                    <div className='scrollBuffer'></div>
                    {albums && albums.albums.map(album => {
                        sizeAlbums()
                        return (
                            <div className='album'>
                                <div className='album_wrapper' value={album} onClick={e => {
                                    setAlbumData(album);
                                    albumClick(album);
                                    resumeMonitoring();
                                }} style={{backgroundImage:`url(${album.album_cover})`}}>
                                    <h1>{album.album_title}</h1>
                                    
                                    {/* <button onClick={(e) => {
                                        e.stopPropagation();
                                        navigator(`/albums/${album.id}`)
                                    }}>Edit Album</button> */}
                                </div>
                            </div>
                        )
                    })}
                    <div className='scrollBuffer'></div>
                </div>)
            }
            {!displayScroll && !Nirvana &&
                <div className='album_display' style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}> 
                <div className='shadow'>
                    <div className='song_list'>
                        {songs && songs.map(side => {
                            let songSplit = side.songs.split("'")
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
                        <div className='album_wrapper_single' value={albumData} style={{backgroundImage:`url(${albumData.album_cover})`}}>
                            <h1>{albumData.album_title}</h1>
                            <div>
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    setDisplayScroll(true)
                                    navigator(`/albums/${albumData.id}`)
                                }}>Edit Album</button>
                                <button onClick={e => {
                                    e.stopPropagation()
                                    navigator(`/albums/${albumData.id}/songs`)
                                }}>Edit Songs</button>
                                <button onClick={() => {
                                    setDisplayScroll(true)
                                    setTimeout(sizeAlbums, 10)
                                    clearInterval(bufferInterval)
                                }}>Back</button>
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
                        </div>
                    </div>
                    <div className='record_list'>
                        <h2 style={{
                            color: 'white'
                        }}>Drag and drop song at bottom center (work in progress)</h2>
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
                        e.target.firstChild.pause()
                        setPlayUrl('')
                        setRecordPlaying(false)
                    }}

                    onDrop={e => {
                        dropHandler(e)
                        connectAudio(e)
                    }} 

                    onDragOver={allowDrop}
                    onDragLeave={revertDrop}
                    >
                    <audio id='audio_player' crossOrigin='anonymous'></audio>
                    <div
                        draggable='true'
                        onClick={e => {
                            setPause(!pause)
                            if(e.target.parentElement.parentElement.firstChild) {
                                if(pause) {
                                    e.target.parentElement.parentElement.firstChild.play();
                                    e.target.style.animationPlayState = 'running';
                                } else {
                                    e.target.parentElement.parentElement.firstChild.pause();
                                    e.target.style.animationPlayState = 'paused';
                                }
                            }
                        }}
                        onDragEnd={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            e.target.parentElement.parentElement.firstChild.pause()
                            clearInterval(bufferInterval)
                            setPlayUrl('')
                            setRecordPlaying(false)
                        }}>
                        
                        {recordPlaying && 
                            <img onDrop={e => {
                                e.stopPropagation()
                                dropHandler(e)
                            }} 
                            
                            onDragOver={allowDrop}
                            onDragLeave={revertDrop}
                            src='https://bucketeer-c8e3fd63-1c26-4660-8f22-707352f21248.s3.amazonaws.com/nobackgroundrecord2.png'></img>
                        }
                    </div>
                </div>
            
            <Outlet />
        </div>
    )
}

export default Albums;