import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import * as albumActions from '../../store/album';




export default function AddAlbum() {
    const dispatch = useDispatch();
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imageLoading, setImageLoading] = useState(false)
    const [albumTitle, setAlbumTitle] = useState(null)
    const currentUser = useSelector(state => state.session.User)
    const albums = useSelector(state => state.albums.albums)
    const { albumId } = useParams();
    const navigate = useNavigate();
    const [currentAlbum, setCurrentAlbum] = useState(null);
    

    // const updateImage = (e) => {
    //     const file = e.target.files[0];
    //     setImage(file);
    // }
    useEffect(() => {
        console.log(albums)
        albums.forEach(album => {
            console.log(album)
            if(album.id == albumId){
                setCurrentAlbum(album);
            }
        })
        console.log(currentAlbum)
        if(currentAlbum) {
            setImageUrl(currentAlbum.album_cover)
            setAlbumTitle(currentAlbum.album_title)
        }
    }, [currentAlbum])

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
            setImageUrl(url)
            console.log('ok')
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

    async function submitAlbum (e) {
        e.preventDefault()
        console.log(currentUser)
        let album = {
            'album_title': albumTitle,
            'user_id': currentUser.id,
            'album_cover': imageUrl
        }

        let res = await dispatch(albumActions.addNewAlbum(album));
        console.log(res)
        if(res) {
            console.log('time to return')
            navigate(`/albums/${res.album.id}/songs`, {replace: true})
        }

    }

    async function editAlbum (e) {
        e.preventDefault()
        console.log(currentUser)
        let album = {
            'album_title': albumTitle,
            'user_id': currentUser.id,
            'album_cover': imageUrl,
            'id': parseInt(albumId)
        }

        let res = await dispatch(albumActions.editOldAlbum(album));
        console.log(res)
        if(res) {
            console.log('time to return')
            navigate(`/albums`, {replace: true})
        }

    }

    return (
        <div className="form_modal absolute_form"onClick={() => {
            navigate('/albums', {replace: true})
        }}>
            <form id='add_album_form' onClick={e => e.stopPropagation()}>
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
                {imageUrl && <p>To change image, upload another.</p>}
                {(imageLoading) && <p>Loading...</p>}
                {!albumId && <button onClick={submitAlbum}>Add Album</button>}
                {albumId && <button onClick={editAlbum}>Edit Album</button>}
            </form>
        </div>
    )
}