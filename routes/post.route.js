const router = require("express").Router();
const passport = require("passport");
const {
  createPost,
  updatePost,
  searchSortPaginatePosts,
  getSinglePost,
  prePostUpdate,
  deletePost,
  addLike,
  removeLike,
} = require("../controllers/post.controller");

router
  .post("/create", [
    passport.authenticate("jwt", { session: false }),
    createPost,
  ])
  .patch("/update/:postId", [
    passport.authenticate("jwt", { session: false }),
    updatePost,
  ])
  .patch("/add-like/:postId", [
    passport.authenticate("jwt", { session: false }),
    addLike,
  ])
  .patch("/remove-like/:postId", [
    passport.authenticate("jwt", { session: false }),
    removeLike,
  ]);
router
  .get("/pre-update/:postId", [
    passport.authenticate("jwt", { session: false }),
    prePostUpdate,
  ])
  .get("/search", searchSortPaginatePosts)
  .get("/:postId", getSinglePost);
router.delete("/delete/:postId", [
  passport.authenticate("jwt", { session: false }),
  deletePost,
]);

module.exports = router;
