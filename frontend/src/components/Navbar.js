import { useState } from "react";
import { useSelector } from "react-redux";
import Logout from "./UserPages/Logout";

function Navbar() {
    const user = useSelector(state => state.session.User)
    
    return (
        <div className="navbar">
            {user && <Logout />}
        </div>
    )
    
}

export default Navbar;