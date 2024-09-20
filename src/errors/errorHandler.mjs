import { logger } from "../utils/logger.mjs";

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = status === 500 ? "Internal Server Error" : err.message;

  // Log the error with stack trace if available
  if (status === 500) {
    logger.log("error", err.message, { stack: err.stack });
  } else {
    logger.log("warn", err.message);
  }

  res.status(status).json({
    error: {
      message,
      status,
    },
  });
};

export default errorHandler;
