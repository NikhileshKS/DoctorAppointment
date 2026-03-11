import jwt from "jsonwebtoken";

// admin authentication middleware
const authAdmin = (req, res, next) => {
    try {
        const { atoken } = req.headers;

        if (!atoken) {
            return res
            .status(401)
            .json({ success: false, message: "Not Authorized Login Again" });
        }

        // Decode the token
        const token_decoded = jwt.verify(atoken, process.env.JWT_SECRET);

        if(token_decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.json({ success: false, message: "Not Authorized access" });
        }

        next();

    } catch (error) {
        console.error("Auth Admin Error:", error);
        return res
        .status(401)
        .json({ success: false, message: "Not Authorized access" });
    }
};

export default authAdmin;