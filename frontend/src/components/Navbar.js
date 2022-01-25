import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Logout from "./UserPages/Logout";
import Search from "./Search";

function Navbar() {
    const user = useSelector(state => state.session.User)
    const navigate = useNavigate()

    
    
    return (
        <div className="navbar">
            {user && <Search />}
            {user && <Logout />}
        </div>
    )
    
}

export default Navbar;