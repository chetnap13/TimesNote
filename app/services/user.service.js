const User = require('../model/user.model')
var bcrypt = require('bcrypt-nodejs')
var Token = require('../model/token.model')
var crypto = require('crypto')
var eventEmitter = require('../../events/event')
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
           await bcrypt.hash(req.body.password, bcrypt.genSaltSync(10),null,async function(err,hash){
                if(err){
                    throw err
                }
                else{
                    user.password = hash
                }
            })
            let userResponse = await User.create(user)
            var token = await new Token({_userId:userResponse._id,token:crypto.randomBytes(16).toString('hex')})
            await Token.create(token)
            let subject = "Account Verification Email";
            let text = "Hello,\n\n" +
            "Please verify your account by clicking the link: \nhttp://" +
            "localhost:4200" +
            "/confirmation/" +
            token.token +
            "\n";
            eventEmitter.emit("sendEmail",subject,text,userResponse)
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
function tokenCreation(registeredUser){
    return new Promise(async function(resolve,reject){
       try{
           var token = await new Token({
               _userId :registeredUser._id,
               token: crypto.randomBytes(16).toString('hex')
           })
           console.log(token)
            await token.save(function(err){
               if(err){
                   return res.status(500).send({
                       message:err.message
                   })
                   //reject(err.message) 
                                         
               }
               else{
                   let subject = 'account verification token'
                   let text = token.token
                   eventEmitter.emit('sendEmail',subject,registeredUser,text)                    
               }
           })
       }
       catch(error){
           reject(error)
        }
    })
}
exports.findValidUserById=async function(userId){
    var validUser=await User.findOne({
        _id:userId,
        isActive:true,
        isDelete:false
    })
    return validUser;
}

exports.forgetPassword = async function(req, res){
    console.log("text in service")
    var userExsist = await User.findOne({
        email:req.body.email
    })
    if(userExsist){
        var token= await new Token({
            _userId:userExsist._id,
            token:crypto.randomBytes(16).toString("hex")
            
        })
        
        await Token.create(token)
        let subject ="forget password link"
        let text = "Hello,\n\n" +
        "Please reset your password by clicking the link: \nhttp://" +
        "localhost:4200" +
        "/UpdatePassword/" +
        token.token +
        "\n";       
        eventEmitter.emit("sendEmail",subject,text,userExsist)
        res.status(200).send({
            message:"email sent successfully"
        })

    }
    else{
        res.status(401).send({
            message:"invalid user"
        })
    }

}