import Users from "../models/Users.js";
export const userInfo = async(req,res)=> {
    try {
        const { userID } = req.params;
        const user = await Users.findOne({ _id :userID });
        // .select("email firstName lastName  phoneNumber currency current_stocks settings accessToken profile_pic")
        const {_doc, ...otherInfo} = user;
        const {transactions, otp, password, __v,...usersInfo} = _doc; 

        if (!user) {
          return res.status(404).json({ message: 'User not found' , success: false});
        }
        res.status(200).json({user: {...usersInfo, expiryDate: 0}, success: true});
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' , success: false});
      }
}

export const deleteUser = async(req,res)=> {
    try {
        const { userID } = req.params;
        const deletedUser = await Users.findByIdAndDelete(userID);

        res.status(200).json({success: true, user_id: userID, message: "User deleted successfully"});
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' , success: false});
      }
}

export const updateUserInfo = async(req,res)=> {
    try {
        const { userID } = req.params;
        const {email, phoneNumebr, password, firstName, lastName, profile_pic, settings} = req.body;

        const user = await Users.findOne({ _id :userID });

        if (!user) {
          return res.status(404).json({ message: 'User not found' , success: false});
        }

        email?user.email=email:null;
        phoneNumebr?user.phoneNumber=phoneNumebr:null;
        firstName?user.firstName = firstName:null;
        lastName?user.lastName=lastName:null;
        profile_pic?user.profile_pic=profile_pic:null;
        settings?user.settings = settings:null;



        await user.save();

        const {_doc, ...otherInfo} = user;
        const {transactions, current_stocks, otp, ...updatedUser} = _doc;

        res.status(200).json({user: {...updatedUser, expiryDate: 0}, success: true, message: "profile updated successfully"});
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' , success: false});
      }
}