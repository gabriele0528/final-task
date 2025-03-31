const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    username:{
        type: String,
        required: true,
    },

    password:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        default: "https://via.placeholder.com/150"
    },
    favorites:{
        type: [String],
        default: []
    }


});

module.exports = mongoose.model("user", userSchema);