import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const authenticate = (req, res, next) => {
    console.log(req.cookies)
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return res.status(401).json({ message: "Authentication failed. No token provided." });
    }

    // Verify the JWT token
    jwt.verify(accessToken, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token." });
        }
        // Token is valid, proceed to the next middleware
        req.user = decoded;
        next();
    });
}