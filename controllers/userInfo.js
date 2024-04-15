import Users from "../models/Users.js";
export const userInfo = async(req,res)=> {
    try {
        const { userID } = req.params;
        const user = await Users.findOne({ _id :userID })
        .select("email firstName lastName  phoneNumber currency")

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
}