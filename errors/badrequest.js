const CustomError = require("./custom.error");
const { StatusCodes } = require("http-status-codes");

class BadrequestError extends CustomError {
  constructor(message) {
    super(message);
    this.StatusCodes = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadrequestError;
