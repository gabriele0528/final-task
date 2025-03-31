import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import http from '../plugins/https';
import { getTokenData } from '../utils/auth';

const SinglePost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const commentRef = useRef();

    const tokenData = getTokenData();
    const userId = tokenData ? tokenData._id : null;

    useEffect(() => {
        fetchSinglePost();
    }, []);

    const fetchSinglePost = async () => {
        try {
            const response = await http.get(`/posts/${id}`);
            if (response.success) {
                setPost(response.post);
            }
        } catch (error) {
            console.error('Error fetching single post:', error);
        }
    };

    const handleComment = async () => {
        if (!userId) return;

        const comment = commentRef.current.value;
        if (!comment.trim()) return;

        try {
            const response = await http.post(`/posts/${id}/comment`, { comment }, { headers: {
                    authorization: localStorage.getItem('token'),
                }});
            if (response.success) {
                setPost(response.post);
                commentRef.current.value = '';
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div className="card-style">
            <h2>{post.title}</h2>
            <div className="d-flex">

                <img
                    src={post.image || 'https://via.placeholder.com/150'}
                    alt={post.title}
                    style={{ width: '200px', height: '200px' }}
                />

                <div style={{ marginLeft: '20px' }}>
                    <h3></h3>
                    <h4>{post.description}</h4>
                    <p><strong>Created by:</strong> {post.ownerName}</p>
                    <p><strong>Create date:</strong> {new Date(post.createdDate).toLocaleString()}</p>
                </div>
            </div>

            <div className="d-flex column gap-5 mt-4">
                <div className="mt-4 d-flex column gap-1">
                    <h4>Comments:</h4>
                    {post.comments.length > 0 ? (
                        post.comments.map((c, i) => {
                            const parts = c.split(": ");
                            const commenterName = parts[0];
                            const commentText = parts.slice(1).join(": "); // jei komentare yra daugiau dvitaškių
                            return (
                                <div key={i} className="comments-card">
                                    <strong>{commenterName}</strong><br />
                                    {commentText}
                                </div>
                            );
                        })
                    ) : (
                        <div>No comments yet.</div>
                    )}
                </div>

                <div className="mt-4 d-flex column gap-2">
                    <input
                        type="text"
                        ref={commentRef}
                        placeholder="Write a comment..."
                    />
                    <div>
                        <button className="btn btn-primary" data-bs-toggle="button" onClick={handleComment}>Comment</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SinglePost;


