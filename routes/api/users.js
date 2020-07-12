const express = require('express');
const md5 = require('md5');
const UserModel = require('../../models/Users.js');
const jwt = require('jsonwebtoken');
const verify = require('../../middleware/verify.js');
const stalkLog = require('../../middleware/stalklog.js');
const emailexists = require('../../middleware/emailexist.js');
const uservalidation = require('../../middleware/uservalidation.js');

// instansiating express router
const router = express.Router();

// get all user max of 15
router.get('/', verify, async (req, res) => {
    const users = await UserModel.find({},{
        "password" : 0
    }).limit(15);
    if (users.length === 0) {
        res.sendStatus(204);
    } else {
        res.status(200).json({
            "status": 1,
            "message": "success",
            users
        });
    }
});

// getting specific user by matching email or alpabethic username
router.get('/spec/:identifier',verify,stalkLog,async (req,res) => {
    const identifier = req.params.identifier;
    const users = await UserModel.find({
        $or:[
            {
                "username" : new RegExp(identifier,'i')
            },
            {
                "email" : identifier
            }
        ]
    },{
        "password" : 0
    });
    if (users.length === 0) {
        res.sendStatus(204);
    } else {
        res.status(200).json({
            "status": 1,
            "message": "success",
            users
        });
    }
});

// signing up the user
router.post('/', emailexists , uservalidation ,async (req, res) => {
    // TODO : ADD EMAIL ALREADY EXISTS CHECK
    try {
        const encryptedPassword = md5(req.body.password);
        const newUser = new UserModel({
            "username": req.body.username,
            "email": req.body.email,
            "password": encryptedPassword,
            "ppurl": req.body.ppurl
        });
        const serverOutput = await newUser.save();
        if (!serverOutput) {
            res.status(500).json({
                "status": 0,
                "message": "error creating the user"
            });
        } else {
            res.status(200).json({
                "status": 1,
                "message": "success",
                serverOutput
            });
        }
    } catch (error) {
        res.status(500).json({
            "status": "0",
            "error": error.message
        });
    }
});

// logging in the user
router.post('/login', async (req, res) => {
    try {
        const decryptedPassword = md5(req.body.password);
        const user = await UserModel.findOne({
            "email": req.body.email,
            "password": decryptedPassword
        });
        if (!user) {
            res.status(401).json({
                "status": 0,
                "message": "Invalid email or password"
            });
        } else {
            // populating the token
            const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);
            res.status(200).json({
                "status": 1,
                "message": "Login Successful",
                token
            });
        }

    } catch (error) {
        res.status(500).json({
            "status": 0,
            "error": error.message
        });
    }
});

// updating the user password
// TODO : ADD PARAM VALIDATOR
router.patch('/me/changepassword',verify, async (req,res)=>{
    const updatingUserID = req.user._id;
    const encryptedPassword = md5(req.body.password);
    const updatedUser = await UserModel.findByIdAndUpdate(updatingUserID,{
        "password" : encryptedPassword
    },{
        useFindAndModify : true
    });
    res.status(200).json({
        updatedUser
    });
});


module.exports = router;