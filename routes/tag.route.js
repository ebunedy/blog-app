const router = require("express").Router();
const { session } = require("passport");
const passport = require("passport");
const permission = require("../utils/permission");
const {
  createTag,
  updateTag,
  listTags,
  postsByTags,
  deleteTag,
} = require("../controllers/tag.controller");

router
  .post("/create", [
    passport.authenticate("jwt", { session: false }),
    createTag,
  ])
  .patch("/update/:tagId", [
    passport.authenticate("jwt", { session: false }),
    updateTag,
  ]);
router.get("/tags", [listTags]).get("/:tagName", postsByTags);
router.delete("/delete/:tagId", [
  passport.authenticate("jwt", { session: false }),
  deleteTag,
]);

module.exports = router;
