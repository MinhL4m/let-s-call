const router = require("express").Router();
const { logIn, signUp, checkLogIn, requestResetPassword, resetPassword } = require("../controllers/authController");
const { catchErrors } = require("../handlers/errorHandler");

router.post("/login", catchErrors(logIn));
router.post("/register", catchErrors(signUp));
router.get("/check-auth", catchErrors(checkLogIn));
router.post('/request-reset-password', catchErrors(requestResetPassword))
router.post('/reset-password', catchErrors(resetPassword))

module.exports = router;
