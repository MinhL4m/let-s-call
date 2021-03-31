const router = require("express").Router();
const {
  getFriendsByName,
  getAllFriends,
  addFriend,
  unFriend,
} = require("../controllers/friendController");
const { catchErrors } = require("../handlers/errorHandler");
const auth = require("../middlewares/auth");

router.get("/by-name", auth, catchErrors(getFriendsByName));
router.get("/", auth, catchErrors(getAllFriends));
router.put("/addfriend", auth, catchErrors(addFriend));
router.put("/unfriend", auth, catchErrors(unFriend));
module.exports = router;
