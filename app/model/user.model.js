const mongoose = require ('mongoose')
const UserSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            max: 20
        },

        email:{
            type: String,
            required: true,
        },

        password:{
            type: String,
            required:true
        },
        isVerified:{
            type:Boolean,
            default:false
        },

    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model('User',UserSchema); 
