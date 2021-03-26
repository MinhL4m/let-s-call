const jwt = require("jwt-then");
const authMiddleWare = async (req, res, next) => {
  try {
    if (!req.headers.authorization) throw "Forbidden!!";
    const token = req.headers.authorization.split(" ")[1];

    // payload contain the id of logined user
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    req.payload = payload;

    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Forbidden",
    });
  }
};

module.exports = authMiddleWare;
