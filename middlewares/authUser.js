import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
    try {
        const { token } = req.headers; 

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
        }

        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = token_decoded.userId; 

        next();

    } catch (error) {
        console.error("Auth User Error:", error);
        return res.status(401).json({ success: false, message: "Not Authorized access" });
    }
};

export default authUser;