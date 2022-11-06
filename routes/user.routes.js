const router = require("express").Router();
const passport = require("passport");
const {
  userPublicProfile,
  userProfile,
  preUserUpdate,
  userUpdate,
  deleteUser,
} = require("../controllers/user.controller");

router.patch("/update", [
  passport.authenticate("jwt", { session: false }),
  userUpdate,
]);
router
  .get("/pre-update", [
    passport.authenticate("jwt", { session: false }),
    preUserUpdate,
  ])
  .get("/profile/:userId", userPublicProfile)
  .get("/profile", [
    passport.authenticate("jwt", { session: false }),
    userProfile,
  ]);
router.delete("/delete", [
  passport.authenticate("jwt", { session: false }),
  deleteUser,
]);

module.exports = router;
