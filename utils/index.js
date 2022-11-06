const { userToken } = require("./create.user.token");
const { createToken } = require("./user.jwt");

module.exports = {
  userToken,
  createToken,
};
