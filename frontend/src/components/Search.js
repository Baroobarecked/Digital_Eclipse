import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import * as albumActions from '../store/album';
import * as discussionActions from '../store/discussion';



export default function Search() {
    const currentUser = useSelector(state => state.session.User);
    const [searchValue, setSearchValue] = useState('');
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        if(searchValue !== '') {
            dispatch(albumActions.filterTheAlbums(searchValue));
            dispatch(discussionActions.setFilteredDiscussionState(searchValue));
        } else {
            if(currentUser){
                dispatch(albumActions.getUserAlbums(currentUser.id));
            }
            dispatch(discussionActions.setDiscussionState());
        }
    }, [searchValue])

    useEffect(() => {
        setSearchValue('')
    }, [location])

    return (
        <div id="searchBar">
            <input type={'text'} value={searchValue} placeholder="Search..." onChange={e => setSearchValue(e.target.value)} />

        </div>
    )
}