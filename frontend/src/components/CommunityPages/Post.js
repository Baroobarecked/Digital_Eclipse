import { Outlet } from "react-router"



export default function Posts() {
    return (
        <>
            <Outlet  />
            <div id='posts'>
                <h1>Hello from posts</h1>
            </div>
        </>
    )
}