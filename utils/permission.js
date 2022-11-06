const { UnauthorizedError } = require("../errors/index");

const Unauthourized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Not authourize. Access denied");
    }
    next();
  };
};

module.exports = Unauthourized;
