const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    "username" : {
        type : String,
        required : true
    },
    "email" : {
        type : String,
        required : true
    },
    "password" : {
        type : String,
        required : true 
    },
    "ppurl" : {
        type : String,
        required : false
    }
});


const schema = mongoose.model("Users",userSchema);

schema.createIndexes({username:1});

module.exports = schema;