import usersRepository from "../persistences/mongo/repositories/users.repository.mjs";
import { userResponseDto } from "../dto/userResponse.dto.mjs";
import customErrors from "../errors/customErrors.mjs";
import { generateUsersMocks } from "../mocks/user.mock.mjs"; // Import the function to generate mock users
import { createHash, isValidPassword } from "../utils/bcrypt.mjs";
import envConfig from "../config/env.config.mjs";
import { generateToken, verifyToken } from "../utils/jwt.mjs";

const JWT_PRIVATE_KEY = envConfig.JWT_PRIVATE_KEY;

const getAll = async () => {
  const users = await usersRepository.getAll();
  if (!users || users.length === 0)
    throw customErrors.notFoundError("No users found.");
  return users;
};

const getByEmail = async (email) => {
  const userData = await usersRepository.getByEmail(email);
  if (!userData) {
    throw customErrors.notFoundError("User not found");
  }
  return userResponseDto(userData);
};

const createUser = async (user) => {
  const existingUser = await usersRepository.getByEmail(user.email);
  if (existingUser) {
    throw customErrors.badRequestError("User already exists");
  }
  return await usersRepository.create(user);
};

const createMockUsers = async (amount) => {
  const users = generateUsersMocks(amount);
  const createdUsers = [];

  for (const user of users) {
    const { email, first_name, last_name, age, password } = user;
    const existingUser = await usersRepository.getByEmail(email);
    if (existingUser) {
      throw customErrors.badRequestError("User already exists");
    } else {
      const newUser = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password), // Save the password hashed
      };
      await usersRepository.create(newUser);
      createdUsers.push({ ...user, password }); // Add plain text password for response
    }
  }

  return createdUsers; // Return users with plain text passwords
};

const generatePasswordResetToken = async (email) => {
  const user = await usersRepository.getByEmail(email);
  if (!user) {
    throw customErrors.notFoundError("User not found");
  }
  const resetToken = generateToken(user, "resetPassword");
  return resetToken;
};

const verifyPasswordResetToken = (token) => {
  const verifiedToken = verifyToken(token, "resetPassword");
  if (!verifiedToken) {
    throw customErrors.forbiddenError(
      "Invalid or expired password reset token",
    );
  }
  return verifiedToken;
};

const updatePassword = async (email, newPassword) => {
  const user = await usersRepository.getByEmail(email);
  if (!user) {
    throw customErrors.notFoundError("User not found");
  }
  if (isValidPassword(user, newPassword)) {
    throw customErrors.conflictError(
      "The new password cannot be the same as the current password.",
    );
  }
  const hashedPassword = createHash(newPassword);
  const userId = user._id.toString(); // Call the function to convert ObjectId to string
  await usersRepository.update(userId, { password: hashedPassword });
};

const changeUserRole = async (uid) => {
  const user = await usersRepository.getById(uid);
  if (!user) throw customErrors.notFoundError("User not found");

  if (user.role === "user" && user.documents.length < 3) {
    throw customErrors.badRequestError(
      "Please upload all 3 required documents first.",
    );
  }

  const userRole = user.role === "premium" ? "user" : "premium";
  return await usersRepository.update(uid, { role: userRole });
};

const addDocuments = async (uid, reqFiles) => {
  const files = reqFiles.document;
  const userDocuments = files.map((file) => {
    return {
      name: file.filename,
      reference: file.path,
    };
  });
  const user = await usersRepository.update(uid, { documents: userDocuments });
  if (!user) throw customErrors.notFoundError(`User with ID: ${uid} not found`);
  return user;
};

export default {
  getAll,
  getByEmail,
  createUser,
  createMockUsers,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  updatePassword,
  changeUserRole,
  addDocuments,
};
