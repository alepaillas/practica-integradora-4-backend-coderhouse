import customErrors from "../errors/customErrors.mjs";
import usersServices from "../services/users.services.mjs";

const getAll = async (req, res, next) => {
  try {
    const users = await usersServices.getAll();
    res.status(200).json({ status: "success", payload: users });
  } catch (error) {
    next(error);
  }
};

const createMockUsers = async (req, res, next) => {
  try {
    const { amount } = req.query; // Get the amount from query parameters
    const users = await usersServices.createMockUsers(
      parseInt(amount, 10) || 5,
    ); // Default to 5 if not provided
    res.status(200).json({ status: "success", users });
  } catch (error) {
    next(error);
  }
};

const generatePasswordResetToken = async (req, res, next) => {
  try {
    const { email } = req.body;
    const token = await usersServices.generatePasswordResetToken(email);
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
    const verifiedToken = usersServices.verifyPasswordResetToken(token);
    //console.log(verifiedToken);
    await usersServices.updatePassword(email, newPassword);
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
    const response = await usersServices.changeUserRole(uid);
    res.status(200).json({ status: "ok", response });
  } catch (error) {
    next(error);
  }
};

const addDocuments = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const files = req.files;
    const response = await usersServices.addDocuments(uid, files);
    res.status(200).json({ status: "ok", response });
  } catch (error) {
    error.path = "[GET] /api/user/:uid/documents";
    next(error);
  }
};

export default {
  getAll,
  createMockUsers,
  generatePasswordResetToken,
  updatePassword,
  changeUserRole,
  addDocuments,
};
