const jwt = require('jsonwebtoken')
const config = require('config');

module.exports = function (req, res , next) {
    //Get Token from headers
    const token = req.header('x-auth-token');
    
    //Check if not token
    if(!token) {
        return res.status(401).send("No token , authorization denied");
    }

    //Verify the tokens
    try {
        const decoded = jwt.verify(token, config.get("jwtSecret"));

        req.user = decoded.user;
        next() 
    } catch (error) {
        res.status(401).json({msg : "token is not valid"})
    }
}