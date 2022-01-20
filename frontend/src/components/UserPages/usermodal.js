import { Outlet } from 'react-router-dom'

export default function UserModal() {
    return (
        <div className='form_background'>
            <img className='record_image' src='/record.svg'>
                
            </img>
            <div className='form_modal'>
                <Outlet />
            </div>
        </div>
    )
}