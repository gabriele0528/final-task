const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const userSchema = require("../schemas/userSchema")
const Post = require('../schemas/postSchema');
const Message = require('../schemas/messageSchema');


module.exports = {

    register: async (req, res) => {
        const { username, password } = req.body;

        try {
            const userExists = await userSchema.findOne({ username });

            if (userExists) {
                return res.status(400).send({
                    success: false,
                    message: 'Username already exists'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            const user = new userSchema({
                username,
                password: hash,
                image: '',
                createdAt: new Date()
            });

            await user.save();

            const userToSend = user.toObject();
            delete userToSend.password;

            const token = jwt.sign(userToSend, process.env.SECRET_KEY);

            res.status(201).send({
                success: true,
                message: 'User registered successfully',
                user: userToSend,
                token
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Error during registration',
                error: error.message
            });
        }
    },
    login: async (req, res) => {
        const { username, password } = req.body;

        try {
            const user = await userSchema.findOne({ username });

            if (!user) {
                return res.status(401).send({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).send({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const userToSend = user.toObject();
            delete userToSend.password;

            const token = jwt.sign(userToSend, process.env.SECRET_KEY);

            res.send({
                success: true,
                user: userToSend,
                token
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Error during login',
                error: error.message
            });
        }
    },

    profile: async (req, res) => {
        try {
            const user = await userSchema.findById(req.params.id)
                .select('-password');

            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: "User not found"
                });
            }

            res.send({ success: true, user });
        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(400).send({
                    success: false,
                    message: "Invalid user ID format"
                });
            }
            res.status(500).send({
                success: false,
                message: "Error fetching profile"
            });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const { username, image, userId, password } = req.body;
            const updateObject = {};

            if (username || image || password) {
                updateObject.$set = {};


                if (username) {

                    if (username.length < 4 || username.length > 20) {
                        return res.status(400).send({
                            success: false,
                            message: "Username must be between 4 and 20 characters long."
                        });
                    }
                    const existingUser = await userSchema.findOne({ username });
                    if (existingUser && existingUser._id.toString() !== userId) {
                        return res.status(400).send({
                            success: false,
                            message: "Username already taken"
                        });
                    }
                    updateObject.$set.username = username;
                }


                if (image) {
                    updateObject.$set.image = image;
                }


                if (password) {
                    if (password.length < 4 || password.length > 20) {
                        return res.status(400).send({
                            success: false,
                            message: "Password must be between 4 and 20 characters"
                        });
                    }
                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash(password, salt);
                    updateObject.$set.password = hash;
                }
            }

            if (!updateObject.$set || Object.keys(updateObject.$set).length === 0) {
                return res.status(400).send({
                    success: false,
                    message: "No valid fields to update"
                });
            }

            const user = await userSchema.findByIdAndUpdate(
                userId,
                updateObject,
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: "User not found"
                });
            }

            res.send({ success: true, user });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Error updating profile",
                error: error.message
            });
        }
    },


    getAllUsers: async (req, res) => {
        try {
            const users = await userSchema.find()
                .select('-password')
                .sort({ createdAt: -1 });

            res.send({
                success: true,
                users
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Error fetching users',
                error: error.message
            });
        }
    },

    createPost: async (req, res) => {
        try {
            const { image, title, description } = req.body;


            if (!title) {
                return res.status(400).send({
                    success: false,
                    message: 'Title is required'
                });
            }

            if (!description) {
                return res.status(400).send({
                    success: false,
                    message: 'Description is required'
                });
            }

            const ownerName = req.body.user?.username || "Unknown";
            const ownerId = req.body.user?._id;

            const newPost = new Post({
                image,
                title,
                description,
                ownerName,
                ownerId
            });

            await newPost.save();

            return res.send({
                success: true,
                message: 'Post created successfully',
                post: newPost
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send({
                success: false,
                message: 'Error creating post',
                error: error.message
            });
        }
    },


    getAllPosts: async (req, res) => {
        try {

            const posts = await Post.find().sort({ createdAt: -1 });
            return res.send({ success: true, posts });
        } catch (error) {
            console.error(error);
            return res.status(500).send({
                success: false,
                message: 'Error fetching posts',
                error: error.message
            });
        }
    },

    getSinglePost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).send({
                    success: false,
                    message: 'Post not found'
                });
            }
            res.send({ success: true, post });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                success: false,
                message: 'Error fetching single post',
                error: error.message
            });
        }
    },



    addComment: async (req, res) => {
        try {
            const { comment } = req.body;
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).send({
                    success: false,
                    message: 'Post not found'
                });
            }

            const commenterName = req.body.user?.username || "Unknown";
            const fullComment = `${commenterName}: ${comment}`;

            post.comments.push(fullComment);
            await post.save();

            res.send({
                success: true,
                message: 'Comment added successfully',
                post
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                success: false,
                message: 'Error adding comment',
                error: error.message
            });
        }
    },



    addFavorite: async (req, res) => {
        try {
            const userId = req.body.user._id;
            const { postId } = req.body;
            const user = await userSchema.findById(userId);

            if (!user) {
                return res.status(404).send({ success: false, message: "User not found" });
            }

            if (!user.favorites.includes(postId)) {
                user.favorites.push(postId);
                await user.save();
            }

            res.send({ success: true, message: "Post added to favorites" });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Error adding favorite",
                error: error.message
            });
        }
    },

    removeFavorite: async (req, res) => {
        try {
            const userId = req.body.user._id;
            const { postId } = req.body;
            const user = await userSchema.findById(userId);

            if (!user) {
                return res.status(404).send({ success: false, message: "User not found" });
            }


            user.favorites = user.favorites.filter(id => id !== postId);
            await user.save();

            res.send({ success: true, message: "Post removed from favorites" });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Error removing favorite",
                error: error.message
            });
        }
    },


    getMyFavorites: async (req, res) => {
        try {
            const userId = req.body.user._id;

            const user = await userSchema.findById(userId).select("favorites");
            if (!user) {
                return res.status(404).send({ success: false, message: "User not found" });
            }


            const posts = await Post.find({ _id: { $in: user.favorites } });

            res.send({ success: true, posts });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Error fetching favorites",
                error: error.message
            });
        }
    },


    sendMessage: async (req, res) => {
        try {

            const fromUserId = req.body.user._id;
            const { toUserId, content } = req.body;

            if (!toUserId || !content) {
                return res.status(400).send({
                    success: false,
                    message: "Missing toUserId or content"
                });
            }

            const newMessage = new Message({
                fromUserId,
                toUserId,
                content
            });

            await newMessage.save();

            return res.send({
                success: true,
                message: "Message sent successfully",
                data: newMessage
            });
        } catch (error) {
            console.error("Error sending message:", error);
            res.status(500).send({
                success: false,
                message: "Error sending message",
                error: error.message
            });
        }
    },

    getUserMessages: async (req, res) => {
        try {

            const userId = req.user._id;

            const messages = await Message.find({
                $or: [
                    { fromUserId: userId },
                    { toUserId: userId }
                ]
            }).sort({ createdAt: -1 });

            return res.send({ success: true, messages });
        } catch (error) {
            console.error("Error fetching messages:", error);
            res.status(500).send({
                success: false,
                message: "Error fetching messages",
                error: error.message
            });
        }
    },

    deleteMessage: async (req, res) => {
        try {
            const userId = req.body.user._id;
            const { messageId } = req.body;

            const msg = await Message.findById(messageId);
            if (!msg) {
                return res.status(404).send({ success: false, message: "Message not found" });
            }


            if (msg.fromUserId.toString() !== userId && msg.toUserId.toString() !== userId) {
                return res.status(403).send({
                    success: false,
                    message: "Not authorized to delete this message"
                });
            }

            await Message.findByIdAndDelete(messageId);

            res.send({ success: true, message: "Message deleted" });
        } catch (error) {
            console.error("Error deleting message:", error);
            res.status(500).send({
                success: false,
                message: "Error deleting message",
                error: error.message
            });
        }
    },













}
