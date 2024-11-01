// status code:
//   informational response: 100 - 199
//   successful response: 200 - 299
//   redirection message: 300 - 399
//   client error response: 400 - 499
//   server error response: 500 - 599

class ApiResponse {
  constructor(
    statusCode,
    data,
    message = "SUCCESS"
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
};

export default ApiResponse;