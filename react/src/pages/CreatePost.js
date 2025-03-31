import React, { useRef, useState } from 'react';
import http from '../plugins/https';

const CreatePost = () => {
    const imageRef = useRef();
    const titleRef = useRef();
    const descriptionRef = useRef();

    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const image = imageRef.current.value;
        const title = titleRef.current.value;
        const description = descriptionRef.current.value;

        try {

            const response = await http.post('/posts', { image, title, description }, { headers: {
                    authorization: localStorage.getItem('token'),
                }});

            if (response.success) {
                setMessage('Post created successfully!');

                imageRef.current.value = '';
                titleRef.current.value = '';
                descriptionRef.current.value = '';
            } else {
                setMessage(response.message || 'Failed to create post');
            }
        } catch (error) {
            console.error(error);
            setMessage('Error creating post');
        }
    };

    return (
        <div className="card-style">
            <h2>Create Post</h2>
            <form className="d-flex column gap-4" onSubmit={handleSubmit}>
                <div className="d-flex column gap-1">
                    <span><strong>Image</strong></span>
                    <input
                        type="text"
                        ref={imageRef}
                        placeholder="Image URL"
                    />
                </div>
                <div className="d-flex column gap-1">
                    <span><strong>Title</strong></span>
                    <input
                        type="text"
                        ref={titleRef}
                        placeholder="Post title"
                    />
                </div>
                <div className="d-flex column gap-1">
                    <span><strong>Description</strong></span>
                    <input
                        type="text"
                        ref={descriptionRef}
                        placeholder="Description"
                    />
                </div>
                <div className="my-3">
                    <button className="btn btn-primary" data-bs-toggle="button" type="submit">Create post</button>
                </div>
            </form>

            {message && (
                <div className="mt-2" style={{color: 'blue'}}>{message}</div>
            )}
        </div>
    );
};

export default CreatePost;

