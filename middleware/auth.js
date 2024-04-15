import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const authenticate = (req, res, next) => {
    // console.log(req.cookies)
    // const accessToken = req.cookies.accessToken;
    // if (!accessToken) {
    //     return res.status(401).json({ message: "Authentication failed. No token provided." });
    // }

    const bearerHeader = req.headers['authorization'];
    // console.log(req.headers);
    // console.log("bearerHeader : "+ bearerHeader);

    if (typeof bearerHeader !== 'undefined') {
        // Extract the token from the bearer header
        const bearerToken = bearerHeader.split(' ')[1];
        // console.log("beaerToken : "+ bearerToken);

        // Verify the JWT token
        jwt.verify(bearerToken, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token." });
            }
            // Token is valid, proceed to the next middleware
            req.user = decoded;
            next();
        });
  } else{
    res.status(401).json({message : "Not authorized"});
  }

}