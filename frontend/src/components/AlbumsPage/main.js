import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import * as albumActions from '../../store/album'

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
            console.log(albums)
        }
    }, [])
    
    useEffect(() => {
        
        console.log(albums)
    }, [albums])

    const scrollAlbums = (e) => {
        e.stopPropagation()
        console.log(e)
        
        e.target.scrollLeft += .0000005 * e.deltaY**5
        e.target.parentElement.scrollLeft += .0000005 * e.deltaY**5
        e.target.parentElement.parentElement.scrollLeft += .0000005 * e.deltaY**5
        e.target.parentElement.parentElement.parentElement.scrollLeft += .0000005 * e.deltaY**5
        
    }

    const albumClick = (e) => {
        setDisplayScroll(false)
    }

    return (
        <div className='album_main'>
            {displayScroll && 
                <div className='album_display' onWheel={scrollAlbums}>
                    {albums && albums.albums.map(album => {
                        console.log(albums.albums)
                        console.log(album[0].album)
                        return (
                            <div className='album'>
                                <div className='album_wrapper' value={album[0]} onClick={e => {
                                    setAlbumData(album[0].album)
                                    albumClick(e);
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
                </div>
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
                                <button onClick={() => setDisplayScroll(true)}>Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Albums