import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import mainStore from "../store/main";

const Toolbar = () => {
    const nav = useNavigate();
    const { user, setUser } = mainStore(state => state);

    const handleLogout = () => {

        localStorage.removeItem("token");
        setUser(null);
        nav("/login");
    };

    return (
        <div className="d-flex gap-3 p-3" style={{backgroundColor : "#efeeee"}}>

            {!user && <Link to="/login">Login</Link>}
            {!user && <Link to="/">Register</Link>}


            {user && <Link to="/posts">Home</Link>}
            {user && <Link to="/profile">Profile</Link>}
            {user && <Link to="/createpost">Create Post</Link>}
            {user && <Link to="/favorites">Favorites</Link>}
            {user && <Link to="/messages">Messages</Link>}




            {user && (
                <button className="btn btn-secondary" onClick={handleLogout} style={{ marginLeft: "auto" }}>
                    Logout
                </button>
            )}
        </div>
    );
};

export default Toolbar;

