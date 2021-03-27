const router = require("express").Router();
const { get } = require("mongoose");
const { createChatroom, getAllChatroom } = require("../controllers/chatroomController");
const { catchErrors } = require("../handlers/errorHandler");

const auth = require("../middlewares/auth");

// before user can get to createChatroom, it need to pass the middleware auth
router.post("/", auth, catchErrors(createChatroom));
router.get("/", auth, catchErrors(getAllChatroom));
module.exports = router;
