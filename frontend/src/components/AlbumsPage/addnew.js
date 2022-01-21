import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import * as albumActions from '../../store/album';



export default function AddAlbum() {
    const dispatch = useDispatch();
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imageLoading, setImageLoading] = useState(false)
    const [albumTitle, setAlbumTitle] = useState(null)
    const currentUser = useSelector(state => state.session.User)
    const { albumId } = useParams();

    // const [sides, setSides] = useState(0);
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

    // const sideComponent = (e) => {
    //     e.preventDefault()
    //     setSides(sides + 1)
    //     const i = sides
    //     let component = (
    //         <li>
    //             <button onClick={songComponent}>Add Song</button>
    //             <label /> Side {i}
    //         </li>
    //     )
    //     setComponents([...components, component])
    //     console.log(components)
    // }

    // const updateImage = (e) => {
    //     const file = e.target.files[0];
    //     setImage(file);
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
            console.log('ok')
            setImageUrl(url)
            setImageLoading(false)
        }
        else alert('Could not upload file.')
    }
    
    const dropHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let data = e.dataTransfer.files;
        
        setImage(data['0']);
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
        e.target.style.backgroundColor = '#202225';
    }

    function selectFolder(e) {
        let files = e.target.value;
        for(let file in files) {
            getSignedRequest(file)
        }
    }

    async function submitAlbum (e) {
        e.preventDefault()
        console.log(currentUser)
        let album = {
            'album_title': albumTitle,
            'user_id': currentUser.id,
            'album_cover': imageUrl
        }

        await dispatch(albumActions.addNewAlbum(album));
    }

    return (
        <>
            <form id='add_album_form'>
                <label /> Album Title
                <input type={'text'} onChange={e => setAlbumTitle(e.target.value)} value={albumTitle}/>
                <label /> Album Cover
                <div className='drop_zone'
                    className='drop_zone' 
                    accept="image/*" 
                    onDrop={dropHandler} 
                    onDragOver={allowDrop}
                    onDragLeave={revertDrop}
                    >
                    Drag and Drop Album Cover Here
                </div>
                {(imageLoading) && <p>Loading...</p>}
                <input type="file" onChange={selectFolder} webkitdirectory='true' multiple/>
                <button onClick={submitAlbum}>Add Album</button>
            </form>
        </>
    )
}