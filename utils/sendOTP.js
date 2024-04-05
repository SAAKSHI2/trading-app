import nodemailer from "nodemailer";
import twilio from "twilio";
import fastTwoSMS from "fast-two-sms";
import dotenv from "dotenv";
import SendOtp from "sendotp";

dotenv.config();

let transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure : false,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASS
    }
})


export const sendOTPByEmail = async(email,otp)=>{
    const subject = "OTP for Trading App";
    const message = "Your OTP for Trading App is : " + otp;
    

    let mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: subject,
        text : message
    }

    transporter.sendMail(mailOptions,(error,info) => {
        if(error){
            console.log(error.message);
        } else{
            console.log("email sent successfully :)");
        }
    })
}

export const sendOTPBySMS = async(phoneNumber , otp) => {
    // Replace these variables with your own values from your Twilio account
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    const recipientPhoneNumber = "+91"+phoneNumber;

    // Create a Twilio client
    const client = new twilio(accountSid, authToken);

    // Send an SMS message
    await client.messages
    .create({
        body: 'Hello , Your OTP for trading app is : '+ otp, // Message text
        from: twilioPhoneNumber, // Your Twilio phone number
        to: recipientPhoneNumber, // Recipient's phone number
    })
    .then((message) => {
        console.log('Message sent successfully:', message.sid);
    })
    .catch((error) => {
        console.error('Error sending message:', error);
    });
   

}