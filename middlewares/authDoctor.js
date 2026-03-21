import jwt from "jsonwebtoken";

const authDoctor = (req, res, next) => {
    try {
        const { dtoken } = req.headers;

        if (!dtoken) {
            return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
        }

        const token_decoded = jwt.verify(dtoken, process.env.JWT_SECRET);
        req.docId = token_decoded.docId;

        next();

    } catch (error) {
        console.error("Auth Doctor Error:", error);
        return res.status(401).json({ success: false, message: "Not Authorized" });
    }
};

export default authDoctor;