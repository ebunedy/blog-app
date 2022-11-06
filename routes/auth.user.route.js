const router = require("express").Router();
const passport = require("passport");
const {
  signup,
  userLogin,
  logout,
} = require("../controllers/user.auth.controller");

router
  .post("/signup", passport.authenticate("signup", { session: false }), signup)
  .post("/login", userLogin);
router.get("/logout", logout);

module.exports = router;
