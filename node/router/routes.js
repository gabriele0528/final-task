const express = require('express')
const router = express.Router()

const {
    login,
    register,
    profile,
    updateProfile,
    getAllUsers,
    createPost,
    getAllPosts,
    getSinglePost,
    addComment,
    addFavorite,
    removeFavorite,
    getMyFavorites,
    sendMessage,
    getUserMessages,
    deleteMessage


} = require("../controllers/mainControllers")

const {
    validateRegister,
    validateLogin
} = require("../midleware/validators")

const userAuth = require("../midleware/userAuth")

router.post("/register", validateRegister, register)
router.post("/login", validateLogin, login)
router.get("/profile/:id", profile)
router.post("/updateProfile", userAuth, updateProfile)
router.get("/users", getAllUsers)
router.post('/posts', userAuth, createPost);
router.get('/posts', getAllPosts);
router.get('/posts/:id', getSinglePost);
router.post('/posts/:id/comment', userAuth, addComment);
router.post("/addFavorite", userAuth, addFavorite);
router.post("/removeFavorite", userAuth, removeFavorite);
router.get("/myFavorites", userAuth, getMyFavorites);
router.post("/messages/send", userAuth, sendMessage);
router.get("/messages", userAuth, getUserMessages);
router.post("/messages/delete", userAuth, deleteMessage);






module.exports = router