import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../plugins/https';
import { getAuthHeader } from '../utils/auth';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [favoritePostIds, setFavoritePostIds] = useState(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
        fetchUserFavorites();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await http.get('/posts');
            if (response.success) {
                setPosts(response.posts);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const fetchUserFavorites = async () => {
        try {
            const response = await http.get("/myFavorites", {
                headers: getAuthHeader()
            });
            if (response.success && response.posts) {
                const favoriteIds = new Set(response.posts.map(post => post._id));
                setFavoritePostIds(favoriteIds);
            }
        } catch (error) {
            console.error("Error fetching user favorites:", error);
        }
    };

    const handleUserClick = (id) => {
        navigate(`/user/${id}`);
    };

    const handlePostClick = (id) => {
        navigate(`/post/${id}`);
    };

    const handleToggleFavorite = async (postId) => {
        try {
            const isFavorite = favoritePostIds.has(postId);
            const endpoint = isFavorite ? "/removeFavorite" : "/addFavorite";
            
            const response = await http.post(
                endpoint,
                { postId },
                { headers: getAuthHeader() }
            );
            
            if (response.success) {
                setFavoritePostIds(prev => {
                    const newSet = new Set(prev);
                    if (isFavorite) {
                        newSet.delete(postId);
                    } else {
                        newSet.add(postId);
                    }
                    return newSet;
                });
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    return (
        <div className="p-3">
            <div className="users-container">
                {posts.map((post) => (
                    <div
                        className="users-card"
                        key={post._id}
                    >
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

                        <button 
                            className="btn btn-primary" 
                            onClick={() => handleToggleFavorite(post._id)}
                        >
                            {favoritePostIds.has(post._id) ? 'Remove Favorite' : 'Add Favorite'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;


