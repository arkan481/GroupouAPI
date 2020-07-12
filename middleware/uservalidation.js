/*
  Middleware to verify the user input using joi
*/
const Joi = require('@hapi/joi');

const schema = Joi.object({
    username : Joi.string()
    .alphanum()
    .min(5)
    .max(30)
    .required(),

    password : Joi.string()
    .required()
    .min(8)
    .max(20),

    email : Joi.string().email(),

    ppurl : Joi.string().uri()
});

function validate(req,res,next) {
    const user = {
        "username" : req.body.username,
        "password" : req.body.password,
        "email" : req.body.email,
        "ppurl" : req.body.ppurl
    };

    const validated = schema.validate(user);

    if (validated.error) {
        res.status(200).json({
            "status" : 0,
            "message" : "user validation error",
            "error" : validated.error.details
        });
    }else {
        next();
    }
}

module.exports = validate;