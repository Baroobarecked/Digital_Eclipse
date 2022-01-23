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

    

    // let bufferInterval;
    let audioCtx;

    useEffect(() => {
        // console.log(barHeights)
        const client = document.getElementById('soundDisplay');
        // console.log(displayWidth / barHeights.length)
        // console.log(bars.length)
        
        if(client) {
            const displayWidth = client.clientWidth;
            
            barHeights.forEach((val, index) => {
                // console.log(val)
                bars[index] = ((
                    <div className='soundBar' style={{
                        width: `${displayWidth / barHeights.length}px`,
                        height: `${val /2}%`,
                        background: `linear-gradient(rgb(${val+100}, 50, 50), rgb(50, 50, ${val+100}))`,
                    }}>
                    </div>
                ))
                setBars(bars);
            })
        }



    }, [barHeights])

    useEffect(() => {
        // console.log(currentUser)
        if(currentUser) {
            dispatch(albumActions.getUserAlbums(currentUser.id))
            // console.log(albums)
        }
    }, [currentUser])

    const connectAudio = () => {
        
        let dataArray;
        
        let analyser;
        // console.log(audioCtx)
        
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
    
            // console.log(dataArray)

        }, 100))

    }

    function resumeMonitoring() {

        if(analyserNode) {
            let dataArray = new Uint8Array(analyserNode.frequencyBinCount);
            
        
    
            setBufferInterval(setInterval(() => {
                void analyserNode.getByteFrequencyData(dataArray);
    
                setBarHeights([...dataArray])
                setBars([])
        
                // console.log(dataArray)
    
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
        // let data = e.dataTransfer.getData('text');
        // console.log(data)
        // e.target.style.backgroundColor = 'green'
        console.log(e.target.firstChild)
        e.target.firstChild.src = '';
        e.target.firstChild.src = playUrl;
        e.target.firstChild.play();
        setRecordPlaying(true);
        // e.target.lastChild.firstChild.style.animationPlayState = 'running';
        setPause(false)
    }

    const dropHandlerOccupied = (e) => {
        e.target.parentElement.parentElement.firstChild.src = '';
        e.target.parentElement.parentElement.firstChild.src = playUrl;
        e.target.parentElement.parentElement.firstChild.play();
        setRecordPlaying(true);
        // console.log(e.target.parentElement.parentElement.lastChild)
        e.target.parentElement.parentElement.lastChild.firstChild.style.animationPlayState = 'running';
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
                                    // sizeAlbums()
                                }} style={{backgroundImage:`url(${album.album_cover})`}}>
                                    <h1>{album.album_title}</h1>
                                    
                                    <button>Edit Album</button>
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
                    // flexDirection: 'column',
                    justifyContent: 'center'
                }}> 
                <div className='shadow'>
                    <div className='song_list'>
                        {songs && songs.map(side => {
                            let songSplit = side.songs.split("'")
                            // console.log(songSplit)
                            const test = /.*[a-zA-Z0-9]+.*/;
                            let songData = songSplit.filter(item => item.match(test));
                            let url = songData.shift();
                            // console.log(songData)
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
                                <button>Edit Album</button>
                                <button onClick={() => {
                                    setDisplayScroll(true)
                                    setTimeout(sizeAlbums, 10)
                                    clearInterval(bufferInterval)
                                    // navigator('/albums', {replace: true})
                                    // sizeAlbums()
                                }}>Back</button>
                                <button onClick={() => {
                                    setNirvana(true)
                                }}>Nirvana</button>
                            </div>
                        </div>
                    </div>
                    <div className='record_list'>
                        {songs && songs.map(side => {
                            let songSplit = side.songs.split("'")
                            // console.log(songSplit)
                            const test = /.*[a-zA-Z0-9]+.*/;
                            let songData = songSplit.filter(item => item.match(test));
                            let url = songData.shift();
                            // console.log(url)
                            // console.log(songData)
                            return (
                                <div className='record' value={url} draggable='true' onDrag={e => {
                                    e.preventDefault()
                                    setPlayUrl(e.target.attributes.value.nodeValue)
                                    // console.log(playUrl)
                                    // e.dataTransfer.setData('text/plain', e.target.attributes.value.nodeValue)
                                    }}>
                                    <h3>{`Side ${side.side}`}</h3>
                                    {/* <image src='/record.png'></image> */}
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
                    // flexDirection: 'column',
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
                        // clearInterval(bufferInterval)
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
                                    // connectAudio()
                                } else {
                                    e.target.parentElement.parentElement.firstChild.pause();
                                    e.target.style.animationPlayState = 'paused';
                                    setTimeout(() => {
                                        // console.log(bufferInterval)
                                        // console.log('......................................................................................')
                                        // clearInterval(bufferInterval)
                                    }, 100)
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
                                dropHandlerOccupied(e)
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