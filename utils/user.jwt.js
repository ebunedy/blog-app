const jsonwebtoken = require("jsonwebtoken");

/** create token */
const createToken = (payload) => {
  return jsonwebtoken.sign({ user: payload }, process.env.JWT_APP_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRATION,
  });
};

module.exports = {
  createToken,
};
