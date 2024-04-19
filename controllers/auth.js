import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Users from "../models/Users.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendOTPByEmail , sendOTPBySMS} from "../utils/sendOTP.js";
import bcrypt from "bcrypt";

dotenv.config();

export const login = async(req,res) => {
    try {
        const { phoneNumber, password } = req.body;
    
        // Find the user by phoneNumebr
        const user = await Users.findOne({ phoneNumber });
        if (!user) {
            return res.status(401).json({ success: false, message: 'user not registered' });
        }

        const checkPassword = await bcrypt.compare(password,user.password);
      
        if(checkPassword === true){
            const token = jwt.sign({user_id:user._id},process.env.SECRET_KEY);

            // Get the current date
            const currentDate = new Date();

            // Add 7 days to the current date
            const expirationDate = new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days in milliseconds

            // Get the timestamp representing the expiration date
            // const expirationTimestamp = expirationDate.getTime();
           //settinh expirationTImestamp to 0 for now
            const expirationTImestamp = 0;

            user.accessToken = token;
            // user.expiryDate = expirationTImestamp;

            await user.save();

            res.cookie("accessToken",token,{
                httpOnly:true,
                sameSite: process.env.SAME_SITE,
                secure: process.env.SECURE,
            }).status(200).json({Message: "user login successfull", userID : user._id, accessToken: token, expiryDate: expirationTImestamp, success: true});
              
        } else{
            return res.status(400).json({ success: false, message: "wrong password"});
        }

      } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }

}


export const register = async(req,res)=>{
    try {
          const { firstName, lastName , phoneNumber, email } = req.body;

         // Check if the phoneNumber is already registered
            const existingUser = await Users.findOne({ phoneNumber });
            if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this phoneNumber already exists' });
            }

        // Generate OTP
        const otp = generateOTP();
        
        //send OTP to user email and SMS
        await sendOTPByEmail(email, otp);
        await sendOTPBySMS(phoneNumber, otp);


       // Store OTP in a secure way (e.g., database) for verification later
        const newUser = new Users({ email, otp , phoneNumber, firstName, lastName});
        await newUser.save();

        res.status(200).json({ success: true, message: 'oTP send successfully.' });

      } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });

      }
  
}


export const verifyOTP = async(req, res) => {
    const {otp, phoneNumber} = req.body;
    try{
        const user = await Users.findOne({ phoneNumber });
         if (!user) {
            return res.status(400).json({ success: false, message: 'user not registered' });
         } 
         if(otp === user.otp){
             return res.status(200).json({ success: true, message: 'user verified successfully' });
         } else{
             return res.status(400).json({ success: false, message: 'invalid OTP' });
         }

    } catch(error){
        console.error('Error verifying OTP:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }

}


export const setPassword  = async(req,res) => {
    const {password , phoneNumber} = req.body;
    try{
     //Hash password
     const hash = bcrypt.hash(password, 10 ,async(err,hash)=>{
        if(err){
            return res.status(400).json(err.message);
        }
        //store hashed password in database
         const user = await Users.findOne({ phoneNumber });
         if (!user) {
         return res.status(404).json({ success: false, message: 'user not found' });
         }

         user.password = hash;
         await user.save();
         return res.status(200).json("password is set successfully"); 
    })
    } catch(error){
        res.status(400).json(error.message);
    }
}


export const resendOTP = async(req, res) => {

    const {phoneNumber, email } = req.body;

    // Generate OTP
    const otp = generateOTP();
    try{
        //send OTP to user email and SMS
        await sendOTPByEmail(email, otp);
        await sendOTPBySMS(phoneNumber, otp);

       // Store OTP in a secure way (e.g., database) for verification later
       const user = await Users.findOne({ phoneNumber });  
       user.otp = otp;    

       await user.save();
       res.status(200).json({ success: true, message: 'oTP send successfully.' });

      } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });

      }
}


export const logout=(req,res)=>{
    res.clearCookie("accessToken",{
        sameSite: process.env.SAME_SITE,
        secure: process.env.SECURE,
    }).status(200).json("user has been logout")

}