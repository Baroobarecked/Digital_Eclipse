import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as albumActions from '../store/album'



export default function Search() {
    const currentUser = useSelector(state => state.session.User)
    const [searchValue, setSearchValue] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {


        if(searchValue !== '') {
            dispatch(albumActions.filterTheAlbums(searchValue))
        } else {
            if(currentUser){
                console.log(currentUser)
                dispatch(albumActions.getUserAlbums(currentUser.id))
            }
        }
    }, [searchValue])

    return (
        <div id="searchBar">
            <input type={'text'} value={searchValue} onChange={e => setSearchValue(e.target.value)} />

        </div>
    )
}