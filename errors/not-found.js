const CustomError = require("./custom.error");
const { StatusCodes } = require("http-status-codes");

class NotFoundError extends CustomError {
  constructor(message) {
    super(message);
    this.StatusCodes = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;
