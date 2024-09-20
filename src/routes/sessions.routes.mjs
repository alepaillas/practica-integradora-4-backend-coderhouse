import { Router } from "express";
import passport from "passport";
import {
  passportCall,
  authorization,
} from "../middlewares/passport.middleware.mjs";
import sessionsControllers from "../controllers/sessions.controllers.mjs";
import usersControllers from "../controllers/users.controllers.mjs";

const router = Router();

router.post(
  "/register",
  passportCall("register"),
  sessionsControllers.register,
);

router.post("/login", passportCall("login"), sessionsControllers.login);

router.get(
  "/github",
  passport.authenticate("github"),
  sessionsControllers.loginGithub,
);

router.get(
  "/githubCallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    if (req.user) {
      req.session.user = req.user;
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  },
);

router.get(
  "/current",
  passportCall("jwt"),
  authorization("user"),
  sessionsControllers.current,
);

router.post("/logout", sessionsControllers.logout);

router.get(
  "/generatePasswordResetToken",
  passportCall("jwt"),
  authorization("admin"),
  usersControllers.generatePasswordResetToken,
);

router.post("/updatePassword", usersControllers.updatePassword);

export default router;
