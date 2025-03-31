import React, { useRef, useState } from "react";
import http from "../plugins/https"
import {useNavigate} from "react-router-dom";
import mainStore from "../store/main";

const Login = () => {

    const nav = useNavigate()
    const {setUser} = mainStore(state => state)


    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        if (!username || !password) {
            setError("All fields are required");
            return;
        }

        try {
            const res = await http.post("/login", { username, password });

            if (res.success) {
                localStorage.setItem("token", res.token);
                setUser(res.user);
                nav("/profile");
            } else {
                setError(res.message || "Login failed");
            }
        } catch (err) {
            setError("Login failed. Please try again.");
        }
    };

    return (
        <div className="login-style">
            <h2>User Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input ref={usernameRef} type="text" placeholder="Username" className="placeholder-style" />
            <input ref={passwordRef} type="password" placeholder="Password" className="placeholder-style" />
            <button className="btn btn-primary" data-bs-toggle="button" onClick={handleSubmit} >Login</button>
        </div>
    );
};

export default Login;

