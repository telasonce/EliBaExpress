require('dotenv').config();

const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EmailGmail,
      pass: process.env.PassGmail,
    }
  });

async function wrapedSendMail(mailOptions) {
    return new Promise( (resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("error is " + error);
                resolve({
                    sent:false,
                    error:error
                }); 
            }
            else {
                console.log('Email sent: ' + info.response);
                resolve({
                    sent:true,
                    data:info
                });
            }
        });

    })
   }

   let sendEmail = async function( toEmail, asunto, contenidoHtml ){      
    let mailOptions = {
            from: process.env.EmailGmail,
            to:  toEmail,
            subject: asunto,
            html: contenidoHtml
        };
    let resp= await wrapedSendMail(mailOptions);
     return resp;
  } 


    module.exports = sendEmail;
