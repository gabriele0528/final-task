const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const postSchema = new Schema({

    image:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    ownerName: {
        type: String,
        required: true
    },
    createdDate:{
        type: Date,
        default: Date.now
    },
    ownerId:{
        type: String,
        required: true,
    },
    comments: {
        type: [String],
        default: []
    },




});

const Post = mongoose.model("posts", postSchema);

module.exports = Post;