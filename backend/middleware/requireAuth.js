import jwt from "jsonwebtoken";

const requireAuth = async (req, res, next) => {

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(400).json({ error: "Authorization token required" });
    }

    const token = authorization.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY);

        req.user = payload;
        next();
    } catch (err) {
        console.error("Error verifying the token", err);
        return res.status(401).json({ error: "Request is not authorized. Try logging in." })
    }

}

// module.exports = requireAuth
export default requireAuth