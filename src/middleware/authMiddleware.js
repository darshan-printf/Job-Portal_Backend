import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const protect = async (req, res, next) => {
    let token = req.headers.authorization || req.headers.token; // Allow token in either "authorization" or "token" header

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // This will throw an error if the token is expired
        const admin = await Admin.findById(decoded.id).select("-password");

        if (!admin) {
            return res.status(401).json({ message: "Unauthorized: Admin not found" });
        }

        req.admin = admin; // Attach the admin object to the request
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Unauthorized: Token has expired" });
        }
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};


export default protect;


const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.admin || !roles.includes(req.admin.role)) {
            return res.status(403).json({ message: "Forbidden: You do not have permission to access this resource" });
        }
        next();
    };
};

export { authorize };
