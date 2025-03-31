const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const userToken = req.headers.authorization

    jwt.verify(userToken, process.env.SECRET_KEY, (err, item) => {

        if (err) return res.send({success: false, message: "Invalid token"});
        if (!item) return res.send({success: false, message: "Token is missing"});

        console.log(item);
        req.body.user = item
        req.user = item;

        next()
    })
}



