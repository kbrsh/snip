// Function to send error from api
var formatAPIError = function(code, message) {
  return {
    error: code + ": " + message
  }
}

module.exports = sendAPIError;
