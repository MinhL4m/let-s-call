const router = require("express").Router();
const { getMessageFromRoom } = require("../controllers/messageController");
const { catchErrors } = require("../handlers/errorHandler");
const auth = require("../middlewares/auth");

router.get("/", auth, catchErrors(getMessageFromRoom));

module.exports = router;
