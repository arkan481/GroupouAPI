const UserModel = require('../models/Users.js');

module.exports = async function(req,res,next) {
    const email = req.body.email;
    const user = await UserModel.findOne({email},{password:0});
    if(user) {
        res.status(200).json({
            "status" : 0,
            "message" : "Email Already Exists!"
        });
    }else {
        next();
    }
}