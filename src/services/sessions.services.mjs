import { generateToken } from "../utils/jwt.mjs";
import { userResponseDto } from "../dto/userResponse.dto.mjs";
import { jwtResponseDto } from "../dto/jwtResponse.dto.mjs";
import usersRepository from "../persistences/mongo/repositories/users.repository.mjs";
import { createHash } from "../utils/bcrypt.mjs";
import customErrors from "../errors/customErrors.mjs";
import usersServices from "./users.services.mjs";

/* const register = async (userData) => {
  const { email, first_name, last_name, age, password } = userData;

  // Check if the user already exists by email
  const existingUser = await usersRepository.getByEmail(email);

  // Log for debugging purposes
  console.log("Checking user registration for email:", email);
  console.log("Existing user:", existingUser);

  // If the user already exists, throw an error
  if (existingUser) {
    throw customErrors.badRequestError("User already exists");
  }

  // If no user exists, create a new user
  const newUser = {
    first_name,
    last_name,
    email,
    age,
    password: createHash(password),
  };

  await usersRepository.create(newUser);

  // Return a confirmation or relevant data if needed
  return {
    message: "User registered successfully",
  };
}; */

const login = async (user) => {
  const token = generateToken(user);
  const userDto = userResponseDto(user);
  return { user: userDto, token };
};

const getCurrentUser = (user) => {
  if (!user) {
    throw customErrors.unauthorizedError("User not authenticated");
  }
  return jwtResponseDto(user);
};

const loginGithub = async (user) => {
  const userDto = userResponseDto(user);
  return userDto;
};

const logout = async (session) => {
  if (session.user) {
    await usersServices.updateLastConnection({ email: session.user.email });
  }
  session.destroy();
};

export default {
  login,
  getCurrentUser,
  loginGithub,
  logout,
};
