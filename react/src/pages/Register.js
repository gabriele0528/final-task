import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../plugins/https";

const Register = () => {
    const navigate = useNavigate();
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;

        if (!username || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await http.post("/register", { username, password });

            if (res.success) {
                navigate("/login");
            } else {
                setError(res.message || "Registration failed");
            }
        } catch (err) {
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <div className="registration-style">
            <h2>User Registration</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input ref={usernameRef} type="text" placeholder="Username" className="placeholder-style" />
            <input ref={passwordRef} type="password" placeholder="Password" className="placeholder-style" />
            <input ref={confirmPasswordRef} type="password" placeholder="Confirm Password" className="placeholder-style" />
            <button className="btn btn-primary" data-bs-toggle="button" onClick={handleSubmit} >Register</button>
        </div>
    );
};

export default Register;

