const router = require("express").Router();
const { createChatroom } = require("../controllers/chatroomController");
const { catchErrors } = require("../handlers/errorHandler");

const auth = require("../middlewares/auth");

// before user can get to createChatroom, it need to pass the middleware auth
router.post("/", auth, catchErrors(createChatroom));

module.exports = router;
