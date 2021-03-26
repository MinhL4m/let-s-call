const router = require("express").Router();
const { logIn, signUp, checkLogIn } = require("../controllers/authController");
const { catchErrors } = require("../handlers/errorHandler");

router.post("/login", catchErrors(logIn));
router.post("/register", catchErrors(signUp));
router.get("/check-auth", catchErrors(checkLogIn));

module.exports = router;
