import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Logout from "./UserPages/Logout";

function Navbar() {
    const user = useSelector(state => state.session.User)
    const navigate = useNavigate()

    
    
    return (
        <div className="navbar">
            {user && <Logout />}
        </div>
    )
    
}

export default Navbar;