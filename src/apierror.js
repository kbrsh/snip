var sendAPIError = function(code, message) {
  return {
    error: code + ": " + message
  }
}
