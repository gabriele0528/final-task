import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Toolbar from "./components/Toolbar";
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import SingleUser from "./components/SingleUser";
import SinglePost from './components/SinglePost';
import Favorites from "./pages/Favorites";
import Messages from './pages/Messages';





function App() {
    return (
        <div>
            <BrowserRouter>
                <Toolbar />
                <Routes>
                    <Route path="/" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/posts" element={<Home />} />
                    <Route path="/createpost" element={<CreatePost />} />
                    <Route path="/user/:id" element={<SingleUser />} />
                    <Route path="/post/:id" element={<SinglePost />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/messages" element={<Messages />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
