import jwt from "jsonwebtoken";
import envConfig from "../config/env.config.mjs";

const JWT_PRIVATE_KEY = envConfig.JWT_PRIVATE_KEY;

export const generateToken = (user, purpose = "session") => {
  const { _id, email, role, first_name, last_name } = user;
  const payload = { _id, email, role, first_name, last_name, purpose };

  let expiresIn;

  switch (purpose) {
    case "session":
      expiresIn = "1m";
      break;
    case "resetPassword":
      expiresIn = "2m";
      break;
    default:
      expiresIn = "30s";
      break;
  }

  const token = jwt.sign(payload, JWT_PRIVATE_KEY, { expiresIn });
  return token;
};

export const verifyToken = (token, expectedPurpose) => {
  try {
    const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
    if (decoded.purpose !== expectedPurpose) {
      throw new Error(
        `Token purpose mismatch: expected ${expectedPurpose}, got ${decoded.purpose}`,
      );
    }
    return decoded;
  } catch (error) {
    return null;
  }
};

const authToken = (request, response, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return response.status(401).send({ error: "Not authenticated." });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_PRIVATE_KEY, (error, credentials) => {
    if (error) return response.status(403).send({ error: "Not Authorized." });
    req.user = credentials.user;
    next();
  });
};
