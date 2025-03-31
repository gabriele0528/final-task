import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import http from '../plugins/https';
import { getTokenData, getAuthHeader } from "../utils/auth";

const SingleUser = () => {
    const { id } = useParams(); // user ID
    const [user, setUser] = useState(null);
    const [allPosts, setAllPosts] = useState([]);
    const [message, setMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const tokenData = getTokenData();

    useEffect(() => {
        fetchUser();
        fetchAllPosts();

    }, [id]);


    const fetchUser = async () => {
        try {
            const response = await http.get(`/profile/${id}`);
            if (response.success) {
                setUser(response.user);
            }
        } catch (error) {
            console.error('Error fetching single user:', error);
        }
    };


    const fetchAllPosts = async () => {
        try {
            const response = await http.get('/posts');
            if (response.success) {
                setAllPosts(response.posts);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };


    const handleSendMessage = async () => {
        if (!tokenData) {
            return alert('You must be logged in to send a message');
        }
        if (!message.trim()) {
            return alert("Message cannot be empty");
        }

        try {
            const response = await http.post("/messages/send", {
                toUserId: id,
                content: message
            }, { headers: getAuthHeader() });

            if (response.success) {
                setMessage("");
                setSuccessMessage("Message sent successfully!");
                
                setTimeout(() => {
                    setSuccessMessage("");
                }, 5000);
            } else {
                alert(response.message || "Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }


    const userPosts = allPosts.filter(post => post.ownerId === user._id);

    return (
        <div className="card-style d-flex column gap-3">
            <div className="d-flex gap-3 mb-5">
                <img
                    src={user.image || "https://via.placeholder.com/150"}
                    alt={user.username}
                    style={{ width: "200px", height: "200px" }}
                />
                <div>
                    <h2 className="mb-5">{user.username}</h2>


                    <div className="d-flex column gap-2 mt-2">
                        <h3>Write a message:</h3>
                        <div className="d-flex gap-2 mt-2">

                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="message value"
                            />
                            <button className="btn btn-primary" data-bs-toggle="button"
                                    onClick={handleSendMessage}>Send
                            </button>


                        </div>
                        
                        {successMessage && (
                            <div className="mt-2" style={{color: 'blue'}}>{successMessage}</div>
                        )}
                    </div>
                </div>
            </div>

            <h3>{user.username}'s Posts</h3>
            <div className="users-container">
                {userPosts.length === 0 ? (
                    <p>No posts yet.</p>
                ) : (
                    userPosts.map((post) => (
                        <div className="users-card" key={post._id}>
                            <img
                                src={post.image || "https://via.placeholder.com/150"}
                                alt={post.title}
                                style={{ width: "180px", height: "150px" }}
                            />
                            <h5>{post.title}</h5>
                            <div>{post.ownerName}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SingleUser;




