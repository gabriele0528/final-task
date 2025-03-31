module.exports = {

    validateRegister: (req, res, next) => {
        const {username, password} = req.body

        if(username.length > 20 || username.length < 4) return res.send({error: true, message: "Username must be between 4 and 20 characters long."})
        if(password.length > 20 || password.length < 4) return res.send({error: true, message: "Password must be between 4 and 20 characters long."})



        next()
    },
    validateLogin: (req, res, next) => {
        const {username, password} = req.body

        if(username.length > 20 && username.length < 4) return res.send({error: true, message: "Username must be between 4 and 20 characters long."})
        if(password.length > 20 && password.length < 4) return res.send({error: true, message: "Password must be between 4 and 20 characters long."})

        next()
    }

}