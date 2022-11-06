const { StatusCodes } = require("http-status-codes");
const passport = require("passport");
const { NotFoundError, BadrequestError } = require("../errors/index");
const { userToken, createToken } = require("../utils/index");

const signup = async (req, res, next) => {
  res
    .status(StatusCodes.CREATED)
    .json({ message: "user created successfully", name: req.user.first_name });
};

const userLogin = async (req, res, next) => {
  passport.authenticate("login", async (err, user) => {
    try {
      if (err || !user) {
        const error = new BadrequestError(
          "no user found please register as a user"
        );
        next(error);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const userInfoToken = userToken(user);
        const token = createToken(userInfoToken);
        res.status(StatusCodes.OK).json({
          message: "user logged in successfully",
          token,
        });
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

const logout = (req, res) => {
  req.session.destroy();
  res.status(StatusCodes.OK).json({ message: "user logged out" });
};

module.exports = {
  signup,
  userLogin,
  logout,
};

/**
 *
 */
