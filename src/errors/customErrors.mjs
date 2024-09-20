const notFoundError = (message = "Not found") => {
  const error = new Error(message);
  error.status = 404;
  return error;
};

const badRequestError = (message = "Bad request") => {
  const error = new Error(message);
  error.status = 400;
  return error;
};

const unauthorizedError = (message = "Unauthorized") => {
  const error = new Error(message);
  error.status = 401;
  return error;
};

const forbiddenError = (message = "Forbidden") => {
  const error = new Error(message);
  error.status = 403;
  return error;
};

const methodNotAllowedError = (message = "Method not allowed") => {
  const error = new Error(message);
  error.status = 405;
  return error;
};

const notAcceptableError = (message = "Not acceptable") => {
  const error = new Error(message);
  error.status = 406;
  return error;
};

const requestTimeoutError = (message = "Request timeout") => {
  const error = new Error(message);
  error.status = 408;
  return error;
};

const conflictError = (message = "Conflict") => {
  const error = new Error(message);
  error.status = 409;
  return error;
};

const goneError = (message = "Gone") => {
  const error = new Error(message);
  error.status = 410;
  return error;
};

const unsupportedMediaTypeError = (message = "Unsupported media type") => {
  const error = new Error(message);
  error.status = 415;
  return error;
};

const tooManyRequestsError = (message = "Too many requests") => {
  const error = new Error(message);
  error.status = 429;
  return error;
};

const internalServerError = (message = "Internal server error") => {
  const error = new Error(message);
  error.status = 500;
  return error;
};

const notImplementedError = (message = "Not implemented") => {
  const error = new Error(message);
  error.status = 501;
  return error;
};

const badGatewayError = (message = "Bad gateway") => {
  const error = new Error(message);
  error.status = 502;
  return error;
};

const serviceUnavailableError = (message = "Service unavailable") => {
  const error = new Error(message);
  error.status = 503;
  return error;
};

const gatewayTimeoutError = (message = "Gateway timeout") => {
  const error = new Error(message);
  error.status = 504;
  return error;
};

const httpVersionNotSupportedError = (
  message = "HTTP version not supported",
) => {
  const error = new Error(message);
  error.status = 505;
  return error;
};

const createError = (message = "An error occurred", status = 500) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export default {
  notFoundError,
  badRequestError,
  unauthorizedError,
  forbiddenError,
  methodNotAllowedError,
  notAcceptableError,
  requestTimeoutError,
  conflictError,
  goneError,
  unsupportedMediaTypeError,
  tooManyRequestsError,
  internalServerError,
  notImplementedError,
  badGatewayError,
  serviceUnavailableError,
  gatewayTimeoutError,
  httpVersionNotSupportedError,
  createError,
};
