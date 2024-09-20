import customErrors from "../errors/customErrors.mjs";
import userServices from "../services/users.services.mjs";

const createMockUsers = async (req, res, next) => {
  try {
    const { amount } = req.query; // Get the amount from query parameters
    const users = await userServices.createMockUsers(parseInt(amount, 10) || 5); // Default to 5 if not provided
    res.status(200).json({ status: "success", users });
  } catch (error) {
    next(error);
  }
};

const generatePasswordResetToken = async (req, res, next) => {
  try {
    const { email } = req.body;
    const token = await userServices.generatePasswordResetToken(email);
    res.status(200).json({ status: "success", token });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { email, newPassword, token } = req.body;
    if (!token) {
      throw customErrors.badRequestError(
        "Must provide a password reset token.",
      );
    }
    const verifiedToken = userServices.verifyPasswordResetToken(token);
    //console.log(verifiedToken);
    await userServices.updatePassword(email, newPassword);
    res
      .status(200)
      .json({ status: "success", message: "Password updated succesfully." });
  } catch (error) {
    next(error);
  }
};

const changeUserRole = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const response = await userServices.changeUserRole(uid);
    res.status(200).json({ status: "ok", response });
  } catch (error) {
    next(error);
  }
};

export default {
  createMockUsers, // Add the new function to the exported object
  generatePasswordResetToken,
  updatePassword,
  changeUserRole,
};
