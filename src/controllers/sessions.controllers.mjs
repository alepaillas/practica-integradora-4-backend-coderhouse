import sessionServices from "../services/sessions.services.mjs";
import envConfig from "../config/env.config.mjs";

const COOKIE_TOKEN = envConfig.COOKIE_TOKEN;

const register = async (req, res) => {
  try {
    res.status(201).json({ status: "success", msg: "Usuario Creado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal Server Error" });
  }
};

const login = async (req, res, next) => {
  try {
    const { user, token } = await sessionServices.login(req.user);
    res.cookie(COOKIE_TOKEN, token, { httpOnly: true });
    req.session.user = user;
    res.status(200).json({ status: "success", payload: user, token });
  } catch (error) {
    next(error);
  }
};

const current = (req, res, next) => {
  try {
    const jwtDTO = sessionServices.getCurrentUser(req.user);
    res.status(200).json({ status: "success", payload: jwtDTO });
  } catch (error) {
    next(error);
  }
};

const loginGithub = async (req, res, next) => {
  try {
    const user = await sessionServices.loginGithub(req.user);
    res.status(200).json({ status: "success", payload: user });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await sessionServices.logout(req.session);
    res
      .status(200)
      .json({ status: "success", msg: "Sesión cerrada con éxito" });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  current,
  loginGithub,
  logout,
};
