import { Outlet } from 'react-router-dom';


export default function UserModal() {
    return (
        <div className='form_background'>
            <img className='record_image' src='https://bucketeer-c8e3fd63-1c26-4660-8f22-707352f21248.s3.amazonaws.com/nobackgroundrecord2.png'>
            
            </img>
            <div className='form_modal'>
                <Outlet />
            </div>
        </div>
    )
}