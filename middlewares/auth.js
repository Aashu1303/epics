const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if (!token) return res.status(403).send("Access Denied");

        if(token.startsWith("Bearer ")){
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(500).json({ error: "user not verified"});
    }
};

module.exports = ensureAuthenticated;