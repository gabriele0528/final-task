const cors = require("cors")
const mainRouter = require("./router/routes")
const express = require("express")
const app = express()
const mongoose = require("mongoose")
require("dotenv").config()

mongoose
    .connect(process.env.MONGO_KEY)
    .then(res =>{
        console.log("connected to DB")
    })
    .catch((err) =>{
        console.log(err)
    })

app.use(cors())
app.use(express.json())

app.use("/", mainRouter)



app.listen(2002)
console.log("Server runs on port 2002")


const {Server} = require("socket.io");
const io = new Server({
    cors:{
        origin:"*"
    }
});


