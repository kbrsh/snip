// Function to send error from api
var sendAPIError = function(code, message) {
  return {
    error: code + ": " + message
  }
}
