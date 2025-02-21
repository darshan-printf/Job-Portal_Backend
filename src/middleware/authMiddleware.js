import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const protect = async (req, res, next) => {
    let token = req.headers.authorization || req.headers.token; // Allow token in either "authorization" or "token" header

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // This will automatically throw an error if the token is expired
        req.Admin = await Admin.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Unauthorized: Token has expired" });
        }
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

export default protect;
