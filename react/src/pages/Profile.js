import React, {useEffect, useRef, useState} from "react";
import http from "../plugins/https";
import {getTokenData, getAuthHeader} from "../utils/auth";
import {useNavigate} from "react-router-dom";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const imageRef = useRef("");
    const usernameRef = useRef("");
    const password1Ref = useRef("");
    const password2Ref = useRef("");

    const navigate = useNavigate();

    useEffect(() => {
        const tokenData = getTokenData();
        if (!tokenData?._id) {
            navigate("/login");
            return;
        }
        fetchProfile(tokenData._id);
    }, [navigate]);

    const fetchProfile = async (userId) => {
        try {
            const response = await http.get(`/profile/${userId}`, {
                headers: getAuthHeader()
            });
            if (response.success) {
                setUser(response.user);
            } else {
                setError(response.message || "Failed to load profile");
            }
        } catch (err) {
            setError("Error loading profile");
        }
    };

    const updateImage = async () => {
        try {
            setMessage("");
            const newImage = imageRef.current.value.trim();
            if (!newImage) {
                setError("Please enter an image URL");
                return;
            }
            const tokenData = getTokenData();

            const response = await http.post(
                "/updateProfile",
                {
                    userId: tokenData._id,
                    image: newImage,
                    username: user.username
                },
                {headers: getAuthHeader()}
            );

            if (response.success) {
                setUser(response.user);
                imageRef.current.value = "";
                setMessage("Image updated successfully!");
                setError("");
            } else {
                setError(response.message || "Failed to update image");
            }
        } catch (err) {
            setError("Error updating image");
        }
    };

    const updateUsername = async () => {
        try {
            setMessage("");
            const newUsername = usernameRef.current.value.trim();
            if (!newUsername) {
                setError("Please enter a new username");
                return;
            }

            if (newUsername.length < 4 || newUsername.length > 20) {
                setError("Username must be between 4 and 20 characters long.");
                return;
            }
            const tokenData = getTokenData();

            const response = await http.post(
                "/updateProfile",
                {
                    userId: tokenData._id,
                    username: newUsername,
                    image: user.image
                },
                {headers: getAuthHeader()}
            );

            if (response.success) {
                setUser(response.user);
                usernameRef.current.value = "";
                setMessage("Username updated successfully!");
                setError("");
            } else {
                setError(response.message || "Failed to update username");
            }
        } catch (err) {
            setError("Error updating username");
        }
    };

    const updatePassword = async () => {
        try {
            setMessage("");
            const newPassword = password1Ref.current.value.trim();
            const confirmPassword = password2Ref.current.value.trim();

            if (!newPassword || !confirmPassword) {
                setError("Please fill in both password fields");
                return;
            }
            if (newPassword !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }
            if (newPassword.length < 4 || newPassword.length > 20) {
                setError("Password must be between 4 and 20 characters long.");
                return;
            }

            const tokenData = getTokenData();
            const response = await http.post(
                "/updateProfile",
                {
                    userId: tokenData._id,
                    password: newPassword,
                    username: user.username,
                    image: user.image
                },
                {headers: getAuthHeader()}
            );

            if (response.success) {
                setUser(response.user);
                password1Ref.current.value = "";
                password2Ref.current.value = "";
                setIsChangingPassword(false);
                setMessage("Password updated successfully!");
                setError("");
            } else {
                setError(response.message || "Failed to update password");
            }
        } catch (err) {
            setError("Error updating password");
        }
    };

    return (
        <div className="d-flex column gap-3">

            {error && <p style={{color: "red"}}>{error}</p>}
            {message && <p style={{color: "blue"}}>{message}</p>}

            {user && (
                <div className="card-style d-flex column gap-3">
                    <h2>Profile</h2>
                    <img
                        src={user.image || "https://via.placeholder.com/150"}
                        alt="profile"
                        style={{width: "200px", height: "200px"}}
                    />
                    <p><strong>Username:</strong> {user.username}</p>

                    <div className="d-flex column gap-2 mt-2">
                        <div className="d-flex gap-2 align-center">
                            <input type="text" ref={imageRef} placeholder="New image URL"/>
                            <button className="btn btn-primary" data-bs-toggle="button" onClick={updateImage}>Update
                                Image
                            </button>
                        </div>

                        <div className="d-flex gap-2 align-center">
                            <input type="text" ref={usernameRef} placeholder="New username"/>
                            <button className="btn btn-primary" data-bs-toggle="button" onClick={updateUsername}>Update
                                Username
                            </button>
                        </div>

                        <div className="d-flex gap-2 align-center mt-5">
                            {!isChangingPassword ? (
                                <button className="btn btn-secondary" onClick={() => setIsChangingPassword(true)}>
                                    Change password
                                </button>
                            ) : (
                                <button className="btn btn-secondary" onClick={() => setIsChangingPassword(false)}>
                                    Cancel password change
                                </button>
                            )}
                        </div>

                        {isChangingPassword && (
                            <div className="d-flex column gap-2 ">
                                <input
                                    type="password"
                                    ref={password1Ref}
                                    placeholder="New password"
                                    style={{maxWidth: "300px"}}
                                />
                                <input
                                    type="password"
                                    ref={password2Ref}
                                    placeholder="Confirm new password"
                                    style={{maxWidth: "300px"}}
                                />
                                <button className="btn btn-primary"
                                        style={{maxWidth: "300px"}}
                                        onClick={updatePassword}>
                                    Submit New Password
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;


