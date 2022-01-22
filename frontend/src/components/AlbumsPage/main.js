import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import * as albumActions from '../../store/album'
import { Outlet } from 'react-router-dom'

function Albums() {
    const albums = useSelector(state => state.albums)
    const currentUser = useSelector(state => state.session.User)
    const dispatch = useDispatch()
    const [albumData, setAlbumData] = useState(null)
    const [displayScroll, setDisplayScroll] = useState(true)

    useEffect(() => {
        console.log(currentUser)
        if(currentUser) {
            dispatch(albumActions.getUserAlbums(currentUser.id))
            // console.log(albums)
        }
    }, [currentUser])
    
    useEffect(() => {
        // console.log('hello')
        // sizeAlbums()
    }, [])
    
    let timeout;
    let changeSize;

    const scrollAlbums = (e) => {
        e.stopPropagation()

        clearTimeout(timeout);
        
        if(e.target.className === 'album_display') {
            e.target.scrollLeft += 0.00000007 * e.deltaY**5
        }
        else if(e.target.className === 'album' || e.target.className === 'scrollBuffer') {
            e.target.parentElement.scrollLeft += 0.00000007 * e.deltaY**5
        }
        else if(e.target.className === 'album_wrapper') {
            e.target.parentElement.parentElement.scrollLeft += 0.00000007 * e.deltaY**5
        } else {
            e.target.parentElement.parentElement.parentElement.scrollLeft += 0.00000007 * e.deltaY**5
        }

        changeSize = setInterval(sizeAlbums, 10)

        timeout = setTimeout(() => {
            clearInterval(changeSize)
        }, 2000)
        
        
    }

    const sizeAlbums = () => {
        const albumDisplay = document.getElementsByClassName('album_display')[0]
        const albumWrappers = Array.from(document.getElementsByClassName('album_wrapper'))
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
                // albumWrapper.style.top = '30%'
            }
        }
    }

    useEffect(() => {
        sizeAlbums()
    }, [albums])

    const albumClick = (e) => {
        setDisplayScroll(false)
    }

    return (
        <div className='album_main'>
            {displayScroll && 
                (<div className='album_display' onWheel={scrollAlbums}>
                    <div className='scrollBuffer'></div>
                    {albums && albums.albums.map(album => {
                        console.log(albums.albums)
                        console.log(album[0].album)
                        sizeAlbums()
                        return (
                            <div className='album'>
                                <div className='album_wrapper' value={album[0]} onClick={e => {
                                    setAlbumData(album[0].album)
                                    albumClick(e);
                                    // sizeAlbums()
                                }} style={{backgroundImage:`url(${album[0].album.album_cover})`}}>
                                    <h1>{album[0].album.album_title}</h1>
                                    {/* <div>
                                        <h3>Songs</h3>
                                        <ul>
                                        {album['sides'] && album['sides'].map(side => {
                                            return (
                                                <li>
                                                {side.side}
                                                {side['songs'] && side['songs'].map(song => {
                                                    return (<li>{song}</li>)
                                                })}
                                                </li>
                                                )
                                            })}
                                            </ul>
                                        </div> */}
                                    
                                    {/* <img src={album[0].album.album_cover} /> */}
                                    
                                    <button>Edit Album</button>
                                </div>
                            </div>
                        )
                    })}
                    <div className='scrollBuffer'></div>
                </div>)
            }
            {!displayScroll && 
                <div className='album_display' style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <div className='album'>
                        <div className='album_wrapper_single' value={albumData} style={{backgroundImage:`url(${albumData.album_cover})`}}>
                            <h1>{albumData.album_title}</h1>
                            {/* <div>
                                <h3>Songs</h3>
                                <ul>
                                    {album['sides'] && album['sides'].map(side => {
                                        return (
                                            <li>
                                                {side.side}
                                                {side['songs'] && side['songs'].map(song => {
                                                    return (<li>{song}</li>)
                                                })}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div> */}
                            
                            {/* <img src={album[0].album.album_cover} /> */}
                            <div>
                                <button>Edit Album</button>
                                <button onClick={() => {
                                    setDisplayScroll(true)
                                    setTimeout(sizeAlbums, 10)
                                    // sizeAlbums()
                                }}>Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <Outlet />
        </div>
    )
}

export default Albums