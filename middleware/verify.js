const jwt = require('jsonwebtoken');

module.exports = function(req,res,next) {
    const token = req.header('Authorization');
    if(!token) {
        res.status(401).json({
            "status" : 0,
            "message" : "Forbidden"
        });
    }
    try {
        jwt.verify(token,process.env.SECRET_TOKEN,(err,data) => {
            if(err) {
                res.status(500).json({
                    "status":0,
                    "error":err
                });
            }
            req.user = data;
            next();
        });
    } catch (error) {
        res.status(400).json({
            "status" : 0,
            "message" : "Invalid Token"
        });
    }
}