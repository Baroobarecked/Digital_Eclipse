import { Outlet } from "react-router"
import ForumsNavigation from "./ForumsNav"


export default function ForumPage() {
    return (
        <>
            <div id='community_display'>
                <ForumsNavigation />
                <Outlet />
                
            </div>
        </>
    )
}