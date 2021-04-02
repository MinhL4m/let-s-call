const router = require("express").Router();
const {
  subscribe,
  unsubscribe,
} = require("../controllers/notificationController");
const { catchErrors } = require("../handlers/errorHandler");
const auth = require("../middlewares/auth");

router.post("/subscribe", auth, catchErrors(subscribe));
router.put("/unsubscribe", auth, catchErrors(unsubscribe));

module.exports = router;
