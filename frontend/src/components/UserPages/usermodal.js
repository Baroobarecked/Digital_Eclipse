import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';


export default function UserModal() {
    const navigate = useNavigate();
    const currentUser = useSelector(state => state.session.User);


    return (
        <div className='form_background'>
            <div id='splashButtons'>
                {!currentUser && 
                    <>
                        <button onClick={() => {
                            navigate('/login')
                        }}>login</button>
                        <button onClick={() => {
                            navigate('/signup')
                        }}>signup</button>
                    </>
                }
                {currentUser && <button onClick={() => {
                    navigate('/albums')
                }}>Home</button>}
            </div>
            <img className='record_image' src='https://bucketeer-c8e3fd63-1c26-4660-8f22-707352f21248.s3.amazonaws.com/a19cbc8c-d211-413f-9d39-97a7ae6fefca720record.png'>
            
            </img>
            <div className='form_modal'>
                <Outlet />
            </div>
        </div>
    )
}