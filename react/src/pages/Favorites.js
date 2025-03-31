import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../plugins/https';
import { getAuthHeader } from '../utils/auth';

const Favorites = () => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFavorites();
    }, []);


    const fetchFavorites = async () => {
        try {
            const response = await http.get("/myFavorites", {
                headers: getAuthHeader()
            });
            if (response.success) {
                setPosts(response.posts);
            }
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };


    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
    };


    const handleUserClick = (ownerId) => {
        navigate(`/user/${ownerId}`);
    };


    const handleRemoveFavorite = async (postId) => {
        try {
            const response = await http.post(
                "/removeFavorite",
                { postId },
                { headers: getAuthHeader() }
            );
            if (response.success) {

                setPosts((prev) => prev.filter((p) => p._id !== postId));
            } else {
                alert(response.message || "Failed to remove favorite");
            }
        } catch (error) {
            console.error("Error removing favorite:", error);
        }
    };

    return (
        <div className="p-3">
            <div className="users-container">
                {posts.map((post) => (
                    <div className="users-card" key={post._id}>
                        <img
                            src={post.image || "https://via.placeholder.com/150"}
                            alt={post.title}
                            style={{width: "180px", height: "150px"}}
                        />


                        <h5
                            className="title-style mt-1"
                            onClick={() => handlePostClick(post._id)}
                        >
                            {post.title}
                        </h5>


                        <div
                            className="title-style mb-1"
                            onClick={() => handleUserClick(post.ownerId)}
                        >
                            {post.ownerName}
                        </div>


                        <button className="btn btn-primary" data-bs-toggle="button"
                                onClick={() => handleRemoveFavorite(post._id)}>
                            Remove Favorite
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Favorites;

