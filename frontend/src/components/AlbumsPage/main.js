import { useState } from 'react';
import { useSelector } from 'react-redux';

function Albums() {
    const albums = useSelector(state => state.albums.albums)

    return (
        <div>
            {albums && albums.map(album => {
                return (
                    <div>
                        <h1>{album['album'].title}</h1>
                        <div>
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
                        </div>
                        <div>
                            <img src={album['album'].cover} />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Albums