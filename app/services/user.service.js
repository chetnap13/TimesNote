const User = require('../model/user.model')
var bcrypt = require('bcrypt-nodejs')

exports.userCreate = async function(req,res){
    var user = await User.findOne({
        email:req.body.email
    })
    try{
        if(!user){
            let user = new User({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password
            })
            bcrypt.hash(req.body.password, bcrypt.genSaltSync(10),null,async function(err,hash){
                if(err){
                    throw err
                }
                else{
                    user.password = hash
                }
            })
            let userResponse = await User.create(user)
            res.send({
                message:userResponse.name +'registered'
            })
        }
        else{
            res.send({
            message:'user already exsist'})
        }
    }catch(error){
        throw error
    }
}