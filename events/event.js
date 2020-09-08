var events = require('events');
var eventEmitter = new events.EventEmitter();
var nodemailer = require('nodemailer');
var dotenv = require('dotenv')
dotenv.config();

/// Create event handler
var sendEmail = function (subject,text,user) {
   
        try {
            var transporter =  nodemailer.createTransport({
                service:'gmail',
               
               // secure: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });
console.log(process.env.EMAIL)
console.log(process.env.PASSWORD)
            var mailOptions =  {
                from:process.env.EMAIL ,
                to: user.email,
                subject: subject,
                text: text,
            }
             transporter.sendMail(mailOptions,  function (error, info) {
                if (error) {
                    console.log(error)
                }
                else {
                    return ('Verfication mail has been sent to ' + user.email + '.');
                }
            });
        } catch (error) {
            console.log(error)
        }
    
       
}

/// Assign the event handler to an event
eventEmitter.on('sendEmail', sendEmail);

module.exports = eventEmitter;